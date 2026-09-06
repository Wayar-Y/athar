import React from 'react';
import { 
  X, 
  AlertTriangle, 
  AlertOctagon, 
  Car, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  FileCheck2, 
  Activity, 
  Battery, 
  Wrench, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Vehicle } from '../../types';
import { SaudiLicensePlate } from '../common/SaudiLicensePlate';

export interface PriorityActionItem {
  id: string;
  severity: 'critical' | 'warning';
  count: number;
  label: string;
  explanation: string;
  recommended: string;
  vehicleIds: string[];
  vehicleNotes?: Record<string, { ar: string; en: string; metric?: string }>;
  isInspectionAction?: boolean;
}

interface PriorityVehiclesModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: PriorityActionItem | null;
  vehicles: Vehicle[];
  onSelectVehicle: (vehicleId: string) => void;
  onStartInspection: () => void;
  isRTL: boolean;
}

export const PriorityVehiclesModal: React.FC<PriorityVehiclesModalProps> = ({
  isOpen,
  onClose,
  action,
  vehicles,
  onSelectVehicle,
  onStartInspection,
  isRTL,
}) => {
  if (!isOpen || !action) return null;

  // Find all vehicle objects for this action
  const matchedVehicles = vehicles.filter((v) => action.vehicleIds.includes(v.id));

  // Fallback: If for any reason matchedVehicles is empty, pick vehicles by health status
  const displayedVehicles = matchedVehicles.length > 0 
    ? matchedVehicles 
    : vehicles.slice(0, action.count);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E5E1] dark:border-[#2C2C27] bg-[#F9F9F7] dark:bg-[#20201D] flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              action.severity === 'critical'
                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {action.severity === 'critical' ? (
                <AlertOctagon className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  action.severity === 'critical'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {action.severity === 'critical' ? (isRTL ? 'إجراء عاجل وحرج' : 'CRITICAL ACTION') : (isRTL ? 'إجراء تحذيري وقائي' : 'WARNING ACTION')}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-white dark:bg-[#2A2A26] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white">
                  {displayedVehicles.length} {isRTL ? 'مركبات محددة' : 'Vehicles Identified'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] dark:text-white leading-snug">
                {action.label}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71716A] hover:text-[#1A1A1A] dark:text-[#8E8E86] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnosis & Recommendation Banner */}
        <div className="p-4 bg-amber-50/40 dark:bg-amber-950/15 border-b border-[#E5E5E1] dark:border-[#2C2C27] text-xs space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#1A1A1A] dark:text-white shrink-0">
              {isRTL ? 'السبب التشخيصي:' : 'Diagnostic Cause:'}
            </span>
            <span className="text-[#71716A] dark:text-[#8E8E86]">
              {action.explanation}
            </span>
          </div>
          <div className="flex items-start gap-2 pt-1 border-t border-[#E5E5E1]/60 dark:border-[#2C2C27]/60">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
              {isRTL ? 'الإجراء الموصى به:' : 'Recommended Plan:'}
            </span>
            <span className="font-medium text-[#1A1A1A] dark:text-white">
              {action.recommended}
            </span>
          </div>
        </div>

        {/* Vehicles List Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 divide-y divide-[#E5E5E1]/40 dark:divide-[#2C2C27]/40">
          <div className="text-xs font-bold text-[#71716A] dark:text-[#8E8E86] uppercase tracking-wider mb-2">
            {isRTL ? 'قائمة المركبات المعنية بهذا الإجراء:' : 'Vehicles Subject to this Action:'}
          </div>

          {displayedVehicles.map((vehicle, idx) => {
            const specificNote = action.vehicleNotes?.[vehicle.id];

            return (
              <div 
                key={vehicle.id} 
                className="pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] hover:border-[#D1D1CB] dark:hover:border-[#42423C] transition-all"
              >
                {/* Vehicle Main Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-[#1A1A1A] dark:text-white truncate">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </span>
                    
                    {/* Saudi Plate Badge */}
                    <SaudiLicensePlate
                      plateNumber={vehicle.plateNumber}
                      plateNumberAr={vehicle.plateNumberAr}
                      size="xs"
                    />

                    {/* Operational Status Pill */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      vehicle.status === 'rented'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : vehicle.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                    }`}>
                      {vehicle.status === 'rented'
                        ? (isRTL ? 'مؤجرة حالياً' : 'Currently Rented')
                        : vehicle.status === 'available'
                        ? (isRTL ? 'متاحة بالفرع' : 'Available')
                        : (isRTL ? 'متوقفة بالورشة' : 'In Workshop')}
                    </span>
                  </div>

                  {/* Branch & Health Score */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#71716A] dark:text-[#8E8E86]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#71716A]" />
                      <span>{isRTL ? vehicle.branchAr : vehicle.branch}</span>
                    </span>
                    <span className="font-mono">
                      {isRTL ? 'مؤشر الصحة:' : 'Health:'} <strong className={`${
                        vehicle.healthScore < 65 ? 'text-red-600 dark:text-red-400' : vehicle.healthScore < 85 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>{vehicle.healthScore}/100</strong>
                    </span>
                    <span className="font-mono">
                      {vehicle.mileageKm.toLocaleString()} {isRTL ? 'كم' : 'km'}
                    </span>
                  </div>

                  {/* Plain Language Specific Note for this car */}
                  <div className="p-2 rounded-lg bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] text-xs text-[#1A1A1A] dark:text-[#F5F5F0]">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 me-1">
                      {isRTL ? 'ملاحظة الفحص الحالية:' : 'Current Issue:'}
                    </span>
                    <span>
                      {specificNote 
                        ? (isRTL ? specificNote.ar : specificNote.en)
                        : (isRTL ? vehicle.primaryRiskIssueAr : vehicle.primaryRiskIssue)
                      }
                    </span>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {action.isInspectionAction && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onStartInspection();
                      }}
                      className="px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>{isRTL ? 'فحص الاستلام' : 'Inspect'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectVehicle(vehicle.id);
                    }}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-[#1A1A1A] text-white hover:bg-black dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-[#F5F5F0] transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{isRTL ? 'الملف الفني' : 'View Dossier'}</span>
                    {isRTL ? (
                      <ArrowLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5E5E1] dark:border-[#2C2C27] bg-[#F9F9F7] dark:bg-[#20201D] flex items-center justify-between gap-3">
          <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">
            {isRTL 
              ? 'يتم تحديث المؤشرات تلقائياً عبر تدفق أجهزة OBD-II اللحظية' 
              : 'Diagnostics stream live via connected OBD-II dongles'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F5F5F0] hover:bg-[#EAEAE5] dark:bg-[#2A2A26] dark:hover:bg-[#32322E] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] transition-colors"
          >
            {isRTL ? 'إغلاق النافذة' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
