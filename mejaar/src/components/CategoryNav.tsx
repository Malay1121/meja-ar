import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  itemCounts: Record<string, number>;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ 
  categories, 
  activeCategory, 
  onCategorySelect, 
  itemCounts 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Auto-scroll to active category
  useEffect(() => {
    if (scrollContainerRef.current && activeCategory) {
      const activeButton = scrollContainerRef.current.querySelector(
        `[data-category="${activeCategory}"]`
      ) as HTMLElement;
      
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-20 z-30 bg-white border-b border-neutral-100 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-neutral-50 transition-colors md:hidden"
            style={{ marginLeft: '-12px' }}
          >
            <ChevronLeft className="h-4 w-4 text-neutral-600" />
          </button>

          {/* Category buttons container */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-2 overflow-x-auto scrollbar-hide py-2 px-8 md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Categories button */}
            <button
              onClick={() => onCategorySelect('')}
              data-category=""
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !activeCategory
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All ({categories.reduce((sum, cat) => sum + (itemCounts[cat] || 0), 0)})
            </button>

            {/* Individual category buttons */}
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                data-category={category}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {category} ({itemCounts[category] || 0})
              </button>
            ))}
          </div>

          {/* Right scroll button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-neutral-50 transition-colors md:hidden"
            style={{ marginRight: '-12px' }}
          >
            <ChevronRight className="h-4 w-4 text-neutral-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
