import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Filter, 
  Search, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Info, 
  ShieldAlert, 
  ThumbsUp,
  Flag,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import RatingStars from '../../components/common/RatingStars';
import { formatDate, getModerationBadgeClass } from '../../utils/formatters';

const SellerReviewsPage = () => {
  const { user } = useAuth();
  const sellerId = user?.sellerId || 'seller-1';

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [reportingReviewId, setReportingReviewId] = useState(null);
  const [reportReason, setReportReason] = useState('Inappropriate or abusive language');
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    loadReviews();
  }, [sellerId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getSellerReviews(sellerId);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (reviewId) => {
    try {
      await reviewService.reportReview(reviewId, reportReason);
      setReportingReviewId(null);
      setActionNotice('Review has been reported to Admin for review.');
      await loadReviews();
      setTimeout(() => setActionNotice(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchStatus = statusFilter === 'ALL' || r.moderationStatus === statusFilter;
    const matchRating = ratingFilter === 'ALL' || r.rating === Number(ratingFilter);
    return matchStatus && matchRating;
  });

  return (
    <div className="space-y-6">
      {/* Title & Guidelines */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Product Reviews</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Monitor buyer feedback across your catalog and track live editorial review status.
        </p>
      </div>

      {/* Compliance / Policy Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-800">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">PRRP Trust & Governance Rule</p>
          <p className="text-amber-700 leading-relaxed">
            Only <strong>Admin</strong> can approve or reject reviews. Sellers can view reviews for their products and report inappropriate reviews, but cannot moderate them.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {['ALL', 'APPROVED', 'PENDING', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Filter by Rating:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="ALL">All Stars</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars only</option>
            <option value="2">2 Stars only</option>
            <option value="1">1 Star only</option>
          </select>
        </div>
      </div>

      {/* Reviews Table / Feed */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={r.productThumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                    alt={r.productName}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{r.productName}</h4>
                    <p className="text-[11px] text-slate-400">By {r.userName} • {formatDate(r.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RatingStars rating={r.rating} size="xs" />
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getModerationBadgeClass(r.moderationStatus)}`}>
                    {r.moderationStatus === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                    {r.moderationStatus === 'PENDING' && <Clock className="w-3 h-3" />}
                    {r.moderationStatus === 'REJECTED' && <XCircle className="w-3 h-3" />}
                    {r.moderationStatus}
                  </span>
                </div>
              </div>

              <div>
                {r.title && <h5 className="font-bold text-slate-900 text-xs mb-1">{r.title}</h5>}
                <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
              </div>

              {/* Status Note from Moderation */}
              {r.moderationNote && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span><strong>Audit log:</strong> {r.moderationNote}</span>
                </div>
              )}

              {/* Reported badge if reported by seller */}
              {r.reported && (
                <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-700 flex items-center gap-2">
                  <Flag className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  <span><strong>Reported to Admin:</strong> {r.reportReason || 'Flagged for review'}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {r.likes || 0} helpful votes
                  </span>
                  <span className="font-mono text-[10px]">ID: {r.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Seller Report Option */}
                  {!isAdmin && !r.reported && (
                    <button
                      onClick={() => setReportingReviewId(r.id)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors"
                      title="Report inappropriate review to Admin"
                    >
                      <Flag className="w-3 h-3" />
                      Report Inappropriate
                    </button>
                  )}

                  {/* Admin Moderation Actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleModerate(r.id, 'APPROVED')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleModerate(r.id, 'REJECTED')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Inline Report Reason Dialog */}
              {reportingReviewId === r.id && (
                <div className="mt-2 p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
                  <p className="text-xs font-bold text-rose-900">Specify reason for reporting this review to Admin:</p>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-white border border-rose-200 text-xs rounded-lg p-2 text-slate-800"
                  >
                    <option value="Inappropriate or abusive language">Inappropriate or abusive language</option>
                    <option value="Spam or fraudulent review">Spam or fraudulent review</option>
                    <option value="Review mentions competitor product">Review mentions competitor product</option>
                    <option value="Incorrect product reviewed">Incorrect product reviewed</option>
                  </select>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setReportingReviewId(null)}
                      className="text-xs px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReport(r.id)}
                      className="text-xs px-3 py-1 rounded-md bg-rose-600 text-white font-bold hover:bg-rose-700"
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No reviews found matching the filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerReviewsPage;
