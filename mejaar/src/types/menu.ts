// ENTERPRISE-GRADE INTERFACES FOR MEJAR PLATFORM
// ==============================================

export interface MenuItem {
  // Core Identity
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  shortDescription?: string;
  
  // Pricing Structure
  pricing: {
    basePrice: number;          // In smallest currency unit (paise)
    currency: string;           // "INR"
    discountPrice?: number;
    discountPercentage?: number;
    priceVariants?: {
      [key: string]: {          // "small", "medium", "large"
        price: number;
        description: string;
      };
    };
    taxIncluded: boolean;
  };
  
  // Visual Assets
  media: {
    images: {
      primary: string;
      gallery?: string[];
      thumbnail: string;
    };
    models?: {
      ar: string;
      thumbnail: string;
      size: number;
    };
  };
  
  // Nutritional Information
  nutrition: {
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
      fiber?: number;
    };
    portionSize: string;
  };
  
  // Ingredients & Dietary Info
  ingredients: {
    primary: string[];
    allergens: string[];
    dietaryInfo: {
      isVegetarian: boolean;
      isVegan: boolean;
      isGlutenFree: boolean;
      isHalal: boolean;
      isJain: boolean;
      spiceLevel: 0 | 1 | 2 | 3 | 4;
    };
  };
  
  // Category & Tags
  category: {
    primary: string;
    secondary?: string;
    tags: string[];
  };
  
  // Availability & Operations
  availability: {
    isAvailable: boolean;
    preparationTime: number;
    stockQuantity?: number;
  };
  
  // Analytics
  analytics: {
    popularity: number;
    rating: number;
    reviewCount: number;
  };
  
  // Customization Options
  customizations?: {
    spiceLevel?: {
      options: string[];
      default: string;
    };
    size?: {
      options: {
        name: string;
        priceModifier: number;
      }[];
    };
    addOns?: {
      category: string;
      options: {
        name: string;
        price: number;
        isAvailable: boolean;
      }[];
    }[];
  };
  
  // Metadata
  metadata: {
    createdAt: string;
    updatedAt: string;
    isSignature: boolean;
    isSeasonal: boolean;
  };
}

export interface Restaurant {
  // Core Identity
  restaurantId: string;
  name: string;
  description: string;
  tagline: string;
  
  // Business Information
  businessInfo: {
    type: "restaurant" | "cafe" | "fast-food" | "fine-dining" | "cloud-kitchen";
    cuisine: string[];
    priceRange: "$" | "$$" | "$$$" | "$$$$";
    establishedYear?: number;
  };
  
  // Location & Contact
  location: {
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
      landmark?: string;
    };
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  contact: {
    phone: string[];
    email: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  
  // Branding & Visual Identity
  branding: {
    logo: string;
    coverImage: string;
    favicon?: string;
    primaryColor: string;
    accentColor: string;
    fontFamily?: string;
  };
  
  // Operations
  operations: {
    isActive: boolean;
    openingHours: {
      [key: string]: {
        isOpen: boolean;
        hours?: {
          open: string;
          close: string;
        };
      };
    };
    avgDeliveryTime?: number;
    minimumOrder?: number;
  };
  
  // Features
  features: {
    hasAR: boolean;
    hasDelivery: boolean;
    hasTakeaway: boolean;
    hasDineIn: boolean;
    acceptsOnlinePayment: boolean;
  };
  
  // Analytics
  analytics: {
    totalViews: number;
    totalOrders: number;
    rating: number;
    reviewCount: number;
  };
  
  // Menu Items
  items: MenuItem[];
  
  // Metadata
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

// Legacy interface for backward compatibility
export interface LegacyMenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageSrc: string;
  modelSrc: string;
  category?: string;
}

export interface LegacyRestaurant {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  branding?: {
    logo: string;
    coverImage: string;
    favicon?: string;
    primaryColor: string;
    accentColor: string;
    fontFamily?: string;
  };
  items: LegacyMenuItem[];
}