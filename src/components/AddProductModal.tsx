import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import { Product, ProductCategory } from '../types/dashboard';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id' | 'unitsSold'>) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty',
];

export function AddProductModal({
  open,
  onClose,
  onAddProduct,
}: AddProductModalProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('25');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (!name.trim()) {
      setError('Please enter a product name.');
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price greater than $0.');
      return;
    }
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      setError('Please enter a valid stock quantity.');
      return;
    }

    onAddProduct({
      name: name.trim(),
      sku:
        sku.trim().toUpperCase() ||
        `NM-${category.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`,
      category,
      price: parsedPrice,
      stock: parsedStock,
    });

    setName('');
    setSku('');
    setPrice('');
    setStock('25');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-product-title"
    >
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2
            id="add-product-title"
            className="text-base font-semibold text-slate-900"
          >
            Add New Product
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p
              role="alert"
              className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2"
            >
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="prod-name"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Product Name
            </label>
            <input
              id="prod-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Studio Desk Lamp"
              className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="prod-category"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Category
              </label>
              <select
                id="prod-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="prod-sku"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                SKU (optional)
              </label>
              <input
                id="prod-sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="NM-EL-440"
                className="w-full h-10 px-3 text-sm font-mono bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="prod-price"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Price (USD)
              </label>
              <input
                id="prod-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="89.00"
                className="w-full h-10 px-3 text-sm tabular-nums bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>

            <div>
              <label
                htmlFor="prod-stock"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Initial Stock
              </label>
              <input
                id="prod-stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full h-10 px-3 text-sm tabular-nums bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
