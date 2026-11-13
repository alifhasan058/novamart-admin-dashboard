import { useMemo, useState } from 'react';
import { CategorySlice, ProductCategory } from '../types/dashboard';

interface CategoryDonutChartProps {
  slices: CategorySlice[];
}

export function CategoryDonutChart({ slices }: CategoryDonutChartProps) {
  const [hoveredCategory, setHoveredCategory] =
    useState<ProductCategory | null>(null);

  const totalRevenue = useMemo(
    () => slices.reduce((sum, s) => sum + s.revenue, 0),
    [slices]
  );

  const activeSlice = hoveredCategory
    ? slices.find((s) => s.name === hoveredCategory) ?? null
    : null;

  // Donut geometry
  const size = 196;
  const center = size / 2;
  const radius = 72;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const segments = slices.map((slice) => {
    const dashLength = (slice.percentage / 100) * circumference;
    const dashOffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += slice.percentage;
    return {
      ...slice,
      dashLength,
      dashOffset,
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex flex-col justify-between">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Revenue by Category
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Share of gross store sales across product lines
        </p>
      </div>

      {/* Interactive Donut */}
      <div className="relative flex items-center justify-center my-5">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label="Revenue by category donut chart"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg) => {
            const isHovered = hoveredCategory === seg.name;
            const isDimmed = hoveredCategory !== null && !isHovered;
            return (
              <circle
                key={seg.name}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${seg.dashLength} ${circumference}`}
                strokeDashoffset={seg.dashOffset}
                strokeLinecap="butt"
                opacity={isDimmed ? 0.35 : 1}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredCategory(seg.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            );
          })}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
          <span className="text-[11px] font-medium text-slate-500 truncate max-w-[100px]">
            {activeSlice ? activeSlice.name : 'Total Sales'}
          </span>
          <span className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">
            $
            {(activeSlice
              ? activeSlice.revenue
              : totalRevenue
            ).toLocaleString()}
          </span>
          {activeSlice && (
            <span className="text-xs font-semibold text-indigo-600 tabular-nums">
              {activeSlice.percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Category Breakdown List */}
      <div className="space-y-2.5">
        {slices.map((slice) => {
          const isHovered = hoveredCategory === slice.name;
          return (
            <div
              key={slice.name}
              onMouseEnter={() => setHoveredCategory(slice.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                isHovered ? 'bg-slate-50' : ''
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-slate-700 truncate">
                  {slice.name}
                </span>
              </div>
              <div className="flex items-center gap-3 tabular-nums shrink-0">
                <span className="text-xs text-slate-500">
                  ${slice.revenue.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-900 w-9 text-right">
                  {slice.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
