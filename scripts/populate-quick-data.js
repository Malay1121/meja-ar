const admin = require('firebase-admin');

// Initialize Firebase Admin (make sure service account key is set up)
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

async function populateQuickData() {
  console.log('🚀 Populating Firebase with basic restaurant data...');

  try {
    // Create The Spice Garden restaurant
    const restaurantData = {
      id: 'the-spice-garden',
      name: 'The Spice Garden',
      description: 'Authentic Indian cuisine with traditional spices and flavors',
      cuisineType: 'Indian',
      location: {
        address: '123 Spice Street, Mumbai',
        coordinates: {
          lat: 19.0760,
          lng: 72.8777
        }
      },
      contact: {
        phone: '+91 98765 43210',
        email: 'info@spicegarden.com'
      },
      settings: {
        arEnabled: true,
        allowOrdering: true,
        currency: 'INR'
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add restaurant document
    await db.collection('restaurants').doc('the-spice-garden').set(restaurantData);
    console.log('✅ Restaurant "The Spice Garden" created');

    // Add basic categories
    const categories = [
      {
        id: 'appetizers',
        name: 'Appetizers',
        description: 'Start your meal with our delicious appetizers',
        displayOrder: 1,
        isActive: true,
        restaurantId: 'the-spice-garden'
      },
      {
        id: 'main-course',
        name: 'Main Course',
        description: 'Our signature main dishes',
        displayOrder: 2,
        isActive: true,
        restaurantId: 'the-spice-garden'
      },
      {
        id: 'beverages',
        name: 'Beverages',
        description: 'Refreshing drinks to complement your meal',
        displayOrder: 3,
        isActive: true,
        restaurantId: 'the-spice-garden'
      },
      {
        id: 'desserts',
        name: 'Desserts',
        description: 'Sweet endings to your dining experience',
        displayOrder: 4,
        isActive: true,
        restaurantId: 'the-spice-garden'
      }
    ];

    for (const category of categories) {
      await db.collection('restaurants').doc('the-spice-garden')
        .collection('categories').doc(category.id).set(category);
    }
    console.log('✅ Categories created');

    // Add sample menu items
    const menuItems = [
      {
        id: 'samosa',
        name: 'Vegetable Samosa',
        description: 'Crispy pastry filled with spiced vegetables',
        price: 120,
        categoryId: 'appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
        isActive: true,
        isVegetarian: true,
        restaurantId: 'the-spice-garden',
        arModel: {
          enabled: true,
          modelUrl: 'models/samosa.glb'
        }
      },
      {
        id: 'butter-chicken',
        name: 'Butter Chicken',
        description: 'Tender chicken in rich tomato and butter sauce',
        price: 450,
        categoryId: 'main-course',
        imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300',
        isActive: true,
        isVegetarian: false,
        restaurantId: 'the-spice-garden',
        arModel: {
          enabled: true,
          modelUrl: 'models/butter-chicken.glb'
        }
      },
      {
        id: 'dal-makhani',
        name: 'Dal Makhani',
        description: 'Rich and creamy black lentils cooked overnight',
        price: 320,
        categoryId: 'main-course',
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300',
        isActive: true,
        isVegetarian: true,
        restaurantId: 'the-spice-garden',
        arModel: {
          enabled: true,
          modelUrl: 'models/dal-makhani.glb'
        }
      },
      {
        id: 'mango-lassi',
        name: 'Mango Lassi',
        description: 'Traditional yogurt drink with fresh mango',
        price: 150,
        categoryId: 'beverages',
        imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300',
        isActive: true,
        isVegetarian: true,
        restaurantId: 'the-spice-garden'
      },
      {
        id: 'gulab-jamun',
        name: 'Gulab Jamun',
        description: 'Soft milk dumplings in rose-flavored syrup',
        price: 180,
        categoryId: 'desserts',
        imageUrl: 'https://images.unsplash.com/photo-1571091653491-4bdd5c4cb73d?w=300',
        isActive: true,
        isVegetarian: true,
        restaurantId: 'the-spice-garden'
      },
      {
        id: 'biryani',
        name: 'Chicken Biryani',
        description: 'Fragrant basmati rice with spiced chicken',
        price: 520,
        categoryId: 'main-course',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d2a9?w=300',
        isActive: true,
        isVegetarian: false,
        restaurantId: 'the-spice-garden',
        arModel: {
          enabled: true,
          modelUrl: 'models/biryani.glb'
        }
      }
    ];

    for (const item of menuItems) {
      await db.collection('restaurants').doc('the-spice-garden')
        .collection('menuItems').doc(item.id).set(item);
    }
    console.log('✅ Menu items created');

    console.log('\n🎉 Quick data population completed!');
    console.log('Dashboard should now show:');
    console.log('- Restaurant Name: The Spice Garden');
    console.log('- Cuisine Type: Indian');
    console.log('- Categories: 4');
    console.log('- Menu Items: 6');
    
  } catch (error) {
    console.error('❌ Error populating data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  populateQuickData().then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { populateQuickData };