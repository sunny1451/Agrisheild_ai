import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { SensorReading, HistoricalReading, DeviceInfo, FaultSimulationType, ConnectionState, MotorizedGatewayState } from '../types/telemetry';
import { FieldInfo, FarmInfo } from '../types/field';
import { PumpDetails, SafetyCutoffEvent, PumpLogEntry, PumpTripReason } from '../types/pump';
import { AlertItem } from '../types/alerts';
import { AiMotorRiskAssessment, IrrigationRecommendation, PredictiveMaintenanceEstimate } from '../types/ai';
import { UserProfile, AppSettings, LanguageCode } from '../types/user';
import { ThemeId, ThemeConfig, THEME_CONFIGS } from '../types/theme';
import { WaterTankState, getWaterTankState, evaluatePumpStartEligibility, WATER_TANK_THRESHOLDS } from '../types/waterTank';
import { INITIAL_FARMS, INITIAL_FIELDS, INITIAL_DEVICES } from '../services/deviceService';
import { INITIAL_PUMPS, INITIAL_PUMP_LOGS } from '../services/pumpService';
import { INITIAL_ALERTS, alertService } from '../services/alertService';
import { sensorService, generateHistory } from '../services/sensorService';
import { aiService } from '../services/aiService';
import { authService } from '../services/authService';
import { SimulatorState, INITIAL_SIMULATOR_STATE } from '../services/simulatorService';
import { translations, Translations } from '../locales/translations';

interface BlockedStartInfo {
  title: string;
  reason: string;
  detail: string;
}

interface AppContextType {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Selected State
  selectedFarm: FarmInfo;
  selectedField: FieldInfo;
  selectedDevice: DeviceInfo;
  setSelectedFieldId: (fieldId: string) => void;
  setSelectedDeviceId: (deviceId: string) => void;

  // Lists
  farms: FarmInfo[];
  fields: FieldInfo[];
  devices: DeviceInfo[];
  addField: (newField: Omit<FieldInfo, 'id'> & { id?: string }) => FieldInfo;
  deleteField: (id: string) => void;

  // Real-time Telemetry
  currentReading: SensorReading;
  previousReading: SensorReading;
  healthScore: number;
  history24h: HistoricalReading[];
  history7d: HistoricalReading[];
  history30d: HistoricalReading[];
  connectionStatus: ConnectionState;

  // Water Tank & Safety State
  waterTankState: WaterTankState;
  blockedStartAttempt: BlockedStartInfo | null;
  clearBlockedStartAttempt: () => void;
  checkPumpStartEligibility: (targetDeviceId?: string) => { allowed: boolean; title?: string; reason?: string; detail?: string };

  // Pump & Actuation
  pumpDetails: PumpDetails;
  allPumps: Record<string, PumpDetails>;
  pumpLogs: PumpLogEntry[];
  startPump: (deviceId?: string, notes?: string) => boolean;
  stopPump: (deviceId?: string, notes?: string, isAutoSafety?: boolean, tripReason?: PumpTripReason) => void;
  resetSafetyTrip: (deviceId?: string) => void;
  addPump: (newPumpData: {
    name: string;
    hpRating: number;
    deviceId?: string;
    fieldId?: string;
    ratedCurrent?: number;
    maxCurrentTrip?: number;
    dryRunCurrentThreshold?: number;
  }) => PumpDetails;
  deletePump: (deviceId: string) => void;

  // AI & Analytics
  aiMotorRisk: AiMotorRiskAssessment;
  irrigationRecommendation: IrrigationRecommendation;
  maintenanceEstimate: PredictiveMaintenanceEstimate;

  // Alerts
  alerts: AlertItem[];
  unreadAlertsCount: number;
  markAlertAsRead: (alertId: string) => void;
  markAllAlertsAsRead: () => void;
  clearAlert: (alertId: string) => void;

  // Simulator
  simulator: SimulatorState;
  triggerFault: (type: FaultSimulationType) => void;
  clearFault: () => void;
  setManualOverride: (key: keyof SimulatorState['manualOverrides'], val: number | undefined) => void;
  toggleAutoLoop: () => void;
  simulateWaterLevel: (level: number) => void;
  simulateEmptyTank: () => void;
  simulateLowWater: () => void;
  simulateNormalLevel: () => void;
  simulateFullTank: () => void;

  // Settings & Localization
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  themeId: ThemeId;
  setThemeId: (theme: ThemeId) => void;
  themeConfig: ThemeConfig;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;

