import { SELLERS } from '../data/sellers';
import { SELLER_RATINGS } from '../data/sellerRatings';

const simulateDelay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

export const sellerService = {
  async getSellers() {
    await simulateDelay();
    return SELLERS;
  },

  async getSellerById(id) {
    await simulateDelay();
    const seller = SELLERS.find(s => s.id === id);
    if (!seller) throw new Error('Seller not found');
    return seller;
  },

  async getSellerRatings(sellerId) {
    await simulateDelay();
    const ratingObj = SELLER_RATINGS.find(sr => sr.sellerId === sellerId);
    return ratingObj || null;
  },

  async updateSellerProfile(sellerId, updatedProfile) {
    await simulateDelay();
    const idx = SELLERS.findIndex(s => s.id === sellerId);
    if (idx !== -1) {
      SELLERS[idx] = { ...SELLERS[idx], ...updatedProfile };
      return SELLERS[idx];
    }
    return updatedProfile;
  }
};
