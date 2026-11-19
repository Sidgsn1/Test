import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CustomerProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    location: user?.location || 'Bengaluru, Karnataka',
    bio: user?.bio || 'Tech enthusiast, home cook, and honest reviewer who loves test-driving audio gadgets.'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateProfile(formData);
      setLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Customer Profile & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your verified reviewer persona, contact information, and public badges.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card / Badge Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-purple-100 shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">{user?.name}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                {user?.badge || 'Top Reviewer'}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Member since {user?.joinedDate || 'August 2024'}</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-900 text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Verified Reviewer Status
            </div>
            <p className="text-xs text-purple-200 leading-relaxed">
              Your reviews gain extra platform weight once your purchases are confirmed against seller dispatch invoices.
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-6">Personal Details</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-purple-600 outline-none transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

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
                <span className="text-[10px] text-slate-400 mt-1 block">Account email cannot be modified directly.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
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
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-purple-600 outline-none transition-all"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Reviewer Bio
                </label>
                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Share what types of products you like evaluating..."
                  className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl p-3 border border-slate-200 focus:border-purple-600 outline-none transition-all resize-y"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
