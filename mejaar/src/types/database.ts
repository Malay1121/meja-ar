// MEJAR AR - ENTERPRISE DATABASE SCHEMA
// =====================================
// Scalable, future-proof data structure for restaurant platforms

import { Timestamp } from 'firebase/firestore';

// 🏪 RESTAURANT ENTITY - Complete Business Profile
export interface Restaurant {
  // Core Identity
  restaurantId: string;          // URL slug: "the-spice-garden"
  businessName: string;          // Legal business name
  displayName: string;           // Customer-facing name
  description: string;
  tagline?: string;              // "Authentic Indian Flavors Since 1995"
  
  // Branding & Media
  branding: {
    logo: string;                // "restaurants/spice-garden/branding/logo.svg"
    coverImage: string;          // "restaurants/spice-garden/branding/cover.jpg"
    gallery: string[];           // Array of restaurant interior/food images
    primaryColor: string;        // "#D2691E"
    accentColor: string;         // "#228B22"
    fontFamily?: string;         // Custom brand font
  };
  
  // Business Information
  contact: {
    phone: string;
    email: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  
  // Location & Service
  location: {
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    serviceArea: {
      delivery: boolean;
      dineIn: boolean;
      takeout: boolean;
      curbside: boolean;
    };
  };
  
  // Operating Details
  operations: {
    hours: {
      monday: { open: string; close: string; closed?: boolean };
      tuesday: { open: string; close: string; closed?: boolean };
      wednesday: { open: string; close: string; closed?: boolean };
      thursday: { open: string; close: string; closed?: boolean };
      friday: { open: string; close: string; closed?: boolean };
      saturday: { open: string; close: string; closed?: boolean };
      sunday: { open: string; close: string; closed?: boolean };
    };
    timeZone: string;            // "America/New_York"
    currency: string;            // "USD", "INR", "EUR"
    taxRate?: number;            // 0.08 (8%)
    serviceCharge?: number;      // 0.15 (15%)
  };
  
  // Platform Settings
  settings: {
    arEnabled: boolean;
    allowReviews: boolean;
    allowReservations: boolean;
    featuredCategories: string[]; // ["Popular", "Chef's Special"]
    languages: string[];          // ["en", "es", "hi"]
    paymentMethods: string[];     // ["card", "cash", "upi", "paypal"]
  };
  
  // Business Metrics
  metrics?: {
    rating: number;              // 4.5
    totalReviews: number;        // 1,247
    totalOrders: number;         // 15,632
    avgDeliveryTime: number;     // 25 minutes
  };
  
  // Subscription & Status
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'suspended' | 'pending' | 'trial';
    expiresAt?: Timestamp;
  };
  
  // System Fields
  isActive: boolean;
  isVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;            // Admin user ID
}

// 🍽️ MENU ITEM ENTITY - Complete Food Item Profile
export interface MenuItem {
  // Core Identity
  itemId: string;                // Auto-generated unique ID
  restaurantId: string;          // Foreign key
  name: string;
  description: string;
  shortDescription?: string;     // For cards/lists
  
  // Categorization
  category: string;              // "Appetizers", "Main Course"
  subCategory?: string;          // "Vegetarian", "Gluten-Free"
  cuisine?: string;              // "North Indian", "Italian"
  tags: string[];                // ["spicy", "vegan", "popular", "new"]
  
  // Pricing & Variants
  pricing: {
    basePrice: number;           // In smallest currency unit (cents/paisa)
    currency: string;            // "USD", "INR"
    variants?: Array<{
      name: string;              // "Small", "Medium", "Large"
      priceModifier: number;     // +200 (for +$2.00)
      description?: string;
    }>;
    discounts?: Array<{
      type: 'percentage' | 'fixed';
      value: number;
      validUntil?: Timestamp;
      minQuantity?: number;
    }>;
  };
  
  // Media Assets
  media: {
    primaryImage: string;        // "restaurants/spice-garden/dishes/butter-chicken/primary.jpg"
    additionalImages: string[];  // Multiple angles
    arModel: string;             // "restaurants/spice-garden/models/butter-chicken.glb"
    video?: string;              // Preparation video
    arModelThumbnail?: string;   // Preview of 3D model
  };
  
