import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  CheckCircle, 
  ShieldCheck, 
  FileText,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sellerService } from '../../services/sellerService';

const SellerProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Vikram Singhania',
    companyName: user?.companyName || 'TechMatrix Solutions Pvt Ltd',
    email: user?.email || 'seller@techmatrix.in',
    phone: user?.phone || '+91 98200 12345',
    location: user?.location || 'Bengaluru, Karnataka',
    gstin: '29AABCT1332L1Z8',
    bio: user?.bio || 'Premier distributor of certified electronics, audio gear, and personal computing accessories in India.'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user?.sellerId) {
        await sellerService.updateSellerProfile(user.sellerId, formData);
      }
      updateProfile(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Seller Profile & Storefront Credentials</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your verified business identity, tax credentials (GSTIN), and public merchant profile.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Seller profile updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Merchant Card */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={formData.companyName}
              className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-purple-100 shadow-md"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base">{formData.companyName}</h3>
              <p className="text-xs text-slate-500">{formData.name} (Authorized Signatory)</p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                GST Verified Merchant
              </div>

              <p className="text-slate-400 text-[11px] pt-1">
                Active Member since April 2022
              </p>
            </div>
          </div>

          <div className="bg-purple-900 text-white p-5 rounded-3xl space-y-2 text-xs">
            <p className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
              Customer Visibility
            </p>
            <p className="text-purple-200 leading-relaxed">
              Your company name, dispatch city, and response metrics are presented to consumers alongside your products.
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-5">Business Information</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Company / Storefront Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                  />
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    GSTIN Registration Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      placeholder="29AABCT1332L1Z8"
                      className="w-full bg-slate-50 focus:bg-white text-slate-800 font-mono text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                    />
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official Business Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Dispatch Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Warehouse Location / City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Public Storefront Description
                </label>
                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl p-3 border border-slate-200 focus:border-purple-600 outline-none resize-y"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {loading ? 'Saving...' : 'Update Merchant Details'}
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
