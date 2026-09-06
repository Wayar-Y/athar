import { RentalWorkspace } from '../components/common/RentalWorkspace';
import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  FileCheck2, 
  Car, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const OperationsView: React.FC = () => {
  const { 
    vehicles, 
    viewVehicleDetail, 
    setIsInspectionModalOpen, 
    isRTL, 
    t 
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'before_rental' | 'post_rental'>('all');

  // Collect all inspections
  const allInspections = vehicles.flatMap((v) =>
    (v.inspections || []).map((insp) => ({
      ...insp,
      vehicleName: `${v.make} ${v.model} (${v.year})`,
      plateNumber: v.plateNumber,
      plateNumberAr: v.plateNumberAr,
      currentHealth: v.healthScore,
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = allInspections.filter((insp) => {
    if (filterType !== 'all' && insp.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-start">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
            {t.operationsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#71716A] dark:text-[#8E8E86] mt-0.5">
            {t.operationsSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInspectionModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1A1A1A] hover:bg-black dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-[#F5F5F0] text-white shadow-xs transition-colors self-start sm:self-auto"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>{t.conductInspectionTitle}</span>
        </button>
      </div>

      <RentalWorkspace />
      {/* Quick Stats Grid in Bento Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bento-card p-4">
          <span className="text-xs text-[#71716A] dark:text-[#8E8E86] font-medium">
            {isRTL ? 'إجمالي الفحوصات المنفذة' : 'Total Inspections Conducted'}
          </span>
          <p className="text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white mt-1">
            {allInspections.length}
          </p>
          <span className="text-[10px] text-[#10B981] font-medium">{isRTL ? 'فحوصات مسجلة' : 'Recorded inspections'}</span>
        </div>

        <div className="bento-card p-4">
          <span className="text-xs text-[#71716A] dark:text-[#8E8E86] font-medium">
            {isRTL ? 'فحوصات ما قبل التسليم' : 'Pre-Rental Handoffs'}
          </span>
          <p className="text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white mt-1">
            {allInspections.filter((i) => i.type === 'before_rental').length}
          </p>
          <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'توثيق خط الأساس' : 'Baseline recorded'}</span>
        </div>

        <div className="bento-card p-4">
          <span className="text-xs text-[#71716A] dark:text-[#8E8E86] font-medium">
            {isRTL ? 'فحوصات الاسترجاع بعد التأجير' : 'Post-Rental Returns'}
          </span>
          <p className="text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white mt-1">
            {allInspections.filter((i) => i.type === 'post_rental').length}
          </p>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">{isRTL ? 'تحليل الفوارق التشخيصية' : 'Delta analyzed'}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="inline-flex rounded-lg p-1 bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-xs">
        {[
          { id: 'all', label: isRTL ? 'جميع الفحوصات' : 'All Audits' },
          { id: 'before_rental', label: t.beforeRental },
          { id: 'post_rental', label: t.postRental },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilterType(f.id as any)}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              filterType === f.id
                ? 'bg-white dark:bg-[#1B1B18] text-[#1A1A1A] dark:text-white shadow-xs'
                : 'text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Inspections Feed */}
      <div className="space-y-4">
        {filtered.map((insp) => (
          <div
            key={insp.id}
            onClick={() => viewVehicleDetail(insp.vehicleId)}
            className="bento-card p-5 hover:border-[#1A1A1A]/30 dark:hover:border-white/30 cursor-pointer transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  insp.type === 'before_rental'
                    ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                    : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                }`}>
                  {insp.type === 'routine' ? (isRTL ? 'فحص دوري' : 'Routine inspection') : insp.type === 'before_rental' ? t.beforeRental : t.postRental}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                    {insp.vehicleName}
                  </h3>
                  <p className="text-xs text-[#71716A] dark:text-[#8E8E86] font-mono">
                    {insp.plateNumber} • {insp.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-[#71716A] dark:text-[#8E8E86]">
                  {t.inspector}: <strong className="text-[#1A1A1A] dark:text-white">{insp.inspectorName}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] font-mono font-bold text-[#1A1A1A] dark:text-white">
                  {insp.healthScore}/100
                </span>
              </div>
            </div>

            {/* Condition Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[#71716A] dark:text-[#8E8E86] block text-[10px] uppercase tracking-wider">{t.exteriorCondition}</span>
                <strong className="capitalize text-[#1A1A1A] dark:text-white">
                  {insp.condition.exterior.replace('_', ' ')}
                </strong>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[#71716A] dark:text-[#8E8E86] block text-[10px] uppercase tracking-wider">{t.interiorCondition}</span>
                <strong className="capitalize text-[#1A1A1A] dark:text-white">
                  {insp.condition.interior.replace('_', ' ')}
                </strong>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[#71716A] dark:text-[#8E8E86] block text-[10px] uppercase tracking-wider">{t.tiresCondition}</span>
                <strong className="capitalize text-[#1A1A1A] dark:text-white">
                  {insp.condition.tires.replace('_', ' ')}
                </strong>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[#71716A] dark:text-[#8E8E86] block text-[10px] uppercase tracking-wider">{t.mileage}</span>
                <strong className="font-mono text-[#1A1A1A] dark:text-white">
                  {insp.mileage.toLocaleString()} km
                </strong>
              </div>
            </div>

            <p className="text-xs text-[#71716A] dark:text-[#8E8E86]">
              {isRTL ? insp.notesAr : insp.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
