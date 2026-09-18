// Pump and Motor Control Types

export type PumpStatus = 'RUNNING' | 'STOPPED' | 'STARTING' | 'TRIPPED';

export type PumpTripReason = 
  | 'NONE'
  | 'DRY_RUN_PROTECTION'
  | 'OVERCURRENT_PROTECTION'
  | 'UNDERVOLTAGE_LOCKOUT'
  | 'THERMAL_OVERLOAD'
  | 'MANUAL_EMERGENCY_STOP'
  | 'WATER_TANK_FULL'
  | 'WATER_TANK_EMPTY';

export interface SafetyCutoffEvent {
  id: string;
  timestamp: string;
  reason: PumpTripReason;
  title: string;
  description: string;
  deviceId: string;
  fieldId: string;
  triggerCurrent?: number;
  triggerVoltage?: number;
  durationMs?: number;
  resolved: boolean;
}

export interface PumpLogEntry {
  id: string;
  timestamp: string;
  action: 'MANUAL_START' | 'MANUAL_STOP' | 'AUTO_SAFETY_STOP' | 'SCHEDULED_START' | 'AI_RECOMMENDED_START';
  operator: string;
  notes?: string;
  durationMinutes?: number;
  currentAmps?: number;
  voltageVolts?: number;
}

export interface PumpDetails {
  id: string;
  name: string;
  deviceId: string;
  fieldId: string;
  status: PumpStatus;
  hpRating: number;          // e.g. 5 HP / 7.5 HP
  ratedCurrent: number;      // e.g. 15 A
  maxCurrentTrip: number;    // e.g. 18 A
  dryRunCurrentThreshold: number; // e.g. 1.5 A
  totalRuntimeHours: number;
  currentRuntimeMinutes: number;
  lastActionTimestamp: string;
  lastActionType: 'MANUAL' | 'AUTO_CUTOFF' | 'SCHEDULE';
  activeSafetyTrip: SafetyCutoffEvent | null;
}
