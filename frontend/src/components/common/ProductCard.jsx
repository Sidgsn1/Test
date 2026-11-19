import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, ArrowRight } from 'lucide-react';
import RatingStars from './RatingStars';
import { formatINR } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const thumbnail = product.thumbnail || product.primaryImageUrl || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
  const rating = Number(product.rating ?? product.averageRating ?? 0);
  const reviewCount = Number(product.reviewCount ?? product.totalReviews ?? 0);
  const sellerRating = Number(product.sellerRating || 4.8);
  const discountPercent = product.discountPercent || 15;

  return (
    <div className="group relative bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col overflow-hidden">
      {product.featured && (
        <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
          <Star className="w-3 h-3 fill-white" />
          Featured
        </div>
      )}

      {product.rank && (
        <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md text-purple-900 border border-purple-200 text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm">
          #{product.rank} in Category
        </div>
      )}

      <Link to={`/products/${product.id}`} className="relative h-56 overflow-hidden bg-slate-50 flex items-center justify-center">
        <img
          src={thumbnail}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            {product.categoryName}
          </p>

          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-slate-900 text-base line-clamp-2 hover:text-purple-700 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>Sold by</span>
            <span className="font-medium text-slate-700">{product.sellerName}</span>
            <span className="inline-flex items-center text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
              ★ {sellerRating}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <RatingStars rating={rating} size="sm" />
            <span className="text-sm font-bold text-slate-800">{rating}</span>
            <span className="text-xs text-slate-400">({reviewCount} reviews)</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            {discountPercent && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <Link
            to={`/products/${product.id}`}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-colors group/btn shadow-xs"
            aria-label={`View details for ${product.name}`}
          >
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
