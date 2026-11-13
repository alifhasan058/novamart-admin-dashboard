import { useMemo, useState } from 'react';
import { DateRange, SalesDataPoint } from '../types/dashboard';

interface SalesOverviewChartProps {
  data: SalesDataPoint[];
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

type SeriesKey = 'revenue' | 'orders' | 'visitors';

const RANGE_OPTIONS: { id: DateRange; label: string }[] = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '90d', label: '90 Days' },
  { id: '1y', label: '1 Year' },
];

const SERIES_META: Record<
  SeriesKey,
  { label: string; color: string; dotClass: string }
> = {
  revenue: { label: 'Revenue', color: '#6366F1', dotClass: 'bg-indigo-500' },
  orders: { label: 'Orders', color: '#10B981', dotClass: 'bg-emerald-500' },
  visitors: { label: 'Visitors', color: '#0EA5E9', dotClass: 'bg-sky-500' },
};

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    path += ` C ${cx.toFixed(1)} ${p0.y.toFixed(1)}, ${cx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return path;
}

export function SalesOverviewChart({
  data,
  dateRange,
  onDateRangeChange,
}: SalesOverviewChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<SeriesKey, boolean>>({
    revenue: true,
    orders: true,
    visitors: true,
  });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const toggleSeries = (key: SeriesKey) => {
    setVisibleSeries((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.revenue && !next.orders && !next.visitors) {
        return prev;
      }
      return next;
    });
  };

  const totals = useMemo(() => {
    return data.reduce(
      (acc, point) => ({
        revenue: acc.revenue + point.revenue,
        orders: acc.orders + point.orders,
        visitors: acc.visitors + point.visitors,
      }),
      { revenue: 0, orders: 0, visitors: 0 }
    );
  }, [data]);

  // SVG coordinate system
  const width = 760;
  const height = 280;
  const padLeft = 56;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 36;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const primaryKey: SeriesKey = visibleSeries.revenue
    ? 'revenue'
    : visibleSeries.orders
      ? 'orders'
      : 'visitors';

  const seriesBounds = useMemo(() => {
    const calcMax = (key: SeriesKey) => {
      const maxVal = Math.max(...data.map((d) => d[key]), 1);
      return maxVal * 1.15;
    };
    return {
      revenue: calcMax('revenue'),
      orders: calcMax('orders'),
      visitors: calcMax('visitors'),
    };
  }, [data]);

  const coordsBySeries = useMemo(() => {
    const getCoords = (key: SeriesKey) =>
      data.map((d, idx) => {
        const x =
          data.length === 1
            ? padLeft + plotW / 2
            : padLeft + (idx / (data.length - 1)) * plotW;
        const y = padTop + plotH - (d[key] / seriesBounds[key]) * plotH;
        return { x, y };
      });

    return {
      revenue: getCoords('revenue'),
      orders: getCoords('orders'),
      visitors: getCoords('visitors'),
    };
  }, [data, plotH, plotW, seriesBounds]);

  const yTicks = useMemo(() => {
    const maxVal = seriesBounds[primaryKey];
    return [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
      const raw = maxVal * ratio;
      const y = padTop + plotH - ratio * plotH;
      let formatted = '';
      if (primaryKey === 'revenue') {
        formatted =
          raw >= 1000 ? `$${(raw / 1000).toFixed(raw >= 10000 ? 0 : 1)}k` : `$${Math.round(raw)}`;
      } else {
        formatted =
          raw >= 1000 ? `${(raw / 1000).toFixed(1)}k` : `${Math.round(raw)}`;
      }
      return { y, label: formatted };
    });
  }, [plotH, primaryKey, seriesBounds]);

  const activePoint = hoveredIdx !== null ? data[hoveredIdx] : null;
  const activeX =
    hoveredIdx !== null
      ? coordsBySeries[primaryKey][hoveredIdx]?.x ?? padLeft
      : null;

  const revenuePath = buildSmoothPath(coordsBySeries.revenue);
  const revenueAreaPath =
    coordsBySeries.revenue.length > 0
      ? `${revenuePath} L ${coordsBySeries.revenue[coordsBySeries.revenue.length - 1].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${coordsBySeries.revenue[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`
      : '';

  const ordersPath = buildSmoothPath(coordsBySeries.orders);
  const visitorsPath = buildSmoothPath(coordsBySeries.visitors);

  const labelStep = data.length > 10 ? 2 : 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Sales Overview
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 tabular-nums">
            <span>
              Revenue{' '}
              <strong className="font-semibold text-slate-900">
                ${totals.revenue.toLocaleString()}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Orders{' '}
              <strong className="font-semibold text-slate-900">
                {totals.orders.toLocaleString()}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Visitors{' '}
              <strong className="font-semibold text-slate-900">
                {totals.visitors.toLocaleString()}
              </strong>
            </span>
          </div>
        </div>

        {/* Date Filter Buttons */}
        <div
          role="group"
          aria-label="Chart date range"
          className="inline-flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto"
        >
          {RANGE_OPTIONS.map((opt) => {
            const active = dateRange === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onDateRangeChange(opt.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Series Visibility Toggles */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {(Object.keys(SERIES_META) as SeriesKey[]).map((key) => {
          const meta = SERIES_META[key];
          const enabled = visibleSeries[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleSeries(key)}
              aria-pressed={enabled}
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                enabled
                  ? 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                  : 'bg-slate-50 border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${enabled ? meta.dotClass : 'bg-slate-300'}`}
                aria-hidden="true"
              />
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive SVG Area / Line Chart */}
      <div className="relative mt-4 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-64 sm:h-72 overflow-visible"
          role="img"
          aria-label="Sales overview chart showing revenue, orders, and visitors"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines & Y Labels */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={tick.y}
                x2={width - padRight}
                y2={tick.y}
                stroke="#E2E8F0"
                strokeDasharray={idx === 0 ? undefined : '4 4'}
                strokeWidth="1"
              />
              <text
                x={padLeft - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[11px] tabular-nums"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Revenue Area + Line */}
          {visibleSeries.revenue && (
            <>
              <path d={revenueAreaPath} fill="url(#revenueAreaGrad)" />
              <path
                d={revenuePath}
                fill="none"
                stroke="#6366F1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Visitors Line */}
          {visibleSeries.visitors && (
            <path
              d={visitorsPath}
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="2"
              strokeDasharray="5 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Orders Line */}
          {visibleSeries.orders && (
            <path
              d={ordersPath}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* X-Axis Labels */}
          {data.map((d, idx) => {
            if (idx % labelStep !== 0 && idx !== data.length - 1) return null;
            const x = coordsBySeries[primaryKey][idx].x;
            return (
              <text
                key={d.label}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className="fill-slate-400 text-[11px] tabular-nums"
              >
                {d.label}
              </text>
            );
          })}

          {/* Hover Vertical Crosshair & Active Dots */}
          {hoveredIdx !== null && activeX !== null && (
            <g>
              <line
                x1={activeX}
                y1={padTop}
                x2={activeX}
                y2={padTop + plotH}
                stroke="#94A3B8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {visibleSeries.revenue && (
                <circle
                  cx={coordsBySeries.revenue[hoveredIdx].x}
                  cy={coordsBySeries.revenue[hoveredIdx].y}
                  r="4.5"
                  fill="#6366F1"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
              {visibleSeries.orders && (
                <circle
                  cx={coordsBySeries.orders[hoveredIdx].x}
                  cy={coordsBySeries.orders[hoveredIdx].y}
                  r="4"
                  fill="#10B981"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
              {visibleSeries.visitors && (
                <circle
                  cx={coordsBySeries.visitors[hoveredIdx].x}
                  cy={coordsBySeries.visitors[hoveredIdx].y}
                  r="4"
                  fill="#0EA5E9"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
            </g>
          )}

          {/* Invisible Hit Zones for Smooth Hover */}
          {data.map((_, idx) => {
            const sliceWidth = plotW / Math.max(data.length - 1, 1);
            const xCenter = coordsBySeries[primaryKey][idx].x;
            return (
              <rect
                key={idx}
                x={Math.max(padLeft, xCenter - sliceWidth / 2)}
                y={padTop}
                width={sliceWidth}
                height={plotH}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredIdx(idx)}
              />
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint && hoveredIdx !== null && activeX !== null && (
          <div
            style={{
              left: `${Math.min(Math.max((activeX / width) * 100, 14), 76)}%`,
            }}
            className="pointer-events-none absolute top-2 -translate-x-1/2 bg-slate-900 text-white rounded-xl px-3.5 py-2.5 shadow-lg text-xs z-10 min-w-[168px]"
          >
            <p className="font-semibold text-slate-200 mb-1.5">
              {activePoint.fullDate}
            </p>
            <div className="space-y-1 tabular-nums">
              {visibleSeries.revenue && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-indigo-300">Revenue</span>
                  <span className="font-semibold">
                    ${activePoint.revenue.toLocaleString()}
                  </span>
                </div>
              )}
              {visibleSeries.orders && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-emerald-300">Orders</span>
                  <span className="font-semibold">
                    {activePoint.orders.toLocaleString()}
                  </span>
                </div>
              )}
              {visibleSeries.visitors && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sky-300">Visitors</span>
                  <span className="font-semibold">
                    {activePoint.visitors.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
