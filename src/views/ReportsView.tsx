import React from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Wrench, 
  BrainCircuit, 
  ClipboardCheck, 
  Printer, 
  Table 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsView: React.FC = () => {
  const { 
    setIsReportModalOpen, 
    isRTL, 
    t 
  } = useApp();

  const reportPacks = [
    {
      id: 'rp-1',
      title: t.reportFleetHealth,
      titleAr: 'تقرير صحة الأسطول التنفيذي',
      desc: isRTL ? 'ملخص درجات الصحة الإجمالية، التوزيع، والمركبات المتأثرة' : 'Overall fleet health index, status breakdown, and offline devices.',
      type: 'Executive',
      frequency: isRTL ? 'شهري' : 'Monthly',
      icon: TrendingUp,
      color: 'emerald',
    },
    {
      id: 'rp-2',
      title: t.reportFaults,
      titleAr: 'تقرير أكواد الأعطال التشخيصية (DTC)',
      desc: isRTL ? 'تحليل الأعطال المتكررة، معدل الظهور، وتكاليف الإصلاح المحتملة' : 'Recurring DTC frequency, system breakdown, and recurring patterns.',
      type: 'Technical',
      frequency: isRTL ? 'أسبوعي' : 'Weekly',
      icon: Wrench,
      color: 'rose',
    },
    {
      id: 'rp-3',
      title: t.reportAIRisk,
      titleAr: 'تقرير التنبؤ بالأعطال والمخاطر',
      desc: isRTL ? 'المكونات المعرضة لخطر التعطل وشذوذ الحساسات عن النطاق الطبيعي' : 'Component failure probabilities and sensor baseline drifts.',
      type: 'AI Predictive',
      frequency: isRTL ? 'فوري' : 'Real-time',
      icon: BrainCircuit,
      color: 'amber',
    },
    {
      id: 'rp-4',
      title: t.reportRentalCondition,
      titleAr: 'تقرير مقارنة حالة المركبات قبل وبعد التأجير',
      desc: isRTL ? 'مطابقة قراءات العداد والوقود وملاحظات الفحص بين التسليم والاسترجاع' : 'Pre-rental handoff vs post-rental return delta audits.',
      type: 'Operations',
      frequency: isRTL ? 'حسب العقود' : 'Per Contract',
      icon: ClipboardCheck,
      color: 'blue',
    },
  ];

  return (
    <div className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
            {t.reportsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#71716A] dark:text-[#8E8E86] mt-0.5">
            {t.reportsSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsReportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1A1A1A] hover:bg-black text-white dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-[#F5F5F0] shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{t.exportFleetReport}</span>
        </button>
      </div>

      {/* Reports Grid in Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportPacks.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bento-card p-6 flex flex-col justify-between hover:border-[#1A1A1A]/30 dark:hover:border-white/30 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] border border-[#E5E5E1] dark:border-[#2C2C27]">
                    {item.frequency}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">
                  {isRTL ? item.titleAr : item.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#71716A] dark:text-[#8E8E86] uppercase tracking-wider">
                  {isRTL ? 'الصيغة: PDF و XLSX' : 'Format: PDF, XLSX'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F5F5F0] hover:bg-[#E5E5E1] dark:bg-[#242420] dark:hover:bg-[#2C2C27] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t.exportPdf}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1A1A1A] hover:bg-black text-white dark:bg-white dark:text-[#1A1A1A] transition-colors"
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>{t.exportExcel}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
