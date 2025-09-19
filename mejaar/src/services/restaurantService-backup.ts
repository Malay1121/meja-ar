import { getRestaurant } from '../lib/firebase';
import { Restaurant } from '../types/menu';

export async function getRestaurantData(restaurantId: string): Promise<Restaurant> {
  try {
    console.log(`🔍 Loading restaurant: ${restaurantId}`);
    
    // Try to get restaurant from Firebase, with local fallback
    const restaurant = await getRestaurant(restaurantId);
    
    if (!restaurant) {
      throw new Error(`Restaurant "${restaurantId}" not found`);
    }
    
    console.log(`✅ Restaurant loaded: ${restaurant.name}`);
    return restaurant;
    
  } catch (error) {
    console.error('❌ Error loading restaurant:', error);
    throw error;
  }
}
