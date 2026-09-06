import {browserStorage} from './lib/recordStorage';
import {download} from './lib/export';
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './views/DashboardView';
import { VehiclesView } from './views/VehiclesView';
import { DiagnosticsView } from './views/DiagnosticsView';
import { IntelligenceView } from './views/IntelligenceView';
import { OperationsView } from './views/OperationsView';
import { DevicesView } from './views/DevicesView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { LandingPageView } from './views/LandingPageView';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { InspectionModal } from './components/common/InspectionModal';
import { ReportExportModal } from './components/common/ReportExportModal';

const AppShell: React.FC = () => {
  const { 
    storageError, storageReady, storageSaving, vehicles, devices, notifications,
    viewMode, 
    activeSection, 
    isRTL, 
    textSize, 
    reducedMotion 
  } = useApp();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If user requested public product landing page
  if (viewMode === 'landing') {
    return (
      <div className={`min-h-screen ${reducedMotion ? 'motion-reduce' : ''}`}>
        <LandingPageView />
      </div>
    );
  }

  // Text scaling classes
  const textSizeClass = 
    textSize === 'large' 
      ? 'text-base' 
      : textSize === 'small' 
      ? 'text-xs' 
      : 'text-sm';

  return (
    <div className={`min-h-screen bg-[#FBFBFA] dark:bg-[#121211] text-[#18181B] dark:text-[#FAFAFA] ${textSizeClass} ${reducedMotion ? 'motion-reduce' : ''} antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-150`}>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main App Container */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? 'lg:ms-20' : 'lg:ms-64'
        }`}
      >
        {/* Top Header */}
        <div inert={!storageReady || !!storageError}><Header
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isSidebarCollapsed={isSidebarCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
        /></div>

        <div role="status" className="px-4 py-3 text-sm bg-amber-50 text-amber-950 dark:bg-amber-950 dark:text-amber-100">
          {isRTL ? 'نموذج أولي — بيانات الأسطول والتنبؤات والاتصال بالأجهزة تجريبية. لا يوجد تتبع مباشر أو إرسال للورش أو رسائل خارجية.' : 'Prototype — fleet data, predictions and device connections are samples. No live tracking, workshop dispatch or external messaging is connected.'}
        </div>
        {(storageError || !storageReady) && <div role="alert" className="p-4 bg-red-50 text-red-900">{storageError || (isRTL ? 'جارٍ تحميل السجلات المحفوظة…' : 'Loading saved records…')}</div>}
        {storageReady && !storageError && <p role="status" className="px-4 pt-2 text-sm text-neutral-500">{storageSaving ? (isRTL ? 'جارٍ حفظ التغييرات…' : 'Saving changes…') : (browserStorage ? (isRTL ? 'السجلات محفوظة في هذا المتصفح فقط' : 'Records saved in this browser only') : (isRTL ? 'السجلات محفوظة على الخادم المحلي' : 'Records saved on the local server'))}</p>}
        {storageError && <button className="m-4 athar-primary self-start" onClick={()=>download('athar-recovery.json',JSON.stringify({vehicles,devices,notifications},null,2),'application/json')}>{isRTL ? 'تنزيل نسخة من السجلات الحالية قبل إعادة التحميل' : 'Download current records before reloading'}</button>}
        {browserStorage && <p className="px-4 pt-2 text-sm text-neutral-500">{isRTL ? 'نسخة عرض: لكل زائر بيانات مستقلة. لا تتزامن البيانات بين الأجهزة، وقد تُحذف عند مسح بيانات المتصفح. استخدم بيانات تجريبية.' : 'Demo: each visitor has separate records. Data does not sync across devices and may be removed when browser data is cleared. Use sample information.'}</p>}
        {/* Content Area */}
        <main inert={!storageReady || !!storageError} className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl w-full mx-auto">
          {activeSection === 'dashboard' && <DashboardView />}
          {activeSection === 'vehicles' && <VehiclesView />}
          {activeSection === 'diagnostics' && <DiagnosticsView />}
          {activeSection === 'intelligence' && <IntelligenceView />}
          {activeSection === 'operations' && <OperationsView />}
          {activeSection === 'devices' && <DevicesView />}
          {activeSection === 'reports' && <ReportsView />}
          {activeSection === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <GlobalSearchModal />
      <InspectionModal />
      <ReportExportModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
