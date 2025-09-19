// DATA TRANSFORMATION SERVICE
// Convert between legacy format and enterprise format
// ===============================================

import { MenuItem, Restaurant, LegacyMenuItem, LegacyRestaurant } from '../types/menu';

export class DataTransformService {
  
  /**
   * Convert legacy menu item to enterprise format
   */
  static legacyToEnterpriseMenuItem(legacy: LegacyMenuItem, restaurantId: string): MenuItem {
    // Extract numeric price (remove currency symbols)
    const priceMatch = legacy.price.match(/[\d.,]+/);
    const priceNum = priceMatch ? parseFloat(priceMatch[0].replace(',', '')) : 0;
    
    // Convert to smallest currency unit (cents/paise)
    const basePrice = legacy.price.includes('₹') ? Math.round(priceNum * 100) : Math.round(priceNum * 100);
    const currency = legacy.price.includes('₹') ? 'INR' : 'USD';

    return {
      id: legacy.id,
      restaurantId: restaurantId,
      name: legacy.name,
      description: legacy.description,
      shortDescription: legacy.description.substring(0, 100) + '...',
      
      pricing: {
        basePrice: basePrice,
        currency: currency,
        taxIncluded: true,
        priceVariants: {
          regular: {
            price: basePrice,
            description: 'Regular portion'
          }
        }
      },
      
      media: {
        images: {
          primary: legacy.imageSrc,
          thumbnail: legacy.imageSrc
        },
        models: legacy.modelSrc ? {
          ar: legacy.modelSrc,
          thumbnail: legacy.imageSrc,
          size: 5000000 // 5MB default
        } : undefined
      },
      
      nutrition: {
        calories: 400, // Default values
        macros: {
          protein: 20,
          carbs: 30,
          fat: 15
        },
        portionSize: '1 serving'
      },
      
      ingredients: {
        primary: this.extractIngredients(legacy.description),
        allergens: [],
        dietaryInfo: {
          isVegetarian: this.isVegetarian(legacy.name, legacy.description),
          isVegan: this.isVegan(legacy.name, legacy.description),
          isGlutenFree: false,
          isHalal: false,
          isJain: false,
          spiceLevel: this.getSpiceLevel(legacy.name, legacy.description)
        }
      },
      
      category: {
        primary: legacy.category || 'Main Course',
        tags: this.extractTags(legacy.name, legacy.description)
      },
      
      availability: {
        isAvailable: true,
        preparationTime: this.estimatePreparationTime(legacy.category || ''),
        stockQuantity: 100
      },
      
      analytics: {
        popularity: Math.floor(Math.random() * 100),
        rating: 4.0 + Math.random(),
        reviewCount: Math.floor(Math.random() * 200)
      },
      
      customizations: {
        spiceLevel: {
          options: ['Mild', 'Medium', 'Hot'],
          default: 'Medium'
        }
      },
      
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSignature: this.isSignatureDish(legacy.name),
        isSeasonal: false
      }
    };
  }

  /**
   * Convert legacy restaurant to enterprise format
   */
  static legacyToEnterpriseRestaurant(legacy: LegacyRestaurant): Restaurant {
    return {
      restaurantId: legacy.id,
      name: legacy.name,
      description: legacy.description,
      tagline: 'Experience Food in Augmented Reality',
      
      businessInfo: {
        type: 'restaurant',
        cuisine: this.detectCuisine(legacy.items),
        priceRange: this.detectPriceRange(legacy.items),
        establishedYear: 2020
      },
      
      location: {
        address: {
          street: '123 Food Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400001'
        }
      },
      
      contact: {
        phone: ['+91 98765 43210'],
        email: `contact@${legacy.id}.com`,
        socialMedia: {
          instagram: `@${legacy.id}`,
          facebook: legacy.name
        }
      },
      
      branding: {
        logo: legacy.logo,
        coverImage: legacy.logo,
        primaryColor: legacy.primaryColor,
        accentColor: legacy.accentColor
      },
      
      operations: {
        isActive: true,
        openingHours: this.getDefaultHours(),
        avgDeliveryTime: 30,
        minimumOrder: 20000 // ₹200
      },
      
      features: {
        hasAR: true,
        hasDelivery: true,
        hasTakeaway: true,
        hasDineIn: true,
        acceptsOnlinePayment: true
      },
      
      analytics: {
        totalViews: Math.floor(Math.random() * 10000),
        totalOrders: Math.floor(Math.random() * 1000),
        rating: 4.2 + Math.random() * 0.6,
        reviewCount: Math.floor(Math.random() * 500)
      },
      
      items: legacy.items.map(item => this.legacyToEnterpriseMenuItem(item, legacy.id)),
      
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      }
    };
  }

  /**
   * Convert enterprise menu item back to legacy format (for backward compatibility)
   */
  static enterpriseToLegacyMenuItem(enterprise: MenuItem): LegacyMenuItem {
    const currency = enterprise.pricing.currency === 'INR' ? '₹' : '$';
    const price = enterprise.pricing.currency === 'INR' 
      ? `${currency}${Math.round(enterprise.pricing.basePrice / 100)}`
      : `${currency}${(enterprise.pricing.basePrice / 100).toFixed(2)}`;

    return {
      id: enterprise.id,
      name: enterprise.name,
      description: enterprise.description,
      price: price,
      imageSrc: enterprise.media.images.primary,
      modelSrc: enterprise.media.models?.ar || '',
      category: enterprise.category.primary
    };
  }

  // Helper methods
  private static extractIngredients(description: string): string[] {
    const commonIngredients = [
      'chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp',
      'rice', 'pasta', 'bread', 'cheese', 'tomato', 'onion',
      'garlic', 'herbs', 'spices', 'vegetables', 'lettuce',
      'avocado', 'mushroom', 'pepper', 'cream', 'butter'
    ];
    
    const found = commonIngredients.filter(ingredient => 
      description.toLowerCase().includes(ingredient)
    );
    
    return found.length > 0 ? found : ['fresh ingredients'];
  }

  private static isVegetarian(name: string, description: string): boolean {
    const meatKeywords = ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'meat', 'bacon'];
    const text = (name + ' ' + description).toLowerCase();
    return !meatKeywords.some(keyword => text.includes(keyword));
  }

  private static isVegan(name: string, description: string): boolean {
    const nonVeganKeywords = ['chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'meat', 'cheese', 'cream', 'butter', 'milk', 'egg'];
    const text = (name + ' ' + description).toLowerCase();
    return !nonVeganKeywords.some(keyword => text.includes(keyword));
  }

  private static getSpiceLevel(name: string, description: string): 0 | 1 | 2 | 3 | 4 {
    const text = (name + ' ' + description).toLowerCase();
    if (text.includes('spicy') || text.includes('hot') || text.includes('chili')) return 3;
    if (text.includes('mild') || text.includes('curry')) return 1;
    return 0;
  }

  private static extractTags(name: string, description: string): string[] {
    const tags = [];
    const text = (name + ' ' + description).toLowerCase();
    
    if (text.includes('popular') || text.includes('classic')) tags.push('popular');
    if (text.includes('premium') || text.includes('gourmet')) tags.push('premium');
    if (text.includes('spicy') || text.includes('hot')) tags.push('spicy');
    if (text.includes('creamy') || text.includes('rich')) tags.push('creamy');
    
    return tags;
  }

  private static estimatePreparationTime(category: string): number {
    const timeMap: { [key: string]: number } = {
      'appetizer': 10,
      'salad': 8,
      'soup': 12,
      'main course': 20,
      'dessert': 15,
      'beverage': 5
    };
    
    return timeMap[category.toLowerCase()] || 15;
  }

  private static isSignatureDish(name: string): boolean {
    return name.toLowerCase().includes('signature') || 
           name.toLowerCase().includes('special') ||
           name.toLowerCase().includes('chef');
  }

  private static detectCuisine(items: LegacyMenuItem[]): string[] {
    const cuisineKeywords = {
      'Indian': ['curry', 'biryani', 'tandoor', 'masala', 'dal'],
      'Italian': ['pizza', 'pasta', 'risotto', 'gelato'],
      'American': ['burger', 'fries', 'bbq', 'wings'],
      'Chinese': ['noodles', 'dim sum', 'wok', 'fried rice'],
      'Mexican': ['taco', 'burrito', 'quesadilla', 'salsa']
    };

    const detectedCuisines: string[] = [];
    const allText = items.map(item => item.name + ' ' + item.description).join(' ').toLowerCase();

    Object.entries(cuisineKeywords).forEach(([cuisine, keywords]) => {
      if (keywords.some(keyword => allText.includes(keyword))) {
        detectedCuisines.push(cuisine);
      }
    });

    return detectedCuisines.length > 0 ? detectedCuisines : ['International'];
  }

  private static detectPriceRange(items: LegacyMenuItem[]): "$" | "$$" | "$$$" | "$$$$" {
    const prices = items.map(item => {
      const match = item.price.match(/[\d.,]+/);
      return match ? parseFloat(match[0].replace(',', '')) : 0;
    });

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    if (avgPrice < 10) return '$';
    if (avgPrice < 25) return '$$';
    if (avgPrice < 50) return '$$$';
    return '$$$$';
  }

  private static getDefaultHours() {
    return {
      monday: { isOpen: true, hours: { open: '11:00', close: '23:00' } },
      tuesday: { isOpen: true, hours: { open: '11:00', close: '23:00' } },
      wednesday: { isOpen: true, hours: { open: '11:00', close: '23:00' } },
      thursday: { isOpen: true, hours: { open: '11:00', close: '23:00' } },
      friday: { isOpen: true, hours: { open: '11:00', close: '23:00' } },
      saturday: { isOpen: true, hours: { open: '11:00', close: '23:00' } },
      sunday: { isOpen: true, hours: { open: '11:00', close: '23:00' } }
    };
  }
}
