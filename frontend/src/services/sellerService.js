import { API_ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';
import { SELLERS } from '../data/sellers';
import { SELLER_RATINGS } from '../data/sellerRatings';

export const sellerService = {
  async getSellers() {
    try {
      const data = await apiRequest(API_ENDPOINTS.SELLERS.LIST);
      if (data && Array.isArray(data)) return data;
    } catch (_) {}

    return SELLERS;
  },

  async getSellerById(id) {
    try {
      const data = await apiRequest(API_ENDPOINTS.SELLERS.DETAILS(id));
      if (data) return data;
    } catch (_) {}

    const seller = SELLERS.find(s => s.id === id || s.id === Number(id));
    if (!seller) throw new Error('Seller not found');
    return seller;
  },

  async getSellerRatings(sellerId) {
    try {
      const data = await apiRequest(API_ENDPOINTS.SELLERS.RATINGS(sellerId));
      if (data) return data;
    } catch (_) {}

    const ratingObj = SELLER_RATINGS.find(sr => sr.sellerId === sellerId);
    return ratingObj || null;
  },

  async getSellerDashboard(sellerId) {
    try {
      const data = await apiRequest(API_ENDPOINTS.SELLERS.DASHBOARD(sellerId));
      if (data) return data;
    } catch (_) {}

    return null;
  },

  async updateSellerProfile(sellerId, updatedProfile) {
    const idx = SELLERS.findIndex(s => s.id === sellerId);
    if (idx !== -1) {
      SELLERS[idx] = { ...SELLERS[idx], ...updatedProfile };
      return SELLERS[idx];
    }
    return updatedProfile;
  }
};
