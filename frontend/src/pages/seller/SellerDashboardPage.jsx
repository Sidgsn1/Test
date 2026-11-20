
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  MessageSquare,
  Star,
  TrendingUp,
  Clock,
  ArrowUpRight
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
import { sellerService } from '../../services/sellerService';
import RatingStars from '../../components/common/RatingStars';
import {
  formatINR,
  formatDate,
  getModerationBadgeClass
} from '../../utils/formatters';

const SellerDashboardPage = () => {
  const { user } = useAuth();

  const sellerId = user?.sellerId ?? user?.id;

  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [sellerRatingData, setSellerRatingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = useCallback(async () => {
    if (!sellerId) {
      setError('Seller information is unavailable. Please sign in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [prods, revs, ratingInfo] = await Promise.all([
        productService.getSellerProducts(sellerId),
        sellerService.getSellerDashboardReviews(sellerId),
        sellerService.getSellerRatings(sellerId)
      ]);

      setProducts(Array.isArray(prods) ? prods : []);
      setReviews(Array.isArray(revs) ? revs : []);
      setSellerRatingData(ratingInfo);

    } catch (err) {
      console.error('Seller dashboard loading failed:', err);
      setError(err.message || 'Unable to load seller dashboard.');
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const totalProducts = products.length;
  const totalReviews = reviews.length;

  const approvedReviews = reviews.filter(
    review => review.moderationStatus === 'APPROVED'
  );

  const pendingModeration = reviews.filter(
    review => review.moderationStatus === 'PENDING'
  ).length;

  const approvedCount = approvedReviews.length;

  const rejectedCount = reviews.filter(
    review => review.moderationStatus === 'REJECTED'
  ).length;

  const avgRating = Number(sellerRatingData?.overallRating ?? 0);

  const positivePercentage = Number(
    sellerRatingData?.positivePercentage ?? 0
  );

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star: star === 1 ? '1 Star' : `${star} Stars`,
    count: approvedReviews.filter(
      review => Number(review.rating) === star
    ).length
  }));

  const moderationData = [
    { name: 'Approved', value: approvedCount, color: '#10b981' },
    { name: 'Pending', value: pendingModeration, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedCount, color: '#f43f5e' }
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center">
        <p className="text-sm font-semibold text-rose-600">{error}</p>

        <button
          onClick={loadDashboardData}
          className="mt-4 px-5 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white">
            Seller Merchant Hub
          </span>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">
            {user?.companyName || user?.name || 'Seller Dashboard'}
          </h1>

          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Monitor your products, customer reviews and seller performance.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/15">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-2xl font-black">
                {avgRating.toFixed(1)}
              </span>
            </div>

            <p className="text-[10px] uppercase font-bold tracking-wider text-purple-200 mt-0.5">
              Seller Rating
            </p>
          </div>

          <div className="h-8 w-[1px] bg-white/20" />

          <div className="text-center">
            <span className="text-2xl font-black">
              {positivePercentage.toFixed(1)}%
            </span>

            <p className="text-[10px] uppercase font-bold tracking-wider text-purple-200 mt-0.5">
              Positive Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Catalog SKUs
            </span>
            <Package className="w-5 h-5 text-purple-600" />
          </div>

          <p className="text-2xl font-black text-slate-900">
            {totalProducts}
          </p>

          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            Listed products
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Reviews
            </span>
            <MessageSquare className="w-5 h-5 text-indigo-600" />
          </div>

          <p className="text-2xl font-black text-slate-900">
            {totalReviews}
          </p>

          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            {approvedCount} approved reviews
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Review Queue
            </span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>

          <p className="text-2xl font-black text-amber-600">
            {pendingModeration}
          </p>

          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            Awaiting admin moderation
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Satisfaction
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>

          <p className="text-2xl font-black text-emerald-600">
            {positivePercentage.toFixed(1)}%
          </p>

          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            Based on approved reviews
          </span>
        </div>
      </div>

      {/* Rating Distribution and Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Ratings Distribution
            </h3>

            <p className="text-xs text-slate-500">
              Approved customer reviews across star ratings
            </p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ratingDistribution}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                />

                <XAxis type="number" hide />

                <YAxis
                  dataKey="star"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                  radius={[0, 8, 8, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Review Moderation Status
            </h3>

            <p className="text-xs text-slate-500">
              Review approval breakdown
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {moderationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moderationData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {moderationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">
                No reviews available
              </p>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {moderationData.map(item => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name} Reviews
                </span>

                <span className="font-bold text-slate-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Associated Products */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Associated Products
            </h3>

            <p className="text-xs text-slate-500">
              Your products listed on the PRRP marketplace
            </p>
          </div>

          <Link
            to="/seller/products"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            Manage Catalog <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.map(product => (
            <div
              key={product.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3"
            >
              {product.thumbnail || product.primaryImageUrl ? (
                <img
                  src={product.thumbnail || product.primaryImageUrl}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center">
                  <Package className="w-6 h-6 text-slate-500" />
                </div>
              )}

              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-slate-900 truncate">
                  {product.name}
                </h4>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-amber-600">
                    ★ {Number(
                      product.rating ?? product.averageRating ?? 0
                    ).toFixed(1)}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    ({product.reviewCount ?? product.totalReviews ?? 0} reviews)
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-800 mt-1">
                  {formatINR(product.price)}
                </p>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-3 text-center py-6 text-xs text-slate-400">
              No products found for this seller.
            </div>
          )}
        </div>
      </div>

      {/* Recent Customer Feedback */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Recent Customer Feedback
            </h3>

            <p className="text-xs text-slate-500">
              Latest reviews received for your products
            </p>
          </div>

          <Link
            to="/seller/reviews"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            All Reviews <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {reviews.slice(0, 5).map(review => (
            <div
              key={review.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                {review.productThumbnail ? (
                  <img
                    src={review.productThumbnail}
                    alt={review.productName || 'Product'}
                    className="w-10 h-10 object-cover rounded-xl border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-slate-400" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      {review.productName}
                    </span>

                    <RatingStars rating={review.rating} size="xs" />
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    "{review.comment}"
                  </p>

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    By {review.userName || 'Customer'} • {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${getModerationBadgeClass(review.moderationStatus)}`}
                >
                  {review.moderationStatus}
                </span>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">
              No customer reviews recorded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
