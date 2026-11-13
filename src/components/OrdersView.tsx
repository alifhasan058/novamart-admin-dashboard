import { Download } from 'lucide-react';
import { Order } from '../types/dashboard';
import { RecentOrdersTable } from './RecentOrdersTable';

interface OrdersViewProps {
  orders: Order[];
  globalSearch: string;
  onSelectOrder: (order: Order) => void;
}

export function OrdersView({
  orders,
  globalSearch,
  onSelectOrder,
}: OrdersViewProps) {
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const inTransitCount = orders.filter(
    (o) => o.status === 'Shipped' || o.status === 'Processing'
  ).length;
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const totalValue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.amount, 0);

  const handleExportCsv = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Product', 'Date', 'Amount', 'Status'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      o.customerEmail,
      `"${o.productName}"`,
      `"${o.date}"`,
      o.amount.toFixed(2),
      o.status,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'novamart-orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Order Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Track fulfillment status, inspect customer details, or export order
            ledgers.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
          <p className="text-xs text-slate-500">Net Order Volume</p>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-1">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
          <p className="text-xs text-slate-500">Delivered</p>
          <p className="text-xl font-bold text-emerald-600 tabular-nums mt-1">
            {deliveredCount}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
          <p className="text-xs text-slate-500">In Fulfillment</p>
          <p className="text-xl font-bold text-indigo-600 tabular-nums mt-1">
            {inTransitCount}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
          <p className="text-xs text-slate-500">Pending Review</p>
          <p className="text-xl font-bold text-amber-600 tabular-nums mt-1">
            {pendingCount}
          </p>
        </div>
      </div>

      <RecentOrdersTable
        orders={orders}
        globalSearch={globalSearch}
        onSelectOrder={onSelectOrder}
        compact={false}
      />
    </div>
  );
}
