import { API_ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';
import { INITIAL_REVIEWS } from '../data/reviews';

const STORAGE_KEY = 'prrp_reviews';

const loadReviews = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_REVIEWS;
};

const saveReviews = (reviews) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error(e);
  }
};

export const reviewService = {
  async getReviewsByProduct(productId, { ratingFilter, sortBy = 'newest' } = {}) {
    try {
      const params = new URLSearchParams();
      if (ratingFilter && ratingFilter !== 'all') params.append('ratingFilter', ratingFilter);
      if (sortBy) params.append('sortBy', sortBy);

      const data = await apiRequest(`${API_ENDPOINTS.REVIEWS.BY_PRODUCT(productId)}?${params.toString()}`);
      if (data && Array.isArray(data)) return data;
    } catch (_) {}

    const all = loadReviews();
    let productReviews = all.filter(r => (r.productId === productId || r.productId === Number(productId)) && r.moderationStatus === 'APPROVED');

    if (ratingFilter && ratingFilter !== 'all') {
      productReviews = productReviews.filter(r => r.rating === Number(ratingFilter));
    }

    if (sortBy === 'newest') {
      productReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'highest') {
      productReviews.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      productReviews.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'helpful') {
      productReviews.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    return productReviews;
  },

  async getUserReviews(userId) {
    try {
      const data = await apiRequest(API_ENDPOINTS.REVIEWS.USER_REVIEWS(userId));
      if (data && Array.isArray(data)) return data;
    } catch (_) {}

    const all = loadReviews();
    return all.filter(r => r.userId === userId || r.userId === Number(userId)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getAllReviews(status) {
    try {
      const url = status && status !== 'ALL'
        ? `${API_ENDPOINTS.REVIEWS.LIST}?status=${status}`
        : API_ENDPOINTS.REVIEWS.LIST;
      const data = await apiRequest(url);
      if (data && Array.isArray(data)) return data;
    } catch (_) {}

    const all = loadReviews();
    return all;
  },

  async getSellerReviews(sellerId) {
    try {
      const data = await apiRequest(API_ENDPOINTS.SELLERS.REVIEWS(sellerId));
      if (data && Array.isArray(data)) return data;
    } catch (_) {}

    const all = loadReviews();
    return all.filter(r => r.sellerId === sellerId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async submitReview({ productId, productName, productThumbnail, sellerId, user, rating, title, comment, imageUrls }) {
    try {
      const payload = {
        productId: Number(productId),
        rating: Number(rating),
        title,
        comment,
        imageUrls: imageUrls || []
      };
      const created = await apiRequest(API_ENDPOINTS.REVIEWS.SUBMIT, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (created) return created;
    } catch (_) {}

    const all = loadReviews();
    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      productName,
      productThumbnail,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      sellerId,
      rating: Number(rating),
      title,
      comment,
      moderationStatus: 'PENDING',
      moderationNote: 'Under moderation review for policy compliance',
      createdAt: new Date().toISOString(),
      likes: 0,
      isVerifiedPurchase: true
    };

    all.unshift(newReview);
    saveReviews(all);
    return newReview;
  },

  async reportReview(reviewId, reason = 'Flagged by seller as inappropriate') {
    const all = loadReviews();
    const review = all.find(r => r.id === reviewId || r.id === Number(reviewId));
    if (review) {
      review.reported = true;
      review.reportReason = reason;
      saveReviews(all);
    }
    return review;
  },

  async moderateReview(reviewId, status, note) {
    try {
      const payload = {
        action: status,
        remarks: note || `Review ${status.toLowerCase()} by administrator.`
      };
      const result = await apiRequest(API_ENDPOINTS.REVIEWS.ADMIN_MODERATE(reviewId), {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      if (result) return result;
    } catch (_) {}

    const all = loadReviews();
    const review = all.find(r => r.id === reviewId || r.id === Number(reviewId));
    if (review) {
      review.moderationStatus = status;
      review.moderationNote = note || (status === 'APPROVED' ? 'Approved by Admin' : 'Rejected by Admin');
      saveReviews(all);
    }
    return review;
  },

  async updateReview(reviewId, updateData) {
    try {
      const result = await apiRequest(API_ENDPOINTS.REVIEWS.UPDATE(reviewId), {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      if (result) return result;
    } catch (_) {}

    const all = loadReviews();
    const idx = all.findIndex(r => r.id === reviewId || r.id === Number(reviewId));
    if (idx === -1) throw new Error('Review not found');

    all[idx] = {
      ...all[idx],
      ...updateData,
      moderationStatus: 'PENDING',
      moderationNote: 'Edited by user. Resubmitted for moderation check.',
      updatedAt: new Date().toISOString()
    };

    saveReviews(all);
    return all[idx];
  },

  async deleteReview(reviewId) {
    try {
      await apiRequest(API_ENDPOINTS.REVIEWS.DELETE(reviewId), {
        method: 'DELETE'
      });
      return true;
    } catch (_) {}

    const all = loadReviews();
    const filtered = all.filter(r => r.id !== reviewId && r.id !== Number(reviewId));
    saveReviews(filtered);
    return true;
  },

  async likeReview(reviewId) {
    const all = loadReviews();
    const review = all.find(r => r.id === reviewId || r.id === Number(reviewId));
    if (review) {
      review.likes = (review.likes || 0) + 1;
      saveReviews(all);
    }
    return review;
  }
};
