// Centralized API Configuration ready for Spring Boot REST API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    DETAILS: (id) => `${API_BASE_URL}/products/${id}`,
    CATEGORIES: `${API_BASE_URL}/products/categories`,
    RANKINGS: `${API_BASE_URL}/products/rankings`,
  },
  REVIEWS: {
    LIST: `${API_BASE_URL}/reviews`,
    BY_PRODUCT: (prodId) => `${API_BASE_URL}/products/${prodId}/reviews`,
    SUBMIT: `${API_BASE_URL}/reviews`,
    UPDATE: (id) => `${API_BASE_URL}/reviews/${id}`,
    DELETE: (id) => `${API_BASE_URL}/reviews/${id}`,
    USER_REVIEWS: (userId) => `${API_BASE_URL}/users/${userId}/reviews`,
  },
  SELLERS: {
    LIST: `${API_BASE_URL}/sellers`,
    DETAILS: (id) => `${API_BASE_URL}/sellers/${id}`,
    RATINGS: (id) => `${API_BASE_URL}/sellers/${id}/ratings`,
    DASHBOARD: (id) => `${API_BASE_URL}/sellers/${id}/dashboard`,
  }
};
