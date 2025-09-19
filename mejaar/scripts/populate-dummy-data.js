// POPULATE FIRESTORE WITH COMPREHENSIVE DUMMY DATA
// ===============================================
// This script adds realistic restaurant and menu data with network images and 3D models

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';

// Firebase configuration - Updated to match .env file
const firebaseConfig = {
  apiKey: "AIzaSyDYrE6RE9wzG33p3aAlmv4QReFdxn_zRKQ",
  authDomain: "mejaar-app.firebaseapp.com",
  projectId: "mejaar-app",
  storageBucket: "mejaar-app.firebasestorage.app",
  messagingSenderId: "881726352245",
  appId: "1:881726352245:web:c9efd1db6816af20e8013c",
  measurementId: "G-Q13TMJG460"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// High-quality food images from Unsplash
const FOOD_IMAGES = {
  // Indian Cuisine
  butterChicken: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop&auto=format',
  biryani: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop&auto=format',
  paneerMakhani: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&auto=format',
  masalaDosa: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop&auto=format',
  tandooriChicken: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&h=600&fit=crop&auto=format',
  palakPaneer: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&auto=format',
  chettinadChicken: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=800&h=600&fit=crop&auto=format',
  gulabJamun: 'https://images.unsplash.com/photo-1571167781034-4be0c8d91030?w=800&h=600&fit=crop&auto=format',
  
  // Italian Cuisine
  margheritaPizza: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&h=600&fit=crop&auto=format',
  carbonara: 'https://images.unsplash.com/photo-1588013273468-315900bafd4d?w=800&h=600&fit=crop&auto=format',
  lasagna: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&auto=format',
  risotto: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop&auto=format',
  tiramisu: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop&auto=format',
  ossobuco: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop&auto=format',
  
  // American Cuisine
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&auto=format',
  friedChicken: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&h=600&fit=crop&auto=format',
  bbqRibs: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop&auto=format',
  macAndCheese: 'https://images.unsplash.com/photo-1543573040-4e0b1c3ae5de?w=800&h=600&fit=crop&auto=format',
  cheesecake: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=800&h=600&fit=crop&auto=format',
  
  // Asian Cuisine
  sushi: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&auto=format',
  ramen: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop&auto=format',
  padThai: 'https://images.unsplash.com/photo-1559314809-0f31657e3364?w=800&h=600&fit=crop&auto=format',
  dimSum: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&h=600&fit=crop&auto=format'
};

// Restaurant logos from Unsplash
const RESTAURANT_LOGOS = {
  indian: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop&auto=format',
  italian: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop&auto=format',
  american: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=300&h=300&fit=crop&auto=format',
  asian: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=300&fit=crop&auto=format'
};

// Working 3D models for AR viewing
const AR_MODELS = {
  food1: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
  food2: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  food3: 'https://modelviewer.dev/shared-assets/models/shishkebab.glb',
  food4: 'https://cdn.glitch.me/36cb8393-65c6-408d-a538-055ada20431b/Avocado.glb',
  food5: 'https://cdn.glitch.me/36cb8393-65c6-408d-a538-055ada20431b/Mixer.glb'
};

// Sample restaurants data
const RESTAURANTS = [
  {
    id: 'mejar-demo-restaurant',
    data: {
      restaurantId: 'mejar-demo-restaurant',
      name: 'MejaAR Demo Restaurant',
      description: 'Experience food in Augmented Reality - powered by MejaAR platform',
      logoPath: RESTAURANT_LOGOS.american,
      primaryColor: '#FF6B35',
      accentColor: '#4ECDC4',
      isActive: true,
      createdAt: serverTimestamp()
    }
  },
  {
    id: 'the-spice-garden',
    data: {
      restaurantId: 'the-spice-garden',
      name: 'The Spice Garden',
      description: 'Authentic Indian cuisine with traditional spices and modern AR experience',
      logoPath: RESTAURANT_LOGOS.indian,
      primaryColor: '#FF6B35',
      accentColor: '#4ECDC4',
      isActive: true,
      createdAt: serverTimestamp()
    }
  },
  {
    id: 'bella-italia',
    data: {
      restaurantId: 'bella-italia',
      name: 'Bella Italia',
      description: 'Traditional Italian recipes with AR visualization technology',
      logoPath: RESTAURANT_LOGOS.italian,
      primaryColor: '#FF6B35',
      accentColor: '#4ECDC4',
      isActive: true,
      createdAt: serverTimestamp()
    }
  },
  {
    id: 'taste-of-america',
    data: {
      restaurantId: 'taste-of-america',
      name: 'Taste of America',
      description: 'Classic American comfort food with AR menu experience',
      logoPath: RESTAURANT_LOGOS.american,
      primaryColor: '#FF6B35',
      accentColor: '#4ECDC4',
      isActive: true,
      createdAt: serverTimestamp()
    }
  },
  {
    id: 'asian-fusion',
    data: {
      restaurantId: 'asian-fusion',
      name: 'Asian Fusion',
      description: 'Modern Asian cuisine with traditional flavors and AR presentation',
      logoPath: RESTAURANT_LOGOS.asian,
      primaryColor: '#FF6B35',
      accentColor: '#4ECDC4',
      isActive: true,
      createdAt: serverTimestamp()
    }
  }
];

// Sample menu items data
const MENU_ITEMS = [
  // MejaAR Demo Restaurant - Mixed Cuisine
  {
    restaurantId: 'mejar-demo-restaurant',
    name: 'Gourmet Angus Burger',
    description: 'A juicy, flame-grilled Angus beef patty with fresh lettuce, tomatoes, and our secret sauce on a brioche bun.',
    price: 1499, // $14.99 in cents
    category: 'Main Course',
    imagePath: FOOD_IMAGES.burger,
    modelPath: AR_MODELS.food1,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'mejar-demo-restaurant',
    name: 'Classic Margherita Pizza',
    description: 'Hand-tossed dough with rich tomato base, fresh mozzarella cheese, and aromatic basil leaves.',
    price: 1850, // $18.50 in cents
    category: 'Pizza',
    imagePath: FOOD_IMAGES.margheritaPizza,
    modelPath: AR_MODELS.food2,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'mejar-demo-restaurant',
    name: 'Butter Chicken Deluxe',
    description: 'Tender chicken pieces in a rich, creamy tomato-based sauce with aromatic Indian spices.',
    price: 1975, // $19.75 in cents
    category: 'Indian',
    imagePath: FOOD_IMAGES.butterChicken,
    modelPath: AR_MODELS.food3,
    isAvailable: true,
    createdAt: serverTimestamp()
  },

  // The Spice Garden - Indian Restaurant
  {
    restaurantId: 'the-spice-garden',
    name: 'Butter Chicken',
    description: 'Tender chicken pieces in a rich, creamy tomato-based sauce with aromatic spices. Served with basmati rice.',
    price: 38000, // ₹380 in paise
    category: 'North Indian',
    imagePath: FOOD_IMAGES.butterChicken,
    modelPath: AR_MODELS.food1,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'the-spice-garden',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice layered with marinated chicken, fried onions, and aromatic spices. Served with raita.',
    price: 42000, // ₹420 in paise
    category: 'Biryani',
    imagePath: FOOD_IMAGES.biryani,
    modelPath: AR_MODELS.food2,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'the-spice-garden',
    name: 'Paneer Makhani',
    description: 'Soft cottage cheese cubes in a creamy tomato curry with cashews and aromatic spices.',
    price: 32000, // ₹320 in paise
    category: 'North Indian',
    imagePath: FOOD_IMAGES.paneerMakhani,
    modelPath: AR_MODELS.food3,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'the-spice-garden',
    name: 'Masala Dosa',
    description: 'Crispy fermented crepe filled with spiced potato curry. Served with coconut chutney and sambar.',
    price: 18000, // ₹180 in paise
    category: 'South Indian',
    imagePath: FOOD_IMAGES.masalaDosa,
    modelPath: AR_MODELS.food4,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'the-spice-garden',
    name: 'Tandoori Chicken',
    description: 'Half chicken marinated in yogurt and spices, cooked in a traditional clay oven.',
    price: 45000, // ₹450 in paise
    category: 'Tandoori',
    imagePath: FOOD_IMAGES.tandooriChicken,
    modelPath: AR_MODELS.food5,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'the-spice-garden',
    name: 'Palak Paneer',
    description: 'Fresh cottage cheese cubes in a creamy spinach curry with aromatic spices.',
    price: 30000, // ₹300 in paise
    category: 'North Indian',
    imagePath: FOOD_IMAGES.palakPaneer,
    modelPath: AR_MODELS.food1,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'the-spice-garden',
    name: 'Chettinad Chicken',
    description: 'Spicy South Indian chicken curry with a blend of aromatic spices and coconut.',
    price: 36000, // ₹360 in paise
    category: 'South Indian',
    imagePath: FOOD_IMAGES.chettinadChicken,
    modelPath: AR_MODELS.food2,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'the-spice-garden',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings deep-fried and soaked in sugar syrup flavored with cardamom.',
    price: 12000, // ₹120 in paise
    category: 'Desserts',
    imagePath: FOOD_IMAGES.gulabJamun,
    modelPath: AR_MODELS.food3,
    isAvailable: true,
    createdAt: serverTimestamp()
  },

  // Bella Italia - Italian Restaurant
  {
    restaurantId: 'bella-italia',
    name: 'Margherita Pizza',
    description: 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil.',
    price: 35000, // ₹350 in paise
    category: 'Pizza',
    imagePath: FOOD_IMAGES.margheritaPizza,
    modelPath: AR_MODELS.food1,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'bella-italia',
    name: 'Spaghetti Carbonara',
    description: 'Traditional Roman pasta with eggs, pecorino cheese, pancetta, and black pepper.',
    price: 32000, // ₹320 in paise
    category: 'Pasta',
    imagePath: FOOD_IMAGES.carbonara,
    modelPath: AR_MODELS.food2,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'bella-italia',
    name: 'Lasagna Bolognese',
    description: 'Layered pasta with rich meat sauce, béchamel, and melted mozzarella cheese.',
    price: 38000, // ₹380 in paise
    category: 'Pasta',
    imagePath: FOOD_IMAGES.lasagna,
    modelPath: AR_MODELS.food3,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'bella-italia',
    name: 'Mushroom Risotto',
    description: 'Creamy Arborio rice with mixed mushrooms, white wine, and Parmesan cheese.',
    price: 34000, // ₹340 in paise
    category: 'Risotto',
    imagePath: FOOD_IMAGES.risotto,
    modelPath: AR_MODELS.food4,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'bella-italia',
    name: 'Osso Buco',
    description: 'Braised veal shanks with vegetables, white wine, and broth. Served with saffron risotto.',
    price: 65000, // ₹650 in paise
    category: 'Main Course',
    imagePath: FOOD_IMAGES.ossobuco,
    modelPath: AR_MODELS.food5,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'bella-italia',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.',
    price: 18000, // ₹180 in paise
    category: 'Desserts',
    imagePath: FOOD_IMAGES.tiramisu,
    modelPath: AR_MODELS.food1,
    isAvailable: true,
    createdAt: serverTimestamp()
  },

  // Taste of America - American Restaurant
  {
    restaurantId: 'taste-of-america',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with American cheese, lettuce, tomato, and special sauce.',
    price: 28000, // ₹280 in paise
    category: 'Burgers',
    imagePath: FOOD_IMAGES.burger,
    modelPath: AR_MODELS.food1,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'taste-of-america',
    name: 'Southern Fried Chicken',
    description: 'Crispy fried chicken with secret spice blend. Served with mashed potatoes.',
    price: 32000, // ₹320 in paise
    category: 'Main Course',
    imagePath: FOOD_IMAGES.friedChicken,
    modelPath: AR_MODELS.food2,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'taste-of-america',
    name: 'BBQ Ribs',
    description: 'Slow-cooked pork ribs with smoky BBQ sauce. Served with coleslaw and fries.',
    price: 45000, // ₹450 in paise
    category: 'BBQ',
    imagePath: FOOD_IMAGES.bbqRibs,
    modelPath: AR_MODELS.food3,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'taste-of-america',
    name: 'Mac and Cheese',
    description: 'Creamy macaroni pasta with three cheese blend and crispy breadcrumb topping.',
    price: 22000, // ₹220 in paise
    category: 'Sides',
    imagePath: FOOD_IMAGES.macAndCheese,
    modelPath: AR_MODELS.food4,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'taste-of-america',
    name: 'New York Cheesecake',
    description: 'Rich and creamy cheesecake with graham cracker crust and berry compote.',
    price: 16000, // ₹160 in paise
    category: 'Desserts',
    imagePath: FOOD_IMAGES.cheesecake,
    modelPath: AR_MODELS.food5,
    isAvailable: true,
    createdAt: serverTimestamp()
  },

  // Asian Fusion - Asian Restaurant
  {
    restaurantId: 'asian-fusion',
    name: 'Salmon Sushi Platter',
    description: 'Fresh salmon sushi and sashimi with wasabi, pickled ginger, and soy sauce.',
    price: 42000, // ₹420 in paise
    category: 'Sushi',
    imagePath: FOOD_IMAGES.sushi,
    modelPath: AR_MODELS.food1,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'asian-fusion',
    name: 'Tonkotsu Ramen',
    description: 'Rich pork bone broth with fresh ramen noodles, chashu pork, and soft-boiled egg.',
    price: 28000, // ₹280 in paise
    category: 'Ramen',
    imagePath: FOOD_IMAGES.ramen,
    modelPath: AR_MODELS.food2,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'asian-fusion',
    name: 'Pad Thai',
    description: 'Traditional Thai stir-fried noodles with shrimp, tofu, bean sprouts, and peanuts.',
    price: 26000, // ₹260 in paise
    category: 'Thai',
    imagePath: FOOD_IMAGES.padThai,
    modelPath: AR_MODELS.food3,
    isAvailable: true,
    createdAt: serverTimestamp()
  },
  {
    restaurantId: 'asian-fusion',
    name: 'Dim Sum Platter',
    description: 'Assorted steamed dumplings with pork, shrimp, and vegetables. Served with dipping sauce.',
    price: 35000, // ₹350 in paise
    category: 'Dim Sum',
    imagePath: FOOD_IMAGES.dimSum,
    modelPath: AR_MODELS.food4,
    isAvailable: true,
    createdAt: serverTimestamp()
  }
];

async function populateDatabase() {
  try {
    console.log('🔥 Starting MejaAR database population...');
    console.log('======================================');
    
    // Create batches for efficient writes
    const restaurantBatch = writeBatch(db);
    const menuBatch = writeBatch(db);
    
    console.log('🏪 Adding restaurants...');
    
    // Add restaurants
    RESTAURANTS.forEach(restaurant => {
      const restaurantRef = doc(db, 'restaurants', restaurant.id);
      restaurantBatch.set(restaurantRef, restaurant.data);
      console.log(`  ✅ ${restaurant.data.name}`);
    });
    
    // Commit restaurant batch
    await restaurantBatch.commit();
    console.log(`✅ Successfully added ${RESTAURANTS.length} restaurants!`);
    
    console.log('\n🍽️ Adding menu items...');
    
    // Add menu items in smaller batches (Firestore has 500 operation limit per batch)
    const batchSize = 50;
    let currentBatch = writeBatch(db);
    let operationCount = 0;
    let itemCount = 0;
    
    for (const item of MENU_ITEMS) {
      const itemRef = doc(collection(db, 'menuItems'));
      currentBatch.set(itemRef, {
        ...item,
        createdAt: serverTimestamp()
      });
      
      operationCount++;
      itemCount++;
      
      console.log(`  ✅ ${item.name} (${item.restaurantId})`);
      
      // Commit batch when reaching batch size limit
      if (operationCount >= batchSize) {
        await currentBatch.commit();
        console.log(`  📦 Committed batch of ${operationCount} items`);
        currentBatch = writeBatch(db);
        operationCount = 0;
      }
    }
    
    // Commit remaining items
    if (operationCount > 0) {
      await currentBatch.commit();
      console.log(`  📦 Committed final batch of ${operationCount} items`);
    }
    
    console.log(`✅ Successfully added ${itemCount} menu items!`);
    
    console.log('\n🎉 DATABASE POPULATION COMPLETE!');
    console.log('================================');
    console.log('');
    console.log('🚀 Your MejaAR restaurants are ready:');
    console.log('');
    console.log('📱 Test URLs:');
    console.log('  • Demo Restaurant: http://localhost:5174/mejar-demo-restaurant');
    console.log('  • The Spice Garden: http://localhost:5174/the-spice-garden');
    console.log('  • Bella Italia: http://localhost:5174/bella-italia');
    console.log('  • Taste of America: http://localhost:5174/taste-of-america');
    console.log('  • Asian Fusion: http://localhost:5174/asian-fusion');
    console.log('');
    console.log('✨ Features included:');
    console.log('  ✅ High-quality Unsplash food images');
    console.log('  ✅ Working 3D models for AR viewing');
    console.log('  ✅ Multiple cuisines (Indian, Italian, American, Asian)');
    console.log('  ✅ Realistic pricing (₹ and $ support)');
    console.log('  ✅ Detailed food descriptions');
    console.log('  ✅ Category organization');
    console.log('  ✅ Restaurant branding');
    console.log('');
    console.log('🔄 Refresh your app to see the new data!');
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    
    if (error.code === 'permission-denied') {
      console.log('');
      console.log('🔧 PERMISSION ERROR - Try these fixes:');
      console.log('1. Check Firestore Rules in Firebase Console');
      console.log('2. Set rules to allow writes for testing:');
      console.log('   allow read, write: if true;');
      console.log('3. Wait 2-3 minutes for rules to propagate');
      console.log('4. Run the script again');
    }
    
    process.exit(1);
  }
}

// Run the population script
populateDatabase();
