
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../services/apiConfig';
import { apiRequest, setAuthToken } from '../services/apiClient';

const AuthContext = createContext(null);

const STORAGE_AUTH_KEY = 'prrp_auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_AUTH_KEY);
      setAuthToken(null);
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const authData = await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (authData && authData.token) {
        setAuthToken(authData.token);

        const mappedRole =
          authData.role === 'ROLE_SELLER'
            ? 'seller'
            : authData.role === 'ROLE_ADMIN'
            ? 'admin'
            : 'customer';

        const loggedUser = {
          id: authData.id,
          name: authData.fullName,
          email: authData.email,
          role: mappedRole,
          sellerId: mappedRole === 'seller' ? authData.id : undefined,
          companyName: mappedRole === 'seller' ? authData.fullName : undefined,
          phone: '',
          location: '',
          avatar:
            mappedRole === 'seller'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              : mappedRole === 'admin'
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          joinedDate: 'November 2026',
          badge:
            mappedRole === 'seller'
              ? 'Verified Seller'
              : mappedRole === 'admin'
              ? 'Platform Admin'
              : 'Active Reviewer',
          bio:
            mappedRole === 'seller'
              ? 'Registered Indian marketplace vendor.'
              : mappedRole === 'admin'
              ? 'PRRP platform administrator.'
              : 'Passionate shopper and reviewer.'
        };

        setUser(loggedUser);

        // Fetch actual profile details from backend.
        try {
          const profile = await apiRequest(API_ENDPOINTS.AUTH.ME);

          setUser(prev => ({
            ...prev,
            name: profile.fullName,
            email: profile.email,
            phone: profile.phoneNumber || '',
            location: [profile.city, profile.state]
              .filter(Boolean)
              .join(', '),
            joinedDate: profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric'
                })
              : prev.joinedDate
          }));
        } catch (profileError) {
          console.error('Could not fetch user profile:', profileError);
        }

        return loggedUser;
      }

      throw new Error('Authentication response did not contain a valid token');
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({
    name,
    email,
    password,
    role,
    companyName,
    phone,
    city,
    state
  }) => {
    setLoading(true);

    try {
      const serverRole =
        role === 'seller'
          ? 'ROLE_SELLER'
          : role === 'admin'
          ? 'ROLE_ADMIN'
          : 'ROLE_CUSTOMER';

      const authData = await apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          role: serverRole,
          phoneNumber: phone || '',
          city: city || '',
          state: state || ''
        })
      });

      if (authData && authData.token) {
        setAuthToken(authData.token);

        const mappedRole =
          authData.role === 'ROLE_SELLER'
            ? 'seller'
            : authData.role === 'ROLE_ADMIN'
            ? 'admin'
            : 'customer';

        const newUser = {
          id: authData.id,
          name: authData.fullName,
          email: authData.email,
          role: mappedRole,
          sellerId: mappedRole === 'seller' ? authData.id : undefined,
          companyName:
            companyName ||
            (mappedRole === 'seller' ? `${name} Enterprise` : undefined),
          phone: phone || '',
          location: [city, state].filter(Boolean).join(', '),
          avatar:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          joinedDate: 'November 2026',
          badge: mappedRole === 'seller' ? 'New Merchant' : 'New Member',
          bio: `Hello! I am a ${mappedRole} on PRRP.`
        };

        setUser(newUser);
        return newUser;
      }

      throw new Error('Registration failed to return user token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
  };

  // Local user-state update. Preserved for existing seller workflows.
  const updateUserProfile = (updatedFields) => {
    setUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  // Customer profile update: saves details in the backend database.
  const updateCustomerProfile = async (formData) => {
    const locationParts = (formData.location || '')
      .split(',')
      .map(part => part.trim());

    const requestBody = {
      fullName: formData.name,
      phoneNumber: formData.phone || '',
      city: locationParts[0] || '',
      state: locationParts.slice(1).join(', ') || ''
    };

    const profile = await apiRequest(API_ENDPOINTS.AUTH.UPDATE_ME, {
      method: 'PUT',
      body: JSON.stringify(requestBody)
    });

    const updatedUser = {
      ...user,
      name: profile.fullName,
      email: profile.email,
      phone: profile.phoneNumber || '',
      location: [profile.city, profile.state]
        .filter(Boolean)
        .join(', ')
    };

    setUser(updatedUser);

    return updatedUser;
  };

  const switchRole = async (newRole) => {
    const creds = {
      customer: {
        email: 'customer@prrp.in',
        password: 'Password@123'
      },
      seller: {
        email: 'seller@prrp.in',
        password: 'Password@123'
      },
      admin: {
        email: 'admin@prrp.in',
        password: 'Password@123'
      }
    };

    const target = creds[newRole] || creds.customer;

    return await login(target.email, target.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
        updateCustomerProfile,
        updateProfile: updateCustomerProfile,
        switchRole,
        role: user?.role,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'customer',
        isSeller: user?.role === 'seller',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
