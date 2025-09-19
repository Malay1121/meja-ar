const admin = require('firebase-admin');

// Initialize Firebase Admin
try {
  if (!admin.apps.length) {
    const serviceAccount = require('../service-account-key.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = admin.firestore();

async function checkFirebaseData() {
  console.log('🔍 Checking Firebase data...\n');

  try {
    // Check if the restaurant exists
    const restaurantRef = db.collection('restaurants').doc('the-spice-garden');
    const restaurantDoc = await restaurantRef.get();

    if (restaurantDoc.exists) {
      console.log('✅ Restaurant "the-spice-garden" exists in Firebase');
      console.log('📋 Restaurant data:');
      console.log(JSON.stringify(restaurantDoc.data(), null, 2));
    } else {
      console.log('❌ Restaurant "the-spice-garden" does NOT exist in Firebase');
    }

    console.log('\n🔍 Checking categories...');
    const categoriesSnapshot = await restaurantRef.collection('categories').get();
    console.log(`📊 Found ${categoriesSnapshot.size} categories`);

    console.log('\n🔍 Checking menu items...');
    const menuItemsSnapshot = await restaurantRef.collection('menuItems').get();
    console.log(`🍽️ Found ${menuItemsSnapshot.size} menu items`);

    // Test the exact query our dashboard service uses
    console.log('\n🧪 Testing dashboard service query...');
    const dashboardData = {
      restaurantInfo: restaurantDoc.exists ? {
        name: restaurantDoc.data()?.name || 'Unknown',
        cuisineType: restaurantDoc.data()?.cuisineType || 'Unknown'
      } : null,
      totalCategories: categoriesSnapshot.size,
      totalMenuItems: menuItemsSnapshot.size,
      activeMenuItems: menuItemsSnapshot.docs.filter(doc => doc.data().isActive !== false).length
    };

    console.log('📊 Dashboard data that would be returned:');
    console.log(JSON.stringify(dashboardData, null, 2));

  } catch (error) {
    console.error('❌ Error checking Firebase data:', error);
  }
}

// Run the check
checkFirebaseData().then(() => {
  console.log('\n✅ Check completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Check failed:', error);
  process.exit(1);
});