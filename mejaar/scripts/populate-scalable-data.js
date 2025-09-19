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

console.log('🚀 READY TO POPULATE:');
console.log('- All placeholder paths replaced with network URLs');
console.log('- Images load directly from Unsplash CDN');
console.log('- 3D models from reliable ModelViewer repository');
console.log('');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { populateDatabase };

// SCALABLE SAMPLE DATA
const restaurants = [
  // {
  //   restaurantId: 'the-spice-garden',
  //   businessName: 'The Spice Garden LLC',
  //   displayName: 'The Spice Garden',
  //   description: 'Authentic Indian cuisine crafted with traditional recipes and the finest spices, bringing the true taste of India to your table.',
  //   tagline: 'Where Every Dish Tells a Story',
    
  //   branding: {
  //     logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop&crop=center',
  //     coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop&crop=center',
  //     gallery: [
  //       'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&crop=center',
  //       'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
  //       'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&crop=center'
  //     ],
  //     primaryColor: '#D2691E',
  //     accentColor: '#228B22',
  //     fontFamily: 'Poppins'
  //   },
    
  //   contact: {
  //     phone: '+1-555-SPICE-01',
  //     email: 'hello@spicegarden.com',
  //     website: 'https://spicegarden.com',
  //     socialMedia: {
  //       instagram: '@thespicegarden',
  //       facebook: 'thespicegardenrestaurant'
  //     }
  //   },
    
  //   location: {
  //     address: {
  //       street: '123 Flavor Street',
  //       city: 'Culinary City',
  //       state: 'California',
  //       country: 'United States',
  //       postalCode: '90210',
  //       coordinates: {
  //         latitude: 34.0522,
  //         longitude: -118.2437
  //       }
  //     },
  //     serviceArea: {
  //       delivery: true,
  //       dineIn: true,
  //       takeout: true,
  //       curbside: true
  //     }
  //   },
    
  //   operations: {
  //     hours: {
  //       monday: { open: '11:00', close: '22:00' },
  //       tuesday: { open: '11:00', close: '22:00' },
  //       wednesday: { open: '11:00', close: '22:00' },
  //       thursday: { open: '11:00', close: '22:00' },
  //       friday: { open: '11:00', close: '23:00' },
  //       saturday: { open: '11:00', close: '23:00' },
  //       sunday: { open: '12:00', close: '21:00' }
  //     },
  //     timeZone: 'Asia/Kolkata',
  //     currency: 'INR',
  //     taxRate: 0.18,
  //     serviceCharge: 0.10
  //   },
    
  //   settings: {
  //     arEnabled: true,
  //     allowReviews: true,
  //     allowReservations: true,
  //     featuredCategories: ['Chef Special', 'Popular', 'Vegetarian'],
  //     languages: ['en', 'hi'],
  //     paymentMethods: ['card', 'cash', 'paypal', 'apple-pay']
  //   },
    
  //   metrics: {
  //     rating: 4.7,
  //     totalReviews: 1247,
  //     totalOrders: 15632,
  //     avgDeliveryTime: 28
  //   },
    
  //   subscription: {
  //     plan: 'premium',
  //     status: 'active'
  //   },
    
  //   isActive: true,
  //   isVerified: true,
  //   createdAt: Timestamp.now(),
  //   updatedAt: Timestamp.now()
  // },
  
  // {
  //   restaurantId: 'bella-italia',
  //   businessName: 'Bella Italia Ristorante',
  //   displayName: 'Bella Italia',
  //   description: 'Traditional Italian cuisine made with imported ingredients and time-honored recipes from the heart of Italy.',
  //   tagline: 'Taste of Authentic Italy',
    
  //   branding: {
  //     logo: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=200&h=200&fit=crop&crop=center',
  //     coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=1080&fit=crop&crop=center',
  //     gallery: [
  //       'https://images.unsplash.com/photo-1552566090-a4a2b21b8fe4?w=800&h=600&fit=crop&crop=center',
  //       'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center'
  //     ],
  //     primaryColor: '#C41E3A',
  //     accentColor: '#228B22'
  //   },
    
  //   contact: {
  //     phone: '+1-555-BELLA-01',
  //     email: 'ciao@bellaitalia.com',
  //     website: 'https://bellaitalia.com'
  //   },
    
  //   location: {
  //     address: {
  //       street: '456 Roma Avenue',
  //       city: 'Little Italy',
  //       state: 'New York',
  //       country: 'United States',
  //       postalCode: '10013'
  //     },
  //     serviceArea: {
  //       delivery: true,
  //       dineIn: true,
  //       takeout: true,
  //       curbside: false
  //     }
  //   },
    
  //   operations: {
  //     hours: {
  //       monday: { open: '17:00', close: '22:00' },
  //       tuesday: { open: '17:00', close: '22:00' },
  //       wednesday: { open: '17:00', close: '22:00' },
  //       thursday: { open: '17:00', close: '22:00' },
  //       friday: { open: '17:00', close: '23:00' },
  //       saturday: { open: '12:00', close: '23:00' },
  //       sunday: { open: '12:00', close: '21:00' }
  //     },
  //     timeZone: 'America/New_York',
  //     currency: 'USD',
  //     taxRate: 0.08,
  //     serviceCharge: 0.20
  //   },
    
  //   settings: {
  //     arEnabled: true,
  //     allowReviews: true,
  //     allowReservations: true,
  //     featuredCategories: ['Pasta', 'Pizza', 'Antipasti'],
  //     languages: ['en', 'it'],
  //     paymentMethods: ['card', 'cash']
  //   },
    
  //   subscription: {
  //     plan: 'basic',
  //     status: 'active'
  //   },
    
  //   isActive: true,
  //   isVerified: true,
  //   createdAt: Timestamp.now(),
  //   updatedAt: Timestamp.now()
  // }
];

