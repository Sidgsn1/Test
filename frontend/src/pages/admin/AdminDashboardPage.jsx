
import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  ShieldAlert,
  RefreshCw,
  Eye,
  X,
  MessageSquare,
  Package,
  User
} from 'lucide-react';

import { reviewService } from '../../services/reviewService';
import RatingStars from '../../components/common/RatingStars';
import {
  formatDate,
  getModerationBadgeClass
} from '../../utils/formatters';

const AdminDashboardPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionNotice, setActionNotice] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await reviewService.getAllReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError(err.message || 'Unable to load reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleModerate = async (id, status) => {
    if (processingId !== null) return;

    try {
      setProcessingId(id);
      setError('');
      setActionNotice('');

      const note =
        status === 'APPROVED'
          ? 'Approved by Admin'
          : 'Rejected by Admin';

      await reviewService.moderateReview(id, status, note);

      setActionNotice(
        `Review #${id} ${status.toLowerCase()} successfully.`
      );

      setSelectedReview(null);

      await loadAll();
    } catch (err) {
      console.error('Moderation failed:', err);
      setError(err.message || 'Unable to update review status.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    return (
      statusFilter === 'ALL' ||
      review.moderationStatus === statusFilter
    );
  });

  const totals = {
    total: reviews.length,
    approved: reviews.filter(
      (r) => r.moderationStatus === 'APPROVED'
    ).length,
    pending: reviews.filter(
      (r) => r.moderationStatus === 'PENDING'
    ).length,
    rejected: reviews.filter(
      (r) => r.moderationStatus === 'REJECTED'
    ).length
  };

  const isPending = (review) =>
    review?.moderationStatus === 'PENDING';

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Review Moderation Dashboard
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Review customer feedback and approve or reject reviews before publication.
          </p>
        </div>

        <button
          onClick={loadAll}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-purple-300 text-xs font-semibold text-slate-700 rounded-xl transition-all shadow-2xs disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              loading ? 'animate-spin text-purple-600' : ''
            }`}
          />
          Refresh Queue
        </button>
      </div>

      {/* Policy Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-800">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />

        <div>
          <p className="font-bold">Review Moderation Policy</p>
          <p className="text-amber-700 leading-relaxed mt-1">
            Only Admin can approve or reject reviews. Approved reviews
            become publicly visible on the platform.
          </p>
        </div>
      </div>

      {/* Success Notice */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Reviews
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {totals.total}
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Pending Review
          </p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {totals.pending}
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">
            Approved
          </p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {totals.approved}
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-500">
            Rejected
          </p>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {totals.rejected}
          </p>
        </div>

      </div>

      {/* Status Filters */}
      <div className="flex gap-2 items-center flex-wrap">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => {
          const count =
            status === 'ALL'
              ? reviews.length
              : reviews.filter(
                  (r) => r.moderationStatus === status
                ).length;

          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">

            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Reviewer</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Review</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-2" />
                    <p>Loading moderation queue...</p>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No reviews found for this status.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-purple-50/20 transition-colors"
                  >

                    {/* Product */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-2.5">
                        {review.productThumbnail ? (
                          <img
                            src={review.productThumbnail}
                            alt={review.productName || 'Product'}
                            className="w-10 h-10 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-slate-400" />
                          </div>
                        )}

                        <span className="font-bold text-slate-900 text-xs max-w-[140px] line-clamp-2">
                          {review.productName || 'Product'}
                        </span>
                      </div>
                    </td>

                    {/* Reviewer */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-2">
                        {review.userAvatar ? (
                          <img
                            src={review.userAvatar}
                            alt={review.userName || 'Reviewer'}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-slate-800 whitespace-nowrap">
                            {review.userName || 'Customer'}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {review.createdAt
                              ? formatDate(review.createdAt)
                              : 'Date unavailable'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <RatingStars rating={review.rating} size="xs" />
                        <span className="font-bold text-slate-800 ml-1">
                          {review.rating}
                        </span>
                      </div>
                    </td>

                    {/* Review Content */}
                    <td className="py-4 px-4 align-top max-w-md">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-xs line-clamp-1">
                          {review.title || 'Untitled Review'}
                        </p>

                        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                          {review.comment}
                        </p>

                        {review.images?.length > 0 && (
                          <div className="flex items-center gap-1.5 pt-1">
                            {review.images.map((img, index) => (
                              <a
                                key={index}
                                href={img}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={img}
                                  alt="Customer attachment"
                                  className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getModerationBadgeClass(review.moderationStatus)}`}
                      >
                        {review.moderationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">

                        <button
                          type="button"
                          onClick={() => setSelectedReview(review)}
                          className="p-1.5 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 rounded-lg transition-colors"
                          title="View review details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {isPending(review) && (
                          <>
                            <button
                              disabled={processingId === review.id}
                              onClick={() =>
                                handleModerate(review.id, 'APPROVED')
                              }
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs disabled:opacity-50"
                            >
                              Approve
                            </button>

                            <button
                              disabled={processingId === review.id}
                              onClick={() =>
                                handleModerate(review.id, 'REJECTED')
                              }
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-5 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Review Details
                </h3>
              </div>

              <button
                onClick={() => setSelectedReview(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">

              {/* Product */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                {selectedReview.productThumbnail ? (
                  <img
                    src={selectedReview.productThumbnail}
                    alt={selectedReview.productName || 'Product'}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                )}

                <div>
                  <p className="text-[11px] uppercase font-bold text-purple-600">
                    Product Under Review
                  </p>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedReview.productName || 'Product'}
                  </p>
                </div>
              </div>

              {/* Reviewer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedReview.userAvatar ? (
                    <img
                      src={selectedReview.userAvatar}
                      alt={selectedReview.userName || 'Reviewer'}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-slate-900 text-xs">
                      {selectedReview.userName || 'Customer'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {selectedReview.createdAt
                        ? formatDate(selectedReview.createdAt)
                        : 'Date unavailable'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                  <RatingStars rating={selectedReview.rating} size="xs" />
                  <span className="font-bold text-amber-700 text-xs">
                    {selectedReview.rating}.0
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-2">
                <p className="font-bold text-slate-900 text-sm">
                  {selectedReview.title || 'Untitled Review'}
                </p>

                <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                  {selectedReview.comment}
                </p>
              </div>

              {/* Images */}
              {selectedReview.images?.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-700">
                    Customer Attachments
                  </p>

                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {selectedReview.images.map((img, index) => (
                      <a
                        key={index}
                        href={img}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={img}
                          alt="Customer attachment"
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Moderation Status */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getModerationBadgeClass(selectedReview.moderationStatus)}`}
                >
                  {selectedReview.moderationStatus}
                </span>

                {isPending(selectedReview) ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleModerate(selectedReview.id, 'REJECTED')
                      }
                      disabled={processingId === selectedReview.id}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        handleModerate(selectedReview.id, 'APPROVED')
                      }
                      disabled={processingId === selectedReview.id}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">
                    Already moderated
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
