// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Mail, Lock, UserCheck, Store, ShieldCheck, ArrowRight, AlertCircle, Database } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// const LoginPage = () => {
//   const [role, setRole] = useState('customer');
//   const [email, setEmail] = useState('customer@prrp.in');
//   const [password, setPassword] = useState('Password@123');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleRoleChange = (newRole) => {
//     setRole(newRole);
//     if (newRole === 'customer') {
//       setEmail('customer@prrp.in');
//     } else if (newRole === 'admin') {
//       setEmail('admin@prrp.in');
//     } else {
//       setEmail('seller@prrp.in');
//     }
//     setPassword('Password@123');
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!email || !password) {
//       setError('Please provide both email and password.');
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const loggedUser = await login(email, password);
//       const userRole = loggedUser?.role || role;
//       const targetPath = userRole === 'seller' ? '/seller/dashboard' : userRole === 'admin' ? '/admin/dashboard' : '/';
//       const redirectPath = (location.state?.from?.pathname && location.state.from.pathname !== '/login') 
//         ? location.state.from.pathname 
//         : targetPath;
//       navigate(redirectPath, { replace: true });
//     } catch (err) {
//       setError(err.message || 'Login failed. Please verify database connection and credentials.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getRoleLabel = () => {
//     if (role === 'seller') return 'Seller';
//     if (role === 'admin') return 'Admin';
//     return 'Customer';
//   };

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50/50 via-white to-slate-50">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-purple-100">
//         <div className="text-center">
//           <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600 text-white shadow-lg mb-4">
//             <Store className="w-7 h-7" />
//           </div>
//           <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
//             Welcome to PRRP
//           </h2>
//           <p className="mt-2 text-sm text-slate-500">
//             Sign in to write verified reviews, track ratings or manage your merchant store.
//           </p>
//         </div>

//         <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
//           <button
//             type="button"
//             onClick={() => handleRoleChange('customer')}
//             className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
//               role === 'customer'
//                 ? 'bg-white text-purple-700 shadow-sm'
//                 : 'text-slate-600 hover:text-slate-900'
//             }`}
//           >
//             <UserCheck className="w-3.5 h-3.5" />
//             Customer
//           </button>
//           <button
//             type="button"
//             onClick={() => handleRoleChange('seller')}
//             className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
//               role === 'seller'
//                 ? 'bg-purple-600 text-white shadow-sm'
//                 : 'text-slate-600 hover:text-slate-900'
//             }`}
//           >
//             <Store className="w-3.5 h-3.5" />
//             Seller
//           </button>
//           <button
//             type="button"
//             onClick={() => handleRoleChange('admin')}
//             className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
//               role === 'admin'
//                 ? 'bg-amber-500 text-slate-950 shadow-sm'
//                 : 'text-slate-600 hover:text-slate-900'
//             }`}
//           >
//             <ShieldCheck className="w-3.5 h-3.5" />
//             Admin
//           </button>
//         </div>

//         <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 space-y-1">
//           <p className="font-semibold flex items-center gap-1.5 text-slate-700">
//             <Database className="w-3.5 h-3.5 text-purple-600" />
//             Active Database Credentials:
//           </p>
//           <p className="font-mono text-[11px] text-slate-800">
//             <span className="font-semibold text-purple-700">{email}</span> (Password: <span className="font-semibold">Password@123</span>)
//           </p>
//         </div>

//         {error && (
//           <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
//             <AlertCircle className="w-4 h-4 flex-shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//           <div>
//             <label className="block text-xs font-semibold text-slate-700 mb-1">
//               Email Address
//             </label>
//             <div className="relative">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="name@example.com"
//                 className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
//               />
//               <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//             </div>
//           </div>

//           <div>
//             <div className="flex items-center justify-between mb-1">
//               <label className="block text-xs font-semibold text-slate-700">
//                 Password
//               </label>
//               <span className="text-[11px] text-purple-600 hover:underline cursor-pointer">
//                 Forgot password?
//               </span>
//             </div>
//             <div className="relative">
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 placeholder="••••••••"
//                 className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
//               />
//               <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.99] transition-all shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
//           >
//             {isSubmitting ? 'Authenticating...' : `Sign in as ${getRoleLabel()}`}
//             <ArrowRight className="w-4 h-4" />
//           </button>
//         </form>

//         <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
//           Don't have a PRRP account?{' '}
//           <Link to={`/signup?role=${role}`} className="font-bold text-purple-600 hover:text-purple-800">
//             Create an account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  UserCheck,
  Store,
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);

      const loggedUser = await login(email, password);
      const userRole = loggedUser?.role || role;

      const targetPath =
        userRole === 'seller'
          ? '/seller/dashboard'
          : userRole === 'admin'
            ? '/admin/dashboard'
            : '/';

      const redirectPath =
        location.state?.from?.pathname &&
        location.state.from.pathname !== '/login'
          ? location.state.from.pathname
          : targetPath;

      navigate(redirectPath, { replace: true });

    } catch (err) {
      setError(
        err.message ||
        'Login failed. Please verify your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleLabel = () => {
    if (role === 'seller') return 'Seller';
    if (role === 'admin') return 'Admin';
    return 'Customer';
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50/50 via-white to-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-purple-100">

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600 text-white shadow-lg mb-4">
            <Store className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to PRRP
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to write verified reviews, track ratings or manage your merchant store.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">

          <button
            type="button"
            onClick={() => handleRoleChange('customer')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'customer'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Customer
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('seller')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'seller'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Seller
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>

        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />

              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>

              <span className="text-[11px] text-purple-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />

              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.99] transition-all shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Authenticating...' : `Sign in as ${getRoleLabel()}`}
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have a PRRP account?{' '}
          <Link
            to={`/signup?role=${role}`}
            className="font-bold text-purple-600 hover:text-purple-800"
          >
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
