import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

// 1. Fleet Health Trend Chart with Time Range selector
interface HealthTrendPoint {
  label: string;
  labelAr: string;
  score: number;
}

export const FleetHealthTrendChart: React.FC = () => {
  const { isRTL, t } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '1y'>('30d');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const dataSets: Record<'7d' | '30d' | '3m' | '1y', HealthTrendPoint[]> = {
    '7d': [
      { label: 'Mon', labelAr: 'الإثنين', score: 84 },
      { label: 'Tue', labelAr: 'الثلاثاء', score: 85 },
      { label: 'Wed', labelAr: 'الأربعاء', score: 84 },
      { label: 'Thu', labelAr: 'الخميس', score: 86 },
      { label: 'Fri', labelAr: 'الجمعة', score: 87 },
      { label: 'Sat', labelAr: 'السبت', score: 87 },
      { label: 'Sun', labelAr: 'الأحد', score: 88 },
    ],
    '30d': [
      { label: 'Aug 04', labelAr: '٠٤ أغسطس', score: 83 },
      { label: 'Aug 09', labelAr: '٠٩ أغسطس', score: 84 },
      { label: 'Aug 14', labelAr: '١٤ أغسطس', score: 85 },
      { label: 'Aug 19', labelAr: '١٩ أغسطس', score: 84 },
      { label: 'Aug 24', labelAr: '٢٤ أغسطس', score: 86 },
      { label: 'Aug 29', labelAr: '٢٩ أغسطس', score: 87 },
      { label: 'Sep 02', labelAr: '٠٢ سبتمبر', score: 88 },
    ],
    '3m': [
      { label: 'Jun', labelAr: 'يونيو', score: 81 },
      { label: 'Jul', labelAr: 'يوليو', score: 84 },
      { label: 'Aug', labelAr: 'أغسطس', score: 86 },
      { label: 'Sep', labelAr: 'سبتمبر', score: 88 },
    ],
    '1y': [
      { label: 'Q4 25', labelAr: 'الربع ٤', score: 79 },
      { label: 'Q1 26', labelAr: 'الربع ١', score: 82 },
      { label: 'Q2 26', labelAr: 'الربع ٢', score: 85 },
      { label: 'Q3 26', labelAr: 'الربع ٣', score: 88 },
    ],
  };

  const points = dataSets[timeRange];
  const width = 600;
  const height = 210;
  const paddingX = 35;
  const paddingTop = 20;
  const paddingBottom = 30;

  const minScore = 70;
  const maxScore = 100;

  const getX = (idx: number) => {
    const rawX = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
    return isRTL ? width - rawX : rawX;
  };

  const getY = (score: number) => {
    const normalized = (score - minScore) / (maxScore - minScore);
    return height - paddingBottom - normalized * (height - paddingTop - paddingBottom);
  };

  // Build SVG Path
  const sortedIndices = isRTL 
    ? [...Array(points.length).keys()].reverse() 
    : [...Array(points.length).keys()];

  const pathPoints = sortedIndices.map((idx) => `${getX(idx)},${getY(points[idx].score)}`);
  const linePath = `M ${pathPoints.join(' L ')}`;
  
  // Area fill under curve
  const firstPointX = getX(sortedIndices[0]);
  const lastPointX = getX(sortedIndices[sortedIndices.length - 1]);
  const baselineY = height - paddingBottom;
  const areaPath = `${linePath} L ${lastPointX},${baselineY} L ${firstPointX},${baselineY} Z`;

  return (
    <div className="w-full flex flex-col justify-between h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
            {t.fleetHealthTrend}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {isRTL ? 'متوسط الأسطول ٨٨٪ (+٣.٢٪ نمو هذا الشهر)' : 'Fleet Average 88% (+3.2% this month)'}
            </span>
          </div>
        </div>

        {/* Time range tabs */}
        <div className="inline-flex max-w-full overflow-x-auto rounded-xl p-0.5 sm:p-1 bg-neutral-100/80 dark:bg-neutral-800/80 text-xs">
          {(['7d', '30d', '3m', '1y'] as const).map((r) => {
            const labels = {
              '7d': t.last7Days,
              '30d': t.last30Days,
              '3m': t.last3Months,
              '1y': t.lastYear,
            };
            const isActive = timeRange === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines - soft and subtle */}
          {[70, 80, 90, 100].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-neutral-200/40 dark:text-neutral-800/60"
                  strokeDasharray="4 6"
                />
                <text
                  x={isRTL ? width - paddingX + 8 : paddingX - 8}
                  y={y + 3}
                  textAnchor={isRTL ? 'start' : 'end'}
                  className="text-[10px] fill-neutral-400 dark:fill-neutral-500 font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#healthGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Interactive Tooltips */}
          {points.map((p, idx) => {
            const cx = getX(idx);
            const cy = getY(p.score);
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#10B981"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* X Axis Label */}
                <text
                  x={cx}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-neutral-400 dark:fill-neutral-500 font-medium"
                >
                  {isRTL ? p.labelAr : p.label}
                </text>

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={cx - 30}
                      y={cy - 32}
                      width="60"
                      height="22"
                      rx="6"
                      className="fill-neutral-900 dark:fill-white shadow-sm"
                    />
                    <text
                      x={cx}
                      y={cy - 18}
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-white dark:fill-neutral-900 font-mono"
                    >
                      {p.score} / 100
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between items-center px-1 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 dark:text-neutral-500">
        <span>{isRTL ? 'بيانات الفحص الدوري مستقرة' : 'Continuous telemetry nominal'}</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
          {isRTL ? 'جاهزية البث: ٩٨.٤٪' : 'Sync Rate: 98.4%'}
        </span>
      </div>
    </div>
  );
};

// 2. Fleet Health Gauge / Breakdown - Clean, calm and informative
interface FleetHealthBreakdownProps {
  score: number;
  healthyCount: number;
  attentionCount: number;
  criticalCount: number;
  totalCount: number;
  onlineCount?: number;
}

export const FleetHealthBreakdown: React.FC<FleetHealthBreakdownProps> = ({
  score,
  healthyCount,
  attentionCount,
  criticalCount,
  totalCount,
  onlineCount = totalCount,
}) => {
  const { isRTL, t, setActiveSection } = useApp();

  const healthyPct = Math.round((healthyCount / totalCount) * 100);
  const attentionPct = Math.round((attentionCount / totalCount) * 100);
  const criticalPct = Math.max(0, 100 - healthyPct - attentionPct);

  return (
    <div className="bento-card flex flex-col justify-between h-full text-start">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            {t.fleetHealthSection}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isRTL ? 'جاهزية وتوزيع الأسطول للتأجير الفوري' : 'Fleet Rental Readiness & Health'}
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 text-end">
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {score}<span className="text-xs text-neutral-400 font-normal">/100</span>
          </div>
          <div className="text-[10px] font-medium text-emerald-700/80 dark:text-emerald-300">
            {isRTL ? 'مؤشر السلامة' : 'Health Score'}
          </div>
        </div>
      </div>

      {/* Donut Gauge & Top Highlights */}
      <div className="flex items-center gap-6 py-2">
        <div className="relative flex justify-center items-center shrink-0">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
            {/* Background circle track */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#F0F0EE"
              className="dark:stroke-neutral-800"
              strokeWidth="3.2"
            />

            {/* Segment 1: Healthy */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#10B981"
              strokeDasharray={`${healthyPct} ${100 - healthyPct}`}
              strokeDashoffset="0"
              strokeWidth="3.4"
              strokeLinecap="round"
            />

            {/* Segment 2: Attention */}
            {attentionPct > 0 && (
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F59E0B"
                strokeDasharray={`${attentionPct} ${100 - attentionPct}`}
                strokeDashoffset={`${-healthyPct}`}
                strokeWidth="3.4"
                strokeLinecap="round"
              />
            )}

            {/* Segment 3: Critical */}
            {criticalPct > 0 && (
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F43F5E"
                strokeDasharray={`${criticalPct} ${100 - criticalPct}`}
                strokeDashoffset={`${-(healthyPct + attentionPct)}`}
                strokeWidth="3.4"
                strokeLinecap="round"
              />
            )}
          </svg>

          {/* Center Metric */}
          <div className="absolute flex flex-col items-center justify-center text-center select-none">
            <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white leading-none">
              {healthyPct}%
            </span>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">
              {isRTL ? 'جاهزة للتأجير' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Quick summary numbers next to gauge */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {isRTL ? 'جاهزة فوراً للتسليم' : 'Ready to Rent'}
            </span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">{healthyCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {isRTL ? 'ملاحظة وقائية بالفرع' : 'Branch Inspection'}
            </span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">{attentionCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {isRTL ? 'متوقفة بالورشة' : 'In Workshop'}
            </span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">{criticalCount}</span>
          </div>
        </div>
      </div>

      {/* Proportional Segmented Progress Bar */}
      <div className="w-full h-2 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex my-2">
        <div style={{ width: `${healthyPct}%` }} className="h-full bg-emerald-500" title={`Ready: ${healthyPct}%`} />
        <div style={{ width: `${attentionPct}%` }} className="h-full bg-amber-500" title={`Attention: ${attentionPct}%`} />
        <div style={{ width: `${criticalPct}%` }} className="h-full bg-rose-500" title={`Critical: ${criticalPct}%`} />
      </div>

      {/* Clean Telemetry & Action Footer */}
      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {isRTL ? `${onlineCount} من ${totalCount} أجهزة تبث قياسات OBD-II` : `${onlineCount}/${totalCount} OBD streams active`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setActiveSection('vehicles')}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {isRTL ? 'تفاصيل الأسطول ←' : 'View Fleet →'}
        </button>
      </div>
    </div>
  );
};

// 3. Sensor Baseline Comparison Bar
interface SensorBaselineComparisonProps {
  name: string;
  unit: string;
  currentValue: number;
  baselineMin: number;
  baselineMax: number;
  scaleMin: number;
  scaleMax: number;
  isWarning?: boolean;
}

export const SensorBaselineComparisonBar: React.FC<SensorBaselineComparisonProps> = ({
  name,
  unit,
  currentValue,
  baselineMin,
  baselineMax,
  scaleMin,
  scaleMax,
  isWarning,
}) => {
  const { isRTL, t } = useApp();

  const toPct = (val: number) => {
    const clamped = Math.max(scaleMin, Math.min(scaleMax, val));
    return ((clamped - scaleMin) / (scaleMax - scaleMin)) * 100;
  };

  const baselineLeft = toPct(baselineMin);
  const baselineWidth = toPct(baselineMax) - baselineLeft;
  const currentPos = toPct(currentValue);

  const isOutOfBaseline = currentValue < baselineMin || currentValue > baselineMax;

  return (
    <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-[#1A1A1A] dark:text-white">
          {name}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm font-bold font-mono ${
              isOutOfBaseline
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-[#1A1A1A] dark:text-white'
            }`}
          >
            {currentValue} {unit}
          </span>
          {isOutOfBaseline && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {isRTL ? 'شذوذ مرصود' : 'Drift Logged'}
            </span>
          )}
        </div>
      </div>

      {/* Progress track (LTR direction for numerical scale) */}
      <div dir="ltr" className="relative h-3.5 rounded-full bg-[#E5E5E1] dark:bg-[#2C2C27] overflow-hidden">
        {/* Baseline Safe Zone */}
        <div
          style={{
            left: `${baselineLeft}%`,
            width: `${baselineWidth}%`,
          }}
          className="absolute inset-y-0 bg-[#10B981]/25 dark:bg-[#10B981]/20 border-x border-[#10B981]/50"
          title={isRTL ? `النطاق الطبيعي: ${baselineMin} - ${baselineMax} ${unit}` : `Normal Baseline: ${baselineMin} - ${baselineMax} ${unit}`}
        />

        {/* Current Value Indicator Needle */}
        <div
          style={{ left: `${currentPos}%` }}
          className={`absolute top-0 bottom-0 w-2 -ml-1 rounded-full z-10 transition-all ${
            isOutOfBaseline ? 'bg-amber-500 shadow-sm' : 'bg-[#10B981]'
          }`}
        />
      </div>

      <div dir="ltr" className="flex items-center justify-between mt-1 text-[10px] text-[#71716A] dark:text-[#8E8E86] font-mono">
        <span>{scaleMin} {unit}</span>
        <span className="text-[#10B981] font-medium font-sans">
          {t.baselineNormal}: {baselineMin}–{baselineMax} {unit}
        </span>
        <span>{scaleMax} {unit}</span>
      </div>
    </div>
  );
};
