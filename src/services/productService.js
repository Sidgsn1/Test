import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';

// Simulated latency to mirror Spring Boot REST API
const simulateDelay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  // Get all products with optional filters
  async getProducts({ category, minRating, sortBy = 'featured', search } = {}) {
    await simulateDelay();
    let result = [...PRODUCTS];

    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (minRating) {
      result = result.filter(p => p.rating >= Number(minRating));
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews-desc') {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rank') {
      result.sort((a, b) => a.rank - b.rank);
    }

    return result;
  },

  async getProductById(id) {
    await simulateDelay();
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  async getCategories() {
    await simulateDelay();
    return CATEGORIES;
  },

  async getSellerProducts(sellerId) {
    await simulateDelay();
    return PRODUCTS.filter(p => p.sellerId === sellerId);
  },

  async getRankings({ category } = {}) {
    await simulateDelay();
    let result = [...PRODUCTS];
    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    // Calculate custom score: (rating * 0.7) + (normalized reviews * 0.3)
    return result.sort((a, b) => {
      const scoreA = (a.rating * 20) + Math.min(a.reviewCount / 10, 20);
      const scoreB = (b.rating * 20) + Math.min(b.reviewCount / 10, 20);
      return scoreB - scoreA;
    });
  }
};
