import { AlertTriangle, CheckCircle2, PackagePlus } from 'lucide-react';
import { Product } from '../types/dashboard';

interface LowStockAlertCardProps {
  products: Product[];
  threshold: number;
  onRestockClick: (product: Product) => void;
}

export function LowStockAlertCard({
  products,
  threshold,
  onRestockClick,
}: LowStockAlertCardProps) {
  const lowStockItems = products
    .filter((p) => p.stock <= threshold)
    .sort((a, b) => a.stock - b.stock);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Low Stock Alert
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            Products at or below {threshold} units in fulfillment
          </p>
        </div>
        {lowStockItems.length > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 tabular-nums whitespace-nowrap shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{lowStockItems.length} attention</span>
          </span>
        )}
      </div>

      {lowStockItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            All inventory levels healthy
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Every SKU in your NovaMart catalog is currently stocked above the{' '}
            {threshold}-unit threshold.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 flex-1">
          {lowStockItems.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1 hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs">
                  <span className="font-mono text-slate-500">{product.sku}</span>
                  <span className="text-slate-300" aria-hidden="true">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-600 tabular-nums">
                    <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
                    {product.stock} {product.stock === 1 ? 'unit' : 'units'} left
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRestockClick(product)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <PackagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Restock</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
