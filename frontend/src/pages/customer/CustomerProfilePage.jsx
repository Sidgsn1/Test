
import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  ShieldCheck,
  Save,
  CheckCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CustomerProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || ''
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setIsSaved(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setIsSaved(false);
    setError('');

    try {
      await updateProfile(formData);
      setIsSaved(true);
    } catch (err) {
      console.error('Customer profile update failed:', err);
      setError(err.message || 'Unable to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Customer Profile & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information and reviewer profile.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">

          <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs text-center space-y-4">

            <div className="relative inline-block">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name || 'Customer'}
                className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-purple-100 shadow-md"
              />

              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {user?.name}
              </h3>
              <p className="text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                {user?.badge || 'Active Reviewer'}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Member since {user?.joinedDate || 'N/A'}</span>
              </div>

            </div>
          </div>

          <div className="bg-purple-900 text-white rounded-3xl p-6 shadow-md space-y-3">

            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Reviewer Status
            </div>

            <p className="text-xs text-purple-200 leading-relaxed">
              Your profile information helps other users identify you as a reviewer on the PRRP platform.
            </p>

          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">

            <h3 className="font-bold text-slate-900 text-base mb-6">
              Personal Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>

                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={100}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-purple-600 outline-none transition-all"
                  />

                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full bg-slate-100 text-slate-500 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 cursor-not-allowed"
                  />

                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <span className="text-[10px] text-slate-400 mt-1 block">
                  Account email cannot be modified directly.
                </span>
              </div>

              {/* Phone and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>

                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      maxLength={15}
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-purple-600 outline-none transition-all"
                    />

                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / State
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      maxLength={125}
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Ghaziabad, Uttar Pradesh"
                      className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-purple-600 outline-none transition-all"
                    />

                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Update Profile Info'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
