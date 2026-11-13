import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Order, OrderStatus } from '../types/dashboard';
import { OrderStatusBadge } from './OrderStatusBadge';

interface RecentOrdersTableProps {
  orders: Order[];
  globalSearch: string;
  onSelectOrder: (order: Order) => void;
  onViewAllOrders?: () => void;
  compact?: boolean;
}

const STATUS_OPTIONS: ('All' | OrderStatus)[] = [
  'All',
  'Delivered',
  'Processing',
  'Shipped',
  'Pending',
  'Cancelled',
];

export function RecentOrdersTable({
  orders,
  globalSearch,
  onSelectOrder,
  onViewAllOrders,
  compact = true,
}: RecentOrdersTableProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');

  const combinedQuery = (localSearch || globalSearch).trim().toLowerCase();

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'All' || order.status === statusFilter;
      const matchesQuery =
        !combinedQuery ||
        order.id.toLowerCase().includes(combinedQuery) ||
        order.customerName.toLowerCase().includes(combinedQuery) ||
        order.productName.toLowerCase().includes(combinedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [orders, statusFilter, combinedQuery]);

  const displayedOrders = compact
    ? filteredOrders.slice(0, 8)
    : filteredOrders;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recent Orders
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            Showing {displayedOrders.length} of {filteredOrders.length} matching
            orders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search by customer or Order ID */}
          <div className="relative flex-1 sm:flex-initial sm:w-56">
            <Search
              className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search order ID or customer..."
              aria-label="Filter orders by ID or customer"
              className="w-full h-9 pl-8 pr-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-colors"
            />
          </div>

          {/* Filter by status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'All' | OrderStatus)
            }
            aria-label="Filter orders by status"
            className="h-9 px-3 text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 cursor-pointer"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Statuses' : status}
              </option>
            ))}
          </select>

          {onViewAllOrders && (
            <button
              type="button"
              onClick={onViewAllOrders}
              className="inline-flex items-center gap-1 h-9 px-3 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors whitespace-nowrap shrink-0"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500">
              <th className="py-3 pl-5 sm:pl-6 pr-3 whitespace-nowrap">
                Order ID
              </th>
              <th className="py-3 px-3 whitespace-nowrap">Customer</th>
              <th className="py-3 px-3 whitespace-nowrap">Product</th>
              <th className="py-3 px-3 whitespace-nowrap">Date</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">Amount</th>
              <th className="py-3 pl-3 pr-5 sm:pr-6 text-right whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {displayedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-6 text-center">
                  <p className="text-sm font-medium text-slate-900">
                    No matching orders found
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try clearing your search query or switching the status
                    filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearch('');
                      setStatusFilter('All');
                    }}
                    className="mt-3 px-3.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    Reset filters
                  </button>
                </td>
              </tr>
            ) : (
              displayedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="hover:bg-slate-50/90 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 pl-5 sm:pl-6 pr-3 font-mono text-xs font-semibold text-indigo-600 tabular-nums whitespace-nowrap">
                    #{order.id}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="font-medium text-slate-900">
                      {order.customerName}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 max-w-[200px] truncate">
                    {order.productName}
                  </td>
                  <td className="py-3.5 px-3 text-xs text-slate-500 tabular-nums whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 pl-3 pr-5 sm:pr-6 text-right whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
