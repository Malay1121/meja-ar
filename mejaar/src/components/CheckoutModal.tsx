import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin } from 'lucide-react';
import { useCart, Customer } from '../contexts/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceOrder: (customer: Customer, tableNumber?: string) => void;
  primaryColor?: string;
  accentColor?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onPlaceOrder,
  primaryColor = '#FF6B35',
  accentColor = '#4ECDC4'
}) => {
  const { totalAmount } = useCart();
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: '',
    email: '',
    tableNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer.name || !customer.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (!customer.tableNumber) {
      alert('Please provide your table number');
      return;
    }

    setLoading(true);
    try {
      await onPlaceOrder(customer, customer.tableNumber);
      onClose();
      // Reset form
      setCustomer({ name: '', phone: '', email: '', tableNumber: '' });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-neutral-900">Complete Your Order</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Customer Information */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Table Number *
                </label>
                <input
                  type="text"
                  required
                  value={customer.tableNumber}
                  onChange={(e) => setCustomer(prev => ({ ...prev, tableNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  placeholder="e.g., Table 5"
                />
              </div>
            </div>

            {/* Payment Notice */}
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Payment Information</h3>
                <p className="text-blue-700 text-sm">
                  Payment will be collected when your order is ready. You can pay by cash, card, or UPI at the restaurant.
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-neutral-900">Total Amount:</span>
                <span 
                  className="text-xl font-bold"
                  style={{ color: primaryColor }}
                >
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
              }}
            >
              {loading ? 'Placing Order...' : 'Place Order & Pay at Restaurant'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;