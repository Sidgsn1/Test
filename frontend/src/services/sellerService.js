
import { API_ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

export const sellerService = {

  async getSellers() {
    const data = await apiRequest(API_ENDPOINTS.SELLERS.LIST);
    return Array.isArray(data) ? data : [];
  },

  async getSellerById(id) {
    const data = await apiRequest(API_ENDPOINTS.SELLERS.DETAILS(id));

    if (!data) {
      throw new Error('Seller not found');
    }

    return data;
  },

  async getSellerRatings(sellerId) {
    const data = await apiRequest(
      API_ENDPOINTS.SELLERS.RATINGS(sellerId)
    );

    return data || null;
  },

  async getSellerDashboard(sellerId) {
    const data = await apiRequest(
      API_ENDPOINTS.SELLERS.DASHBOARD(sellerId)
    );

    return data || null;
  },

  async getSellerReviews(sellerId) {
    const data = await apiRequest(
      API_ENDPOINTS.SELLERS.REVIEWS(sellerId)
    );

    return Array.isArray(data) ? data : [];
  },

  async getSellerDashboardReviews(sellerId) {
    const data = await apiRequest(
      API_ENDPOINTS.SELLERS.MY_REVIEWS(sellerId)
    );

    return Array.isArray(data) ? data : [];
  },

  // Get seller profile
  async getSellerProfile(sellerId) {
    return await apiRequest(
      API_ENDPOINTS.SELLERS.PROFILE(sellerId)
    );
  },

  // Update seller profile
  async updateSellerProfile(sellerId, profileData) {
    return await apiRequest(
      API_ENDPOINTS.SELLERS.UPDATE_PROFILE(sellerId),
      {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }
    );
  },
};
