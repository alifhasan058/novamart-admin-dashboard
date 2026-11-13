import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Receipt,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { KpiMetric } from '../types/dashboard';

interface KpiCardsProps {
  metrics: KpiMetric[];
}

const KPI_ICON_MAP: Record<
  KpiMetric['id'],
  { Icon: typeof DollarSign; iconBg: string; iconColor: string }
> = {
  revenue: {
    Icon: DollarSign,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  orders: {
    Icon: ShoppingCart,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  customers: {
    Icon: Users,
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  aov: {
    Icon: Receipt,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
};

export function KpiCards({ metrics }: KpiCardsProps) {
  return (
    <section
      aria-label="Key Performance Indicators"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5"
    >
      {metrics.map((metric) => {
        const config = KPI_ICON_MAP[metric.id];
        const Icon = config.Icon;

        return (
          <div
            key={metric.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-2 text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 tabular-nums">
                  {metric.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg} ${config.iconColor}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-0.5 font-semibold tabular-nums ${
                  metric.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {metric.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                {metric.trend}
              </span>
              <span className="text-slate-400" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-500 truncate">
                {metric.comparisonLabel}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
