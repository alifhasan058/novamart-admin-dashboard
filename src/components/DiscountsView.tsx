import { FormEvent, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { DiscountCode } from '../types/dashboard';

interface DiscountsViewProps {
  discounts: DiscountCode[];
  onToggleDiscount: (id: string) => void;
  onCreateDiscount: (discount: Omit<DiscountCode, 'id' | 'redemptions' | 'revenueGenerated'>) => void;
}

export function DiscountsView({
  discounts,
  onToggleDiscount,
  onCreateDiscount,
}: DiscountsViewProps) {
  const [creating, setCreating] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<DiscountCode['type']>('Percentage');
  const [value, setValue] = useState('15%');
  const [expiresAt, setExpiresAt] = useState('Dec 31, 2026');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !description.trim()) return;
    onCreateDiscount({
      code: code.trim().toUpperCase(),
      description: description.trim(),
      type,
      value: type === 'Free Shipping' ? 'Free Shipping' : value.trim() || '10%',
      maxRedemptions: 250,
      expiresAt: expiresAt.trim() || 'Dec 31, 2026',
      active: true,
    });
    setCode('');
    setDescription('');
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Discounts & Promos</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage promotional codes, redemption caps, and campaign revenue
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreating((prev) => !prev)}
          className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          {creating ? (
            <>
              <X className="w-4 h-4" aria-hidden="true" />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Create Discount</span>
            </>
          )}
        </button>
      </div>

      {creating && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Promo Code
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="WINTER15"
              className="w-full h-9 px-3 text-sm font-mono uppercase bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="15% off winter collection"
              className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Discount Value
            </label>
            <div className="flex gap-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DiscountCode['type'])}
                className="h-9 px-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
              >
                <option value="Percentage">%</option>
                <option value="Fixed">$</option>
                <option value="Free Shipping">Free Ship</option>
              </select>
              {type !== 'Free Shipping' && (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full h-9 px-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              aria-label="Expiration date"
              className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="h-9 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl whitespace-nowrap shrink-0"
            >
              Save
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500">
                <th className="py-3 pl-6 pr-3">Code</th>
                <th className="py-3 px-3">Details</th>
                <th className="py-3 px-3">Value</th>
                <th className="py-3 px-3 text-right">Redemptions</th>
                <th className="py-3 px-3 text-right">Revenue</th>
                <th className="py-3 px-3">Expires</th>
                <th className="py-3 pl-3 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {discounts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 pl-6 pr-3 font-mono text-xs font-semibold text-indigo-600 whitespace-nowrap">
                    {item.code}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-900 tabular-nums whitespace-nowrap">
                    {item.value}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-600 tabular-nums whitespace-nowrap">
                    {item.redemptions}
                    {item.maxRedemptions ? ` / ${item.maxRedemptions}` : ''}
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                    ${item.revenueGenerated.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-xs text-slate-500 tabular-nums whitespace-nowrap">
                    {item.expiresAt}
                  </td>
                  <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onToggleDiscount(item.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        item.active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {item.active ? 'Active' : 'Paused'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
