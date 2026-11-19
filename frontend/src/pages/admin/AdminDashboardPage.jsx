import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ShieldAlert, RefreshCw } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import RatingStars from '../../components/common/RatingStars';
import { formatDate, getModerationBadgeClass } from '../../utils/formatters';

const AdminDashboardPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionNotice, setActionNotice] = useState('');

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleModerate = async (id, status) => {
    const note = status === 'APPROVED' ? 'Approved by Admin' : 'Rejected by Admin (policy)';
    await reviewService.moderateReview(id, status, note);
    setActionNotice(`Review ${status.toLowerCase()}`);
    await loadAll();
    setTimeout(() => setActionNotice(''), 3000);
  };

  const filtered = reviews.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.moderationStatus === statusFilter;
  });

  const totals = {
    total: reviews.length,
    approved: reviews.filter(r => r.moderationStatus === 'APPROVED').length,
    pending: reviews.filter(r => r.moderationStatus === 'PENDING').length,
    rejected: reviews.filter(r => r.moderationStatus === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Review Moderation Dashboard</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Total Reviews</p>
          <p className="text-xl font-semibold text-slate-800">{totals.total}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-xl font-semibold text-amber-600">{totals.pending}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="text-xl font-semibold text-emerald-600">{totals.approved}</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="text-xl font-semibold text-rose-600">{totals.rejected}</p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-4 items-center">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded ${statusFilter === st ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            {st}
          </button>
        ))}
        <button onClick={loadAll} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl border border-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Product</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Reviewer</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Rating</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Status</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">No reviews found.</td>
              </tr>
            ) : (
              filtered.map(r => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <img src={r.productThumbnail} alt={r.productName} className="w-8 h-8 object-cover rounded" />
                      <span className="text-sm font-medium text-slate-800">{r.productName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <img src={r.userAvatar} alt={r.userName} className="w-6 h-6 rounded-full" />
                      <span className="text-xs text-slate-700">{r.userName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2"><RatingStars rating={r.rating} size="xs" /></td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getModerationBadgeClass(r.moderationStatus)}`}> 
                      {r.moderationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {r.moderationStatus === 'PENDING' && (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleModerate(r.id, 'APPROVED')} className="px-2 py-1 bg-emerald-600 text-white rounded text-xs">Approve</button>
                        <button onClick={() => handleModerate(r.id, 'REJECTED')} className="px-2 py-1 bg-rose-600 text-white rounded text-xs">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
