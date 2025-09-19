// Local fallback data for development
import type { Restaurant, MenuItem } from '../types/menu';

export const localMenuData: MenuItem[] = [
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    description: "Tender chicken in a rich, creamy tomato-based sauce with aromatic spices",
    price: "₹450",
    imageSrc: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    modelSrc: "https://storage.googleapis.com/meja-ar-models/butter-chicken.glb",
    category: "Main Course"
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in yogurt and spices, served with mint chutney",
    price: "₹320",
    imageSrc: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
    modelSrc: "https://storage.googleapis.com/meja-ar-models/paneer-tikka.glb",
    category: "Starters"
  },
  {
    id: "biryani-chicken",
    name: "Chicken Biryani",
    description: "Fragrant basmati rice layered with spiced chicken, cooked in dum style",
    price: "₹550",
    imageSrc: "https://images.unsplash.com/photo-1563379091339-03246963d34a?w=400&h=300&fit=crop",
    modelSrc: "https://storage.googleapis.com/meja-ar-models/chicken-biryani.glb",
    category: "Main Course"
  },
  {
    id: "dal-tadka",
    name: "Dal Tadka",
    description: "Yellow lentils tempered with cumin, mustard seeds, and aromatic spices",
    price: "₹180",
    imageSrc: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    modelSrc: "https://storage.googleapis.com/meja-ar-models/dal-tadka.glb",
    category: "Main Course"
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    description: "Traditional Indian spiced tea brewed with aromatic spices and fresh milk",
    price: "₹40",
    imageSrc: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop",
    modelSrc: "https://storage.googleapis.com/meja-ar-models/masala-chai.glb",
    category: "Beverages"
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    description: "Soft milk dumplings soaked in cardamom-flavored sugar syrup",
    price: "₹120",
    imageSrc: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop",
    modelSrc: "https://storage.googleapis.com/meja-ar-models/gulab-jamun.glb",
    category: "Desserts"
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    description: "Succulent chicken pieces marinated in yogurt and spices, grilled to perfection",
    price: "₹380",
    imageSrc: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    modelSrc: "https://storage.googleapis.com/meja-ar-models/chicken-tikka.glb",
    category: "Starters"
  }
];

export const localRestaurantData: Record<string, Restaurant> = {
  "mejar-demo-restaurant": {
    id: "mejar-demo-restaurant",
    name: "MejaAR Demo Restaurant",
    description: "Experience the future of dining with AR-powered menus",
    logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop&crop=center",
    primaryColor: "#FF6B35",
    accentColor: "#4ECDC4",
    items: localMenuData
  }
};
