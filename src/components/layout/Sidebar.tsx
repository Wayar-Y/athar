import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  BrainCircuit, 
  ClipboardCheck, 
  Radio, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  CarFront,
  Building2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveNavSection } from '../../types';
import { AtharLogo } from '../common/AtharLogo';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { 
    activeSection, 
    setActiveSection, 
    isRTL, 
    t, 
    setSelectedVehicleId,
    vehicles,
    setViewMode
  } = useApp();

  const criticalVehiclesCount = vehicles.filter((v) => v.healthStatus === 'critical').length;
  const activeFaultsCount = vehicles.reduce((sum, v) => sum + (v.activeFaults?.length || 0), 0);

  const navItems: {
    id: ActiveNavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeVariant?: 'critical' | 'neutral';
  }[] = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'vehicles',
      label: t.navVehicles,
      icon: Car,
      badge: criticalVehiclesCount > 0 ? criticalVehiclesCount : undefined,
      badgeVariant: 'critical',
    },
    {
      id: 'diagnostics',
      label: t.navDiagnostics,
      icon: Wrench,
      badge: activeFaultsCount > 0 ? activeFaultsCount : undefined,
      badgeVariant: 'critical',
    },
    {
      id: 'intelligence',
      label: t.navIntelligence,
      icon: BrainCircuit,
    },
    {
      id: 'operations',
      label: t.navOperations,
      icon: ClipboardCheck,
    },
    {
      id: 'devices',
      label: t.navDevices,
      icon: Radio,
    },
    {
      id: 'reports',
      label: t.navReports,
      icon: FileText,
    },
    {
      id: 'settings',
      label: t.navSettings,
      icon: Settings,
    },
  ];

  const handleNavClick = (id: ActiveNavSection) => {
    setActiveSection(id);
    setSelectedVehicleId(null);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const CollapseIcon = isRTL 
    ? (isCollapsed ? ChevronLeft : ChevronRight)
    : (isCollapsed ? ChevronRight : ChevronLeft);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 z-40 flex flex-col bg-white dark:bg-[#181816] border-e border-[#E5E5E1] dark:border-[#2C2C27] shadow-xl lg:shadow-none transition-all duration-200 ease-in-out ${
          isRTL ? 'right-0' : 'left-0'
        } w-72 max-w-[85vw] ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-3.5 border-b border-[#E5E5E1] dark:border-[#2C2C27]">
          <div 
            onClick={() => {
              setSelectedVehicleId(null);
              setActiveSection('dashboard');
              if (isMobileOpen) setIsMobileOpen(false);
            }}
            className="flex items-center gap-2.5 overflow-hidden cursor-pointer group"
          >
            {isCollapsed ? (
              <div className="flex items-center">
                <div className="lg:hidden">
                  <AtharLogo variant="full" size="sm" className="h-9" />
                </div>
                <div className="hidden lg:block">
                  <AtharLogo variant="mark" size="sm" className="h-8" />
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <AtharLogo variant="full" size="sm" className="h-9 sm:h-10" />
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-1.5 rounded-lg text-[#71716A] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#242420] transition-colors"
          >
            <CollapseIcon className="w-4 h-4" />
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden p-1.5 rounded-lg text-[#71716A] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#242420] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white font-semibold'
                    : 'text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F5F5F0]/60 dark:hover:bg-[#242420]/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1A1A1A] dark:text-white' : 'text-[#71716A] dark:text-[#8E8E86]'}`} />

                {!isCollapsed && (
                  <span className="flex-1 text-start truncate">
                    {item.label}
                  </span>
                )}

                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      item.badgeVariant === 'critical'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-[#F5F5F0] text-[#71716A] dark:bg-[#242420] dark:text-[#8E8E86]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          {/* Public Website / Pricing Quick Action */}
          <div className="pt-2 mt-2 border-t border-[#E5E5E1] dark:border-[#2C2C27]">
            <button
              type="button"
              onClick={() => {
                setViewMode('landing');
                if (isMobileOpen) setIsMobileOpen(false);
              }}
              title={isCollapsed ? (isRTL ? 'عن أثر والأسعار' : 'About Athar & Pricing') : undefined}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/60 transition-colors"
            >
              <Building2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              {!isCollapsed && (
                <span className="flex-1 text-start truncate">
                  {isRTL ? 'عن أثر والأسعار' : 'About Athar & Pricing'}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Compact Fleet Status Footer */}
        {!isCollapsed ? (
          <div className="p-3.5 m-3 rounded-xl bg-[#F9F9F7] dark:bg-[#20201D] border border-[#E5E5E1] dark:border-[#2C2C27] text-start">
            <div className="flex items-center justify-between text-[11px] text-[#71716A] dark:text-[#8E8E86]">
              <span>{t.online}</span>
              <span className="font-semibold text-[#10B981]">53 / 60</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-[#2C2C27] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#10B981] h-full rounded-full w-[88%]" />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#71716A] dark:text-[#8E8E86] font-mono">
              <span>OBD-II v2.4</span>
              <span className="inline-flex items-center gap-1">
                <span className="status-dot bg-[#10B981]" />
                <span>{isRTL ? 'مباشر' : 'Live'}</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 text-center text-[#71716A] text-[10px] font-mono border-t border-[#E5E5E1] dark:border-[#2C2C27]">
            v2.4
          </div>
        )}
      </aside>
    </>
  );
};
