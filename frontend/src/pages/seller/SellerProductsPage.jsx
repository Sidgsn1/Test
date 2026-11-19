import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Star, ExternalLink, Search, Tag, Eye, Plus, X, Check, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import RatingStars from '../../components/common/RatingStars';
import { formatINR } from '../../utils/formatters';

const PRESET_IMAGES = [
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { label: 'Camera', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
  { label: 'Serum / Skincare', url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80' }
];

const SellerProductsPage = () => {
  const { user } = useAuth();
  const sellerId = user?.sellerId || user?.id || 12;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    sku: '',
    primaryImageUrl: PRESET_IMAGES[0].url,
    description: ''
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [sellerId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getSellerProducts(sellerId);
      const sorted = [...(data || [])].sort((a, b) => {
        const rDiff = (b.rating ?? b.averageRating ?? 0) - (a.rating ?? a.averageRating ?? 0);
        if (rDiff !== 0) return rDiff;
        return (b.reviewCount ?? b.totalReviews ?? 0) - (a.reviewCount ?? a.totalReviews ?? 0);
      });
      setProducts(sorted.map((p, i) => ({ ...p, rank: i + 1 })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
      if (cats && cats.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.price || !formData.categoryId || !formData.description.trim()) {
      setErrorMsg('Please complete all mandatory product fields.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        sku: formData.sku.trim() || `SKU-${Date.now()}`,
        primaryImageUrl: formData.primaryImageUrl.trim(),
        description: formData.description.trim(),
        images: [formData.primaryImageUrl.trim()]
      };

      const created = await productService.createProduct(payload);
      setProducts(prev => {
        const next = [created, ...prev];
        next.sort((a, b) => {
          const rDiff = (b.rating ?? b.averageRating ?? 0) - (a.rating ?? a.averageRating ?? 0);
          if (rDiff !== 0) return rDiff;
          return (b.reviewCount ?? b.totalReviews ?? 0) - (a.reviewCount ?? a.totalReviews ?? 0);
        });
        return next.map((p, i) => ({ ...p, rank: i + 1 }));
      });
      setSuccessMsg(`"${created.name}" published successfully to catalog!`);
      setShowAddModal(false);
      setFormData({
        name: '',
        categoryId: categories[0]?.id || '',
        price: '',
        sku: '',
        primaryImageUrl: PRESET_IMAGES[0].url,
        description: ''
      });
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create product. Check database connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Associated Products</h2>
          <p className="text-xs text-slate-500">
            Catalog items mapped to your seller account ({products.length} items)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search catalog products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-200 focus:border-purple-600 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Rating & Reviews</th>
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4 text-right">Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.thumbnail || p.primaryImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm max-w-xs truncate">{p.name}</p>
                        <span className="text-[11px] text-emerald-600 font-medium">In Stock</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {p.categoryName}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 text-sm">
                    {formatINR(p.price)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <RatingStars rating={p.rating ?? p.averageRating ?? 0} size="xs" />
                      <span className="font-bold text-slate-800">★ {p.rating ?? p.averageRating ?? 0}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">({p.reviewCount ?? p.totalReviews ?? 0} customer reviews)</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md border border-purple-200 text-[11px]">
                      #{p.rank || (idx + 1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to={`/products/${p.id}`}
                      className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Listing
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No products found for this seller account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Marketplace Product</h3>
                <p className="text-xs text-slate-500">Publish a new catalog item directly into MySQL database</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  className="w-full bg-slate-50 focus:bg-white text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-50 focus:bg-white text-xs rounded-xl px-3 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="e.g. 2999"
                    className="w-full bg-slate-50 focus:bg-white text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SKU / Code</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g. ELEC-HP-SONY-01 (leave empty to autogenerate)"
                  className="w-full bg-slate-50 focus:bg-white text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Image URL *</label>
                <input
                  type="url"
                  name="primaryImageUrl"
                  value={formData.primaryImageUrl}
                  onChange={handleInputChange}
                  required
                  placeholder="https://..."
                  className="w-full bg-slate-50 focus:bg-white text-xs rounded-xl px-3.5 py-2.5 border border-slate-200 focus:border-purple-600 outline-none"
                />

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-medium">Quick presets:</span>
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, primaryImageUrl: img.url }))}
                      className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold px-2 py-0.5 rounded cursor-pointer"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Enter detailed specifications and product highlights..."
                  className="w-full bg-slate-50 focus:bg-white text-xs rounded-xl px-3.5 py-2 border border-slate-200 focus:border-purple-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductsPage;
