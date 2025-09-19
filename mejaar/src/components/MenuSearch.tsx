import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { LegacyMenuItem } from '../types/menu';

interface MenuSearchProps {
  items: LegacyMenuItem[];
  onFilteredItemsChange: (filteredItems: LegacyMenuItem[]) => void;
  categories: string[];
}

const MenuSearch: React.FC<MenuSearchProps> = ({ items, onFilteredItemsChange, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter items based on search and filters
  React.useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Price filter
    if (priceFilter) {
      filtered = filtered.filter(item => {
        const price = parseInt(item.price.replace('₹', ''));
        switch (priceFilter) {
          case 'under-200':
            return price < 200;
          case '200-400':
            return price >= 200 && price <= 400;
          case '400-600':
            return price >= 400 && price <= 600;
          case 'above-600':
            return price > 600;
          default:
            return true;
        }
      });
    }

    onFilteredItemsChange(filtered);
  }, [searchTerm, selectedCategory, priceFilter, items, onFilteredItemsChange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceFilter('');
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm || selectedCategory || priceFilter;

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search dishes, ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-neutral-900 placeholder-neutral-500"
          />
        </div>

        {/* Filter Toggle & Clear Button */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {[searchTerm, selectedCategory, priceFilter].filter(Boolean).length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="text-sm">Clear all</span>
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="space-y-4 p-4 bg-neutral-50 rounded-xl">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedCategory
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Price Range
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '', label: 'All Prices' },
                  { value: 'under-200', label: 'Under ₹200' },
                  { value: '200-400', label: '₹200 - ₹400' },
                  { value: '400-600', label: '₹400 - ₹600' },
                  { value: 'above-600', label: 'Above ₹600' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPriceFilter(option.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      priceFilter === option.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuSearch;
