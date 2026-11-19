import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Filter, 
  Star, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { productService } from '../../services/productService';
import RatingStars from '../../components/common/RatingStars';
import { formatINR } from '../../utils/formatters';

const SellerRankingsPage = () => {
  const [rankings, setRankings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadRankings();
  }, [selectedCategory]);

  const loadCategories = async () => {
    const cats = await productService.getCategories();
    setCategories(cats);
  };

  const loadRankings = async () => {
    try {
      setLoading(true);
      const data = await productService.getRankings({ category: selectedCategory });
      setRankings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-black flex items-center justify-center text-sm shadow-md">
          🥇 1
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="w-8 h-8 rounded-xl bg-slate-300 text-slate-800 font-black flex items-center justify-center text-sm shadow-sm">
          🥈 2
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="w-8 h-8 rounded-xl bg-amber-700 text-white font-black flex items-center justify-center text-sm shadow-sm">
          🥉 3
        </span>
      );
    }
    return (
      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
        #{index + 1}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Marketplace Product Rankings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time weighted score combining customer ratings, volume and verification status.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-purple-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Product Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-purple-50/60 border-b border-purple-100 text-xs text-purple-900 flex items-center justify-between">
          <span className="font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Algorithm: 70% Star Rating Weight + 30% Verified Review Volume
          </span>
          <span className="font-bold">{rankings.length} Products Ranked</span>
        </div>

        <div className="divide-y divide-slate-100">
          {rankings.map((p, idx) => (
            <div
              key={p.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                idx < 3 ? 'bg-amber-50/20' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                {getRankBadge(idx)}

                <img
                  src={p.thumbnail || p.primaryImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded-2xl border border-slate-200"
                />

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                    {p.categoryName}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm max-w-md line-clamp-1">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Sold by <span className="font-semibold text-slate-700">{p.sellerName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between sm:justify-end">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <RatingStars rating={p.rating ?? p.averageRating ?? 0} size="xs" />
                    <span className="font-black text-slate-900 text-sm">★ {p.rating ?? p.averageRating ?? 0}</span>
                  </div>
                  <span className="text-xs text-slate-400">({p.reviewCount ?? p.totalReviews ?? 0} reviews)</span>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{formatINR(p.price)}</p>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Save {p.discountPercent || 15}%
                  </span>
                </div>

                <a
                  href={`/products/${p.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 rounded-xl transition-colors"
                  title="View Product Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
          {rankings.length === 0 && !loading && (
            <div className="p-12 text-center text-xs text-slate-400">
              No product rankings available for this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerRankingsPage;
