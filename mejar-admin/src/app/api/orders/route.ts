// This is an example API endpoint that would be used by the customer-facing frontend
// to create orders. Place this in your main frontend application's API routes.

import { restaurantDataService } from '@/services/restaurantDataService'

export async function POST(request: Request) {
  try {
    const orderData = await request.json()
    
    // Validate the order data
    if (!orderData.customer || !orderData.items || !orderData.totalAmount) {
      return Response.json(
        { error: 'Missing required order data' },
        { status: 400 }
      )
    }

    // Set the restaurant ID (this would come from the frontend's context)
    restaurantDataService.setRestaurantId(orderData.restaurantId || 'the-spice-garden')

    // Create the order
    const orderId = await restaurantDataService.createOrder({
      customer: orderData.customer,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      orderType: orderData.orderType || 'dine-in',
      paymentStatus: orderData.paymentStatus || 'pending',
      paymentMethod: orderData.paymentMethod,
      specialNotes: orderData.specialNotes,
      restaurantId: orderData.restaurantId || 'the-spice-garden'
    })

    return Response.json(
      { success: true, orderId, message: 'Order placed successfully!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return Response.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// Example usage from frontend:
/*
const orderData = {
  restaurantId: 'the-spice-garden',
  customer: {
    name: 'John Doe',
    phone: '+91 9876543210',
    email: 'john@example.com',
    tableNumber: '5'
  },
  items: [
    {
      id: 'item1',
      menuItemId: 'menu-item-id',
      name: 'Chicken Butter Masala',
      price: 459,
      quantity: 1,
      specialInstructions: 'Less spicy please',
      imageUrl: 'https://example.com/image.jpg'
    }
  ],
  totalAmount: 459,
  orderType: 'dine-in',
  paymentStatus: 'pending',
  paymentMethod: 'cash',
  specialNotes: 'Table near window'
}

fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
})
*/