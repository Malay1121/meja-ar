import { getDefaultRestaurantData } from '../services/restaurantService';

export function getDefaultRestaurantId(): string {
  return 'bella-italia'; // Default to one of our Firebase restaurants
}

export function getRestaurantData(restaurantId: string) {
  // This is a fallback for demo purposes
  // In production, this would always use Firebase
  return getDefaultRestaurantData();
}
