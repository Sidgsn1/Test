import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowUpRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { sellerService } from '../../services/sellerService';
import RatingStars from '../../components/common/RatingStars';
import { formatINR, formatDate, getModerationBadgeClass } from '../../utils/formatters';

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const sellerId = user?.sellerId || user?.id || 12;

  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [sellerRatingData, setSellerRatingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [sellerId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [prods, revs, ratingInfo] = await Promise.all([
        productService.getSellerProducts(sellerId),
        reviewService.getSellerReviews(sellerId),
        sellerService.getSellerRatings(sellerId)
      ]);
      setProducts(prods || []);
      setReviews(revs || []);
      setSellerRatingData(ratingInfo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;
  const totalReviews = reviews.length;
  const avgRating = products.length > 0
    ? (products.reduce((acc, p) => acc + (p.rating ?? p.averageRating ?? 0), 0) / products.length).toFixed(1)
    : '4.8';

  const pendingModeration = reviews.filter(r => r.moderationStatus === 'PENDING').length;
  const approvedCount = reviews.filter(r => r.moderationStatus === 'APPROVED').length;

  const ratingDistribution = [
    { star: '5 Stars', count: reviews.filter(r => r.rating === 5).length, fill: '#8b5cf6' },
    { star: '4 Stars', count: reviews.filter(r => r.rating === 4).length, fill: '#a78bfa' },
    { star: '3 Stars', count: reviews.filter(r => r.rating === 3).length, fill: '#c4b5fd' },
    { star: '2 Stars', count: reviews.filter(r => r.rating === 2).length, fill: '#ddd6fe' },
    { star: '1 Star', count: reviews.filter(r => r.rating === 1).length, fill: '#ede9fe' },
  ];

  const moderationData = [
    { name: 'Approved', value: approvedCount, color: '#10b981' },
    { name: 'Pending', value: pendingModeration, color: '#f59e0b' },
    { name: 'Rejected', value: reviews.filter(r => r.moderationStatus === 'REJECTED').length, color: '#f43f5e' }
  ].filter(d => d.value > 0);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-xs text-white">
              Seller Merchant Hub
            </span>
            <span className="text-xs text-purple-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Indian Vendor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {user?.companyName || user?.name || 'Seller Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Real-time catalog oversight, buyer review moderation queues, and operational rating metrics.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-2xl font-black">{avgRating}</span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-purple-200 mt-0.5">
              Avg SKU Rating
            </p>
          </div>
          <div className="h-8 w-[1px] bg-white/20" />
          <div className="text-center">
            <span className="text-2xl font-black">★ {sellerRatingData?.overallRating || '4.8'}</span>
            <p className="text-[10px] uppercase font-bold tracking-wider text-purple-200 mt-0.5">
              Seller Score
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog SKUs</span>
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalProducts}</p>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Active listed products</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reviews</span>
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalReviews}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">{approvedCount} approved reviews</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Review Queue</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingModeration}</p>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Awaiting admin review</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Satisfaction</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{sellerRatingData?.positivePercentage || 98.4}%</p>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Verified buyer satisfaction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Ratings Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of customer feedback across star tiers</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              Across all items
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="star" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Review Moderation Status</h3>
            <p className="text-xs text-slate-500">Live platform compliance ratio</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {moderationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={moderationData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                    {moderationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No moderation events logged</p>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Approved Reviews
              </span>
              <span className="font-bold text-slate-900">{approvedCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Pending Verification
              </span>
              <span className="font-bold text-slate-900">{pendingModeration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Associated Products</h3>
            <p className="text-xs text-slate-500">Your products listed on the PRRP marketplace</p>
          </div>
          <Link
            to="/seller/products"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            Manage Catalog <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
              <img
                src={p.thumbnail || p.primaryImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
                alt={p.name}
                className="w-14 h-14 object-cover rounded-xl border border-slate-200"
              />
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-slate-900 truncate">{p.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-amber-600">★ {p.rating ?? p.averageRating ?? 0}</span>
                  <span className="text-[10px] text-slate-400">({p.reviewCount ?? p.totalReviews ?? 0} revs)</span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">{formatINR(p.price)}</p>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-3 text-center py-6 text-xs text-slate-400">
              No products found for this merchant.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Customer Feedback</h3>
            <p className="text-xs text-slate-500">Latest reviews received for your products</p>
          </div>
          <Link
            to="/seller/reviews"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            All Reviews <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {reviews.slice(0, 5).map((rev) => (
            <div key={rev.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <img
                  src={rev.productThumbnail || rev.userAvatar || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                  alt={rev.productName}
                  className="w-10 h-10 object-cover rounded-xl border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rev.productName}</span>
                    <RatingStars rating={rev.rating} size="xs" />
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">"{rev.comment}"</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">By {rev.userName} • {formatDate(rev.createdAt)}</p>
                </div>
              </div>

              <div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${getModerationBadgeClass(rev.moderationStatus)}`}>
                  {rev.moderationStatus}
                </span>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">No customer reviews recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
