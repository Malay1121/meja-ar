import React, { useState, useEffect } from 'react';
import { Box, ShoppingCart } from 'lucide-react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { LegacyMenuItem } from '../types/menu';
import { useCart } from '../contexts/CartContext';

interface MenuItemCardProps {
  item: LegacyMenuItem;
  onViewAR: (modelSrc: string, itemName: string) => void;
  primaryColor?: string;
  accentColor?: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onViewAR, 
  primaryColor = '#FF6B35', 
  accentColor = '#4ECDC4' 
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [modelUrl, setModelUrl] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Convert price string to cents (assuming it's in format like "₹4.59" or "₹459")
    const priceNumber = parseFloat(item.price.replace(/[₹,]/g, ''));
    const priceInCents = Math.round(priceNumber * 100);

    addToCart({
      id: `${item.name}-${Date.now()}`, // Unique ID for cart item
      menuItemId: item.id || item.name.toLowerCase().replace(/\s+/g, '-'),
      name: item.name,
      price: priceInCents,
      imageUrl: imageUrl || item.imageSrc,
      category: item.category || 'Other'
    });
  };

  useEffect(() => {
    const loadUrls = async () => {
      try {
        setLoading(true);
        
        // Check if URLs are already full URLs (for fallback data)
        if (item.imageSrc.startsWith('http') || item.imageSrc.startsWith('/')) {
          setImageUrl(item.imageSrc);
        } else {
          // Get image URL from Firebase Storage
          try {
            const imageRef = ref(storage, item.imageSrc);
            const imgUrl = await getDownloadURL(imageRef);
            setImageUrl(imgUrl);
          } catch (imageError) {
            // Fallback to a placeholder image
            setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center');
          }
        }

        if (item.modelSrc.startsWith('http') || item.modelSrc.startsWith('/')) {
          setModelUrl(item.modelSrc);
        } else {
          // Get 3D model URL from Firebase Storage with fallback
          try {
            const modelRef = ref(storage, item.modelSrc);
            const mdlUrl = await getDownloadURL(modelRef);
            setModelUrl(mdlUrl);
          } catch (modelError) {
            // Fallback to publicly accessible demo models
            const fallbackModels = [
              'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
              'https://dulcet-caramel-26bff1.netlify.app/assets/burger.glb',
              'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb'
            ];
            const randomModel = fallbackModels[Math.floor(Math.random() * fallbackModels.length)];
            setModelUrl(randomModel);
          }
        }
      } catch (error) {
        // Ultimate fallback
        setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center');
        setModelUrl('https://modelviewer.dev/shared-assets/models/Astronaut.glb');
        setModelUrl(item.modelSrc.startsWith('/') ? item.modelSrc : `/models/${item.modelSrc}`);
      } finally {
        setLoading(false);
      }
    };

    loadUrls();
  }, [item.imageSrc, item.modelSrc]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={imageError ? '/images/placeholder-food.jpg' : (imageUrl || item.imageSrc)}
          alt={item.name}
          className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className="bg-white/90 backdrop-blur-sm text-neutral-800 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
            {item.category}
          </span>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        <p className="text-neutral-600 text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
          {item.description}
        </p>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span 
              className="text-xl sm:text-2xl font-bold"
              style={{ color: primaryColor }}
            >
              {item.price}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 text-white px-3 sm:px-4 py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 min-h-[44px]"
              style={{
                backgroundColor: primaryColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${primaryColor}dd`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor;
              }}
            >
              <ShoppingCart className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">Add to Cart</span>
            </button>
            
            <button
              onClick={() => onViewAR(modelUrl || item.modelSrc, item.name)}
              className="text-white px-3 py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-1 min-h-[44px] flex-shrink-0"
              style={{
                backgroundColor: accentColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${accentColor}dd`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = accentColor;
              }}
              disabled={loading}
            >
              <Box className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs whitespace-nowrap hidden sm:inline">AR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;