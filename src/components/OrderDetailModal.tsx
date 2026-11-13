import { X } from 'lucide-react';
import { Order, OrderStatus } from '../types/dashboard';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const ALL_STATUSES: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-detail-title"
    >
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2
              id="order-detail-title"
              className="text-base font-semibold text-slate-900 font-mono"
            >
              Order #{order.id}
            </h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Customer</dt>
              <dd className="font-medium text-slate-900 mt-0.5">
                {order.customerName}
              </dd>
              <dd className="text-xs text-slate-500 truncate">
                {order.customerEmail}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Order Date</dt>
              <dd className="font-medium text-slate-900 mt-0.5 tabular-nums">
                {order.date}
              </dd>
              <dd className="text-xs text-slate-500">{order.shippingCity}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Product</dt>
              <dd className="font-medium text-slate-900 mt-0.5">
                {order.productName}
              </dd>
              <dd className="text-xs text-slate-500 tabular-nums">
                {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Total Amount</dt>
              <dd className="font-semibold text-slate-900 mt-0.5 tabular-nums">
                ${order.amount.toFixed(2)}
              </dd>
              <dd className="text-xs text-slate-500">{order.paymentMethod}</dd>
            </div>
          </dl>

          <div className="pt-4 border-t border-slate-100">
            <label
              htmlFor="order-status-select"
              className="block text-xs font-medium text-slate-700 mb-2"
            >
              Update Fulfillment Status
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((status) => {
                const isCurrent = order.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onUpdateStatus(order.id, status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
