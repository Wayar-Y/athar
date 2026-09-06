import {csv,download,printReport} from '../../lib/export';
import {contractsFor,compareRental} from '../../lib/rental';
import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, Printer, Table, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportExportModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    vehicles, selectedVehicle, activeSection,
    isRTL,
    t,
  } = useApp();

  const [selectedReportType, setSelectedReportType] = useState<'health' | 'faults' | 'maintenance' | 'ai_risk' | 'rental'>('health');
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleDownload = () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const scope = activeSection === 'vehicles' && selectedVehicle ? [selectedVehicle] : vehicles;
      let rows: unknown[][] = [];
      if (selectedReportType === 'health') rows = [['Vehicle / المركبة','Plate / اللوحة','Health / الصحة','Status / الحالة','Device / الجهاز','Mileage / العداد'], ...scope.map(v=>[`${v.make} ${v.model}`,v.plateNumber,v.healthScore,v.status,v.deviceStatus,v.mileageKm])];
      if (selectedReportType === 'faults') rows = [['Plate / اللوحة','Code / الكود','Description / الوصف','Severity / الشدة','First detected / أول رصد','Status / الحالة'],...scope.flatMap(v=>[...v.activeFaults,...v.resolvedFaults].map(f=>[v.plateNumber,f.code,isRTL?f.titleAr:f.title,f.severity,f.firstDetected,f.status]))];
      if (selectedReportType === 'maintenance') rows = [['Plate / اللوحة','Service / الخدمة','Status / الحالة','Due / الاستحقاق','Cost SAR / التكلفة'],...scope.flatMap(v=>v.maintenanceList.map(m=>[v.plateNumber,isRTL?m.titleAr:m.title,m.status,m.dueDateOrMileage,m.estimatedCost]))];
      if (selectedReportType === 'ai_risk') rows = [['Plate / اللوحة','Sample prediction / تنبؤ تجريبي','Sample probability / احتمال تجريبي','Action / الإجراء'],...scope.flatMap(v=>v.aiPredictions.map(p=>[v.plateNumber,isRTL?p.titleAr:p.title,p.probabilityPercent,isRTL?p.recommendedActionAr:p.recommendedAction]))];
      if (selectedReportType === 'rental') rows = [['Plate / اللوحة','Contract / العقد','Renter / المستأجر','Status / الحالة','Distance km / المسافة','Fuel delta / تغير الوقود','New codes / أكواد جديدة'],...scope.flatMap(v=>contractsFor(v).map(c=>{const d=compareRental(v,c.id);return [v.plateNumber,c.id,c.renterName,c.status,d.distance??'Missing inspection / فحص ناقص',d.fuelDelta??'—',d.newFaults.join(', ')];}))];
      if (format === 'pdf') printReport(`Athar — ${selectedReportType}`, rows, isRTL);
      else download(`athar-${selectedReportType}.csv`,csv(rows));
      setExportSuccess(true);
    } catch (error) { window.alert((error as Error).message); }
    finally { setIsExporting(false); }
  };

  if (!isReportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-xl rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E1] dark:border-[#2C2C27] shadow-2xl overflow-hidden text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E1] dark:border-[#2C2C27] bg-[#F5F5F0]/60 dark:bg-[#242420]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F5F5F0] text-[#1A1A1A] dark:bg-[#242420] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">
                {t.reportsTitle}
              </h3>
              <p className="text-xs text-[#71716A] dark:text-[#8E8E86]">
                {isRTL ? 'تصدير السجلات الحالية' : 'Export the current saved records'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsReportModalOpen(false)}
            className="p-1 rounded-lg text-[#71716A] hover:text-[#1A1A1A] dark:text-[#8E8E86] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Report Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] dark:text-white mb-2">
              {isRTL ? 'نوع التقرير' : 'Select Report Category'}
            </label>
            <div className="space-y-2">
              {[
                { id: 'health', label: t.reportFleetHealth, desc: isRTL ? 'مؤشر الصحة، التوزيع، والمركبات المتأثرة' : 'Fleet health score, distribution & offline devices' },
                { id: 'faults', label: t.reportFaults, desc: isRTL ? 'أكواد الأعطال المتكررة وحالات الاستدعاء' : 'DTC occurrences, recurring patterns & severity breakdown' },
                { id: 'maintenance', label: t.reportMaintenance, desc: isRTL ? 'الصيانة الوقائية المستحقة وتكاليف الخدمة المقدرة' : 'Overdue & recommended preventive services' },
                { id: 'ai_risk', label: t.reportAIRisk, desc: isRTL ? 'تنبؤات احتمالية تعطل البطاريات والمحركات' : 'Predicted failure windows & early warning baseline drifts' },
                { id: 'rental', label: t.reportRentalCondition, desc: isRTL ? 'مقارنة فنية لحالة المركبات قبل وبعد التأجير' : 'Pre vs post-rental inspection condition deltas' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedReportType(item.id as any)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedReportType === item.id
                      ? 'bg-[#F5F5F0] border-[#1A1A1A] dark:bg-[#242420] dark:border-white text-[#1A1A1A] dark:text-white'
                      : 'bg-white dark:bg-[#1A1A1A] border-[#E5E5E1] dark:border-[#2C2C27] hover:bg-[#F5F5F0] dark:hover:bg-[#242420]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                      {item.label}
                    </span>
                    {selectedReportType === item.id && (
                      <span className="w-2 h-2 rounded-full bg-[#1A1A1A] dark:bg-white" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] dark:text-white mb-2">
              {isRTL ? 'صيغة التصدير' : 'Export Format'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition-all ${
                  format === 'pdf'
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] dark:bg-white dark:text-[#1A1A1A] dark:border-white'
                    : 'bg-[#F5F5F0] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>{(isRTL ? 'طباعة / حفظ PDF' : 'Print / Save PDF')}</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold transition-all ${
                  format === 'excel'
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] dark:bg-white dark:text-[#1A1A1A] dark:border-white'
                    : 'bg-[#F5F5F0] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
                }`}
              >
                <Table className="w-4 h-4" />
                <span>{(isRTL ? 'تنزيل CSV (Excel)' : 'Download CSV (Excel)')}</span>
              </button>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg text-[#71716A] dark:text-[#8E8E86] hover:bg-[#F5F5F0] dark:hover:bg-[#242420]"
            >
              {t.close}
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-[#1A1A1A] hover:bg-black text-white dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-[#F5F5F0] shadow-xs disabled:opacity-50 transition-colors"
            >
              {isExporting ? (
                <span>{t.generatingReport}</span>
              ) : exportSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>{isRTL ? 'تم فتح التقرير' : 'Report opened'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{format === 'pdf' ? (isRTL ? 'طباعة / حفظ PDF' : 'Print / Save PDF') : (isRTL ? 'تنزيل CSV (Excel)' : 'Download CSV (Excel)')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
