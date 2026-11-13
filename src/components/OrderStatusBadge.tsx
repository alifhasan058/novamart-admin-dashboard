import {
  CheckCircle2,
  Clock,
  RefreshCw,
  Truck,
  XCircle,
} from 'lucide-react';
import { OrderStatus } from '../types/dashboard';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_STYLES: Record<
  OrderStatus,
  { bg: string; text: string; ring: string; Icon: typeof CheckCircle2 }
> = {
  Delivered: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-600/15',
    Icon: CheckCircle2,
  },
  Processing: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-600/15',
    Icon: RefreshCw,
  },
  Shipped: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-600/15',
    Icon: Truck,
  },
  Pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-600/15',
    Icon: Clock,
  },
  Cancelled: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-600/15',
    Icon: XCircle,
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const style = STATUS_STYLES[status];
  const Icon = style.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ring-1 ring-inset whitespace-nowrap shrink-0 ${style.bg} ${style.text} ${style.ring}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
