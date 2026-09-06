import React, { useState } from 'react';
import { 
  Car, 
  Wifi, 
  AlertTriangle, 
  AlertOctagon, 
  ShieldAlert, 
  Activity, 
  Clock, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Radio,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { KpiCard } from '../components/common/KpiCard';
import { FleetHealthBreakdown, FleetHealthTrendChart } from '../components/common/ChartComponents';
import { StatusBadge } from '../components/common/StatusBadge';
import { mockFleetStats } from '../data/mockFleet';
import { PriorityVehiclesModal, PriorityActionItem } from '../components/dashboard/PriorityVehiclesModal';

export const DashboardView: React.FC = () => {
  const { 
    vehicles, 
    viewVehicleDetail, 
    setActiveSection, 
    setIsInspectionModalOpen,
    isRTL, 
    t 
  } = useApp();

  const [selectedPriorityAction, setSelectedPriorityAction] = useState<PriorityActionItem | null>(null);

  // Compute live stats from current vehicles list
  const totalVehicles = vehicles.length;
  const onlineVehicles = vehicles.filter((v) => v.deviceStatus === 'online').length;
  const attentionVehicles = vehicles.filter((v) => v.healthStatus === 'attention').length;
  const criticalVehicles = vehicles.filter((v) => v.healthStatus === 'critical').length;
  const healthyVehicles = vehicles.filter((v) => v.healthStatus === 'healthy').length;
  
  const avgHealth = Math.round(
    vehicles.reduce((acc, v) => acc + v.healthScore, 0) / totalVehicles
  );

  // Highest risk vehicles (sorted by risk score descending)
  const highestRiskVehicles = [...vehicles]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  // Priority Actions Today with complete vehicle mapping
  const priorityActions: PriorityActionItem[] = [
    {
      id: 'act-1',
      severity: 'critical',
      count: 2,
      label: isRTL ? 'مركبتان معرضتان لخطر توقف البطارية قريباً' : '2 vehicles have high battery failure risk',
      explanation: isRTL 
        ? 'رصد تراجع جهد الشحن دون ١١.٤ فولت أثناء دوران بادئ التشغيل وارتفاع الإجهاد الحراري'
        : 'Cranking voltage consistently drops below 11.4V under thermal load with slow starter spin',
      recommended: isRTL ? 'إجراء فحص توصيلية البطارية واستبدالها وقائياً بالفرع لتفادي توقف المستأجر' : 'Conductance test and preventive replacement within 14 days to prevent stranded renters',
      vehicleIds: ['veh-001', 'veh-004'],
      vehicleNotes: {
        'veh-001': {
          ar: 'جهد البطارية ١٢.٢V (يهبط إلى ١١.٢V عند السلف) — احتمال عدم تشغيل المحرك صباحاً ٧٦٪.',
          en: 'Resting voltage 12.2V (dips to 11.2V on cold crank) — 76% AI predicted failure within 30 days.'
        },
        'veh-004': {
          ar: 'تراجع كفاءة الشحن ودوران بادئ التشغيل بنسبة ٢٢٪ بسبب استهلاك ملحقات التكييف ودينامو الشحن.',
          en: 'Charging efficiency and starter motor RPM down 22% under heavy AC and alternator load.'
        }
      }
    },
    {
      id: 'act-2',
      severity: 'critical',
      count: 3,
      label: isRTL ? '٣ مركبات سجلت أعطالاً تشخيصية متكررة (DTC)' : '3 vehicles have recurring diagnostic faults',
      explanation: isRTL
        ? 'أكواد P0420 (كفاءة المحفز) وP0299 (ضغط التوربو) وP0456 (تسريب طفيف بالوقود) ظهرت عدة مرات'
        : 'Codes P0420, P0299, and P0456 triggered across multiple driving cycles without resolution',
      recommended: isRTL ? 'إيقاف المركبات بالورشة وإجراء فحص إشعال وعادم وتوربو قبل تسليمها لأي مستأجر' : 'Ground vehicles for comprehensive ignition, turbo, and catalyst inspection before next rental',
      vehicleIds: ['veh-002', 'veh-005', 'veh-007'],
      vehicleNotes: {
        'veh-002': {
          ar: 'كود P0420: انخفاض كفاءة دبة التلوث وارتفاع حرارة زيت المحرك إلى ١٠٦°C — متوقفة بالورشة حالياً.',
          en: 'DTC P0420: Catalytic converter efficiency below threshold & high oil temp (106°C) — grounded in workshop.'
        },
        'veh-005': {
          ar: 'كود P0299: نقص ضغط شاحن التوربو وضعف عزم التسارع عند تجاوز سرعة ٨٠ كم/س.',
          en: 'DTC P0299: Turbocharger underboost condition causing power loss above 80 km/h.'
        },
        'veh-007': {
          ar: 'كود P0456: تسريب طفيف متكرر في نظام تبخير وقود المحرك (EVAP) — يحتاج فحص غطاء التانكي.',
          en: 'DTC P0456: Small evaporative emissions system leak detected — inspect fuel cap & purge valve.'
        }
      }
    },
    {
      id: 'act-3',
      severity: 'warning',
      count: 5,
      label: isRTL ? '٥ مركبات تتطلب معاينة وفحص ما بعد الاسترجاع' : '5 vehicles require return condition inspection',
      explanation: isRTL
        ? 'انتهت عقود التأجير وتحتاج لمطابقة قراءات العداد وحالة الهيكل والحساسات قبل إعادة طرحها للتأجير'
        : 'Rental periods concluded; physical audit & OBD scan delta required before re-dispatching',
      recommended: isRTL ? 'إجراء فحص استلام فوري عبر المنصة للتحقق من عدم وجود خدوش أو أعطال خفية' : 'Conduct quick return condition inspection to document fuel, mileage, and ECU status',
      vehicleIds: ['veh-003', 'veh-006', 'veh-008', 'veh-009', 'veh-010'],
      isInspectionAction: true,
      vehicleNotes: {
        'veh-003': {
          ar: 'تم استرجاع المركبة في فرع المطار — بانتظار مطابقة العداد (٤١,٢٠٠ كم) وفحص نظافة المقصورة.',
          en: 'Returned at Airport branch — pending odometer sync (41,200 km) and interior detailing inspection.'
        },
        'veh-006': {
          ar: 'عقد منتهي — الحساسات سليمة وبانتظار اعتماد موظف الفرع لإتاحتها للتأجير الفوري.',
          en: 'Contract concluded — sensor health nominal; pending branch agent sign-off for re-rental.'
        },
        'veh-008': {
          ar: 'انتهى العقد قبل ساعتين — يتطلب التحقق من ضغط الإطارات ومستوى الزيت بعد رحلة سفر طويلة.',
          en: 'Returned 2 hours ago — requires tire pressure and engine oil check following long highway trip.'
        },
        'veh-009': {
          ar: 'استرجاع حديث — فحص بطانات الفرامل الدوري بعد بلوغ ٥٨,٠٠٠ كم.',
          en: 'Recent return — scheduled brake pad wear verification after reaching 58,000 km.'
        },
        'veh-010': {
          ar: 'مركبة لكزس فاخرة — فحص دوري شامل لمتابعة معايير الجودة للعملاء المميزين.',
          en: 'Luxury fleet vehicle — comprehensive VIP post-rental check before next executive dispatch.'
        }
      }
    },
    {
      id: 'act-4',
      severity: 'warning',
      count: 4,
      label: isRTL ? '٤ أجهزة تتبع OBD-II غير متصلة منذ أكثر من ٢٤ ساعة' : '4 OBD devices have been offline for more than 24 hours',
      explanation: isRTL
        ? 'احتمالية فصل الجهاز يدوياً أو ضعف تغذية منفذ DLC بمواقف سفلية بدون إشارة شبكة'
        : 'Likely unseated during vehicle detailing or parked in low-signal underground parking',
      recommended: isRTL ? 'إشعار مشرف الفرع بالتحقق من ثبات الجهاز بمنفذ الفحص أسفل المقود' : 'Notify branch supervisor to physically verify snug seated connection in OBD port',
      vehicleIds: ['veh-008', 'veh-002', 'veh-004', 'veh-007'],
      vehicleNotes: {
        'veh-008': {
          ar: 'جهاز OBD-48298: غير متصل منذ ٢٦ ساعة — المركبة متوقفة بمواقف قبو فرع جدة.',
          en: 'Device OBD-48298: Offline for 26 hours — vehicle parked in underground basement garage.'
        },
        'veh-002': {
          ar: 'جهاز OBD-30582: مفصول مؤقتاً أثناء وجود السيارة بورشة الصيانة لفحص دبة التلوث.',
          en: 'Device OBD-30582: Temporarily disconnected while car is in workshop for emissions repair.'
        },
        'veh-004': {
          ar: 'جهاز OBD-31164: انقطاع التغطية اللحظية — آخر إشارة رُصدت عند مدخل طريق المطار.',
          en: 'Device OBD-31164: Intermittent cellular packet loss — last signal recorded on Airport road.'
        },
        'veh-007': {
          ar: 'جهاز OBD-32037: انقطاع بث منذ ٣١ ساعة — يحتاج موظف الفرع لإعادة تثبيته بإحكام.',
          en: 'Device OBD-32037: Disconnected for 31 hours — requires branch agent to re-seat firmly into DLC port.'
        }
      }
    },
  ];

  return (
    <div className="space-y-8">
      {/* View Header with Calm, Elegant Styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-start">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {t.dashboardTitle}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isRTL ? 'الأسطول متصل لحظياً' : 'Live Fleet Active'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {t.dashboardSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsInspectionModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-sm transition-all duration-200"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{t.newInspection}</span>
          </button>
        </div>
      </div>

      {/* Row 1: Executive KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KpiCard
          id="kpi-total-vehicles"
          title={t.kpiTotalVehicles}
          value={totalVehicles}
          subtitle={t.kpiTotalVehiclesSub}
          trend={{ value: isRTL ? '↑ ١٢٪ نمو' : '↑ 12% growth', isPositive: true }}
          icon={Car}
          onClick={() => setActiveSection('vehicles')}
        />

        <KpiCard
          id="kpi-online-devices"
          title={t.kpiOnlineDevices}
          value={`${onlineVehicles} / ${totalVehicles}`}
          subtitle={isRTL ? 'بث قياسات حي ومستقر' : 'Active stream operational'}
          trend={{ value: isRTL ? `${Math.round((onlineVehicles / totalVehicles) * 100)}٪ متصل` : `${Math.round((onlineVehicles / totalVehicles) * 100)}% online`, isPositive: true }}
          icon={Wifi}
          variant="success"
          onClick={() => setActiveSection('devices')}
        />

        <KpiCard
          id="kpi-needs-attention"
          title={t.kpiNeedsAttention}
          value={attentionVehicles}
          subtitle={t.kpiNeedsAttentionSub}
          trend={{ value: isRTL ? 'متابعة بالفرع' : 'Branch check', isPositive: true }}
          icon={AlertTriangle}
          variant="warning"
          onClick={() => setActiveSection('vehicles')}
        />

        <KpiCard
          id="kpi-critical"
          title={t.kpiCritical}
          value={criticalVehicles}
          subtitle={t.kpiCriticalSub}
          trend={{ value: isRTL ? 'متوقفة بالورشة' : 'In workshop', isPositive: false }}
          icon={AlertOctagon}
          variant="critical"
          onClick={() => setActiveSection('vehicles')}
        />
      </div>

      {/* Row 2: Fleet Performance & Operational Readiness (Balanced 7 + 5 layout) */}
      <div className="grid grid-cols-12 gap-5 items-stretch">
        {/* Fleet Health Analytics & Trend */}
        <div className="col-span-12 lg:col-span-7 bento-card flex flex-col justify-between">
          <FleetHealthTrendChart />
        </div>

        {/* Fleet Health & Operational Readiness Hub */}
        <div className="col-span-12 lg:col-span-5">
          <FleetHealthBreakdown
            score={avgHealth}
            healthyCount={healthyVehicles}
            attentionCount={attentionVehicles}
            criticalCount={criticalVehicles}
            totalCount={totalVehicles}
            onlineCount={onlineVehicles}
          />
        </div>
      </div>

      {/* Row 3: Priority Action Operations - Clean & Digestible */}
      <div className="bento-card text-start space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-neutral-100 dark:border-neutral-800/80">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{t.priorityActions}</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isRTL 
                ? 'مهام وقائية تشغيلية مرتبة حسب مستوى الخطورة لتوجيه مسؤولي الفروع والورشة' 
                : t.priorityActionsDesc}
            </p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 self-start">
            {priorityActions.length} {isRTL ? 'مهام قيد المتابعة' : 'actions pending'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {priorityActions.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedPriorityAction(act)}
              className="p-3.5 rounded-xl border border-[#E5E5E1] dark:border-[#2C2C27] hover:border-[#1A1A1A]/30 dark:hover:border-white/30 hover:bg-[#F5F5F0]/30 dark:hover:bg-[#242420]/30 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {act.label}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                      act.severity === 'critical'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-1 ring-rose-500/20'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-1 ring-amber-500/20'
                    }`}
                  >
                    {act.severity === 'critical' ? (isRTL ? 'حرج' : 'Critical') : (isRTL ? 'تحذيري' : 'Warning')}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2.5 leading-relaxed">
                  {act.explanation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between gap-2">
                <div className="text-[11px] text-neutral-600 dark:text-neutral-300 font-normal truncate">
                  <span className="text-neutral-400 dark:text-neutral-500 me-1">
                    {t.recommendedAction}:
                  </span>
                  {act.recommended}
                </div>

                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 whitespace-nowrap">
                  {isRTL ? `المركبات (${act.vehicleIds.length}) ←` : `Vehicles (${act.vehicleIds.length}) →`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Vehicles at Risk Table (col-span-7) + Recent Alerts Feed (col-span-5) */}
      <div className="grid grid-cols-12 gap-5 items-stretch">
        {/* Vehicles at Risk Table */}
        <div className="col-span-12 lg:col-span-7 bento-card text-start flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {t.vehiclesAtRisk}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {isRTL ? 'مرتبة تصاعدياً حسب مؤشر الخطورة التشغيلية' : 'Ranked by AI risk probability'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('vehicles')}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>{t.viewAll}</span>
                {isRTL ? <ChevronRight className="w-3.5 h-3.5 rotate-180" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <table className="w-full min-w-[560px] text-xs text-start">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 font-medium">
                    <th className="pb-3 text-start">{t.vehicle}</th>
                    <th className="pb-3 text-start">{t.branch}</th>
                    <th className="pb-3 text-start">{t.riskLevel}</th>
                    <th className="pb-3 text-start">{t.healthScore}</th>
                    <th className="pb-3 text-start">{isRTL ? 'العطل الأساسي' : 'Primary Issue'}</th>
                    <th className="pb-3 text-end">{t.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {highestRiskVehicles.map((v) => (
                    <tr 
                      key={v.id} 
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-900/40 transition-colors cursor-pointer"
                      onClick={() => viewVehicleDetail(v.id)}
                    >
                      <td className="py-3.5 font-medium text-neutral-900 dark:text-white">
                        <div>
                          <span>{v.make} {v.model}</span>
                          <span className="block text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                            {isRTL ? v.plateNumberAr : v.plateNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-neutral-500 dark:text-neutral-400">
                        {isRTL ? v.branchAr : v.branch}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          v.riskScore >= 70
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 ring-1 ring-rose-500/20'
                            : v.riskScore >= 40
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 ring-1 ring-amber-500/20'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 ring-1 ring-emerald-500/20'
                        }`}>
                          {v.riskScore}% {isRTL ? 'خطورة' : 'risk'}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono font-medium">
                        <span className={v.healthScore < 65 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}>
                          {v.healthScore}/100
                        </span>
                      </td>
                      <td className="py-3.5 text-neutral-500 dark:text-neutral-400 max-w-[170px] truncate">
                        {isRTL ? v.primaryRiskIssueAr : v.primaryRiskIssue}
                      </td>
                      <td className="py-3.5 text-end">
                        <span className="text-xs font-medium text-neutral-900 dark:text-white hover:underline">
                          {isRTL ? 'تفاصيل ←' : 'Details →'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Diagnostic Feed - Streamlined List */}
        <div className="col-span-12 lg:col-span-5 bento-card flex flex-col justify-between text-start">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>{isRTL ? 'سجل التنبيهات اللحظي' : 'Live Alerts Feed'}</span>
              </h3>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {isRTL ? 'محدث للتو' : 'Updated now'}
              </span>
            </div>

            <div className="divide-y divide-[#E5E5E1] dark:divide-[#2C2C27]">
              {[
                {
                  id: 'al-1',
                  code: 'DTC P0420',
                  vehicle: 'Hyundai Sonata (KSA-4821)',
                  vehicleId: 'veh-002',
                  time: isRTL ? 'منذ ١٢ دقيقة' : '12m ago',
                  text: isRTL ? 'انخفاض كفاءة المحفز دون المعيار الطبيعي' : 'Catalyst efficiency below threshold',
                  isCritical: true,
                },
                {
                  id: 'al-2',
                  code: 'BATT-VOLT',
                  vehicle: 'Toyota Camry (RTA-2041)',
                  vehicleId: 'veh-001',
                  time: isRTL ? 'منذ ٣٤ دقيقة' : '34m ago',
                  text: isRTL ? 'هبوط جهد الإشعال إلى ١١.٢ فولت أثناء بدء الحركة' : 'Cold crank voltage drop to 11.2V',
                  isCritical: true,
                },
                {
                  id: 'al-3',
                  code: 'COOLANT-HIGH',
                  vehicle: 'Nissan Altima (DXB-7712)',
                  vehicleId: 'veh-004',
                  time: isRTL ? 'منذ ساعة' : '1h ago',
                  text: isRTL ? 'ارتفاع حرارة سائل التبريد إلى ١٠٢ درجة مئوية' : 'Coolant temp peaked at 102°C',
                  isCritical: false,
                },
                {
                  id: 'al-4',
                  code: 'OBD-OFFLINE',
                  vehicle: 'Chevrolet Malibu (ALX-1940)',
                  vehicleId: 'veh-008',
                  time: isRTL ? 'غير متصل منذ ٢٦ ساعة' : '26h offline',
                  text: isRTL ? 'انقطاع إشارة الجهاز بمنفذ DLC' : 'OBD dongle offline > 24 hours',
                  isCritical: false,
                },
              ].map((al) => (
                <div
                  key={al.id}
                  onClick={() => viewVehicleDetail(al.vehicleId)}
                  className="py-2.5 px-1.5 -mx-1.5 hover:bg-[#F5F5F0]/50 dark:hover:bg-[#242420]/50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#F5F5F0] dark:bg-[#242420] text-neutral-700 dark:text-neutral-300">
                        {al.code}
                      </span>
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        {al.vehicle}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 shrink-0">{al.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                      {al.text}
                    </p>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 whitespace-nowrap">
                      {isRTL ? 'فحص ←' : 'Inspect →'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-vehicle Priority Action Popup Modal */}
      <PriorityVehiclesModal
        isOpen={Boolean(selectedPriorityAction)}
        onClose={() => setSelectedPriorityAction(null)}
        action={selectedPriorityAction}
        vehicles={vehicles}
        onSelectVehicle={(vehicleId) => {
          setSelectedPriorityAction(null);
          viewVehicleDetail(vehicleId);
        }}
        onStartInspection={() => {
          setSelectedPriorityAction(null);
          setIsInspectionModalOpen(true);
        }}
        isRTL={isRTL}
      />
    </div>
  );
};
