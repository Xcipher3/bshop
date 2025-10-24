'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { parseQuery, toggleFilter, removeFilter, updateQuery } from '@/lib/utils/query';

const Filters = ({ products }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  // Get price range from products
  const prices = products.map(product => product.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  // Parse current filters from URL
  const currentFilters = parseQuery(searchParams?.toString() || '');
  
  // State for filter sections
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true
  });
  
  // State for price range
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.price_min ? Number(currentFilters.price_min) : minPrice,
    max: currentFilters.price_max ? Number(currentFilters.price_max) : maxPrice
  });
  
  // Toggle filter section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle category filter toggle
  const handleCategoryToggle = (category) => {
    const newQuery = toggleFilter(currentFilters, 'category', category);
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  };
  
  // Handle price range change
  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
    
    let newFilters = { ...currentFilters };
    if (min > minPrice) {
      newFilters.price_min = min;
    } else {
      delete newFilters.price_min;
    }
    
    if (max < maxPrice) {
      newFilters.price_max = max;
    } else {
      delete newFilters.price_max;
    }
    
    const newQuery = updateQuery(currentFilters, newFilters);
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  };
  
  // Remove a specific filter
  const removeFilterItem = (filterKey, filterValue) => {
    const newQuery = removeFilter(currentFilters, filterKey, filterValue);
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };
  
  // Get active filters for display
  const getActiveFilters = () => {
    const activeFilters = [];
    
    // Category filters
    if (currentFilters.category) {
      const categories = Array.isArray(currentFilters.category) 
        ? currentFilters.category 
        : [currentFilters.category];
        
      categories.forEach(category => {
        activeFilters.push({
          key: 'category',
          value: category,
          display: category
        });
      });
    }
    
    // Price filters
    if (currentFilters.price_min) {
      activeFilters.push({
        key: 'price_min',
        value: currentFilters.price_min,
        display: `Min: KSH${currentFilters.price_min}`
      });
    }
    
    if (currentFilters.price_max) {
      activeFilters.push({
        key: 'price_max',
        value: currentFilters.price_max,
        display: `Max: KSH${currentFilters.price_max}`
      });
    }
    
    return activeFilters;
  };
  
  const activeFilters = getActiveFilters();
  
  return (
    <div className="w-full">
      {/* Active Filters Bar */}
      {activeFilters.length > 0 && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <span className="text-sm text-gray-700">{filter.display}</span>
                <button 
                  onClick={() => removeFilterItem(filter.key, filter.value)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button 
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 ml-2"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
      
      {/* Filter Sections */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Category Filter */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Category</h3>
            {expandedSections.category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.category && (
            <div className="mt-3 space-y-2">
              {categories.map((category) => {
                const isChecked = currentFilters.category 
                  ? Array.isArray(currentFilters.category) 
                    ? currentFilters.category.includes(category)
                    : currentFilters.category === category
                  : false;
                  
                return (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      name="category"
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(category)}
                      className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {category}
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Price Filter */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Price Range</h3>
            {expandedSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.price && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">KSH{priceRange.min}</span>
                <span className="text-sm text-gray-600">KSH{priceRange.max}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange(Number(e.target.value), priceRange.max)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange(priceRange.min, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange(Number(e.target.value), priceRange.max)}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange(priceRange.min, Number(e.target.value))}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;