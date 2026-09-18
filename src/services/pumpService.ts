import { PumpDetails, PumpStatus, SafetyCutoffEvent, PumpLogEntry } from '../types/pump';

export const INITIAL_PUMPS: Record<string, PumpDetails> = {
  'DEV-ESP32-01': {
    id: 'pump-01',
    name: 'Borewell 7.5 HP Submersible',
    deviceId: 'DEV-ESP32-01',
    fieldId: 'field-01',
    status: 'RUNNING',
    hpRating: 7.5,
    ratedCurrent: 14.5,
    maxCurrentTrip: 18.0,
    dryRunCurrentThreshold: 1.5,
    totalRuntimeHours: 428.5,
    currentRuntimeMinutes: 48,
    lastActionTimestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    lastActionType: 'MANUAL',
    activeSafetyTrip: null
  },
  'DEV-ESP32-02': {
    id: 'pump-02',
    name: 'Cotton Block 5 HP Monobloc',
    deviceId: 'DEV-ESP32-02',
    fieldId: 'field-02',
    status: 'STOPPED',
    hpRating: 5.0,
    ratedCurrent: 9.8,
    maxCurrentTrip: 14.0,
    dryRunCurrentThreshold: 1.2,
    totalRuntimeHours: 312.0,
    currentRuntimeMinutes: 0,
    lastActionTimestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    lastActionType: 'MANUAL',
    activeSafetyTrip: null
  },
  'DEV-ESP32-03': {
    id: 'pump-03',
    name: 'Vegetable Drip 3 HP Solar Hybrid',
    deviceId: 'DEV-ESP32-03',
    fieldId: 'field-03',
    status: 'RUNNING',
    hpRating: 3.0,
    ratedCurrent: 5.8,
    maxCurrentTrip: 8.5,
    dryRunCurrentThreshold: 0.9,
    totalRuntimeHours: 195.2,
    currentRuntimeMinutes: 22,
    lastActionTimestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    lastActionType: 'SCHEDULE',
    activeSafetyTrip: null
  }
};

export const INITIAL_PUMP_LOGS: PumpLogEntry[] = [
  {
    id: 'log-01',
    timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    action: 'MANUAL_START',
    operator: 'Ramesh Patel (Farmer)',
    notes: 'Morning irrigation cycle for North Paddy',
    currentAmps: 8.4,
    voltageVolts: 228
  },
  {
    id: 'log-02',
    timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    action: 'MANUAL_STOP',
    operator: 'Ramesh Patel (Farmer)',
    notes: 'Completed 3.5 hour paddy watering',
    durationMinutes: 210,
    currentAmps: 8.3,
    voltageVolts: 226
  },
  {
    id: 'log-03',
    timestamp: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    action: 'AUTO_SAFETY_STOP',
    operator: 'AgriShield Hardware Guard (ESP32 Failsafe)',
    notes: 'Transient voltage surge cutoff protection',
    durationMinutes: 45,
    currentAmps: 18.2,
    voltageVolts: 195
  }
];

export const pumpService = {
  getPumpByDevice: (deviceId: string): PumpDetails => {
    return INITIAL_PUMPS[deviceId] || INITIAL_PUMPS['DEV-ESP32-01'];
  },

  getAllPumps: (): Record<string, PumpDetails> => {
    return { ...INITIAL_PUMPS };
  }
};
