import { ArrowRight } from 'lucide-react';
import { Product } from '../types/dashboard';
import { ProductThumbnail } from './ProductThumbnail';

interface TopSellingProductsProps {
  products: Product[];
  onViewAllProducts: () => void;
}

export function TopSellingProducts({
  products,
  onViewAllProducts,
}: TopSellingProductsProps) {
  const topFive = [...products]
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  const maxUnits = Math.max(...topFive.map((p) => p.unitsSold), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Top Selling Products
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by units sold this period
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAllProducts}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap shrink-0"
        >
          <span>Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {topFive.map((product) => {
          const progressPct = Math.round((product.unitsSold / maxUnits) * 100);
          return (
            <div
              key={product.id}
              className="group p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <ProductThumbnail src={product.image} alt={product.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {product.name}
                    </p>
                    <span className="text-sm font-semibold text-slate-900 tabular-nums shrink-0">
                      ${product.price.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5 text-xs text-slate-500">
                    <span className="truncate">{product.category}</span>
                    <span className="tabular-nums shrink-0">
                      {product.unitsSold.toLocaleString()} sold
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
