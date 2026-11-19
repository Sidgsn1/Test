import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  BarChart3, 
  Trophy, 
  UserCheck, 
  Store, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SellerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/seller/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/seller/products', label: 'My Products', icon: Package },

    { to: '/seller/analytics', label: 'Rating Analytics', icon: BarChart3 },
    { to: '/seller/rankings', label: 'Product Rankings', icon: Trophy },
    { to: '/seller/profile', label: 'Seller Profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 md:min-h-screen">
        {/* Brand / Store Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5 text-purple-100" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Seller Central</h2>
              <p className="text-xs text-purple-400 font-medium">PRRP Merchant Hub</p>
            </div>
          </div>
        </div>

        {/* Seller Info Summary */}
        <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover border border-purple-500"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.companyName || user?.name}</p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" />
                Verified Merchant
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </NavLink>
            );
          })}
        </nav>

        {/* Footer actions in sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Seller Dashboard</h1>
            <p className="text-xs text-slate-500">Monitor store reputation, product analytics, and customer reviews.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-medium text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              View Live Storefront
            </Link>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
