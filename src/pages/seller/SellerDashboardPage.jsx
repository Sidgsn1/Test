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
  const sellerId = user?.sellerId || 'seller-1';

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
      setProducts(prods);
      setReviews(revs);
      setSellerRatingData(ratingInfo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics computation
  const totalProducts = products.length;
  const totalReviews = reviews.length;
  const avgRating = products.length > 0
    ? (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1)
    : '4.8';

  const pendingModeration = reviews.filter(r => r.moderationStatus === 'PENDING').length;
  const approvedCount = reviews.filter(r => r.moderationStatus === 'APPROVED').length;

  // Chart Data: Rating Breakdown
  const ratingDistribution = [
    { star: '5 Stars', count: reviews.filter(r => r.rating === 5).length, fill: '#8b5cf6' },
    { star: '4 Stars', count: reviews.filter(r => r.rating === 4).length, fill: '#a78bfa' },
    { star: '3 Stars', count: reviews.filter(r => r.rating === 3).length, fill: '#c4b5fd' },
    { star: '2 Stars', count: reviews.filter(r => r.rating === 2).length, fill: '#ddd6fe' },
    { star: '1 Star', count: reviews.filter(r => r.rating === 1).length, fill: '#ede9fe' },
  ];

  // Pie Data: Moderation status
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified Indian Merchant Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.companyName || user?.name}
          </h2>
          <p className="text-sm text-purple-200 mt-1 max-w-xl">
            Track your product feedback, moderation queues, and merchant performance in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
          <Award className="w-8 h-8 text-amber-300" />
          <div>
            <p className="text-xs text-purple-200 font-medium">Merchant Score</p>
            <p className="text-xl font-black text-white">4.8 / 5.0</p>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Products</span>
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalProducts}</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">
            All active in catalog
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Customer Reviews</span>
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalReviews}</p>
          <span className="text-xs text-purple-600 font-medium mt-1 inline-block">
            Across listed catalog
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Avg Rating</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">★ {avgRating}</p>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            Weighted across 900+ ratings
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">In Moderation Queue</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{pendingModeration}</p>
          <span className="text-xs text-amber-600 font-medium mt-1 inline-block">
            Pending editorial review
          </span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Rating Distribution Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Reviews Rating Distribution</h3>
            <p className="text-xs text-slate-500">Volume of customer ratings received by star score</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="star" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Moderation Status Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Moderation Status Pipeline</h3>
            <p className="text-xs text-slate-500">Tracking compliance of user submitted feedback</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {moderationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moderationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {moderationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No moderation data</p>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Approved ({approvedCount})
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              Pending ({pendingModeration})
            </span>
          </div>
        </div>
      </div>

      {/* Associated Products Quick View */}
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
              <img src={p.thumbnail} alt={p.name} className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-slate-900 truncate">{p.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-amber-600">★ {p.rating}</span>
                  <span className="text-[10px] text-slate-400">({p.reviewCount} revs)</span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-1">{formatINR(p.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews Preview */}
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
            Review Moderation Queue <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {reviews.slice(0, 3).map((r) => (
            <div key={r.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-slate-900">{r.userName}</span>
                  <span className="text-xs text-slate-400">• on {r.productName}</span>
                  <RatingStars rating={r.rating} size="xs" />
                </div>
                <p className="text-xs text-slate-600 line-clamp-1">{r.comment}</p>
              </div>

              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border self-start sm:self-auto ${getModerationBadgeClass(r.moderationStatus)}`}>
                {r.moderationStatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
