import React from 'react';
import { 
  X, 
  BrainCircuit, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Car, 
  Wrench, 
  ClipboardCheck, 
  ChevronRight, 
  CheckCircle2,
  Activity,
  Zap,
  Thermometer,
  Gauge,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIPrediction, Vehicle } from '../../types';

interface AIDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: AIPrediction | null;
  vehicle: Vehicle | null;
  onInspectVehicle?: (vehicleId: string) => void;
}

export const AIDiagnosisModal: React.FC<AIDiagnosisModalProps> = ({
  isOpen,
  onClose,
  prediction,
  vehicle,
  onInspectVehicle,
}) => {
  const { isRTL, t, viewVehicleDetail, setIsInspectionModalOpen, setSelectedVehicleForInspection } = useApp();

  if (!isOpen || !prediction || !vehicle) return null;

  const points = isRTL 
    ? (prediction.explanationPointsAr && prediction.explanationPointsAr.length > 0 ? prediction.explanationPointsAr : prediction.explanationPoints || [])
    : (prediction.explanationPoints && prediction.explanationPoints.length > 0 ? prediction.explanationPoints : prediction.explanationPointsAr || []);

  const windowText = isRTL 
    ? (prediction.estimatedWindowAr || prediction.estimatedWindow) 
    : (prediction.estimatedWindow || prediction.estimatedWindowAr);

  const handleStartInspection = () => {
    setSelectedVehicleForInspection(vehicle);
    setIsInspectionModalOpen(true);
    onClose();
  };

  const handleViewFullVehicle = () => {
    viewVehicleDetail(vehicle.id);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] rounded-2xl shadow-2xl overflow-hidden my-8 text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5E5E1] dark:border-[#2C2C27] bg-[#F9F9F7] dark:bg-[#20201D] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-xl shrink-0 mt-0.5 ${
              prediction.riskLevel === 'high' 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900' 
                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
            }`}>
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]">
                  {isRTL ? 'تحليل الذكاء التنبؤي' : 'AI Predictive Diagnosis'}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono">
                  {isRTL ? 'دقة النموذج' : 'Confidence'}: {prediction.confidenceScore}%
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] dark:text-white">
                {isRTL ? prediction.titleAr : prediction.title}
              </h2>
              <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                {isRTL ? prediction.componentAr : prediction.component} • {vehicle.make} {vehicle.model} ({vehicle.year})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#71716A] hover:text-[#1A1A1A] dark:text-[#8E8E86] dark:hover:text-white hover:bg-[#E5E5E1] dark:hover:bg-[#2C2C27] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-160px)] overflow-y-auto">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27]">
              <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86] block font-medium">
                {isRTL ? 'مستوى الخطورة' : 'Risk Severity'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  prediction.riskLevel === 'high' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
                <span className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                  {prediction.riskLevel === 'high' 
                    ? (isRTL ? 'مرتفعة (تدخل عاجل)' : 'High (Urgent)') 
                    : (isRTL ? 'متوسطة (متابعة)' : 'Medium (Monitor)')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27]">
              <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86] block font-medium">
                {isRTL ? 'النافذة الزمنية المتوقعة' : 'Expected Timeframe'}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[#1A1A1A] dark:text-white">
                <Clock className="w-4 h-4 text-[#71716A] dark:text-[#8E8E86]" />
                <span className="text-sm font-bold font-mono">{windowText}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27]">
              <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86] block font-medium">
                {isRTL ? 'احتمالية التعطل على الطريق' : 'Breakdown Probability'}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${prediction.riskLevel === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`}
                    style={{ width: `${prediction.probabilityPercent}%` }}
                  />
                </div>
                <span className="text-sm font-bold font-mono text-[#1A1A1A] dark:text-white">
                  {prediction.probabilityPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Context Pill */}
          <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Car className="w-4 h-4 text-[#71716A] dark:text-[#8E8E86]" />
              <span className="font-bold text-[#1A1A1A] dark:text-white">
                {vehicle.make} {vehicle.model}
              </span>
              <span className="font-mono px-2 py-0.5 rounded bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white">
                {isRTL ? vehicle.plateNumberAr : vehicle.plateNumber}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[#71716A] dark:text-[#8E8E86]">
              <span>{isRTL ? vehicle.branchAr : vehicle.branch}</span>
              <span>•</span>
              <span>
                {vehicle.rentalContext.isCurrentlyRented 
                  ? (isRTL ? 'في عقد إيجار نشط' : 'Currently on Rental')
                  : (isRTL ? 'متاحة للتأجير في الفرع' : 'Available at Branch')}
              </span>
            </div>
          </div>

          {/* Telemetry Baseline Comparison */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white mb-2.5 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#10B981]" />
              <span>{isRTL ? 'مقارنة قراءات الحساس بالنطاق المصنعي المعتمد' : 'Live Telemetry vs Certified Baseline'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20">
                <span className="text-[11px] font-medium text-rose-800 dark:text-rose-300 block">
                  {isRTL ? 'القراءة اللحظية للحساس (عبر OBD)' : 'Live Sensor Reading (via OBD)'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-extrabold font-mono text-rose-700 dark:text-rose-400">
                    {prediction.component.includes('Battery') 
                      ? `${vehicle.sensorData.batteryVoltage} V` 
                      : prediction.component.includes('Cooling') 
                      ? `${vehicle.sensorData.coolantTemp}°C` 
                      : `${vehicle.sensorData.engineLoad}%`}
                  </span>
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {isRTL ? '(انحراف مقلق)' : '(Deviation logged)'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
                <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 block">
                  {isRTL ? 'النطاق الطبيعي المعتمد للمحرك' : 'Certified OEM Operating Envelope'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                    {prediction.component.includes('Battery') 
                      ? `${vehicle.sensorData.batteryVoltageBaseline.min}V - ${vehicle.sensorData.batteryVoltageBaseline.max}V` 
                      : prediction.component.includes('Cooling') 
                      ? `${vehicle.sensorData.coolantTempBaseline.min}°C - ${vehicle.sensorData.coolantTempBaseline.max}°C` 
                      : '20% - 40%'}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {isRTL ? '(المعدل الطبيعي)' : '(Nominal Range)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Evidence Points */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isRTL ? 'الأدلة والقرائن التنبؤية المرصودة' : 'Telemetry Evidence & Sensor Patterns'}</span>
            </h4>
            <div className="space-y-2">
              {points.map((pt, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-start gap-3 text-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-[#1A1A1A] dark:text-[#E5E5E1] leading-relaxed">
                    {pt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rental Business Impact */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
            <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{isRTL ? 'الأثر التشغيلي على شركة التأجير' : 'Operational Rental Impact'}</span>
            </h5>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              {isRTL 
                ? 'التدخل الوقائي الآن يمنع توقف السيارة المفاجئ مع العميل على الطريق، مما يوفر تكاليف سحب ونقل المركبة (سطحة) واستبدالها بسيارة بديلة، ويحمي سمعة الشركة من شكاوى العملاء.'
                : 'Addressing this before dispatch eliminates roadside breakdowns with renters, preventing emergency towing charges and replacement vehicle dispatch while protecting customer satisfaction ratings.'}
            </p>
          </div>

          {/* Recommended Action Card */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
            <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isRTL ? 'الإجراء الوقائي الموصى به' : 'Recommended Preventive Action'}</span>
            </h5>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
              {isRTL ? prediction.recommendedActionAr : prediction.recommendedAction}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#E5E5E1] dark:border-[#2C2C27] bg-[#F9F9F7] dark:bg-[#20201D] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
          >
            {isRTL ? 'إغلاق النافذة' : 'Close'}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleStartInspection}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white hover:bg-[#E5E5E1] transition-colors"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>{isRTL ? 'فحص حالة رقمي' : 'Digital Inspection'}</span>
            </button>

            <button
              type="button"
              onClick={handleViewFullVehicle}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] hover:opacity-90 transition-opacity"
            >
              <span>{isRTL ? 'ملف تشخيص المركبة الكامل' : 'Full Vehicle Diagnostic'}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
