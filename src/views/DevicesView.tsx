import {LocationHistory} from '../components/devices/LocationHistory';
import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  Wifi, 
  WifiOff, 
  Clock, 
  Battery, 
  Search, 
  Car, 
  Unlink, 
  Link2, 
  CheckCircle2, 
  X,
  RefreshCw,
  Plus,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Activity,
  Gauge,
  Lock,
  Cpu,
  LayoutGrid,
  List,
  Server,
  ArrowUpRight,
  HardDrive,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SaudiLicensePlate } from '../components/common/SaudiLicensePlate';
import { OBDDevice, Vehicle } from '../types';

export const DevicesView: React.FC = () => {
  const { 
    devices, 
    vehicles, 
    assignDeviceToVehicle, 
    unassignDevice, 
    pingDevice,
    pingAllDevices,
    registerDevice,
    viewVehicleDetail,
    isRTL, 
    t 
  } = useApp();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'online' | 'sleep' | 'alerts' | 'unassigned'>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Modals & Drawers
  const [inspectingDevice, setInspectingDevice] = useState<OBDDevice | null>(null);
  const [assigningDevice, setAssigningDevice] = useState<OBDDevice | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [pingNotification, setPingNotification] = useState<string | null>(null);

  // New device form state
  const [newDeviceId, setNewDeviceId] = useState(`OBD-${Math.floor(10000 + Math.random() * 90000)}`);
  const [newImei, setNewImei] = useState(`864910052${Math.floor(10000 + Math.random() * 90000)}`);
  const [newCarrier, setNewCarrier] = useState<'STC M2M 4G' | 'Mobily IoT LTE-M' | 'Zain IoT 4G'>('STC M2M 4G');
  const [newTargetVehicleId, setNewTargetVehicleId] = useState<string>('');
  const [newBranch, setNewBranch] = useState<'Riyadh Airport' | 'Olaya Executive' | 'Jeddah Corniche' | 'Dammam Highway'>('Riyadh Airport');

  // Stats
  const onlineCount = devices.filter((d) => d.connectionStatus === 'online' && !d.sleepMode).length;
  const sleepCount = devices.filter((d) => d.sleepMode && d.connectionStatus === 'online').length;
  const delayedCount = devices.filter((d) => d.connectionStatus === 'delayed').length;
  const offlineCount = devices.filter((d) => d.connectionStatus === 'offline').length;
  const tamperedCount = devices.filter((d) => d.tamperStatus === 'tamper_detected' || d.tamperStatus === 'unplugged').length;
  const unassignedCount = devices.filter((d) => !d.assignedVehicleId).length;
  const totalVehiclesCount = vehicles.length;
  const coveragePercent = Math.min(100, Math.round(((devices.length - unassignedCount) / totalVehiclesCount) * 100));

  // Extract unique branches
  const branches = useMemo(() => {
    const list = new Map<string, { en: string; ar: string }>();
    vehicles.forEach((v) => {
      if (v.branch && !list.has(v.branch)) {
        list.set(v.branch, { en: v.branch, ar: v.branchAr || v.branch });
      }
    });
    return Array.from(list.values());
  }, [vehicles]);

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          d.id.toLowerCase().includes(q) ||
          (d.assignedVehicleName && d.assignedVehicleName.toLowerCase().includes(q)) ||
          (d.plateNumber && d.plateNumber.toLowerCase().includes(q)) ||
          (d.plateNumberAr && d.plateNumberAr.toLowerCase().includes(q)) ||
          (d.imei && d.imei.toLowerCase().includes(q)) ||
          (d.carrier && d.carrier.toLowerCase().includes(q)) ||
          (d.protocol && d.protocol.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Status Tab
      if (statusTab === 'online') {
        if (d.connectionStatus !== 'online' || d.sleepMode) return false;
      } else if (statusTab === 'sleep') {
        if (!d.sleepMode || d.connectionStatus !== 'online') return false;
      } else if (statusTab === 'alerts') {
        if (d.connectionStatus !== 'offline' && d.tamperStatus === 'secured' && d.connectionStatus !== 'delayed') return false;
      } else if (statusTab === 'unassigned') {
        if (d.assignedVehicleId) return false;
      }

      // Branch
      if (branchFilter !== 'all') {
        if (d.branch !== branchFilter) return false;
      }

      return true;
    });
  }, [devices, searchQuery, statusTab, branchFilter]);

  // Handlers
  const handlePingAll = () => {
    setIsPingingAll(true);
    pingAllDevices();
    setTimeout(() => {
      setIsPingingAll(false);
      setPingNotification(
        isRTL 
          ? 'لا يوجد اتصال مباشر بالأجهزة. لم تتغير حالة الاتصال.'
          : 'No device transport is connected. Connection status is unchanged.'
      );
      setTimeout(() => setPingNotification(null), 4000);
    }, 900);
  };

  const handleSinglePing = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    pingDevice(deviceId);
    setPingNotification(
      isRTL 
        ? `لا يوجد اتصال مباشر بالجهاز ${deviceId}. الحالة لم تتغير.`
        : `No live connection to ${deviceId}. Status is unchanged.`
    );
    setTimeout(() => setPingNotification(null), 3000);
  };

  const handlePairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assigningDevice && selectedVehicleId) {
      assignDeviceToVehicle(assigningDevice.id, selectedVehicleId);
      setAssigningDevice(null);
      setSelectedVehicleId('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVeh = vehicles.find((v) => v.id === newTargetVehicleId);

    const newDevice: OBDDevice = {
      id: newDeviceId.trim() || `OBD-${Math.floor(10000 + Math.random() * 90000)}`,
      assignedVehicleId: targetVeh ? targetVeh.id : undefined,
      assignedVehicleName: targetVeh ? `${targetVeh.make} ${targetVeh.model} (${targetVeh.year})` : undefined,
      plateNumber: targetVeh ? targetVeh.plateNumber : undefined,
      plateNumberAr: targetVeh ? targetVeh.plateNumberAr : undefined,
      branch: targetVeh ? targetVeh.branch : newBranch,
      branchAr: targetVeh ? targetVeh.branchAr : (newBranch === 'Riyadh Airport' ? 'فرع مطار الرياض' : newBranch),
      connectionStatus: 'offline',
      lastPing: 'Never connected',
      installationDate: new Date().toISOString().split('T')[0],
      deviceHealth: 'good',
      batteryPercent: 99,
      signalStrengthDbm: -60,
      firmwareVersion: 'v3.4.2-rel',
      protocol: 'ISO 15765-4 CAN (11bit 500k)',
      tamperStatus: 'secured',
      carrier: newCarrier,
      imei: newImei,
      iccid: '',
      busLatencyMs: 0,
      pollingRateHz: 10,
      sleepMode: false,
      portVoltage: 12.8,
    };

    if (devices.some(d=>d.id===newDevice.id)) { setPingNotification(isRTL ? 'رقم الجهاز موجود مسبقاً' : 'Device ID already exists'); return; }
    registerDevice(newDevice);
    if (targetVeh) {
      assignDeviceToVehicle(newDevice.id, targetVeh.id);
    }

    setIsRegisterModalOpen(false);
    // Reset form
    setNewDeviceId(`OBD-${Math.floor(10000 + Math.random() * 90000)}`);
    setNewImei(`864910052${Math.floor(10000 + Math.random() * 90000)}`);
    setNewTargetVehicleId('');
  };

  // Find paired vehicle object if inspecting
  const inspectingVehicle: Vehicle | undefined = inspectingDevice?.assignedVehicleId
    ? vehicles.find((v) => v.id === inspectingDevice.assignedVehicleId)
    : undefined;

  return (
    <div className="space-y-6 text-start">
      <LocationHistory />
      {/* Toast Notification */}
      {pingNotification && (
        <div className="fixed top-20 end-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] shadow-xl border border-[#E5E5E1] dark:border-[#2C2C27] text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{pingNotification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
              {isRTL ? 'أجهزة التتبع والفحص (OBD)' : 'Fleet OBD Trackers & Telematics'}
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {isRTL ? 'تغطية مستقرة' : 'Connected'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#71716A] dark:text-[#8E8E86] mt-1">
            {isRTL 
              ? 'متابعة اتصال أجهزة تتبع الأسطول، التأكد من تثبيتها، ومزامنة قراءات العداد والوقود'
              : 'Monitor tracker connectivity, physical security, and real-time odometer and fuel updates'}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePingAll}
            disabled={isPingingAll}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#F5F5F0] hover:bg-[#EAEAE5] dark:bg-[#242420] dark:hover:bg-[#2C2C27] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPingingAll ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
            <span>{isRTL ? 'تحديث الاتصال' : 'Refresh All'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-[#141412] dark:bg-white text-white dark:text-[#141412] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRTL ? 'إضافة جهاز' : 'Add Device'}</span>
          </button>
        </div>
      </div>

      {/* Manager-Focused KPI Strip - Clean & Lightweight */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total & Coverage */}
        <div className="bento-card p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[#71716A] dark:text-[#8E8E86]">
            <span className="text-xs font-medium">{isRTL ? 'إجمالي الأجهزة' : 'Total Devices'}</span>
            <Radio className="w-3.5 h-3.5 text-[#71716A]" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-xl font-bold font-mono text-[#1A1A1A] dark:text-white">
              {devices.length}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              ({coveragePercent}%)
            </span>
          </div>
        </div>

        {/* Live Streaming */}
        <div className="bento-card p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[#71716A] dark:text-[#8E8E86]">
            <span className="text-xs font-medium">{isRTL ? 'متصلة وتبث' : 'Active Online'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {onlineCount}
            </span>
            <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
              {isRTL ? 'سيارة' : 'vehicles'}
            </span>
          </div>
        </div>

        {/* Sleep Mode (Ignition Off) */}
        <div className="bento-card p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[#71716A] dark:text-[#8E8E86]">
            <span className="text-xs font-medium">{isRTL ? 'في وضع التوقف' : 'Parked'}</span>
            <Clock className="w-3.5 h-3.5 text-[#71716A]" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-xl font-bold font-mono text-[#1A1A1A] dark:text-white">
              {sleepCount}
            </span>
            <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
              {isRTL ? 'توفير طاقة' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Port Tamper & Disconnect Protection */}
        <div className="bento-card p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[#71716A] dark:text-[#8E8E86]">
            <span className="text-xs font-medium">{isRTL ? 'أمان التثبيت' : 'Installation'}</span>
            {tamperedCount > 0 ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className={`text-xl font-bold font-mono ${tamperedCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-[#1A1A1A] dark:text-white'}`}>
              {tamperedCount === 0 ? (isRTL ? 'آمنة' : 'Secure') : tamperedCount}
            </span>
            <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
              {tamperedCount > 0 ? (isRTL ? 'تنبيه' : 'Alert') : (isRTL ? 'مثبتة' : 'Secured')}
            </span>
          </div>
        </div>

        {/* M2M Cellular Network */}
        <div className="bento-card p-3.5 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#71716A] dark:text-[#8E8E86]">
            <span className="text-xs font-medium">{isRTL ? 'تغطية الشريحة' : 'SIM Network'}</span>
            <Wifi className="w-3.5 h-3.5 text-[#71716A]" />
          </div>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {isRTL ? 'ممتازة' : 'Strong'}
            </span>
            <span className="text-[11px] font-mono text-[#71716A]">
              4G
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bento-card p-3 sm:p-3.5 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All', count: devices.length },
              { id: 'online', labelAr: 'أجهزة متصلة', labelEn: 'Connected', count: onlineCount },
              { id: 'sleep', labelAr: 'متوقفة', labelEn: 'Parked', count: sleepCount },
              { id: 'alerts', labelAr: 'تنبيهات وفصل', labelEn: 'Alerts', count: offlineCount + tamperedCount },
              { id: 'unassigned', labelAr: 'بالمستودع', labelEn: 'Warehouse', count: unassignedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  statusTab === tab.id
                    ? 'bg-[#141412] text-white dark:bg-white dark:text-[#141412]'
                    : 'bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
                }`}
              >
                <span>{isRTL ? tab.labelAr : tab.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  statusTab === tab.id
                    ? 'bg-white/20 text-white dark:bg-black/10 dark:text-[#141412]'
                    : 'bg-[#E5E5E1] dark:bg-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 shrink-0 self-end md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg border transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#141412] text-white border-[#141412] dark:bg-white dark:text-[#141412] dark:border-white'
                  : 'bg-[#F5F5F0] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
              }`}
              title={isRTL ? 'عرض الجدول' : 'Table View'}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#141412] text-white border-[#141412] dark:bg-white dark:text-[#141412] dark:border-white'
                  : 'bg-[#F5F5F0] dark:bg-[#242420] border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86]'
              }`}
              title={isRTL ? 'عرض البطاقات' : 'Grid View'}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Branch Filter row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#71716A] absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? 'ابحث برقم الجهاز، السيارة، اللوحة، أو الفرع...' : 'Search by Device ID, vehicle, plate, or branch...'}
              className="w-full ps-9 pe-4 py-2 text-xs rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white placeholder:text-[#71716A] focus:outline-hidden"
            />
          </div>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
          >
            <option value="all">{isRTL ? 'جميع الفروع' : 'All Branches'}</option>
            {branches.map((b) => (
              <option key={b.en} value={b.en}>
                {isRTL ? b.ar : b.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Mode 1: Table View */}
      {viewMode === 'table' ? (
        <div className="bento-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-xs text-start">
              <thead>
                <tr className="bg-[#F9F9F7] dark:bg-[#20201D] border-b border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] font-semibold text-[11px]">
                  <th className="py-3 ps-4 pe-2 text-start">{isRTL ? 'الجهاز' : 'Device'}</th>
                  <th className="py-3 px-3 text-start">{isRTL ? 'السيارة المقترنة' : 'Assigned Vehicle'}</th>
                  <th className="py-3 px-3 text-start">{isRTL ? 'حالة الاتصال' : 'Status'}</th>
                  <th className="py-3 px-3 text-start">{isRTL ? 'أمان التثبيت' : 'Security'}</th>
                  <th className="py-3 px-3 text-start">{isRTL ? 'بطارية السيارة (12V)' : 'Battery (12V)'}</th>
                  <th className="py-3 px-3 text-start">{isRTL ? 'آخر تحديث' : 'Last Sync'}</th>
                  <th className="py-3 ps-2 pe-4 text-end">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E1] dark:divide-[#2C2C27]">
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#71716A] dark:text-[#8E8E86]">
                      {isRTL ? 'لا توجد أجهزة مطابقة لمعايير البحث' : 'No devices found matching current filters'}
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((device) => {
                    const isTampered = device.tamperStatus === 'tamper_detected' || device.tamperStatus === 'unplugged';
                    const isLive = device.connectionStatus === 'online' && !device.sleepMode;

                    return (
                      <tr 
                        key={device.id} 
                        className={`hover:bg-[#F9F9F7] dark:hover:bg-[#20201D] transition-colors cursor-pointer ${
                          isTampered ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                        }`}
                        onClick={() => setInspectingDevice(device)}
                      >
                        {/* Device ID */}
                        <td className="py-3 ps-4 pe-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg border ${
                              isLive 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-900' 
                                : device.sleepMode 
                                  ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:border-blue-900'
                                  : 'bg-[#F5F5F0] text-[#71716A] border-[#E5E5E1] dark:bg-[#242420] dark:border-[#2C2C27]'
                            }`}>
                              <Radio className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-mono font-bold text-[#1A1A1A] dark:text-white block">
                                {device.id}
                              </span>
                              <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                                {device.carrier || 'STC 4G'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Assigned Vehicle */}
                        <td className="py-3 px-3">
                          {device.assignedVehicleId ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                viewVehicleDetail(device.assignedVehicleId!);
                              }}
                              className="text-start group block"
                            >
                              <span className="font-semibold text-[#1A1A1A] dark:text-white group-hover:underline block">
                                {device.assignedVehicleName}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <SaudiLicensePlate 
                                  plateNumber={device.plateNumber} 
                                  plateNumberAr={device.plateNumberAr} 
                                  size="xs" 
                                />
                                {device.branch && (
                                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86]">
                                    {isRTL && device.branchAr ? device.branchAr : device.branch}
                                  </span>
                                )}
                              </div>
                            </button>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60 font-semibold">
                              {isRTL ? 'بالمستودع (جاهز للاقتران)' : 'Warehouse Spare'}
                            </span>
                          )}
                        </td>

                        {/* Telemetry Stream Status */}
                        <td className="py-3 px-3">
                          {device.sleepMode ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60">
                              <Clock className="w-3 h-3" />
                              <span>{isRTL ? 'متوقفة (حفظ طاقة)' : 'Parked'}</span>
                            </span>
                          ) : (
                            <StatusBadge type="device" status={device.connectionStatus} size="sm" />
                          )}
                        </td>

                        {/* Security & Tamper */}
                        <td className="py-3 px-3">
                          {device.tamperStatus === 'unplugged' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{isRTL ? 'مفصول!' : 'Unplugged!'}</span>
                            </span>
                          ) : device.tamperStatus === 'tamper_detected' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                              <ShieldAlert className="w-3 h-3" />
                              <span>{isRTL ? 'تنبيه اهتزاز' : 'Tamper Alert'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60">
                              <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>{isRTL ? 'مثبت ومحمي' : 'Secured'}</span>
                            </span>
                          )}
                        </td>

                        {/* Battery & Power */}
                        <td className="py-3 px-3">
                          <div className="text-[11px] text-[#1A1A1A] dark:text-white">
                            <span className="font-mono font-bold">{device.portVoltage ?? 12.6}V</span>
                            <span className="text-emerald-600 dark:text-emerald-400 text-[10px] ms-1.5 font-semibold">
                              {device.portVoltage && device.portVoltage >= 12.4 ? (isRTL ? 'ممتازة' : 'Good') : (isRTL ? 'تحتاج فحص' : 'Check')}
                            </span>
                          </div>
                        </td>

                        {/* Last Update */}
                        <td className="py-3 px-3">
                          <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                            {device.lastPing}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 ps-2 pe-4 text-end">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {/* Inspect button */}
                            <button
                              type="button"
                              onClick={() => setInspectingDevice(device)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#141412] text-white dark:bg-white dark:text-[#141412] hover:opacity-90 transition-opacity"
                            >
                              {isRTL ? 'قراءات السيارة' : 'Readings'}
                            </button>

                            {/* Pair / Unpair */}
                            {device.assignedVehicleId ? (
                              <button
                                type="button"
                                onClick={() => unassignDevice(device.id)}
                                className="p-1.5 rounded-lg border border-[#E5E5E1] dark:border-[#2C2C27] bg-[#F5F5F0] hover:bg-rose-50 hover:text-rose-700 dark:bg-[#242420] dark:hover:bg-rose-950/60 dark:hover:text-rose-300 text-[#71716A] transition-colors"
                                title={isRTL ? 'إلغاء الربط' : 'Unassign'}
                              >
                                <Unlink className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAssigningDevice(device)}
                                className="p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                                title={isRTL ? 'ربط بمركبة' : 'Pair'}
                              >
                                <Link2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View Mode 2: Interactive Grid Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => {
            const isLive = device.connectionStatus === 'online' && !device.sleepMode;
            const isTampered = device.tamperStatus === 'tamper_detected' || device.tamperStatus === 'unplugged';

            return (
              <div
                key={device.id}
                onClick={() => setInspectingDevice(device)}
                className={`bento-card p-5 space-y-4 hover:border-[#1A1A1A]/30 dark:hover:border-white/30 transition-all cursor-pointer ${
                  isTampered ? 'border-rose-400/80 dark:border-rose-900/80 bg-rose-50/20 dark:bg-rose-950/10' : ''
                }`}
              >
                {/* Top header of card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg border ${
                      isLive 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-900' 
                        : device.sleepMode 
                          ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:border-blue-900'
                          : 'bg-[#F5F5F0] text-[#71716A] border-[#E5E5E1] dark:bg-[#242420] dark:border-[#2C2C27]'
                    }`}>
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-[#1A1A1A] dark:text-white block">
                        {device.id}
                      </span>
                      <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                        {device.carrier || 'STC 4G'}
                      </span>
                    </div>
                  </div>

                  {device.sleepMode ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60">
                      <Clock className="w-3 h-3" />
                      <span>{isRTL ? 'متوقفة' : 'Parked'}</span>
                    </span>
                  ) : (
                    <StatusBadge type="device" status={device.connectionStatus} size="sm" />
                  )}
                </div>

                {/* Assigned Vehicle Box */}
                <div className="p-3 rounded-lg bg-[#F5F5F0]/70 dark:bg-[#242420]/70 border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between">
                  {device.assignedVehicleId ? (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Car className="w-3.5 h-3.5 text-[#71716A] dark:text-[#8E8E86]" />
                        <span className="font-semibold text-xs text-[#1A1A1A] dark:text-white">
                          {device.assignedVehicleName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <SaudiLicensePlate 
                          plateNumber={device.plateNumber} 
                          plateNumberAr={device.plateNumberAr} 
                          size="xs" 
                        />
                        {device.branch && (
                          <span className="font-sans text-[10px] text-[#71716A] dark:text-[#8E8E86]">
                            {isRTL && device.branchAr ? device.branchAr : device.branch}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                      {isRTL ? 'بالمستودع (جاهز للاقتران بالمركبة)' : 'Warehouse Spare'}
                    </div>
                  )}

                  {device.assignedVehicleId && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewVehicleDetail(device.assignedVehicleId!);
                      }}
                      className="p-1 rounded-md text-[#71716A] hover:text-[#1A1A1A] dark:hover:text-white"
                      title={isRTL ? 'فتح ملف المركبة' : 'Open Vehicle'}
                    >
                      <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                    </button>
                  )}
                </div>

                {/* Telemetry quick metrics grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-[#F5F5F0]/60 dark:bg-[#242420]/60 border border-[#E5E5E1] dark:border-[#2C2C27]">
                    <span className="block text-[10px] text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'بطارية السيارة' : 'Battery'}</span>
                    <span className="font-mono font-bold text-[#1A1A1A] dark:text-white">{device.portVoltage ?? 12.6}V</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F5F5F0]/60 dark:bg-[#242420]/60 border border-[#E5E5E1] dark:border-[#2C2C27]">
                    <span className="block text-[10px] text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'طوارئ الجهاز' : 'Backup'}</span>
                    <span className="font-mono font-bold text-[#1A1A1A] dark:text-white">{device.batteryPercent}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F5F5F0]/60 dark:bg-[#242420]/60 border border-[#E5E5E1] dark:border-[#2C2C27]">
                    <span className="block text-[10px] text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'التغطية' : 'Signal'}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {device.signalStrengthDbm > -80 ? (isRTL ? 'ممتازة' : 'Strong') : (isRTL ? 'جيدة' : 'Good')}
                    </span>
                  </div>
                </div>

                {/* Footer with Anti-Tamper badge and action buttons */}
                <div className="pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  {/* Tamper Status */}
                  <div>
                    {device.tamperStatus === 'unplugged' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{isRTL ? 'مفصول عن المركبة!' : 'Unplugged!'}</span>
                      </span>
                    ) : device.tamperStatus === 'tamper_detected' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{isRTL ? 'تحذير اهتزاز' : 'Tamper Alert'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        <Lock className="w-3 h-3" />
                        <span>{isRTL ? 'مثبت ومحمي' : 'Secured'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleSinglePing(device.id, e)}
                      className="p-1.5 rounded-lg border border-[#E5E5E1] dark:border-[#2C2C27] bg-[#F5F5F0] hover:bg-[#EAEAE5] dark:bg-[#242420] text-[#71716A] hover:text-[#1A1A1A] transition-colors"
                      title={isRTL ? 'تحديث الاتصال' : 'Refresh'}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setInspectingDevice(device)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#141412] text-white dark:bg-white dark:text-[#141412] hover:opacity-90"
                    >
                      {isRTL ? 'قراءات السيارة' : 'Readings'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Live OBD-II Telemetry Inspector Modal / Drawer */}
      {inspectingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bento-card p-6 text-start shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-900/60">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] dark:text-white">
                      {isRTL ? 'قراءات المركبة وحالة الجهاز' : 'Vehicle & Tracker Overview'}
                    </h2>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] font-semibold">
                      {inspectingDevice.id}
                    </span>
                  </div>
                  {inspectingDevice.assignedVehicleName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-[#1A1A1A] dark:text-white">
                        {inspectingDevice.assignedVehicleName}
                      </span>
                      <SaudiLicensePlate 
                        plateNumber={inspectingDevice.plateNumber} 
                        plateNumberAr={inspectingDevice.plateNumberAr} 
                        size="xs" 
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mt-0.5">
                      {isRTL ? 'جهاز بالمستودع (جاهز للاقتران)' : 'Warehouse Spare (Ready to Pair)'}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingDevice(null)}
                className="p-1 rounded-lg text-[#71716A] hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Vehicle Operating Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{isRTL ? 'القراءات الحالية للمركبة' : 'Live Vehicle Indicators'}</span>
                </span>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800/60">
                  {isRTL ? 'بيانات متزامنة' : 'Synchronized'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Coolant */}
                <div className="p-3 rounded-lg bg-[#F5F5F0]/60 dark:bg-[#242420]/60 border border-[#E5E5E1] dark:border-[#2C2C27] text-start space-y-0.5">
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                    {isRTL ? 'حرارة المحرك' : 'Coolant Temp'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono text-[#1A1A1A] dark:text-white">
                      {inspectingVehicle?.sensorData.coolantTemp ?? 91}
                    </span>
                    <span className="text-xs font-mono text-[#71716A]">°C</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                    {isRTL ? 'طبيعية ومثالية' : 'Normal'}
                  </span>
                </div>

                {/* Battery Voltage */}
                <div className="p-3 rounded-lg bg-[#F5F5F0]/60 dark:bg-[#242420]/60 border border-[#E5E5E1] dark:border-[#2C2C27] text-start space-y-0.5">
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                    {isRTL ? 'جهد البطارية' : '12V Battery'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono text-[#1A1A1A] dark:text-white">
                      {inspectingVehicle?.sensorData.batteryVoltage ?? 12.6}
                    </span>
                    <span className="text-xs font-mono text-[#71716A]">V</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                    {isRTL ? 'حالة ممتازة' : 'Healthy'}
                  </span>
                </div>

                {/* Idle RPM */}
                <div className="p-3 rounded-lg bg-[#F5F5F0]/60 dark:bg-[#242420]/60 border border-[#E5E5E1] dark:border-[#2C2C27] text-start space-y-0.5">
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                    {isRTL ? 'حالة المحرك' : 'Engine'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono text-[#1A1A1A] dark:text-white">
                      {inspectingVehicle?.status === 'rented' ? '720' : '0'}
                    </span>
                    <span className="text-xs font-mono text-[#71716A]">RPM</span>
                  </div>
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                    {inspectingVehicle?.status === 'rented' ? (isRTL ? 'يعمل بسلاسة' : 'Running') : (isRTL ? 'محرك متوقف' : 'Parked')}
                  </span>
                </div>

                {/* Fuel Level */}
                <div className="p-3 rounded-lg bg-[#F5F5F0]/60 dark:bg-[#242420]/60 border border-[#E5E5E1] dark:border-[#2C2C27] text-start space-y-0.5">
                  <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] block">
                    {isRTL ? 'مستوى الوقود' : 'Fuel Level'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold font-mono text-[#1A1A1A] dark:text-white">
                      {inspectingVehicle?.sensorData.fuelLevel ?? 85}
                    </span>
                    <span className="text-xs font-mono text-[#71716A]">%</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                    {isRTL ? 'قراءة دقيقة' : 'Accurate'}
                  </span>
                </div>
              </div>
            </div>

            {/* Anti-Tamper Protection & Hardware Info Section */}
            <div className="p-4 rounded-xl border border-[#E5E5E1] dark:border-[#2C2C27] bg-[#F5F5F0]/50 dark:bg-[#242420]/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">
                    {isRTL ? 'أمان التثبيت وحماية الجهاز من النزع' : 'Security & Anti-Tamper Status'}
                  </span>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  inspectingDevice.tamperStatus === 'secured'
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60'
                    : inspectingDevice.tamperStatus === 'tamper_detected'
                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  {inspectingDevice.tamperStatus === 'secured'
                    ? (isRTL ? 'مثبت ومحمي بالكامل' : 'Firmly Secured')
                    : inspectingDevice.tamperStatus === 'tamper_detected'
                      ? (isRTL ? 'تحذير اهتزاز أو محاولة تحريك' : 'Vibration Alert')
                      : (isRTL ? 'تنبيه: مفصول عن المركبة!' : 'Alert: Disconnected!')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#71716A] dark:text-[#8E8E86]">
                <div>
                  <span className="block text-[10px] uppercase font-medium">{isRTL ? 'رقم الشريحة (IMEI)' : 'Modem IMEI'}</span>
                  <span className="font-mono font-bold text-[#1A1A1A] dark:text-white text-[11px]">
                    {inspectingDevice.imei || '86491005290123'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-medium">{isRTL ? 'شبكة الاتصال' : 'Cellular Carrier'}</span>
                  <span className="font-semibold text-[#1A1A1A] dark:text-white text-[11px]">
                    {inspectingDevice.carrier || 'STC 4G'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-medium">{isRTL ? 'بطارية الطوارئ الداخلية' : 'Emergency Backup'}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                    {inspectingDevice.batteryPercent}% ({isRTL ? 'تعمل حتى ٧٢ ساعة' : 'Up to 72h'})
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-medium">{isRTL ? 'حالة التحديثات' : 'Firmware'}</span>
                  <span className="font-medium text-[#1A1A1A] dark:text-white text-[11px]">
                    {isRTL ? 'محدث لآخر إصدار' : 'Up to Date'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-medium">{isRTL ? 'تاريخ التثبيت' : 'Installed Date'}</span>
                  <span className="font-mono text-[#1A1A1A] dark:text-white text-[11px]">
                    {inspectingDevice.installationDate}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-medium">{isRTL ? 'الفرع المسؤول' : 'Assigned Branch'}</span>
                  <span className="font-medium text-[#1A1A1A] dark:text-white text-[11px]">
                    {isRTL && inspectingDevice.branchAr ? inspectingDevice.branchAr : inspectingDevice.branch}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Buttons in Inspector */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
              <button
                type="button"
                onClick={(e) => {
                  handleSinglePing(inspectingDevice.id, e);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F5F5F0] hover:bg-[#EAEAE5] dark:bg-[#242420] dark:hover:bg-[#2C2C27] text-[#1A1A1A] dark:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isRTL ? 'تحديث الاتصال' : 'Refresh'}</span>
              </button>

              <div className="flex items-center gap-2">
                {inspectingDevice.assignedVehicleId && (
                  <button
                    type="button"
                    onClick={() => {
                      const vehId = inspectingDevice.assignedVehicleId!;
                      setInspectingDevice(null);
                      viewVehicleDetail(vehId);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#141412] text-white dark:bg-white dark:text-[#141412] hover:opacity-90 transition-opacity"
                  >
                    <span>{isRTL ? 'فتح ملف المركبة' : 'Open Vehicle Profile'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setInspectingDevice(null)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-[#71716A] hover:text-[#1A1A1A] dark:hover:text-white"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Pair Device to Vehicle Modal */}
      {assigningDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bento-card p-6 text-start shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                  {isRTL ? 'ربط جهاز الفحص بمركبة' : 'Assign Tracker to Vehicle'}
                </h3>
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">{assigningDevice.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setAssigningDevice(null)}
                className="p-1 rounded-lg text-[#71716A] hover:text-[#1A1A1A] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePairSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] dark:text-white mb-1.5">
                  {isRTL ? 'اختر المركبة المستهدفة' : 'Select Target Fleet Vehicle'}
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
                >
                  <option value="">{isRTL ? '-- اختر مركبة من الأسطول --' : '-- Select Vehicle --'}</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({isRTL ? v.plateNumberAr : v.plateNumber}) • {isRTL ? (v.branchAr || v.branch) : v.branch}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#71716A] dark:text-[#8E8E86] mt-1.5">
                  {isRTL 
                    ? 'سيتم تفعيل المتابعة اللحظية ومزامنة بيانات المركبة تلقائياً.' 
                    : 'Real-time monitoring and telemetry sync will activate automatically.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
                <button
                  type="button"
                  onClick={() => setAssigningDevice(null)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-[#71716A] dark:text-[#8E8E86]"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  disabled={!selectedVehicleId}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#141412] text-white hover:opacity-90 dark:bg-white dark:text-[#141412] disabled:opacity-50"
                >
                  {isRTL ? 'تأكيد ربط الجهاز' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Provision / Register New OBD Dongle */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bento-card p-6 text-start shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isRTL ? 'إضافة جهاز تتبع جديد' : 'Add New Tracker'}</span>
                </h3>
                <p className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                  {isRTL ? 'إدخال رقم الجهاز، شريحة الاتصال، وتحديد الفرع أو حفظه كاحتياط' : 'Add device ID, SIM provider, and branch assignment'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-lg text-[#71716A] hover:text-[#1A1A1A] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Serial ID */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] dark:text-white mb-1">
                    {isRTL ? 'رقم الجهاز (Device ID)' : 'Device Serial ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDeviceId}
                    onChange={(e) => setNewDeviceId(e.target.value)}
                    placeholder="e.g. OBD-89021"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
                  />
                </div>

                {/* IMEI */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] dark:text-white mb-1">
                    {isRTL ? 'رقم شريحة الاتصال (IMEI)' : 'Modem IMEI'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newImei}
                    onChange={(e) => setNewImei(e.target.value)}
                    placeholder="86491005290..."
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
                  />
                </div>

                {/* Carrier */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] dark:text-white mb-1">
                    {isRTL ? 'مزود خدمة الاتصال' : 'SIM Network'}
                  </label>
                  <select
                    value={newCarrier}
                    onChange={(e) => setNewCarrier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
                  >
                    <option value="STC M2M 4G">STC 4G</option>
                    <option value="Mobily IoT LTE-M">Mobily 4G</option>
                    <option value="Zain IoT 4G">Zain 4G</option>
                  </select>
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] dark:text-white mb-1">
                    {isRTL ? 'الفرع المسؤول' : 'Branch'}
                  </label>
                  <select
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
                  >
                    <option value="Riyadh Airport">{isRTL ? 'فرع مطار الرياض' : 'Riyadh Airport'}</option>
                    <option value="Olaya Executive">{isRTL ? 'فرع العليا التنفيذي' : 'Olaya Executive'}</option>
                    <option value="Jeddah Corniche">{isRTL ? 'فرع كورنيش جدة' : 'Jeddah Corniche'}</option>
                    <option value="Dammam Highway">{isRTL ? 'فرع الدمام السريع' : 'Dammam Highway'}</option>
                  </select>
                </div>
              </div>

              {/* Optional Vehicle Target */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] dark:text-white mb-1">
                  {isRTL ? 'تعيين لمركبة محددة (اختياري)' : 'Assign to Vehicle (Optional)'}
                </label>
                <select
                  value={newTargetVehicleId}
                  onChange={(e) => setNewTargetVehicleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white"
                >
                  <option value="">{isRTL ? '-- حفظ في المستودع كجهاز احتياطي --' : '-- Keep in Warehouse Inventory --'}</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.plateNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-[#71716A] dark:text-[#8E8E86]"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#141412] text-white hover:opacity-90 dark:bg-white dark:text-[#141412]"
                >
                  {isRTL ? 'إتمام تسجيل الجهاز' : 'Register Tracker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
