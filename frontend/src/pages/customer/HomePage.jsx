import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  Shirt,
  Smartphone,
  Home,
  Wrench,
  Coffee,
  Dumbbell,
  Gamepad2,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { productService } from '../../services/productService';
import ProductCard from '../../components/common/ProductCard';

const iconComponents = {
  Shirt: Shirt,
  Smartphone: Smartphone,
  Sparkles: Sparkles,
  Home: Home,
  Wrench: Wrench,
  Coffee: Coffee,
  Dumbbell: Dumbbell,
  Gamepad2: Gamepad2
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        productService.getCategories(),
        productService.getProducts({ sortBy: 'rating-desc', size: 50 })
      ]);
      setCategories(cats || []);
      setAllProducts(prods || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = selectedCatId === 'all' || p.categoryId === Number(selectedCatId);
    const matchesSearch = !searchTerm.trim() || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Top Marketplace Controls Bar */}
      <section className="bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700">
                  Verified Marketplace
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Moderated Reviews
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Explore Marketplace Products
              </h1>
            </div>

            {/* Quick Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by brand, model, SKU..."
                className="w-full bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-2xl pl-10 pr-24 py-3 border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedCatId('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCatId === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              All Catalog ({allProducts.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCatId(c.id)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCatId === c.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Marketplace Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              {selectedCatId === 'all' ? 'All Verified Products' : categories.find(c => c.id === selectedCatId)?.name || 'Filtered Products'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredProducts.length} items ranked by authentic customer ratings
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 group"
          >
            <span>Full Catalog View</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3" />
            <p className="text-xs">Loading marketplace catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-slate-500 text-sm">No products matched your search or category filter.</p>
            <button
              onClick={() => { setSelectedCatId('all'); setSearchTerm(''); }}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-purple-600" />
              Browse by Product Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Curated domains with independent product feedback
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-purple-700 hover:text-purple-900"
          >
            View All ({categories.length})
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const IconComponent = iconComponents[category.icon] || Sparkles;
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 shadow-2xs hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 text-xs truncate group-hover:text-purple-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Explore items &rarr;
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Platform Trust & Verification Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">100% Moderated Reviews</h4>
                <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                  Every submitted review passes administrative moderation before affecting live product scores.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Weighted Ranking Engine</h4>
                <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                  Platform scores combine star rating averages with verified customer review volume.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Dual Persona Platform</h4>
                <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                  Dedicated portals for Indian shoppers and merchant sellers with full transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
