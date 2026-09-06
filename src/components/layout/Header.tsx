import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ExternalLink, 
  Activity, 
  Check, 
  SlidersHorizontal,
  ChevronDown,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AtharLogo } from '../common/AtharLogo';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  isMobileSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  isSidebarCollapsed,
  isMobileSidebarOpen = false 
}) => {
  const {
    language,
    setLanguage,
    isRTL,
    t,
    theme,
    setTheme,
    viewMode,
    setViewMode,
    setIsSearchOpen,
    notifications,
    unreadNotificationsCount,
    isNotificationOpen,
    setIsNotificationOpen,
    markNotificationAsRead,
    markAllNotificationsRead,
    viewVehicleDetail,
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-6 lg:px-8 bg-white dark:bg-[#181816] border-b border-[#E5E5E1] dark:border-[#2C2C27] transition-colors">
      {/* Left: Mobile Sidebar Trigger + Logo + Breadcrumb + Search */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation sidebar"
          className="p-2 -ms-1 rounded-lg text-[#71716A] dark:text-[#8E8E86] hover:bg-[#F5F5F0] dark:hover:bg-[#242420] transition-colors focus:outline-hidden lg:hidden shrink-0"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5 text-[#1A1A1A] dark:text-white" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo in Top Bar */}
        <div className="flex items-center shrink-0">
          {/* Mobile view */}
          <div className="lg:hidden flex items-center">
            <AtharLogo variant="full" size="sm" className="h-8 sm:h-9 max-w-[110px] sm:max-w-none" />
          </div>
          {/* Desktop view if sidebar is collapsed */}
          {isSidebarCollapsed && (
            <div className="hidden lg:flex items-center me-2">
              <AtharLogo variant="full" size="sm" className="h-9 sm:h-10" />
            </div>
          )}
        </div>

        {/* Bento Breadcrumb / Section Label */}
        <div className="hidden lg:flex items-center gap-2 text-sm shrink-0">
          <span className="text-[#71716A] dark:text-[#8E8E86]">{isRTL ? 'نظرة عامة' : 'Overview'}</span>
          <span className="text-[#71716A] text-xs">/</span>
          <span className="font-semibold text-[#1A1A1A] dark:text-white">{isRTL ? 'ذكاء الأسطول' : 'Fleet Intelligence'}</span>
        </div>

        {/* Mobile Search Icon Button (Compact) */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          aria-label={t.searchPlaceholder}
          className="sm:hidden p-2 rounded-lg text-[#71716A] dark:text-[#8E8E86] hover:bg-[#F5F5F0] dark:hover:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] transition-colors focus:outline-hidden shrink-0"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Desktop Global Search Button styled in Bento theme */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#F5F5F0] dark:bg-[#242420] hover:bg-[#ECECE6] dark:hover:bg-[#2B2B26] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A] dark:text-[#8E8E86] text-xs font-medium transition-colors w-40 sm:w-52 md:w-64 justify-between focus:outline-hidden"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 shrink-0 text-[#71716A] dark:text-[#8E8E86]" />
            <span className="truncate">{t.searchPlaceholder}</span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] text-[#71716A]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Toggle between SaaS Platform & Public Landing Website */}
        {/* Desktop full button */}
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'app' ? 'landing' : 'app')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F5F5F0] dark:bg-[#242420] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2C2C27] hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-colors shadow-xs"
          title={isRTL ? 'الرجوع إلى صفحة أثر الرئيسية والأسعار' : 'Return to Athar homepage and pricing'}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            {viewMode === 'app' ? (isRTL ? 'عن أثر والأسعار' : 'About Athar & Pricing') : t.platform}
          </span>
          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
        </button>

        {/* Mobile compact icon button for landing view */}
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'app' ? 'landing' : 'app')}
          className="md:hidden p-2 rounded-lg text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors focus:outline-hidden shrink-0"
          title={isRTL ? 'عن أثر والأسعار' : 'About Athar & Pricing'}
          aria-label={isRTL ? 'عن أثر والأسعار' : 'About Athar & Pricing'}
        >
          <Building2 className="w-4 h-4" />
        </button>

        {/* Language Switcher in Bento style */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLangMenuOpen((prev) => !prev)}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[#1A1A1A] dark:text-[#F5F5F0] border border-[#E5E5E1] dark:border-[#2C2C27] hover:bg-[#F5F5F0] dark:hover:bg-[#242420] text-xs font-bold uppercase tracking-wider transition-colors focus:outline-hidden"
            aria-label="Change language"
          >
            <Globe className="w-3.5 h-3.5 text-[#71716A] dark:text-[#8E8E86]" />
            <span className="hidden sm:inline">{language === 'ar' ? 'العربية' : 'English'}</span>
            <span className="sm:hidden text-[11px]">{language === 'ar' ? 'ع' : 'EN'}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isLangMenuOpen && (
            <div className={`absolute top-full mt-1.5 ${isRTL ? 'start-0' : 'end-0'} w-36 rounded-xl bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] shadow-lg py-1 z-50`}>
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setIsLangMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-start ${
                  language === 'en'
                    ? 'bg-[#F5F5F0] text-[#1A1A1A] dark:bg-[#242420] dark:text-white font-semibold'
                    : 'text-[#71716A] dark:text-[#8E8E86] hover:bg-[#F5F5F0]/60 dark:hover:bg-[#242420]/60'
                }`}
              >
                <span>English</span>
                {language === 'en' && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('ar');
                  setIsLangMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-start ${
                  language === 'ar'
                    ? 'bg-[#F5F5F0] text-[#1A1A1A] dark:bg-[#242420] dark:text-white font-semibold'
                    : 'text-[#71716A] dark:text-[#8E8E86] hover:bg-[#F5F5F0]/60 dark:hover:bg-[#242420]/60'
                }`}
              >
                <span>العربية</span>
                {language === 'ar' && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
              </button>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] transition-colors focus:outline-hidden"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#1A1A1A]" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-lg text-[#71716A] dark:text-[#8E8E86] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#242420] border border-[#E5E5E1] dark:border-[#2C2C27] transition-colors focus:outline-hidden"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 end-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {isNotificationOpen && (
            <div className={`fixed sm:absolute top-16 sm:top-full mt-2 inset-x-3 sm:inset-x-auto ${isRTL ? 'sm:start-0' : 'sm:end-0'} sm:w-96 max-w-[calc(100vw-24px)] rounded-xl bg-white dark:bg-[#1B1B18] border border-[#E5E5E1] dark:border-[#2C2C27] shadow-xl overflow-hidden z-50`}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5E1] dark:border-[#2C2C27] bg-[#F9F9F7] dark:bg-[#20201D]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] dark:text-white">
                    {t.notifications}
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#1A1A1A] dark:text-white hover:underline font-semibold"
                  >
                    {t.markAllRead}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E5E1] dark:divide-[#2C2C27]">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#71716A] dark:text-[#8E8E86]">
                    {t.allCaughtUp}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        viewVehicleDetail(n.vehicleId);
                        setIsNotificationOpen(false);
                      }}
                      className={`p-3 text-start hover:bg-[#F9F9F7] dark:hover:bg-[#20201D] cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-[#1A1A1A] dark:text-white line-clamp-1">
                          {isRTL ? n.titleAr : n.title}
                        </span>
                        <span className="text-[10px] text-[#71716A] dark:text-[#8E8E86] whitespace-nowrap">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#71716A] dark:text-[#8E8E86] line-clamp-2">
                        {isRTL ? n.messageAr : n.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-medium text-[#71716A] dark:text-[#8E8E86]">
                          {n.vehiclePlate}
                        </span>
                        <span className="text-[10px] font-semibold text-[#1A1A1A] dark:text-white hover:underline">
                          {t.viewVehicle} {isRTL ? '←' : '→'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar in Bento style */}
        <div className="hidden sm:flex items-center gap-2.5 ps-2 border-s border-[#E5E5E1] dark:border-[#2C2C27]">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-[#1A1A1A] dark:text-white flex items-center justify-center font-bold text-xs">
            FM
          </div>
          <div className="hidden md:block text-start leading-tight">
            <p className="text-xs font-semibold text-[#1A1A1A] dark:text-white">
              {isRTL ? 'فهد المنصور' : 'Omar Khalid'}
            </p>
            <p className="text-[10px] text-[#71716A] dark:text-[#8E8E86]">
              {isRTL ? 'مدير الأسطول' : 'Fleet Manager'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
