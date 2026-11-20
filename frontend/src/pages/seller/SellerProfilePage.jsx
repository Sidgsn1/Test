
import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  CheckCircle,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';

const SellerProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const sellerId = user?.sellerId ?? user?.id;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: '',
    state: ''
  });

  const [createdAt, setCreatedAt] = useState(null);
  const [isActive, setIsActive] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      if (!sellerId) {
        setError('Seller account information is unavailable.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const profile = await sellerService.getSellerProfile(sellerId);

        if (ignore) return;

        setFormData({
          fullName: profile.fullName || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || '',
          city: profile.city || '',
          state: profile.state || ''
        });

        setCreatedAt(profile.createdAt || null);
        setIsActive(profile.isActive);

        updateUserProfile({
          name: profile.fullName,
          email: profile.email,
          phone: profile.phoneNumber || '',
          location: [profile.city, profile.state]
            .filter(Boolean)
            .join(', ')
        });

      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load seller profile.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [sellerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!sellerId) {
      setError('Seller account information is unavailable.');
      return;
    }

    const fullName = formData.fullName.trim();
    const phoneNumber = formData.phoneNumber.trim();

    if (!fullName) {
      setError('Full name is required.');
      return;
    }

    if (fullName.length > 100) {
      setError('Full name cannot exceed 100 characters.');
      return;
    }

    if (phoneNumber && !/^[0-9]{10,15}$/.test(phoneNumber)) {
      setError('Phone number must contain 10 to 15 digits.');
      return;
    }

    if (formData.city.length > 60 || formData.state.length > 60) {
      setError('City and state cannot exceed 60 characters.');
      return;
    }

    const updatePayload = {
      fullName,
      phoneNumber: phoneNumber || null,
      city: formData.city.trim() || null,
      state: formData.state.trim() || null
    };

    try {
      setSaving(true);

      const updatedProfile = await sellerService.updateSellerProfile(
        sellerId,
        updatePayload
      );

      setFormData({
        fullName: updatedProfile.fullName || '',
        email: updatedProfile.email || '',
        phoneNumber: updatedProfile.phoneNumber || '',
        city: updatedProfile.city || '',
        state: updatedProfile.state || ''
      });

      setCreatedAt(updatedProfile.createdAt || createdAt);
      setIsActive(updatedProfile.isActive);

      updateUserProfile({
        name: updatedProfile.fullName,
        email: updatedProfile.email,
        phone: updatedProfile.phoneNumber || '',
        location: [
          updatedProfile.city,
          updatedProfile.state
        ].filter(Boolean).join(', ')
      });

      setSuccess('Seller profile updated successfully.');

    } catch (err) {
      setError(err.message || 'Failed to update seller profile.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="text-sm text-slate-500">Loading seller profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Seller Profile
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Manage your personal and account information.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Seller Information Card */}
        <div className="space-y-4">

          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-4">

            <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
              <User className="w-12 h-12 text-purple-700" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {formData.fullName}
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Seller Account
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">

              <div className="flex items-center justify-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-purple-600" />

                <span className="text-slate-600">
                  {isActive === true
                    ? 'Active Account'
                    : isActive === false
                    ? 'Inactive Account'
                    : 'Status unavailable'}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4" />

                <span>
                  Joined {formatDate(createdAt)}
                </span>
              </div>

            </div>
          </div>

          <div className="bg-purple-900 text-white p-5 rounded-2xl space-y-2">

            <h3 className="font-bold text-sm">
              Account Information
            </h3>

            <p className="text-xs text-purple-200 leading-relaxed">
              Your seller account information is stored securely.
              Your email address is used as your login identity and
              cannot be changed from this page.
            </p>

          </div>

        </div>

        {/* Profile Form */}
        <div className="md:col-span-2">

          <div className="bg-white rounded-2xl border border-slate-200 p-6">

            <h3 className="font-bold text-slate-900 text-sm mb-5">
              Personal Information
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block font-semibold text-slate-700 text-xs mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full bg-slate-50 focus:bg-white text-sm text-slate-800 rounded-xl pl-10 pr-4 py-3 border border-slate-200 focus:border-purple-600 outline-none"
                  />

                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-slate-700 text-xs mb-2">
                  Registered Email
                </label>

                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full bg-slate-100 text-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 border border-slate-200 outline-none cursor-not-allowed"
                  />

                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <p className="text-[11px] text-slate-400 mt-1">
                  Email cannot be changed from this page.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold text-slate-700 text-xs mb-2">
                  Phone Number
                </label>

                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-15 digit phone number"
                    maxLength={15}
                    className="w-full bg-slate-50 focus:bg-white text-sm text-slate-800 rounded-xl pl-10 pr-4 py-3 border border-slate-200 focus:border-purple-600 outline-none"
                  />

                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-2">
                    City
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      maxLength={60}
                      placeholder="Enter city"
                      className="w-full bg-slate-50 focus:bg-white text-sm text-slate-800 rounded-xl pl-10 pr-3 py-3 border border-slate-200 focus:border-purple-600 outline-none"
                    />

                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 text-xs mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    maxLength={60}
                    placeholder="Enter state"
                    className="w-full bg-slate-50 focus:bg-white text-sm text-slate-800 rounded-xl px-3 py-3 border border-slate-200 focus:border-purple-600 outline-none"
                  />
                </div>

              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-slate-100">

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}

                  {saving ? 'Saving...' : 'Save Changes'}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SellerProfilePage;
