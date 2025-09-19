import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  primaryColor?: string;
  accentColor?: string;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ 
  primaryColor = '#FF6B35', 
  accentColor = '#4ECDC4',
  onCheckout 
}) => {
  const { 
    items, 
    totalItems, 
    totalAmount, 
    isCartOpen, 
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    updateSpecialInstructions
  } = useCart();

  if (!isCartOpen) return null;

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" style={{ color: primaryColor }} />
            <h2 className="text-lg font-semibold text-neutral-900">
              Your Order ({totalItems} items)
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500 text-lg mb-2">Your cart is empty</p>
              <p className="text-neutral-400 text-sm">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 truncate">{item.name}</h3>
                      <p className="text-sm text-neutral-500">{item.category}</p>
                      <p className="font-semibold mt-1" style={{ color: primaryColor }}>
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 hover:bg-neutral-200 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-neutral-400" />
                    </button>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-200 rounded transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-neutral-200 rounded transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-semibold" style={{ color: primaryColor }}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Special Instructions */}
                  <div className="mt-3">
                    <textarea
                      placeholder="Special instructions (optional)"
                      value={item.specialInstructions || ''}
                      onChange={(e) => updateSpecialInstructions(item.id, e.target.value)}
                      className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
                      style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-neutral-900">Total:</span>
              <span 
                className="text-xl font-bold"
                style={{ color: primaryColor }}
              >
                {formatPrice(totalAmount)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;