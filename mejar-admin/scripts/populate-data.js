const admin = require('firebase-admin');

// Initialize Firebase Admin (make sure you have the service account key)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Or use: admin.credential.cert(require('./path-to-service-account.json'))
  });
}

const db = admin.firestore();

// Sample data for "the-spice-garden" restaurant
const restaurantData = {
  name: "The Spice Garden",
  description: "Authentic Indian cuisine with traditional spices and flavors",
  cuisineType: "Indian",
  location: {
    address: "123 Curry Lane",
    city: "Mumbai", 
    state: "Maharashtra",
    zipCode: "400001"
  },
  contact: {
    phone: "+91-98765-43210",
    email: "info@spicegarden.com"
  },
  isActive: true,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

const categories = [
  {
    id: "starters",
    name: "Starters", 
    description: "Delicious appetizers",
    order: 1,
    isActive: true
  },
  {
    id: "mains",
    name: "Main Course",
    description: "Hearty main dishes", 
    order: 2,
    isActive: true
  },
  {
    id: "desserts", 
    name: "Desserts",
    description: "Sweet treats",
    order: 3,
    isActive: true
  }
];

const menuItems = [
  {
    id: "samosa",
    name: "Vegetable Samosa",
    description: "Crispy pastry with spiced vegetables",
    price: 120,
    category: "starters",
    isVegetarian: true,
    isAvailable: true,
    popularity: 85
  },
  {
    id: "butter-chicken", 
    name: "Butter Chicken",
    description: "Tender chicken in rich tomato sauce",
    price: 380,
    category: "mains", 
    isVegetarian: false,
    isAvailable: true,
    popularity: 95
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun", 
    description: "Sweet milk dumplings in syrup",
    price: 150,
    category: "desserts",
    isVegetarian: true, 
    isAvailable: true,
    popularity: 70
  }
];

async function populateData() {
  try {
    console.log('🌱 Populating sample data...');

    // Add restaurant data
    await db.collection('restaurants').doc('the-spice-garden').set(restaurantData);
    console.log('✅ Restaurant data added');

    // Add categories
    const batch = db.batch();
    categories.forEach(category => {
      const ref = db.collection('restaurants').doc('the-spice-garden').collection('categories').doc(category.id);
      batch.set(ref, category);
    });
    await batch.commit();
    console.log('✅ Categories added');

    // Add menu items  
    const itemsBatch = db.batch();
    menuItems.forEach(item => {
      const ref = db.collection('restaurants').doc('the-spice-garden').collection('menuItems').doc(item.id);
      itemsBatch.set(ref, item);
    });
    await itemsBatch.commit();
    console.log('✅ Menu items added');

    console.log('🎉 Sample data populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

populateData();