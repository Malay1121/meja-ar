import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../src/lib/firebase';

// Sample restaurant data for "the-spice-garden"
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
    email: "info@spicegarden.com",
    website: "https://spicegarden.com"
  },
  theme: {
    primaryColor: "#f07316",
    secondaryColor: "#8b4513",
    logo: "https://via.placeholder.com/200x100/f07316/white?text=Spice+Garden"
  },
  settings: {
    acceptsReservations: true,
    hasDelivery: true,
    hasTakeout: true,
    acceptsPayments: ["cash", "card", "upi"]
  },
  isActive: true
};

// Sample categories
const categories = [
  {
    id: "starters",
    name: "Starters",
    description: "Appetizers and small plates to begin your meal",
    order: 1,
    isActive: true,
    image: "https://via.placeholder.com/300x200/f07316/white?text=Starters"
  },
  {
    id: "main-course",
    name: "Main Course",
    description: "Hearty main dishes and traditional curries",
    order: 2,
    isActive: true,
    image: "https://via.placeholder.com/300x200/f07316/white?text=Main+Course"
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet treats to end your meal",
    order: 3,
    isActive: true,
    image: "https://via.placeholder.com/300x200/f07316/white?text=Desserts"
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Refreshing drinks and traditional beverages",
    order: 4,
    isActive: true,
    image: "https://via.placeholder.com/300x200/f07316/white?text=Beverages"
  }
];

// Sample menu items
const menuItems = [
  {
    id: "samosa",
    name: "Vegetable Samosa",
    description: "Crispy pastry filled with spiced vegetables",
    price: 120,
    category: "starters",
    image: "https://via.placeholder.com/400x300/f07316/white?text=Samosa",
    isVegetarian: true,
    isSpicy: false,
    ingredients: ["potato", "green peas", "onions", "spices"],
    allergens: ["gluten"],
    isAvailable: true,
    preparationTime: 15,
    popularity: 85
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    description: "Tender chicken in rich tomato and cream sauce",
    price: 380,
    category: "main-course",
    image: "https://via.placeholder.com/400x300/f07316/white?text=Butter+Chicken",
    isVegetarian: false,
    isSpicy: true,
    ingredients: ["chicken", "tomatoes", "cream", "butter", "spices"],
    allergens: ["dairy"],
    isAvailable: true,
    preparationTime: 25,
    popularity: 95
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with aromatic spices",
    price: 320,
    category: "main-course",
    image: "https://via.placeholder.com/400x300/f07316/white?text=Paneer+Tikka",
    isVegetarian: true,
    isSpicy: true,
    ingredients: ["paneer", "yogurt", "spices", "bell peppers"],
    allergens: ["dairy"],
    isAvailable: true,
    preparationTime: 20,
    popularity: 80
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    description: "Sweet milk dumplings in sugar syrup",
    price: 150,
    category: "desserts",
    image: "https://via.placeholder.com/400x300/f07316/white?text=Gulab+Jamun",
    isVegetarian: true,
    isSpicy: false,
    ingredients: ["milk powder", "sugar", "cardamom", "rose water"],
    allergens: ["dairy"],
    isAvailable: true,
    preparationTime: 5,
    popularity: 70
  },
  {
    id: "mango-lassi",
    name: "Mango Lassi",
    description: "Creamy yogurt drink with fresh mango",
    price: 180,
    category: "beverages",
    image: "https://via.placeholder.com/400x300/f07316/white?text=Mango+Lassi",
    isVegetarian: true,
    isSpicy: false,
    ingredients: ["yogurt", "mango", "sugar", "cardamom"],
    allergens: ["dairy"],
    isAvailable: true,
    preparationTime: 5,
    popularity: 75
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    description: "Traditional spiced tea with milk",
    price: 80,
    category: "beverages",
    image: "https://via.placeholder.com/400x300/f07316/white?text=Masala+Chai",
    isVegetarian: true,
    isSpicy: false,
    ingredients: ["tea", "milk", "ginger", "cardamom", "cinnamon"],
    allergens: ["dairy"],
    isAvailable: true,
    preparationTime: 5,
    popularity: 90
  }
];

async function populateSampleData() {
  try {
    console.log('Populating sample data for the-spice-garden...');

    // Add restaurant data
    await setDoc(doc(db, 'restaurants', 'the-spice-garden'), restaurantData);
    console.log('✅ Restaurant data added');

    // Add categories
    for (const category of categories) {
      await setDoc(doc(db, 'restaurants', 'the-spice-garden', 'categories', category.id), category);
    }
    console.log('✅ Categories added');

    // Add menu items
    for (const item of menuItems) {
      await setDoc(doc(db, 'restaurants', 'the-spice-garden', 'menuItems', item.id), item);
    }
    console.log('✅ Menu items added');

    console.log('🎉 Sample data population completed successfully!');
  } catch (error) {
    console.error('❌ Error populating sample data:', error);
  }
}

export { populateSampleData, restaurantData, categories, menuItems };