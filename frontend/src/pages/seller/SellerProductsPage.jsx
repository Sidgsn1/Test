import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Star, ExternalLink, Search, Tag, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import RatingStars from '../../components/common/RatingStars';
import { formatINR } from '../../utils/formatters';

const SellerProductsPage = () => {
  const { user } = useAuth();
  const sellerId = user?.sellerId || 'seller-1';

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [sellerId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getSellerProducts(sellerId);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Associated Products</h2>
          <p className="text-xs text-slate-500">
            Catalog items mapped to your seller account ({products.length} items)
          </p>
        </div>

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
      </div>

      {/* Products Table / Cards */}
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
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.thumbnail}
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
                      <RatingStars rating={p.rating} size="xs" />
                      <span className="font-bold text-slate-800">★ {p.rating}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">({p.reviewCount} customer reviews)</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md border border-purple-200 text-[11px]">
                      #{p.rank || '-'}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerProductsPage;
