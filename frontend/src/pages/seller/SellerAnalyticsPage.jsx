import React, { useState, useEffect } from 'react';
import { 
  Star, 
  TrendingUp, 
  Package, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  CheckCircle,
  ThumbsUp,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import RatingStars from '../../components/common/RatingStars';
import { formatINR } from '../../utils/formatters';

const SellerAnalyticsPage = () => {
  const { user } = useAuth();
  const sellerId = user?.sellerId || user?.id || 12;

  const [sellerRatings, setSellerRatings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [sellerId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await sellerService.getSellerRatings(sellerId);
      setSellerRatings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  const distribution = sellerRatings?.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const totalApproved = Number(sellerRatings?.totalSellerReviews || 0);

  const productPerfData = (sellerRatings?.productPerformance || []).map((p) => ({
    name: p.name.length > 22 ? p.name.substring(0, 22) + '...' : p.name,
    fullName: p.name,
    rating: p.averageRating,
    reviews: p.reviewCount,
    price: p.price
  }));

  const ratingTiers = [5, 4, 3, 2, 1].map((star) => {
    const count = Number(distribution[star] || 0);
    const pct = totalApproved > 0 ? Math.round((count / totalApproved) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Seller Rating Analytics & Buyer Feedback</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time catalog performance, star rating distribution, and verified buyer reviews from the database.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Store Score</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">★ {sellerRatings?.overallRating ?? '0.0'}</p>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            Across {totalApproved} approved ratings
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Positive Sentiment</span>
            <ThumbsUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{sellerRatings?.positivePercentage ?? 0}%</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            Rated 4 or 5 stars
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Products</span>
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{sellerRatings?.totalProducts ?? 0}</p>
          <span className="text-xs text-purple-600 font-medium mt-1 inline-block">
            Active listed catalog items
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Moderation Health</span>
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {sellerRatings?.approvedReviews ?? 0}
            <span className="text-xs font-normal text-slate-400 ml-1.5">approved</span>
          </p>
          <span className="text-xs text-amber-600 font-medium mt-1 inline-block">
            {sellerRatings?.pendingReviews ?? 0} in admin moderation
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Product Rating Comparison</h3>
              <p className="text-xs text-slate-500">Average star rating per product SKU</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              Live Catalog Data
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            {productPerfData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productPerfData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                            <p className="font-bold">{data.fullName}</p>
                            <p className="text-amber-300">★ {data.rating} / 5.0</p>
                            <p className="text-slate-300">{data.reviews} verified reviews</p>
                            <p className="text-purple-300">{formatINR(data.price)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="rating" radius={[8, 8, 0, 0]} fill="#8b5cf6" barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No catalog items available.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Star Rating Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown of customer reviews across 1 to 5 stars</p>
          </div>

          <div className="space-y-4 pt-3">
            {ratingTiers.map(({ star, count, pct }) => (
              <div key={star} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <span>{star} Star</span>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </span>
                  <span className="font-bold text-slate-800">
                    {count} <span className="font-normal text-slate-400">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-purple-900 mt-6">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Verified Review Integrity
            </p>
            <p className="text-[11px] text-purple-700 mt-1">
              Only reviews passing administrative moderation are factored into publicly displayed average SKU ratings.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Direct Customer Feedback for Seller</h3>
          <p className="text-xs text-slate-500">Real customer ratings and comments recorded in database</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(sellerRatings?.recentFeedback || []).map((fb) => (
            <div key={fb.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{fb.buyerName}</span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {fb.rating}.0
                  </span>
                </div>
                {fb.productName && (
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider truncate">
                    {fb.productName}
                  </p>
                )}
                {fb.title && (
                  <p className="font-bold text-xs text-slate-800 line-clamp-1">
                    {fb.title}
                  </p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">
                  "{fb.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>Verified Purchase</span>
                <span>{fb.date}</span>
              </div>
            </div>
          ))}
          {(!sellerRatings?.recentFeedback || sellerRatings.recentFeedback.length === 0) && (
            <div className="col-span-3 text-center text-xs text-slate-400 py-8">
              No customer reviews recorded yet for your products.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerAnalyticsPage;
