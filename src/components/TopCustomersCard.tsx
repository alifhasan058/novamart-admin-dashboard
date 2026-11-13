import { ArrowRight } from 'lucide-react';
import { Customer } from '../types/dashboard';

interface TopCustomersCardProps {
  customers: Customer[];
  onViewAllCustomers: () => void;
}

const AVATAR_TONES = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TopCustomersCard({
  customers,
  onViewAllCustomers,
}: TopCustomersCardProps) {
  const topFive = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Top Customers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Highest lifetime order value
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAllCustomers}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap shrink-0"
        >
          <span>All customers</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 flex-1">
        {topFive.map((customer, index) => (
          <div
            key={customer.id}
            className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1 hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-full font-semibold text-xs flex items-center justify-center shrink-0 ${AVATAR_TONES[index % AVATAR_TONES.length]}`}
                aria-hidden="true"
              >
                {getInitials(customer.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {customer.name}
                </p>
                <p className="text-xs text-slate-500 truncate tabular-nums">
                  {customer.city} <span aria-hidden="true">·</span>{' '}
                  {customer.ordersCount} orders
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-slate-900 tabular-nums">
                ${customer.totalSpent.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-slate-400 tabular-nums">
                Last {customer.lastOrderDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
