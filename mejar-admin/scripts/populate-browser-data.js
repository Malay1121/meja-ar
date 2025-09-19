// Simple script to run in browser console to populate Firebase with sample data
// This should be run from the admin panel page where Firebase is already initialized

const populateFirebaseData = async () => {
  try {
    // Get Firebase services from the page context
    const { db } = await import('/src/lib/firebase.ts')
    const { doc, setDoc, collection } = await import('firebase/firestore')
    
    console.log('🌱 Starting to populate Firebase with sample data...')

    // Restaurant data for "the-spice-garden"
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
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Categories data
    const categories = [
      { id: "starters", name: "Starters", description: "Delicious appetizers", order: 1, isActive: true },
      { id: "mains", name: "Main Course", description: "Hearty main dishes", order: 2, isActive: true },
      { id: "desserts", name: "Desserts", description: "Sweet treats", order: 3, isActive: true },
      { id: "beverages", name: "Beverages", description: "Refreshing drinks", order: 4, isActive: true }
    ]

    // Menu items data
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
        id: "palak-paneer",
        name: "Palak Paneer",
        description: "Cottage cheese in spinach gravy",
        price: 320,
        category: "mains",
        isVegetarian: true,
        isAvailable: true,
        popularity: 80
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
      },
      {
        id: "mango-lassi",
        name: "Mango Lassi",
        description: "Yogurt drink with fresh mango",
        price: 180,
        category: "beverages",
        isVegetarian: true,
        isAvailable: true,
        popularity: 75
      },
      {
        id: "masala-chai",
        name: "Masala Chai",
        description: "Traditional spiced tea",
        price: 80,
        category: "beverages",
        isVegetarian: true,
        isAvailable: true,
        popularity: 90
      }
    ]

    // Add restaurant data
    await setDoc(doc(db, 'restaurants', 'the-spice-garden'), restaurantData)
    console.log('✅ Restaurant data added')

    // Add categories
    for (const category of categories) {
      await setDoc(doc(db, 'restaurants', 'the-spice-garden', 'categories', category.id), category)
    }
    console.log('✅ Categories added')

    // Add menu items
    for (const item of menuItems) {
      await setDoc(doc(db, 'restaurants', 'the-spice-garden', 'menuItems', item.id), item)
    }
    console.log('✅ Menu items added')

    console.log('🎉 Sample data populated successfully!')
    console.log(`📊 Added: ${categories.length} categories, ${menuItems.length} menu items`)
    
    // Refresh the page to see new data
    window.location.reload()
    
  } catch (error) {
    console.error('❌ Error populating data:', error)
  }
}

// Run the function
populateFirebaseData()

// Instructions for user:
console.log(`
📝 To populate Firebase with sample data:
1. Open browser developer tools (F12)
2. Go to Console tab  
3. Copy and paste this entire script
4. Press Enter to run
5. Wait for success messages
6. Page will refresh automatically with real data
`)

export { populateFirebaseData }