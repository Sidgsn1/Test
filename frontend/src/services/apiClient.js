import { API_BASE_URL } from './apiConfig';

const TOKEN_KEY = 'prrp_jwt_token';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const apiRequest = async (endpoint, options = {}, timeoutMs = 10000) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}`;
      try {
        const errData = await response.json();
        errorMsg = errData.message || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
