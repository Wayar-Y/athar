import React, { useState, useMemo } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  ChevronRight, 
  Car, 
  Search,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Zap,
  Thermometer,
  Gauge,
  Layers,
  Wrench,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIDiagnosisModal } from '../components/common/AIDiagnosisModal';
import { AIPrediction, EarlyWarning, Vehicle } from '../types';

export const IntelligenceView: React.FC = () => {
  const { 
    vehicles, 
    viewVehicleDetail, 
    isRTL, 
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'predictions' | 'baselines' | 'priority'>('predictions');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('all');
  
  // Selected prediction for the deep-dive modal
  const [selectedModalData, setSelectedModalData] = useState<{
    prediction: AIPrediction;
    vehicle: Vehicle;
  } | null>(null);

  // Aggregate all AI predictions across the fleet
  const allPredictions = useMemo(() => {
    const list: {
      pred: AIPrediction;
      vehicle: Vehicle;
      vehicleId: string;
      vehicleName: string;
      plateNumber: string;
      plateNumberAr: string;
      branch: string;
      branchAr: string;
      healthScore: number;
    }[] = [];

    vehicles.forEach((v) => {
      v.aiPredictions?.forEach((p) => {
        list.push({
          pred: p,
          vehicle: v,
          vehicleId: v.id,
          vehicleName: `${v.make} ${v.model} (${v.year})`,
          plateNumber: v.plateNumber,
          plateNumberAr: v.plateNumberAr,
          branch: v.branch,
          branchAr: v.branchAr,
          healthScore: v.healthScore,
        });
      });
    });

    return list;
  }, [vehicles]);

  // Aggregate all early warnings across the fleet
  const allEarlyWarnings = useMemo(() => {
    const list: {
      warning: EarlyWarning;
      vehicle: Vehicle;
      vehicleId: string;
      vehicleName: string;
      plateNumber: string;
      plateNumberAr: string;
      branch: string;
      branchAr: string;
      healthScore: number;
    }[] = [];

    vehicles.forEach((v) => {
      v.earlyWarnings?.forEach((w) => {
        list.push({
          warning: w,
          vehicle: v,
          vehicleId: v.id,
          vehicleName: `${v.make} ${v.model} (${v.year})`,
          plateNumber: v.plateNumber,
          plateNumberAr: v.plateNumberAr,
          branch: v.branch,
          branchAr: v.branchAr,
          healthScore: v.healthScore,
        });
      });
    });

    return list;
  }, [vehicles]);

  // Subsystem categories
  const subsystemCategories = [
    { id: 'all', labelEn: 'All Systems', labelAr: 'كافة الأنظمة', icon: Layers },
    { id: 'battery', labelEn: 'Electrical & Battery', labelAr: 'الكهرباء والبطارية', icon: Zap },
    { id: 'cooling', labelEn: 'Cooling Loop', labelAr: 'دورة التبريد', icon: Thermometer },
    { id: 'powertrain', labelEn: 'Engine & Ignition', labelAr: 'المحرك والإشعال', icon: Gauge },
    { id: 'emissions', labelEn: 'Exhaust & Catalyst', labelAr: 'العادم والانبعاثات', icon: Activity },
  ];

  const matchesSubsystem = (pred: AIPrediction, subId: string) => {
    if (subId === 'all') return true;
    const comp = (pred.component || '').toLowerCase() + ' ' + (pred.title || '').toLowerCase();
    if (subId === 'battery') return comp.includes('battery') || comp.includes('volt') || comp.includes('electrical') || comp.includes('بطار');
    if (subId === 'cooling') return comp.includes('cool') || comp.includes('thermostat') || comp.includes('temp') || comp.includes('تبريد') || comp.includes('حرار');
    if (subId === 'powertrain') return comp.includes('engine') || comp.includes('misfire') || comp.includes('ignition') || comp.includes('coil') || comp.includes('محرك') || comp.includes('اشتعال');
    if (subId === 'emissions') return comp.includes('catalyst') || comp.includes('emission') || comp.includes('o2') || comp.includes('exhaust') || comp.includes('عادم') || comp.includes('انبعاث');
    return true;
  };

  // Filtered predictions
  const filteredPredictions = useMemo(() => {
    return allPredictions.filter((item) => {
      if (riskFilter !== 'all' && item.pred.riskLevel !== riskFilter) return false;
      if (selectedSubsystem !== 'all' && !matchesSubsystem(item.pred, selectedSubsystem)) return false;
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.vehicleName.toLowerCase().includes(q);
        const matchesPlate = item.plateNumber.toLowerCase().includes(q) || item.plateNumberAr.toLowerCase().includes(q);
        const matchesTitle = (item.pred.title || '').toLowerCase().includes(q) || (item.pred.titleAr || '').toLowerCase().includes(q);
        const matchesComp = (item.pred.component || '').toLowerCase().includes(q) || (item.pred.componentAr || '').toLowerCase().includes(q);
        if (!matchesName && !matchesPlate && !matchesTitle && !matchesComp) return false;
      }

      return true;
    });
  }, [allPredictions, riskFilter, selectedSubsystem, searchQuery]);

  // Count items per subsystem
  const subsystemCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allPredictions.length, battery: 0, cooling: 0, powertrain: 0, emissions: 0 };
    allPredictions.forEach((item) => {
      if (matchesSubsystem(item.pred, 'battery')) counts.battery++;
      if (matchesSubsystem(item.pred, 'cooling')) counts.cooling++;
      if (matchesSubsystem(item.pred, 'powertrain')) counts.powertrain++;
      if (matchesSubsystem(item.pred, 'emissions')) counts.emissions++;
    });
    return counts;
  }, [allPredictions]);

  // Ranked vehicles by risk score
  const rankedVehicles = useMemo(() => {
    return [...vehicles]
      .filter((v) => (v.aiPredictions && v.aiPredictions.length > 0) || v.riskScore > 30)
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [vehicles]);

  const highRiskCount = allPredictions.filter((p) => p.pred.riskLevel === 'high').length;
  const mediumRiskCount = allPredictions.filter((p) => p.pred.riskLevel === 'medium').length;
  const lowRiskCount = allPredictions.filter((p) => p.pred.riskLevel === 'low').length;

  const resetFilters = () => {
    setSearchQuery('');
    setRiskFilter('all');
    setSelectedSubsystem('all');
  };

  return (
    <div className="space-y-5 text-start">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#141412] text-white dark:bg-white dark:text-[#141412] shadow-xs shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
              {isRTL ? 'التحليل التنبؤي وصحة الأسطول' : 'Predictive Fleet Intelligence'}
            </h1>
            <p className="text-xs sm:text-sm text-[#71716A] dark:text-[#8E8E86] mt-0.5">
              {isRTL 
                ? 'رصد التغيرات الدقيقة في الحساسات لمنع الأعطال الميكانيكية المفاجئة أثناء تشغيل الأسطول' 
                : 'Early sensor baseline telemetry analysis to eliminate roadside breakdowns and pre-empt major repairs'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Executive Intelligence Pulse: 4 Compact Metrics in a Single Cohesive Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bento-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#71716A] dark:text-[#8E8E86] block font-medium">
              {isRTL ? 'تنبؤات عاجلة' : 'Urgent Predictions'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {highRiskCount}
              </span>
              <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                {isRTL ? 'مركبات حرجة' : 'vehicles'}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bento-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#71716A] dark:text-[#8E8E86] block font-medium">
              {isRTL ? 'مطابقة الحساسات المرجعية' : 'Baseline Compliance'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                94%
              </span>
              <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                {isRTL ? 'ضمن النطاق' : 'nominal'}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="bento-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#71716A] dark:text-[#8E8E86] block font-medium">
              {isRTL ? 'دقة نموذج الذكاء' : 'Model Precision'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white">
                93.4%
              </span>
              <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                {isRTL ? 'تطابق واقعي' : 'accuracy'}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="bento-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#71716A] dark:text-[#8E8E86] block font-medium">
              {isRTL ? 'التوفير الوقائي التقديري' : 'Cost Prevention'}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white">
                ~8,500
              </span>
              <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                {isRTL ? 'ر.س هذا الشهر' : 'SAR saved'}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Unified Command & Filter Toolbar */}
      <div className="bento-card p-3 sm:p-3.5 space-y-3">
        {/* Top: Main Tabs & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main View Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('predictions')}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'predictions'
                  ? 'bg-[#141412] text-white dark:bg-white dark:text-[#141412]'
                  : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>{isRTL ? 'بطاقات التنبؤ الذكي' : 'Predictive Analysis'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'predictions'
                  ? 'bg-white/20 text-white dark:bg-black/10 dark:text-[#141412]'
                  : 'bg-[#E5E5E1] dark:bg-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
              }`}>
                {allPredictions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('baselines')}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'baselines'
                  ? 'bg-[#141412] text-white dark:bg-white dark:text-[#141412]'
                  : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isRTL ? 'انحرافات الحساسات' : 'Sensor Baseline Drifts'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'baselines'
                  ? 'bg-white/20 text-white dark:bg-black/10 dark:text-[#141412]'
                  : 'bg-[#E5E5E1] dark:bg-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
              }`}>
                {allEarlyWarnings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('priority')}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'priority'
                  ? 'bg-[#141412] text-white dark:bg-white dark:text-[#141412]'
                  : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{isRTL ? 'أولويات الصيانة' : 'Priority Queue'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'priority'
                  ? 'bg-white/20 text-white dark:bg-black/10 dark:text-[#141412]'
                  : 'bg-[#E5E5E1] dark:bg-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
              }`}>
                {rankedVehicles.length}
              </span>
            </button>
          </div>

          {/* Search Field */}
          <div className="relative min-w-[200px] md:w-64">
            <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 start-3 text-[#71716A] dark:text-[#8E8E86]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? 'بحث بالمركبة، اللوحة، العطل...' : 'Search vehicle, plate, issue...'}
              className="w-full ps-8 pe-7 py-1.5 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-xs text-[#1A1A1A] dark:text-white placeholder-[#71716A] focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 end-2 text-[#71716A] hover:text-[#1A1A1A] dark:text-[#8E8E86] dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Subsystem & Severity Filters (Only on predictions tab) */}
        {activeTab === 'predictions' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
            {/* Subsystem Categories */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {subsystemCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedSubsystem === cat.id;
                const count = subsystemCounts[cat.id] || 0;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedSubsystem(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-[#141412] text-white dark:bg-white dark:text-[#141412]'
                        : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{isRTL ? cat.labelAr : cat.labelEn}</span>
                    <span className="opacity-70 font-mono text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Severity Filter Pills */}
            <div className="flex items-center gap-1 self-start sm:self-auto shrink-0">
              <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86] me-1 hidden md:inline">
                {isRTL ? 'الخطورة:' : 'Risk:'}
              </span>
              {(['all', 'high', 'medium', 'low'] as const).map((lvl) => {
                const isSel = riskFilter === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setRiskFilter(lvl)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      isSel 
                        ? 'bg-[#141412] text-white dark:bg-white dark:text-[#141412]' 
                        : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:bg-[#E5E5E1] dark:hover:bg-[#2C2C27]'
                    }`}
                  >
                    {lvl === 'all' && (isRTL ? 'الكل' : 'All')}
                    {lvl === 'high' && (isRTL ? 'عاجل' : 'High')}
                    {lvl === 'medium' && (isRTL ? 'متوسط' : 'Medium')}
                    {lvl === 'low' && (isRTL ? 'منخفض' : 'Low')}
                  </button>
                );
              })}

              {(searchQuery || riskFilter !== 'all' || selectedSubsystem !== 'all') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ms-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:underline whitespace-nowrap"
                >
                  {isRTL ? 'إلغاء التصفية' : 'Reset'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: PREDICTIONS (BREATHABLE, FLATTENED CARDS) */}
      {activeTab === 'predictions' && (
        <div>
          {filteredPredictions.length === 0 ? (
            <div className="bento-card p-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2.5" />
              <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white">
                {t.noPredictionsFound}
              </h3>
              <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-1 max-w-md mx-auto">
                {isRTL 
                  ? 'لا توجد انحرافات مسجلة تطابق معايير التصفية المحددة. جميع الحساسات تعمل ضمن النطاق المعتمد.' 
                  : 'No telemetry deviations match the current filter criteria. All automotive systems operating nominally.'}
              </p>
              {(searchQuery || riskFilter !== 'all' || selectedSubsystem !== 'all') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#141412] text-white dark:bg-white dark:text-[#141412]"
                >
                  {isRTL ? 'إعادة ضبط التصفية' : 'Reset Filters'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPredictions.map(({ pred, vehicle, vehicleId, vehicleName, plateNumber, plateNumberAr, branch, branchAr, healthScore }, index) => {
                const windowText = isRTL 
                  ? (pred.estimatedWindowAr || pred.estimatedWindow) 
                  : (pred.estimatedWindow || pred.estimatedWindowAr);

                const isHigh = pred.riskLevel === 'high';

                // Single concise plain explanation
                const summaryText = isRTL 
                  ? (pred.explanationPointsAr?.[0] || 'رصد انحراف تدريجي في قراءات الحساس يستوجب التدخل الوقائي.')
                  : (pred.explanationPoints?.[0] || 'Subtle sensor telemetry drift detected against certified OEM envelope.');

                return (
                  <div
                    key={`${pred.id}-${index}`}
                    className="bento-card p-4 sm:p-5 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                  >
                    <div>
                      {/* Top Header Row: Vehicle + Priority */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white">
                              {vehicle.make} {vehicle.model}
                            </h3>
                            <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F5F5F0] dark:bg-[#242420] text-neutral-700 dark:text-neutral-300">
                              {isRTL ? plateNumberAr : plateNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                            {isRTL ? branchAr : branch} • {vehicle.status === 'rented' ? (isRTL ? 'مؤجرة' : 'Rented') : (isRTL ? 'متاحة' : 'Available')}
                          </p>
                        </div>

                        {/* Priority Badge */}
                        <div className="text-end shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${
                            isHigh
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-1 ring-rose-500/20'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-1 ring-amber-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            <span>{isHigh ? (isRTL ? 'أولوية عاجلة' : 'High Priority') : (isRTL ? 'أولوية متوسطة' : 'Medium Priority')}</span>
                          </span>
                          <span className="block text-[10px] font-mono text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                            {windowText}
                          </span>
                        </div>
                      </div>

                      {/* Issue & Component Info */}
                      <div className="mt-3.5 space-y-1">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#71716A] dark:text-[#8E8E86]">
                          {isRTL ? pred.componentAr : pred.component}
                        </span>

                        <h4 className="text-sm font-semibold text-[#1A1A1A] dark:text-white leading-snug">
                          {isRTL ? pred.titleAr : pred.title}
                        </h4>

                        <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed line-clamp-2">
                          {summaryText}
                        </p>
                      </div>

                      {/* Failure Probability Mini-Meter */}
                      <div className="mt-3 pt-2.5 border-t border-[#E5E5E1]/60 dark:border-[#2C2C27]/60">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-[#71716A] dark:text-[#8E8E86]">
                            {isRTL ? 'احتمالية التدهور' : 'Failure Risk'}
                          </span>
                          <span className="font-mono font-semibold text-xs text-[#1A1A1A] dark:text-white">
                            {pred.probabilityPercent}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#E5E5E1] dark:bg-[#2C2C27] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isHigh ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ width: `${pred.probabilityPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Recommended Action with accent border + CTA buttons */}
                    <div className="mt-4 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
                      <div className="ps-2.5 border-s-2 border-emerald-500 mb-3.5">
                        <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                          {t.recommendedAction}
                        </span>
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 block leading-snug mt-0.5">
                          {isRTL ? pred.recommendedActionAr : pred.recommendedAction}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedModalData({ prediction: pred, vehicle })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#141412] text-white dark:bg-white dark:text-[#141412] hover:opacity-90 transition-opacity"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'التشخيص الذكي' : 'Deep AI Diagnosis'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => viewVehicleDetail(vehicleId)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                        >
                          <span>{isRTL ? 'تفاصيل المركبة ←' : 'Vehicle Details →'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SENSOR BASELINES (EARLY WARNINGS WITH CLEAN DIVIDED METERS) */}
      {activeTab === 'baselines' && (
        <div className="space-y-4">
          <div className="bento-card p-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white">
              {isRTL ? 'رصد انحرافات الحساسات اللحظية عن النطاق المرجعي' : 'Live Sensor Deviations from Certified OEM Baseline'}
            </h3>
            <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
              {isRTL 
                ? 'يتم رصد شذوذ الحرارة والجهد والضغط مبكراً قبل إضاءة لمبة فحص المحرك أو تعطل المستأجر' 
                : 'Telemetry drifts detected early before diagnostic trouble codes log or roadside stalls occur'}
            </p>
          </div>

          {allEarlyWarnings.length === 0 ? (
            <div className="bento-card p-10 text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1A1A1A] dark:text-white">
                {isRTL ? 'جميع قراءات الحساسات الحية متطابقة مع النطاق المرجعي' : 'All sensor streams are strictly within certified baseline envelopes'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allEarlyWarnings.map(({ warning, vehicle, vehicleId, vehicleName, plateNumber, plateNumberAr }, i) => (
                <div
                  key={`${warning.id}-${i}`}
                  className="bento-card p-4 sm:p-5 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
                      <div>
                        <h4 className="text-sm font-semibold text-[#1A1A1A] dark:text-white">
                          {isRTL ? warning.titleAr : warning.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#71716A] dark:text-[#8E8E86] mt-1">
                          <Car className="w-3.5 h-3.5" />
                          <span>{vehicleName}</span>
                          <span className="font-mono text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white">
                            {isRTL ? plateNumberAr : plateNumber}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-1 ring-amber-500/20 shrink-0">
                        {isRTL ? 'انحراف ملحوظ' : 'Drift Logged'}
                      </span>
                    </div>

                    {/* Sensor Telemetry Comparison: Streamlined & Clean */}
                    <div className="my-3.5 py-2.5 px-3 rounded-lg bg-[#F5F5F0]/60 dark:bg-[#242420]/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block font-medium">
                          {isRTL ? 'القراءة اللحظية' : 'Live Reading'}
                        </span>
                        <span className="text-sm font-mono font-bold text-rose-600 dark:text-rose-400">
                          {warning.currentValue}
                        </span>
                      </div>

                      <div className="h-6 w-px bg-[#E5E5E1] dark:bg-[#2C2C27]" />

                      <div>
                        <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block font-medium">
                          {isRTL ? 'النطاق المرجعي' : 'OEM Baseline'}
                        </span>
                        <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {warning.baselineValue}
                        </span>
                      </div>

                      <div className="h-6 w-px bg-[#E5E5E1] dark:bg-[#2C2C27]" />

                      <div className="text-end">
                        <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block font-medium">
                          {isRTL ? 'الحالة' : 'Status'}
                        </span>
                        <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          {isRTL ? 'تحت المتابعة' : 'Investigate'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                      {isRTL ? warning.anomalyDescriptionAr : warning.anomalyDescription}
                    </p>
                  </div>

                  {/* Action link */}
                  <div className="mt-4 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between gap-3 text-xs">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium truncate">
                      {isRTL ? warning.recommendedActionAr : warning.recommendedAction}
                    </span>
                    <button
                      type="button"
                      onClick={() => viewVehicleDetail(vehicleId)}
                      className="inline-flex items-center gap-1 font-medium text-[#1A1A1A] dark:text-white hover:underline shrink-0"
                    >
                      <span>{isRTL ? 'فحص المركبة ←' : 'Inspect Vehicle →'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VEHICLE RISK RANKING (SPACIOUS TABLE) */}
      {activeTab === 'priority' && (
        <div className="bento-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
            <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white">
              {isRTL ? 'ترتيب أولويات صيانة الأسطول الوقائية' : 'Preventive Maintenance Priority Queue'}
            </h3>
            <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
              {isRTL 
                ? 'مرتبة تنازلياً حسب احتمالية الأعطال وتدهور الحساسات لتوجيه فرق الصيانة والمشرفين' 
                : 'Ranked from highest to lowest risk probability to guide maintenance scheduling'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-[#F9F9F7] dark:bg-[#20201D] border-b border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] font-medium text-[11px]">
                  <th className="py-3 ps-4 pe-2 text-start">{isRTL ? 'المرتبة' : 'Rank'}</th>
                  <th className="py-3 px-3 text-start">{t.vehicle}</th>
                  <th className="py-3 px-3 text-start">{isRTL ? 'مؤشر الخطورة' : 'Risk Score'}</th>
                  <th className="py-3 px-3 text-start">{isRTL ? 'مؤشر الصحة' : 'Health Score'}</th>
                  <th className="py-3 px-3 text-start">{isRTL ? 'العطل الأساسي' : 'Primary Risk Issue'}</th>
                  <th className="py-3 px-3 text-start">{t.branch}</th>
                  <th className="py-3 pe-4 ps-2 text-end">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E1]/60 dark:divide-[#2C2C27]/60">
                {rankedVehicles.map((v, i) => (
                  <tr 
                    key={v.id}
                    onClick={() => viewVehicleDetail(v.id)}
                    className="hover:bg-[#F9F9F7] dark:hover:bg-[#20201D] cursor-pointer transition-colors"
                  >
                    <td className="py-3 ps-4 pe-2 font-mono font-medium text-[#71716A] dark:text-[#8E8E86]">
                      #{i + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#1A1A1A] dark:text-white">
                        {v.make} {v.model} ({v.year})
                      </div>
                      <div className="text-[11px] font-mono text-[#71716A] dark:text-[#8E8E86]">
                        {isRTL ? v.plateNumberAr : v.plateNumber}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center font-mono font-medium text-[11px] px-2 py-0.5 rounded ${
                        v.riskScore > 75 
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-1 ring-rose-500/20' 
                          : v.riskScore > 45 
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-1 ring-amber-500/20' 
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-1 ring-emerald-500/20'
                      }`}>
                        {v.riskScore}% {isRTL ? 'خطورة' : 'risk'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium">
                      <span className={v.healthScore < 65 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}>
                        {v.healthScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-[#71716A] dark:text-[#8E8E86]">
                      {isRTL ? v.primaryRiskIssueAr : v.primaryRiskIssue}
                    </td>
                    <td className="py-3 px-3 text-[#71716A] dark:text-[#8E8E86]">
                      {isRTL ? v.branchAr : v.branch}
                    </td>
                    <td className="py-3 pe-4 ps-2 text-end font-medium text-neutral-900 dark:text-white hover:underline">
                      {isRTL ? 'تفاصيل ←' : 'Details →'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Diagnosis Deep Dive Modal */}
      <AIDiagnosisModal
        isOpen={Boolean(selectedModalData)}
        onClose={() => setSelectedModalData(null)}
        prediction={selectedModalData?.prediction || null}
        vehicle={selectedModalData?.vehicle || null}
      />
    </div>
  );
};
