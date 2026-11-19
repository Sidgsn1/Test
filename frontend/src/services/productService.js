import { API_ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';

export const productService = {
  async getProducts({ category, minRating, sortBy = 'featured', search, page = 0, size = 20 } = {}) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') {
        const catObj = CATEGORIES.find(c => c.slug === category);
        if (catObj) params.append('categoryId', catObj.id);
      }
      if (minRating) params.append('minRating', minRating);
      if (search) params.append('keyword', search);
      if (sortBy) params.append('sortBy', sortBy);
      params.append('page', page);
      params.append('size', size);

      const data = await apiRequest(`${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`);
      if (data && data.content) {
        return data.content;
      }
    } catch (_) {}

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
    try {
      const product = await apiRequest(API_ENDPOINTS.PRODUCTS.DETAILS(id));
      if (product) return product;
    } catch (_) {}

    const product = PRODUCTS.find(p => p.id === id || p.id === Number(id));
    if (!product) throw new Error('Product not found');
    return product;
  },

  async getCategories() {
    try {
      const categories = await apiRequest(API_ENDPOINTS.PRODUCTS.CATEGORIES);
      if (categories && categories.length > 0) return categories;
    } catch (_) {}

    return CATEGORIES;
  },

  async getSellerProducts(sellerId) {
    try {
      const products = await apiRequest(API_ENDPOINTS.SELLERS.PRODUCTS(sellerId));
      if (products) return products;
    } catch (_) {}

    return PRODUCTS.filter(p => p.sellerId === sellerId);
  },

  async getRankings({ category } = {}) {
    try {
      const params = category && category !== 'all' ? `?categoryId=${category}` : '';
      const rankings = await apiRequest(`${API_ENDPOINTS.PRODUCTS.RANKINGS}${params}`);
      if (rankings && rankings.length > 0) return rankings;
    } catch (_) {}

    let result = [...PRODUCTS];
    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    return result.sort((a, b) => {
      const scoreA = (a.rating * 20) + Math.min(a.reviewCount / 10, 20);
      const scoreB = (b.rating * 20) + Math.min(b.reviewCount / 10, 20);
      return scoreB - scoreA;
    });
  }
};
