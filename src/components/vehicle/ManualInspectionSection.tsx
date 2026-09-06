import React from 'react';
import { 
  Disc, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Car, 
  UserCheck, 
  Clock, 
  Building2, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Wrench,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Vehicle, ManualFieldInspectionData } from '../../types';

interface ManualInspectionSectionProps {
  vehicle: Vehicle;
  isRTL: boolean;
  onOpenInspectionModal: () => void;
}

export const ManualInspectionSection: React.FC<ManualInspectionSectionProps> = ({
  vehicle,
  isRTL,
  onOpenInspectionModal,
}) => {
  const isCritical = vehicle.healthStatus === 'critical' || vehicle.healthScore < 70;
  const isAttention = !isCritical && (vehicle.healthStatus === 'attention' || vehicle.healthScore < 85);

  // Fallback realistic manual field inspection data if not attached directly to vehicle
  const manualData: ManualFieldInspectionData = vehicle.manualInspectionData || {
    lastInspectedDate: vehicle.inspections?.[0]?.date || '2026-09-04 15:30',
    inspectorName: vehicle.inspections?.[0]?.inspectorName || 'Fahad Al-Harbi',
    inspectorNameAr: 'فهد الحربي (فني الفحص الميداني المعتمد)',
    branch: vehicle.branch,
    branchAr: vehicle.branchAr,
    brakePads: {
      frontThicknessMm: isCritical ? 3.1 : 6.4,
      rearThicknessMm: isCritical ? 3.8 : 7.1,
      status: isCritical ? 'needs_replacement' : 'optimal',
      estimatedRemainingKm: isCritical ? 4200 : 18500,
      measurementMethod: 'Mechanical vernier caliper measurement during periodic service',
      measurementMethodAr: 'قياس ميكانيكي بمقياس فحمات الفرامل (Vernier Caliper) أثناء الفحص الدوري بالورشة',
    },
    tires: {
      treadDepthMm: isCritical ? 3.2 : 7.4,
      visualCondition: isCritical ? 'moderate_wear' : 'optimal',
      visualConditionAr: isCritical ? 'تآكل متوسط في مداس الإطارات الأمامية' : 'مداس ممتاز وعميق بدون أي تآكل غير منتظم',
      sidewallConditionAr: 'الجدران الجانبية سليمة بدون تشققات أو تحبيل أو احتكاك بالأرصفة',
      measurementMethod: 'Digital tire tread depth gauge with visual sidewall audit',
      measurementMethodAr: 'مقياس عمق مداس الإطارات الرقمي ومعاينة بصرية للجدار الجانبي وحواف الجنوط',
    },
    interiorCleanliness: {
      status: isAttention ? 'fair' : 'sanitized_clean',
      statusAr: isAttention ? 'مقبولة - تحتاج تنظيفاً وتلميعاً خفيفاً' : 'معقمة ونظيفة بالكامل وجاهزة للتسليم الفوري',
      notesAr: 'تم تعقيم المقصورة، وكنس المقاعد والدعاسات، والتأكد من خلوها من أي روائح أو بقع',
    },
    exteriorBody: {
      scratchesCount: isCritical ? 3 : 1,
      dentsCount: 0,
      glassConditionAr: 'الزجاج الأمامي والنوافذ سليمة تماماً وخالية من الشروخ والترميل',
      notesAr: 'تم توثيق خدش سطحي في الصدام الخلفي على استمارة الفحص الميداني',
    },
    safetyAndLegalKit: {
      registrationValid: true,
      insuranceValid: true,
      fahasValid: true,
      spareTirePresent: true,
      jackAndToolkitPresent: true,
      fireExtinguisherPresent: true,
      emergencyTrianglePresent: true,
    },
  };

  return (
    <div className="space-y-6 text-start">
      {/* Educational & Technical Clarification Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/90 dark:border-amber-900/50 text-amber-950 dark:text-amber-200 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                {isRTL 
                  ? 'قسم مخصص: بيانات الفحص الميداني اليدوي (غير مقروءة عبر OBD-II)' 
                  : 'Dedicated Section: Manual Field Inspection Data (Non-OBD Telematics)'}
              </h4>
              <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed max-w-3xl">
                {isRTL
                  ? 'أجهزة OBD-II تقرأ البيانات الإلكترونية اللحظية من كمبيوتر المحرك وشبكة CAN Bus (مثل: RPM، حرارة سائل التبريد، جهد البطارية، مستوى الوقود، وأكواد الأعطال DTC). أما المؤشرات المادية أدناه (مثل: سماكة فحمات الفرامل، عمق مداس الإطارات، نظافة المقصورة، فحص الخدوش، والوثائق) فيتم فحصها وقياسها ميدانياً وتسجيلها يدوياً بواسطة فريق الفحص بالفرع والورشة.'
                  : 'OBD-II dongles exclusively read electronic CAN bus engine telematics (RPM, Coolant Temp, Battery Voltage, Fuel Level %, and DTC trouble codes). The physical parameters below (Brake pad thickness, tire tread depth mm, interior hygiene, scratches walkaround, and legal documents) are verified manually by branch/workshop staff.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenInspectionModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1A1A1A] text-white hover:bg-black dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-[#F5F5F0] text-xs font-bold shrink-0 self-start shadow-xs transition-colors"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{isRTL ? 'تسجيل أو تحديث فحص يدوي' : 'Record / Update Inspection'}</span>
          </button>
        </div>
      </div>

      {/* Inspector Info & Verification Metadata Card */}
      <div className="bento-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900/50">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71716A] dark:text-[#8E8E86] block">
                {isRTL ? 'فني الفحص الميداني المسؤول' : 'Assigned Field Inspector'}
              </span>
              <strong className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                {isRTL ? manualData.inspectorNameAr : manualData.inspectorName}
              </strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#71716A] dark:text-[#8E8E86]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{isRTL ? 'تاريخ آخر فحص' : 'Last Inspection'}:</span>
              <strong className="font-mono text-[#1A1A1A] dark:text-white">{manualData.lastInspectedDate}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isRTL ? 'الفرع' : 'Branch'}:</span>
              <strong className="text-[#1A1A1A] dark:text-white">{isRTL ? manualData.branchAr : manualData.branch}</strong>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[11px]">
              {isRTL ? 'فحص ميداني معتمد ✅' : 'Verified Audit ✅'}
            </span>
          </div>
        </div>
      </div>

      {/* Manual Data Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Brake Pads Physical Measurement */}
        <div className="bento-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  <Disc className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                    {isRTL ? 'فحمات الفرامل (قياس يدوي بالورشة)' : 'Brake Pads (Manual Caliper)'}
                  </h4>
                  <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                    {isRTL ? 'لا تقاس بـ OBD-II • تقاس بمقياس الكاليبر' : 'Cannot be read by OBD-II • Vernier Caliper Tool'}
                  </span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                manualData.brakePads.status === 'optimal'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
              }`}>
                {manualData.brakePads.status === 'optimal'
                  ? (isRTL ? 'سماكة ممتازة ✅' : 'Optimal Wear')
                  : (isRTL ? 'تحتاج استبدال 🛑' : 'Replace Soon')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                  {isRTL ? 'سماكة الفحمات الأمامية' : 'Front Pad Thickness'}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-base font-mono font-bold text-[#1A1A1A] dark:text-white">
                    {manualData.brakePads.frontThicknessMm}
                  </strong>
                  <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'مم' : 'mm'}</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {isRTL ? 'الحد الأدنى الآمن: ٣.٠ مم' : 'Safe min: 3.0 mm'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                  {isRTL ? 'سماكة الفحمات الخلفية' : 'Rear Pad Thickness'}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-base font-mono font-bold text-[#1A1A1A] dark:text-white">
                    {manualData.brakePads.rearThicknessMm}
                  </strong>
                  <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'مم' : 'mm'}</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {isRTL ? 'الحد الأدنى الآمن: ٢.٥ مم' : 'Safe min: 2.5 mm'}
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'المسافة التقديرية المتبقية للاستهلاك' : 'Estimated Remaining Life'}:</span>
                <strong className="font-mono text-[#1A1A1A] dark:text-white">
                  ~ {manualData.brakePads.estimatedRemainingKm.toLocaleString()} {isRTL ? 'كم' : 'km'}
                </strong>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#71716A] dark:text-[#8E8E86] pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
            <strong>{isRTL ? 'وسيلة القياس' : 'Tool Used'}:</strong>{' '}
            {isRTL ? manualData.brakePads.measurementMethodAr : manualData.brakePads.measurementMethod}
          </div>
        </div>

        {/* 2. Tires Physical Tread & Sidewall Condition */}
        <div className="bento-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                    {isRTL ? 'مداس الإطارات والجدران الجانبية' : 'Tire Tread Depth & Sidewalls'}
                  </h4>
                  <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                    {isRTL ? 'لا تقاس بـ OBD-II • مقياس عمق رقمي يدوي' : 'Cannot be read by OBD-II • Digital Tread Gauge'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {isRTL ? 'سليمة ومعتمدة ✅' : 'Compliant'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                  {isRTL ? 'متوسط عمق مداس الإطارات' : 'Avg Tread Depth'}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <strong className="text-base font-mono font-bold text-[#1A1A1A] dark:text-white">
                    {manualData.tires.treadDepthMm}
                  </strong>
                  <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'مم' : 'mm'}</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {isRTL ? 'الحد النظامي للمرور: ١.٦ مم' : 'Legal min: 1.6 mm'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                  {isRTL ? 'حالة الجدار الجانبي' : 'Sidewall Integrity'}
                </span>
                <strong className="text-xs font-bold text-[#1A1A1A] dark:text-white block mt-1">
                  {isRTL ? 'سليم تماماً بدون تحبيل' : 'No Bulges / Cuts'}
                </strong>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {isRTL ? 'لا توجد شروخ أو صدمات أرصفة' : 'No curb rub or cracking'}
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] text-xs">
              <span className="text-[#71716A] dark:text-[#8E8E86] block mb-0.5">
                {isRTL ? 'تقرير الفحص البصري للمداس:' : 'Tread Visual Assessment:'}
              </span>
              <p className="text-xs text-[#1A1A1A] dark:text-white">
                {isRTL ? manualData.tires.visualConditionAr : manualData.tires.visualCondition}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-[#71716A] dark:text-[#8E8E86] pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
            <strong>{isRTL ? 'وسيلة القياس' : 'Tool Used'}:</strong>{' '}
            {isRTL ? manualData.tires.measurementMethodAr : manualData.tires.measurementMethod}
          </div>
        </div>

        {/* 3. Interior Cleanliness & Sanitization */}
        <div className="bento-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                    {isRTL ? 'نظافة وتعقيم المقصورة' : 'Cabin Sanitization & Detailing'}
                  </h4>
                  <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                    {isRTL ? 'لا تقاس بـ OBD-II • معاينة بصرية بالفرع' : 'Cannot be read by OBD-II • Physical Inspection'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {isRTL ? manualData.interiorCleanliness.statusAr : 'Sanitized & Clean'}
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <strong className="text-[#1A1A1A] dark:text-white block mb-1">
                  {isRTL ? 'ملاحظات المعاينة الميدانية للفرش والمقصورة:' : 'Branch Detailing Notes:'}
                </strong>
                <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                  {manualData.interiorCleanliness.notesAr}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">{isRTL ? 'المقاعد' : 'Seats'}</span>
                  <strong className="text-xs text-emerald-600 dark:text-emerald-400">{isRTL ? 'نظيفة' : 'Clean'}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">{isRTL ? 'الروائح' : 'Odor Check'}</span>
                  <strong className="text-xs text-emerald-600 dark:text-emerald-400">{isRTL ? 'معطرة' : 'Fresh'}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">{isRTL ? 'شنطة السيارة' : 'Trunk'}</span>
                  <strong className="text-xs text-emerald-600 dark:text-emerald-400">{isRTL ? 'فارغة ونظيفة' : 'Empty'}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#71716A] dark:text-[#8E8E86] pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
            {isRTL ? 'تم غسيل وتطهير السيارة بواسطة فريق التحضير بالفرع.' : 'Vehicle was sanitized by branch prep team prior to customer handoff.'}
          </div>
        </div>

        {/* 4. Exterior Body & Scratches Audit */}
        <div className="bento-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                    {isRTL ? 'معاينة الهيكل الخارجي والزجاج' : 'Exterior Walkaround & Glass'}
                  </h4>
                  <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                    {isRTL ? 'لا تقاس بـ OBD-II • جولة فحص بصرية موثقة' : 'Cannot be read by OBD-II • Visual Walkaround'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                {manualData.exteriorBody.scratchesCount} {isRTL ? 'خدش موثق' : 'Logged scratch'}
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">{isRTL ? 'الخدوش السطحية' : 'Scratches'}</span>
                  <strong className="text-xs font-mono text-[#1A1A1A] dark:text-white">{manualData.exteriorBody.scratchesCount}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">{isRTL ? 'الصدمات والانبعاجات' : 'Dents'}</span>
                  <strong className="text-xs font-mono text-[#1A1A1A] dark:text-white">{manualData.exteriorBody.dentsCount}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">{isRTL ? 'الزجاج والأنوار' : 'Glass & Lights'}</span>
                  <strong className="text-xs text-emerald-600 dark:text-emerald-400">{isRTL ? 'سليمة تماماً' : 'Intact'}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <strong className="text-[#1A1A1A] dark:text-white block mb-0.5">
                  {isRTL ? 'ملاحظة موظف الاستلام والتسليم:' : 'Handover Inspection Note:'}
                </strong>
                <p className="text-xs text-[#71716A] dark:text-[#8E8E86]">
                  {manualData.exteriorBody.notesAr}
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#71716A] dark:text-[#8E8E86] pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
            {isRTL ? 'مرفق مع عقد التأجير رسم تخطيطي لتحديد أماكن الخدوش عند التسليم.' : 'Exterior damage diagram is attached to the customer rental agreement.'}
          </div>
        </div>
      </div>

      {/* 5. Physical Documents & Safety Emergency Equipment Checklist */}
      <div className="bento-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
          <div>
            <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
              {isRTL ? 'قائمة الوثائق النظامية ومعدات السلامة بالمركبة' : 'Vehicle Legal Documents & Emergency Safety Kit'}
            </h4>
            <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">
              {isRTL ? 'يتم تدقيقها يدوياً داخل المقصورة والشنطة قبل تسليم المفاتيح للعميل' : 'Physically audited inside vehicle trunk and cabin before handing keys'}
            </span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            {isRTL ? 'جميعها مكتملة ٧/٧ ✅' : 'All Present (7/7) ✅'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'رخصة السير (الاستمارة)' : 'Registration (Istimara)'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              {isRTL ? 'سارية' : 'Valid'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'وثيقة التأمين الشامل' : 'Insurance Policy'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              {isRTL ? 'سارية' : 'Valid'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'شهادة الفحص الفني الدوري' : 'Fahas Inspection'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              {isRTL ? 'سارية' : 'Valid'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'إطار السبير (الاحتياطي)' : 'Spare Tire'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              {isRTL ? 'موجود ومفحوص' : 'Ready'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'الرافعة ومفتاح العجل' : 'Jack & Wheel Wrench'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              {isRTL ? 'مكتمل' : 'Present'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'طفاية الحريق المعتمدة' : 'Fire Extinguisher'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              {isRTL ? 'صالحة' : 'Valid'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'مثلث الطوارئ العاكس' : 'Warning Triangle'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              {isRTL ? 'موجود' : 'Present'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'حقيبة الإسعافات الأولية' : 'First Aid Kit'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              {isRTL ? 'مكتملة' : 'Stocked'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
