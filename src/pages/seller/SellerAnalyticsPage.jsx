import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Star, 
  TrendingUp, 
  Truck, 
  Box, 
  MessageCircle, 
  ShieldCheck,
  CheckCircle,
  ThumbsUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import RatingStars from '../../components/common/RatingStars';
import { formatDate } from '../../utils/formatters';

const SellerAnalyticsPage = () => {
  const { user } = useAuth();
  const sellerId = user?.sellerId || 'seller-1';

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

  // Radar Data for Seller Operational Metrics
  const radarData = sellerRatings ? [
    { subject: 'Shipping Speed', score: sellerRatings.breakdown.shippingSpeed, fullMark: 5 },
    { subject: 'Item As Described', score: sellerRatings.breakdown.itemAsDescribed, fullMark: 5 },
    { subject: 'Packaging Quality', score: sellerRatings.breakdown.packagingQuality, fullMark: 5 },
    { subject: 'Communication', score: sellerRatings.breakdown.customerCommunication, fullMark: 5 },
    { subject: 'Dispatch Time', score: 4.8, fullMark: 5 }
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Seller Rating Analytics & Buyer Feedback</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Detailed metrics evaluating your fulfillment performance, seller ratings, and customer sentiment.
        </p>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Seller Score</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">★ {sellerRatings?.overallRating || '4.8'}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            Top 5% of marketplace vendors
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Fulfillment Rate</span>
            <Truck className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">99.4%</p>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
            Same-day / next-day dispatch
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Packaging Integrity</span>
            <Box className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">★ {sellerRatings?.breakdown.packagingQuality}</p>
          <span className="text-xs text-purple-600 font-medium mt-1 inline-block">
            Zero transit damage reports
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Buyer Response Time</span>
            <MessageCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">&lt; 2 hrs</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">
            98% inquiry resolution rate
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Performance Matrix (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Performance Aspect Radar</h3>
            <p className="text-xs text-slate-500">Multi-axis fulfillment & customer satisfaction ratings</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Radar name="Seller Score" dataKey="score" stroke="#7c3aed" fill="#8b5cf6" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Attributes Bar Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Aspect Score Breakdown</h3>
            <p className="text-xs text-slate-500">Comparison across specific operational deliverables</p>
          </div>

          <div className="space-y-4 pt-4">
            {sellerRatings && Object.entries(sellerRatings.breakdown).map(([key, val]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-bold text-purple-700">★ {val} / 5.0</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                    style={{ width: `${(val / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-purple-900 mt-6">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Separate Seller Rating Architecture
            </p>
            <p className="text-[11px] text-purple-700 mt-1">
              Customer ratings for seller delivery and packaging are segregated from catalog product ratings to prevent SKU rating distortions.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Direct Feedback for Seller */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Direct Customer Feedback for Seller</h3>
          <p className="text-xs text-slate-500">Verified shopper comments specifically addressing merchant service</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sellerRatings?.recentFeedback?.map((fb) => (
            <div key={fb.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{fb.buyerName}</span>
                <span className="text-xs font-bold text-amber-600">★ {fb.rating}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{fb.comment}"
              </p>
              <div className="pt-1 text-[10px] text-slate-400">
                Verified Dispatch • {fb.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerAnalyticsPage;
