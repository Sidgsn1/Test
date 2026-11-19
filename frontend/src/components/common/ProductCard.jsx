import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, ArrowRight } from 'lucide-react';
import RatingStars from './RatingStars';
import { formatINR } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badge / Tag */}
      {product.featured && (
        <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
          <Star className="w-3 h-3 fill-white" />
          Featured
        </div>
      )}

      {/* Rank Badge if specified */}
      {product.rank && (
        <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md text-purple-900 border border-purple-200 text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm">
          #{product.rank} in Category
        </div>
      )}

      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="relative h-56 overflow-hidden bg-slate-50 flex items-center justify-center">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            {product.categoryName}
          </p>

          {/* Product Name */}
          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-slate-900 text-base line-clamp-2 hover:text-purple-700 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Seller Line */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>Sold by</span>
            <span className="font-medium text-slate-700">{product.sellerName}</span>
            <span className="inline-flex items-center text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
              ★ {product.sellerRating}
            </span>
          </div>

          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-2 mt-3">
            <RatingStars rating={product.rating} size="sm" />
            <span className="text-sm font-bold text-slate-800">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Pricing & Action */}
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
            {product.discountPercent && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Save {product.discountPercent}%
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
