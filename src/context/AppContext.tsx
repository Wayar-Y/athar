import { useStoredState } from '../lib/useStoredState';
import { contractsFor, createContract, recordInspection } from '../lib/rental';
import type { RentalContract, TimelineEvent } from '../types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Vehicle, 
  OBDDevice, 
  NotificationItem, 
  ActiveNavSection, 
  InspectionRecord 
} from '../types';
import { mockVehicles, mockDevices, mockNotifications, mockFleetStats } from '../data/mockFleet';
import { translations, Language } from '../data/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: typeof translations['en'];
  
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  textSize: 'small' | 'medium' | 'large';
  setTextSize: (size: 'small' | 'medium' | 'large') => void;

  displayDensity: 'comfortable' | 'compact';
  setDisplayDensity: (density: 'comfortable' | 'compact') => void;

  fleetSensitivity: 'strict' | 'balanced' | 'tolerant';
  setFleetSensitivity: (sens: 'strict' | 'balanced' | 'tolerant') => void;
  
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  
  activeSection: ActiveNavSection;
  setActiveSection: (sec: ActiveNavSection) => void;
  
  viewMode: 'app' | 'landing';
  setViewMode: (mode: 'app' | 'landing') => void;
  
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  selectedVehicle: Vehicle | null;
  
  vehicles: Vehicle[];
  devices: OBDDevice[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  
  isInspectionModalOpen: boolean;
  setIsInspectionModalOpen: (open: boolean) => void;
  
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  
  saveVehicle: (vehicle: Vehicle) => void;
  storageError: string;
  storageReady: boolean;
  storageSaving: boolean;
  createRental: (vehicleId: string, contract: RentalContract) => void;
  cancelRental: (vehicleId: string, contractId: string) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  // Actions
  viewVehicleDetail: (vehicleId: string) => void;
  addInspectionRecord: (record: Omit<InspectionRecord, 'id'>) => void;
  assignDeviceToVehicle: (deviceId: string, vehicleId: string) => void;
  unassignDevice: (deviceId: string) => void;
  pingDevice: (deviceId: string) => void;
  pingAllDevices: () => void;
  registerDevice: (device: OBDDevice) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('athar_lang') as Language) || 'en';
  });
  
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('athar_theme') as 'light' | 'dark' | 'system') || 'light';
  });
  const [textSize, setTextSizeState] = useState<'small' | 'medium' | 'large'>(() => {
    return (localStorage.getItem('athar_text_size') as 'small' | 'medium' | 'large') || 'medium';
  });
  const setTextSize = (size: 'small' | 'medium' | 'large') => {
    setTextSizeState(size);
    localStorage.setItem('athar_text_size', size);
  };

  const [displayDensity, setDisplayDensityState] = useState<'comfortable' | 'compact'>(() => {
    return (localStorage.getItem('athar_density') as 'comfortable' | 'compact') || 'comfortable';
  });
  const setDisplayDensity = (density: 'comfortable' | 'compact') => {
    setDisplayDensityState(density);
    localStorage.setItem('athar_density', density);
  };

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    return localStorage.getItem('athar_reduced_motion') === 'true';
  });
  const setReducedMotion = (val: boolean) => {
    setReducedMotionState(val);
    localStorage.setItem('athar_reduced_motion', String(val));
  };

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('athar_high_contrast') === 'true';
  });
  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    localStorage.setItem('athar_high_contrast', String(val));
  };

  const [fleetSensitivity, setFleetSensitivityState] = useState<'strict' | 'balanced' | 'tolerant'>(() => {
    return (localStorage.getItem('athar_fleet_sensitivity') as 'strict' | 'balanced' | 'tolerant') || 'balanced';
  });
  const setFleetSensitivity = (sens: 'strict' | 'balanced' | 'tolerant') => {
    setFleetSensitivityState(sens);
    localStorage.setItem('athar_fleet_sensitivity', sens);
  };
  
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('dashboard');
  const [viewMode, setViewModeState] = useState<'app' | 'landing'>(() => {
    return (localStorage.getItem('athar_view_mode') as 'app' | 'landing') || 'landing';
  });
  const setViewMode = (mode: 'app' | 'landing') => {
    setViewModeState(mode);
    localStorage.setItem('athar_view_mode', mode);
  };
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  
  const [vehicles, setVehicles, fleetStorage] = useStoredState<Vehicle[]>('fleet', mockVehicles);
  const [devices, setDevices, deviceStorage] = useStoredState<OBDDevice[]>('devices', mockDevices);
  const [notifications, setNotifications, notificationStorage] = useStoredState<NotificationItem[]>('notifications', mockNotifications);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isRTL = language === 'ar';
  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('athar_lang', lang);
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('athar_theme', newTheme);
  };

  // Sync HTML tag attributes: dir, lang, class for dark mode and text scaling
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    root.setAttribute('data-text-size', textSize);
    root.setAttribute('data-density', displayDensity);
    
    // Apply immediate physical font scaling
    if (textSize === 'small') {
      root.style.fontSize = '14px';
      (document.body.style as any).zoom = '0.92';
    } else if (textSize === 'large') {
      root.style.fontSize = '18px';
      (document.body.style as any).zoom = '1.08';
    } else {
      root.style.fontSize = '16px';
      (document.body.style as any).zoom = '1';
    }

    // Apply layout density class
    if (displayDensity === 'compact') {
      root.classList.add('density-compact');
      root.classList.remove('density-comfortable');
    } else {
      root.classList.add('density-comfortable');
      root.classList.remove('density-compact');
    }
    
    // Apply font family
    if (isRTL) {
      root.style.fontFamily = "'Tajawal', system-ui, sans-serif";
    } else {
      root.style.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
    }

    // Apply theme
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Apply high contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [language, isRTL, theme, textSize, displayDensity, highContrast, reducedMotion]);

  // Handle keyboard shortcut for Global Search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedVehicle = selectedVehicleId 
    ? vehicles.find((v) => v.id === selectedVehicleId) || null 
    : null;

  const viewVehicleDetail = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setActiveSection('vehicles');
  };

  const saveVehicle = (vehicle: Vehicle) => {
    if (vehicles.some(v=>v.id!==vehicle.id && (v.vin.toUpperCase()===vehicle.vin.toUpperCase() || v.plateNumber.replace(/\s/g,'').toUpperCase()===vehicle.plateNumber.replace(/\s/g,'').toUpperCase()))) throw new Error('Plate or VIN already exists / اللوحة أو رقم الهيكل موجود');
    setVehicles(prev=>prev.some(v=>v.id===vehicle.id)?prev.map(v=>v.id===vehicle.id?vehicle:v):[vehicle,...prev]);
  };
  const updateVehicle = (vehicle: Vehicle) => setVehicles(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
  const createRental = (vehicleId: string, contract: RentalContract) => {
    if (vehicles.some(v => contractsFor(v).some(c => c.id === contract.id))) throw new Error('Contract ID already exists / رقم العقد موجود');
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) throw new Error('Vehicle not found');
    updateVehicle(createContract(vehicle, contract));
  };
  const cancelRental = (vehicleId: string, contractId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    updateVehicle({...vehicle, contracts:contractsFor(vehicle).map(c => c.id === contractId && c.status === 'draft' ? {...c,status:'cancelled'} : c)});
  };
  const addInspectionRecord = (recordData: Omit<InspectionRecord, 'id'>) => {
    const vehicle = vehicles.find(v => v.id === recordData.vehicleId);
    if (!vehicle) throw new Error('Vehicle not found');
    updateVehicle(recordInspection(vehicle, {...recordData,id:crypto.randomUUID()}));
  };

  const assignDeviceToVehicle = (deviceId: string, vehicleId: string) => {
    const targetVehicle = vehicles.find((v) => v.id === vehicleId);
    if (!targetVehicle) return;

    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          return {
            ...d,
            assignedVehicleId: targetVehicle.id,
            assignedVehicleName: `${targetVehicle.make} ${targetVehicle.model}`,
            plateNumber: targetVehicle.plateNumber,
            plateNumberAr: targetVehicle.plateNumberAr,
            branch: targetVehicle.branch,
            branchAr: targetVehicle.branchAr,
            tamperStatus: 'secured' as const,
            portVoltage: targetVehicle.sensorData?.batteryVoltage ?? 12.6,
          };
        }
        if (d.assignedVehicleId === vehicleId) return {...d, assignedVehicleId: undefined, assignedVehicleName: undefined, plateNumber: undefined, plateNumberAr: undefined};
        return d;
      })
    );

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return { ...v, deviceId, deviceStatus: devices.find(d => d.id === deviceId)?.connectionStatus || 'offline' };
        }
        return v.deviceId === deviceId ? {...v, deviceId: '', deviceStatus: 'offline'} : v;
      })
    );
  };

  const unassignDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          return {
            ...d,
            assignedVehicleId: undefined,
            assignedVehicleName: undefined,
            plateNumber: undefined,
            plateNumberAr: undefined,
            branch: undefined,
            branchAr: undefined,
            tamperStatus: 'secured' as const,
          };
        }
        return d;
      })
    );

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.deviceId === deviceId) {
          return { ...v, deviceId: '', deviceStatus: 'offline' };
        }
        return v;
      })
    );
  };

  const pingDevice = (_deviceId: string) => { /* No transport configured; preserve last known state. */ };
  const pingAllDevices = () => { /* No transport configured; preserve last known state. */ };

  const registerDevice = (newDevice: OBDDevice) => {
    setDevices((prev) => [newDevice, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        storageError: fleetStorage.error || deviceStorage.error || notificationStorage.error,
        storageSaving: fleetStorage.saving || deviceStorage.saving || notificationStorage.saving,
        storageReady: fleetStorage.ready && deviceStorage.ready && notificationStorage.ready,
        saveVehicle, createRental, cancelRental, updateVehicle,
        language,
        setLanguage,
        isRTL,
        t,
        theme,
        setTheme,
        textSize,
        setTextSize,
        displayDensity,
        setDisplayDensity,
        fleetSensitivity,
        setFleetSensitivity,
        reducedMotion,
        setReducedMotion,
        highContrast,
        setHighContrast,
        activeSection,
        setActiveSection,
        viewMode,
        setViewMode,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedVehicle,
        vehicles,
        devices,
        notifications,
        unreadNotificationsCount,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isInspectionModalOpen,
        setIsInspectionModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        viewVehicleDetail,
        addInspectionRecord,
        assignDeviceToVehicle,
        unassignDevice,
        pingDevice,
        pingAllDevices,
        registerDevice,
        markNotificationAsRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
