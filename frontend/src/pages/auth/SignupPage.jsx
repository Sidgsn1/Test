import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Store, Phone, MapPin, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'customer';

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    city: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'seller' && !formData.companyName) {
      setError('Company/Business name is required for sellers.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        companyName: formData.companyName,
        phone: formData.phone,
        city: formData.city
      });

      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50/50 via-white to-slate-50">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-purple-100">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create your PRRP Account
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Join the community of honest shoppers and verified Indian sellers.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'customer'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Account
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'seller'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Seller / Merchant Account
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Priyanshu Sharma"
                className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@domain.in"
                className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Conditional Seller Fields */}
          {role === 'seller' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Business Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required={role === 'seller'}
                    placeholder="e.g. Apex Lifestyle Solutions Ltd"
                    className="w-full bg-white text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 border border-purple-200 focus:border-purple-600 outline-none"
                  />
                  <Store className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98000 00000"
                    className="w-full bg-white text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 border border-purple-200 focus:border-purple-600 outline-none"
                  />
                  <Phone className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / State
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, MH"
                    className="w-full bg-white text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2 border border-purple-200 focus:border-purple-600 outline-none"
                  />
                  <MapPin className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 6 chars"
                  className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-xl pl-9 pr-3 py-2 border border-slate-200 focus:border-purple-600 outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter password"
                  className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-xl pl-9 pr-3 py-2 border border-slate-200 focus:border-purple-600 outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.99] transition-all shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Registering...' : `Create ${role === 'seller' ? 'Seller' : 'Customer'} Account`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-purple-600 hover:text-purple-800">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
