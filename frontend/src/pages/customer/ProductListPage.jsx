import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  Star, 
  ArrowUpDown, 
  RotateCcw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { productService } from '../../services/productService';
import ProductCard from '../../components/common/ProductCard';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category') || 'all';
  const activeRating = searchParams.get('rating') || '';
  const activeSort = searchParams.get('sort') || 'featured';
  const searchQuery = searchParams.get('search') || '';

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchFilteredProducts();
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({
        category: activeCategory,
        minRating: activeRating,
        sortBy: activeSort,
        search: searchQuery
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Products</span>
          {activeCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="text-purple-700 capitalize font-semibold">
                {categories.find(c => c.id === activeCategory)?.name || activeCategory}
              </span>
            </>
          )}
        </nav>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Browse Marketplace Products'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Showing <span className="font-semibold text-slate-800">{products.length}</span> verified products with genuine customer ratings
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={activeSort}
                onChange={(e) => updateFilters('sort', e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl pl-3 pr-8 py-2 focus:border-purple-600 focus:ring-1 focus:ring-purple-200 outline-none cursor-pointer shadow-xs"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="rating-desc">Highest Customer Rating</option>
                <option value="reviews-desc">Most Reviewed</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rank">Marketplace Rank</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop & Mobile collapse) */}
        <div className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} md:col-span-1 space-y-6`}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-600" />
                Filter Products
              </h3>
              {(activeCategory !== 'all' || activeRating || searchQuery) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Categories
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateFilters('category', 'all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilters('category', cat.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors line-clamp-1 ${
                      activeCategory === cat.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Minimum Customer Rating
              </h4>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5, 3.0].map((star) => (
                  <label
                    key={star}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer group hover:text-purple-700"
                  >
                    <input
                      type="radio"
                      name="minRating"
                      checked={activeRating === String(star)}
                      onChange={() => updateFilters('rating', star)}
                      className="text-purple-600 focus:ring-purple-400 h-3.5 w-3.5"
                    />
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{star}★ & above</span>
                    </div>
                  </label>
                ))}
                {activeRating && (
                  <button
                    onClick={() => updateFilters('rating', '')}
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline mt-1"
                  >
                    Clear rating filter
                  </button>
                )}
              </div>
            </div>

            {/* Quality Assurance Box */}
            <div className="pt-4 border-t border-slate-100 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                PRRP Authenticity
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                All listed products showcase ratings aggregated solely from verified customer feedback.
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100 p-4 space-y-4">
                  <div className="bg-slate-200 h-44 rounded-xl" />
                  <div className="bg-slate-200 h-4 w-3/4 rounded" />
                  <div className="bg-slate-200 h-4 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No products match your filters</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Try selecting a different category, relaxing your rating criteria, or resetting filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
