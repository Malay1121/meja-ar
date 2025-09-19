import { 
  doc, 
  collection, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  limit,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types for the data structures
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Updated from 'image'
  categoryId: string; // Updated from 'category'
  isVegetarian?: boolean;
  isSpicy?: boolean;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  arModel?: {
    enabled: boolean;
    modelUrl?: string;
  };
  isActive: boolean; // Updated from 'isAvailable'
  preparationTime?: number;
  popularity?: number;
  restaurantId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  itemCount?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface RestaurantInfo {
  id: string;
  name: string;
  description?: string;
  cuisineType: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours?: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
    backgroundImage?: string;
  };
  settings?: {
    acceptsReservations?: boolean;
    hasDelivery?: boolean;
    hasTakeout?: boolean;
    acceptsPayments?: string[];
  };
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface AnalyticsData {
  viewsToday: number;
  arInteractions: number;
  popularItems: MenuItem[];
  recentActivity: {
    type: 'view' | 'ar_interaction' | 'order';
    itemId?: string;
    itemName?: string;
    timestamp: Timestamp;
  }[];
  weeklyStats?: {
    views: number[];
    interactions: number[];
    orders: number[];
  };
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  imageUrl?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  tableNumber?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'dine-in' | 'takeout' | 'delivery';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: 'cash' | 'card' | 'upi' | 'online';
  specialNotes?: string;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  restaurantId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;
  readyAt?: Timestamp;
  deliveredAt?: Timestamp;
}

export interface OrderStats {
  today: {
    total: number;
    pending: number;
    confirmed: number;
    preparing: number;
    ready: number;
    delivered: number;
    cancelled: number;
    revenue: number;
  };
  thisWeek: {
    total: number;
    revenue: number;
    avgOrderValue: number;
  };
  popularItems: Array<{
    menuItemId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

class RestaurantDataService {
  private restaurantId: string | null = null;

  setRestaurantId(id: string) {
    this.restaurantId = id;
  }

  private ensureRestaurantId(): string {
    if (!this.restaurantId) {
      throw new Error('Restaurant ID not set. Call setRestaurantId() first.');
    }
    return this.restaurantId;
  }

  // Fetch restaurant basic information
  async getRestaurantInfo(): Promise<RestaurantInfo | null> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      const restaurantSnap = await getDoc(restaurantRef);

      if (restaurantSnap.exists()) {
        const data = restaurantSnap.data();
        return {
          id: restaurantSnap.id,
          name: data.displayName || data.name || 'Unknown Restaurant',
          description: data.description || '',
          cuisineType: data.cuisineType || 'International',
          location: data.location,
          contact: data.contact,
          hours: data.operations?.hours,
          theme: {
            primaryColor: data.branding?.primaryColor,
            secondaryColor: data.branding?.accentColor,
            logo: data.branding?.logo,
            backgroundImage: data.branding?.coverImage
          },
          settings: {
            acceptsReservations: data.settings?.allowReservations,
            hasDelivery: data.location?.serviceArea?.delivery,
            hasTakeout: data.location?.serviceArea?.takeout,
            acceptsPayments: data.settings?.paymentMethods
          },
          isActive: data.isActive !== false, // Default to true if not specified
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as RestaurantInfo;
      }
      return null;
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
      throw error;
    }
  }

  // Fetch all categories for the restaurant
  async getCategories(): Promise<Category[]> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const categoriesRef = collection(db, 'restaurants', restaurantId, 'categories');
      const q = query(categoriesRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);

      const categories: Category[] = [];
      
      if (querySnapshot.empty) {
        console.log('No categories collection found, creating default categories from menu items...');
        // If no categories collection exists, create default categories based on common menu structure
        const defaultCategories = [
          { id: 'appetizers', name: 'Appetizers', order: 1 },
          { id: 'main-course', name: 'Main Course', order: 2 },
          { id: 'beverages', name: 'Beverages', order: 3 },
          { id: 'desserts', name: 'Desserts', order: 4 }
        ];
        
        defaultCategories.forEach((cat) => {
          categories.push({
            id: cat.id,
            name: cat.name,
            description: `${cat.name} items`,
            order: cat.order,
            isActive: true,
            itemCount: 0
          });
        });
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          categories.push({
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            order: typeof data.order === 'number' ? data.order : (typeof data.displayOrder === 'number' ? data.displayOrder : 0),
            isActive: data.isActive !== false,
            itemCount: data.itemCount || 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          });
        });
      }

      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Fetch all menu items for the restaurant
  async getMenuItems(categoryId?: string): Promise<MenuItem[]> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const menuItemsRef = collection(db, 'restaurants', restaurantId, 'menuItems');
      
      let q;
      if (categoryId) {
        q = query(
          menuItemsRef, 
          where('category', '==', categoryId),
          orderBy('name', 'asc')
        );
      } else {
        q = query(menuItemsRef, orderBy('name', 'asc'));
      }

      const querySnapshot = await getDocs(q);
      const menuItems: MenuItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Raw Firebase menu item data:', { id: doc.id, data }); // Debug log
        
        // Convert price from paise/cents to rupees/dollars
        const basePrice = data.pricing?.basePrice || 0;
        const price = typeof basePrice === 'number' ? basePrice / 100 : 0;
        
        menuItems.push({
          id: doc.id,
          name: data.name || '',
          description: data.description || data.shortDescription || '',
          price: price,
          imageUrl: data.media?.primaryImage || data.imageUrl,
          categoryId: data.category || data.categoryId, // Firebase uses 'category'
          isVegetarian: data.dietary?.vegetarian || data.isVegetarian || false,
          isSpicy: data.dietary?.spiceLevel > 0 || data.isSpicy || false,
          ingredients: (() => {
            // Handle different ingredient formats from Firebase
            if (Array.isArray(data.ingredients)) {
              return data.ingredients.map((ing: any) => 
                typeof ing === 'string' ? ing : (ing.name || ing.ingredient || String(ing))
              ).filter(Boolean);
            }
            return [];
          })(),
          allergens: data.dietary?.allergens || data.allergens || [],
          arModel: {
            enabled: !!data.media?.arModel,
            modelUrl: data.media?.arModel || data.arModel?.modelUrl || ''
          },
          isActive: data.isActive !== false && data.availability?.isAvailable !== false,
          preparationTime: data.preparation?.cookingTime || data.preparationTime || 15,
          popularity: data.popularity?.rating || data.popularity || 0,
          restaurantId: data.restaurantId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });

      return menuItems;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  }

  // Get popular menu items (mock analytics for now)
  async getPopularMenuItems(limitCount: number = 5): Promise<MenuItem[]> {
    try {
      const allItems = await this.getMenuItems();
      // Sort by popularity (mock) and limit results
      return allItems
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error fetching popular menu items:', error);
      throw error;
    }
  }

  // Get analytics data (mock implementation for demo)
  async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      const popularItems = await this.getPopularMenuItems(3);
      
      // Mock analytics data
      return {
        viewsToday: Math.floor(Math.random() * 100) + 50,
        arInteractions: Math.floor(Math.random() * 20) + 10,
        popularItems,
        recentActivity: [
          {
            type: 'view',
            itemName: 'Butter Chicken',
            timestamp: Timestamp.now()
          },
          {
            type: 'ar_interaction',
            itemName: 'Biryani',
            timestamp: Timestamp.fromDate(new Date(Date.now() - 300000)) // 5 mins ago
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  // Extract unique categories from existing menu items
  async extractCategoriesFromMenuItems(): Promise<Category[]> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const menuItemsRef = collection(db, 'restaurants', restaurantId, 'menuItems');
      const querySnapshot = await getDocs(menuItemsRef);
      
      const categoryMap = new Map<string, { name: string; count: number }>();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const categoryName = data.category || data.categoryId;
        if (categoryName) {
          const existing = categoryMap.get(categoryName);
          categoryMap.set(categoryName, {
            name: categoryName,
            count: (existing?.count || 0) + 1
          });
        }
      });

      const categories: Category[] = [];
      let order = 1;
      
      categoryMap.forEach((value, key) => {
        categories.push({
          id: key.toLowerCase().replace(/\s+/g, '-'),
          name: value.name,
          description: `${value.name} (${value.count} items)`,
          order: order++,
          isActive: true,
          itemCount: value.count
        });
      });

      return categories.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error extracting categories from menu items:', error);
      return [];
    }
  }

  // Get dashboard summary
  async getDashboardSummary() {
    try {
      const [restaurantInfo, categories, menuItems, analytics] = await Promise.all([
        this.getRestaurantInfo(),
        this.getCategories(),
        this.getMenuItems(),
        this.getAnalyticsData()
      ]);

      return {
        restaurantInfo,
        totalCategories: categories.length,
        totalMenuItems: menuItems.length,
        activeMenuItems: menuItems.filter(item => item.isActive).length,
        analytics
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  // Create a new menu item
  async createMenuItem(menuItemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const menuItemsRef = collection(db, 'restaurants', restaurantId, 'menuItems');
      
      // Transform admin panel data to Firebase format
      const firebaseData: any = {
        name: menuItemData.name || '',
        description: menuItemData.description || '',
        category: menuItemData.categoryId || '',
        pricing: {
          basePrice: Math.round((menuItemData.price || 0) * 100) // Convert to paise/cents
        },
        media: {
          primaryImage: menuItemData.imageUrl || '',
          ...(menuItemData.arModel?.enabled && menuItemData.arModel.modelUrl ? { arModel: menuItemData.arModel.modelUrl } : {})
        },
        dietary: {
          vegetarian: Boolean(menuItemData.isVegetarian),
          spiceLevel: Boolean(menuItemData.isSpicy) ? 2 : 0,
          allergens: Array.isArray(menuItemData.allergens) ? menuItemData.allergens.filter(Boolean) : []
        },
        ingredients: Array.isArray(menuItemData.ingredients) ? menuItemData.ingredients.filter(Boolean) : [],
        preparation: {
          cookingTime: menuItemData.preparationTime || 15
        },
        availability: {
          isAvailable: Boolean(menuItemData.isActive)
        },
        isActive: Boolean(menuItemData.isActive),
        restaurantId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(menuItemsRef, firebaseData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  }

  // Update an existing menu item
  async updateMenuItem(itemId: string, updates: Partial<MenuItem>): Promise<void> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const itemRef = doc(db, 'restaurants', restaurantId, 'menuItems', itemId);
      
      // Transform the admin panel data structure to Firebase format
      const firebaseData: any = {};
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          switch (key) {
            case 'price':
              // Convert price back to paise/cents for Firebase
              if (typeof value === 'number') {
                firebaseData.pricing = { basePrice: Math.round(value * 100) };
              }
              break;
            case 'imageUrl':
              if (value) {
                firebaseData.media = { primaryImage: value };
              }
              break;
            case 'categoryId':
              firebaseData.category = value;
              break;
            case 'isVegetarian':
              firebaseData.dietary = { 
                ...firebaseData.dietary, 
                vegetarian: Boolean(value) 
              };
              break;
            case 'isSpicy':
              firebaseData.dietary = { 
                ...firebaseData.dietary, 
                spiceLevel: Boolean(value) ? 2 : 0 
              };
              break;
            case 'ingredients':
              // Ensure ingredients is always an array of strings
              firebaseData.ingredients = Array.isArray(value) ? value.filter(Boolean) : [];
              break;
            case 'allergens':
              firebaseData.dietary = { 
                ...firebaseData.dietary, 
                allergens: Array.isArray(value) ? value.filter(Boolean) : []
              };
              break;
            case 'arModel':
              if (value && typeof value === 'object' && 'enabled' in value) {
                firebaseData.media = { 
                  ...firebaseData.media,
                  arModel: value.enabled ? (value.modelUrl || '') : null
                };
              }
              break;
            case 'preparationTime':
              firebaseData.preparation = { cookingTime: value };
              break;
            case 'isActive':
              firebaseData.isActive = Boolean(value);
              firebaseData.availability = { isAvailable: Boolean(value) };
              break;
            default:
              // For simple fields like name, description, keep as-is
              if (['name', 'description'].includes(key)) {
                firebaseData[key] = value;
              }
              break;
          }
        }
      });
      
      const updateData = {
        ...firebaseData,
        updatedAt: Timestamp.now()
      };
      
      console.log('Updating menu item with Firebase format:', updateData);
      
      await updateDoc(itemRef, updateData);
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }

  // Delete a menu item
  async deleteMenuItem(itemId: string): Promise<void> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const itemRef = doc(db, 'restaurants', restaurantId, 'menuItems', itemId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }

  // Toggle menu item status (active/inactive)
  async toggleMenuItemStatus(itemId: string, isActive: boolean): Promise<void> {
    try {
      await this.updateMenuItem(itemId, { isActive });
    } catch (error) {
      console.error('Error toggling menu item status:', error);
      throw error;
    }
  }

  // Bulk update menu item status
  async bulkUpdateMenuItemStatus(itemIds: string[], isActive: boolean): Promise<void> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const promises = itemIds.map(itemId => {
        const itemRef = doc(db, 'restaurants', restaurantId, 'menuItems', itemId);
        return updateDoc(itemRef, { 
          isActive,
          updatedAt: Timestamp.now()
        });
      });
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error bulk updating menu item status:', error);
      throw error;
    }
  }

  // ================== CATEGORY CRUD OPERATIONS ==================

  // Create a new category
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const categoriesRef = collection(db, 'restaurants', restaurantId, 'categories');
      
      const newCategory = {
        name: categoryData.name || '',
        description: categoryData.description || '',
        order: categoryData.order || 0,
        isActive: Boolean(categoryData.isActive),
        itemCount: 0, // Initialize with 0 items
        restaurantId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(categoriesRef, newCategory);
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update an existing category
  async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const categoryRef = doc(db, 'restaurants', restaurantId, 'categories', categoryId);
      
      // Clean the update data to remove undefined values
      const cleanUpdates: any = {};
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (['name', 'description', 'order', 'isActive'].includes(key)) {
            cleanUpdates[key] = value;
          }
        }
      });
      
      const updateData = {
        ...cleanUpdates,
        updatedAt: Timestamp.now()
      };
      
      console.log('Updating category with data:', updateData);
      
      await updateDoc(categoryRef, updateData);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // Delete a category
  async deleteCategory(categoryId: string): Promise<void> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const categoryRef = doc(db, 'restaurants', restaurantId, 'categories', categoryId);
      await deleteDoc(categoryRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Toggle category status (active/inactive)
  async toggleCategoryStatus(categoryId: string, isActive: boolean): Promise<void> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const categoryRef = doc(db, 'restaurants', restaurantId, 'categories', categoryId);
      
      await updateDoc(categoryRef, {
        isActive: Boolean(isActive),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating category status:', error);
      throw error;
    }
  }

  // Update category item counts based on menu items
  async updateCategoryItemCounts(): Promise<void> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const menuItems = await this.getMenuItems();
      const categories = await this.getCategories();
      
      // Count items per category
      const categoryCounts = new Map<string, number>();
      
      menuItems.forEach(item => {
        if (item.categoryId) {
          const currentCount = categoryCounts.get(item.categoryId) || 0;
          categoryCounts.set(item.categoryId, currentCount + 1);
        }
      });
      
      // Update each category's item count
      const updatePromises = categories.map(async (category) => {
        const itemCount = categoryCounts.get(category.id) || 0;
        if (category.itemCount !== itemCount) {
          const categoryRef = doc(db, 'restaurants', restaurantId, 'categories', category.id);
          await updateDoc(categoryRef, {
            itemCount,
            updatedAt: Timestamp.now()
          });
        }
      });
      
      await Promise.all(updatePromises);
      console.log('Category item counts updated successfully');
    } catch (error) {
      console.error('Error updating category item counts:', error);
      throw error;
    }
  }

  // ================== ORDER MANAGEMENT OPERATIONS ==================

  // Generate unique order number
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}${random}`;
  }

  // Get all orders for the restaurant
  async getOrders(filters?: {
    status?: string;
    orderType?: string;
    date?: string;
    limit?: number;
  }): Promise<Order[]> {
    try {
      const restaurantId = this.ensureRestaurantId();
      let ordersRef = collection(db, 'restaurants', restaurantId, 'orders');
      let q = query(ordersRef, orderBy('createdAt', 'desc'));
      
      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        q = query(q, where('status', '==', filters.status));
      }
      
      if (filters?.orderType && filters.orderType !== 'all') {
        q = query(q, where('orderType', '==', filters.orderType));
      }
      
      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          orderNumber: data.orderNumber,
          customer: data.customer,
          items: data.items,
          totalAmount: data.totalAmount,
          status: data.status,
          orderType: data.orderType,
          paymentStatus: data.paymentStatus,
          paymentMethod: data.paymentMethod,
          specialNotes: data.specialNotes,
          estimatedTime: data.estimatedTime,
          actualTime: data.actualTime,
          restaurantId: data.restaurantId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          confirmedAt: data.confirmedAt,
          readyAt: data.readyAt,
          deliveredAt: data.deliveredAt
        });
      });

      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get a single order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const orderRef = doc(db, 'restaurants', restaurantId, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const data = orderSnap.data();
        return {
          id: orderSnap.id,
          orderNumber: data.orderNumber,
          customer: data.customer,
          items: data.items,
          totalAmount: data.totalAmount,
          status: data.status,
          orderType: data.orderType,
          paymentStatus: data.paymentStatus,
          paymentMethod: data.paymentMethod,
          specialNotes: data.specialNotes,
          estimatedTime: data.estimatedTime,
          actualTime: data.actualTime,
          restaurantId: data.restaurantId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          confirmedAt: data.confirmedAt,
          readyAt: data.readyAt,
          deliveredAt: data.deliveredAt
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Create a new order (typically from frontend)
  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const ordersRef = collection(db, 'restaurants', restaurantId, 'orders');
      
      const newOrder = {
        ...orderData,
        orderNumber: this.generateOrderNumber(),
        restaurantId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(ordersRef, newOrder);
      console.log('Order created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(
    orderId: string, 
    status: Order['status'], 
    additionalData?: {
      estimatedTime?: number;
      specialNotes?: string;
    }
  ): Promise<void> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const orderRef = doc(db, 'restaurants', restaurantId, 'orders', orderId);
      
      const updateData: any = {
        status,
        updatedAt: Timestamp.now()
      };

      // Add timestamp for specific status changes
      const now = Timestamp.now();
      switch (status) {
        case 'confirmed':
          updateData.confirmedAt = now;
          break;
        case 'ready':
          updateData.readyAt = now;
          break;
        case 'delivered':
          updateData.deliveredAt = now;
          break;
      }

      // Add additional data if provided
      if (additionalData?.estimatedTime) {
        updateData.estimatedTime = additionalData.estimatedTime;
      }
      
      if (additionalData?.specialNotes) {
        updateData.specialNotes = additionalData.specialNotes;
      }

      await updateDoc(orderRef, updateData);
      console.log(`Order ${orderId} status updated to ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus'], paymentMethod?: Order['paymentMethod']): Promise<void> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const orderRef = doc(db, 'restaurants', restaurantId, 'orders', orderId);
      
      const updateData: any = {
        paymentStatus,
        updatedAt: Timestamp.now()
      };

      if (paymentMethod) {
        updateData.paymentMethod = paymentMethod;
      }

      await updateDoc(orderRef, updateData);
      console.log(`Order ${orderId} payment status updated to ${paymentStatus}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Get order statistics
  async getOrderStats(): Promise<OrderStats> {
    try {
      const restaurantId = this.ensureRestaurantId();
      const orders = await this.getOrders({ limit: 1000 }); // Get recent orders
      
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Today's stats
      const todayOrders = orders.filter(order => 
        order.createdAt.toDate() >= todayStart
      );

      const todayStats = {
        total: todayOrders.length,
        pending: todayOrders.filter(o => o.status === 'pending').length,
        confirmed: todayOrders.filter(o => o.status === 'confirmed').length,
        preparing: todayOrders.filter(o => o.status === 'preparing').length,
        ready: todayOrders.filter(o => o.status === 'ready').length,
        delivered: todayOrders.filter(o => o.status === 'delivered').length,
        cancelled: todayOrders.filter(o => o.status === 'cancelled').length,
        revenue: todayOrders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0)
      };

      // This week's stats
      const weekOrders = orders.filter(order => 
        order.createdAt.toDate() >= weekStart
      );

      const weekStats = {
        total: weekOrders.length,
        revenue: weekOrders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0),
        avgOrderValue: weekOrders.length > 0 
          ? weekOrders.reduce((sum, o) => sum + o.totalAmount, 0) / weekOrders.length 
          : 0
      };

      // Popular items
      const itemCounts = new Map<string, { name: string; quantity: number; revenue: number }>();
      
      todayOrders.forEach(order => {
        order.items.forEach(item => {
          const current = itemCounts.get(item.menuItemId) || { 
            name: item.name, 
            quantity: 0, 
            revenue: 0 
          };
          current.quantity += item.quantity;
          current.revenue += item.price * item.quantity;
          itemCounts.set(item.menuItemId, current);
        });
      });

      const popularItems = Array.from(itemCounts.entries())
        .map(([menuItemId, data]) => ({
          menuItemId,
          name: data.name,
          quantity: data.quantity,
          revenue: data.revenue
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      return {
        today: todayStats,
        thisWeek: weekStats,
        popularItems
      };
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  // Get real-time orders (for notifications)
  async getRecentOrders(minutes: number = 30): Promise<Order[]> {
    try {
      const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
      const orders = await this.getOrders({ limit: 50 });
      
      return orders.filter(order => 
        order.createdAt.toDate() >= cutoffTime
      );
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const restaurantDataService = new RestaurantDataService();