const menuItems = [
  // SPICE GARDEN ITEMS
  // {
  //   itemId: 'spice-garden-butter-chicken',
  //   restaurantId: 'the-spice-garden',
  //   name: 'Butter Chicken',
  //   description: 'Tender pieces of chicken cooked in a rich, creamy tomato-based curry sauce with aromatic spices. A beloved classic from North India.',
  //   shortDescription: 'Creamy tomato curry with tender chicken',
    
  //   category: 'Main Course',
  //   subCategory: 'Non-Vegetarian',
  //   cuisine: 'North Indian',
  //   tags: ['popular', 'mild', 'creamy', 'gluten-free'],
    
  //   pricing: {
  //     basePrice: 58900, // ₹589
  //     currency: 'INR',
  //     variants: [
  //       { name: 'Regular', priceModifier: 0, description: 'Standard portion' },
  //       { name: 'Large', priceModifier: 15000, description: 'Extra portion for sharing' }
  //     ]
  //   },
    
  //   media: {
  //     primaryImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=600&fit=crop&crop=center',
  //     additionalImages: [
  //       'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop&crop=center',
  //       'https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=800&h=600&fit=crop&crop=center'
  //     ],
  //     arModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  //     arModelThumbnail: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&h=200&fit=crop&crop=center'
  //   },
    
  //   nutrition: {
  //     calories: 485,
  //     protein: 32,
  //     carbs: 12,
  //     fat: 28,
  //     fiber: 3,
  //     sodium: 890,
  //     sugar: 8
  //   },
    
  //   dietary: {
  //     vegetarian: false,
  //     vegan: false,
  //     glutenFree: true,
  //     dairyFree: false,
  //     nutFree: true,
  //     halal: true,
  //     kosher: false,
  //     allergens: ['dairy'],
  //     spiceLevel: 2
  //   },
    
  //   ingredients: [
  //     { name: 'Chicken breast', quantity: '8 oz', optional: false, allergen: false },
  //     { name: 'Tomatoes', quantity: '2 cups', optional: false, allergen: false },
  //     { name: 'Heavy cream', quantity: '1/2 cup', optional: false, allergen: true },
  //     { name: 'Butter', quantity: '2 tbsp', optional: false, allergen: true },
  //     { name: 'Garam masala', quantity: '1 tsp', optional: false, allergen: false },
  //     { name: 'Ginger-garlic paste', quantity: '1 tbsp', optional: false, allergen: false }
  //   ],
    
  //   preparation: {
  //     cookingTime: 35,
  //     difficulty: 'medium',
  //     method: 'simmered',
  //     temperature: 'hot'
  //   },
    
  //   availability: {
  //     isAvailable: true,
  //     availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  //     seasonalItem: false,
  //     soldOut: false
  //   },
    
  //   popularity: {
  //     orderCount: 1456,
  //     rating: 4.8,
  //     reviewCount: 324,
  //     trending: true
  //   },
    
  //   customizations: [
  //     {
  //       id: 'spice-level',
  //       name: 'Spice Level',
  //       type: 'single',
  //       required: false,
  //       options: [
  //         { name: 'Mild', priceModifier: 0, available: true },
  //         { name: 'Medium', priceModifier: 0, available: true },
  //         { name: 'Hot', priceModifier: 0, available: true },
  //         { name: 'Extra Hot', priceModifier: 2000, available: true }
  //       ]
  //     },
  //     {
  //       id: 'add-ons',
  //       name: 'Add-ons',
  //       type: 'multiple',
  //       required: false,
  //       options: [
  //         { name: 'Extra Rice', priceModifier: 8000, available: true },
  //         { name: 'Naan Bread', priceModifier: 12000, available: true },
  //         { name: 'Extra Chicken', priceModifier: 20000, available: true }
  //       ]
  //     }
  //   ],
    
  //   pairings: {
  //     recommendedWith: ['spice-garden-basmati-rice', 'spice-garden-garlic-naan'],
  //     beveragePairings: ['mango-lassi', 'masala-chai'],
  //     sideDishes: ['spice-garden-raita', 'spice-garden-papad']
  //   },
    
  //   seo: {
  //     keywords: ['butter chicken', 'indian curry', 'north indian', 'creamy chicken'],
  //     metaDescription: 'Authentic Butter Chicken - creamy tomato curry with tender chicken pieces',
  //     featured: true,
  //     promotionText: 'Customer Favorite!'
  //   },
    
  //   createdAt: Timestamp.now(),
  //   updatedAt: Timestamp.now(),
  //   version: 1
  // },

  // KOREAN BBQ WINGS - SPICE GARDEN
  {
    itemId: 'spice-garden-korean-bbq-wings',
    restaurantId: 'the-spice-garden',
    name: 'Korean BBQ Wings',
    description: 'Crispy chicken wings glazed with our signature Korean BBQ sauce, featuring gochujang, soy sauce, and honey. Garnished with sesame seeds and spring onions.',
    shortDescription: 'Crispy wings with Korean BBQ glaze',
    
    category: 'Appetizers',
    subCategory: 'Non-Vegetarian',
    cuisine: 'Korean-Indian Fusion',
    tags: ['popular', 'spicy', 'crispy', 'fusion', 'finger-food'],
    
    pricing: {
      basePrice: 45900, // ₹459
      currency: 'INR',
      variants: [
        { name: '6 Pieces', priceModifier: 0, description: 'Perfect for sharing' },
        { name: '12 Pieces', priceModifier: 25000, description: 'Party size portion' }
      ]
    },
    
    media: {
      primaryImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=center',
      additionalImages: [
        'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&h=600&fit=crop&crop=center'
      ],
      arModel: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/BoomBox/glTF-Binary/BoomBox.glb',
      arModelThumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop&crop=center'
    },
    
    nutrition: {
      calories: 285,
      protein: 18,
      carbs: 8,
      fat: 20,
      fiber: 1,
      sodium: 720,
      sugar: 6
    },
    
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: true,
      nutFree: false,
      halal: true,
      kosher: false,
      allergens: ['gluten', 'soy', 'sesame'],
      spiceLevel: 3
    },
    
    ingredients: [
      { name: 'Chicken wings', quantity: '6 pieces', optional: false, allergen: false },
      { name: 'Gochujang paste', quantity: '2 tbsp', optional: false, allergen: false },
      { name: 'Soy sauce', quantity: '1 tbsp', optional: false, allergen: true },
      { name: 'Honey', quantity: '1 tbsp', optional: false, allergen: false },
      { name: 'Sesame oil', quantity: '1 tsp', optional: false, allergen: true },
      { name: 'Garlic', quantity: '3 cloves', optional: false, allergen: false },
      { name: 'Sesame seeds', quantity: '1 tsp', optional: false, allergen: true },
      { name: 'Spring onions', quantity: '2 stalks', optional: false, allergen: false }
    ],
    
    preparation: {
      cookingTime: 25,
      difficulty: 'medium',
      method: 'deep-fried and glazed',
      temperature: 'hot'
    },
    
    availability: {
      isAvailable: true,
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      seasonalItem: false,
      soldOut: false
    },
    
    popularity: {
      orderCount: 892,
      rating: 4.6,
      reviewCount: 156,
      trending: true
    },
    
    isActive: true,
    
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
          { name: 'Extra Hot', priceModifier: 2000, available: true }
        ]
      },
      {
        id: 'add-ons',
        name: 'Add-ons',
        type: 'multiple',
        required: false,
        options: [
          { name: 'Extra Sauce', priceModifier: 5000, available: true },
          { name: 'Pickled Radish', priceModifier: 8000, available: true },
          { name: 'Kimchi Side', priceModifier: 12000, available: true }
        ]
      }
    ],
    
    pairings: {
      recommendedWith: ['spice-garden-steamed-rice', 'spice-garden-korean-coleslaw'],
      beveragePairings: ['korean-beer', 'iced-green-tea'],
      sideDishes: ['spice-garden-kimchi', 'spice-garden-pickled-vegetables']
    },
    
    seo: {
      keywords: ['korean bbq wings', 'chicken wings', 'korean fusion', 'spicy wings'],
      metaDescription: 'Korean BBQ Wings - crispy chicken wings with authentic Korean BBQ glaze',
      featured: true,
      promotionText: 'Fusion Favorite!'
    },
    
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    version: 1
  },

  // CROISSANTS - SPICE GARDEN
  {
    itemId: 'spice-garden-croissants',
    restaurantId: 'the-spice-garden',
    name: 'Butter Croissants',
    description: 'Flaky, buttery French croissants baked fresh daily. Perfect for breakfast or as a light snack. Served warm with honey butter and seasonal jam.',
    shortDescription: 'Fresh French croissants with honey butter',
    
    category: 'Breakfast & Bakery',
    subCategory: 'Vegetarian',
    cuisine: 'French',
    tags: ['fresh-baked', 'vegetarian', 'breakfast', 'french', 'buttery'],
    
    pricing: {
      basePrice: 15900, // ₹159
      currency: 'INR',
      variants: [
        { name: 'Single', priceModifier: 0, description: 'One fresh croissant' },
        { name: 'Pair', priceModifier: 12000, description: 'Two croissants' },
        { name: 'Half Dozen', priceModifier: 55000, description: 'Six croissants for sharing' }
      ]
    },
    
    media: {
      primaryImage: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=800&h=600&fit=crop&crop=center',
      additionalImages: [
        'https://images.unsplash.com/photo-1623334044303-241021148842?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&h=600&fit=crop&crop=center'
      ],
      arModel: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/Avocado/glTF-Binary/Avocado.glb',
      arModelThumbnail: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=200&h=200&fit=crop&crop=center'
    },
    
    nutrition: {
      calories: 231,
      protein: 5,
      carbs: 26,
      fat: 12,
      fiber: 2,
      sodium: 424,
      sugar: 3
    },
    
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: true,
      halal: true,
      kosher: true,
      allergens: ['gluten', 'dairy', 'eggs'],
      spiceLevel: 0
    },
    
    ingredients: [
      { name: 'French flour', quantity: '100g', optional: false, allergen: true },
      { name: 'Butter', quantity: '40g', optional: false, allergen: true },
      { name: 'Milk', quantity: '50ml', optional: false, allergen: true },
      { name: 'Eggs', quantity: '1 piece', optional: false, allergen: true },
      { name: 'Yeast', quantity: '5g', optional: false, allergen: false },
      { name: 'Sugar', quantity: '10g', optional: false, allergen: false },
      { name: 'Salt', quantity: '5g', optional: false, allergen: false },
      { name: 'Honey butter', quantity: '20g', optional: true, allergen: true }
    ],
    
    preparation: {
      cookingTime: 18,
      difficulty: 'easy',
      method: 'baked',
      temperature: 'warm'
    },
    
    availability: {
      isAvailable: true,
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      seasonalItem: false,
      soldOut: false
    },
    
    popularity: {
      orderCount: 743,
      rating: 4.4,
      reviewCount: 89,
      trending: false
    },
    
    isActive: true,
    
    customizations: [
      {
        id: 'filling-options',
        name: 'Filling Options',
        type: 'single',
        required: false,
        options: [
          { name: 'Plain', priceModifier: 0, available: true },
          { name: 'Almond', priceModifier: 3000, available: true },
          { name: 'Chocolate', priceModifier: 4000, available: true },
          { name: 'Ham & Cheese', priceModifier: 8000, available: true }
        ]
      },
      {
        id: 'accompaniments',
        name: 'Accompaniments',
        type: 'multiple',
        required: false,
        options: [
          { name: 'Extra Honey Butter', priceModifier: 2000, available: true },
          { name: 'Strawberry Jam', priceModifier: 2500, available: true },
          { name: 'Orange Marmalade', priceModifier: 2500, available: true }
        ]
      }
    ],
    
    pairings: {
      recommendedWith: ['fresh-coffee', 'masala-chai'],
      beveragePairings: ['cappuccino', 'english-breakfast-tea', 'fresh-orange-juice'],
      sideDishes: ['seasonal-fruits', 'yogurt-parfait']
    },
    
    seo: {
      keywords: ['croissants', 'french pastry', 'breakfast', 'bakery fresh'],
      metaDescription: 'Fresh French Croissants - flaky, buttery pastries baked daily',
      featured: false,
      promotionText: 'Baked Fresh Daily!'
    },
    
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    version: 1
  },
  
  // // BELLA ITALIA ITEMS
  // {
  //   itemId: 'bella-italia-margherita',
  //   restaurantId: 'bella-italia',
  //   name: 'Margherita Pizza',
  //   description: 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella di bufala, fresh basil, and extra virgin olive oil on hand-stretched dough.',
  //   shortDescription: 'Classic pizza with tomatoes, mozzarella, and basil',
    
  //   category: 'Pizza',
  //   subCategory: 'Vegetarian',
  //   cuisine: 'Italian',
  //   tags: ['classic', 'vegetarian', 'popular', 'traditional'],
    
  //   pricing: {
  //     basePrice: 1695, // $16.95
  //     currency: 'USD',
  //     variants: [
  //       { name: '10 inch', priceModifier: 0, description: 'Personal size' },
  //       { name: '14 inch', priceModifier: 600, description: 'Sharing size' },
  //       { name: '18 inch', priceModifier: 1200, description: 'Family size' }
  //     ]
  //   },
    
  //   media: {
  //     primaryImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
  //     additionalImages: [
  //       'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&crop=center',
  //       'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&crop=center'
  //     ],
  //     arModel: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
  //     video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4'
  //   },
    
  //   nutrition: {
  //     calories: 235,
  //     protein: 12,
  //     carbs: 31,
  //     fat: 8,
  //     fiber: 2,
  //     sodium: 540,
  //     sugar: 4
  //   },
    
  //   dietary: {
  //     vegetarian: true,
  //     vegan: false,
  //     glutenFree: false,
  //     dairyFree: false,
  //     nutFree: true,
  //     halal: true,
  //     kosher: true,
  //     allergens: ['gluten', 'dairy'],
  //     spiceLevel: 0
  //   },
    
  //   ingredients: [
  //     { name: 'Pizza dough', quantity: '200g', optional: false, allergen: true },
  //     { name: 'San Marzano tomatoes', quantity: '80g', optional: false, allergen: false },
  //     { name: 'Mozzarella di bufala', quantity: '100g', optional: false, allergen: true },
  //     { name: 'Fresh basil', quantity: '5 leaves', optional: false, allergen: false },
  //     { name: 'Extra virgin olive oil', quantity: '1 tbsp', optional: false, allergen: false }
  //   ],
    
  //   preparation: {
  //     cookingTime: 12,
  //     difficulty: 'easy',
  //     method: 'wood-fired oven',
  //     temperature: 'hot'
  //   },
    
  //   availability: {
  //     isAvailable: true,
  //     availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  //     seasonalItem: false,
  //     soldOut: false
  //   },
    
  //   popularity: {
  //     orderCount: 2156,
  //     rating: 4.9,
  //     reviewCount: 445,
  //     trending: true
  //   },
    
  //   customizations: [
  //     {
  //       id: 'crust-type',
  //       name: 'Crust Type',
  //       type: 'single',
  //       required: true,
  //       options: [
  //         { name: 'Thin Crust', priceModifier: 0, available: true },
  //         { name: 'Thick Crust', priceModifier: 200, available: true },
  //         { name: 'Gluten-Free', priceModifier: 400, available: true }
  //       ]
  //     },
  //     {
  //       id: 'extra-toppings',
  //       name: 'Extra Toppings',
  //       type: 'multiple',
  //       required: false,
  //       options: [
  //         { name: 'Extra Mozzarella', priceModifier: 300, available: true },
  //         { name: 'Prosciutto', priceModifier: 500, available: true },
  //         { name: 'Mushrooms', priceModifier: 250, available: true }
  //       ]
  //     }
  //   ],
    
  //   createdAt: Timestamp.now(),
  //   updatedAt: Timestamp.now(),
  //   version: 1
  // }
];

