import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Radio, 
  BatteryCharging, 
  RefreshCw, 
  CheckCircle2, 
  Clock,
  Car,
  Info,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  BellRing
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OBDDiagnosticsHub: React.FC = () => {
  const { isRTL, devices } = useApp();
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Aggregated manager metrics
  const totalCount = devices.length;
  const connectedCount = devices.filter((d) => d.connectionStatus === 'online').length;
  const securedCount = devices.filter((d) => d.tamperStatus === 'secured').length;
  const alertsCount = devices.filter((d) => d.tamperStatus !== 'secured' || d.connectionStatus === 'offline').length;
  const sleepCount = devices.filter((d) => d.sleepMode).length;

  return (
    <div className="bento-card p-5 border border-[#E5E5E1]/80 dark:border-[#2C2C27]/80 bg-white/80 dark:bg-[#1B1B18]/80 shadow-xs space-y-4">
      {/* Header with Title & Overall Security Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                {isRTL ? 'حالة أمان وتثبيت أجهزة الفحص' : 'Device Security & Protection'}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isRTL ? 'الأجهزة مثبتة ومحمية' : 'All Devices Protected'}
              </span>
            </div>
            <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
              {isRTL 
                ? 'حماية ضد محاولات الفصل أو النزع، مع الحفاظ على بطارية السيارة ونقل القراءات تلقائياً'
                : 'Anti-tamper protection, smart vehicle battery preservation, and automatic mileage sync'}
            </p>
          </div>
        </div>

        {/* Quick Manager Indicator Pill */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] text-xs">
            <span className="text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'حالة التثبيت:' : 'Status:'}</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isRTL ? `${securedCount} من ${totalCount} مثبتة بأمان` : `${securedCount} of ${totalCount} Secured`}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Executive Assurance Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Anti-Tamper & Instant Alert */}
        <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1]/80 dark:border-[#2C2C27]/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <BellRing className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                {isRTL ? 'تنبيه فوري عند محاولة النزع' : 'Anti-Tamper & Unplug Alert'}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {isRTL ? 'مفعل نشط' : 'Active'}
            </span>
          </div>
          <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
            {isRTL 
              ? 'تنبيه مباشر على لوحة التحكم إذا حاول أحد فصل الجهاز من السيارة، مع استمرار بث الموقع عبر بطارية الطوارئ.'
              : 'Instant manager alert if the tracker is unplugged, with backup battery tracking for up to 72 hours.'}
          </p>
        </div>

        {/* Card 2: Smart Vehicle Battery Saver */}
        <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1]/80 dark:border-[#2C2C27]/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <BatteryCharging className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                {isRTL ? 'حفظ بطارية السيارة عند التوقف' : 'Smart Battery Saver'}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              {isRTL ? `${sleepCount} متوقفة بأمان` : `${sleepCount} in Sleep`}
            </span>
          </div>
          <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
            {isRTL 
              ? 'ينتقل الجهاز تلقائياً لوضع السكون عند إطفاء المحرك في الفرع، لضمان عدم استهلاك بطارية السيارة إطلاقاً.'
              : 'The device sleeps when the vehicle is parked, ensuring zero battery drain during idle periods.'}
          </p>
        </div>

        {/* Card 3: Automated Odometer & Fuel Sync */}
        <div className="p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1]/80 dark:border-[#2C2C27]/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                {isRTL ? 'مزامنة تلقائية للعداد والوقود' : 'Automated Telemetry Sync'}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {isRTL ? 'مزامنة مباشرة' : 'Real-Time'}
            </span>
          </div>
          <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
            {isRTL 
              ? 'تحديث ممشى السيارة ومستوى الوقود فور استلامها من المستأجر دون الحاجة لتدوين القراءات يدوياً.'
              : 'Odometer and fuel levels automatically sync into your fleet database upon return without manual checks.'}
          </p>
        </div>
      </div>

      {/* Optional Collapsible Technical Overview (For IT or Engineers if needed) */}
      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="inline-flex items-center gap-1.5 text-xs text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>
            {showTechnicalDetails 
              ? (isRTL ? 'إخفاء المواصفات الفنية' : 'Hide Hardware Specs') 
              : (isRTL ? 'عرض المواصفات الفنية المعتمدة (للمهندسين)' : 'View Hardware & Carrier Specs')}
          </span>
          {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showTechnicalDetails && (
          <div className="mt-2.5 p-3.5 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#71716A] dark:text-[#8E8E86] block">
                {isRTL ? 'نوع المقبس' : 'Port Type'}
              </span>
              <p className="font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'منفذ OBD-II القياسي - متوافق مع كافة موديلات الأسطول' : 'Standard 16-Pin OBD-II (SAE J1962)'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#71716A] dark:text-[#8E8E86] block">
                {isRTL ? 'شبكة نقل البيانات' : 'Cellular Network'}
              </span>
              <p className="font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'شرائح M2M محلية مخصصة للأسطول (تغطية 4G LTE)' : 'Multi-Carrier 4G LTE (STC / Mobily / Zain)'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#71716A] dark:text-[#8E8E86] block">
                {isRTL ? 'الحماية والبطارية الاحتياطية' : 'Backup Battery'}
              </span>
              <p className="font-medium text-[#1A1A1A] dark:text-white">
                {isRTL ? 'مستشعر حركة داخلي + بطارية طوارئ تعمل ٧٢ ساعة' : 'Built-in Gyro + 72-hour Rechargeable Backup'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
