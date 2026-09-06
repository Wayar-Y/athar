import {TelemetryImport} from '../components/common/TelemetryImport';
import {useStoredState} from '../lib/useStoredState';
import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  AlertOctagon, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  Car,
  Layers,
  Battery,
  Zap,
  Thermometer,
  Gauge,
  Plus,
  Clock,
  FileText,
  Check,
  X,
  RefreshCw,
  Calendar,
  Building2,
  Sparkles,
  ArrowUpDown,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { FaultCode, MaintenanceItem, Vehicle } from '../types';

export interface WorkOrder {
  id: string;
  orderNumber: string;
  vehicleId: string;
  vehicleName: string;
  plateNumber: string;
  branch: string;
  branchAr: string;
  title: string;
  titleAr: string;
  system: string;
  systemAr: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'draft' | 'dispatched' | 'in_progress' | 'completed';
  workshop: string;
  workshopAr: string;
  estimatedCost: number;
  createdAt: string;
  scheduledDate: string;
  technicianNotes?: string;
  technicianNotesAr?: string;
  relatedDtc?: string;
}

export const DiagnosticsView: React.FC = () => {
  const { 
    vehicles, updateVehicle, 
    viewVehicleDetail, 
    isRTL, 
    t 
  } = useApp();

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'dtc' | 'preventative' | 'work_orders' | 'systems'>('dtc');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [systemFilter, setSystemFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [scanToastMessage, setScanToastMessage] = useState<string | null>(null);

  // Work Order Creation Modal State
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [selectedVehicleForOrder, setSelectedVehicleForOrder] = useState<string>(vehicles[0]?.id || '');
  const [orderTitle, setOrderTitle] = useState('');
  const [orderSystem, setOrderSystem] = useState('engine');
  const [orderPriority, setOrderPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [orderWorkshop, setOrderWorkshop] = useState('مركز صيانة الأسطول الداخلي');
  const [orderCost, setOrderCost] = useState('350');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderRelatedDtc, setOrderRelatedDtc] = useState('');

  // Initial Work Orders State
  const [workOrders, setWorkOrders, orderStorage] = useStoredState<WorkOrder[]>('workorders', [
    {
      id: 'wo-101',
      orderNumber: 'WO-2026-084',
      vehicleId: 'veh-001',
      vehicleName: 'Toyota Camry (2024)',
      plateNumber: 'HHK-1234',
      branch: 'Riyadh Airport Terminal 5',
      branchAr: 'مطار الرياض - الصالة ٥',
      title: 'Ignition Coil Replacement & Spark Plug Service',
      titleAr: 'استبدال كويل الإشعال وبواجي الاحتراق (السلندر رقم ١)',
      system: 'engine',
      systemAr: 'منظومة المحرك',
      priority: 'high',
      status: 'in_progress',
      workshop: 'Internal Fleet Workshop - King Fahd Rd',
      workshopAr: 'مركز صيانة الأسطول - طريق الملك فهد',
      estimatedCost: 650,
      createdAt: '2026-09-03',
      scheduledDate: '2026-09-06',
      technicianNotes: 'DTC P0301 recurring on cold crank. Coil #1 resistance out of spec.',
      technicianNotesAr: 'كود P0301 متكرر عند التشغيل البارد؛ مقاومة الكويل خارج النطاق القياسي.',
      relatedDtc: 'P0301'
    },
    {
      id: 'wo-102',
      orderNumber: 'WO-2026-085',
      vehicleId: 'veh-002',
      vehicleName: 'Hyundai Sonata (2023)',
      plateNumber: 'BTR-5678',
      branch: 'Jeddah Corniche Branch',
      branchAr: 'فرع كورنيش جدة',
      title: '12V Battery Conductance Test & Terminal Servicing',
      titleAr: 'فحص كفاءة بطارية ١٢ فولت واستبدالها وقائياً',
      system: 'electrical',
      systemAr: 'المنظومة الكهربائية',
      priority: 'critical',
      status: 'draft',
      workshop: 'Agency Service Center',
      workshopAr: 'مركز صيانة الوكالة',
      estimatedCost: 520,
      createdAt: '2026-09-04',
      scheduledDate: '2026-09-05',
      technicianNotes: 'Resting voltage dropped to 11.9V. High failure probability detected by AI.',
      technicianNotesAr: 'انخفاض جهد البطارية أثناء توقف المركبة إلى ١١.٩ فولت، ويُوصى بالاستبدال الفوري قبل إعادة التأجير.',
      relatedDtc: 'P0562'
    },
    {
      id: 'wo-103',
      orderNumber: 'WO-2026-086',
      vehicleId: 'veh-003',
      vehicleName: 'Nissan Sunny (2023)',
      plateNumber: 'KSA-9901',
      branch: 'Dammam Highway Center',
      branchAr: 'مركز طريق الدمام السريع',
      title: 'Routine 40,000 KM Major Service & Brake Inspection',
      titleAr: 'صيانة دورية ٤٠,٠٠٠ كم وفحص فحمات الفرامل',
      system: 'brakes',
      systemAr: 'المكابح والإطارات',
      priority: 'medium',
      status: 'draft',
      workshop: 'Central Fleet Workshop',
      workshopAr: 'مركز الصيانة الرئيسي للأسطول',
      estimatedCost: 780,
      createdAt: '2026-09-05',
      scheduledDate: '2026-09-08',
      technicianNotes: 'Vehicle approaching 40k interval. Front brake pads wear estimated at 3.2mm.',
      technicianNotesAr: 'المركبة تقترب من موعد الصيانة الدورية، وسماكة فحمات الفرامل الأمامية ٣.٢ ملم وتتطلب فحصاً.',
    }
  ]);

  // Aggregate all active faults across all vehicles
  const allActiveFaults = useMemo(() => {
    const list: {
      fault: FaultCode;
      vehicleId: string;
      vehicleName: string;
      plateNumber: string;
      plateNumberAr?: string;
      branch: string;
      branchAr?: string;
      currentMileage: number;
      rentalStatus: string;
      sensorData: Vehicle['sensorData'];
    }[] = [];

    vehicles.forEach((v) => {
      v.activeFaults?.forEach((f) => {
        list.push({
          fault: f,
          vehicleId: v.id,
          vehicleName: `${v.make} ${v.model} (${v.year})`,
          plateNumber: v.plateNumber,
          plateNumberAr: v.plateNumberAr,
          branch: v.branch,
          branchAr: v.branchAr,
          currentMileage: v.mileageKm,
          rentalStatus: v.status,
          sensorData: v.sensorData,
        });
      });
    });

    return list;
  }, [vehicles]);

  // Aggregate all preventative maintenance items across all vehicles
  const allMaintenanceItems = useMemo(() => {
    const list: {
      item: MaintenanceItem;
      vehicleId: string;
      vehicleName: string;
      plateNumber: string;
      plateNumberAr?: string;
      branch: string;
      branchAr?: string;
      currentMileage: number;
      nextMaintenanceKm: number;
      kmRemaining: number;
      rentalStatus: string;
    }[] = [];

    vehicles.forEach((v) => {
      v.maintenanceList?.forEach((m) => {
        const kmRemaining = v.nextMaintenanceKm - v.mileageKm;
        list.push({
          item: m,
          vehicleId: v.id,
          vehicleName: `${v.make} ${v.model} (${v.year})`,
          plateNumber: v.plateNumber,
          plateNumberAr: v.plateNumberAr,
          branch: v.branch,
          branchAr: v.branchAr,
          currentMileage: v.mileageKm,
          nextMaintenanceKm: v.nextMaintenanceKm,
          kmRemaining,
          rentalStatus: v.status,
        });
      });
    });

    return list;
  }, [vehicles]);

  // Unique branches
  const branches = useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => isRTL ? (v.branchAr || v.branch) : v.branch)));
  }, [vehicles, isRTL]);

  // Unique systems for DTC
  const systemOptions = [
    { value: 'all', labelEn: 'All Vehicle Systems', labelAr: 'جميع أنظمة المركبة' },
    { value: 'engine', labelEn: 'Engine & Powertrain', labelAr: 'المحرك ومنظومة الاحتراق' },
    { value: 'electrical', labelEn: 'Battery & Electrical', labelAr: 'البطارية والمنظومة الكهربائية' },
    { value: 'cooling', labelEn: 'Cooling & Thermals', labelAr: 'دورة التبريد والحرارة' },
    { value: 'emissions', labelEn: 'Emissions & Exhaust', labelAr: 'نظام العادم والانبعاثات' },
    { value: 'brakes', labelEn: 'Brakes & Hydraulics', labelAr: 'نظام الفرامل والمكابح' },
    { value: 'transmission', labelEn: 'Transmission & Gear', labelAr: 'ناقل الحركة (القير)' },
  ];

  // High-level KPI Counts
  const criticalDtcCount = allActiveFaults.filter((f) => f.fault.severity === 'critical' || f.fault.severity === 'high').length;
  const recurringDtcCount = allActiveFaults.filter((f) => f.fault.isRecurring).length;
  const overdueMaintenanceCount = allMaintenanceItems.filter((m) => m.item.status === 'overdue' || m.kmRemaining < 0).length;
  const upcomingMaintenanceCount = allMaintenanceItems.filter((m) => m.item.status === 'upcoming' || (m.kmRemaining >= 0 && m.kmRemaining <= 2500)).length;
  const activeWorkOrdersCount = workOrders.filter((w) => w.status !== 'completed').length;

  // Filtered Faults List
  const filteredFaults = useMemo(() => {
    return allActiveFaults.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          item.fault.code.toLowerCase().includes(q) ||
          item.fault.title.toLowerCase().includes(q) ||
          (item.fault.titleAr && item.fault.titleAr.includes(q)) ||
          item.vehicleName.toLowerCase().includes(q) ||
          item.plateNumber.toLowerCase().includes(q) ||
          (item.plateNumberAr && item.plateNumberAr.includes(q));
        if (!matches) return false;
      }

      if (severityFilter !== 'all' && item.fault.severity !== severityFilter) {
        return false;
      }

      if (systemFilter !== 'all' && item.fault.system !== systemFilter) {
        return false;
      }

      if (branchFilter !== 'all') {
        const b = isRTL ? (item.branchAr || item.branch) : item.branch;
        if (b !== branchFilter) return false;
      }

      return true;
    });
  }, [allActiveFaults, searchQuery, severityFilter, systemFilter, branchFilter, isRTL]);

  // Filtered Maintenance Items List
  const filteredMaintenance = useMemo(() => {
    return allMaintenanceItems.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          item.item.title.toLowerCase().includes(q) ||
          (item.item.titleAr && item.item.titleAr.includes(q)) ||
          item.vehicleName.toLowerCase().includes(q) ||
          item.plateNumber.toLowerCase().includes(q) ||
          (item.plateNumberAr && item.plateNumberAr.includes(q));
        if (!matches) return false;
      }

      if (maintenanceStatusFilter !== 'all' && item.item.status !== maintenanceStatusFilter) {
        return false;
      }

      if (branchFilter !== 'all') {
        const b = isRTL ? (item.branchAr || item.branch) : item.branch;
        if (b !== branchFilter) return false;
      }

      return true;
    });
  }, [allMaintenanceItems, searchQuery, maintenanceStatusFilter, branchFilter, isRTL]);

  // Handle Scan OBD Action
  const handleTriggerOBDScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanToastMessage(
        isRTL 
          ? 'تمت مراجعة البيانات التجريبية. لا يوجد جهاز OBD-II مباشر متصل.' 
          : 'Sample data reviewed. No live OBD-II device is connected.'
      );
      setTimeout(() => setScanToastMessage(null), 5000);
    }, 1200);
  };

  // Open modal with prefill from DTC
  const handleCreateOrderFromDtc = (fault: FaultCode, vehicleName: string, plateNumber: string, vehicleId: string, branch: string) => {
    setSelectedVehicleForOrder(vehicleId);
    setOrderTitle(isRTL ? `معالجة العطل ${fault.code}: ${fault.titleAr}` : `Fix DTC ${fault.code}: ${fault.title}`);
    setOrderSystem(fault.system || 'engine');
    setOrderPriority(fault.severity === 'critical' ? 'critical' : 'high');
    setOrderRelatedDtc(fault.code);
    setOrderNotes(isRTL ? fault.recommendedActionAr : fault.recommendedAction);
    setIsWorkOrderModalOpen(true);
  };

  // Submit Work Order
  const handleSaveWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find((veh) => veh.id === selectedVehicleForOrder) || vehicles[0];
    const newOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderNumber: `WO-2026-0${workOrders.length + 85}`,
      vehicleId: v.id,
      vehicleName: `${v.make} ${v.model} (${v.year})`,
      plateNumber: v.plateNumber,
      branch: v.branch,
      branchAr: v.branchAr,
      title: orderTitle || (isRTL ? 'فحص وصيانة شاملة للمركبة' : 'Comprehensive Vehicle Inspection'),
      titleAr: orderTitle || 'فحص وصيانة شاملة للمركبة',
      system: orderSystem,
      systemAr: systemOptions.find((s) => s.value === orderSystem)?.labelAr || 'المحرك ومنظومة الاحتراق',
      priority: orderPriority,
      status: 'draft',
      workshop: orderWorkshop,
      workshopAr: orderWorkshop,
      estimatedCost: Math.max(0, Number(orderCost) || 0),
      createdAt: new Date().toISOString().split('T')[0],
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      technicianNotes: orderNotes,
      technicianNotesAr: orderNotes,
      relatedDtc: orderRelatedDtc || undefined
    };

    setWorkOrders([newOrder, ...workOrders]);
    const stamp = new Date().toISOString();
    updateVehicle({...v, maintenanceList: [{id:newOrder.id,title:newOrder.title,titleAr:newOrder.titleAr,triggerType:'fault',status:'upcoming',dueDateOrMileage:newOrder.scheduledDate,estimatedCost:newOrder.estimatedCost,severity:newOrder.priority,reason:newOrder.technicianNotes||'',reasonAr:newOrder.technicianNotesAr||'',recommendedAction:newOrder.title,recommendedActionAr:newOrder.titleAr},...v.maintenanceList],timeline:[{id:crypto.randomUUID(),timestamp:stamp,date:stamp.slice(0,10),time:stamp.slice(11,16),type:'maintenance',title:newOrder.title,titleAr:newOrder.titleAr,description:'Internal work order created',descriptionAr:'إنشاء أمر صيانة داخلي',rentalId:v.rentalContext.isCurrentlyRented?v.rentalContext.rentalId:undefined},...v.timeline]});
    setIsWorkOrderModalOpen(false);
    setActiveTab('work_orders');
    setScanToastMessage(
      isRTL 
        ? `تم حفظ أمر العمل ${newOrder.orderNumber} داخلياً. لم يُرسل إلى جهة خارجية.` 
        : `Work order ${newOrder.orderNumber} saved internally. No external dispatch was sent.`
    );
    setTimeout(() => setScanToastMessage(null), 5000);
  };

  return (
    <div className="space-y-6 text-start" inert={!orderStorage.ready || !!orderStorage.error}>
      {orderStorage.error && <p role="alert">{orderStorage.error}</p>}
      <TelemetryImport />
      {/* Toast Feedback Notification */}
      {scanToastMessage && (
        <div className="fixed bottom-6 end-6 z-50 max-w-md bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] p-4 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed">{scanToastMessage}</p>
          <button 
            type="button" 
            onClick={() => setScanToastMessage(null)}
            className="ms-auto p-1 rounded hover:bg-white/10 dark:hover:bg-black/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header: Title & Action Hub */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Wrench className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
              {isRTL ? 'فحص وصيانة أسطول المركبات' : 'Fleet Diagnostics & Maintenance'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#71716A] dark:text-[#8E8E86] mt-1 ms-1">
            {isRTL 
              ? 'متابعة تنبيهات وأعطال السيارات، مواعيد تغيير الزيت والقطع الاستهلاكية، وتوجيه السيارات للورشة بسهولة' 
              : 'Track vehicle fault alerts, upcoming oil and part services, and dispatch maintenance work orders'}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Scan Button */}
          <button
            type="button"
            onClick={handleTriggerOBDScan}
            disabled={isScanning}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] hover:bg-[#EAEAE5] dark:hover:bg-[#2E2E2A] transition-all disabled:opacity-50"
            title={isRTL ? 'تحديث الفحص وقراءة أجهزة السيارات' : 'Scan all live OBD devices'}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#71716A] ${isScanning ? 'animate-spin text-amber-500' : ''}`} />
            <span>{isScanning ? (isRTL ? 'جارٍ فحص السيارات...' : 'Scanning Vehicles...') : (isRTL ? 'تحديث فحص الأسطول' : 'Scan Fleet Now')}</span>
          </button>

          {/* Create Work Order Button */}
          <button
            type="button"
            onClick={() => {
              setOrderTitle('');
              setOrderRelatedDtc('');
              setOrderNotes('');
              setIsWorkOrderModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#141412] dark:bg-white text-white dark:text-[#141412] hover:bg-black dark:hover:bg-zinc-200 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isRTL ? 'طلب صيانة جديد' : 'New Service Request'}</span>
          </button>
        </div>
      </div>

      {/* Athar Telematics Identity KPI Strip (Bento Overview) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Check Engine / Active Faults */}
        <div 
          onClick={() => { setActiveTab('dtc'); setSeverityFilter('all'); }}
          className={`bento-card p-3.5 cursor-pointer transition-all ${
            activeTab === 'dtc' 
              ? 'ring-2 ring-[#141412] dark:ring-white' 
              : 'hover:border-[#1A1A1A]/30 dark:hover:border-white/30'
          }`}
        >
          <div className="flex items-center justify-between text-[#71716A] dark:text-[#8E8E86]">
            <span className="text-xs font-medium">
              {isRTL ? 'أعطال تتطلب الفحص' : 'Faults Needing Inspection'}
            </span>
            <AlertOctagon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white font-mono">
              {allActiveFaults.length}
            </span>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {criticalDtcCount} {isRTL ? 'حرجة' : 'critical'}
            </span>
          </div>
        </div>

        {/* Metric 2: Oil & Fluid Health */}
        <div 
          onClick={() => { setActiveTab('preventative'); setMaintenanceStatusFilter('all'); }}
          className={`bento-card p-3.5 cursor-pointer transition-all ${
            activeTab === 'preventative' 
              ? 'ring-2 ring-[#141412] dark:ring-white' 
              : 'hover:border-[#1A1A1A]/30 dark:hover:border-white/30'
          }`}
        >
          <div className="flex items-center justify-between text-[#71716A] dark:text-[#8E8E86]">
            <span className="text-xs font-medium">
              {isRTL ? 'تغيير الزيوت والصيانة' : 'Routine Service Due'}
            </span>
            <Gauge className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white font-mono">
              {overdueMaintenanceCount}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {isRTL ? 'سيارات مستحقة' : 'due'}
            </span>
          </div>
        </div>

        {/* Metric 3: Battery & Electrical */}
        <div 
          onClick={() => { setActiveTab('systems'); }}
          className={`bento-card p-3.5 cursor-pointer transition-all ${
            activeTab === 'systems' 
              ? 'ring-2 ring-[#141412] dark:ring-white' 
              : 'hover:border-[#1A1A1A]/30 dark:hover:border-white/30'
          }`}
        >
          <div className="flex items-center justify-between text-[#71716A] dark:text-[#8E8E86]">
            <span className="text-xs font-medium">
              {isRTL ? 'فحص بطاريات السيارات' : 'Battery Health'}
            </span>
            <Battery className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white font-mono">
              {vehicles.filter((v) => (v.sensorData?.batteryVoltage || 12.6) < 12.3).length}
            </span>
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
              {isRTL ? 'ضعيفة' : 'low'}
            </span>
          </div>
        </div>

        {/* Metric 4: Work Orders & Active Repairs */}
        <div 
          onClick={() => { setActiveTab('work_orders'); }}
          className={`bento-card p-3.5 cursor-pointer transition-all ${
            activeTab === 'work_orders' 
              ? 'ring-2 ring-[#141412] dark:ring-white' 
              : 'hover:border-[#1A1A1A]/30 dark:hover:border-white/30'
          }`}
        >
          <div className="flex items-center justify-between text-[#71716A] dark:text-[#8E8E86]">
            <span className="text-xs font-medium">
              {isRTL ? 'سيارات بالورشة حالياً' : 'Vehicles in Workshop'}
            </span>
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white font-mono">
              {activeWorkOrdersCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {isRTL ? 'طلبات نشطة' : 'active'}
            </span>
          </div>
        </div>
      </div>

      {/* Unified Navigation & Filter Toolbar */}
      <div className="bento-card p-3 sm:p-3.5 space-y-3">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {/* Tab 1: Active Faults */}
          <button
            type="button"
            onClick={() => setActiveTab('dtc')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'dtc'
                ? 'bg-[#141412] text-white dark:bg-white dark:text-[#141412]'
                : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{isRTL ? 'أعطال وتحذيرات السيارات' : 'Vehicle Fault Alerts'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === 'dtc'
                ? 'bg-white/20 text-white dark:bg-black/10 dark:text-[#141412]'
                : 'bg-[#E5E5E1] dark:bg-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
            }`}>
              {allActiveFaults.length}
            </span>
          </button>

          {/* Tab 2: Preventative Schedule */}
          <button
            type="button"
            onClick={() => setActiveTab('preventative')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'preventative'
                ? 'bg-[#141412] text-white dark:bg-white dark:text-[#141412]'
                : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isRTL ? 'تغيير الزيوت والصيانة' : 'Scheduled Service'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === 'preventative'
                ? 'bg-white/20 text-white dark:bg-black/10 dark:text-[#141412]'
                : 'bg-[#E5E5E1] dark:bg-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
            }`}>
              {allMaintenanceItems.length}
            </span>
          </button>

          {/* Tab 3: Work Orders */}
          <button
            type="button"
            onClick={() => setActiveTab('work_orders')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'work_orders'
                ? 'bg-[#141412] text-white dark:bg-white dark:text-[#141412]'
                : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isRTL ? 'طلبات الصيانة والورش' : 'Maintenance Orders'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeTab === 'work_orders'
                ? 'bg-white/20 text-white dark:bg-black/10 dark:text-[#141412]'
                : 'bg-[#E5E5E1] dark:bg-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
            }`}>
              {workOrders.length}
            </span>
          </button>

          {/* Tab 4: Vital Systems Health */}
          <button
            type="button"
            onClick={() => setActiveTab('systems')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'systems'
                ? 'bg-[#141412] text-white dark:bg-white dark:text-[#141412]'
                : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isRTL ? 'فحص الأجزاء الحيوية' : 'Vital Systems'}</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#71716A] absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'dtc'
                  ? (isRTL ? 'بحث برمز المشكلة (مثل P0301)، اسم السيارة، أو رقم اللوحة...' : 'Search fault code (e.g. P0301), vehicle, or plate...')
                  : activeTab === 'preventative'
                  ? (isRTL ? 'بحث بنوع الصيانة (زيت، فحمات، فلاتر)، أو السيارة...' : 'Search service type (oil, brake pads, filters) or vehicle...')
                  : (isRTL ? 'بحث برقم طلب الصيانة، مركز الصيانة، أو رقم اللوحة...' : 'Search maintenance ticket #, workshop, or vehicle plate...')
              }
              className="w-full ps-8 pe-4 py-1.5 text-xs rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white placeholder:text-[#71716A] focus:outline-hidden"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#71716A] hover:text-[#1A1A1A] dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tab-Specific Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {activeTab === 'dtc' && (
              <>
                {/* Severity Filter */}
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 font-medium rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
                >
                  <option value="all">{isRTL ? 'جميع الحالات' : 'All Severities'}</option>
                  <option value="critical">{isRTL ? 'حرج (إيقاف المركبة)' : 'Critical (Ground)'}</option>
                  <option value="high">{isRTL ? 'عالي (قبل التأجير)' : 'High'}</option>
                  <option value="medium">{isRTL ? 'متوسط (مجدول)' : 'Medium'}</option>
                  <option value="low">{isRTL ? 'بسيط' : 'Low'}</option>
                </select>

                {/* System Category Filter */}
                <select
                  value={systemFilter}
                  onChange={(e) => setSystemFilter(e.target.value)}
                  className="px-2.5 py-1.5 font-medium rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
                >
                  {systemOptions.map((sys) => (
                    <option key={sys.value} value={sys.value}>
                      {isRTL ? sys.labelAr : sys.labelEn}
                    </option>
                  ))}
                </select>
              </>
            )}

            {activeTab === 'preventative' && (
              <select
                value={maintenanceStatusFilter}
                onChange={(e) => setMaintenanceStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 font-medium rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
              >
                <option value="all">{isRTL ? 'جميع حالات الصيانة' : 'All Service Statuses'}</option>
                <option value="overdue">{isRTL ? 'متجاوزة للموعد' : 'Overdue'}</option>
                <option value="upcoming">{isRTL ? 'مستحقة قريباً' : 'Upcoming'}</option>
                <option value="recommended">{isRTL ? 'موصى بها' : 'Recommended'}</option>
                <option value="completed">{isRTL ? 'مكتملة' : 'Completed'}</option>
              </select>
            )}

            {/* Branch Filter (Always Available) */}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-2.5 py-1.5 font-medium rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
            >
              <option value="all">{isRTL ? 'جميع الفروع' : 'All Branches'}</option>
              {branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* Reset Filters */}
            {(searchQuery || severityFilter !== 'all' || systemFilter !== 'all' || branchFilter !== 'all' || maintenanceStatusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSeverityFilter('all');
                  setSystemFilter('all');
                  setBranchFilter('all');
                  setMaintenanceStatusFilter('all');
                }}
                className="px-2 py-1 text-rose-600 dark:text-rose-400 hover:underline font-semibold"
              >
                {isRTL ? 'إعادة ضبط' : 'Reset'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE DTC FAULT CODES (OBD-II LIVE SCANNER)                       */}
      {/* ========================================================================= */}
      {activeTab === 'dtc' && (
        <div className="space-y-4">
          {filteredFaults.length === 0 ? (
            <div className="bento-card p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">
                {isRTL ? 'لا توجد أعطال تطابق معايير البحث' : 'No diagnostic trouble codes found'}
              </h3>
              <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-1 max-w-md mx-auto">
                {isRTL 
                  ? 'جميع وحدات التحكم الإلكترونية للمركبات المحددة تعمل بكفاءة طبيعية دون تسجيل أي أعطال نشطة.' 
                  : 'All electronic control units for selected vehicles report nominal operational parameters.'}
              </p>
            </div>
          ) : (
            filteredFaults.map(({ fault, vehicleId, vehicleName, plateNumber, plateNumberAr, branch, branchAr, currentMileage, rentalStatus, sensorData }, index) => {
              const isCritical = fault.severity === 'critical' || fault.severity === 'high';
              const systemLabel = systemOptions.find((s) => s.value === fault.system);

              return (
                <div
                  key={`${fault.id}-${index}`}
                  className="bento-card p-5 transition-all hover:border-[#1A1A1A]/30 dark:hover:border-white/30 space-y-4"
                >
                  {/* Card Header: DTC Code Badge, System, Severity, and Rental Guidance */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* OBD-II DTC Code Badge */}
                      <span className={`text-sm font-mono font-bold px-2.5 py-1 rounded-md tracking-wider ${
                        isCritical 
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60' 
                          : 'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60'
                      }`}>
                        {fault.code}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-white">
                            {isRTL ? fault.titleAr : fault.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                          <span className="font-medium text-[#1A1A1A] dark:text-white">
                            {isRTL ? systemLabel?.labelAr : systemLabel?.labelEn}
                          </span>
                          <span>•</span>
                          <span>{isRTL ? 'رُصد أول مرة' : 'First seen'}: {fault.firstDetected}</span>
                          <span>•</span>
                          <span>{isRTL ? 'آخر تحديث' : 'Last seen'}: {fault.lastDetected}</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Guidance & Severity Badge */}
                    <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{isRTL ? 'يلزم إيقاف التأجير' : 'Ground Vehicle'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-semibold">
                          <Check className="w-3 h-3" />
                          <span>{isRTL ? 'صالح للتأجير' : 'Safe to Rent'}</span>
                        </span>
                      )}

                      <StatusBadge type="severity" status={fault.severity} size="sm" />
                      
                      {fault.isRecurring && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[#71716A] dark:text-[#8E8E86] font-medium">
                          <RefreshCw className="w-3 h-3" />
                          <span>{isRTL ? `تكرر ${fault.occurrences} مرات` : `${fault.occurrences}x`}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body: Plain Language Technical Explanation & Action Plan */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Diagnostic Explanation & What To Do */}
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                        {isRTL ? fault.descriptionAr : fault.description}
                      </p>

                      {/* Action Required: Clean accent line instead of heavy nested box */}
                      <div className="ps-3 border-s-2 border-amber-500 py-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-amber-700 dark:text-amber-400">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'الحل المقترح:' : 'Recommended Action:'}</span>
                        </div>
                        <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5 leading-relaxed">
                          {isRTL ? fault.recommendedActionAr : fault.recommendedAction}
                        </p>
                      </div>
                    </div>

                    {/* Sensor Snapshot at Time of Alert: Clean divider layout instead of gray card */}
                    <div className="ps-0 md:ps-4 border-t md:border-t-0 md:border-s border-[#E5E5E1] dark:border-[#2C2C27] flex flex-col justify-center space-y-2">
                      <span className="font-semibold text-[11px] text-[#71716A] dark:text-[#8E8E86] block">
                        {isRTL ? 'قراءات السيارة وقت التنبيه' : 'Vehicle Telemetry at Alert'}
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[#71716A] block text-[10px]">{isRTL ? 'حرارة المحرك' : 'Coolant'}</span>
                          <strong className={`font-mono ${(sensorData?.coolantTemp || 90) > 96 ? 'text-rose-600 dark:text-rose-400' : 'text-[#1A1A1A] dark:text-white'}`}>
                            {sensorData?.coolantTemp || 92}°C
                          </strong>
                        </div>
                        <div>
                          <span className="text-[#71716A] block text-[10px]">{isRTL ? 'جهد البطارية' : 'Battery'}</span>
                          <strong className={`font-mono ${(sensorData?.batteryVoltage || 12.6) < 12.3 ? 'text-amber-600 dark:text-amber-400' : 'text-[#1A1A1A] dark:text-white'}`}>
                            {sensorData?.batteryVoltage || 12.6}V
                          </strong>
                        </div>
                        <div>
                          <span className="text-[#71716A] block text-[10px]">{isRTL ? 'دوران المحرك' : 'Engine RPM'}</span>
                          <strong className="font-mono text-[#1A1A1A] dark:text-white">{sensorData?.rpm || 850} RPM</strong>
                        </div>
                        <div>
                          <span className="text-[#71716A] block text-[10px]">{isRTL ? 'حمولة المحرك' : 'Engine Load'}</span>
                          <strong className="font-mono text-[#1A1A1A] dark:text-white">{sensorData?.engineLoad || 28}%</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Vehicle Info & Direct Action Controls */}
                  <div className="pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Vehicle Metadata */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#71716A] dark:text-[#8E8E86]">
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-white" />
                        <strong className="text-[#1A1A1A] dark:text-white">{vehicleName}</strong>
                      </div>
                      <span className="font-mono font-bold bg-[#E5E5E1] dark:bg-[#2C2C27] px-2 py-0.5 rounded text-[#1A1A1A] dark:text-white">
                        {isRTL ? (plateNumberAr || plateNumber) : plateNumber}
                      </span>
                      <span>•</span>
                      <span>{isRTL ? (branchAr || branch) : branch}</span>
                      <span>•</span>
                      <span>{currentMileage?.toLocaleString()} km</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCreateOrderFromDtc(fault, vehicleName, plateNumber, vehicleId, branch)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-[#141412] text-white dark:bg-white dark:text-[#141412] hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'طلب صيانة بالورشة' : 'Request Service'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => viewVehicleDetail(vehicleId)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white hover:bg-[#EAEAE5] dark:hover:bg-[#2E2E2A] transition-colors border border-[#E5E5E1] dark:border-[#2C2C27]"
                      >
                        <span>{t.viewVehicle}</span>
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PREVENTATIVE MAINTENANCE SCHEDULE & INTERVALS                     */}
      {/* ========================================================================= */}
      {activeTab === 'preventative' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaintenance.map(({ item, vehicleId, vehicleName, plateNumber, plateNumberAr, branch, branchAr, currentMileage, nextMaintenanceKm, kmRemaining }, index) => {
              const isOverdue = item.status === 'overdue' || kmRemaining < 0;
              const isSoon = kmRemaining >= 0 && kmRemaining <= 2000;
              
              return (
                <div
                  key={`${item.id}-${index}`}
                  className="bento-card p-5 space-y-3.5 transition-all hover:border-[#1A1A1A]/30 dark:hover:border-white/30"
                >
                  {/* Top Bar: Title, Status Badge, and Priority */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                        {isRTL ? item.titleAr : item.title}
                      </h4>
                      <p className="text-xs text-[#71716A] dark:text-[#8E8E86] mt-0.5">
                        {isRTL ? item.reasonAr : item.reason}
                      </p>
                    </div>

                    <StatusBadge type="maintenance" status={item.status} size="sm" />
                  </div>

                  {/* Mileage Countdown Progress Bar - Clean layout without nested card */}
                  <div className="space-y-2 pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27] text-xs">
                    <div className="flex items-center justify-between text-[#71716A] dark:text-[#8E8E86]">
                      <span>{isRTL ? 'العداد الحالي:' : 'Current Odometer:'} <strong className="text-[#1A1A1A] dark:text-white font-mono">{currentMileage?.toLocaleString()} كم</strong></span>
                      <span>{isRTL ? 'الموعد المحدد عند:' : 'Scheduled at:'} <strong className="text-[#1A1A1A] dark:text-white font-mono">{nextMaintenanceKm?.toLocaleString()} كم</strong></span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#E5E5E1] dark:bg-[#2C2C27] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isOverdue ? 'bg-rose-500' : isSoon ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(10, (currentMileage / nextMaintenanceKm) * 100))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <span className={`font-semibold ${isOverdue ? 'text-rose-600 dark:text-rose-400' : isSoon ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isOverdue 
                          ? (isRTL ? `تجاوز الموعد بـ ${Math.abs(kmRemaining).toLocaleString()} كم` : `Overdue by ${Math.abs(kmRemaining).toLocaleString()} km`)
                          : (isRTL ? `متبقي ${kmRemaining.toLocaleString()} كم على الموعد` : `${kmRemaining.toLocaleString()} km remaining`)}
                      </span>
                      <span className="text-[#71716A] font-mono text-[10px]">
                        {item.dueDateOrMileage}
                      </span>
                    </div>
                  </div>

                  {/* Target Vehicle & Quick Work Order Trigger */}
                  <div className="pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[#71716A] dark:text-[#8E8E86]">
                      <Car className="w-3.5 h-3.5" />
                      <strong className="text-[#1A1A1A] dark:text-white">{vehicleName}</strong>
                      <span className="font-mono">({isRTL ? (plateNumberAr || plateNumber) : plateNumber})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVehicleForOrder(vehicleId);
                          setOrderTitle(isRTL ? item.titleAr : item.title);
                          setOrderSystem('engine');
                          setOrderCost(item.estimatedCost ? String(item.estimatedCost) : '350');
                          setOrderNotes(isRTL ? item.recommendedActionAr : item.recommendedAction);
                          setIsWorkOrderModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg font-bold bg-[#141412] dark:bg-white text-white dark:text-[#141412] text-xs hover:opacity-90 transition-opacity"
                      >
                        {isRTL ? 'حجز موعد صيانة' : 'Book Service'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: WORK ORDERS & SERVICE TICKETS                                      */}
      {/* ========================================================================= */}
      {activeTab === 'work_orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white">
              {isRTL ? 'طلبات الصيانة ومتابعة الورش' : 'Active Fleet Maintenance Orders'}
            </h3>
            <span className="text-xs text-[#71716A] dark:text-[#8E8E86]">
              {workOrders.length} {isRTL ? 'طلب مسجل' : 'active orders'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workOrders.map((order) => {
              const statusColors = {
                draft: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
                dispatched: 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-900',
                in_progress: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900',
                completed: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
              };

              const statusLabels = {
                draft: isRTL ? 'مسودة' : 'Draft',
                dispatched: isRTL ? 'في انتظار البدء' : 'Pending Workshop',
                in_progress: isRTL ? 'قيد العمل بالورشة' : 'Under Repair',
                completed: isRTL ? 'تمت الصيانة بنجاح' : 'Completed'
              };

              return (
                <div key={order.id} className="bento-card p-4.5 space-y-3 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
                      <span className="font-mono text-xs font-semibold text-[#71716A] dark:text-[#8E8E86]">
                        {order.orderNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>

                    {/* Title & Service Type */}
                    <div className="mt-3">
                      <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white leading-snug">
                        {isRTL ? order.titleAr : order.title}
                      </h4>
                      {order.relatedDtc && (
                        <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-medium border border-rose-200/80 dark:border-rose-900/60">
                          {isRTL ? `رمز العطل: ${order.relatedDtc}` : `Code: ${order.relatedDtc}`}
                        </span>
                      )}
                    </div>

                    {/* Target Vehicle & Workshop */}
                    <div className="mt-3 space-y-1.5 text-xs text-[#71716A] dark:text-[#8E8E86]">
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" />
                        <strong className="text-[#1A1A1A] dark:text-white">{order.vehicleName}</strong>
                        <span className="font-mono font-bold">({order.plateNumber})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{isRTL ? order.workshopAr : order.workshop}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'التاريخ المتوقع:' : 'Expected Date:'} {order.scheduledDate}</span>
                      </div>
                    </div>

                    {/* Technician Notes */}
                    {order.technicianNotes && (
                      <div className="mt-2.5 p-2 rounded-lg bg-[#F5F5F0]/70 dark:bg-[#242420]/70 text-[11px] text-[#71716A] dark:text-[#8E8E86] leading-relaxed">
                        {isRTL ? order.technicianNotesAr : order.technicianNotes}
                      </div>
                    )}
                  </div>

                  {/* Cost & Status Advance Control */}
                  <div className="pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#71716A] block">{isRTL ? 'التكلفة التقديرية' : 'Est. Cost'}</span>
                      <strong className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {order.estimatedCost} {isRTL ? 'ر.س' : 'SAR'}
                      </strong>
                    </div>

                    {order.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextStatus: Record<string, WorkOrder['status']> = {
                            draft: 'dispatched',
                            dispatched: 'in_progress',
                            in_progress: 'completed',
                            completed: 'completed',
                          };
                          if (order.status === 'in_progress') {
                            const vehicle = vehicles.find(v=>v.id===order.vehicleId);
                            if (vehicle) {
                              const stamp=new Date().toISOString();
                              updateVehicle({...vehicle,status:vehicle.status==='maintenance'&&!workOrders.some(w=>w.id!==order.id&&w.vehicleId===vehicle.id&&w.status!=='completed')?'inspection':vehicle.status,maintenanceList:vehicle.maintenanceList.map(m=>m.id===order.id?{...m,status:'completed',completedDate:stamp,serviceProvider:order.workshop}:m),timeline:[{id:crypto.randomUUID(),timestamp:stamp,date:stamp.slice(0,10),time:stamp.slice(11,16),type:'maintenance',title:'Service completed: '+order.title,titleAr:'اكتمال الصيانة: '+order.titleAr,description:'Recorded by operator; diagnostic faults require a confirming inspection.',descriptionAr:'سجلها المشغل؛ يلزم فحص للتأكد من زوال الأعطال.'},...vehicle.timeline]});
                            }
                          }
                          setWorkOrders(
                            workOrders.map((w) => w.id === order.id ? { ...w, status: nextStatus[w.status] } : w)
                          );
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#E5E5E1] dark:bg-[#2C2C27] hover:bg-[#D4D4CE] dark:hover:bg-[#383832] font-semibold text-[#1A1A1A] dark:text-white transition-colors"
                      >
                        {order.status === 'dispatched' 
                          ? (isRTL ? 'بدء الإصلاح ←' : 'Start Repair →') 
                          : order.status === 'in_progress' 
                          ? (isRTL ? 'إنهاء الصيانة ✓' : 'Finish Service ✓') 
                          : (isRTL ? 'إرسال للورشة' : 'Dispatch')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VITAL SYSTEMS HEALTH MONITOR                                       */}
      {/* ========================================================================= */}
      {activeTab === 'systems' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* System 1: Battery & Electrical Monitor */}
            <div className="bento-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#EA580C] dark:text-[#FB923C]">
                    <Battery className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                      {isRTL ? 'فحص بطاريات السيارات (12V)' : '12V Battery Voltage Monitor'}
                    </h4>
                    <p className="text-xs text-[#71716A] dark:text-[#8E8E86]">
                      {isRTL ? 'متابعة شحن البطارية لتفادي عدم تشغيل السيارة مع العميل (المثالي 12.4V فأعلى)' : 'Live voltage tracking to prevent battery drain incidents (optimal ≥ 12.4V)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Voltage Distribution Table */}
              <div className="divide-y divide-[#E5E5E1] dark:divide-[#2C2C27] text-xs">
                {vehicles.map((v) => {
                  const volts = v.sensorData?.batteryVoltage || 12.6;
                  const isLow = volts < 12.3;
                  const isCriticalVolts = volts < 12.0;

                  return (
                    <div key={v.id} className="flex items-center justify-between py-2.5 px-1 hover:bg-[#F5F5F0]/40 dark:hover:bg-[#242420]/40 rounded-sm transition-colors">
                      <div className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-[#71716A]" />
                        <strong className="text-[#1A1A1A] dark:text-white">{v.make} {v.model}</strong>
                        <span className="font-mono text-[#71716A]">({v.plateNumber})</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-bold ${
                          isCriticalVolts 
                            ? 'text-rose-600 dark:text-rose-400' 
                            : isLow 
                            ? 'text-amber-600 dark:text-amber-400' 
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {volts.toFixed(1)}V
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          isCriticalVolts 
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300' 
                            : isLow 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300' 
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        }`}>
                          {isCriticalVolts ? (isRTL ? 'ضعيفة جداً' : 'Critically Low') : isLow ? (isRTL ? 'تحتاج فحص' : 'Low Charge') : (isRTL ? 'ممتازة' : 'Good')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* System 2: Engine Coolant & Thermal Health */}
            <div className="bento-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-[#0284C7] dark:text-[#38BDF8]">
                    <Thermometer className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                      {isRTL ? 'حرارة المحرك وسوائل التبريد' : 'Engine Temperature & Cooling System'}
                    </h4>
                    <p className="text-xs text-[#71716A] dark:text-[#8E8E86]">
                      {isRTL ? 'التأكد من عدم سخونة المحرك (المعدل الطبيعي بين 85°C و 95°C)' : 'Cooling loop tracking to avoid overheating (nominal range: 85°C - 95°C)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coolant Table */}
              <div className="divide-y divide-[#E5E5E1] dark:divide-[#2C2C27] text-xs">
                {vehicles.map((v) => {
                  const temp = v.sensorData?.coolantTemp || 90;
                  const isHot = temp > 96;

                  return (
                    <div key={v.id} className="flex items-center justify-between py-2.5 px-1 hover:bg-[#F5F5F0]/40 dark:hover:bg-[#242420]/40 rounded-sm transition-colors">
                      <div className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-[#71716A]" />
                        <strong className="text-[#1A1A1A] dark:text-white">{v.make} {v.model}</strong>
                        <span className="font-mono text-[#71716A]">({v.plateNumber})</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-bold ${isHot ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {temp}°C
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          isHot 
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300' 
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        }`}>
                          {isHot ? (isRTL ? 'حرارة مرتفعة' : 'High Temp') : (isRTL ? 'طبيعية ومستقرة' : 'Normal')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW WORK ORDER / MAINTENANCE TICKET                         */}
      {/* ========================================================================= */}
      {isWorkOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bento-card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">
                  {isRTL ? 'تسجيل طلب صيانة لمركبة' : 'New Vehicle Maintenance Order'}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsWorkOrderModalOpen(false)}
                className="p-1 rounded-md text-[#71716A] hover:text-[#1A1A1A] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkOrder} className="space-y-4 text-xs">
              {/* Vehicle Picker */}
              <div>
                <label className="font-semibold text-[#1A1A1A] dark:text-white block mb-1">
                  {isRTL ? 'السيارة:' : 'Vehicle:'}
                </label>
                <select
                  value={selectedVehicleForOrder}
                  onChange={(e) => setSelectedVehicleForOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white font-medium"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.year}) - {v.plateNumber} ({isRTL ? v.branchAr : v.branch})
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Title */}
              <div>
                <label className="font-semibold text-[#1A1A1A] dark:text-white block mb-1">
                  {isRTL ? 'عنوان أو سبب الصيانة:' : 'Service Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  placeholder={isRTL ? 'مثال: تغيير زيت المحرك وفحص الفرامل' : 'e.g. Engine Oil Change & Brake Inspection'}
                  className="w-full px-3 py-2 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white font-medium"
                />
              </div>

              {/* System & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1A1A1A] dark:text-white block mb-1">
                    {isRTL ? 'جزء السيارة المعني:' : 'Vehicle System:'}
                  </label>
                  <select
                    value={orderSystem}
                    onChange={(e) => setOrderSystem(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white font-medium"
                  >
                    {systemOptions.filter((s) => s.value !== 'all').map((s) => (
                      <option key={s.value} value={s.value}>
                        {isRTL ? s.labelAr : s.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] dark:text-white block mb-1">
                    {isRTL ? 'درجة الأهمية:' : 'Priority:'}
                  </label>
                  <select
                    value={orderPriority}
                    onChange={(e) => setOrderPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white font-medium"
                  >
                    <option value="critical">{isRTL ? 'عاجل جداً (إيقاف السيارة)' : 'Critical (Ground Vehicle)'}</option>
                    <option value="high">{isRTL ? 'عالي (قبل التأجير القادم)' : 'High (Before Next Rental)'}</option>
                    <option value="medium">{isRTL ? 'متوسط (صيانة دورية)' : 'Medium'}</option>
                    <option value="low">{isRTL ? 'بسيط (فحص روتيني)' : 'Low / Routine'}</option>
                  </select>
                </div>
              </div>

              {/* Workshop & Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1A1A1A] dark:text-white block mb-1">
                    {isRTL ? 'الورشة أو مركز الصيانة:' : 'Workshop:'}
                  </label>
                  <select
                    value={orderWorkshop}
                    onChange={(e) => setOrderWorkshop(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white font-medium"
                  >
                    <option value="مركز صيانة الأسطول الداخلي">{isRTL ? 'مركز صيانة الأسطول الداخلي' : 'Internal Fleet Workshop'}</option>
                    <option value="ورشة الصيانة السريعة">{isRTL ? 'ورشة الصيانة السريعة' : 'Quick Service Workshop'}</option>
                    <option value="مركز الصيانة الرئيسي">{isRTL ? 'مركز الصيانة الرئيسي' : 'Central Maintenance Hub'}</option>
                    <option value="مركز صيانة خارجي">{isRTL ? 'مركز صيانة خارجي' : 'External Service Center'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1A1A1A] dark:text-white block mb-1">
                    {isRTL ? 'التكلفة المقدرة (ر.س):' : 'Estimated Cost (SAR):'}
                  </label>
                  <input
                    type="number"
                    value={orderCost}
                    onChange={(e) => setOrderCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white font-mono font-medium"
                  />
                </div>
              </div>

              {/* Technician Notes */}
              <div>
                <label className="font-semibold text-[#1A1A1A] dark:text-white block mb-1">
                  {isRTL ? 'ملاحظات أو قطع الغيار المطلوبة:' : 'Notes or Required Parts:'}
                </label>
                <textarea
                  rows={3}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={isRTL ? 'أدخل أي تفاصيل لفني الورشة أو قطع غيار مطلوبة...' : 'Specify notes or required spare parts...'}
                  className="w-full px-3 py-2 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white font-medium"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsWorkOrderModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white hover:bg-[#EAEAE5] dark:hover:bg-[#2E2E2A]"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold bg-[#141412] dark:bg-white text-white dark:text-[#141412] hover:opacity-90 transition-opacity"
                >
                  {isRTL ? 'تأكيد وحفظ الطلب' : 'Confirm & Save Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
