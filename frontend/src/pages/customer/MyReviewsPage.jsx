
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  ExternalLink,
  Save,
  X,
  Package
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import RatingStars from '../../components/common/RatingStars';
import {
  formatDate,
  getModerationBadgeClass
} from '../../utils/formatters';

const MyReviewsPage = () => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState('');
  const [editComment, setEditComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [actionMessage, setActionMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    if (user?.id) {
      loadMyReviews();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const showMessage = (message, type = 'success') => {
    setActionMessage(message);
    setMessageType(type);

    setTimeout(() => {
      setActionMessage('');
    }, 5000);
  };

  const loadMyReviews = async () => {
    try {
      setLoading(true);

      const data = await reviewService.getUserReviews(user.id);

      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load customer reviews:', err);
      showMessage(
        err.message || 'Unable to load your reviews.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditTitle(review.title || '');
    setEditComment(review.comment || '');
    setActionMessage('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editingReview) return;

    if (!editTitle.trim() || !editComment.trim()) {
      showMessage('Title and comment are required.', 'error');
      return;
    }

    if (editTitle.trim().length < 3 || editTitle.trim().length > 150) {
      showMessage('Review title must be between 3 and 150 characters.', 'error');
      return;
    }

    if (editComment.trim().length < 10 || editComment.trim().length > 2000) {
      showMessage('Review comment must be between 10 and 2000 characters.', 'error');
      return;
    }

    if (!editingReview.productId) {
      showMessage('Product information is missing. Cannot update this review.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      setActionMessage('');

      // Backend ReviewCreateRequest requires productId even during updates.
      const updatePayload = {
        productId: Number(editingReview.productId),
        rating: Number(editRating),
        title: editTitle.trim(),
        comment: editComment.trim()
      };

      await reviewService.updateReview(
        editingReview.id,
        updatePayload
      );

      setEditingReview(null);

      await loadMyReviews();

      showMessage(
        'Review updated successfully and submitted for admin moderation.'
      );

    } catch (err) {
      console.error('Review update failed:', err);

      showMessage(
        err.message || 'Unable to update review. Please try again.',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);

      showMessage('Review deleted successfully.');

      await loadMyReviews();

    } catch (err) {
      console.error('Review deletion failed:', err);

      showMessage(
        err.message || 'Unable to delete review.',
        'error'
      );
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filterStatus === 'ALL') return true;

    return review.moderationStatus === filterStatus;
  });

  const counts = {
    all: reviews.length,
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Page Header */}
      <div>
        <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-purple-600">
            Home
          </Link>

          <span>/</span>

          <span className="text-slate-800 font-semibold">
            Customer Dashboard
          </span>

          <span>/</span>

          <span className="text-purple-600 font-semibold">
            My Reviews
          </span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Submitted Reviews & Moderation Status
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Review submissions, track moderation status, or revise your feedback.
        </p>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div
          className={`p-4 border rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            messageType === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {messageType === 'error' ? (
            <XCircle className="w-4 h-4 text-rose-600" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          )}

          <span>{actionMessage}</span>
        </div>
      )}

      {/* Moderation Status Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-bold border border-slate-200">

        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            filterStatus === 'ALL'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Reviews ({counts.all})
        </button>

        <button
          onClick={() => setFilterStatus('APPROVED')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            filterStatus === 'APPROVED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Approved ({counts.approved})
        </button>

        <button
          onClick={() => setFilterStatus('PENDING')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            filterStatus === 'PENDING'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending Moderation ({counts.pending})
        </button>

        <button
          onClick={() => setFilterStatus('REJECTED')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            filterStatus === 'REJECTED'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Rejected ({counts.rejected})
        </button>

      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl h-40 animate-pulse border border-slate-100 p-6"
            />
          ))}
        </div>
      ) : filteredReviews.length > 0 ? (

        <div className="space-y-4">

          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow"
            >

              {/* Product and Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  {review.productThumbnail ? (
                    <img
                      src={review.productThumbnail}
                      alt={review.productName || 'Product'}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                  )}

                  <div>
                    <Link
                      to={`/products/${review.productId}`}
                      className="font-bold text-slate-900 text-sm hover:text-purple-600 flex items-center gap-1.5"
                    >
                      <span>{review.productName}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <RatingStars rating={review.rating} size="xs" />
                      <span>•</span>
                      <time>
                        {formatDate(review.createdAt)}
                      </time>
                    </div>
                  </div>
                </div>

                {/* Moderation Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getModerationBadgeClass(review.moderationStatus)}`}
                  >
                    {review.moderationStatus === 'APPROVED' && (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}

                    {review.moderationStatus === 'PENDING' && (
                      <Clock className="w-3.5 h-3.5" />
                    )}

                    {review.moderationStatus === 'REJECTED' && (
                      <XCircle className="w-3.5 h-3.5" />
                    )}

                    {review.moderationStatus}
                  </span>
                </div>

              </div>

              {/* Review Content */}
              <div className="mt-4 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  {review.title}
                </h4>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {review.comment}
                </p>

                {review.moderationNote && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                    <span className="font-bold text-slate-700">
                      Moderator Note:
                    </span>

                    <span>{review.moderationNote}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">

                <span className="text-xs text-slate-400">
                  {review.likes || 0} users marked this review helpful
                </span>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() => handleOpenEdit(review)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Review
                  </button>

                  <button
                    onClick={() => handleDelete(review.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>

                </div>
              </div>

            </div>
          ))}

        </div>

      ) : (

        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <MessageSquare className="w-12 h-12 text-purple-200 mx-auto mb-3" />

          <h3 className="text-lg font-bold text-slate-900">
            No reviews found
          </h3>

          <p className="text-xs text-slate-500 mt-1 mb-6">
            You don't have any reviews matching the selected filter status.
          </p>

          <Link
            to="/products"
            className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-colors inline-block"
          >
            Browse Products to Review
          </Link>
        </div>

      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">

          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-4 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Edit Product Review
              </h3>

              <button
                onClick={() => setEditingReview(null)}
                disabled={isSaving}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              Updating this review will automatically set its moderation status to{' '}
              <strong>PENDING</strong> for verification.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Overall Rating
                </label>

                <RatingStars
                  rating={editRating}
                  interactive={true}
                  size="lg"
                  onChange={setEditRating}
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Review Title
                </label>

                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={150}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2 border border-slate-200 focus:border-purple-600 outline-none"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Review Text
                </label>

                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl p-3 border border-slate-200 focus:border-purple-600 outline-none resize-y"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />

                  {isSaving ? 'Saving...' : 'Save & Resubmit'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyReviewsPage;
