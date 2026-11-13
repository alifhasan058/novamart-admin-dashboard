import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Customer } from '../types/dashboard';

interface CustomersViewProps {
  customers: Customer[];
  globalSearch: string;
}

const SEGMENTS: ('All' | Customer['segment'])[] = ['All', 'VIP', 'Repeat', 'New'];

export function CustomersView({
  customers,
  globalSearch,
}: CustomersViewProps) {
  const [segmentFilter, setSegmentFilter] = useState<'All' | Customer['segment']>('All');
  const [localSearch, setLocalSearch] = useState('');

  const query = (localSearch || globalSearch).trim().toLowerCase();

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesSegment = segmentFilter === 'All' || c.segment === segmentFilter;
      const matchesQuery =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query);
      return matchesSegment && matchesQuery;
    });
  }, [customers, segmentFilter, query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Customers</h2>
        <p className="text-sm text-slate-500 mt-0.5 tabular-nums">
          {customers.length} active profiles shown · 8,432 total store buyers
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
          {SEGMENTS.map((seg) => (
            <button
              key={seg}
              type="button"
              onClick={() => setSegmentFilter(seg)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                segmentFilter === seg
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {seg === 'All' ? 'All Segments' : seg}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search name, email, or city..."
            className="w-full h-9 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500">
                <th className="py-3 pl-6 pr-3">Customer</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Segment</th>
                <th className="py-3 px-3 text-right">Orders</th>
                <th className="py-3 px-3 text-right">Total Spent</th>
                <th className="py-3 pl-3 pr-6 text-right">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 pl-6 pr-3">
                    <p className="font-medium text-slate-900">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.email}</p>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                    {customer.city}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-xs font-semibold ${
                        customer.segment === 'VIP'
                          ? 'text-indigo-600'
                          : customer.segment === 'Repeat'
                            ? 'text-emerald-700'
                            : 'text-slate-600'
                      }`}
                    >
                      {customer.segment}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-700 tabular-nums whitespace-nowrap">
                    {customer.ordersCount}
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                    ${customer.totalSpent.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3.5 pl-3 pr-6 text-right text-xs text-slate-500 tabular-nums whitespace-nowrap">
                    {customer.lastOrderDate}
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
