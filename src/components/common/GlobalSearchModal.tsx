import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Car, Wrench, Radio, MapPin, ChevronRight, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SaudiLicensePlate } from './SaudiLicensePlate';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    vehicles,
    devices,
    viewVehicleDetail,
    setActiveSection,
    isRTL,
    t,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Filter categorized items
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        vehicles: vehicles.slice(0, 4),
        faults: [],
        devices: [],
        branches: [],
      };
    }

    const matchedVehicles = vehicles.filter((v) =>
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.plateNumber.toLowerCase().includes(q) ||
      v.plateNumberAr.includes(q) ||
      v.vin.toLowerCase().includes(q)
    );

    // Extract faults
    const allFaults: { faultCode: string; title: string; titleAr: string; vehiclePlate: string; vehicleId: string }[] = [];
    vehicles.forEach((v) => {
      v.activeFaults?.forEach((f) => {
        if (
          f.code.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.titleAr.includes(q)
        ) {
          allFaults.push({
            faultCode: f.code,
            title: f.title,
            titleAr: f.titleAr,
            vehiclePlate: v.plateNumber,
            vehicleId: v.id,
          });
        }
      });
    });

    const matchedDevices = devices.filter((d) =>
      d.id.toLowerCase().includes(q) ||
      (d.assignedVehicleName && d.assignedVehicleName.toLowerCase().includes(q)) ||
      (d.plateNumber && d.plateNumber.toLowerCase().includes(q))
    );

    const branches = ['Riyadh Airport', 'Jeddah Corniche', 'Dammam Highway', 'Riyadh Olaya'].filter((b) =>
      b.toLowerCase().includes(q)
    );

    return {
      vehicles: matchedVehicles.slice(0, 5),
      faults: allFaults.slice(0, 4),
      devices: matchedDevices.slice(0, 4),
      branches,
    };
  }, [query, vehicles, devices]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl rounded-xl bg-white dark:bg-[#1A1A1A] border border-[#E5E5E1] dark:border-[#2C2C27] shadow-2xl overflow-hidden text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
          <Search className="w-5 h-5 text-[#71716A] dark:text-[#8E8E86] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            autoFocus
            className="w-full bg-transparent px-3 text-sm text-[#1A1A1A] dark:text-white placeholder:text-[#71716A] dark:placeholder:text-[#8E8E86] focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[#71716A] hover:text-[#1A1A1A] dark:text-[#8E8E86] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="ms-2 px-2 py-1 text-xs rounded bg-[#F5F5F0] dark:bg-[#242420] text-[#71716A] dark:text-[#8E8E86] border border-[#E5E5E1] dark:border-[#2C2C27]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-5">
          {/* Vehicles Category */}
          {results.vehicles.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#71716A] dark:text-[#8E8E86] uppercase tracking-wider mb-2">
                <Car className="w-3.5 h-3.5" />
                <span>{t.navVehicles}</span>
              </div>
              <div className="space-y-1">
                {results.vehicles.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      viewVehicleDetail(v.id);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F5F5F0] dark:hover:bg-[#242420] transition-colors group text-start"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-center font-bold text-xs">
                        {v.healthScore}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1A1A1A] dark:text-white group-hover:underline">
                          {v.make} {v.model} ({v.year})
                        </p>
                        <p className="text-[10px] text-[#71716A] dark:text-[#8E8E86] font-mono">
                          VIN: {v.vin.slice(0, 10)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <SaudiLicensePlate plateNumber={v.plateNumber} plateNumberAr={v.plateNumberAr} size="xs" />
                      <ChevronRight className="w-4 h-4 text-[#71716A] dark:text-[#8E8E86] rtl:rotate-180" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fault Codes Category */}
          {results.faults.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#71716A] dark:text-[#8E8E86] uppercase tracking-wider mb-2">
                <Wrench className="w-3.5 h-3.5" />
                <span>{t.faultsTitle}</span>
              </div>
              <div className="space-y-1">
                {results.faults.map((f, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      viewVehicleDetail(f.vehicleId);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F5F5F0] dark:hover:bg-[#242420] transition-colors group text-start"
                  >
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded bg-[#E5484D]/10 text-[#E5484D] border border-[#E5484D]/20 font-mono font-bold text-xs">
                        {f.faultCode}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1A1A1A] dark:text-white">
                          {isRTL ? f.titleAr : f.title}
                        </p>
                        <p className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                          {isRTL ? 'مركبة' : 'Vehicle'}: {f.vehiclePlate}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#71716A] dark:text-[#8E8E86] rtl:rotate-180" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* OBD Devices Category */}
          {results.devices.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#71716A] dark:text-[#8E8E86] uppercase tracking-wider mb-2">
                <Radio className="w-3.5 h-3.5" />
                <span>{t.navDevices}</span>
              </div>
              <div className="space-y-1">
                {results.devices.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setActiveSection('devices');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F5F5F0] dark:hover:bg-[#242420] transition-colors group text-start"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] flex items-center justify-center">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold font-mono text-[#1A1A1A] dark:text-white">
                          {d.id}
                        </p>
                        <p className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                          {d.assignedVehicleName || (isRTL ? 'غير مربوط بمركبة' : 'Unassigned')}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#71716A] dark:text-[#8E8E86]">
                      {d.connectionStatus}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.vehicles.length === 0 && results.faults.length === 0 && results.devices.length === 0 && (
            <div className="py-8 text-center text-sm text-[#71716A] dark:text-[#8E8E86]">
              {t.noVehiclesFound}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
