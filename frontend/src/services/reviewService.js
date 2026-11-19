import { INITIAL_REVIEWS } from '../data/reviews';

const STORAGE_KEY = 'prrp_reviews';

const loadReviews = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load reviews from local storage', e);
  }
  return INITIAL_REVIEWS;
};

const saveReviews = (reviews) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews', e);
  }
};

const simulateDelay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  async getReviewsByProduct(productId, { ratingFilter, sortBy = 'newest' } = {}) {
    await simulateDelay();
    const all = loadReviews();
    let productReviews = all.filter(r => r.productId === productId && r.moderationStatus === 'APPROVED');

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
    await simulateDelay();
    const all = loadReviews();
    return all.filter(r => r.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getAllReviews() {
    await simulateDelay();
    const all = loadReviews();
    return all;
  },

  async getSellerReviews(sellerId) {
    await simulateDelay();
    const all = loadReviews();
    return all.filter(r => r.sellerId === sellerId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async submitReview({ productId, productName, productThumbnail, sellerId, user, rating, title, comment }) {
    await simulateDelay();
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
    await simulateDelay();
    const all = loadReviews();
    const review = all.find(r => r.id === reviewId);
    if (review) {
      review.reported = true;
      review.reportReason = reason;
      saveReviews(all);
    }
    return review;
  },

  async moderateReview(reviewId, status, note) {
    await simulateDelay();
    const all = loadReviews();
    const review = all.find(r => r.id === reviewId);
    if (review) {
      review.moderationStatus = status;
      review.moderationNote = note || (status === 'APPROVED' ? 'Approved by Admin' : 'Rejected by Admin');
      saveReviews(all);
    }
    return review;
  },

  async updateReview(reviewId, updateData) {
    await simulateDelay();
    const all = loadReviews();
    const idx = all.findIndex(r => r.id === reviewId);
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
    await simulateDelay();
    const all = loadReviews();
    const filtered = all.filter(r => r.id !== reviewId);
    saveReviews(filtered);
    return true;
  },

  async likeReview(reviewId) {
    const all = loadReviews();
    const review = all.find(r => r.id === reviewId);
    if (review) {
      review.likes = (review.likes || 0) + 1;
      saveReviews(all);
    }
    return review;
  }
};
