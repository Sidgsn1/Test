import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/users';
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
    return MOCK_USERS[0];
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

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const authData = await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (authData && authData.token) {
        setAuthToken(authData.token);
        const mappedRole = authData.role === 'ROLE_SELLER' ? 'seller' : authData.role === 'ROLE_ADMIN' ? 'admin' : 'customer';
        const loggedUser = {
          id: authData.id,
          name: authData.fullName,
          email: authData.email,
          role: mappedRole,
          sellerId: mappedRole === 'seller' ? authData.id : undefined,
          companyName: mappedRole === 'seller' ? authData.fullName : undefined,
          phone: '+91 98000 00000',
          location: 'Delhi, India',
          avatar: mappedRole === 'seller'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          joinedDate: 'November 2026',
          badge: mappedRole === 'seller' ? 'Verified Seller' : mappedRole === 'admin' ? 'Platform Admin' : 'Active Reviewer',
          bio: mappedRole === 'seller' ? 'Registered Indian marketplace vendor.' : mappedRole === 'admin' ? 'PRRP platform administrator.' : 'Passionate shopper and reviewer.'
        };
        setUser(loggedUser);
        setLoading(false);
        return loggedUser;
      }
    } catch (_) {}

    const existing = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    let loggedUser;
    if (existing) {
      loggedUser = existing;
    } else {
      loggedUser = {
        id: role === 'seller' ? 'seller-1' : role === 'admin' ? 'admin-1' : `cust-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
        email,
        role,
        sellerId: role === 'seller' ? 'seller-1' : undefined,
        companyName: role === 'seller' ? 'TechMatrix India' : undefined,
        phone: '+91 98000 00000',
        location: 'Mumbai, Maharashtra',
        avatar: role === 'seller'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        joinedDate: 'November 2026',
        badge: role === 'seller' ? 'Verified Seller' : role === 'admin' ? 'Platform Admin' : 'Active Reviewer',
        bio: role === 'seller' ? 'Registered Indian marketplace vendor.' : role === 'admin' ? 'PRRP platform administrator.' : 'Passionate shopper and reviewer.'
      };
    }

    setUser(loggedUser);
    setLoading(false);
    return loggedUser;
  };

  const signup = async ({ name, email, password, role, companyName, phone, city, state }) => {
    setLoading(true);
    try {
      const serverRole = role === 'seller' ? 'ROLE_SELLER' : role === 'admin' ? 'ROLE_ADMIN' : 'ROLE_CUSTOMER';
      const authData = await apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          role: serverRole,
          phoneNumber: phone || '+91 98765 43210',
          city: city || 'New Delhi',
          state: state || 'Delhi'
        })
      });

      if (authData && authData.token) {
        setAuthToken(authData.token);
        const mappedRole = authData.role === 'ROLE_SELLER' ? 'seller' : authData.role === 'ROLE_ADMIN' ? 'admin' : 'customer';
        const newUser = {
          id: authData.id,
          name: authData.fullName,
          email: authData.email,
          role: mappedRole,
          sellerId: mappedRole === 'seller' ? authData.id : undefined,
          companyName: companyName || (mappedRole === 'seller' ? `${name} Enterprise` : undefined),
          phone: phone || '+91 98765 43210',
          location: city || 'New Delhi, Delhi',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          joinedDate: 'November 2026',
          badge: mappedRole === 'seller' ? 'New Merchant' : 'New Member',
          bio: `Hello! I am a ${mappedRole} on PRRP.`
        };
        setUser(newUser);
        setLoading(false);
        return newUser;
      }
    } catch (_) {}

    const newUser = {
      id: role === 'seller' ? `seller-${Date.now()}` : `cust-${Date.now()}`,
      name,
      email,
      role,
      sellerId: role === 'seller' ? 'seller-1' : undefined,
      companyName: companyName || (role === 'seller' ? `${name} Enterprise` : undefined),
      phone: phone || '+91 99999 88888',
      location: city || 'New Delhi, Delhi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      joinedDate: 'November 2026',
      badge: role === 'seller' ? 'New Merchant' : 'New Member',
      bio: `Hello! I am a ${role} on PRRP.`
    };

    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
  };

  const updateUserProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  const switchRole = (newRole) => {
    if (newRole === 'seller') {
      setUser(MOCK_USERS[1]);
    } else if (newRole === 'admin') {
      setUser(MOCK_USERS[2]);
    } else {
      setUser(MOCK_USERS[0]);
    }
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
