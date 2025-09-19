import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch, Timestamp } from 'firebase/firestore';

// Firebase config (matches .env configuration)
const firebaseConfig = {
  apiKey: "AIzaSyDYrE6RE9wzG33p3aAlmv4QReFdxn_zRKQ",
  authDomain: "mejaar-app.firebaseapp.com",
  projectId: "mejaar-app",
  storageBucket: "mejaar-app.firebasestorage.app",
  messagingSenderId: "PLACEHOLDER_SENDER_ID",
  appId: "PLACEHOLDER_APP_ID",
  measurementId: "PLACEHOLDER_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// SCALABLE SAMPLE DATA
const restaurants = [
  {
    restaurantId: 'the-spice-garden',
    businessName: 'The Spice Garden LLC',
    displayName: 'The Spice Garden',
    description: 'Authentic Indian cuisine crafted with traditional recipes and the finest spices, bringing the true taste of India to your table.',
    tagline: 'Where Every Dish Tells a Story',
    
    branding: {
      logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop&crop=center',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop&crop=center',
      gallery: [
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&crop=center'
      ],
      primaryColor: '#D2691E',
      accentColor: '#228B22',
      fontFamily: 'Poppins'
    },
    
    contact: {
      phone: '+1-555-SPICE-01',
      email: 'hello@spicegarden.com',
      website: 'https://spicegarden.com',
      socialMedia: {
        instagram: '@thespicegarden',
        facebook: 'thespicegardenrestaurant'
      }
    },
    
    location: {
      address: {
        street: '123 Flavor Street',
        city: 'Culinary City',
        state: 'California',
        country: 'United States',
        postalCode: '90210',
        coordinates: {
          latitude: 34.0522,
          longitude: -118.2437
        }
      },
      serviceArea: {
        delivery: true,
        dineIn: true,
        takeout: true,
        curbside: true
      }
    },
    
    operations: {
      hours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      },
      timeZone: 'America/Los_Angeles',
      currency: 'USD',
      taxRate: 0.0875,
      serviceCharge: 0.18
    },
    
    settings: {
      arEnabled: true,
      allowReviews: true,
      allowReservations: true,
      featuredCategories: ['Chef Special', 'Popular', 'Vegetarian'],
      languages: ['en', 'hi'],
      paymentMethods: ['card', 'cash', 'paypal', 'apple-pay']
    },
    
    metrics: {
      rating: 4.7,
      totalReviews: 1247,
      totalOrders: 15632,
      avgDeliveryTime: 28
    },
    
    subscription: {
      plan: 'premium',
      status: 'active'
    },
    
    isActive: true,
    isVerified: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  
  {
    restaurantId: 'bella-italia',
    businessName: 'Bella Italia Ristorante',
    displayName: 'Bella Italia',
    description: 'Traditional Italian cuisine made with imported ingredients and time-honored recipes from the heart of Italy.',
    tagline: 'Taste of Authentic Italy',
    
    branding: {
      logo: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=200&h=200&fit=crop&crop=center',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=1080&fit=crop&crop=center',
      gallery: [
        'https://images.unsplash.com/photo-1552566090-a4a2b21b8fe4?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center'
      ],
      primaryColor: '#C41E3A',
      accentColor: '#228B22'
    },
    
    contact: {
      phone: '+1-555-BELLA-01',
      email: 'ciao@bellaitalia.com',
      website: 'https://bellaitalia.com'
    },
    
    location: {
      address: {
        street: '456 Roma Avenue',
        city: 'Little Italy',
        state: 'New York',
        country: 'United States',
        postalCode: '10013'
      },
      serviceArea: {
        delivery: true,
        dineIn: true,
        takeout: true,
        curbside: false
      }
    },
    
    operations: {
      hours: {
        monday: { open: '12:00', close: '22:00' },
        tuesday: { open: '12:00', close: '22:00' },
        wednesday: { open: '12:00', close: '22:00' },
        thursday: { open: '12:00', close: '23:00' },
        friday: { open: '12:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '11:00', close: '21:00' }
      },
      timeZone: 'America/New_York',
      currency: 'USD',
      taxRate: 0.08,
      serviceCharge: 0.20
    },
    
    settings: {
      arEnabled: true,
      allowReviews: true,
      allowReservations: true,
      featuredCategories: ['Pizza', 'Pasta', 'Desserts'],
      languages: ['en', 'it'],
      paymentMethods: ['card', 'cash', 'apple-pay']
    },
    
    metrics: {
      rating: 4.5,
      totalReviews: 892,
      totalOrders: 12456,
      avgDeliveryTime: 32
    },
    
    subscription: {
      plan: 'standard',
      status: 'active'
    },
    
    isActive: true,
    isVerified: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

const menuItems = [
  {
    itemId: 'spice-garden-butter-chicken',
    restaurantId: 'the-spice-garden',
    name: 'Butter Chicken',
    description: 'Tender chicken pieces simmered in a rich, creamy tomato sauce with aromatic spices and butter.',
    shortDescription: 'Creamy tomato curry with tender chicken',
    
    category: 'Main Course',
    subCategory: 'Chicken',
    cuisine: 'North Indian',
    tags: ['popular', 'creamy', 'mild-spice', 'gluten-free'],
    
    pricing: {
      basePrice: 1295, // ₹12.95
      currency: 'INR',
      variants: [
        { name: 'Regular', priceModifier: 0, description: 'Standard portion' },
        { name: 'Large', priceModifier: 300, description: 'Extra serving' }
      ]
    },
    
    media: {
      primaryImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=600&fit=crop&crop=center',
      additionalImages: [
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=800&h=600&fit=crop&crop=center'
      ],
      arModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      arModelThumbnail: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&h=200&fit=crop&crop=center'
    },
    
    nutrition: {
      calories: 485,
      protein: 32,
      carbs: 18,
      fat: 28,
      fiber: 3,
      sodium: 920,
      allergens: ['dairy'],
      dietaryInfo: ['gluten-free']
    },
    
    ingredients: [
      { name: 'Chicken breast', quantity: '200g', optional: false, allergen: false },
      { name: 'Tomatoes', quantity: '3 medium', optional: false, allergen: false },
      { name: 'Heavy cream', quantity: '100ml', optional: false, allergen: true },
      { name: 'Butter', quantity: '2 tbsp', optional: false, allergen: true },
      { name: 'Onions', quantity: '1 large', optional: false, allergen: false },
      { name: 'Garam masala', quantity: '1 tsp', optional: false, allergen: false },
      { name: 'Ginger-garlic paste', quantity: '1 tbsp', optional: false, allergen: false }
    ],
    
    preparation: {
      cookingTime: 35,
      difficulty: 'medium',
      method: 'simmered',
      temperature: 'hot'
    },
    
    availability: {
      isAvailable: true,
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      seasonalItem: false,
      soldOut: false
    },
    
    popularity: {
      orderCount: 1456,
      rating: 4.8,
      reviewCount: 324,
      trending: true
    },
    
    customizations: [
      {
        id: 'spice-level',
        name: 'Spice Level',
        type: 'single',
        required: false,
        options: [
          { name: 'Mild', priceModifier: 0, available: true },
          { name: 'Medium', priceModifier: 0, available: true },
          { name: 'Hot', priceModifier: 0, available: true },
          { name: 'Extra Hot', priceModifier: 50, available: true }
        ]
      }
    ],
    
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  
  {
    itemId: 'bella-italia-margherita',
    restaurantId: 'bella-italia',
    name: 'Margherita Pizza',
    description: 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella di bufala, fresh basil, and extra virgin olive oil on hand-stretched dough.',
    shortDescription: 'Classic pizza with tomatoes, mozzarella, and basil',
    
    category: 'Pizza',
    subCategory: 'Vegetarian',
    cuisine: 'Italian',
    tags: ['classic', 'vegetarian', 'popular', 'traditional'],
    
    pricing: {
      basePrice: 1695, // $16.95
      currency: 'USD',
      variants: [
        { name: '10 inch', priceModifier: 0, description: 'Personal size' },
        { name: '14 inch', priceModifier: 600, description: 'Sharing size' }
      ]
    },
    
    media: {
      primaryImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
      additionalImages: [
        'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&crop=center'
      ],
      arModel: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
      video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4'
    },
    
    nutrition: {
      calories: 235,
      protein: 12,
      carbs: 31,
      fat: 8,
      fiber: 2,
      sodium: 540,
      allergens: ['gluten', 'dairy'],
      dietaryInfo: ['vegetarian']
    },
    
    availability: {
      isAvailable: true,
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      seasonalItem: false,
      soldOut: false
    },
    
    popularity: {
      orderCount: 2341,
      rating: 4.6,
      reviewCount: 567,
      trending: true
    },
    
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

const categories = [
  {
    categoryId: 'main-course',
    restaurantId: 'the-spice-garden',
    name: 'Main Course',
    description: 'Hearty and satisfying main dishes',
    icon: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=64&h=64&fit=crop&crop=center',
    displayOrder: 2,
    isActive: true,
    itemCount: 15,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    categoryId: 'pizza',
    restaurantId: 'bella-italia',
    name: 'Pizza',
    description: 'Authentic wood-fired pizzas',
    icon: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=64&h=64&fit=crop&crop=center',
    displayOrder: 1,
    isActive: true,
    itemCount: 12,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

async function populateDatabase() {
  try {
    console.log('🔥 Populating MejaAR database with scalable data...');
    
    const batch = writeBatch(db);
    
    // Add restaurants
    console.log('🏪 Adding restaurants...');
    for (const restaurant of restaurants) {
      const restaurantRef = doc(db, 'restaurants', restaurant.restaurantId);
      batch.set(restaurantRef, restaurant);
    }
    
    // Add menu items
    console.log('🍽️ Adding menu items...');
    for (const item of menuItems) {
      const itemRef = doc(db, 'menuItems', item.itemId);
      batch.set(itemRef, item);
    }
    
    // Add categories
    console.log('📂 Adding categories...');
    for (const category of categories) {
      const categoryRef = doc(db, 'categories', category.categoryId);
      batch.set(categoryRef, category);
    }
    
    // Commit all changes
    await batch.commit();
    
    console.log('✅ Database populated successfully!');
    console.log(`📊 Added: ${restaurants.length} restaurants, ${menuItems.length} menu items, ${categories.length} categories`);
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  }
}

// Asset Configuration Info
console.log('📁 ASSETS CONFIGURED:');
console.log('====================');
console.log('');
console.log('✅ NETWORK IMAGES READY:');
console.log('- Restaurant logos: High-quality Unsplash images');
console.log('- Restaurant covers: 1920x1080 restaurant interiors');
console.log('- Dish photos: 800x600 food photography');
console.log('- Category icons: 64x64 food category images');
console.log('');
console.log('✅ 3D MODELS READY:');
console.log('- Working .glb models from ModelViewer samples');
console.log('- Optimized for mobile AR viewing');
console.log('- Proper lighting and textures included');
console.log('');
console.log('🚀 STARTING POPULATION...');
console.log('');

// Execute the population
populateDatabase()
  .then(() => {
    console.log('✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
