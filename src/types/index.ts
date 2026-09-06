export type HealthStatus = 'healthy' | 'attention' | 'critical';
export type DeviceConnectionStatus = 'online' | 'delayed' | 'offline';
export type RiskLevel = 'low' | 'medium' | 'high';
export type RentalStatus = 'available' | 'rented' | 'maintenance' | 'inspection' | 'inMaintenance' | 'inInspection';
export type VehicleStatus = RentalStatus;
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface VehicleSensorData {
  rpm: number;
  speed: number;
  coolantTemp: number; // in Celsius
  coolantTempBaseline: { min: number; max: number };
  engineLoad: number; // in %
  fuelLevel: number; // in %
  batteryVoltage: number; // in Volts
  batteryVoltageBaseline: { min: number; max: number };
  throttlePosition: number; // in %
  intakeTemp: number; // in Celsius
  odometerKm: number;
  oilLifePercent?: number;
  ambientTemp?: number;
  fuelPressureKpa?: number;
  timingAdvanceDeg?: number;
  massAirFlowGps?: number;
  lastUpdated: string; // ISO or relative
  freshness: 'live' | 'delayed' | 'offline';
  freshnessText: string;
}

export interface FaultCode {
  id: string;
  code: string; // e.g., P0301
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  severity: SeverityLevel;
  firstDetected: string;
  lastDetected: string;
  occurrences: number;
  isRecurring: boolean;
  status: 'active' | 'resolved' | 'pending_review';
  recommendedAction: string;
  recommendedActionAr: string;
  system: 'engine' | 'electrical' | 'emissions' | 'cooling' | 'brakes' | 'transmission' | 'unknown';
}

export interface AIPrediction {
  id: string;
  title: string;
  titleAr: string;
  component: string;
  componentAr: string;
  probabilityPercent: number;
  riskLevel: RiskLevel;
  estimatedWindow: string; // e.g., "2–4 weeks"
  estimatedWindowAr: string;
  explanationPoints: string[];
  explanationPointsAr: string[];
  recommendedAction: string;
  recommendedActionAr: string;
  confidenceScore: number; // 0-100
}

export interface EarlyWarning {
  id: string;
  title: string;
  titleAr: string;
  parameter: string;
  parameterAr: string;
  currentValue: string;
  baselineValue: string;
  anomalyDescription: string;
  anomalyDescriptionAr: string;
  detectedDate: string;
  recommendedAction: string;
  recommendedActionAr: string;
}

export interface MaintenanceItem {
  id: string;
  title: string;
  titleAr: string;
  triggerType: 'mileage' | 'time' | 'fault' | 'ai_prediction' | 'sensor_anomaly';
  status: 'upcoming' | 'overdue' | 'recommended' | 'completed';
  dueDateOrMileage: string;
  estimatedCost?: number;
  severity: SeverityLevel;
  reason: string;
  reasonAr: string;
  recommendedAction: string;
  recommendedActionAr: string;
  completedDate?: string;
  serviceProvider?: string;
}

export interface RentalContextInfo {
  isCurrentlyRented: boolean;
  rentalId?: string;
  rentalStartDate?: string;
  expectedReturnDate?: string;
  branch: string;
  branchAr: string;
  renterReference?: string; // Anonymized, e.g. "Customer #RN-8492" (no personal data)
  pastRentalsCount: number;
  cleanReturnsCount: number;
  issuesReportedCount: number;
}

export interface InspectionCondition {
  exterior: 'good' | 'minor_scratches' | 'damage_noted';
  interior: 'clean' | 'fair' | 'needs_cleaning';
  tires: 'optimal' | 'moderate_wear' | 'attention_needed';
  lights: 'all_functional' | 'bulb_fault';
  warningLights: string[];
  fuelLevel: number;
  mileage: number;
  healthScore: number;
  activeFaultsCount: number;
}

export interface InspectionRecord {
  id: string;
  vehicleId: string;
  rentalId?: string;
  type: 'before_rental' | 'post_rental' | 'routine';
  date: string;
  inspectorName: string;
  mileage: number;
  healthScore: number;
  condition: InspectionCondition;
  notes: string;
  notesAr: string;
  faultsDetected: string[];
  photos?: string[];
}

export interface TimelineEvent {
  rentalId?: string;
  id: string;
  vehicleId?: string;
  date?: string;
  time?: string;
  timestamp?: string;
  type: 'inspection' | 'rental_start' | 'rental_return' | 'fault_detected' | 'ai_prediction' | 'maintenance' | 'device_event' | 'sensor_anomaly' | 'health_change' | 'status_change';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  severity?: SeverityLevel;
  healthImpact?: number; // e.g. -5
  meta?: Record<string, string | number>;
}

