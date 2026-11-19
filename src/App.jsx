import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import SellerLayout from './components/layout/SellerLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Customer & Public Pages
import HomePage from './pages/customer/HomePage';
import ProductListPage from './pages/customer/ProductListPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import MyReviewsPage from './pages/customer/MyReviewsPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Seller Pages
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import SellerReviewsPage from './pages/seller/SellerReviewsPage';
import SellerAnalyticsPage from './pages/seller/SellerAnalyticsPage';
import SellerRankingsPage from './pages/seller/SellerRankingsPage';
import SellerProfilePage from './pages/seller/SellerProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function App() {
  return (
    <Routes>
      {/* Public / Customer Flow */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        {/* Customer Protected Pages */}
        <Route
          path="customer/reviews"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MyReviewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer/profile"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Auth Pages */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>

      {/* Seller Portal Flow (Protected for seller ONLY) */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={['seller']}>
            <SellerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/seller/dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboardPage />} />
        <Route path="products" element={<SellerProductsPage />} />
        <Route path="reviews" element={<SellerReviewsPage />} />
        <Route path="analytics" element={<SellerAnalyticsPage />} />
        <Route path="rankings" element={<SellerRankingsPage />} />
        <Route path="profile" element={<SellerProfilePage />} />
      </Route>

      {/* Admin Portal Flow (Protected for admin ONLY) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
