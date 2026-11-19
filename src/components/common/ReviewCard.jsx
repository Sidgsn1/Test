import React, { useState } from 'react';
import { ThumbsUp, CheckCircle, Clock, XCircle, Edit3, Trash2 } from 'lucide-react';
import RatingStars from './RatingStars';
import { formatDate, getModerationBadgeClass } from '../../utils/formatters';

const ReviewCard = ({
  review,
  onLike,
  onEdit,
  onDelete,
  canManage = false,
  showModerationStatus = false,
  compact = false
}) => {
  const [likes, setLikes] = useState(review.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      if (onLike) onLike(review.id);
    }
  };

  const getModerationIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'PENDING':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case 'REJECTED':
        return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-shadow hover:shadow-md ${compact ? 'text-sm' : ''}`}>
      {/* Header: User & Rating */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={review.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={review.userName}
            className="w-10 h-10 rounded-full object-cover border border-purple-100 ring-2 ring-purple-50"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900">{review.userName}</span>
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <RatingStars rating={review.rating} size="xs" />
              <span>•</span>
              <time>{formatDate(review.createdAt)}</time>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {showModerationStatus && (
          <div className="flex flex-col items-end gap-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getModerationBadgeClass(review.moderationStatus)}`}>
              {getModerationIcon(review.moderationStatus)}
              {review.moderationStatus}
            </span>
          </div>
        )}
      </div>

      {/* Moderation note if available */}
      {showModerationStatus && review.moderationNote && (
        <div className="mt-2.5 text-xs text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-100">
          <span className="font-semibold text-slate-700">Moderation Note: </span>
          {review.moderationNote}
        </div>
      )}

      {/* Title & Body */}
      <div className="mt-3.5">
        {review.title && (
          <h4 className="font-bold text-slate-900 text-sm mb-1.5">
            {review.title}
          </h4>
        )}
        <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
          {review.comment}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <button
          type="button"
          onClick={handleLike}
          disabled={hasLiked}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            hasLiked
              ? 'bg-purple-50 text-purple-700 border-purple-200 cursor-default'
              : 'border-slate-200 hover:border-purple-300 hover:text-purple-700 text-slate-600'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-purple-600 text-purple-600' : ''}`} />
          <span>Helpful ({likes})</span>
        </button>

        {canManage && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(review)}
                className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium px-2 py-1 rounded hover:bg-purple-50 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(review.id)}
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
