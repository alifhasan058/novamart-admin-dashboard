import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, PackagePlus, Plus, Search } from 'lucide-react';
import { Product, ProductCategory } from '../types/dashboard';
import { ProductThumbnail } from './ProductThumbnail';

interface ProductsViewProps {
  products: Product[];
  globalSearch: string;
  lowStockThreshold: number;
  onRestockProduct: (product: Product) => void;
  onOpenAddProduct: () => void;
}

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty',
];

export function ProductsView({
  products,
  globalSearch,
  lowStockThreshold,
  onRestockProduct,
  onOpenAddProduct,
}: ProductsViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<'All' | ProductCategory>('All');
  const [localSearch, setLocalSearch] = useState('');

  const query = (localSearch || globalSearch).trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [products, categoryFilter, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Product Catalog</h2>
          <p className="text-sm text-slate-500 mt-0.5 tabular-nums">
            {products.length} active SKUs across 4 retail categories
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddProduct}
          className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {CATEGORIES.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-64">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter by name or SKU..."
            className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500">
                <th className="py-3 pl-6 pr-3">Product</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-right">Units Sold</th>
                <th className="py-3 px-3 text-right">Stock</th>
                <th className="py-3 pl-3 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-6 text-center">
                    <p className="text-sm font-medium text-slate-900">
                      No products match your filter
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter('All');
                        setLocalSearch('');
                      }}
                      className="mt-3 px-3.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isLow = product.stock <= lowStockThreshold;
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <ProductThumbnail
                            src={product.image}
                            alt={product.name}
                            sizeClass="w-10 h-10"
                          />
                          <span className="font-medium text-slate-900 whitespace-nowrap">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                        {product.sku}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-600 tabular-nums whitespace-nowrap">
                        {product.unitsSold.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-right tabular-nums whitespace-nowrap">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                            {product.stock} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            {product.stock} in stock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onRestockProduct(product)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                        >
                          <PackagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Restock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