export interface OBDDevice {
  id: string; // e.g., OBD-48291
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  plateNumber?: string;
  plateNumberAr?: string;
  branch?: string;
  branchAr?: string;
  connectionStatus: DeviceConnectionStatus;
  lastPing: string;
  offlineDurationHours?: number;
  installationDate: string;
  deviceHealth: 'good' | 'warning' | 'critical';
  batteryPercent: number;
  signalStrengthDbm: number;
  firmwareVersion: string;
  protocol: string;
  tamperStatus?: 'secured' | 'tamper_detected' | 'unplugged';
  carrier?: string;
  imei?: string;
  iccid?: string;
  busLatencyMs?: number;
  pollingRateHz?: number;
  sleepMode?: boolean;
  portVoltage?: number;
}

export interface ManualFieldInspectionData {
  lastInspectedDate: string;
  inspectorName: string;
  inspectorNameAr: string;
  branch: string;
  branchAr: string;
  brakePads: {
    frontThicknessMm: number;
    rearThicknessMm: number;
    status: 'optimal' | 'moderate' | 'needs_replacement';
    estimatedRemainingKm: number;
    measurementMethod: string;
    measurementMethodAr: string;
  };
  tires: {
    treadDepthMm: number;
    visualCondition: 'optimal' | 'moderate_wear' | 'uneven_wear' | 'attention';
    visualConditionAr: string;
    sidewallConditionAr: string;
    measurementMethod: string;
    measurementMethodAr: string;
  };
  interiorCleanliness: {
    status: 'sanitized_clean' | 'fair' | 'needs_wash';
    statusAr: string;
    notesAr: string;
  };
  exteriorBody: {
    scratchesCount: number;
    dentsCount: number;
    glassConditionAr: string;
    notesAr: string;
  };
  safetyAndLegalKit: {
    registrationValid: boolean;
    insuranceValid: boolean;
    fahasValid: boolean;
    spareTirePresent: boolean;
    jackAndToolkitPresent: boolean;
    fireExtinguisherPresent: boolean;
    emergencyTrianglePresent: boolean;
  };
}

export interface Vehicle {
  contracts?: RentalContract[];
  locations?: {latitude: number; longitude: number; timestamp: string; source: string}[];
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  plateNumber: string;
  plateNumberAr: string;
  vin: string;
  branch: string;
  branchAr: string;
  healthScore: number; // 0 - 100
  healthStatus: HealthStatus;
  healthTrend: { date: string; score: number }[];
  healthScoreChangeReason: string;
  healthScoreChangeReasonAr: string;
  status: RentalStatus;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  primaryRiskIssue: string;
  primaryRiskIssueAr: string;
  mileageKm: number;
  nextMaintenanceDate: string;
  nextMaintenanceKm: number;
  deviceId: string;
  deviceStatus: DeviceConnectionStatus;
  rentalContext: RentalContextInfo;
  sensorData: VehicleSensorData;
  activeFaults: FaultCode[];
  resolvedFaults: FaultCode[];
  aiPredictions: AIPrediction[];
  earlyWarnings: EarlyWarning[];
  maintenanceList: MaintenanceItem[];
  inspections: InspectionRecord[];
  timeline: TimelineEvent[];
  manualInspectionData?: ManualFieldInspectionData;
}

export interface FleetStats {
  totalVehicles: number;
  onlineVehicles: number;
  healthyVehicles: number;
  attentionVehicles: number;
  criticalVehicles: number;
  averageHealthScore: number;
  healthScoreTrendPct: number; // e.g. +3.2%
  activeFaultsTotal: number;
  recurringFaultsTotal: number;
  overdueMaintenanceTotal: number;
  highRiskVehiclesTotal: number;
  offlineDevicesTotal: number;
}

export interface NotificationItem {
  id: string;
  type: 'critical_fault' | 'recurring_fault' | 'ai_prediction' | 'device_offline' | 'maintenance_overdue' | 'abnormal_behavior';
  severity: SeverityLevel;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleName: string;
  timestamp: string;
  isRead: boolean;
  recommendedAction: string;
  recommendedActionAr: string;
}

export type ActiveNavSection = 
  | 'dashboard'
  | 'vehicles'
  | 'diagnostics'
  | 'intelligence'
  | 'operations'
  | 'devices'
  | 'reports'
  | 'settings';

export interface RentalContract {
  id: string;
  renterName: string;
  startDate: string;
  expectedReturnDate: string;
  dailyRate: number;
  status: 'draft' | 'active' | 'returned' | 'cancelled';
  returnedAt?: string;
}
