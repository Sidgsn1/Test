import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Heart, Award, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
                <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">PRRP</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Product Review and Rating Platform (PRRP) — India's verified, community-first marketplace feedback ecosystem providing transparent insights for smarter shopping.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-purple-300 bg-purple-950/60 px-3 py-1.5 rounded-lg border border-purple-800/50">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Moderated & Verified Reviews
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=consumer-electronics-tech" className="hover:text-purple-400 transition-colors">
                  Electronics & Tech
                </Link>
              </li>
              <li>
                <Link to="/products?category=health-beauty-personal-care" className="hover:text-purple-400 transition-colors">
                  Beauty & Personal Care
                </Link>
              </li>
              <li>
                <Link to="/products?category=home-kitchen-garden" className="hover:text-purple-400 transition-colors">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link to="/products?category=apparel-footwear-accessories" className="hover:text-purple-400 transition-colors">
                  Fashion & Footwear
                </Link>
              </li>
              <li>
                <Link to="/products?category=food-beverage" className="hover:text-purple-400 transition-colors">
                  Food & Beverage
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="hover:text-purple-400 transition-colors">
                  Browse All Products
                </Link>
              </li>
              <li>
                <Link to="/customer/reviews" className="hover:text-purple-400 transition-colors">
                  Write a Review
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="hover:text-purple-400 transition-colors">
                  Seller Central
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-purple-400 transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture / Future Integration */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Architecture
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Designed for Spring Boot REST API + Oracle DB backend microservices.
            </p>
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 text-xs font-mono text-purple-300">
              API Base: <br/>
              <span className="text-slate-300 text-[11px]">localhost:8080/api/v1</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PRRP Marketplace. Built with React + Vite + Tailwind CSS v4.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Community Guidelines</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Moderation Policy</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy & Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