const categories = [
  {
    categoryId: 'appetizers',
    restaurantId: 'the-spice-garden',
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers and finger foods',
    icon: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=64&h=64&fit=crop&crop=center',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center',
    displayOrder: 1,
    isActive: true,
    itemCount: 12,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  // {
  //   categoryId: 'main-course',
  //   restaurantId: 'the-spice-garden',
  //   name: 'Main Course',
  //   description: 'Hearty and satisfying main dishes with authentic Indian flavors',
  //   icon: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=64&h=64&fit=crop&crop=center',
  //   image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop&crop=center',
  //   displayOrder: 2,
  //   isActive: true,
  //   itemCount: 18,
  //   createdAt: Timestamp.now(),
  //   updatedAt: Timestamp.now()
  // },
  {
    categoryId: 'breakfast-bakery',
    restaurantId: 'the-spice-garden',
    name: 'Breakfast & Bakery',
    description: 'Fresh baked goods and breakfast items to start your day right',
    icon: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=64&h=64&fit=crop&crop=center',
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400&h=300&fit=crop&crop=center',
    displayOrder: 3,
    isActive: true,
    itemCount: 8,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  // {
  //   categoryId: 'pizza',
  //   restaurantId: 'bella-italia',
  //   name: 'Pizza',
  //   description: 'Authentic wood-fired pizzas with premium ingredients',
  //   icon: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=64&h=64&fit=crop&crop=center',
  //   image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
  //   displayOrder: 1,
  //   isActive: true,
  //   itemCount: 12,
  //   createdAt: Timestamp.now(),
  //   updatedAt: Timestamp.now()
  // }
];

async function populateDatabase() {
  try {
    console.log('🔥 Populating MejaAR database with nested structure...');
    
    const batch = writeBatch(db);
    
    // Add restaurants
    // console.log('🏪 Adding restaurants...');
    // for (const restaurant of restaurants) {
    //   const restaurantRef = doc(db, 'restaurants', restaurant.restaurantId);
    //   batch.set(restaurantRef, restaurant);
    // }
    
    // Group menu items and categories by restaurant
    const restaurantGroups = {};
    
    // Group menu items by restaurant
    for (const item of menuItems) {
      if (!restaurantGroups[item.restaurantId]) {
        restaurantGroups[item.restaurantId] = { menuItems: [], categories: [] };
      }
      restaurantGroups[item.restaurantId].menuItems.push(item);
    }
    
    // Group categories by restaurant
    for (const category of categories) {
      if (!restaurantGroups[category.restaurantId]) {
        restaurantGroups[category.restaurantId] = { menuItems: [], categories: [] };
      }
      restaurantGroups[category.restaurantId].categories.push(category);
    }
    
    // Add data for each restaurant with nested structure
    for (const [restaurantId, data] of Object.entries(restaurantGroups)) {
      console.log(`🏪 Processing restaurant: ${restaurantId}`);
      
      // Add menu items as subcollection
      console.log(`🍽️ Adding ${data.menuItems.length} menu items to ${restaurantId}...`);
      for (const item of data.menuItems) {
        // Remove restaurantId from item data since it's now implicit in the path
        const { restaurantId: _, ...itemData } = item;
        const itemRef = doc(db, 'restaurants', restaurantId, 'menuItems', item.itemId);
        batch.set(itemRef, itemData);
      }
      
      // Add categories as subcollection
      console.log(`📂 Adding ${data.categories.length} categories to ${restaurantId}...`);
      for (const category of data.categories) {
        // Remove restaurantId from category data since it's now implicit in the path
        const { restaurantId: _, ...categoryData } = category;
        const categoryRef = doc(db, 'restaurants', restaurantId, 'categories', category.categoryId);
        batch.set(categoryRef, categoryData);
      }
    }
    
    // Commit all changes
    await batch.commit();
    
    const totalMenuItems = Object.values(restaurantGroups).reduce((total, group) => total + group.menuItems.length, 0);
    const totalCategories = Object.values(restaurantGroups).reduce((total, group) => total + group.categories.length, 0);
    
    console.log('✅ Database populated successfully with nested structure!');
    console.log(`📊 Added: ${Object.keys(restaurantGroups).length} restaurants, ${totalMenuItems} menu items, ${totalCategories} categories`);
    console.log(`🏗️ Structure: restaurants/{restaurantId}/menuItems/{itemId} & restaurants/{restaurantId}/categories/{categoryId}`);
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  }
}

// Asset Requirements Note
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
console.log('� READY TO POPULATE:');
console.log('- All placeholder paths replaced with network URLs');
console.log('- Images load directly from Unsplash CDN');
console.log('- 3D models from reliable ModelViewer repository');

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
