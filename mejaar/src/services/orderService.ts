// Service for creating orders from the frontend
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface OrderData {
  customer: {
    name: string;
    phone: string;
    email?: string;
    tableNumber?: string;
  };
  items: Array<{
    id: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
    imageUrl: string;
  }>;
  totalAmount: number;
  restaurantId: string;
  specialNotes?: string;
}

export async function createOrder(orderData: OrderData) {
  try {
    // Validate the order data
    if (!orderData.customer || !orderData.items || !orderData.totalAmount) {
      throw new Error('Missing required order data');
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create the order in Firebase
    const ordersCollection = collection(db, 'restaurants', orderData.restaurantId, 'orders');
    
    const orderDoc = {
      orderNumber,
      customer: orderData.customer,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      orderType: 'dine-in',
      paymentStatus: 'pending',
      paymentMethod: 'pay-at-restaurant',
      specialNotes: orderData.specialNotes || 'Payment to be collected at restaurant',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      restaurantId: orderData.restaurantId
    };

    const docRef = await addDoc(ordersCollection, orderDoc);

    return {
      success: true,
      orderId: docRef.id,
      orderNumber,
      message: 'Order placed successfully!'
    };
  } catch (error) {
    console.error('Error creating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error('Failed to create order: ' + errorMessage);
  }
}