  // Navigation
  activeRoute: string;
  navigateTo: (route: string, param?: string) => void;
  routeParam?: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Motorized Gateway (IoT Edge Controller)
  motorizedGateway: MotorizedGatewayState;
  toggleMotorizedGateway: () => void;
  activateMotorizedGateway: () => void;
  deactivateMotorizedGateway: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User auth state
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  // Settings & Locale
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('agrishield_settings');
    return saved ? JSON.parse(saved) : {
      language: 'en',
      accessibility: {
        highContrast: false,
        largeText: false,
        simpleMode: false
      },
      notifications: {
        criticalSms: true,
        soundAlerts: true,
        emailDigest: false,
        pushEnabled: true
      },
      thresholds: {
        overcurrentAmps: 18.0,
        dryRunAmps: 1.5,
        dryRunTimeoutSeconds: 10,
        lowMoisturePercent: 35.0
      }
    };
  });

  const language = settings.language;
  const t = translations[language] || translations.en;

  const themeId: ThemeId = settings.themeId || 'ocean';
  const themeConfig: ThemeConfig = THEME_CONFIGS[themeId] || THEME_CONFIGS.ocean;

  const setThemeId = (newTheme: ThemeId) => {
    updateSettings({ themeId: newTheme });
  };

  // Farms, Fields, Devices
  const [farms] = useState<FarmInfo[]>(INITIAL_FARMS);
  const [fields, setFields] = useState<FieldInfo[]>(() => {
    const saved = localStorage.getItem('agrishield_fields');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error loading saved fields', e);
      }
    }
    return INITIAL_FIELDS;
  });
  const [devices, setDevices] = useState<DeviceInfo[]>(INITIAL_DEVICES);

  const [selectedFieldId, setSelectedFieldIdState] = useState<string>(() => {
    const saved = localStorage.getItem('agrishield_selected_field');
    return saved || 'field-01';
  });
  const selectedField = fields.find(f => f.id === selectedFieldId) || fields[0] || INITIAL_FIELDS[0];
  const selectedDevice = devices.find(d => d.id === selectedField.deviceId) || devices[0];

  const addField = (newFieldData: Omit<FieldInfo, 'id'> & { id?: string }): FieldInfo => {
    const nextNum = fields.length + 1;
    const newId = newFieldData.id || `field-${String(nextNum).padStart(2, '0')}`;
    const newField: FieldInfo = {
      id: newId,
      name: newFieldData.name,
      farmId: 'farm-01',
      cropType: newFieldData.cropType,
      areaAcres: Number(newFieldData.areaAcres) || 2.5,
      soilType: newFieldData.soilType || 'Clay Loam',
      stage: newFieldData.stage || 'Vegetative Phase',
      healthScore: newFieldData.healthScore || 90,
      deviceId: newFieldData.deviceId || (devices[nextNum % devices.length]?.id || 'DEV-ESP32-01'),
      moistureThresholdMin: 35,
      moistureThresholdMax: 80,
      coordinates: {
        lat: 16.5 + (nextNum * 0.005),
        lng: 81.8 + (nextNum * 0.005)
      }
    };

    const updated = [...fields, newField];
    setFields(updated);
    localStorage.setItem('agrishield_fields', JSON.stringify(updated));
    setSelectedFieldIdState(newId);
    localStorage.setItem('agrishield_selected_field', newId);
    return newField;
  };

  const deleteField = (id: string) => {
    const updated = fields.filter(f => f.id !== id);
    if (updated.length > 0) {
      setFields(updated);
      localStorage.setItem('agrishield_fields', JSON.stringify(updated));
      if (selectedFieldId === id) {
        setSelectedFieldIdState(updated[0].id);
        localStorage.setItem('agrishield_selected_field', updated[0].id);
      }
    }
  };

  // Pumps state
  const [allPumps, setAllPumps] = useState<Record<string, PumpDetails>>(() => {
    const saved = localStorage.getItem('agrishield_pumps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PUMPS;
      }
    }
    return INITIAL_PUMPS;
  });
  const [pumpLogs, setPumpLogs] = useState<PumpLogEntry[]>(INITIAL_PUMP_LOGS);
  const currentPump = allPumps[selectedDevice.id] || Object.values(allPumps)[0] || INITIAL_PUMPS['DEV-ESP32-01'];

  const addPump = (newPumpData: {
    name: string;
    hpRating: number;
    deviceId?: string;
    fieldId?: string;
    ratedCurrent?: number;
    maxCurrentTrip?: number;
    dryRunCurrentThreshold?: number;
  }): PumpDetails => {
    const pumpCount = Object.keys(allPumps).length + 1;
    const newPumpId = `pump-${String(pumpCount).padStart(2, '0')}`;
    const targetDeviceId = newPumpData.deviceId || `DEV-ESP32-${String(pumpCount).padStart(2, '0')}`;
    const targetFieldId = newPumpData.fieldId || (fields[0]?.id || 'field-01');
    const hp = Number(newPumpData.hpRating) || 5;
    const rated = newPumpData.ratedCurrent || Math.round(hp * 1.95 * 10) / 10;
    const maxTrip = newPumpData.maxCurrentTrip || Math.round(rated * 1.25 * 10) / 10;
    const dryRun = newPumpData.dryRunCurrentThreshold || Math.round(rated * 0.15 * 10) / 10;

    const newPump: PumpDetails = {
      id: newPumpId,
      name: newPumpData.name,
      deviceId: targetDeviceId,
      fieldId: targetFieldId,
      status: 'STOPPED',
      hpRating: hp,
      ratedCurrent: rated,
      maxCurrentTrip: maxTrip,
      dryRunCurrentThreshold: dryRun,
      totalRuntimeHours: 0,
      currentRuntimeMinutes: 0,
      lastActionTimestamp: new Date().toISOString(),
      lastActionType: 'MANUAL',
      activeSafetyTrip: null
    };

    const updatedPumps = {
      ...allPumps,
      [targetDeviceId]: newPump
    };
    setAllPumps(updatedPumps);
    localStorage.setItem('agrishield_pumps', JSON.stringify(updatedPumps));

    // Ensure matching field/device is selected
    if (targetFieldId) {
      setSelectedFieldIdState(targetFieldId);
      localStorage.setItem('agrishield_selected_field', targetFieldId);
    }
    return newPump;
  };

  const deletePump = (deviceId: string) => {
    const updated = { ...allPumps };
    delete updated[deviceId];
    if (Object.keys(updated).length > 0) {
      setAllPumps(updated);
      localStorage.setItem('agrishield_pumps', JSON.stringify(updated));
    }
  };

  // Alerts state
  const [alerts, setAlerts] = useState<AlertItem[]>(() => alertService.getInitialAlerts());

  // Navigation state
  const [activeRoute, setActiveRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || '/dashboard';
  });
  const [routeParam, setRouteParam] = useState<string | undefined>();

  // Telemetry state for selected device
  const [currentReading, setCurrentReading] = useState<SensorReading>(() => 
    sensorService.getInitialReading(selectedDevice.id)
  );
  const [previousReading, setPreviousReading] = useState<SensorReading>(currentReading);
  const [healthScore, setHealthScore] = useState<number>(87);

  // Historical data
  const [history24h, setHistory24h] = useState<HistoricalReading[]>(() =>
    generateHistory(selectedDevice.id, 24, currentReading)
  );
  const [history7d, setHistory7d] = useState<HistoricalReading[]>(() =>
    generateHistory(selectedDevice.id, 168, currentReading)
  );
  const [history30d, setHistory30d] = useState<HistoricalReading[]>(() =>
    generateHistory(selectedDevice.id, 720, currentReading)
  );

  // Simulator state
  const [simulator, setSimulator] = useState<SimulatorState>(INITIAL_SIMULATOR_STATE);

  // Safety cutoff timers ref
  const dryRunTimerRef = useRef<number>(0);
  const overcurrentTimerRef = useRef<number>(0);

  // Water tank state and blocked start state
  const prevWaterTankStateRef = useRef<WaterTankState>(getWaterTankState(currentReading.waterLevel));
  const [blockedStartAttempt, setBlockedStartAttempt] = useState<BlockedStartInfo | null>(null);

  const clearBlockedStartAttempt = useCallback(() => {
    setBlockedStartAttempt(null);
  }, []);

  // Mobile Drawer Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Motorized Gateway (IoT Edge Controller state)
  const [motorizedGateway, setMotorizedGateway] = useState<MotorizedGatewayState>(() => {
    const saved = localStorage.getItem('agrishield_motorized_gateway');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      isActive: false,
      status: 'INACTIVE',
      connection: 'OFFLINE',
      motor: 'STOPPED',
      lastActivity: 'System standby — Initialized',
      isSimulated: true
    };
  });

  const activateMotorizedGateway = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newState: MotorizedGatewayState = {
      isActive: true,
      status: 'ACTIVE',
      connection: 'ONLINE',
      motor: 'READY',
      lastActivity: `Activated at ${timeStr}`,
      isSimulated: true
    };
    setMotorizedGateway(newState);
    localStorage.setItem('agrishield_motorized_gateway', JSON.stringify(newState));
    setDevices(prev => prev.map(d => d.id === selectedDevice.id ? { ...d, status: 'ONLINE' as ConnectionState } : d));
  }, [selectedDevice.id]);

  const deactivateMotorizedGateway = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newState: MotorizedGatewayState = {
      isActive: false,
      status: 'INACTIVE',
      connection: 'OFFLINE',
      motor: 'STOPPED',
      lastActivity: `Deactivated at ${timeStr}`,
      isSimulated: true
    };
    setMotorizedGateway(newState);
    localStorage.setItem('agrishield_motorized_gateway', JSON.stringify(newState));
    setDevices(prev => prev.map(d => d.id === selectedDevice.id ? { ...d, status: 'OFFLINE' as ConnectionState } : d));
  }, [selectedDevice.id]);

  const toggleMotorizedGateway = useCallback(() => {
    if (motorizedGateway.isActive) {
      deactivateMotorizedGateway();
    } else {
      activateMotorizedGateway();
    }
  }, [motorizedGateway.isActive, activateMotorizedGateway, deactivateMotorizedGateway]);

  // Navigation handler
  const navigateTo = useCallback((route: string, param?: string) => {
    setActiveRoute(route);
    setRouteParam(param);
    setIsMobileMenuOpen(false);
    window.location.hash = param ? `${route}/${param}` : route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync with browser hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      if (hash.startsWith('/fields/')) {
        const parts = hash.split('/');
        setActiveRoute('/fields/:id');
        setRouteParam(parts[2] || 'field-01');
      } else {
        setActiveRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Helper to add event to simulator log
  const logSimEvent = useCallback((message: string, type: 'info' | 'warning' | 'critical' | 'action') => {
    setSimulator(prev => ({
      ...prev,
      eventLog: [
        {
          id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toISOString(),
          message,
          type
        },
        ...prev.eventLog.slice(0, 49) // Keep last 50
      ]
    }));
  }, []);

  // Water Tank State Transition Engine (Failsafe & Deduplicated Notification)
  const processWaterLevelStateTransition = useCallback((
    newLevel: number,
    targetDevId: string = selectedDevice.id
  ) => {
    const clampedLevel = Math.max(0, Math.min(100, Math.round(newLevel)));
    const prevState = prevWaterTankStateRef.current;
    const newState = getWaterTankState(clampedLevel);

    // Update state ref
    prevWaterTankStateRef.current = newState;

    // Deduplicate: if state has not transitioned across safety boundaries, do not re-emit
    if (prevState === newState) {
      return;
    }

    const pump = allPumps[targetDevId] || currentPump;
    const isPumpCurrentlyRunning = pump.status === 'RUNNING';

    // 1. TRANSITION TO FULL (>= 95%)
    if (newState === 'FULL' && prevState !== 'FULL') {
      const newAlert = alertService.createAlert({
        type: 'WATER_TANK_FULL',
        severity: 'INFO',
        title: '🟢 WATER TANK FULL',
        description: 'The water tank is full. The irrigation pump has been automatically stopped.',
        deviceId: targetDevId,
        fieldId: pump.fieldId || selectedField.id,
        fieldName: selectedField.name,
        waterLevel: clampedLevel,
        actionRequired: false,
        suggestedAction: 'Water reservoir filled to maximum threshold (>=95%). Automatic protection engaged.'
      });
      setAlerts(prev => [newAlert, ...prev]);

      if (isPumpCurrentlyRunning) {
        const tripEvent: SafetyCutoffEvent = {
          id: `trip-tank-full-${Date.now()}`,
          timestamp: new Date().toISOString(),
          reason: 'WATER_TANK_FULL',
          title: 'WATER TANK FULL',
          description: 'The water tank is full. The irrigation pump has been automatically stopped.',
          deviceId: targetDevId,
          fieldId: pump.fieldId || selectedField.id,
          resolved: false
        };

        setAllPumps(prev => ({
          ...prev,
          [targetDevId]: {
            ...(prev[targetDevId] || pump),
            status: 'STOPPED',
            lastActionTimestamp: new Date().toISOString(),
            lastActionType: 'AUTO_CUTOFF',
            activeSafetyTrip: tripEvent
          }
        }));

        const newLog: PumpLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'AUTO_SAFETY_STOP',
          operator: 'Automatic Safety Stop',
          notes: 'Reason: Water Tank Full',
          durationMinutes: pump.currentRuntimeMinutes,
          currentAmps: 0,
          voltageVolts: 228
        };
        setPumpLogs(prev => [newLog, ...prev]);

        logSimEvent(`🟢 WATER TANK FULL: Tank level reached ${clampedLevel}%. Pump automatically stopped.`, 'action');
      } else {
        logSimEvent(`🟢 WATER TANK FULL: Tank level reached ${clampedLevel}%. Pump is OFF.`, 'info');
      }
    }

    // 2. TRANSITION TO EMPTY (0%)
    else if (newState === 'EMPTY' && prevState !== 'EMPTY') {
      const newAlert = alertService.createAlert({
        type: 'WATER_TANK_EMPTY',
        severity: 'CRITICAL',
        title: '🔴 WATER TANK EMPTY',
        description: 'The water tank is empty. The irrigation pump has been automatically stopped to prevent unsafe operation.',
        deviceId: targetDevId,
        fieldId: pump.fieldId || selectedField.id,
        fieldName: selectedField.name,
        waterLevel: clampedLevel,
        actionRequired: true,
        suggestedAction: 'Refill the water reservoir before attempting to restart irrigation.'
      });
      setAlerts(prev => [newAlert, ...prev]);

      if (isPumpCurrentlyRunning) {
        const tripEvent: SafetyCutoffEvent = {
          id: `trip-tank-empty-${Date.now()}`,
          timestamp: new Date().toISOString(),
          reason: 'WATER_TANK_EMPTY',
          title: 'WATER TANK EMPTY',
          description: 'The water tank is empty. The irrigation pump has been automatically stopped to prevent unsafe operation.',
          deviceId: targetDevId,
          fieldId: pump.fieldId || selectedField.id,
          resolved: false
        };

        setAllPumps(prev => ({
          ...prev,
          [targetDevId]: {
            ...(prev[targetDevId] || pump),
            status: 'STOPPED',
            lastActionTimestamp: new Date().toISOString(),
            lastActionType: 'AUTO_CUTOFF',
            activeSafetyTrip: tripEvent
          }
        }));

        const newLog: PumpLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'AUTO_SAFETY_STOP',
          operator: 'Automatic Safety Stop',
          notes: 'Reason: Water Tank Empty',
          durationMinutes: pump.currentRuntimeMinutes,
          currentAmps: 0,
          voltageVolts: 228
        };
        setPumpLogs(prev => [newLog, ...prev]);

        logSimEvent(`🔴 WATER TANK EMPTY: Tank level reached 0%. Pump automatically stopped to prevent unsafe operation.`, 'critical');
      } else {
        logSimEvent(`🔴 WATER TANK EMPTY: Tank level reached 0%. Pump is OFF.`, 'warning');
      }
    }

    // 3. TRANSITION TO LOW (1% - 29%)
    else if (newState === 'LOW' && prevState !== 'LOW') {
      const newAlert = alertService.createAlert({
        type: 'WATER_TANK_LOW',
        severity: 'WARNING',
        title: '🟠 LOW WATER LEVEL',
        description: 'Water tank level is low. Consider refilling the tank before irrigation.',
        deviceId: targetDevId,
        fieldId: pump.fieldId || selectedField.id,
        fieldName: selectedField.name,
        waterLevel: clampedLevel,
        actionRequired: false,
        suggestedAction: 'Consider scheduling reservoir refill.'
      });
      setAlerts(prev => [newAlert, ...prev]);
      logSimEvent(`🟠 LOW WATER LEVEL: Tank level at ${clampedLevel}%. Warning logged. Pump continues running if active.`, 'warning');
    }

    // 4. TRANSITION TO NORMAL (30% - 94%)
    else if (newState === 'NORMAL' && prevState !== 'NORMAL') {
      // Clear active water-level safety condition from pump lockout
      setAllPumps(prev => {
        const p = prev[targetDevId] || pump;
        if (p.activeSafetyTrip && (p.activeSafetyTrip.reason === 'WATER_TANK_FULL' || p.activeSafetyTrip.reason === 'WATER_TANK_EMPTY')) {
          return {
            ...prev,
            [targetDevId]: {
              ...p,
              activeSafetyTrip: null
            }
          };
        }
        return prev;
      });

      // Clear any blocked start attempt
      setBlockedStartAttempt(null);

      // Do NOT automatically restart pump! Pump must remain OFF.
      if (prevState === 'FULL' || prevState === 'EMPTY') {
        const recoveryDesc = prevState === 'FULL'
          ? 'The water level has returned to the normal operating range.'
          : 'Water level has returned to a safe operating range.';

        const newAlert = alertService.createAlert({
          type: 'WATER_TANK_NORMAL',
          severity: 'INFO',
          title: '🟢 WATER LEVEL NORMAL',
          description: recoveryDesc,
          deviceId: targetDevId,
          fieldId: pump.fieldId || selectedField.id,
          fieldName: selectedField.name,
          waterLevel: clampedLevel,
          actionRequired: false
        });
        setAlerts(prev => [newAlert, ...prev]);
        logSimEvent(`🟢 WATER LEVEL NORMAL: Water level returned to ${clampedLevel}%. Safety condition cleared. Pump remains OFF until manually started.`, 'info');
      }
    }
  }, [allPumps, currentPump, selectedDevice.id, selectedField.id, selectedField.name, logSimEvent]);

  // Check pump start eligibility helper
  const checkPumpStartEligibility = useCallback((targetDeviceId?: string) => {
    const targetDevId = targetDeviceId || selectedDevice.id;
    const pump = allPumps[targetDevId] || currentPump;
    
    // Check tank level eligibility
    const waterEligibility = evaluatePumpStartEligibility(currentReading.waterLevel);
    if (!waterEligibility.allowed) {
      return waterEligibility;
    }

    // Check electrical hardware cutoff
    if (pump.activeSafetyTrip && !pump.activeSafetyTrip.resolved) {
      return {
        allowed: false,
        title: 'PUMP START BLOCKED',
        reason: 'Active Safety Cutoff Lockout',
        detail: `Active safety cutoff (${pump.activeSafetyTrip.title}) requires inspection/reset before pump can start.`
      };
    }

    return { allowed: true };
  }, [allPumps, currentPump, currentReading.waterLevel, selectedDevice.id]);

  // Pump control functions
  const startPump = useCallback((deviceId?: string, notes?: string): boolean => {
    const targetDevId = deviceId || selectedDevice.id;
    const pump = allPumps[targetDevId];
    if (!pump) return false;

    // Check Water Tank Safety Eligibility
    const waterEligibility = evaluatePumpStartEligibility(currentReading.waterLevel);
    if (!waterEligibility.allowed) {
      setBlockedStartAttempt({
        title: waterEligibility.title || 'PUMP START BLOCKED',
        reason: waterEligibility.reason || 'The water tank is in an unsafe state.',
        detail: waterEligibility.detail || 'Resolve the water tank condition before restarting the pump.'
      });
      logSimEvent(`PUMP START BLOCKED: ${waterEligibility.detail} (Tank level: ${currentReading.waterLevel}%)`, 'warning');
      return false;
    }

    // Check electrical safety trip lockout
    if (pump.activeSafetyTrip && !pump.activeSafetyTrip.resolved) {
      setBlockedStartAttempt({
        title: 'PUMP START BLOCKED',
        reason: 'Active Safety Cutoff Lockout',
        detail: `Cannot start pump: Active safety cutoff (${pump.activeSafetyTrip.title}) requires inspection/reset first.`
      });
      return false;
    }

    // Clear blocked start notice if start succeeds
    setBlockedStartAttempt(null);

    const updatedPump: PumpDetails = {
      ...pump,
      status: 'RUNNING',
      lastActionTimestamp: new Date().toISOString(),
      lastActionType: 'MANUAL',
      currentRuntimeMinutes: 0,
      activeSafetyTrip: null
    };

    setAllPumps(prev => ({ ...prev, [targetDevId]: updatedPump }));

    // Add log to Pump History
    const newLog: PumpLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'MANUAL_START',
      operator: user?.fullName || 'Farmer Ramesh',
      notes: notes || 'Status: Successful',
      currentAmps: 8.4,
      voltageVolts: 228
    };
    setPumpLogs(prev => [newLog, ...prev]);

    logSimEvent(`Manual Start: Pump energized successfully on device ${targetDevId}`, 'action');
    return true;
  }, [allPumps, selectedDevice.id, currentReading.waterLevel, user, logSimEvent]);

  const stopPump = useCallback((
    deviceId?: string,
    notes?: string,
    isAutoSafety: boolean = false,
    tripReason: PumpTripReason = 'NONE'
  ) => {
    const targetDevId = deviceId || selectedDevice.id;
    const pump = allPumps[targetDevId];
    if (!pump) return;

    let safetyEvent: SafetyCutoffEvent | null = null;

    if (isAutoSafety) {
      const isDryRun = tripReason === 'DRY_RUN_PROTECTION';
      const isOvercurrent = tripReason === 'OVERCURRENT_PROTECTION';
      const isTankFull = tripReason === 'WATER_TANK_FULL';
      const isTankEmpty = tripReason === 'WATER_TANK_EMPTY';

      safetyEvent = {
        id: `trip-${Date.now()}`,
        timestamp: new Date().toISOString(),
        reason: tripReason,
        title: isDryRun
          ? 'DRY-RUN DETECTED'
          : isOvercurrent
          ? 'OVERCURRENT DETECTED'
          : isTankFull
          ? 'WATER TANK FULL'
          : isTankEmpty
          ? 'WATER TANK EMPTY'
          : 'AUTOMATIC SAFETY STOP',
        description: isDryRun
          ? 'Motor current fell below 1.5A for > 10 continuous seconds. Automatic safety shutoff engaged to prevent cavitation.'
          : isOvercurrent
          ? 'Motor current surged above 18A for > 2 continuous seconds. Automatic safety shutoff engaged to prevent winding burnout.'
          : isTankFull
          ? 'The water tank is full. The irrigation pump has been automatically stopped.'
          : isTankEmpty
          ? 'The water tank is empty. The irrigation pump has been automatically stopped to prevent unsafe operation.'
          : 'Automatic safety stop engaged.',
        deviceId: targetDevId,
        fieldId: pump.fieldId,
        triggerCurrent: isDryRun ? 0.8 : isOvercurrent ? 21.4 : 0,
        triggerVoltage: 224,
        durationMs: isDryRun ? 10000 : 2000,
        resolved: false
      };

      // Create high-visibility Alert for electrical cutoffs (tank alerts handled in processWaterLevelStateTransition)
      if (isDryRun || isOvercurrent) {
        const newAlert = alertService.createAlert({
          type: isDryRun ? 'DRY_RUN' : 'OVERCURRENT',
          severity: 'CRITICAL',
          title: isDryRun ? 'Dry-Run Condition Detected' : 'Overcurrent Detected — Safety Cutoff',
          description: isDryRun
            ? `Pump automatically stopped on ${targetDevId} because a dry-run condition was detected (<1.5A for >10s).`
            : `Pump automatically stopped on ${targetDevId} because current exceeded 18A threshold (surged to 21.4A).`,
          deviceId: targetDevId,
          fieldId: pump.fieldId,
          fieldName: selectedField.name,
          actionRequired: true,
          suggestedAction: isDryRun ? 'Verify borewell water recovery' : 'Inspect impeller and wiring'
        });

        setAlerts(prev => [newAlert, ...prev]);
      }

      logSimEvent(`AUTOMATIC SAFETY CUTOFF: Pump halted on ${targetDevId} [${tripReason}]`, 'critical');
    } else {
      logSimEvent(`Manual Stop: Pump stopped on device ${targetDevId}`, 'action');
    }

    const updatedPump: PumpDetails = {
      ...pump,
      status: 'STOPPED',
      lastActionTimestamp: new Date().toISOString(),
      lastActionType: isAutoSafety ? 'AUTO_CUTOFF' : 'MANUAL',
      activeSafetyTrip: safetyEvent
    };

    setAllPumps(prev => ({ ...prev, [targetDevId]: updatedPump }));

    // Add log entry
    const logNotes = notes || (
      isAutoSafety
        ? tripReason === 'WATER_TANK_FULL'
          ? 'Reason: Water Tank Full'
          : tripReason === 'WATER_TANK_EMPTY'
          ? 'Reason: Water Tank Empty'
          : `Safety Cutoff: ${tripReason}`
        : 'Manual Stop'
    );

    const newLog: PumpLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: isAutoSafety ? 'AUTO_SAFETY_STOP' : 'MANUAL_STOP',
      operator: isAutoSafety ? 'Automatic Safety Stop' : (user?.fullName || 'Farmer Ramesh'),
      notes: logNotes,
      durationMinutes: pump.currentRuntimeMinutes,
      currentAmps: isAutoSafety ? (tripReason === 'DRY_RUN_PROTECTION' ? 0.8 : tripReason === 'OVERCURRENT_PROTECTION' ? 21.4 : 0) : 0,
      voltageVolts: 228
    };
    setPumpLogs(prev => [newLog, ...prev]);
  }, [allPumps, selectedDevice.id, selectedField.name, user, logSimEvent]);

  const resetSafetyTrip = useCallback((deviceId?: string) => {
    const targetDevId = deviceId || selectedDevice.id;
    setAllPumps(prev => {
      const p = prev[targetDevId];
      if (!p) return prev;
      return {
        ...prev,
        [targetDevId]: {
          ...p,
          activeSafetyTrip: null
        }
      };
    });
    setBlockedStartAttempt(null);
    logSimEvent(`Safety trip latch reset for device ${targetDevId}`, 'info');
  }, [selectedDevice.id, logSimEvent]);

  // Direct Simulator Water Level Actions
  const simulateWaterLevel = useCallback((level: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(level)));
    setSimulator(prev => ({
      ...prev,
      manualOverrides: {
        ...prev.manualOverrides,
        waterLevel: clamped
      }
    }));
    setCurrentReading(prev => ({
      ...prev,
      waterLevel: clamped,
      timestamp: new Date().toISOString()
    }));
    processWaterLevelStateTransition(clamped);
  }, [processWaterLevelStateTransition]);

  const simulateEmptyTank = useCallback(() => {
    simulateWaterLevel(0);
  }, [simulateWaterLevel]);

  const simulateLowWater = useCallback(() => {
    simulateWaterLevel(15);
  }, [simulateWaterLevel]);

  const simulateNormalLevel = useCallback(() => {
    simulateWaterLevel(60);
  }, [simulateWaterLevel]);

  const simulateFullTank = useCallback(() => {
    simulateWaterLevel(98);
  }, [simulateWaterLevel]);

  // Fault simulation triggers
  const triggerFault = useCallback((type: FaultSimulationType) => {
    setSimulator(prev => ({
      ...prev,
      activeFault: type,
      faultTriggeredAt: Date.now(),
      dryRunTimerSeconds: 0,
      overcurrentTimerSeconds: 0
    }));

    if (type === 'DRY_RUN') {
      logSimEvent('Simulator: Dry-run condition initiated. Motor current dropping to 0.8A...', 'warning');
    } else if (type === 'OVERCURRENT') {
      logSimEvent('Simulator: Overcurrent surge initiated. Motor current spiking to 21.4A...', 'warning');
    } else if (type === 'VOLTAGE_DROP') {
      logSimEvent('Simulator: Grid undervoltage fault simulated (Voltage = 168V).', 'warning');
      const newAlert = alertService.createAlert({
        type: 'VOLTAGE_STRESS',
        severity: 'WARNING',
        title: 'Severe Voltage Drop Detected',
        description: 'Line voltage plummeted to 168V. Motor windings are susceptible to thermal stress.',
        deviceId: selectedDevice.id,
        fieldId: selectedField.id,
        fieldName: selectedField.name,
        actionRequired: true,
        suggestedAction: 'Check main phase stabilizer relay.'
      });
      setAlerts(prev => [newAlert, ...prev]);
    } else if (type === 'LOW_MOISTURE') {
      logSimEvent('Simulator: Low soil moisture condition simulated (Moisture = 22.5%).', 'warning');
      const newAlert = alertService.createAlert({
        type: 'SOIL_MOISTURE',
        severity: 'WARNING',
        title: 'Critical Low Soil Moisture',
        description: 'Soil moisture dropped to 22.5% in North Paddy Block. Crop stress imminent.',
        deviceId: selectedDevice.id,
        fieldId: selectedField.id,
        fieldName: selectedField.name,
        actionRequired: true,
        suggestedAction: 'Schedule irrigation cycle now.'
      });
      setAlerts(prev => [newAlert, ...prev]);
    } else if (type === 'DEVICE_OFFLINE') {
      logSimEvent('Simulator: Hardware gateway disconnected (Status = OFFLINE).', 'warning');
      setDevices(prev => prev.map(d => d.id === selectedDevice.id ? { ...d, status: 'OFFLINE' } : d));
    }
  }, [selectedDevice.id, selectedField.id, selectedField.name, logSimEvent]);

  const clearFault = useCallback(() => {
    setSimulator(prev => ({
      ...prev,
      activeFault: 'NORMAL',
      faultTriggeredAt: null,
      dryRunTimerSeconds: 0,
      overcurrentTimerSeconds: 0,
      manualOverrides: {}
    }));
    setDevices(prev => prev.map(d => d.id === selectedDevice.id ? { ...d, status: 'ONLINE' } : d));
    logSimEvent('Simulator: Returned to NORMAL operating condition.', 'info');
  }, [selectedDevice.id, logSimEvent]);

  const setManualOverride = useCallback((key: keyof SimulatorState['manualOverrides'], val: number | undefined) => {
    setSimulator(prev => ({
      ...prev,
      manualOverrides: {
        ...prev.manualOverrides,
        [key]: val
      }
    }));
    if (key === 'waterLevel' && val !== undefined) {
      setCurrentReading(prev => ({
        ...prev,
        waterLevel: val,
        timestamp: new Date().toISOString()
      }));
      processWaterLevelStateTransition(val);
    }
    logSimEvent(`Simulator: Manual override set for ${String(key)}: ${val ?? 'auto'}`, 'info');
  }, [logSimEvent, processWaterLevelStateTransition]);

  const toggleAutoLoop = useCallback(() => {
    setSimulator(prev => ({ ...prev, isAutoLoopEnabled: !prev.isAutoLoopEnabled }));
  }, []);

  // Alert management
  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts(prev => {
      const updated = prev.map(a => a.id === alertId ? { ...a, isRead: true } : a);
      alertService.saveAlerts(updated);
      return updated;
    });
  }, []);

  const markAllAlertsAsRead = useCallback(() => {
    setAlerts(prev => {
      const updated = prev.map(a => ({ ...a, isRead: true }));
      alertService.saveAlerts(updated);
      return updated;
    });
  }, []);

  const clearAlert = useCallback((alertId: string) => {
    setAlerts(prev => {
      const updated = prev.filter(a => a.id !== alertId);
      alertService.saveAlerts(updated);
      return updated;
    });
  }, []);

  // Selected Field / Device change
  const setSelectedFieldId = useCallback((fieldId: string) => {
    setSelectedFieldIdState(fieldId);
    const f = fields.find(item => item.id === fieldId);
    if (f) {
      const d = devices.find(item => item.id === f.deviceId);
      if (d) {
        const initialR = sensorService.getInitialReading(d.id);
        setCurrentReading(initialR);
        setPreviousReading(initialR);
        setHistory24h(generateHistory(d.id, 24, initialR));
        setHistory7d(generateHistory(d.id, 168, initialR));
        setHistory30d(generateHistory(d.id, 720, initialR));
      }
    }
  }, [fields, devices]);

  const setSelectedDeviceId = useCallback((deviceId: string) => {
    const d = devices.find(item => item.id === deviceId);
    if (d) {
      const f = fields.find(item => item.deviceId === deviceId);
      if (f) setSelectedFieldIdState(f.id);
      const initialR = sensorService.getInitialReading(deviceId);
      setCurrentReading(initialR);
      setPreviousReading(initialR);
      setHistory24h(generateHistory(deviceId, 24, initialR));
      setHistory7d(generateHistory(deviceId, 168, initialR));
      setHistory30d(generateHistory(deviceId, 720, initialR));
    }
  }, [devices, fields]);

  // Auth wrappers
  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    setUser(res.user);
    setIsAuthenticated(true);
    navigateTo('/dashboard');
  };

  const register = async (data: any) => {
    const res = await authService.register(data);
    setUser(res.user);
    setIsAuthenticated(true);
    navigateTo('/dashboard');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigateTo('/');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profile };
    setUser(updated);
    localStorage.setItem('agrishield_user', JSON.stringify(updated));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('agrishield_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const setLanguage = (lang: LanguageCode) => {
    updateSettings({ language: lang });
    if (user) {
      updateUserProfile({ language: lang });
    }
  };

  // Main IoT Simulation & Safety Cutoff Clock (runs every 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!simulator.isAutoLoopEnabled) return;

      const isRunning = currentPump.status === 'RUNNING';
      const fault = simulator.activeFault;
      const overrides = simulator.manualOverrides;

      setPreviousReading(currentReading);

      // Compute new values with realistic subtle drift
      let newCurrent = 0;
      if (fault === 'OVERCURRENT') {
        newCurrent = 21.4 + (Math.random() * 0.8 - 0.4);
      } else if (fault === 'DRY_RUN') {
        newCurrent = 0.8 + (Math.random() * 0.2 - 0.1);
      } else if (isRunning) {
        newCurrent = 8.4 + (Math.random() * 0.4 - 0.2);
      }
      if (overrides.motorCurrent !== undefined) newCurrent = overrides.motorCurrent;

      let newVoltage = 228 + (Math.random() * 2 - 1);
      if (fault === 'VOLTAGE_DROP') newVoltage = 168 + (Math.random() * 3 - 1.5);
      if (overrides.voltage !== undefined) newVoltage = overrides.voltage;

      let newMoisture = currentReading.soilMoisture;
      if (fault === 'LOW_MOISTURE') {
        newMoisture = 22.5 + (Math.random() * 0.6 - 0.3);
      } else if (isRunning) {
        newMoisture = Math.min(92, newMoisture + 0.15); // slowly moistens during pump
      } else {
        newMoisture = Math.max(20, newMoisture - 0.05); // slowly evaporates
      }
      if (overrides.soilMoisture !== undefined) newMoisture = overrides.soilMoisture;

      let newWaterLevel = currentReading.waterLevel;
      if (isRunning) newWaterLevel = Math.max(0, newWaterLevel - 0.1);
      if (fault === 'DRY_RUN') newWaterLevel = 18;
      if (overrides.waterLevel !== undefined) newWaterLevel = overrides.waterLevel;

      let newTemp = Math.round((currentReading.temperature + (Math.random() * 0.2 - 0.1)) * 10) / 10;
      if (overrides.temperature !== undefined) newTemp = overrides.temperature;

      let newHumidity = Math.round(currentReading.humidity + (Math.random() * 0.4 - 0.2));
      if (overrides.humidity !== undefined) newHumidity = overrides.humidity;

      const updatedReading: SensorReading = {
        soilMoisture: Math.round(newMoisture * 10) / 10,
        motorCurrent: Math.round(newCurrent * 10) / 10,
        voltage: Math.round(newVoltage),
        waterLevel: Math.round(newWaterLevel),
        temperature: newTemp,
        humidity: newHumidity,
        timestamp: new Date().toISOString()
      };

      setCurrentReading(updatedReading);

      // Process water level safety transitions
      processWaterLevelStateTransition(newWaterLevel);

      // Recalculate health score
      const newHealth = sensorService.calculateHealthScore(updatedReading, isRunning, fault);
      setHealthScore(newHealth);

      // Append to 24h history slice
      setHistory24h(prev => {
        const next = [...prev.slice(1), {
          ...updatedReading,
          healthScore: newHealth,
          pumpRunning: isRunning
        }];
        return next;
      });

      // Update runtime counter if running
      if (isRunning) {
        setAllPumps(prev => {
          const p = prev[selectedDevice.id];
          if (!p) return prev;
          return {
            ...prev,
            [selectedDevice.id]: {
              ...p,
              currentRuntimeMinutes: p.currentRuntimeMinutes + 1,
              totalRuntimeHours: Math.round((p.totalRuntimeHours + (1 / 60)) * 100) / 100
            }
          };
        });
      }

      // SAFETY CUTOFF EVALUATION:
      // 1. Overcurrent check (> 18A for > 2 continuous seconds)
      if (isRunning && updatedReading.motorCurrent > 18.0) {
        overcurrentTimerRef.current += 4;
        setSimulator(prev => ({ ...prev, overcurrentTimerSeconds: overcurrentTimerRef.current }));
        if (overcurrentTimerRef.current >= 2) {
          overcurrentTimerRef.current = 0;
          stopPump(selectedDevice.id, 'Overcurrent surge exceeded 18A threshold', true, 'OVERCURRENT_PROTECTION');
        }
      } else {
        overcurrentTimerRef.current = 0;
      }

      // 2. Dry-run check (< 1.5A for > 10 continuous seconds while running)
      if (isRunning && updatedReading.motorCurrent < 1.5) {
        dryRunTimerRef.current += 4;
        setSimulator(prev => ({ ...prev, dryRunTimerSeconds: dryRunTimerRef.current }));
        if (dryRunTimerRef.current >= 10) {
          dryRunTimerRef.current = 0;
          stopPump(selectedDevice.id, 'Dry-run condition detected (<1.5A for 10s)', true, 'DRY_RUN_PROTECTION');
        }
      } else {
        dryRunTimerRef.current = 0;
      }

    }, 4000);

    return () => clearInterval(interval);
  }, [
    simulator.isAutoLoopEnabled,
    simulator.activeFault,
    simulator.manualOverrides,
    currentPump.status,
    currentReading,
    selectedDevice.id,
    stopPump,
    processWaterLevelStateTransition
  ]);

  // Computed AI evaluations
  const isPumpRunning = currentPump.status === 'RUNNING';
  const aiMotorRisk = aiService.evaluateMotorRisk(currentReading, isPumpRunning, simulator.activeFault);
  const irrigationRecommendation = aiService.getIrrigationRecommendation(currentReading, selectedField.cropType);
  const maintenanceEstimate = aiService.getMaintenanceEstimate(
    currentPump.totalRuntimeHours,
    pumpLogs.filter(l => l.action === 'AUTO_SAFETY_STOP').length
  );
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;
  const currentWaterTankState = getWaterTankState(currentReading.waterLevel);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUserProfile,
        selectedFarm: farms[0],
        selectedField,
        selectedDevice,
        setSelectedFieldId,
        setSelectedDeviceId,
        farms,
        fields,
        devices,
        addField,
        deleteField,
        currentReading,
        previousReading,
        healthScore,
        history24h,
        history7d,
        history30d,
        connectionStatus: selectedDevice.status,
        waterTankState: currentWaterTankState,
        blockedStartAttempt,
        clearBlockedStartAttempt,
        checkPumpStartEligibility,
        pumpDetails: currentPump,
        allPumps,
        pumpLogs,
        startPump,
        stopPump,
        resetSafetyTrip,
        addPump,
        deletePump,
        aiMotorRisk,
        irrigationRecommendation,
        maintenanceEstimate,
        alerts,
        unreadAlertsCount,
        markAlertAsRead,
        markAllAlertsAsRead,
        clearAlert,
        simulator,
        triggerFault,
        clearFault,
        setManualOverride,
        toggleAutoLoop,
        simulateWaterLevel,
        simulateEmptyTank,
        simulateLowWater,
        simulateNormalLevel,
        simulateFullTank,
        settings,
        updateSettings,
        themeId,
        setThemeId,
        themeConfig,
        language,
        setLanguage,
        t,
        activeRoute,
        navigateTo,
        routeParam,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        motorizedGateway,
        toggleMotorizedGateway,
        activateMotorizedGateway,
        deactivateMotorizedGateway
      }}
    >
      <div className={`${settings.accessibility.highContrast ? 'high-contrast-mode' : ''} ${settings.accessibility.largeText ? 'large-text-mode' : ''}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
