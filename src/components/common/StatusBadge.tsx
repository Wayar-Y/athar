import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Wifi, WifiOff, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type BadgeType = 
  | 'health' 
  | 'device' 
  | 'rental' 
  | 'carStatus'
  | 'vehicleStatus'
  | 'risk' 
  | 'severity'
  | 'maintenance'
  | 'analysis';

interface StatusBadgeProps {
  type: BadgeType;
  status: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  status,
  size = 'md',
  showIcon = true,
}) => {
  const { isRTL, t } = useApp();

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs font-medium' 
    : 'px-2.5 py-1 text-xs font-semibold';

  // Health Status
  if (type === 'health') {
    if (status === 'healthy') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="status-dot bg-[#10B981]" />
          <span>{t.healthy}</span>
        </span>
      );
    }
    if (status === 'attention') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="status-dot bg-[#F59E0B]" />
          <span>{t.needsAttention}</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50 ${sizeClasses} whitespace-nowrap`}>
        <span className="status-dot bg-[#EF4444]" />
        <span>{t.critical}</span>
      </span>
    );
  }

  // Device Connection Status
  if (type === 'device') {
    if (status === 'online') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/40 ${sizeClasses} whitespace-nowrap`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          {showIcon && <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />}
          <span>{t.online}</span>
        </span>
      );
    }
    if (status === 'delayed') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/40 ${sizeClasses} whitespace-nowrap`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          {showIcon && <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />}
          <span>{t.delayed}</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${sizeClasses} whitespace-nowrap`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
        {showIcon && <WifiOff className="w-3 h-3 text-slate-500 shrink-0" />}
        <span>{t.offline}</span>
      </span>
    );
  }

  // Car / Operational Status
  if (type === 'rental' || type === 'carStatus' || type === 'vehicleStatus') {
    const s = (status || '').toLowerCase().trim();
    if (s === 'available') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span>{t.available}</span>
        </span>
      );
    }
    if (s === 'rented') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          <span>{t.rented}</span>
        </span>
      );
    }
    if (s === 'maintenance' || s === 'inmaintenance') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>{t.inMaintenance}</span>
        </span>
      );
    }
    if (s === 'inspection' || s === 'ininspection') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>{t.inInspection}</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${sizeClasses} whitespace-nowrap`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
        <span>{status}</span>
      </span>
    );
  }

  // Risk Level
  if (type === 'risk' || type === 'severity') {
    if (status === 'low') {
      return (
        <span className={`inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-300 ${sizeClasses} whitespace-nowrap`}>
          {showIcon && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
          <span>{isRTL ? 'منخفض' : 'Low'}</span>
        </span>
      );
    }
    if (status === 'medium') {
      return (
        <span className={`inline-flex items-center gap-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-300 ${sizeClasses} whitespace-nowrap`}>
          {showIcon && <AlertTriangle className="w-3 h-3 text-amber-600" />}
          <span>{isRTL ? 'متوسط' : 'Medium'}</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-300 ${sizeClasses} whitespace-nowrap`}>
        {showIcon && <ShieldAlert className="w-3 h-3 text-rose-600" />}
        <span>{isRTL ? 'مرتفع' : 'High'}</span>
      </span>
    );
  }

  // Maintenance Status (overdue, upcoming, recommended, completed)
  if (type === 'maintenance') {
    if (status === 'overdue') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="status-dot bg-[#EF4444]" />
          {showIcon && <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />}
          <span>{isRTL ? 'متأخرة' : 'Overdue'}</span>
        </span>
      );
    }
    if (status === 'recommended') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="status-dot bg-[#F59E0B]" />
          {showIcon && <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />}
          <span>{isRTL ? 'موصى بها' : 'Recommended'}</span>
        </span>
      );
    }
    if (status === 'upcoming') {
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="status-dot bg-[#3B82F6]" />
          {showIcon && <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />}
          <span>{isRTL ? 'قادمة مجدولة' : 'Upcoming'}</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50 ${sizeClasses} whitespace-nowrap`}>
        <span className="status-dot bg-[#10B981]" />
        {showIcon && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />}
        <span>{isRTL ? 'مكتملة' : 'Completed'}</span>
      </span>
    );
  }

  // Subsystems Technical Health Analysis Status
  if (type === 'analysis') {
    if (status === 'healthy' || status === 'nominal' || status === 'optimal' || status === 'low') {
      const label = status === 'low' 
        ? (isRTL ? 'إجهاد منخفض' : 'Low Stress')
        : (isRTL ? 'سليم ومتطابق' : 'Nominal');
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="status-dot bg-[#10B981]" />
          {showIcon && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />}
          <span>{label}</span>
        </span>
      );
    }
    if (status === 'attention' || status === 'drift' || status === 'warning' || status === 'moderate') {
      const label = status === 'moderate'
        ? (isRTL ? 'إجهاد متوسط' : 'Moderate')
        : (isRTL ? 'انحراف طفيف' : 'Baseline Drift');
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50 ${sizeClasses} whitespace-nowrap`}>
          <span className="status-dot bg-[#F59E0B]" />
          {showIcon && <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />}
          <span>{label}</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50 ${sizeClasses} whitespace-nowrap`}>
        <span className="status-dot bg-[#EF4444]" />
        {showIcon && <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />}
        <span>{isRTL ? 'حرج يتطلب فحصاً' : 'Critical Drift'}</span>
      </span>
    );
  }

  return <span className={sizeClasses}>{status}</span>;
};
