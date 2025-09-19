import React, { useState, useEffect } from 'react';
import { Box, Clock, Users, Star, Info, Plus } from 'lucide-react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { MenuItem } from '../types/menu';

interface EnhancedMenuItemCardProps {
  item: MenuItem;
  onViewAR: (modelSrc: string, itemName: string) => void;
}

const EnhancedMenuItemCard: React.FC<EnhancedMenuItemCardProps> = ({ item, onViewAR }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [modelUrl, setModelUrl] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNutrition, setShowNutrition] = useState(false);

  useEffect(() => {
    const loadUrls = async () => {
      try {
        setLoading(true);
        
        // Load primary image
        if (item.media.images.primary.startsWith('http')) {
          setImageUrl(item.media.images.primary);
        } else {
          const imageRef = ref(storage, item.media.images.primary);
          const imgUrl = await getDownloadURL(imageRef);
          setImageUrl(imgUrl);
        }

        // Load AR model
        if (item.media.models?.ar) {
          if (item.media.models.ar.startsWith('http')) {
            setModelUrl(item.media.models.ar);
          } else {
            const modelRef = ref(storage, item.media.models.ar);
            const mdlUrl = await getDownloadURL(modelRef);
            setModelUrl(mdlUrl);
          }
        }
      } catch (error) {
        setImageUrl(item.media.images.primary);
      } finally {
        setLoading(false);
      }
    };

    loadUrls();
  }, [item.media.images.primary, item.media.models?.ar]);

  // Format price display
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${(price / 100).toFixed(0)}`;
    }
    return `$${(price / 100).toFixed(2)}`;
  };

  // Get dietary badges
  const getDietaryBadges = () => {
    const badges = [];
    const { dietaryInfo } = item.ingredients;
    
    if (dietaryInfo.isVegetarian) badges.push({ text: 'Veg', color: 'bg-green-100 text-green-800', icon: '🌱' });
    if (dietaryInfo.isVegan) badges.push({ text: 'Vegan', color: 'bg-green-100 text-green-800', icon: '🌿' });
    if (dietaryInfo.isGlutenFree) badges.push({ text: 'Gluten Free', color: 'bg-blue-100 text-blue-800', icon: '🌾' });
    if (dietaryInfo.isHalal) badges.push({ text: 'Halal', color: 'bg-purple-100 text-purple-800', icon: '🥩' });
    if (dietaryInfo.isJain) badges.push({ text: 'Jain', color: 'bg-orange-100 text-orange-800', icon: '🕉️' });
    
    return badges;
  };

  // Get spice level display
  const getSpiceLevel = () => {
    const level = item.ingredients.dietaryInfo.spiceLevel;
    const flames = '🌶️'.repeat(level);
    const labels = ['No Spice', 'Mild', 'Medium', 'Hot', 'Very Hot'];
    return { flames, label: labels[level] };
  };

  // Check if item is popular
  const isPopular = item.analytics.popularity > 80 || item.category.tags.includes('popular');
  const isSignature = item.metadata.isSignature;

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group relative">
      {/* Special Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {isSignature && (
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            ⭐ Signature
          </span>
        )}
        {isPopular && (
          <span className="bg-gradient-to-r from-red-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            🔥 Popular
          </span>
        )}
        {item.metadata.isSeasonal && (
          <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            🍂 Seasonal
          </span>
        )}
      </div>

      {/* Category & Rating */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
        <span className="bg-white/90 backdrop-blur-sm text-neutral-800 px-2 py-1 rounded-full text-sm font-medium">
          {item.category.primary}
        </span>
        {item.analytics.rating > 0 && (
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{item.analytics.rating}</span>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={imageError ? '/images/placeholder-food.jpg' : (imageUrl || item.media.images.primary)}
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        
        {/* Availability Overlay */}
        {!item.availability.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full font-medium">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Item Name & Description */}
        <h3 className="text-xl font-semibold text-neutral-900 mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        <p className="text-neutral-600 text-sm leading-relaxed mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Dietary Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {getDietaryBadges().map((badge, index) => (
            <span key={index} className={`${badge.color} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
              <span>{badge.icon}</span>
              {badge.text}
            </span>
          ))}
        </div>

        {/* Spice Level & Prep Time */}
        <div className="flex items-center justify-between mb-4 text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            {item.ingredients.dietaryInfo.spiceLevel > 0 && (
              <div className="flex items-center gap-1">
                <span>{getSpiceLevel().flames}</span>
                <span className="text-xs">{getSpiceLevel().label}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{item.availability.preparationTime} min</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{item.nutrition.portionSize}</span>
            </div>
          </div>
        </div>

        {/* Nutrition Toggle */}
        <button
          onClick={() => setShowNutrition(!showNutrition)}
          className="text-sm text-primary-600 hover:text-primary-700 mb-3 flex items-center gap-1"
        >
          <Info className="h-4 w-4" />
          {showNutrition ? 'Hide' : 'Show'} Nutrition Info
        </button>

        {/* Nutrition Panel */}
        {showNutrition && (
          <div className="bg-neutral-50 rounded-lg p-3 mb-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Calories:</span> {item.nutrition.calories}
              </div>
              <div>
                <span className="font-medium">Protein:</span> {item.nutrition.macros.protein}g
              </div>
              <div>
                <span className="font-medium">Carbs:</span> {item.nutrition.macros.carbs}g
              </div>
              <div>
                <span className="font-medium">Fat:</span> {item.nutrition.macros.fat}g
              </div>
            </div>
            
            {item.ingredients.allergens.length > 0 && (
              <div className="mt-2 pt-2 border-t border-neutral-200">
                <span className="font-medium text-red-600">Allergens:</span>
                <span className="ml-1">{item.ingredients.allergens.join(', ')}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Price & Action */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(item.pricing.basePrice, item.pricing.currency)}
              </span>
              {item.pricing.discountPrice && (
                <span className="text-lg text-neutral-400 line-through">
                  {formatPrice(item.pricing.discountPrice, item.pricing.currency)}
                </span>
              )}
            </div>
            
            {/* Price Variants */}
            {item.pricing.priceVariants && (
              <div className="text-xs text-neutral-500 mt-1">
                {Object.entries(item.pricing.priceVariants).map(([size, variant]) => (
                  <span key={size} className="mr-2">
                    {size}: {formatPrice(variant.price, item.pricing.currency)}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {/* Add to Cart Button */}
            <button
              className="bg-white border-2 border-primary-600 text-primary-600 px-3 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-primary-50 flex items-center gap-1"
              disabled={!item.availability.isAvailable}
            >
              <Plus className="h-4 w-4" />
            </button>
            
            {/* AR Button */}
            <button
              onClick={() => onViewAR(modelUrl || item.media.models?.ar || '', item.name)}
              className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              disabled={loading || !item.availability.isAvailable}
            >
              <Box className="h-4 w-4" />
              <span className="text-sm">AR View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMenuItemCard;
