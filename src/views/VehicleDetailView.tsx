import {inspectionConditionLabel, inspectionTypeLabel, inspectionNotes} from '../lib/inspectionLabels';
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight,
  Car, 
  Activity, 
  Wrench, 
  BrainCircuit, 
  ClipboardCheck, 
  History, 
  Download, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ShieldAlert, 
  Radio, 
  Gauge, 
  Battery, 
  Fuel, 
  Thermometer, 
  Clock,
  ChevronRight,
  FileCheck2,
  Building2,
  SlidersHorizontal,
  Info,
  ShieldCheck,
  Check,
  Wind,
  Disc,
  Sparkles,
  ClipboardList,
  Layers,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SaudiLicensePlate } from '../components/common/SaudiLicensePlate';
import { SensorBaselineComparisonBar } from '../components/common/ChartComponents';
import { ManualInspectionSection } from '../components/vehicle/ManualInspectionSection';
import { Vehicle } from '../types';

interface VehicleDetailViewProps {
  vehicle: Vehicle;
  onBack: () => void;
}

type TabType = 
  | 'handover' 
  | 'sensors' 
  | 'manual' 
  | 'faults' 
  | 'predictions' 
  | 'maintenance' 
  | 'inspections';

export const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({ vehicle, onBack }) => {
  const { 
    isRTL, 
    t, 
    setIsInspectionModalOpen, 
    setIsReportModalOpen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('handover');

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  // Unified severity assessment for consistent verdicts across the entire app
  const isCritical = vehicle.healthStatus === 'critical' || 
    vehicle.healthScore < 70 || 
    vehicle.status === 'maintenance' || 
    vehicle.status === 'inMaintenance' ||
    Boolean(vehicle.activeFaults && vehicle.activeFaults.some(f => f.severity === 'critical'));

  const isAttention = !isCritical && (
    vehicle.healthStatus === 'attention' || 
    vehicle.healthScore < 85 || 
    vehicle.status === 'inspection' || 
    vehicle.status === 'inInspection' ||
    Boolean(vehicle.activeFaults && vehicle.activeFaults.length > 0) ||
    vehicle.riskLevel === 'high' ||
    vehicle.riskLevel === 'medium'
  );

  const isHealthy = !isCritical && !isAttention;

  // Live telemetry readings
  const liveCoolant = vehicle.sensorData?.coolantTemp ?? (isCritical ? 104 : 90);
  const liveBattery = vehicle.sensorData?.batteryVoltage ?? (isCritical ? 11.8 : 12.6);
  const liveOil = (vehicle.sensorData as any)?.oilTempC ?? (isCritical ? 112 : 94);
  const liveRpm = vehicle.sensorData?.rpm ?? (isCritical ? 920 : 750);

  const isCoolantWarning = liveCoolant > 96 || liveCoolant < 75;
  const isBatteryWarning = liveBattery < 12.4 || liveBattery > 15.0;
  const isOilWarning = liveOil > 105;
  const isRpmWarning = liveRpm < 650 || liveRpm > 850;

  return (
    <div className="space-y-6 text-start">
      {/* Back Button & Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#242420] transition-colors shadow-xs self-start"
        >
          <BackIcon className="w-4 h-4" />
          <span>{isRTL ? 'العودة لقائمة الأسطول' : 'Back to Fleet List'}</span>
        </button>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsInspectionModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1A1A1A] hover:bg-black dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-[#F5F5F0] text-white shadow-xs transition-colors"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{t.conductInspectionTitle}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#242420] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* Immediate Decision Verdict Box */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isCritical
          ? 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-800/60'
          : isAttention
          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
          : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              isCritical
                ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                : isAttention
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
            }`}>
              {isCritical ? (
                <XCircle className="w-6 h-6" />
              ) : isAttention ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#71716A] dark:text-[#8E8E86]">
                  {isRTL ? 'قرار جاهزية التسليم' : 'Dispatch Readiness Verdict'}
                </span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  isCritical
                    ? 'bg-red-200/60 text-red-900 dark:bg-red-900 dark:text-red-200'
                    : isAttention
                    ? 'bg-amber-200/60 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                    : 'bg-emerald-200/60 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                }`}>
                  {isCritical 
                    ? (isRTL ? 'ممنوع التأجير — صيانة عاجلة 🛑' : 'Grounded: Urgent Maintenance Required 🛑')
                    : isAttention
                    ? (isRTL ? 'تحتاج فحصاً فنياً قبل التأجير ⚠️' : 'Technical Inspection Required Before Rental ⚠️')
                    : (isRTL ? 'جاهزة للتأجير الفوري ✅' : 'Approved for Instant Rental ✅')}
                </span>
              </div>

              <p className="mt-1 text-xs sm:text-sm font-medium text-[#1A1A1A] dark:text-white leading-relaxed">
                {isCritical
                  ? (isRTL
                      ? (vehicle.primaryRiskIssueAr 
                          ? `المركبة موقوفة عن التأجير: تم رصد (${vehicle.primaryRiskIssueAr}). يمنع تسليم المفاتيح للعميل لحين فحصها وإصلاحها بالورشة واعتمادها من قسم الصيانة.`
                          : 'المركبة موقوفة عن التأجير لوجود عطل حرج بالمحرك أو المنظومة الفنية قد يؤدي لتعطل المستأجر. يمنع تسليمها للعميل ويجب تحويلها للصيانة فوراً.')
                      : (vehicle.primaryRiskIssue 
                          ? `Vehicle grounded: (${vehicle.primaryRiskIssue}). Do not dispatch to customer until workshop maintenance is complete.`
                          : 'Critical fault logged. Do not dispatch to customer. Route to maintenance immediately.'))
                  : isAttention
                  ? (isRTL
                      ? (vehicle.primaryRiskIssueAr 
                          ? `المركبة تتطلب فحصاً فنياً قبل التأجير: تم رصد (${vehicle.primaryRiskIssueAr}). يرجى فحص المنظومة والتأكد من سلامتها واستقرار القراءات قبل تسليم السيارة للعميل.`
                          : 'تم رصد ملاحظة فنية يُوصى بمراجعتها والتأكد من استقرار القراءات قبل تسليم المركبة للعميل.')
                      : (vehicle.primaryRiskIssue 
                          ? `Technical inspection required before rental: (${vehicle.primaryRiskIssue}). Verify telemetry and condition prior to handover.`
                          : 'Technical condition flagged. Complete pre-rental verification prior to dispatch.'))
                  : (isRTL 
                      ? 'المركبة في حالة فنية وتشغيلية مستقرة: جميع قراءات الحساسات والأنظمة ضمن المعدل الطبيعي، وجاهزة للتسليم للعميل.'
                      : 'Vehicle mechanical health is stable: all live telemetry parameters within baseline. Ready for customer dispatch.')}
              </p>
            </div>
          </div>

          {(vehicle.activeFaults?.length || 0) > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('faults')}
              className="text-xs font-bold text-start sm:text-end shrink-0 underline text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white"
            >
              {isRTL ? 'عرض تفاصيل الأعطال التشخيصية DTC ←' : 'View Diagnostic Faults DTC →'}
            </button>
          )}
        </div>
      </div>

      {/* Hero Vehicle Profile Card in Bento Style */}
      <div className="bento-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Make, Model, Plate, VIN, Branch */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white flex items-center justify-center font-extrabold text-xl shrink-0">
              <Car className="w-7 h-7 text-[#1A1A1A] dark:text-white" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
                  {vehicle.make} {vehicle.model}
                </h1>
                <span className="text-sm font-semibold text-[#71716A] dark:text-[#8E8E86]">
                  ({vehicle.year})
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27]">
                  <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E8E86]">{t.carStatus}:</span>
                  <StatusBadge type="carStatus" status={vehicle.status} size="sm" />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <SaudiLicensePlate
                  plateNumber={vehicle.plateNumber}
                  plateNumberAr={vehicle.plateNumberAr}
                  size="md"
                  showLabel={true}
                />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#71716A] dark:text-[#8E8E86]">
                  <span>{t.vinNumber}: <strong className="font-mono text-[#1A1A1A] dark:text-white">{vehicle.vin}</strong></span>
                  <span>{t.branch}: <strong className="text-[#1A1A1A] dark:text-white">{isRTL ? vehicle.branchAr : vehicle.branch}</strong></span>
                  <span>{t.mileage}: <strong className="text-[#1A1A1A] dark:text-white">{vehicle.mileageKm.toLocaleString()} {isRTL ? 'كم' : 'km'}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Health Score & Device Telemetry Context */}
          <div className="flex flex-wrap items-center gap-4 self-start lg:self-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-[#E5E5E1] dark:border-[#2C2C27]">
            {/* OBD Device Info */}
            <div className="p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] text-start sm:text-end">
              <div className="flex items-center gap-1.5 justify-start sm:justify-end mb-1">
                <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E8E86]">{t.connectionStatus}:</span>
                <StatusBadge type="device" status={vehicle.deviceStatus} size="sm" />
              </div>
              <p className="text-[11px] font-mono text-[#71716A] dark:text-[#8E8E86]">
                {t.deviceIdLabel}: {vehicle.deviceId}
              </p>
              <p className="text-[10px] text-[#71716A] dark:text-[#8E8E86]">
                {t.lastSeen}: {vehicle.sensorData?.lastUpdated || vehicle.lastCommunication || (isRTL ? 'قبل لحظات' : 'Just now')}
              </p>
            </div>

            {/* Health Score Box */}
            <div className={`p-3.5 px-5 rounded-lg border text-center min-w-[120px] ${
              isCritical
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60'
                : isAttention
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
            }`}>
              <div className={`text-3xl font-extrabold leading-none font-mono ${
                isCritical
                  ? 'text-red-700 dark:text-red-300'
                  : isAttention
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-emerald-700 dark:text-emerald-300'
              }`}>
                {vehicle.healthScore}
              </div>
              <div className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
                isCritical
                  ? 'text-red-600 dark:text-red-400'
                  : isAttention
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {isCritical ? t.critical : isAttention ? t.needsAttention : t.healthy}
              </div>
            </div>
          </div>
        </div>

        {/* Unified Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-[#E5E5E1] dark:border-[#2C2C27] pt-4">
          {[
            { id: 'handover', label: isRTL ? 'جاهزية التأجير والتسليم' : 'Handover & Readiness', icon: ShieldCheck },
            { id: 'sensors', label: isRTL ? 'حسّاسات OBD-II والأنظمة' : 'Live OBD Telemetry', icon: Activity },
            { id: 'manual', label: isRTL ? 'الفحص الميداني اليدوي' : 'Manual Field Inspection', icon: ClipboardList },
            { id: 'faults', label: `${isRTL ? 'الأعطال التشخيصية DTC' : 'Diagnostic Faults'} (${vehicle.activeFaults?.length || 0})`, icon: Wrench },
            { id: 'predictions', label: `${isRTL ? 'التحليل التنبؤي الذكي' : 'AI Predictions'} (${vehicle.aiPredictions?.length || 0})`, icon: BrainCircuit },
            { id: 'maintenance', label: `${isRTL ? 'الصيانة الوقائية' : 'Maintenance'} (${vehicle.maintenanceList?.length || 0})`, icon: Calendar },
            { id: 'inspections', label: `${isRTL ? 'سجل الفحوصات والعمليات' : 'Inspections & Timeline'} (${(vehicle.inspections?.length || 0) + (vehicle.timeline?.length || 0)})`, icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] shadow-xs'
                    : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white border border-[#E5E5E1] dark:border-[#2C2C27]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: CUSTOMER HANDOVER & DISPATCH READINESS */}
      {activeTab === 'handover' && (
        <div className="space-y-6">
          {/* Quick Dispatch Decision Banner */}
          <div className="bento-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71716A] dark:text-[#8E8E86]">
                  {isRTL ? 'حالة الجاهزية للتسليم الميداني' : 'Field Handover Readiness Status'}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] dark:text-white mt-0.5">
                  {isCritical
                    ? (isRTL ? 'المركبة موقوفة عن التأجير — يجب إرسالها للصيانة 🛑' : 'Grounded: Urgent Maintenance Required 🛑')
                    : isAttention
                    ? (isRTL ? 'تتطلب فحصاً وتأكيداً قبل تسليم المفاتيح ⚠️' : 'Pre-Rental Inspection Required ⚠️')
                    : (isRTL ? 'المركبة جاهزة تماماً للتسليم الفوري للعميل ✅' : 'Approved for Instant Customer Handover ✅')}
                </h2>
                <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-1 max-w-2xl">
                  {isCritical
                    ? (isRTL
                        ? 'يمنع تسليم المفاتيح أو توقيع عقد جديد مع العميل. تم قفل حالة المركبة تلقائياً لوجود عطل حرج يؤثر على سلامة القيادة.'
                        : 'Keys must remain locked in branch custody. The vehicle is flagged critical and barred from contract execution.')
                    : isAttention
                    ? (isRTL
                        ? 'يرجى مراجعة الملاحظة الفنية المسجلة والتأكد من استقرار القراءات قبل تسليم السيارة للعميل.'
                        : 'Review open observations with the branch technician before handing keys to verify stable readings.')
                    : (isRTL
                        ? 'جميع الفحوصات الرقمية وقراءات الحساسات ضمن النطاق الطبيعي المستقر. يمكنك إتمام إجراءات التسليم للعميل.'
                        : 'All digital audits and baseline sensors pass within normal ranges. You can proceed with the customer handover.')}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsInspectionModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1A1A1A] hover:bg-black dark:bg-white dark:text-[#1A1A1A] text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{isRTL ? 'إجراء فحص تسليم' : 'Conduct Handover'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#242420] transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.exportPdf}</span>
                </button>
              </div>
            </div>

            {/* Handover Checklist Grid */}
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#71716A] dark:text-[#8E8E86] mb-3">
                {isRTL ? 'قائمة التحقق السريع قبل تسليم المفاتيح (Checklist)' : 'Pre-Handover Verification Checklist'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Fuel & Range */}
                <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                      <Fuel className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                        {isRTL ? 'مستوى الوقود والمدى' : 'Fuel & Range'}
                      </span>
                      <strong className="text-xs font-mono text-[#1A1A1A] dark:text-white">
                        {vehicle.sensorData?.fuelLevel || 84}% (~ 540 {isRTL ? 'كم' : 'km'})
                      </strong>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {isRTL ? 'جاهز ✅' : 'Pass ✅'}
                  </span>
                </div>

                {/* 2. Battery */}
                <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isBatteryWarning 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' 
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    }`}>
                      <Battery className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                        {isRTL ? 'بطارية التشغيل' : '12V Battery Cranking'}
                      </span>
                      <strong className="text-xs font-mono text-[#1A1A1A] dark:text-white">
                        {liveBattery} V
                      </strong>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isBatteryWarning 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' 
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {isBatteryWarning ? (isRTL ? 'تحتاج فحص ⚠️' : 'Check ⚠️') : (isRTL ? 'ممتازة ✅' : 'Pass ✅')}
                  </span>
                </div>

                {/* 3. Cooling & AC */}
                <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isCoolantWarning 
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' 
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    }`}>
                      <Thermometer className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                        {isRTL ? 'حرارة المحرك والتكييف' : 'Engine Temp & AC'}
                      </span>
                      <strong className="text-xs font-mono text-[#1A1A1A] dark:text-white">
                        {liveCoolant} °C
                      </strong>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCoolantWarning 
                      ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' 
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {isCoolantWarning ? (isRTL ? 'حرارة مرتفعة 🛑' : 'Alert 🛑') : (isRTL ? 'طبيعي وممتاز ✅' : 'Pass ✅')}
                  </span>
                </div>

                {/* 4. Tires & Pressure */}
                <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                        {isRTL ? 'ضغط وحالة الإطارات' : 'Tire Health & Pressure'}
                      </span>
                      <strong className="text-xs font-mono text-[#1A1A1A] dark:text-white">
                        ~ 33 PSI (4 {isRTL ? 'إطارات' : 'tires'})
                      </strong>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {isRTL ? 'متزنة ✅' : 'Pass ✅'}
                  </span>
                </div>

                {/* 5. Cleanliness */}
                <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                        {isRTL ? 'نظافة المقصورة والهيكل' : 'Cleanliness & Detailing'}
                      </span>
                      <strong className="text-xs text-[#1A1A1A] dark:text-white">
                        {isRTL ? 'نظيفة ومجهزة للتسليم' : 'Sanitized & Prepped'}
                      </strong>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {isRTL ? 'معتمدة ✅' : 'Pass ✅'}
                  </span>
                </div>

                {/* 6. Documents & Policy */}
                <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                        {isRTL ? 'وثائق المركبة والتأمين' : 'Registration & Insurance'}
                      </span>
                      <strong className="text-xs text-[#1A1A1A] dark:text-white">
                        {isRTL ? 'استمارة وتأمين ساريان' : 'Active & Compliant'}
                      </strong>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {isRTL ? 'سارية ✅' : 'Valid ✅'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Suitability & Current Contract Context */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trip Suitability Recommendation */}
            <div className="bento-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white mb-3">
                {isRTL ? 'توصيات ملائمة المشاوير والرحلات' : 'Recommended Trip Suitability'}
              </h3>
              <div className="space-y-3">
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isCritical
                    ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-[#71716A]'
                    : isAttention
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-[#1A1A1A] dark:text-white'
                    : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-[#1A1A1A] dark:text-white'
                }`}>
                  <div>
                    <h5 className="text-xs font-bold">
                      {isRTL ? 'السفر الطويل بين المدن والطرق السريعة' : 'Long-Distance Intercity Highway Trips'}
                    </h5>
                    <p className="text-[11px] text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                      {isCritical
                        ? (isRTL ? 'غير مسموح إطلاقاً — احتمال تعطل عالي على الطريق.' : 'Forbidden: High risk of highway breakdown.')
                        : isAttention
                        ? (isRTL ? 'غير موصى به حالياً لحين فحص الملاحظة المسجلة.' : 'Not recommended until technical check is cleared.')
                        : (isRTL ? 'مؤهلة للتشغيل مع استقرار في قراءات التبريد والأداء.' : 'Suitable for operation with stable thermal metrics.')}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                    isCritical
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : isAttention
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {isCritical ? (isRTL ? 'ممنوع 🛑' : 'Restricted') : isAttention ? (isRTL ? 'تنبيه ⚠️' : 'Caution') : (isRTL ? 'مؤهلة ✅' : 'Approved')}
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isCritical
                    ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-[#71716A]'
                    : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-[#1A1A1A] dark:text-white'
                }`}>
                  <div>
                    <h5 className="text-xs font-bold">
                      {isRTL ? 'المشاوير والتنقل اليومي داخل المدينة' : 'Daily In-City Urban Commuting'}
                    </h5>
                    <p className="text-[11px] text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                      {isCritical
                        ? (isRTL ? 'موقوفة حتى عن التنقل داخل المدينة.' : 'Vehicle completely grounded.')
                        : (isRTL ? 'ملائمة ومريحة مع عزم دوران واستجابة ممتازة.' : 'Optimal for daily city driving.')}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                    isCritical
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {isCritical ? (isRTL ? 'ممنوع 🛑' : 'Restricted') : (isRTL ? 'مؤهلة تماماً ✅' : 'Approved')}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Rental Contract or Yard Status */}
            <div className="bento-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white mb-3">
                {isRTL ? 'بيانات العقد والتسليم الميداني' : 'Rental Contract & Handoff Info'}
              </h3>

              {vehicle.rentalContext ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                    <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'المستأجر الحالي' : 'Current Renter'}:</span>
                    <strong className="text-xs text-[#1A1A1A] dark:text-white">{vehicle.rentalContext.customerName}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                    <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'رقم العقد' : 'Contract #'}:</span>
                    <strong className="text-xs font-mono text-[#1A1A1A] dark:text-white">{vehicle.rentalContext.rentalId}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                    <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'فترة التأجير' : 'Rental Window'}:</span>
                    <span className="text-xs text-[#1A1A1A] dark:text-white font-mono">
                      {vehicle.rentalContext.startDate} {isRTL ? '←' : '→'} {vehicle.rentalContext.expectedReturnDate}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] text-center space-y-2">
                  <Building2 className="w-8 h-8 text-[#71716A] dark:text-[#8E8E86] mx-auto" />
                  <p className="text-xs font-medium text-[#1A1A1A] dark:text-white">
                    {isRTL 
                      ? 'المركبة متواجدة حالياً بساحة الفرع، ومتاحة للربط مع عقد تأجير جديد.' 
                      : 'Vehicle is currently in the branch lot, ready to be assigned to a new rental contract.'}
                  </p>
                  <span className="inline-block text-[11px] font-mono text-[#71716A] dark:text-[#8E8E86]">
                    {isRTL ? 'الفرع الحالي' : 'Current Branch'}: {isRTL ? vehicle.branchAr : vehicle.branch}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE OBD-II TELEMETRY & ELECTRONIC SUBSYSTEMS */}
      {activeTab === 'sensors' && (
        <div className="space-y-6">
          {/* Quick Sensor Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
              <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E8E86]">{t.sensorCoolant}</span>
              <p className="text-lg font-bold text-[#1A1A1A] dark:text-white mt-1 font-mono">
                {liveCoolant} °C
              </p>
              <span className={`text-[10px] font-medium ${isCoolantWarning ? 'text-red-600' : 'text-[#10B981]'}`}>
                {isCoolantWarning ? (isRTL ? 'حرارة مرتفعة' : 'Elevated') : t.baselineNormal}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
              <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E8E86]">{t.sensorBattery}</span>
              <p className="text-lg font-bold text-[#1A1A1A] dark:text-white mt-1 font-mono">
                {liveBattery} V
              </p>
              <span className={`text-[10px] font-medium ${isBatteryWarning ? 'text-amber-600' : 'text-[#10B981]'}`}>
                {isBatteryWarning ? (isRTL ? 'جهد منخفض' : 'Low Crank') : t.baselineNormal}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
              <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E8E86]">{t.sensorOilTemp}</span>
              <p className="text-lg font-bold text-[#1A1A1A] dark:text-white mt-1 font-mono">
                {liveOil} °C
              </p>
              <span className={`text-[10px] font-medium ${isOilWarning ? 'text-amber-600' : 'text-[#10B981]'}`}>
                {isOilWarning ? (isRTL ? 'حرارة دافئة' : 'Warm') : t.baselineNormal}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
              <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E8E86]">{t.sensorFuel}</span>
              <p className="text-lg font-bold text-[#1A1A1A] dark:text-white mt-1 font-mono">
                {vehicle.sensorData?.fuelLevel || 84}%
              </p>
              <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86]">
                {isRTL ? 'المدى ~ ٥٤٠ كم' : '~ 540 km range'}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
              <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E8E86]">{t.sensorRpm}</span>
              <p className="text-lg font-bold text-[#1A1A1A] dark:text-white mt-1 font-mono">
                {liveRpm} RPM
              </p>
              <span className={`text-[10px] font-medium ${isRpmWarning ? 'text-amber-600' : 'text-[#10B981]'}`}>
                {isRpmWarning ? (isRTL ? 'تذبذب سرعة' : 'Idle Drift') : t.baselineNormal}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
              <span className="text-[11px] font-medium text-[#71716A] dark:text-[#8E8E86]">{t.sensorFuelTrim}</span>
              <p className="text-lg font-bold text-[#1A1A1A] dark:text-white mt-1 font-mono">
                {vehicle.sensorData?.fuelTrimShort || '+1.8%'}
              </p>
              <span className="text-[10px] text-[#10B981] font-medium">{t.baselineNormal}</span>
            </div>
          </div>

          {/* Sensor Comparison with Normal Baselines */}
          <div className="bento-card p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white">
                {t.sensorTelemetry}
              </h3>
              <p className="text-xs text-[#71716A] dark:text-[#8E8E86]">
                {isRTL 
                  ? 'مقارنة قراءات الحساسات اللحظية بالنطاق الطبيعي المرجعي لطراز هذا المحرك'
                  : 'Real-time telemetry evaluated against historical engine baseline envelope'}
              </p>
            </div>

            {/* Standard Operational Sensor Ranges Guide */}
            <div className="mb-4 p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] text-xs">
              <div className="flex items-center gap-2 mb-2 font-bold text-[#1A1A1A] dark:text-white">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isRTL ? 'دليل النطاقات التشغيلية القياسية للحساسات:' : 'Standard Operational Sensor Ranges Guide:'}</span>
              </div>
              <ul className="space-y-1.5 text-[#71716A] dark:text-[#8E8E86]">
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isCoolantWarning ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  <span>
                    <strong>{isRTL ? `حرارة ماء الرديتر (${liveCoolant}°C):` : `Coolant Temp (${liveCoolant}°C):`}</strong>{' '}
                    {isCoolantWarning 
                      ? (isRTL ? 'مرتفعة عن الحد الطبيعي — خطر سخونة أو فوران تحت الحمل.' : 'Elevated above threshold — thermal stress risk.')
                      : (isRTL ? 'طبيعية ومثالية — لا توجد أي سخونة بالمحرك.' : 'Perfect range — no engine overheating risk.')}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isBatteryWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span>
                    <strong>{isRTL ? `جهد بطارية السيارة (${liveBattery}V):` : `Battery Voltage (${liveBattery}V):`}</strong>{' '}
                    {isBatteryWarning 
                      ? (isRTL ? 'أقل من النطاق الموصى به — تتطلب فحصاً كهربائياً للبطارية والدينامو قبل التأجير.' : 'Below recommended baseline — electrical battery/alternator inspection required.')
                      : (isRTL ? 'جهد شحن وتدوير طبيعي ومستقر.' : 'Normal stable crank and resting voltage.')}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isOilWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span>
                    <strong>{isRTL ? `حرارة زيت الماكينة (${liveOil}°C):` : `Engine Oil Temp (${liveOil}°C):`}</strong>{' '}
                    {isOilWarning 
                      ? (isRTL ? 'مرتفعة نسبياً — يرجى التحقق من مستوى وجودة زيت المحرك.' : 'Elevated temperature — verify engine oil level and condition.')
                      : (isRTL ? 'لزوجة وتبريد الزيت في وضعها الطبيعي السليم.' : 'Oil viscosity and thermal control operate normally.')}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isRpmWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span>
                    <strong>{isRTL ? `دوران المحرك في الوقوف (${liveRpm} دورة):` : `Idle RPM (${liveRpm} RPM):`}</strong>{' '}
                    {isRpmWarning 
                      ? (isRTL ? 'تذبذب في سرعة دوران المحرك عند التوقف — قد يشير لاختلال احتراق.' : 'Idle speed drift detected — indicates potential ignition/intake issue.')
                      : (isRTL ? 'المحرك هادئ ومستقر دون اهتزاز أو تفتفة.' : 'Idle speed is smooth without misfire vibration.')}
                  </span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SensorBaselineComparisonBar
                name={t.sensorCoolant}
                unit="°C"
                currentValue={liveCoolant}
                baselineMin={86}
                baselineMax={96}
                scaleMin={60}
                scaleMax={120}
                isWarning={isCoolantWarning}
              />
              <SensorBaselineComparisonBar
                name={t.sensorBattery}
                unit="V"
                currentValue={liveBattery}
                baselineMin={12.4}
                baselineMax={14.6}
                scaleMin={10}
                scaleMax={16}
                isWarning={isBatteryWarning}
              />
              <SensorBaselineComparisonBar
                name={t.sensorOilTemp}
                unit="°C"
                currentValue={liveOil}
                baselineMin={90}
                baselineMax={105}
                scaleMin={70}
                scaleMax={130}
                isWarning={isOilWarning}
              />
              <SensorBaselineComparisonBar
                name={t.sensorRpm}
                unit="RPM"
                currentValue={liveRpm}
                baselineMin={650}
                baselineMax={850}
                scaleMin={500}
                scaleMax={2500}
                isWarning={isRpmWarning}
              />
            </div>
          </div>

          {/* Subsystems Audit from OBD Electronic Telematics */}
          <div className="bento-card p-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white">
                {isRTL ? 'فحص الأنظمة الإلكترونية عبر منفذ OBD-II' : 'Electronic Subsystems Audit via OBD-II'}
              </h3>
              <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                {isRTL
                  ? 'قراءات مباشرة مستخرجة آلياً من وحدات التحكم الإلكترونية (ECU) عبر بروتوكولات التشخيص OBD-II.'
                  : 'Live telemetry extracted directly from Electronic Control Units (ECUs) via standard OBD-II diagnostic protocols.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {/* 1. Engine & Transmission */}
              <div className="p-4 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-purple-600" />
                      <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                        {isRTL ? 'المحرك وناقل الحركة (ECU / TCU)' : 'Engine & Transmission (ECU/TCU)'}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : isRpmWarning
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {isCritical ? (isRTL ? 'عطل مسجل 🛑' : 'Fault') : isRpmWarning ? (isRTL ? 'يحتاج متابعة ⚠️' : 'Review') : (isRTL ? 'ممتاز ومستقر ✅' : 'Optimal')}
                    </span>
                  </div>
                  <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                    {isCritical
                      ? (isRTL ? 'تم رصد خلل في احتراق أو توازن المحرك. السيارة تحتاج تدخل فني الورشة فوراً.' : 'Combustion imbalance detected. Workshop technical attention required.')
                      : (isRTL ? 'المحرك يعمل بسلاسة وهدوء عند الوقوف (~750 دورة)، وسلاسة تبديل السرعات ممتازة دون أي اهتزاز.' : 'Engine idles smoothly with no misfires. Transmission shift points are crisp and responsive.')}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                  {isRTL ? 'سرعة الدوران' : 'RPM'}: <strong className="font-mono text-[#1A1A1A] dark:text-white">{liveRpm}</strong>
                </div>
              </div>

              {/* 2. AC & Thermal Cooling */}
              <div className="p-4 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-cyan-600" />
                      <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                        {isRTL ? 'التكييف ودورة التبريد (Cooling PID)' : 'AC & Engine Cooling (Cooling PID)'}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCoolantWarning
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {isCoolantWarning ? (isRTL ? 'حرارة مرتفعة 🛑' : 'Overheating') : (isRTL ? 'تبريد فائق ✅' : 'Optimal')}
                    </span>
                  </div>
                  <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                    {isCoolantWarning
                      ? (isRTL ? 'حرارة ماء الرديتر تتجاوز الحد الطبيعي، يمنع تسليم السيارة للعميل تجنباً لتوقف المحرك.' : 'Coolant temperature exceeds threshold. Ground car to prevent engine damage.')
                      : (isRTL ? 'حرارة ماء التبريد طبيعية تماماً ومروحة الرديتر تعمل بكفاءة عالية، مما يضمن برودة تكييف ممتازة في الصيف.' : 'Thermal regulation is robust. AC blows cold and cooling fans cycle normally for hot climate driving.')}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                  {isRTL ? 'حرارة سائل التبريد' : 'Coolant'}: <strong className="font-mono text-[#1A1A1A] dark:text-white">{liveCoolant} °C</strong>
                </div>
              </div>

              {/* 3. 12V Battery & Charging */}
              <div className="p-4 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                        {isRTL ? 'البطارية وشحن الكهرباء (Voltage PID)' : '12V Battery & Charging (Voltage PID)'}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isBatteryWarning
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {isBatteryWarning ? (isRTL ? 'تحتاج فحصاً ⚠️' : 'Inspection') : (isRTL ? 'شحن ممتاز ✅' : 'Optimal')}
                    </span>
                  </div>
                  <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                    {isBatteryWarning
                      ? (isRTL ? 'جهد البطارية منخفض نسبياً، يرجى فحصها بجهاز القياس قبل تسليمها لعميل سيسافر مسافات طويلة.' : 'Battery voltage is below ideal resting levels. Test with handheld meter prior to highway trips.')
                      : (isRTL ? 'الدينامو يشحن بكفاءة وبدء التشغيل فوري وسريع دون أي ثقل أو تأخير عند إدارة السلف.' : 'Alternator charging loop is healthy. Immediate engine crank with no hesitation.')}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                  {isRTL ? 'جهد البطارية' : 'Voltage'}: <strong className="font-mono text-[#1A1A1A] dark:text-white">{liveBattery} V</strong>
                </div>
              </div>

              {/* 4. Fuel Trim & Air-Fuel Ratio */}
              <div className="p-4 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                        {isRTL ? 'توازن خلط الوقود والهواء (Fuel Trim)' : 'Fuel Trim & Combustion Balance'}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {isRTL ? 'مثالي ومطابق ✅' : 'Optimal'}
                    </span>
                  </div>
                  <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                    {isRTL
                      ? 'قراءات تعديل الوقود قصيرة وطويلة الأجل (STFT / LTFT) ضمن ±5%، مما يضمن احتراقاً نظيفاً واستهلاك وقود اقتصادي مطابق لمعايير المصنع.'
                      : 'Short and Long Term Fuel Trims remain balanced within ±5%, indicating clean combustion and optimal fuel efficiency.'}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                  {isRTL ? 'تعديل الوقود اللحظي' : 'Short Trim'}: <strong className="font-mono text-[#1A1A1A] dark:text-white">{vehicle.sensorData?.fuelTrimShort || '+1.8%'}</strong>
                </div>
              </div>

              {/* 5. Fuel Level & Tank Sensor */}
              <div className="p-4 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                        {isRTL ? 'مستوى خزان الوقود (Fuel Level PID)' : 'Fuel Level Input PID'}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {isRTL ? 'جاهز للتسليم ✅' : 'Ready'}
                    </span>
                  </div>
                  <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                    {isRTL
                      ? 'قراءة إلكترونية دقيقة لعوامة الخزان عبر بروتوكول OBD-II (PID 2F). مستوى الوقود كافٍ لرحلة العميل دون الحاجة للتزود الفوري.'
                      : 'Real-time electronic fuel level via OBD-II PID 2F. Tank is sufficiently filled for rental delivery.'}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                  {isRTL ? 'مستوى الخزان' : 'Level'}: <strong className="font-mono text-[#1A1A1A] dark:text-white">{vehicle.sensorData?.fuelLevel || 84}%</strong>
                </div>
              </div>

              {/* 6. Oil Temperature & Thermal Regulation */}
              <div className="p-4 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                        {isRTL ? 'حرارة الزيت (Oil Temp PID)' : 'Oil Temp Telematics (PID 5C)'}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOilWarning
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {isOilWarning ? (isRTL ? 'ملاحظة حرارة ⚠️' : 'Warm') : (isRTL ? 'مستوى ممتاز ✅' : 'Optimal')}
                    </span>
                  </div>
                  <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                    {isOilWarning
                      ? (isRTL ? 'حرارة الزيت مرتفعة نسبياً، يرجى التحقق من دورة التزييت قبل إطلاق السيارة لرحلة طويلة.' : 'Oil temperature is elevated. Verify lubrication loop prior to dispatch.')
                      : (isRTL ? 'حرارة ولزوجة زيت الماكينة معتدلة، ومضخة الزيت تضخ بالضغط القياسي المعتمد.' : 'Oil viscosity and thermal status within certified range. Normal pump pressure.')}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                  {isRTL ? 'حرارة الزيت' : 'Oil Temp'}: <strong className="font-mono text-[#1A1A1A] dark:text-white">{liveOil} °C</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Context Card if rented */}
          {vehicle.rentalContext && (
            <div className="p-5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1A1A1A] dark:text-white uppercase tracking-wider">
                  {isRTL ? 'بيانات عقد التأجير الحالي' : 'Active Rental Contract Context'}
                </span>
                <span className="text-xs font-mono font-semibold text-[#71716A] dark:text-[#8E8E86]">
                  #{vehicle.rentalContext.rentalId}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#1A1A1A] dark:text-[#F5F5F0]">
                <div>
                  <span className="text-[#71716A] dark:text-[#8E8E86] block text-[11px]">{t.customerName}:</span>
                  <strong>{vehicle.rentalContext.renterReference || (vehicle.rentalContext as any).customerName || (isRTL ? 'عميل نشط' : 'Active Renter')}</strong>
                </div>
                <div>
                  <span className="text-[#71716A] dark:text-[#8E8E86] block text-[11px]">{t.rentalStart}:</span>
                  <strong>{vehicle.rentalContext.rentalStartDate || (vehicle.rentalContext as any).startDate || '2026-08-28'}</strong>
                </div>
                <div>
                  <span className="text-[#71716A] dark:text-[#8E8E86] block text-[11px]">{t.expectedReturn}:</span>
                  <strong>{vehicle.rentalContext.expectedReturnDate || (vehicle.rentalContext as any).expectedReturn || '2026-09-05'}</strong>
                </div>
                <div>
                  <span className="text-[#71716A] dark:text-[#8E8E86] block text-[11px]">{t.startMileage}:</span>
                  <strong className="font-mono">
                    {(((vehicle.rentalContext as any).startMileage) || Math.max(0, (vehicle.mileageKm || 0) - 350)).toLocaleString()} {isRTL ? 'كم' : 'km'}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DEDICATED MANUAL FIELD INSPECTION */}
      {activeTab === 'manual' && (
        <ManualInspectionSection
          vehicle={vehicle}
          isRTL={isRTL}
          onOpenInspectionModal={() => setIsInspectionModalOpen(true)}
        />
      )}

      {/* TAB CONTENT 2: DIAGNOSTIC FAULTS */}
      {activeTab === 'faults' && (
        <div className="space-y-4">
          {(!vehicle.activeFaults || vehicle.activeFaults.length === 0) ? (
            <div className="bento-card p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">
                {isRTL ? 'لا توجد أكواد أعطال نشطة' : 'No Active Diagnostic Trouble Codes (DTC)'}
              </h3>
              <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-1 max-w-md mx-auto">
                {isRTL 
                  ? 'جميع وحدات التحكم الإلكترونية (ECU) تعمل بشكل مثالي دون أي تنبيهات أو أعطال مسجلة.'
                  : 'All electronic control units reported normal operating parameters on the last diagnostic scan.'}
              </p>
            </div>
          ) : (
            vehicle.activeFaults.map((f) => (
              <div
                key={f.id}
                className="bento-card p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-mono px-2.5 py-1 rounded bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                      {f.code}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                        {isRTL ? f.titleAr : f.title}
                      </h4>
                      <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                        {isRTL ? f.systemCategoryAr : f.systemCategory} • {t.firstDetected}: {f.firstDetected}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge type="severity" status={f.severity} size="sm" />
                    <span className="text-xs px-2.5 py-1 rounded bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] font-mono font-bold">
                      {t.occurrenceCount}: {f.occurrenceCount}x
                    </span>
                  </div>
                </div>

                {/* Diagnostic Problem Description & Recommended Action */}
                <div className="mt-4 p-4 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] text-xs space-y-2.5">
                  <div>
                    <span className="font-bold text-[#1A1A1A] dark:text-white block mb-1">
                      {isRTL ? 'وصف وتفسير العطل التشغيلي:' : 'Diagnostic Problem Description & Impact:'}
                    </span>
                    <p className="text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                      {isRTL ? f.descriptionAr : f.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E5E5E1]/60 dark:border-[#2C2C27]/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                      <span>{t.recommendedAction}:</span>
                      <strong className="text-[#1A1A1A] dark:text-white">
                        {isRTL ? f.recommendedActionAr : f.recommendedAction}
                      </strong>
                    </div>
                    <div className="text-[11px] font-mono text-[#71716A] dark:text-[#8E8E86] bg-white dark:bg-[#1B1B18] px-2 py-1 rounded border border-[#E5E5E1] dark:border-[#2C2C27]">
                      {isRTL ? 'التكلفة المقدرة: ~ ٢٠٠ - ٣٥٠ ر.س' : 'Est. Repair: ~ 200 - 350 SAR'}
                    </div>
                  </div>
                </div>

                {/* Freeze Frame Data (for technical telematics inspection) */}
                {f.freezeFrame && (
                  <div className="mt-4 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#71716A] dark:text-[#8E8E86] uppercase tracking-wider">
                        {t.freezeFrameData} ({isRTL ? 'بيانات الفحص الفني لحظة التسجيل' : 'Technical OBD Freeze Frame'}):
                      </span>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                        OBD-II Mode 02
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-[#1A1A1A] dark:text-[#F5F5F0]">
                      <div className="p-2 rounded bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27]">
                        {isRTL ? 'دوران المحرك:' : 'RPM:'} <strong>{f.freezeFrame.rpm}</strong>
                      </div>
                      <div className="p-2 rounded bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27]">
                        {isRTL ? 'السرعة:' : 'Speed:'} <strong>{f.freezeFrame.speedKmh} {isRTL ? 'كم/س' : 'km/h'}</strong>
                      </div>
                      <div className="p-2 rounded bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27]">
                        {isRTL ? 'الحرارة:' : 'Coolant:'} <strong>{f.freezeFrame.coolantTempC}°C</strong>
                      </div>
                      <div className="p-2 rounded bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27]">
                        {isRTL ? 'الحمل:' : 'Load:'} <strong>{f.freezeFrame.engineLoadPct}%</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}


      {/* TAB CONTENT 3: AI PREDICTIONS & EARLY WARNING */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          {(!vehicle.aiPredictions || vehicle.aiPredictions.length === 0) ? (
            <div className="bento-card p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">
                {isRTL ? 'لا توجد مؤشرات تدهور متوقعة حالياً' : 'No High-Risk Component Failure Predicted'}
              </h3>
              <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-1 max-w-md mx-auto">
                {isRTL 
                  ? 'خوارزميات التحليل التنبؤي تفيد باستقرار أداء البطارية ودورة التبريد ونظام الإشعال.'
                  : 'Predictive intelligence models indicate steady health across battery, ignition, and cooling sub-systems.'}
              </p>
            </div>
          ) : (
            vehicle.aiPredictions.map((pred) => (
              <div
                key={pred.id}
                className="bento-card p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                        {isRTL ? pred.titleAr : pred.title}
                      </h4>
                      <p className="text-xs text-[#71716A] dark:text-[#8E8E86]">
                        {isRTL ? pred.componentAr : pred.component} • {isRTL ? 'الأفق المتوقع:' : 'Estimated Window:'} <strong className="text-[#1A1A1A] dark:text-white">{isRTL ? pred.estimatedWindowAr : pred.estimatedWindow}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge type="risk" status={pred.riskLevel} size="sm" />
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] font-mono">
                      {isRTL ? 'دقة النموذج' : 'Confidence'}: {pred.confidenceScore}%
                    </span>
                  </div>
                </div>

                {/* Evidence Indicators */}
                <div className="mt-3.5 p-3.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                  <span className="text-[10px] font-bold text-[#71716A] dark:text-[#8E8E86] uppercase tracking-wider block mb-1.5">
                    {isRTL ? 'المؤشرات الفنية والأدلة المسجلة:' : 'Supporting Technical Telemetry & Evidence:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#1A1A1A] dark:text-[#F5F5F0]">
                    {(isRTL ? pred.explanationPointsAr : pred.explanationPoints)?.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Preventive Step */}
                <div className="mt-4 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[#71716A] dark:text-[#8E8E86] me-1">{t.recommendedAction}:</span>
                    <strong className="text-[#1A1A1A] dark:text-white">
                      {isRTL ? pred.recommendedActionAr : pred.recommendedAction}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInspectionModalOpen(true)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#1A1A1A] hover:bg-black dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-[#F5F5F0] text-white transition-colors shrink-0"
                  >
                    {isRTL ? 'جدولة فحص صيانة' : 'Schedule Inspection'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT 4: MAINTENANCE & TECHNICAL ANALYSIS */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          {/* Bento Header & Add Record */}
          <div className="bento-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">
                  {isRTL ? 'الصيانة الوقائية والتحليل الفني' : 'Preventive Maintenance & Technical Analysis'}
                </h3>
                <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                  {isRTL 
                    ? 'جدول الصيانة المعتمد بناءً على بيانات الحساسات، قراءة العداد، وأكواد الأعطال التشخيصية' 
                    : 'Preventive service intervals and subsystem telemetry analysis grounded in vehicle sensor history'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInspectionModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] hover:opacity-90 transition-opacity"
                >
                  + {isRTL ? 'إضافة سجل صيانة' : 'Add Service Log'}
                </button>
              </div>
            </div>

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
              <div className="p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[10px] uppercase font-bold text-[#71716A] dark:text-[#8E8E86] tracking-wider block">
                  {isRTL ? 'الصيانة المستحقة' : 'Service Items'}
                </span>
                <span className="text-xl font-mono font-extrabold text-[#1A1A1A] dark:text-white">
                  {vehicle.maintenanceList?.length || 0}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[10px] uppercase font-bold text-[#71716A] dark:text-[#8E8E86] tracking-wider block">
                  {isRTL ? 'الموعد القادم' : 'Next Milestone'}
                </span>
                <span className="text-sm font-mono font-bold text-[#1A1A1A] dark:text-white">
                  {vehicle.nextMaintenanceKm ? `${vehicle.nextMaintenanceKm.toLocaleString()} ${isRTL ? 'كم' : 'km'}` : (vehicle.nextMaintenanceDate || '2026-10-15')}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[10px] uppercase font-bold text-[#71716A] dark:text-[#8E8E86] tracking-wider block">
                  {isRTL ? 'التكلفة المقدرة' : 'Est. Fleet Cost'}
                </span>
                <span className="text-xl font-mono font-extrabold text-[#1A1A1A] dark:text-white">
                  {((vehicle.maintenanceList || []).reduce((sum, item) => sum + (item.estimatedCost || 0), 0) || 350).toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                <span className="text-[10px] uppercase font-bold text-[#71716A] dark:text-[#8E8E86] tracking-wider block mb-1">
                  {isRTL ? 'حالة الأجزاء' : 'Subsystems State'}
                </span>
                <StatusBadge 
                  type="analysis" 
                  status={vehicle.healthStatus === 'healthy' ? 'nominal' : vehicle.healthStatus === 'attention' ? 'drift' : 'critical'} 
                  size="sm" 
                />
              </div>
            </div>
          </div>

          {/* Maintenance Items in Bento Cards */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#71716A] dark:text-[#8E8E86] px-1">
              {isRTL ? 'قائمة بنود الصيانة والتوصيات' : 'Maintenance Schedule & Recommended Interventions'}
            </h4>

            {(!vehicle.maintenanceList || vehicle.maintenanceList.length === 0) ? (
              <div className="bento-card p-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                  {isRTL ? 'لا توجد بنود صيانة متأخرة أو حرجة' : 'No Overdue Maintenance Items'}
                </h4>
                <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-1 max-w-sm mx-auto">
                  {isRTL 
                    ? 'المركبة تعمل وفق النطاق الطبيعي وجدول الصيانة الدورية التالي لم يحن بعد.' 
                    : 'The vehicle is operating within baseline parameters. Routine service interval remains upcoming.'}
                </p>
              </div>
            ) : (
              vehicle.maintenanceList.map((m) => {
                const isOverdue = m.status === 'overdue';
                const isRecommended = m.status === 'recommended';

                const triggerLabel = 
                  m.triggerType === 'mileage' ? (isRTL ? 'ممشى العداد' : 'Mileage Milestone') :
                  m.triggerType === 'time' ? (isRTL ? 'دورية زمنية' : 'Time Interval') :
                  m.triggerType === 'fault' ? (isRTL ? 'عطل تشخيصي' : 'DTC Fault Trigger') :
                  m.triggerType === 'sensor_anomaly' ? (isRTL ? 'انحراف حساسات' : 'Sensor Baseline Drift') :
                  (isRTL ? 'تنبؤ استباقي' : 'AI Predictive Flag');

                return (
                  <div key={m.id} className="bento-card p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                          isOverdue 
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900' 
                            : isRecommended 
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900' 
                            : 'bg-[#F5F5F0] text-[#1A1A1A] dark:bg-[#242420] dark:text-white border-[#E5E5E1] dark:border-[#2C2C27]'
                        }`}>
                          <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                            {isRTL ? m.titleAr : m.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27]">
                              {triggerLabel}
                            </span>
                            <span>
                              {isRTL ? 'الموعد المستهدف:' : 'Target:'} <strong className="text-[#1A1A1A] dark:text-white font-mono">{m.dueDateOrMileage}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge type="maintenance" status={m.status} size="sm" />
                        <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27]">
                          {m.estimatedCost} {isRTL ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                    </div>

                    {/* Reason & Action Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                      <div className="p-3.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                        <span className="text-[10px] font-bold text-[#71716A] dark:text-[#8E8E86] uppercase tracking-wider block mb-1">
                          {isRTL ? 'سبب استحقاق الخدمة:' : 'Trigger Reason / Justification:'}
                        </span>
                        <p className="text-[#1A1A1A] dark:text-[#F5F5F0] leading-relaxed">
                          {isRTL ? m.reasonAr : m.reason}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                        <span className="text-[10px] font-bold text-[#71716A] dark:text-[#8E8E86] uppercase tracking-wider block mb-1">
                          {isRTL ? 'الإجراء والقطع الموصى بها:' : 'Recommended Service Action:'}
                        </span>
                        <p className="text-[#1A1A1A] dark:text-[#F5F5F0] leading-relaxed">
                          {isRTL ? m.recommendedActionAr : m.recommendedAction}
                        </p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsInspectionModalOpen(true)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#1A1A1A] hover:bg-black dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-[#F5F5F0] text-white transition-colors"
                      >
                        {isRTL ? 'حجز موعد في ورشة الصيانة' : 'Book Workshop Bay'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Subsystems Technical Analysis Cards in Bento Style */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#71716A] dark:text-[#8E8E86] px-1">
              {isRTL ? 'التحليل الفني لأنظمة المركبة' : 'Component Technical Health Analysis'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Battery & Charging */}
              <div className="bento-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-amber-500" />
                    <h5 className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                      {isRTL ? 'منظومة البطارية والشحن' : '12V Battery & Charging Loop'}
                    </h5>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#1A1A1A] dark:text-white">
                    {vehicle.sensorData?.batteryVoltage || 12.4} V
                  </span>
                </div>
                <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                  {isRTL
                    ? 'جهد التشغيل الساكن متوازن مع تسجيل تذبذب طفيف عند تشغيل بادئ الحركة.'
                    : 'Resting voltage matches expected OEM envelope with minor crank transient dip.'}
                </p>
                <div className="mt-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between text-[11px]">
                  <span className="text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'العمر التقديري المتبقي' : 'Health Index'}:</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge type="analysis" status={vehicle.healthScore < 70 ? 'critical' : vehicle.healthScore < 85 ? 'drift' : 'nominal'} size="sm" />
                    <strong className="font-mono text-xs text-[#1A1A1A] dark:text-white">88%</strong>
                  </div>
                </div>
              </div>

              {/* Cooling Circuit */}
              <div className="bento-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-blue-500" />
                    <h5 className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                      {isRTL ? 'دورة التبريد والتبديد الحراري' : 'Cooling & Thermal Dissipation'}
                    </h5>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#1A1A1A] dark:text-white">
                    {vehicle.sensorData?.coolantTemp || 92} °C
                  </span>
                </div>
                <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                  {isRTL
                    ? 'حرارة سائل التبريد تستقر عند المعدل الهندسي المعتمد (٨٨-٩٤ درجة مئوية).'
                    : 'Coolant temperature tracks tightly within standard manufacturer baseline envelope.'}
                </p>
                <div className="mt-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between text-[11px]">
                  <span className="text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'كفاءة بلف الحرارة' : 'Thermostat State'}:</span>
                  <StatusBadge type="analysis" status="nominal" size="sm" />
                </div>
              </div>

              {/* Brake System */}
              <div className="bento-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-indigo-500" />
                    <h5 className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                      {isRTL ? 'منظومة المكابح والاحتكاك' : 'Braking & Friction System'}
                    </h5>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#1A1A1A] dark:text-white">
                    ~ 6.2 mm
                  </span>
                </div>
                <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                  {isRTL
                    ? 'سماكة فحمات الفرامل ضمن النطاق الآمن مع سلامة استجابة الهيدروليك وحساسات ABS.'
                    : 'Friction pads measure within safe operational thickness with balanced hydraulic line pressure.'}
                </p>
                <div className="mt-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between text-[11px]">
                  <span className="text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'المتبقي المقدر' : 'Remaining Distance'}:</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge type="analysis" status="nominal" size="sm" />
                    <strong className="text-[#1A1A1A] dark:text-white font-mono">~ 18,000 {isRTL ? 'كم' : 'km'}</strong>
                  </div>
                </div>
              </div>

              {/* Powertrain & Transmission */}
              <div className="bento-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-500" />
                    <h5 className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                      {isRTL ? 'المحرك وناقل الحركة' : 'Powertrain & Transmission'}
                    </h5>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#1A1A1A] dark:text-white">
                    {vehicle.sensorData?.engineLoad || 24}% {isRTL ? 'حمل' : 'Load'}
                  </span>
                </div>
                <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                  {isRTL
                    ? 'نسبة خلط الوقود والهواء مستقرة وسلاسة التبديل تتوافق مع المعايير الفنية.'
                    : 'Fuel trim adaptations and gear engagement timings track within normal fleet tolerances.'}
                </p>
                <div className="mt-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between text-[11px]">
                  <span className="text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'مؤشر إجهاد المحرك' : 'Stress Index'}:</span>
                  <StatusBadge type="analysis" status="low" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: INSPECTIONS & RENTAL COMPARISON */}
      {activeTab === 'inspections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white">
                {t.tabInspections}
              </h3>
              <p className="text-xs text-[#71716A] dark:text-[#8E8E86]">
                {isRTL ? 'مقارنة فنية لحالة المركبة قبل التأجير وبعد الاسترجاع' : 'Pre-rental handoff vs post-rental return condition audits'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsInspectionModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1A1A1A] hover:bg-black dark:bg-white dark:text-[#1A1A1A] text-white shadow-xs transition-colors"
            >
              + {t.conductInspectionTitle}
            </button>
          </div>

          {(!vehicle.inspections || vehicle.inspections.length === 0) ? (
            <div className="bento-card p-8 text-center text-xs text-[#71716A] dark:text-[#8E8E86]">
              {isRTL ? 'لا توجد فحوصات مسجلة لهذه المركبة بعد' : 'No inspection records yet.'}
            </div>
          ) : (
            vehicle.inspections.map((insp) => (
              <div
                key={insp.id}
                className="bento-card p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      insp.type === 'before_rental'
                        ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                        : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                    }`}>
                      {inspectionTypeLabel(insp.type, isRTL)}
                    </span>
                    <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">
                      {insp.rentalId || '—'} • {insp.date} • {t.inspector}: <strong className="text-[#1A1A1A] dark:text-white">{insp.inspectorName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">
                      {t.mileage}: <strong className="font-mono text-[#1A1A1A] dark:text-white">{insp.mileage.toLocaleString()} {isRTL ? 'كم' : 'km'}</strong>
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] font-mono">
                      {t.healthScore}: {insp.healthScore}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                    <span className="text-[#71716A] dark:text-[#8E8E86] block text-[10px] uppercase tracking-wider">{t.exteriorCondition}</span>
                    <strong className="capitalize text-[#1A1A1A] dark:text-white">
                      {inspectionConditionLabel('exterior', insp.condition.exterior, isRTL)}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                    <span className="text-[#71716A] dark:text-[#8E8E86] block text-[10px] uppercase tracking-wider">{t.interiorCondition}</span>
                    <strong className="capitalize text-[#1A1A1A] dark:text-white">
                      {inspectionConditionLabel('interior', insp.condition.interior, isRTL)}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                    <span className="text-[#71716A] dark:text-[#8E8E86] block text-[10px] uppercase tracking-wider">{t.tiresCondition}</span>
                    <strong className="capitalize text-[#1A1A1A] dark:text-white">
                      {inspectionConditionLabel('tires', insp.condition.tires, isRTL)}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27]">
                    <span className="text-[#71716A] dark:text-[#8E8E86] block text-[10px] uppercase tracking-wider">{t.lightsCondition}</span>
                    <strong className="capitalize text-[#1A1A1A] dark:text-white">
                      {inspectionConditionLabel('lights', insp.condition.lights, isRTL)}
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-[#71716A] dark:text-[#8E8E86] pt-1">
                  {inspectionNotes(insp, isRTL)}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT 6: DIGITAL HEALTH TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bento-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white">
              {t.tabTimeline}
            </h3>
            <p className="text-xs text-[#71716A] dark:text-[#8E8E86]">
              {isRTL 
                ? 'السجل الرقمي الموحد لجميع الأحداث والأعطال والتغييرات التي طرأت على المركبة' 
                : 'Permanent chronological telemetry ledger across vehicle lifecycle'}
            </p>
          </div>

          <div className="relative border-s-2 border-[#E5E5E1] dark:border-[#2C2C27] ms-3 my-4 space-y-6">
            {[...(vehicle.timeline || [])].sort((a,b)=>Date.parse(b.timestamp || `${b.date}T${b.time || '00:00'}Z`)-Date.parse(a.timestamp || `${a.date}T${a.time || '00:00'}Z`)).map((item) => (
              <div key={item.id} className="relative ps-6">
                {/* Dot */}
                <div className={`absolute -start-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#1B1B18] ${
                  item.severity === 'critical' ? 'bg-rose-500' : item.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />

                <div className="flex items-center gap-2 text-[11px] text-[#71716A] dark:text-[#8E8E86] font-mono">
                  <span>{item.rentalId ? `${item.rentalId} · ` : ''}{item.timestamp || `${item.date || ''} ${item.time || ''}`.trim()}</span>
                  <span className="capitalize px-1.5 py-0.2 rounded bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] font-sans text-[10px]">
                    {item.type === 'rental_start' ? (isRTL ? 'بدء تأجير' : 'Rental Start') :
                     item.type === 'rental_end' || item.type === 'rental_return' ? (isRTL ? 'استرجاع' : 'Rental Return') :
                     item.type === 'fault_detected' ? (isRTL ? 'عطل مسجل' : 'Fault Detected') :
                     item.type === 'maintenance' ? (isRTL ? 'صيانة' : 'Maintenance') :
                     item.type === 'inspection' ? (isRTL ? 'فحص فني' : 'Inspection') :
                     item.type === 'status_change' ? (isRTL ? 'تغير الحالة' : 'Status Update') :
                     item.type}
                  </span>
                </div>

                <h5 className="text-xs font-bold text-[#1A1A1A] dark:text-white mt-1">
                  {isRTL ? item.titleAr : item.title}
                </h5>

                <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                  {isRTL ? item.descriptionAr : item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
