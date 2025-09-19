import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch, getDocs, deleteDoc, query, where } from 'firebase/firestore';

// Firebase config (matches .env configuration)
const firebaseConfig = {
  apiKey: "AIzaSyDYrE6RE9wzG33p3aAlmv4QReFdxn_zRKQ",
  authDomain: "mejaar-app.firebaseapp.com",
  projectId: "mejaar-app",
  storageBucket: "mejaar-app.firebasestorage.app",
  messagingSenderId: "881726352245",
  appId: "1:881726352245:web:c9efd1db6816af20e8013c",
  measurementId: "G-Q13TMJG460"
};

console.log('🔄 MIGRATING TO NESTED STRUCTURE:');
console.log('- Converting from: database > restaurants, categories, menuItems');
console.log('- Converting to: database > restaurants > {restaurantId} > categories, menuItems');
console.log('');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateToNestedStructure() {
  try {
    console.log('🔍 Checking existing data structure...');
    
    // Get all existing data
    const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const menuItemsSnapshot = await getDocs(collection(db, 'menuItems'));
    
    const restaurants = [];
    const categories = [];
    const menuItems = [];
    
    // Extract data from existing collections
    restaurantsSnapshot.forEach((doc) => {
      restaurants.push({ id: doc.id, ...doc.data() });
    });
    
    categoriesSnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    
    menuItemsSnapshot.forEach((doc) => {
      menuItems.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`📊 Found existing data:`);
    console.log(`   - ${restaurants.length} restaurants`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${menuItems.length} menu items`);
    
    if (restaurants.length === 0) {
      console.log('⚠️  No restaurants found. Nothing to migrate.');
      return;
    }
    
    // Group data by restaurant
    const restaurantGroups = {};
    
    // Initialize groups for each restaurant
    for (const restaurant of restaurants) {
      const restaurantId = restaurant.restaurantId || restaurant.id;
      restaurantGroups[restaurantId] = {
        restaurant: restaurant,
        categories: [],
        menuItems: []
      };
    }
    
    // Group categories by restaurant
    for (const category of categories) {
      const restaurantId = category.restaurantId;
      if (restaurantGroups[restaurantId]) {
        restaurantGroups[restaurantId].categories.push(category);
      } else {
        console.log(`⚠️  Found category without matching restaurant: ${category.categoryId} -> ${restaurantId}`);
      }
    }
    
    // Group menu items by restaurant
    for (const menuItem of menuItems) {
      const restaurantId = menuItem.restaurantId;
      if (restaurantGroups[restaurantId]) {
        restaurantGroups[restaurantId].menuItems.push(menuItem);
      } else {
        console.log(`⚠️  Found menu item without matching restaurant: ${menuItem.itemId || menuItem.id} -> ${restaurantId}`);
      }
    }
    
    console.log('');
    console.log('🔄 Starting migration to nested structure...');
    
    // Create new nested structure
    const batch = writeBatch(db);
    let operationCount = 0;
    
    for (const [restaurantId, data] of Object.entries(restaurantGroups)) {
      console.log(`🏪 Migrating restaurant: ${restaurantId}`);
      
      // Restaurant document should already exist, but ensure it's properly structured
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      // Don't overwrite restaurant data, it should already be correct
      
      // Migrate categories to subcollection
      console.log(`  📂 Migrating ${data.categories.length} categories...`);
      for (const category of data.categories) {
        const { restaurantId: _, id, ...categoryData } = category;
        const categoryRef = doc(db, 'restaurants', restaurantId, 'categories', category.categoryId || id);
        batch.set(categoryRef, categoryData);
        operationCount++;
      }
      
      // Migrate menu items to subcollection
      console.log(`  🍽️  Migrating ${data.menuItems.length} menu items...`);
      for (const menuItem of data.menuItems) {
        const { restaurantId: _, id, ...itemData } = menuItem;
        const itemRef = doc(db, 'restaurants', restaurantId, 'menuItems', menuItem.itemId || id);
        batch.set(itemRef, itemData);
        operationCount++;
      }
      
      // Commit batch if it gets too large (Firestore limit is 500 operations per batch)
      if (operationCount >= 400) {
        console.log('  💾 Committing batch...');
        await batch.commit();
        const newBatch = writeBatch(db);
        Object.setPrototypeOf(batch, Object.getPrototypeOf(newBatch));
        Object.assign(batch, newBatch);
        operationCount = 0;
      }
    }
    
    // Commit remaining operations
    if (operationCount > 0) {
      console.log('💾 Committing final batch...');
      await batch.commit();
    }
    
    console.log('');
    console.log('✅ Migration to nested structure completed!');
    console.log('');
    console.log('🧹 CLEANING UP OLD COLLECTIONS...');
    console.log('⚠️  This will delete the old root-level categories and menuItems collections.');
    console.log('   The restaurant collection will be preserved.');
    
    // Ask for confirmation before cleanup (in a real scenario, you might want to make this interactive)
    const shouldCleanup = true; // Set to true for automatic cleanup, false to skip
    
    if (shouldCleanup) {
      console.log('🗑️  Deleting old categories collection...');
      for (const doc of categoriesSnapshot.docs) {
        await deleteDoc(doc.ref);
      }
      
      console.log('🗑️  Deleting old menuItems collection...');
      for (const doc of menuItemsSnapshot.docs) {
        await deleteDoc(doc.ref);
      }
      
      console.log('✅ Cleanup completed!');
    } else {
      console.log('⏭️  Skipping cleanup. Old collections remain.');
      console.log('   You can manually delete them later or run this script again.');
    }
    
    console.log('');
    console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('');
    console.log('📊 Final Structure:');
    for (const [restaurantId, data] of Object.entries(restaurantGroups)) {
      console.log(`   📁 restaurants/${restaurantId}/`);
      console.log(`      ├── 📂 categories/ (${data.categories.length} items)`);
      console.log(`      └── 🍽️  menuItems/ (${data.menuItems.length} items)`);
    }
    console.log('');
    console.log('✅ Your database now uses the nested structure!');
    console.log('   restaurants/{restaurantId}/categories/{categoryId}');
    console.log('   restaurants/{restaurantId}/menuItems/{itemId}');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Ensure Firebase is properly configured');
    console.error('   2. Check that you have read/write permissions');
    console.error('   3. Verify that the collections exist');
    console.error('   4. Make sure restaurantId fields are consistent');
    throw error;
  }
}

// Execute the migration
migrateToNestedStructure()
  .then(() => {
    console.log('✅ Migration script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
