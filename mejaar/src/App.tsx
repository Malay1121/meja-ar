import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './components/Header';
import MenuGrid from './components/MenuGrid';
import ARViewerModal from './components/ARViewerModal';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import { getRestaurantData } from './services/restaurantService';
import { createOrder } from './services/orderService';
import { LegacyRestaurant } from './types/menu';
import { CartProvider, useCart, Customer } from './contexts/CartContext';


function App() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useState<LegacyRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModelSrc, setSelectedModelSrc] = useState('');
  const [selectedItemName, setSelectedItemName] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Cart context must be used inside CartProvider, so we use a wrapper below
  const CartAndCheckout = () => {
    const { items, clearCart } = useCart();

    // Place order handler
    const handlePlaceOrder = async (customer: Customer, tableNumber?: string) => {
      if (!restaurantId || !restaurant) return;
      
      // Prepare order data
      const orderData = {
        restaurantId,
        customer: {
          ...customer,
          tableNumber: tableNumber || '',
        },
        items: items.map(item => ({
          id: item.id,
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || '',
          imageUrl: item.imageUrl
        })),
        totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        specialNotes: 'Payment to be collected at restaurant',
      };

      // Call order service
      try {
        await createOrder(orderData);
        clearCart();
        alert('Order placed successfully! Payment will be collected when your order is ready.');
      } catch (error) {
        console.error('Error placing order:', error);
        throw error;
      }
    };

    return <>
      <Cart 
        primaryColor={restaurant?.branding?.primaryColor}
        accentColor={restaurant?.branding?.accentColor}
        onCheckout={() => setIsCheckoutOpen(true)}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPlaceOrder={handlePlaceOrder}
        primaryColor={restaurant?.branding?.primaryColor}
        accentColor={restaurant?.branding?.accentColor}
      />
    </>;
  };

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!restaurantId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const restaurantData = await getRestaurantData(restaurantId);
        setRestaurant(restaurantData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load restaurant');
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [restaurantId]);

  const handleViewAR = (modelSrc: string, itemName: string) => {
    setSelectedModelSrc(modelSrc);
    setSelectedItemName(itemName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedModelSrc('');
    setSelectedItemName('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#FF6B35' }}></div>
          <p className="text-neutral-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Restaurant Not Found</h1>
          <p className="text-neutral-600 mb-6">
            {error || `The restaurant "${restaurantId}" could not be found.`}
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#FF6B35' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e55a2b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B35';
            }}
          >
            Go to Default Restaurant
          </a>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-50">
        <Header 
          restaurantName={restaurant.displayName || restaurant.name}
          restaurantDescription={restaurant.description}
          restaurantLogo={restaurant.branding?.logo}
          primaryColor={restaurant.branding?.primaryColor}
          accentColor={restaurant.branding?.accentColor}
          coverImage={restaurant.branding?.coverImage}
        />
        <CartAndCheckout />
        <main>
          <MenuGrid 
            items={restaurant.items} 
            onViewAR={handleViewAR}
            primaryColor={restaurant.branding?.primaryColor || restaurant.primaryColor}
            accentColor={restaurant.branding?.accentColor || restaurant.accentColor}
          />
        </main>

        <ARViewerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          modelSrc={selectedModelSrc}
          itemName={selectedItemName}
        />

        {/* Footer */}
        <footer 
          className="border-t py-8 sm:py-12"
          style={{
            backgroundColor: restaurant.branding?.primaryColor ? `${restaurant.branding.primaryColor}10` : 'white',
            borderTopColor: restaurant.branding?.primaryColor ? `${restaurant.branding.primaryColor}20` : '#e5e7eb'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm sm:text-base text-neutral-600 mb-2">
                © 2025 {restaurant.displayName || restaurant.name}. All rights reserved.
              </p>
              <p className="text-xs sm:text-sm text-neutral-500 mb-3">
                Experience the future of dining with augmented reality
              </p>
              <p className="text-xs text-neutral-400">
                Powered by <span style={{ color: restaurant.branding?.primaryColor || '#FF6B35' }} className="font-semibold">MejaAR</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;