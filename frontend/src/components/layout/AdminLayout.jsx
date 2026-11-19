import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        {/* Logo */}
        <Link to="/admin/dashboard" className="text-2xl font-bold text-purple-700">
          PRRP Admin
        </Link>
        {/* Profile dropdown (simplified) */}
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-8 h-8 rounded-full border border-purple-200"
          />
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
