import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LegacyRestaurant, LegacyMenuItem } from '../types/menu';

export interface FirebaseMenuItem {
  id: string;
  itemId: string;
  name: string;
  description: string;
  pricing: {
    basePrice: number;
    currency: string;
  };
  category: string;
  media: {
    primaryImage: string;
    arModel: string;
  };
  isActive: boolean;
  restaurantId: string;
  createdAt: Date;
}

export interface FirebaseRestaurant {
  id: string;
  restaurantId: string; // URL slug
  displayName: string; // Updated field name
  businessName: string; // Added enterprise field
  description: string;
  branding: {
    logo: string;
    primaryColor: string;
    accentColor: string;
    coverImage?: string;
  };
  isActive: boolean;
  createdAt: Date;
}

export async function getRestaurantData(restaurantId: string): Promise<LegacyRestaurant> {
  try {
    // Method 1: Try to get restaurant by document ID
    let restaurantDoc;
    let restaurantData;
    
    try {
      const directDocRef = doc(db, 'restaurants', restaurantId);
      const directDocSnap = await getDoc(directDocRef);
      
      if (directDocSnap.exists()) {
        restaurantDoc = directDocSnap;
        restaurantData = directDocSnap.data() as FirebaseRestaurant;
      }
    } catch (error) {
      // Direct document lookup failed, continue to other methods
    }
    
    // Method 2: If not found by document ID, try querying by restaurantId field
    if (!restaurantDoc) {
      const restaurantQuery = query(
        collection(db, 'restaurants'),
        where('restaurantId', '==', restaurantId)
      );
      
      const restaurantSnapshot = await getDocs(restaurantQuery);
      
      if (!restaurantSnapshot.empty) {
        restaurantDoc = restaurantSnapshot.docs[0];
        restaurantData = restaurantDoc.data() as FirebaseRestaurant;
      }
    }
    
    // Method 3: If still not found, try without isActive filter
    if (!restaurantDoc) {
      const restaurantQuery = query(
        collection(db, 'restaurants'),
        where('restaurantId', '==', restaurantId)
      );
      
      const restaurantSnapshot = await getDocs(restaurantQuery);
      
      if (!restaurantSnapshot.empty) {
        restaurantDoc = restaurantSnapshot.docs[0];
        restaurantData = restaurantDoc.data() as FirebaseRestaurant;
      }
    }

    if (!restaurantDoc || !restaurantData) {
      throw new Error(`Restaurant "${restaurantId}" not found`);
    }

    // Get menu items from subcollection
    const menuItemsRef = collection(db, 'restaurants', restaurantId, 'menuItems');
    const menuQuery = query(
      menuItemsRef,
      where('isActive', '==', true),
      orderBy('category'),
      orderBy('name')
    );

    const menuSnapshot = await getDocs(menuQuery);
    const menuItems: LegacyMenuItem[] = [];

    menuSnapshot.forEach((doc) => {
      const item = doc.data() as FirebaseMenuItem;
      
      // Handle both old and new data structures
      const price = item.pricing?.basePrice || (item as any).price || 0;
      const currency = item.pricing?.currency || 'INR';
      const imageSrc = item.media?.primaryImage || (item as any).imagePath || '';
      const modelSrc = item.media?.arModel || (item as any).modelPath || '';
      
      menuItems.push({
        id: doc.id,
        name: item.name,
        description: item.description,
        price: currency === 'INR' ? `₹${Math.round(price / 100)}` : `$${(price / 100).toFixed(2)}`,
        category: item.category,
        imageSrc: imageSrc,
        modelSrc: modelSrc
      });
    });

    return {
      id: restaurantData.restaurantId || restaurantId,
      name: restaurantData.displayName,
      displayName: restaurantData.displayName,
      description: restaurantData.description,
      logo: restaurantData.branding?.logo || '',
      primaryColor: restaurantData.branding?.primaryColor || '#FF6B35',
      accentColor: restaurantData.branding?.accentColor || '#4ECDC4',
      branding: {
        logo: restaurantData.branding?.logo || '',
        primaryColor: restaurantData.branding?.primaryColor || '#FF6B35',
        accentColor: restaurantData.branding?.accentColor || '#4ECDC4',
        coverImage: restaurantData.branding?.coverImage || ''
      },
      items: menuItems
    };

  } catch (error) {
    throw error;
  }
}

// Fallback function for demo data (when no Firebase data exists)
export function getDefaultRestaurantData(): LegacyRestaurant {
  return {
    id: 'mejar-demo-restaurant',
    name: 'MejaAR Demo Restaurant',
    description: 'Experience food in Augmented Reality - powered by MejaAR',
    logo: '/images/mejar-logo.png',
    primaryColor: '#FF6B35',
    accentColor: '#4ECDC4',
    items: [
      {
        id: '1',
        name: 'Gourmet Angus Burger',
        description: 'A juicy, flame-grilled Angus beef patty with fresh lettuce, tomatoes, and our secret sauce on a brioche bun.',
        price: '$14.99',
        category: 'Main Course',
        imageSrc: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
        modelSrc: 'https://dulcet-caramel-26bff1.netlify.app/assets/burger.glb'
      },
      {
        id: '2',
        name: 'Classic Pepperoni Pizza',
        description: 'Hand-tossed dough with rich tomato base, fresh mozzarella cheese, and premium spicy pepperoni.',
        price: '$18.50',
        category: 'Main Course',
        imageSrc: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&q=80',
        modelSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
      },
      {
        id: '3',
        name: 'Artisan Avocado Toast',
        description: 'Toasted sourdough bread topped with creamy avocado, red pepper flakes, sea salt, and microgreens.',
        price: '$9.75',
        category: 'Appetizer',
        imageSrc: 'https://images.unsplash.com/photo-1584365685244-867c2543d351?w=600&q=80',
        modelSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
      },
      {
        id: '4',
        name: 'Grilled Salmon Fillet',
        description: 'Atlantic salmon grilled to perfection, served with lemon herb butter and seasonal vegetables.',
        price: '$22.99',
        category: 'Main Course',
        imageSrc: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
        modelSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
      },
      {
        id: '5',
        name: 'Chocolate Lava Cake',
        description: 'Decadent warm chocolate cake with a molten center, served with vanilla ice cream.',
        price: '$8.50',
        category: 'Dessert',
        imageSrc: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
        modelSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
      },
      {
        id: '6',
        name: 'Caesar Salad Supreme',
        description: 'Fresh romaine lettuce tossed with our homemade Caesar dressing, parmesan cheese, and croutons.',
        price: '$12.25',
        category: 'Salad',
        imageSrc: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80',
        modelSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
      }
    ]
  };
}
