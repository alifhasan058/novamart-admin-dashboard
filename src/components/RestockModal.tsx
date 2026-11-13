import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../types/dashboard';

interface RestockModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirmRestock: (productId: string, addUnits: number) => void;
}

const PRESET_AMOUNTS = [10, 25, 50];

export function RestockModal({
  product,
  onClose,
  onConfirmRestock,
}: RestockModalProps) {
  const [quantity, setQuantity] = useState(25);

  if (!product) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    onConfirmRestock(product.id, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restock-title"
    >
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2
            id="restock-title"
            className="text-base font-semibold text-slate-900"
          >
            Restock Inventory
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
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {product.name}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              {product.sku} <span aria-hidden="true">·</span> Current stock:{' '}
              <strong className="text-rose-600">{product.stock} units</strong>
            </p>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-700 mb-2">
              Quick Add Units
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setQuantity(amt)}
                  className={`h-9 rounded-xl text-xs font-semibold tabular-nums border transition-colors ${
                    quantity === amt
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  +{amt} units
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="restock-qty"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Units to Add
            </label>
            <input
              id="restock-qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full h-10 px-3 text-sm tabular-nums bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
            <p className="text-xs text-slate-500 mt-1.5 tabular-nums">
              Updated stock after restock:{' '}
              <strong className="text-emerald-600">
                {product.stock + quantity} units
              </strong>
            </p>
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
              Confirm Restock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
