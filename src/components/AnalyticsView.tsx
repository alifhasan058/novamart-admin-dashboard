import {
  CATEGORY_DATA_BY_RANGE,
  SALES_SERIES_BY_RANGE,
} from '../data/mockData';
import { DateRange } from '../types/dashboard';
import { CategoryDonutChart } from './CategoryDonutChart';
import { SalesOverviewChart } from './SalesOverviewChart';

interface AnalyticsViewProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const FUNNEL_STEPS = [
  { stage: 'Store Sessions', count: 38420, rate: '100%' },
  { stage: 'Product Views', count: 21130, rate: '55.0%' },
  { stage: 'Added to Cart', count: 6410, rate: '16.7%' },
  { stage: 'Reached Checkout', count: 2940, rate: '7.7%' },
  { stage: 'Completed Order', count: 1284, rate: '3.34%' },
];

const TRAFFIC_CHANNELS = [
  { channel: 'Organic Search', sessions: 14820, conversion: '3.8%', revenue: '$18,920' },
  { channel: 'Direct & Returning', sessions: 10290, conversion: '4.4%', revenue: '$14,610' },
  { channel: 'Paid Social', sessions: 7940, conversion: '2.3%', revenue: '$8,940' },
  { channel: 'Email Campaigns', sessions: 5370, conversion: '4.9%', revenue: '$5,825' },
];

export function AnalyticsView({
  dateRange,
  onDateRangeChange,
}: AnalyticsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Store Analytics</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Conversion funnel, traffic acquisition channels, and revenue velocity
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-8 flex flex-col [&>div]:flex-1">
          <SalesOverviewChart
            data={SALES_SERIES_BY_RANGE[dateRange]}
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
        <div className="xl:col-span-4 flex flex-col [&>div]:flex-1">
          <CategoryDonutChart slices={CATEGORY_DATA_BY_RANGE[dateRange]} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <h3 className="text-base font-semibold text-slate-900">
            Checkout Conversion Funnel
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-5">
            Drop-off across storefront checkout milestones
          </p>

          <div className="space-y-4">
            {FUNNEL_STEPS.map((step) => {
              const barWidth = Math.max(
                8,
                Math.round((step.count / FUNNEL_STEPS[0].count) * 100)
              );
              return (
                <div key={step.stage}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-700">
                      {step.stage}
                    </span>
                    <span className="tabular-nums text-slate-500">
                      <strong className="font-semibold text-slate-900">
                        {step.count.toLocaleString()}
                      </strong>{' '}
                      <span aria-hidden="true">·</span> {step.rate}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acquisition Channels */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <h3 className="text-base font-semibold text-slate-900">
            Revenue by Channel
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Attributed storefront sessions and conversion performance
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-medium text-slate-500">
                  <th className="py-2.5 pr-3">Channel</th>
                  <th className="py-2.5 px-3 text-right">Sessions</th>
                  <th className="py-2.5 px-3 text-right">Conv. Rate</th>
                  <th className="py-2.5 pl-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {TRAFFIC_CHANNELS.map((row) => (
                  <tr key={row.channel} className="hover:bg-slate-50/80">
                    <td className="py-3 pr-3 font-medium text-slate-900">
                      {row.channel}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 tabular-nums">
                      {row.sessions.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-600 font-medium tabular-nums">
                      {row.conversion}
                    </td>
                    <td className="py-3 pl-3 text-right font-semibold text-slate-900 tabular-nums">
                      {row.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
