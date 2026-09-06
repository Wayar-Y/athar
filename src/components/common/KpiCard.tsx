import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'critical';
  progress?: number;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  variant = 'default',
  progress,
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          container: 'bg-white dark:bg-[#1A1A18] hover:border-amber-400/40',
          valColor: 'text-amber-600 dark:text-amber-400',
          iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
          indicator: 'bg-amber-500',
        };
      case 'critical':
        return {
          container: 'bg-white dark:bg-[#1A1A18] hover:border-rose-400/40',
          valColor: 'text-rose-600 dark:text-rose-400',
          iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20',
          indicator: 'bg-rose-500',
        };
      case 'success':
        return {
          container: 'bg-white dark:bg-[#1A1A18] hover:border-emerald-400/40',
          valColor: 'text-neutral-900 dark:text-neutral-100',
          iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
          indicator: 'bg-emerald-500',
        };
      default:
        return {
          container: 'bg-white dark:bg-[#1A1A18] hover:border-neutral-300 dark:hover:border-neutral-700',
          valColor: 'text-neutral-900 dark:text-neutral-100',
          iconBg: 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 ring-1 ring-neutral-200/60 dark:ring-neutral-700/60',
          indicator: 'bg-neutral-400',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bento-card h-full min-h-[140px] p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 ${styles.container} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${styles.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-3 mt-3">
          <span className={`text-2xl sm:text-3xl font-bold tracking-tight font-mono ${styles.valColor}`}>
            {value}
          </span>
          {trend && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md inline-flex items-center gap-1 shrink-0 ${
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-1 ring-emerald-500/20'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-1 ring-rose-500/20'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="whitespace-nowrap font-sans">{trend.value}</span>
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <div className="text-[11px] font-normal text-neutral-400 dark:text-neutral-400 mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
};
