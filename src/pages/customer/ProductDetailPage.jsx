import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ShieldCheck, 
  Store, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Send,
  AlertCircle,
  Truck,
  RotateCcw
} from 'lucide-react';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { sellerService } from '../../services/sellerService';
import { useAuth } from '../../context/AuthContext';
import RatingStars from '../../components/common/RatingStars';
import ReviewCard from '../../components/common/ReviewCard';
import { formatINR } from '../../utils/formatters';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [sellerRatingData, setSellerRatingData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Review Filtering and Sorting
  const [reviewSort, setReviewSort] = useState('newest');
  const [reviewRatingFilter, setReviewRatingFilter] = useState('all');

  // Review Submission State
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadProductData();
  }, [id]);

  useEffect(() => {
    if (product) {
      loadReviews();
    }
  }, [product, reviewSort, reviewRatingFilter]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const prod = await productService.getProductById(id);
      setProduct(prod);
      setSelectedImage(0);

      // Fetch Seller Details and Seller Ratings
      if (prod.sellerId) {
        const [sellerData, sellerRatings] = await Promise.all([
          sellerService.getSellerById(prod.sellerId),
          sellerService.getSellerRatings(prod.sellerId)
        ]);
        setSeller(sellerData);
        setSellerRatingData(sellerRatings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const revs = await reviewService.getReviewsByProduct(id, {
        ratingFilter: reviewRatingFilter,
        sortBy: reviewSort
      });
      setReviews(revs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!isAuthenticated) {
      setSubmitError('Please sign in as a Customer to submit a review.');
      return;
    }

    if (!reviewFormData.title.trim() || !reviewFormData.comment.trim()) {
      setSubmitError('Please enter both review title and review details.');
      return;
    }

    try {
      setIsSubmittingReview(true);
      await reviewService.submitReview({
        productId: product.id,
        productName: product.name,
        productThumbnail: product.thumbnail,
        sellerId: product.sellerId,
        user,
        rating: reviewFormData.rating,
        title: reviewFormData.title,
        comment: reviewFormData.comment
      });

      setSubmissionSuccess(true);
      setReviewFormData({
        rating: 5,
        title: '',
        comment: ''
      });
      // Reload reviews
      loadReviews();
    } catch (err) {
      setSubmitError(err.message || 'Error submitting review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading product & rating breakdown...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Product not found</h2>
        <Link to="/products" className="text-sm text-purple-600 underline mt-2 inline-block">
          Return to products list
        </Link>
      </div>
    );
  }

  // Calculate Rating Percentages
  const totalReviewsCount = product.reviewCount || 1;
  const rating5 = Math.round(((product.ratingBreakdown?.[5] || 0) / totalReviewsCount) * 100);
  const rating4 = Math.round(((product.ratingBreakdown?.[4] || 0) / totalReviewsCount) * 100);
  const rating3 = Math.round(((product.ratingBreakdown?.[3] || 0) / totalReviewsCount) * 100);
  const rating2 = Math.round(((product.ratingBreakdown?.[2] || 0) / totalReviewsCount) * 100);
  const rating1 = Math.round(((product.ratingBreakdown?.[1] || 0) / totalReviewsCount) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-purple-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-purple-600">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-purple-600">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Product Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs overflow-hidden flex items-center justify-center min-h-[380px] relative">
            <img
              src={product.images?.[selectedImage] || product.thumbnail}
              alt={product.name}
              className="w-full h-80 sm:h-96 object-contain rounded-2xl transition-all duration-300"
            />
            {product.discountPercent && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                Save {product.discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl p-1 bg-white border-2 transition-all cursor-pointer overflow-hidden ${
                    selectedImage === idx
                      ? 'border-purple-600 ring-2 ring-purple-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase Attributes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
              {product.categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Aggregate Header */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                <RatingStars rating={product.rating} size="sm" />
                <span className="text-sm font-extrabold text-amber-900">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                ({product.reviewCount} verified customer ratings)
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-full">
                Rank #{product.rank} in Category
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {product.discountPercent && (
                <span className="text-xs font-bold text-emerald-600">
                  ({product.discountPercent}% OFF)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Inclusive of all Indian taxes (GST)</p>
          </div>

          {/* Seller Information Card (Explicitly separate) */}
          <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{product.sellerName}</h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Merchant
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{seller?.city || 'Bengaluru, Karnataka'}</p>
                </div>
              </div>

              {/* Seller Specific Rating */}
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-base font-black text-slate-900">★ {product.sellerRating}</span>
                  <span className="text-xs text-slate-500">/ 5.0</span>
                </div>
                <p className="text-[11px] text-purple-600 font-semibold">
                  {sellerRatingData?.totalReviews || 1200}+ Seller Ratings
                </p>
              </div>
            </div>

            {/* Seller Breakdown Metrics */}
            {sellerRatingData && (
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Shipping Speed</span>
                  <span className="font-bold text-slate-800">★ {sellerRatingData.breakdown.shippingSpeed}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">As Described</span>
                  <span className="font-bold text-slate-800">★ {sellerRatingData.breakdown.itemAsDescribed}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Packaging</span>
                  <span className="font-bold text-slate-800">★ {sellerRatingData.breakdown.packagingQuality}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Communication</span>
                  <span className="font-bold text-slate-800">★ {sellerRatingData.breakdown.customerCommunication}</span>
                </div>
              </div>
            )}
          </div>

          {/* Description & Key Features */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Product Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {product.features && (
              <ul className="space-y-1.5 pt-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Ratings Breakdown */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Ratings & Customer Feedback Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Aggregate Score (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 bg-purple-50/40 rounded-2xl border border-purple-100 text-center">
            <span className="text-6xl font-black text-slate-900">{product.rating}</span>
            <div className="my-2.5">
              <RatingStars rating={product.rating} size="lg" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Based on {product.reviewCount} verified customer ratings
            </p>
            <p className="text-xs text-purple-700 mt-2 font-medium bg-purple-100/60 px-3 py-1 rounded-full border border-purple-200">
              ✓ 94% of verified buyers recommend this item
            </p>
          </div>

          {/* Star Distribution Histogram (7 cols) */}
          <div className="md:col-span-7 space-y-3 justify-center flex flex-col">
            {[
              { star: 5, pct: rating5, count: product.ratingBreakdown?.[5] || 0 },
              { star: 4, pct: rating4, count: product.ratingBreakdown?.[4] || 0 },
              { star: 3, pct: rating3, count: product.ratingBreakdown?.[3] || 0 },
              { star: 2, pct: rating2, count: product.ratingBreakdown?.[2] || 0 },
              { star: 1, pct: rating1, count: product.ratingBreakdown?.[1] || 0 },
            ].map(({ star, pct, count }) => (
              <div key={star} className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="w-14 font-bold text-slate-700 flex items-center gap-1">
                  {star} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-slate-400 font-mono text-xs">{pct}%</span>
                <span className="w-16 text-right text-slate-500 text-xs">({count})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Write a Review Form Section */}
      <section className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900">Write a Customer Review</h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Share your experience to help Indian shoppers make informed buying decisions.
            All submissions go through automated quality moderation.
          </p>

          {submissionSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Review Submitted Successfully!</p>
                <p className="mt-0.5">
                  Your feedback has been queued with status <span className="font-bold">PENDING</span>. You can track and edit it in your Customer Dashboard.
                </p>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-5">
            {/* Overall Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Overall Product Rating *
              </label>
              <div className="flex items-center gap-3">
                <RatingStars
                  rating={reviewFormData.rating}
                  size="xl"
                  interactive={true}
                  onChange={(val) => setReviewFormData(prev => ({ ...prev, rating: val }))}
                />
                <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {reviewFormData.rating} out of 5 Stars
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headline / Review Title *
              </label>
              <input
                type="text"
                required
                value={reviewFormData.title}
                onChange={(e) => setReviewFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's the most important thing for shoppers to know?"
                className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-xl px-4 py-2.5 border border-slate-200 focus:border-purple-600 outline-none transition-all"
              />
            </div>

            {/* Detailed Feedback */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Review Description *
              </label>
              <textarea
                required
                rows={4}
                value={reviewFormData.comment}
                onChange={(e) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Describe product build quality, longevity, packaging, and whether it fulfilled expectations..."
                className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-xl p-4 border border-slate-200 focus:border-purple-600 outline-none transition-all resize-y"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/20 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isSubmittingReview ? 'Submitting...' : 'Post Customer Review'}
              </button>

              {!isAuthenticated && (
                <span className="text-xs text-purple-600">
                  <Link to="/login" className="font-bold underline">Sign In</Link> required to submit
                </span>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Existing Customer Reviews List */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Customer Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-slate-500">
              Only approved verified customer reviews are shown below.
            </p>
          </div>

          {/* Filtering and Sorting Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter by Star */}
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={reviewRatingFilter}
                onChange={(e) => setReviewRatingFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="all">All Star Ratings</option>
                <option value="5">5 Stars only</option>
                <option value="4">4 Stars only</option>
                <option value="3">3 Stars only</option>
                <option value="2">2 Stars only</option>
                <option value="1">1 Star only</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
              >
                <option value="newest">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Cards List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <ReviewCard
                key={rev.id}
                review={rev}
                showModerationStatus={false}
                onLike={(reviewId) => reviewService.likeReview(reviewId)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">No reviews found for this selection</p>
            <p className="text-xs text-slate-400 mt-1">Be the first to submit a review for this product!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetailPage;
