import {FleetRegistry} from '../components/common/FleetRegistry';
import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon, 
  SlidersHorizontal, 
  Download, 
  ChevronRight, 
  AlertTriangle, 
  Wifi, 
  ArrowUpDown,
  FileCheck2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SaudiLicensePlate } from '../components/common/SaudiLicensePlate';
import { VehicleDetailView } from './VehicleDetailView';
import { Vehicle } from '../types';

export const VehiclesView: React.FC = () => {
  const {
    vehicles,
    selectedVehicle,
    setSelectedVehicleId,
    viewVehicleDetail,
    setIsInspectionModalOpen,
    setIsReportModalOpen,
    isRTL,
    t,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState<'all' | 'healthy' | 'attention' | 'critical'>('all');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'online' | 'delayed' | 'offline'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'rented' | 'maintenance' | 'inspection'>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'health_asc' | 'health_desc' | 'mileage' | 'risk'>('health_asc');

  // Extract unique branches
  const branches = useMemo(() => {
    const map = new Map<string, { en: string; ar: string }>();
    vehicles.forEach((v) => {
      if (v.branch && !map.has(v.branch)) {
        map.set(v.branch, { en: v.branch, ar: v.branchAr || v.branch });
      }
    });
    return Array.from(map.values());
  }, [vehicles]);

  // Filter & Sort
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.plateNumber.toLowerCase().includes(q) ||
            v.plateNumberAr.includes(q) ||
            v.vin.toLowerCase().includes(q) ||
            v.branch.toLowerCase().includes(q) ||
            (v.branchAr && v.branchAr.includes(q));
          if (!matches) return false;
        }

        // Health
        if (healthFilter !== 'all' && v.healthStatus !== healthFilter) return false;

        // Device
        if (deviceFilter !== 'all' && v.deviceStatus !== deviceFilter) return false;

        // Car Status
        if (statusFilter !== 'all') {
          const vStatus = (v.status || '').toLowerCase();
          if (statusFilter === 'maintenance') {
            if (vStatus !== 'maintenance' && vStatus !== 'inmaintenance') return false;
          } else if (statusFilter === 'inspection') {
            if (vStatus !== 'inspection' && vStatus !== 'ininspection') return false;
          } else if (vStatus !== statusFilter) {
            return false;
          }
        }

        // Branch
        if (branchFilter !== 'all' && v.branch !== branchFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'health_asc') return a.healthScore - b.healthScore;
        if (sortBy === 'health_desc') return b.healthScore - a.healthScore;
        if (sortBy === 'mileage') return b.mileageKm - a.mileageKm;
        if (sortBy === 'risk') return b.riskScore - a.riskScore;
        return 0;
      });
  }, [vehicles, searchQuery, healthFilter, deviceFilter, statusFilter, branchFilter, sortBy]);

  // If a vehicle is selected, show detail view
  if (selectedVehicle) {
    return (
      <VehicleDetailView
        vehicle={selectedVehicle}
        onBack={() => setSelectedVehicleId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 text-start">
      <FleetRegistry />
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
            {t.vehiclesTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#71716A] dark:text-[#8E8E86] mt-0.5">
            {t.vehiclesSubtitle} ({vehicles.length} {t.vehiclesCount})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsInspectionModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] hover:bg-black dark:hover:bg-[#F5F5F0] shadow-xs transition-colors"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{t.conductInspectionTitle}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#242420] transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportFleetReport}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar in Bento Style */}
      <div className="bento-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Field */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-[#71716A] dark:text-[#8E8E86] absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full ps-9 pe-4 py-2 text-xs rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-white placeholder:text-[#71716A] dark:placeholder:text-[#8E8E86] focus:outline-hidden"
            />
          </div>

          {/* View Toggle (Table vs Grid) */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] self-end md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table View"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#1B1B18] text-[#1A1A1A] dark:text-white shadow-xs border border-[#E5E5E1] dark:border-[#2C2C27]'
                  : 'text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#1B1B18] text-[#1A1A1A] dark:text-white shadow-xs border border-[#E5E5E1] dark:border-[#2C2C27]'
                  : 'text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27] text-xs">
          {/* Health Filter */}
          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-[#F5F5F0] font-medium"
          >
            <option value="all">{t.healthStatus}: {t.filterAll}</option>
            <option value="healthy">{t.healthy}</option>
            <option value="attention">{t.needsAttention}</option>
            <option value="critical">{t.critical}</option>
          </select>

          {/* Device Connection */}
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-[#F5F5F0] font-medium"
          >
            <option value="all">{t.deviceStatus}: {t.filterAll}</option>
            <option value="online">{t.online}</option>
            <option value="delayed">{t.delayed}</option>
            <option value="offline">{t.offline}</option>
          </select>

          {/* Car Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-[#F5F5F0] font-medium"
          >
            <option value="all">{t.carStatus}: {t.filterAll}</option>
            <option value="available">{t.available}</option>
            <option value="rented">{t.rented}</option>
            <option value="maintenance">{t.inMaintenance}</option>
            <option value="inspection">{t.inInspection}</option>
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-[#F5F5F0] font-medium"
          >
            <option value="all">{t.branch}: {t.filterAll}</option>
            {branches.map((b) => (
              <option key={b.en} value={b.en}>{isRTL ? b.ar : b.en}</option>
            ))}
          </select>

          {/* Sort By */}
          <div className="ms-auto flex items-center gap-1.5 text-[#71716A] dark:text-[#8E8E86]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#1A1A1A] dark:text-[#F5F5F0] font-medium"
            >
              <option value="health_asc">{isRTL ? 'الأقل صحة أولاً (أولوية)' : 'Lowest Health First (Priority)'}</option>
              <option value="health_desc">{isRTL ? 'الأعلى صحة أولاً' : 'Highest Health First'}</option>
              <option value="risk">{isRTL ? 'الأعلى مخاطرة' : 'Highest Risk Score'}</option>
              <option value="mileage">{isRTL ? 'الأعلى قراءة عداد' : 'Highest Mileage'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Reset */}
      <div className="flex items-center justify-between text-xs text-[#71716A] dark:text-[#8E8E86] px-1">
        <span>
          {isRTL ? `عرض ${filteredVehicles.length} من أصل ${vehicles.length} مركبة` : `Showing ${filteredVehicles.length} of ${vehicles.length} vehicles`}
        </span>
        {(searchQuery || healthFilter !== 'all' || deviceFilter !== 'all' || statusFilter !== 'all' || branchFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setHealthFilter('all');
              setDeviceFilter('all');
              setStatusFilter('all');
              setBranchFilter('all');
            }}
            className="text-[#10B981] font-semibold hover:underline"
          >
            {isRTL ? 'إعادة ضبط التصفية' : 'Reset Filters'}
          </button>
        )}
      </div>

      {/* VIEW: TABLE */}
      {viewMode === 'table' ? (
        <div className="rounded-xl bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] text-xs text-start">
              <thead>
                <tr className="bg-[#F9F9F7] dark:bg-[#20201D] border-b border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 ps-4 pe-2 text-start">{t.vehicle}</th>
                  <th className="py-3.5 px-2 text-center whitespace-nowrap">{isRTL ? 'رقم اللوحة' : 'License Plate'}</th>
                  <th className="py-3.5 px-2 text-start">{t.healthScore}</th>
                  <th className="py-3.5 px-2 text-start">{t.deviceStatus}</th>
                  <th className="py-3.5 px-2 text-start">{t.carStatus}</th>
                  <th className="py-3.5 px-2 text-start">{t.faultsTitle}</th>
                  <th className="py-3.5 px-2 text-start">{t.mileage}</th>
                  <th className="py-3.5 px-2 text-start">{t.branch}</th>
                  <th className="py-3.5 ps-2 pe-4 text-end"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E1]/60 dark:divide-[#2C2C27]/60">
                {filteredVehicles.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => viewVehicleDetail(v.id)}
                    className="hover:bg-[#F9F9F7] dark:hover:bg-[#20201D] cursor-pointer transition-colors"
                  >
                    {/* Vehicle info */}
                    <td className="py-3.5 ps-4 pe-2">
                      <div className="font-bold text-[#1A1A1A] dark:text-white">
                        {v.make} {v.model} ({v.year})
                      </div>
                      <div className="text-[11px] text-[#71716A] dark:text-[#8E8E86] font-mono">
                        VIN: {v.vin.slice(0, 10)}...
                      </div>
                    </td>

                    {/* License Plate in Saudi Format (Smaller & Centered) */}
                    <td className="py-2.5 px-2 text-center">
                      <div className="flex items-center justify-center">
                        <SaudiLicensePlate
                          plateNumber={v.plateNumber}
                          plateNumberAr={v.plateNumberAr}
                          size="xs"
                        />
                      </div>
                    </td>

                    {/* Health Score */}
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold text-sm ${
                          v.healthScore < 65 ? 'text-red-600 dark:text-red-400' : v.healthScore < 85 ? 'text-amber-600 dark:text-amber-400' : 'text-[#10B981]'
                        }`}>
                          {v.healthScore}
                        </span>
                        <StatusBadge type="health" status={v.healthStatus} size="sm" showIcon={false} />
                      </div>
                      <div className="text-[10px] font-semibold mt-0.5">
                        {v.healthStatus === 'healthy' ? (
                          <span className="text-emerald-700 dark:text-emerald-400">
                            {isRTL ? 'جاهزة للتأجير' : 'Ready to Rent'}
                          </span>
                        ) : v.healthStatus === 'attention' ? (
                          <span className="text-amber-700 dark:text-amber-400">
                            {isRTL ? 'تحتاج فحصاً فنياً' : 'Technical Inspection Required'}
                          </span>
                        ) : (
                          <span className="text-red-700 dark:text-red-400">
                            {isRTL ? 'ممنوع التأجير — صيانة' : 'Grounded (Do Not Rent)'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Device Status */}
                    <td className="py-3.5 px-2">
                      <StatusBadge type="device" status={v.deviceStatus} size="sm" />
                    </td>

                    {/* Car Status */}
                    <td className="py-3.5 px-2">
                      <StatusBadge type="carStatus" status={v.status} size="sm" />
                    </td>

                    {/* Active Faults */}
                    <td className="py-3.5 px-2">
                      {v.activeFaults && v.activeFaults.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 font-mono font-bold text-[11px]">
                            {v.activeFaults[0].code}
                          </span>
                          {v.activeFaults.length > 1 && (
                            <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] font-bold">
                              +{v.activeFaults.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#71716A] dark:text-[#8E8E86]">—</span>
                      )}
                    </td>

                    {/* Mileage */}
                    <td className="py-3.5 px-2 font-mono text-[#71716A] dark:text-[#8E8E86]">
                      {v.mileageKm.toLocaleString()} km
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 px-2 text-[#71716A] dark:text-[#8E8E86]">
                      {isRTL ? (v.branchAr || v.branch) : v.branch}
                    </td>

                    {/* Chevron */}
                    <td className="py-3.5 ps-2 pe-4 text-end">
                      <ChevronRight className="w-4 h-4 text-[#71716A] dark:text-[#8E8E86] inline rtl:rotate-180" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW: GRID / CARDS in Bento Style */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => viewVehicleDetail(v.id)}
              className="bento-card p-5 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">
                      {v.make} {v.model}
                    </h3>
                    <p className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                      {v.trim || `${v.year}`} • {isRTL ? v.branchAr : v.branch}
                    </p>
                  </div>

                  {/* Health Score Pill */}
                  <div className={`px-2.5 py-1 rounded-md text-center font-bold text-xs shrink-0 ${
                    v.healthScore < 65 
                      ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : v.healthScore < 85
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {v.healthScore}/100
                  </div>
                </div>

                {/* Car License Plate Badge (Smaller & Centered) */}
                <div className="mb-3 py-2 px-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] flex flex-col items-center justify-center text-center gap-1.5">
                  <SaudiLicensePlate
                    plateNumber={v.plateNumber}
                    plateNumberAr={v.plateNumberAr}
                    size="xs"
                  />
                  <div className="flex items-center justify-center gap-2 text-[10px] text-[#71716A] dark:text-[#8E8E86]">
                    <span className="uppercase tracking-wider font-medium">{t.vinNumber}:</span>
                    <span className="font-mono font-semibold text-[#1A1A1A] dark:text-white">{v.vin.slice(0, 8)}...</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <StatusBadge type="device" status={v.deviceStatus} size="sm" />
                  <StatusBadge type="carStatus" status={v.status} size="sm" />
                </div>

                {/* Primary Risk Issue if any */}
                {v.primaryRiskIssue && (
                  <p className="text-xs text-[#71716A] dark:text-[#8E8E86] line-clamp-1 bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] p-2 rounded-lg">
                    {isRTL ? v.primaryRiskIssueAr : v.primaryRiskIssue}
                  </p>
                )}

                {/* Instant Rental Readiness Status for branch staff */}
                <div className="mt-2.5 pt-2.5 border-t border-[#E5E5E1]/60 dark:border-[#2C2C27]/60 flex items-center justify-between text-xs">
                  <span className="text-[#71716A] dark:text-[#8E8E86] text-[11px]">
                    {isRTL ? 'جاهزية التأجير:' : 'Rental Readiness:'}
                  </span>
                  <span className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                    v.healthStatus === 'healthy'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : v.healthStatus === 'attention'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {v.healthStatus === 'healthy' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>{isRTL ? 'صالحة للتأجير الفوري' : 'Ready to Dispatch'}</span>
                      </>
                    ) : v.healthStatus === 'attention' ? (
                      <>
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        <span>{isRTL ? 'تحتاج فحصاً فنياً' : 'Technical Inspection Required'}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span>{isRTL ? 'ممنوع التأجير — صيانة' : 'Grounded (Do Not Rent)'}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Bottom metadata */}
              <div className="pt-3 mt-3 border-t border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-between text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                <span>{isRTL ? (v.branchAr || v.branch) : v.branch}</span>
                <span className="font-mono">{v.mileageKm.toLocaleString()} km</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
