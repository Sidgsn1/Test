import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  Shirt,
  Smartphone,
  Home,
  Wrench,
  Coffee,
  Dumbbell,
  Gamepad2
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
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [heroSearch, setHeroSearch] = useState('');
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
        productService.getProducts({ sortBy: 'rating-desc' })
      ]);
      setCategories(cats);
      setFeaturedProducts(prods.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white py-16 sm:py-24">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>India's Transparent Product Review & Rating Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Discover Verified Reviews. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-300 via-pink-200 to-white bg-clip-text text-transparent">
              Shop with Uncompromised Confidence.
            </span>
          </h1>

          <p className="text-purple-200 text-sm sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Unbiased community feedback, category-ranked products, and authenticated seller ratings tailored for modern Indian consumers.
          </p>

          {/* Large Hero Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleHeroSearch} className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white p-1.5 border border-purple-200/40">
              <div className="pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search products, brands, or categories (e.g. Headphones, Serum, Cookware)..."
                className="w-full px-4 py-3 text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none bg-transparent"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 sm:px-7 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-purple-200">
              <span className="font-semibold text-purple-300">Popular:</span>
              <Link to="/products?category=consumer-electronics-tech" className="hover:text-white underline decoration-purple-400">
                ANC Headphones
              </Link>
              <span>•</span>
              <Link to="/products?category=health-beauty-personal-care" className="hover:text-white underline decoration-purple-400">
                Kumkumadi Serum
              </Link>
              <span>•</span>
              <Link to="/products?category=home-kitchen-garden" className="hover:text-white underline decoration-purple-400">
                Tri-Ply Cookware
              </Link>
              <span>•</span>
              <Link to="/products?category=food-beverage" className="hover:text-white underline decoration-purple-400">
                Arabica Coffee
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-black text-white">8</p>
              <p className="text-xs text-purple-200 font-medium">Core Categories</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-black text-amber-300">100%</p>
              <p className="text-xs text-purple-200 font-medium">Moderated Reviews</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-black text-white">₹ INR</p>
              <p className="text-xs text-purple-200 font-medium">Indian Pricing</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-black text-emerald-400">2-Way</p>
              <p className="text-xs text-purple-200 font-medium">Customer & Seller Hub</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eight Category Cards in Responsive Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Explore By Domain
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Eight Curated Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse authentic ratings and feedback across the platform's primary product categories.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-700 hover:text-purple-900 group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 8 Category Cards Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = iconComponents[category.icon] || Sparkles;
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative bg-white rounded-2xl border border-purple-100/80 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image Header with Gradient Overlay */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                  
                  {/* Category Icon Badge */}
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md text-purple-700 flex items-center justify-center shadow-md">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Item count tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold bg-purple-600/90 backdrop-blur-xs px-2 py-0.5 rounded-full">
                      {category.itemCount}+ Reviewed Items
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition-colors leading-snug mb-1">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600 group-hover:text-purple-800">
                    <span>Explore Products</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured / Top Rated Products */}
      <section className="bg-purple-50/50 py-16 border-y border-purple-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5" />
                Community Favorites
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Top Rated Products
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Highest scored electronics, wellness serums, home cookware & gourmet coffee.
              </p>
            </div>
            <Link
              to="/products?sort=rating-desc"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-700 hover:text-purple-900 group"
            >
              <span>See Full Rankings</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency Feature Blocks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl text-white p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-800/60 px-3 py-1 rounded-full border border-purple-700">
                Platform Integrity
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                Engineered for Authentic Indian Commerce
              </h3>
              <p className="text-sm text-purple-200 leading-relaxed">
                PRRP eliminates deceptive astroturfing and sponsored spam through multi-layer verification and separate seller accountability.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15">
                <ShieldCheck className="w-7 h-7 text-emerald-400 mb-2" />
                <h4 className="font-bold text-sm text-white mb-1">Human & Automated Moderation</h4>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Every submitted feedback piece transitions through moderation before appearing on live storefronts.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15">
                <Star className="w-7 h-7 text-amber-300 mb-2" />
                <h4 className="font-bold text-sm text-white mb-1">Independent Seller Ratings</h4>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Seller performance metrics (dispatch speed, packaging) are stored separately from product build quality.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15">
                <TrendingUp className="w-7 h-7 text-indigo-300 mb-2" />
                <h4 className="font-bold text-sm text-white mb-1">Weighted Ranking Algorithm</h4>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Rankings balance pure score averages with verified volume so niche products don't artificially dominate.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15">
                <Award className="w-7 h-7 text-pink-300 mb-2" />
                <h4 className="font-bold text-sm text-white mb-1">Customer Dashboard</h4>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Shoppers track moderation statuses, edit draft reviews, and showcase Top Reviewer community badges.
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
