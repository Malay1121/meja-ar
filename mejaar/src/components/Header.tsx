import React from 'react';
import { Camera, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  restaurantName?: string;
  restaurantDescription?: string;
  restaurantLogo?: string;
  primaryColor?: string;
  accentColor?: string;
  coverImage?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  restaurantName = 'MejaAR', 
  restaurantDescription = 'Experience Food in Augmented Reality',
  restaurantLogo,
  primaryColor = '#FF6B35',
  accentColor = '#4ECDC4',
  coverImage
}) => {
  const { totalItems, setIsCartOpen } = useCart();

  const headerStyle = {
    backgroundImage: coverImage ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${coverImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const gradientStyle = {
    background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
  };

  return (
    <header className={`shadow-sm border-b border-neutral-200 ${coverImage ? 'text-white' : 'bg-white text-neutral-900'}`} style={headerStyle}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative">
        {/* Cart Button - Fixed Position */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed top-4 right-4 z-30 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105"
          style={{ backgroundColor: primaryColor }}
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>

        <div className="text-center">
          <div className="flex justify-center items-center mb-3 sm:mb-4">
            {restaurantLogo ? (
              <img 
                src={restaurantLogo} 
                alt={`${restaurantName} logo`}
                className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover mr-2 sm:mr-3 flex-shrink-0 ring-2 ring-white/20"
                onError={(e) => {
                  // Fallback to icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  const icon = e.currentTarget.nextElementSibling as HTMLElement;
                  if (icon) icon.style.display = 'block';
                }}
              />
            ) : null}
            <Camera 
              className={`h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 flex-shrink-0 ${restaurantLogo ? 'hidden' : 'block'}`}
              style={{ color: coverImage ? 'white' : primaryColor }}
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {restaurantName}
            </h1>
          </div>
          <p className={`text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto px-2 ${coverImage ? 'text-white/90' : 'text-neutral-600'}`}>
            {restaurantDescription}
          </p>
          <div className="mt-4 sm:mt-6 w-16 sm:w-24 h-1 mx-auto rounded-full" style={gradientStyle}></div>
        </div>
      </div>
    </header>
  );
};

export default Header;