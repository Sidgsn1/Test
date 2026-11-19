import { API_ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

export const reviewService = {
  async getReviewsByProduct(productId, { ratingFilter, sortBy = 'newest' } = {}) {
    const params = new URLSearchParams();
    if (ratingFilter && ratingFilter !== 'all') params.append('ratingFilter', ratingFilter);
    if (sortBy) params.append('sortBy', sortBy);

    const data = await apiRequest(`${API_ENDPOINTS.REVIEWS.BY_PRODUCT(productId)}?${params.toString()}`);
    return Array.isArray(data) ? data : [];
  },

  async getUserReviews(userId) {
    const data = await apiRequest(API_ENDPOINTS.REVIEWS.USER_REVIEWS(userId));
    return Array.isArray(data) ? data : [];
  },

  async getAllReviews(status) {
    const url = status && status !== 'ALL'
      ? `${API_ENDPOINTS.REVIEWS.LIST}?status=${status}`
      : API_ENDPOINTS.REVIEWS.LIST;
    const data = await apiRequest(url);
    return Array.isArray(data) ? data : [];
  },

  async getSellerReviews(sellerId) {
    const data = await apiRequest(API_ENDPOINTS.SELLERS.REVIEWS(sellerId));
    return Array.isArray(data) ? data : [];
  },

  async submitReview({ productId, rating, title, comment, imageUrls }) {
    const payload = {
      productId: Number(productId),
      rating: Number(rating),
      title,
      comment,
      imageUrls: imageUrls || []
    };
    return await apiRequest(API_ENDPOINTS.REVIEWS.SUBMIT, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async moderateReview(reviewId, status, note) {
    const payload = {
      action: status,
      remarks: note || `Review ${status.toLowerCase()} by administrator.`
    };
    return await apiRequest(API_ENDPOINTS.REVIEWS.ADMIN_MODERATE(reviewId), {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async updateReview(reviewId, updateData) {
    return await apiRequest(API_ENDPOINTS.REVIEWS.UPDATE(reviewId), {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  async deleteReview(reviewId) {
    await apiRequest(API_ENDPOINTS.REVIEWS.DELETE(reviewId), {
      method: 'DELETE'
    });
    return true;
  },

  async likeReview(reviewId) {
    return { id: reviewId, liked: true };
  }
};
