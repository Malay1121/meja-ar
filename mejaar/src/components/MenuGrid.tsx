import React, { useState, useMemo } from 'react';
import MenuItemCard from './MenuItemCard';
import MenuSearch from './MenuSearch';
import CategoryNav from './CategoryNav';
import { LegacyMenuItem } from '../types/menu';

interface MenuGridProps {
  items: LegacyMenuItem[];
  onViewAR: (modelSrc: string, itemName: string) => void;
  primaryColor?: string;
  accentColor?: string;
}

const MenuGrid: React.FC<MenuGridProps> = ({ 
  items, 
  onViewAR, 
  primaryColor = '#FF6B35', 
  accentColor = '#4ECDC4' 
}) => {
  const [filteredItems, setFilteredItems] = useState<LegacyMenuItem[]>(items);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get unique categories and their counts
  const { categories, itemCounts } = useMemo(() => {
    const categorySet = new Set<string>();
    const counts: Record<string, number> = {};
    
    items.forEach(item => {
      const category = item.category || 'Other';
      categorySet.add(category);
      counts[category] = (counts[category] || 0) + 1;
    });
    
    const categoryOrder = ['Appetizers', 'Starters', 'North Indian', 'South Indian', 'Chinese', 'Italian', 'Main Course', 'Pizzas', 'Pastas', 'Breads', 'Beverages', 'Desserts', 'Other'];
    const sortedCategories = Array.from(categorySet).sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a);
      const bIndex = categoryOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
    
    return { categories: sortedCategories, itemCounts: counts };
  }, [items]);

  // Filter items by selected category
  const displayItems = useMemo(() => {
    if (!selectedCategory) return filteredItems;
    return filteredItems.filter(item => item.category === selectedCategory);
  }, [filteredItems, selectedCategory]);

  // Group items by category for display
  const groupedItems = useMemo(() => {
    if (selectedCategory) {
      // If a category is selected, return items grouped under that category
      return { [selectedCategory]: displayItems };
    }
    
    // Group all filtered items by category
    return displayItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, LegacyMenuItem[]>);
  }, [displayItems, selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    // Scroll to top of content when category changes
    const mainContent = document.getElementById('menu-content');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get categories that have items in the filtered results
  const availableCategories = categories.filter(cat => 
    filteredItems.some(item => item.category === cat)
  );

  return (
    <>
      {/* Search and Filters */}
      <MenuSearch
        items={items}
        onFilteredItemsChange={setFilteredItems}
        categories={categories}
      />

      {/* Category Navigation */}
      <CategoryNav
        categories={availableCategories}
        activeCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        itemCounts={itemCounts}
      />

      {/* Menu Content */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900">
                {selectedCategory || 'Our Menu'}
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                {displayItems.length} {displayItems.length === 1 ? 'dish' : 'dishes'} available
              </p>
            </div>
            
            {/* Mobile view toggle for large menus */}
            {displayItems.length > 20 && (
              <div className="text-xs sm:text-sm text-neutral-500 self-start sm:self-center">
                Showing {displayItems.length} items
              </div>
            )}
          </div>
        </div>

        {/* No results message */}
        {displayItems.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-neutral-400 mb-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"/>
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-neutral-900 mb-2">No dishes found</h3>
            <p className="text-sm sm:text-base text-neutral-600 px-4">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Menu items grouped by category */}
        {Object.keys(groupedItems).length > 0 && Object.keys(groupedItems).map((category) => (
          <div key={category} className="mb-8 sm:mb-12">
            {/* Category header (only show if not filtering by specific category) */}
            {!selectedCategory && (
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-800 mb-2">
                  {category}
                </h3>
                <div 
                  className="w-8 sm:w-12 h-1 mx-auto rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
                  }}
                ></div>
              </div>
            )}
            
            {/* Items grid - Mobile-first responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {groupedItems[category].map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onViewAR={onViewAR}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Load more button for very large menus */}
        {displayItems.length > 50 && (
          <div className="text-center mt-12">
            <button 
              className="px-6 py-3 text-white rounded-lg transition-colors"
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
              Load More Items
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default MenuGrid;