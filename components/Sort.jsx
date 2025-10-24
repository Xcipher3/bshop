'use client';

import { useState, useEffect } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { parseQuery, updateQuery } from '@/lib/utils/query';

const Sort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Parse current sort from URL
  const currentFilters = parseQuery(searchParams?.toString() || '');
  const currentSort = currentFilters.sort || 'featured';
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(currentSort);
  
  // Sort options
  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'newest', name: 'Newest' },
    { id: 'price_asc', name: 'Price: Low to High' },
    { id: 'price_desc', name: 'Price: High to Low' }
  ];
  
  // Handle sort change
  const handleSortChange = (sortId) => {
    setSelectedSort(sortId);
    setIsOpen(false);
    
    const newQuery = updateQuery(currentFilters, { sort: sortId });
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.sort-dropdown')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Update selected sort when URL changes
  useEffect(() => {
    setSelectedSort(currentSort);
  }, [currentSort]);
  
  const selectedOption = sortOptions.find(option => option.id === selectedSort);
  
  return (
    <div className="sort-dropdown relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
          id="menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          Sort
          <ChevronsUpDown
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="none">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSortChange(option.id)}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  selectedSort === option.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sort;