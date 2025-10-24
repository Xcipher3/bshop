import ProductCard from "@/components/ProductCard";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { parseQuery } from '@/lib/utils/query';
import { productDummyData } from "@/assets/assets";

export default function ProductsPage({ searchParams }) {
  // Parse filters from URL
  const currentFilters = parseQuery(new URLSearchParams(searchParams || {}).toString());
  
  // Filter products based on URL parameters
  const filteredProducts = productDummyData.filter(product => {
    // Category filter
    if (currentFilters.category) {
      const categories = Array.isArray(currentFilters.category) 
        ? currentFilters.category 
        : [currentFilters.category];
        
      if (!categories.includes(product.category)) {
        return false;
      }
    }
    
    // Price range filters
    if (currentFilters.price_min && product.price < Number(currentFilters.price_min)) {
      return false;
    }
    
    if (currentFilters.price_max && product.price > Number(currentFilters.price_max)) {
      return false;
    }
    
    return true;
  });
  
  // Sort products based on URL parameters
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (currentFilters.sort === 'newest') {
      // Since we don't have createdAt in dummy data, we'll sort by id
      return b.id.localeCompare(a.id);
    } else if (currentFilters.sort === 'price_asc') {
      return a.price - b.price;
    } else if (currentFilters.sort === 'price_desc') {
      return b.price - a.price;
    }
    // Default: featured (no specific sort)
    return 0;
  });

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl text-slate-500 my-6">
          All <span className="text-slate-700 font-medium">Products</span>
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <Filters products={productDummyData} />
          </div>
          
          {/* Products and Sort */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{sortedProducts.length}</span> of <span className="font-medium">{productDummyData.length}</span> products
              </p>
              <div className="mt-2 sm:mt-0">
                <Sort />
              </div>
            </div>
            
            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}