  // Nutritional & Dietary
  nutrition?: {
    calories: number;
    protein: number;             // grams
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;              // mg
    sugar: number;
  };
  
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
    halal: boolean;
    kosher: boolean;
    allergens: string[];         // ["nuts", "dairy", "eggs"]
    spiceLevel: 0 | 1 | 2 | 3 | 4 | 5; // 0 = mild, 5 = very hot
  };
  
  // Ingredients & Preparation
  ingredients: Array<{
    name: string;
    quantity?: string;           // "2 cups", "1 lb"
    optional: boolean;
    allergen: boolean;
  }>;
  
  preparation?: {
    cookingTime: number;         // minutes
    difficulty: 'easy' | 'medium' | 'hard';
    method: string;              // "grilled", "fried", "baked"
    temperature?: string;        // "hot", "cold", "room temp"
  };
  
  // Availability & Inventory
  availability: {
    isAvailable: boolean;
    availableDays: string[];     // ["monday", "tuesday"]
    availableHours?: {
      start: string;             // "11:00"
      end: string;               // "22:00"
    };
    seasonalItem: boolean;
    limitedQuantity?: number;
    soldOut: boolean;
  };
  
  // Customer Data
  popularity: {
    orderCount: number;
    rating: number;              // 4.7
    reviewCount: number;
    trending: boolean;
    lastOrdered?: Timestamp;
  };
  
  // Customization Options
  customizations?: Array<{
    id: string;
    name: string;                // "Spice Level", "Add-ons"
    type: 'single' | 'multiple';
    required: boolean;
    options: Array<{
      name: string;              // "Extra Spicy", "Add Cheese"
      priceModifier: number;     // +50 (50 cents)
      available: boolean;
    }>;
  }>;
  
  // Pairing Suggestions
  pairings?: {
    recommendedWith: string[];   // Other item IDs
    beveragePairings: string[];
    sideDishes: string[];
  };
  
  // SEO & Marketing
  seo?: {
    keywords: string[];
    metaDescription: string;
    featured: boolean;
    promotionText?: string;      // "Chef's Special!"
  };
  
  // System Fields
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  lastModifiedBy?: string;
  version: number;               // For change tracking
}

// 📦 CATEGORY ENTITY - Menu Organization
export interface MenuCategory {
  categoryId: string;
  restaurantId: string;
  name: string;
  description?: string;
  icon?: string;                 // "categories/appetizers.svg"
  image?: string;                // Hero image for category
  displayOrder: number;
  isActive: boolean;
  itemCount: number;             // Cached count
  parentCategory?: string;       // For sub-categories
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 👤 CUSTOMER ENTITY - User Profiles
export interface Customer {
  customerId: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: Timestamp;
  };
  
  preferences: {
    favoriteRestaurants: string[];
    favoriteDishes: string[];
    dietaryRestrictions: string[];
    spicePreference: number;
    defaultDeliveryAddress?: string;
  };
  
  orderHistory: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Timestamp;
    frequentItems: string[];
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

// 📝 ORDER ENTITY - Transaction Records
export interface Order {
  orderId: string;
  restaurantId: string;
  customerId?: string;
  
  items: Array<{
    itemId: string;
    name: string;                // Cached for performance
    quantity: number;
    unitPrice: number;
    customizations?: Array<{
      name: string;
      option: string;
      price: number;
    }>;
    subtotal: number;
  }>;
  
  pricing: {
    subtotal: number;
    tax: number;
    serviceCharge: number;
    deliveryFee: number;
    discount: number;
    total: number;
    currency: string;
  };
  
  delivery: {
    type: 'dine-in' | 'delivery' | 'pickup' | 'curbside';
    address?: string;
    instructions?: string;
    estimatedTime: number;       // minutes
    actualTime?: number;
  };
  
  payment: {
    method: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: Timestamp;
  };
  
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  timestamps: {
    ordered: Timestamp;
    confirmed?: Timestamp;
    preparing?: Timestamp;
    ready?: Timestamp;
    completed?: Timestamp;
  };
  
  notes?: string;
  rating?: number;
  review?: string;
}

// All types are already exported individually above
