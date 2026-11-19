import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Star, 
  Search, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isSeller, isAdmin, isCustomer, logout } = useAuth();
  const [navSearch, setNavSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-purple-900 text-purple-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">PRRP Indian Marketplace Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-purple-200">
              Role: <strong className="text-white capitalize">{user?.role || 'Guest'}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-600 bg-clip-text text-transparent">
                PRRP
              </span>
              <span className="hidden sm:inline-block ml-1 text-[11px] font-semibold text-purple-600 uppercase tracking-widest">
                Reviews
              </span>
            </div>
          </Link>

          {/* Search Bar (Customer Discovery) */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, brands, categories (e.g. Headphones, Serum, Cookware)..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-sm rounded-xl pl-10 pr-24 py-2 border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-purple-700 bg-purple-50' : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname.startsWith('/products') ? 'text-purple-700 bg-purple-50' : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'
              }`}
            >
              Browse Products
            </Link>

            {/* Seller direct dashboard link if logged in as seller */}
            {isSeller && (
              <Link
                to="/seller/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                  location.pathname.startsWith('/seller') ? 'text-purple-700 bg-purple-50 font-semibold' : 'text-slate-700 hover:text-purple-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-purple-600" />
                Seller Central
              </Link>
            )}

            {/* Admin direct dashboard link if logged in as admin */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                  location.pathname.startsWith('/admin') ? 'text-amber-700 bg-amber-50 font-semibold' : 'text-slate-700 hover:text-amber-700 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Admin Panel
              </Link>
            )}

            {/* Customer reviews shortcut if logged in as customer */}
            {isCustomer && (
              <Link
                to="/customer/reviews"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/customer/reviews') ? 'text-purple-700 bg-purple-50' : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'
                }`}
              >
                My Reviews
              </Link>
            )}
          </nav>

          {/* User Profile / Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 rounded-full border border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-300"
                  />
                  <div className="text-left hidden sm:block pr-1">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1 leading-tight">{user.name}</p>
                    <p className="text-[10px] uppercase font-bold text-purple-600">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 capitalize">
                          {user.role} Account
                        </span>
                      </div>

                      {isCustomer && (
                        <>
                          <Link
                            to="/customer/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                          >
                            <User className="w-4 h-4 text-purple-500" />
                            My Profile
                          </Link>
                          <Link
                            to="/customer/reviews"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                          >
                            <Star className="w-4 h-4 text-amber-500" />
                            My Reviews & Ratings
                          </Link>
                        </>
                      )}

                      {isSeller && (
                        <>
                          <Link
                            to="/seller/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                          >
                            <LayoutDashboard className="w-4 h-4 text-purple-500" />
                            Seller Dashboard
                          </Link>
                          <Link
                            to="/seller/products"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                          >
                            <ShoppingBag className="w-4 h-4 text-indigo-500" />
                            My Products
                          </Link>
                          <Link
                            to="/seller/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                          >
                            <User className="w-4 h-4 text-purple-500" />
                            Store Profile
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                            Admin Dashboard
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, brands..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 text-sm rounded-xl pl-10 pr-20 py-2 border border-slate-200 outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold"
              >
                Go
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-100 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
          >
            Browse Products
          </Link>

          {isSeller && (
            <Link
              to="/seller/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-purple-700 bg-purple-50"
            >
              Seller Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-amber-700 bg-amber-50"
            >
              Admin Dashboard
            </Link>
          )}

          {isCustomer && (
            <>
              <Link
                to="/customer/reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
              >
                My Reviews
              </Link>
              <Link
                to="/customer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
              >
                My Profile
              </Link>
            </>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                logout();
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
