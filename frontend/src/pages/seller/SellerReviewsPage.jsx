
import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  ShieldAlert,
  ThumbsUp,
  Package,
  Info
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';
import RatingStars from '../../components/common/RatingStars';
import {
  formatDate,
  getModerationBadgeClass
} from '../../utils/formatters';

const SellerReviewsPage = () => {
  const { user } = useAuth();

  const sellerId = user?.sellerId ?? user?.id;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const loadReviews = useCallback(async () => {
    if (!sellerId) {
      setError('Seller account information not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Fetch all review statuses for the logged-in seller.
      const data = await sellerService.getSellerDashboardReviews(sellerId);

      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load seller reviews:', err);
      setError(err.message || 'Unable to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const filteredReviews = reviews.filter((review) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      review.moderationStatus === statusFilter;

    const matchesRating =
      ratingFilter === 'ALL' ||
      Number(review.rating) === Number(ratingFilter);

    return matchesStatus && matchesRating;
  });

  const approvedCount = reviews.filter(
    (review) => review.moderationStatus === 'APPROVED'
  ).length;

  const pendingCount = reviews.filter(
    (review) => review.moderationStatus === 'PENDING'
  ).length;

  const rejectedCount = reviews.filter(
    (review) => review.moderationStatus === 'REJECTED'
  ).length;

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Product Reviews
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            View customer feedback and track the moderation status of your product reviews.
          </p>
        </div>

        <button
          onClick={loadReviews}
          disabled={loading}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Reviews'}
        </button>
      </div>

      {/* Moderation Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-800">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />

        <div className="space-y-1">
          <p className="font-bold">PRRP Review Moderation Policy</p>
          <p className="text-amber-700 leading-relaxed">
            Sellers can view reviews submitted for their products, including
            pending and rejected reviews. Only Admin can approve or reject reviews.
          </p>
        </div>
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">Approved</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {approvedCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold">Pending</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {pendingCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {rejectedCount}
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === status
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">
            Filter by Rating:
          </span>

          <select
            value={ratingFilter}
            onChange={(event) => setRatingFilter(event.target.value)}
            className="bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="ALL">All Stars</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-sm text-slate-500">
            Loading your reviews...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold text-rose-700">
            {error}
          </p>

          <button
            onClick={loadReviews}
            className="mt-3 text-xs font-bold text-rose-700 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && (
        <div className="space-y-4">

          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >

                {/* Product and Customer Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">

                  <div className="flex items-center gap-3">
                    {review.productThumbnail ? (
                      <img
                        src={review.productThumbnail}
                        alt={review.productName || 'Product'}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-xs text-slate-900">
                        {review.productName || 'Product'}
                      </h4>

                      <p className="text-[11px] text-slate-400">
                        By {review.userName || 'Customer'} •{' '}
                        {review.createdAt
                          ? formatDate(review.createdAt)
                          : 'Date unavailable'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <RatingStars rating={review.rating} size="xs" />

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getModerationBadgeClass(review.moderationStatus)}`}
                    >
                      {review.moderationStatus === 'APPROVED' && (
                        <CheckCircle className="w-3 h-3" />
                      )}

                      {review.moderationStatus === 'PENDING' && (
                        <Clock className="w-3 h-3" />
                      )}

                      {review.moderationStatus === 'REJECTED' && (
                        <XCircle className="w-3 h-3" />
                      )}

                      {review.moderationStatus}
                    </span>
                  </div>

                </div>

                {/* Review Content */}
                <div>
                  {review.title && (
                    <h5 className="font-bold text-slate-900 text-xs mb-1">
                      {review.title}
                    </h5>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Moderation Note */}
                {review.moderationNote && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span>
                      <strong>Moderation Note:</strong>{' '}
                      {review.moderationNote}
                    </span>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {review.likes ?? 0} helpful votes
                  </span>

                  <span className="font-mono text-[10px]">
                    Review ID: {review.id}
                  </span>
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />

              <p className="text-sm font-bold text-slate-800">
                No reviews found
              </p>

              <p className="text-xs text-slate-500 mt-1">
                No reviews match the selected filters.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default SellerReviewsPage;
