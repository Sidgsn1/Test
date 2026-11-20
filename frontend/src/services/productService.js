
import { API_ENDPOINTS } from './apiConfig';
import { apiRequest } from './apiClient';

const CATEGORY_ASSETS = {
  'electronics-gadgets': {
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
    itemCount: 48
  },
  'home-kitchen': {
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    itemCount: 54
  },
  'health-wellness-beauty': {
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    itemCount: 38
  },
  'fashion-apparel': {
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
    itemCount: 42
  },
  'sports-fitness-outdoors': {
    icon: 'Dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    itemCount: 33
  },
  'books-stationery': {
    icon: 'Coffee',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    itemCount: 29
  },
  'automotive-accessories': {
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80',
    itemCount: 26
  },
  'gourmet-food-snacks': {
    icon: 'Coffee',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    itemCount: 47
  }
};

const normalizeProduct = (p) => {
  if (!p) return p;

  const thumbnail =
    p.thumbnail ||
    p.primaryImageUrl ||
    (p.images && p.images[0]) ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';

  const rating = Number(p.rating ?? p.averageRating ?? 0);
  const reviewCount = Number(p.reviewCount ?? p.totalReviews ?? 0);

  const ratingBreakdown =
    p.ratingBreakdown ||
    p.ratingDistribution ||
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const images =
    p.images && p.images.length > 0
      ? p.images
      : [thumbnail];

  return {
    ...p,
    thumbnail,
    primaryImageUrl: thumbnail,
    rating,
    averageRating: rating,
    reviewCount,
    totalReviews: reviewCount,
    ratingBreakdown,
    ratingDistribution: ratingBreakdown,
    images,
    inStock: p.isAvailable
  };
};

export const productService = {

  async getProducts({
    category,
    minRating,
    sortBy = 'featured',
    search,
    page = 0,
    size = 50
  } = {}) {

    const params = new URLSearchParams();

    if (category && category !== 'all') {
      params.append('categoryId', category);
    }

    if (minRating) {
      params.append('minRating', minRating);
    }

    if (search) {
      params.append('keyword', search);
    }

    if (sortBy) {
      params.append('sortBy', sortBy);
    }

    params.append('page', page);
    params.append('size', size);

    const data = await apiRequest(
      `${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`
    );

    if (data && data.content) {
      return data.content.map(normalizeProduct);
    }

    return [];
  },

  async getProductById(id) {

    const product = await apiRequest(
      API_ENDPOINTS.PRODUCTS.DETAILS(id)
    );

    if (!product) {
      throw new Error('Product not found in database');
    }

    return normalizeProduct(product);
  },

  async getCategories() {

    const categories = await apiRequest(
      API_ENDPOINTS.PRODUCTS.CATEGORIES
    );

    if (Array.isArray(categories)) {

      return categories.map(c => {

        const asset = CATEGORY_ASSETS[c.slug] || {
          icon: 'Sparkles',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
          itemCount: 25
        };

        return {
          ...c,
          icon: c.icon || asset.icon,
          image: c.image || asset.image,
          itemCount: c.itemCount || asset.itemCount
        };
      });
    }

    return [];
  },

  async getSellerProducts(sellerId) {

    const products = await apiRequest(
      API_ENDPOINTS.SELLERS.PRODUCTS(sellerId)
    );

    if (Array.isArray(products)) {
      return products.map(normalizeProduct);
    }

    return [];
  },

  async getRankings({ category } = {}) {

    const params =
      category && category !== 'all'
        ? `?categoryId=${category}`
        : '';

    const rankings = await apiRequest(
      `${API_ENDPOINTS.PRODUCTS.RANKINGS}${params}`
    );

    if (Array.isArray(rankings)) {
      return rankings.map(normalizeProduct);
    }

    return [];
  },

  async createProduct(productData) {

    const created = await apiRequest(
      API_ENDPOINTS.PRODUCTS.LIST,
      {
        method: 'POST',
        body: JSON.stringify(productData)
      }
    );

    return normalizeProduct(created);
  }
};
