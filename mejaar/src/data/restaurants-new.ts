import { getDefaultRestaurantData } from '../services/restaurantService';

export function getDefaultRestaurantId(): string {
  return 'grand-palace';
}

export function getRestaurantData(restaurantId: string) {
  // This is a fallback for demo purposes
  // In production, this would always use Firebase
  return getDefaultRestaurantData();
}
