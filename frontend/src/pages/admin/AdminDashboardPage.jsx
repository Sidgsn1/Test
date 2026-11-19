import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ShieldAlert, RefreshCw, Eye, X, MessageSquare, AlertCircle } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import RatingStars from '../../components/common/RatingStars';
import { formatDate, getModerationBadgeClass } from '../../utils/formatters';

const AdminDashboardPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionNotice, setActionNotice] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [processingId, setProcessingId] = useState(null);

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
    try {
      setProcessingId(id);
      const note = status === 'APPROVED' ? 'Approved by Admin' : 'Rejected by Admin (policy)';
      await reviewService.moderateReview(id, status, note);
      setActionNotice(`Review #${id} ${status.toLowerCase()} successfully.`);
      if (selectedReview && selectedReview.id === id) {
        setSelectedReview(null);
      }
      await loadAll();
      setTimeout(() => setActionNotice(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Review Moderation Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate, verify customer claims, and approve or reject reviews before publication.
          </p>
        </div>
        <button
          onClick={loadAll}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-purple-300 text-xs font-semibold text-slate-700 rounded-xl transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          Refresh Queue
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Reviews</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totals.total}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-500">Pending Review</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{totals.pending}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Approved</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{totals.approved}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Rejected</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{totals.rejected}</p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      <div className="flex gap-2 items-center flex-wrap">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === st
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {st} {st !== 'ALL' && `(${reviews.filter(r => r.moderationStatus === st).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Reviewer</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Review Title & Description</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-2" />
                    <p>Loading moderation queue...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No reviews found for this status.
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={r.productThumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                          alt={r.productName}
                          className="w-10 h-10 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                        />
                        <span className="font-bold text-slate-900 text-xs max-w-[140px] line-clamp-2">
                          {r.productName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-2">
                        <img
                          src={r.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={r.userName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-800 whitespace-nowrap">{r.userName}</p>
                          <span className="text-[10px] text-slate-400">{formatDate(r.createdAt)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <RatingStars rating={r.rating} size="xs" />
                        <span className="font-bold text-slate-800 ml-1">★ {r.rating}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top max-w-md">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-xs line-clamp-1">
                          {r.title || 'Untitled Review'}
                        </p>
                        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                          "{r.comment}"
                        </p>
                        {r.images && r.images.length > 0 && (
                          <div className="flex items-center gap-1.5 pt-1">
                            {r.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt="User attachment"
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getModerationBadgeClass(r.moderationStatus)}`}> 
                        {r.moderationStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReview(r)}
                          className="p-1.5 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 rounded-lg transition-colors cursor-pointer"
                          title="Inspect full review details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {r.moderationStatus === 'PENDING' && (
                          <>
                            <button
                              disabled={processingId === r.id}
                              onClick={() => handleModerate(r.id, 'APPROVED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              disabled={processingId === r.id}
                              onClick={() => handleModerate(r.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Review Moderation Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={selectedReview.productThumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                  alt={selectedReview.productName}
                  className="w-12 h-12 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                />
                <div>
                  <p className="text-[11px] uppercase font-bold text-purple-600">Product Under Review</p>
                  <p className="font-bold text-slate-900 text-sm line-clamp-1">{selectedReview.productName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={selectedReview.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={selectedReview.userName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{selectedReview.userName}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(selectedReview.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                  <RatingStars rating={selectedReview.rating} size="xs" />
                  <span className="font-bold text-amber-700 text-xs">★ {selectedReview.rating}.0</span>
                </div>
              </div>

              <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-2">
                <p className="font-bold text-slate-900 text-sm">{selectedReview.title || 'Untitled Review'}</p>
                <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                  {selectedReview.comment}
                </p>
              </div>

              {selectedReview.images && selectedReview.images.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-700">Attached Customer Media</p>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {selectedReview.images.map((img, i) => (
                      <a key={i} href={img} target="_blank" rel="noreferrer">
                        <img
                          src={img}
                          alt="Customer uploaded media"
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 hover:opacity-90 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getModerationBadgeClass(selectedReview.moderationStatus)}`}>
                  Current Status: {selectedReview.moderationStatus}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleModerate(selectedReview.id, 'REJECTED')}
                    disabled={processingId === selectedReview.id}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Reject Review
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModerate(selectedReview.id, 'APPROVED')}
                    disabled={processingId === selectedReview.id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Approve Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
