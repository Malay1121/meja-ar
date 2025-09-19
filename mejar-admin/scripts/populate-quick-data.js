// Run this script: node scripts/populate-quick-data.js
const admin = require('firebase-admin')
const path = require('path')

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'service-account-key.json')

if (!admin.apps.length) {
  try {
    const serviceAccount = require(serviceAccountPath)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    console.log('✅ Firebase Admin initialized')
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message)
    console.log('⚠️  Make sure service-account-key.json exists in the root directory')
    process.exit(1)
  }
}

const db = admin.firestore()

async function populateQuickData() {
  try {
    console.log('🌱 Populating quick sample data...')

    // Basic restaurant data
    const restaurantData = {
      name: "The Spice Garden",
      cuisineType: "Indian",
      description: "Authentic Indian cuisine",
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }

    // Simple categories
    const categories = [
      { name: "Starters", order: 1, isActive: true },
      { name: "Main Course", order: 2, isActive: true },
      { name: "Desserts", order: 3, isActive: true },
      { name: "Beverages", order: 4, isActive: true }
    ]

    // Simple menu items
    const menuItems = [
      { name: "Samosa", price: 120, category: "starters", isAvailable: true },
      { name: "Butter Chicken", price: 380, category: "mains", isAvailable: true },
      { name: "Palak Paneer", price: 320, category: "mains", isAvailable: true },
      { name: "Biryani", price: 420, category: "mains", isAvailable: true },
      { name: "Gulab Jamun", price: 150, category: "desserts", isAvailable: true },
      { name: "Mango Lassi", price: 180, category: "beverages", isAvailable: true }
    ]

    // Add restaurant
    await db.collection('restaurants').doc('the-spice-garden').set(restaurantData)
    console.log('✅ Restaurant added')

    // Add categories with auto-generated IDs
    for (let i = 0; i < categories.length; i++) {
      await db.collection('restaurants').doc('the-spice-garden').collection('categories').add(categories[i])
    }
    console.log(`✅ ${categories.length} categories added`)

    // Add menu items with auto-generated IDs
    for (let i = 0; i < menuItems.length; i++) {
      await db.collection('restaurants').doc('the-spice-garden').collection('menuItems').add(menuItems[i])
    }
    console.log(`✅ ${menuItems.length} menu items added`)

    console.log('🎉 Quick data population completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

populateQuickData()