// Centralized Water Tank Safety Thresholds, States, and Definitions
// AgriShield AI Edge Digital Twin & Failsafe Control

export const WATER_TANK_THRESHOLDS = {
  FULL_MIN: 95,      // 95% - 100%
  NORMAL_MAX: 94,    // 30% - 94%
  NORMAL_MIN: 30,
  LOW_MAX: 29,       // 1% - 29%
  LOW_MIN: 1,
  EMPTY: 0           // 0%
} as const;

export type WaterTankState = 'FULL' | 'NORMAL' | 'LOW' | 'EMPTY';

export interface WaterTankSafetyInfo {
  level: number;
  state: WaterTankState;
  isSafeToStart: boolean;
  blockReason?: {
    title: string;
    reason: string;
    detail: string;
  };
  lastSafetyTripReason: string | null;
  lastSafetyTripTime: string | null;
}

/**
 * Returns the categorical water tank state based on percentage (0-100%)
 */
export function getWaterTankState(level: number): WaterTankState {
  if (level <= WATER_TANK_THRESHOLDS.EMPTY) {
    return 'EMPTY';
  }
  if (level <= WATER_TANK_THRESHOLDS.LOW_MAX) {
    return 'LOW';
  }
  if (level <= WATER_TANK_THRESHOLDS.NORMAL_MAX) {
    return 'NORMAL';
  }
  return 'FULL';
}

/**
 * Validates if the pump is legally allowed to start given the current water tank level
 */
export function evaluatePumpStartEligibility(waterLevel: number): {
  allowed: boolean;
  title?: string;
  reason?: string;
  detail?: string;
} {
  const state = getWaterTankState(waterLevel);

  if (state === 'FULL') {
    return {
      allowed: false,
      title: 'PUMP START BLOCKED',
      reason: 'The water tank is in an unsafe state.',
      detail: 'The tank is full. Resolve the full-tank condition before restarting the pump.'
    };
  }

  if (state === 'EMPTY') {
    return {
      allowed: false,
      title: 'PUMP START BLOCKED',
      reason: 'The water tank is in an unsafe state.',
      detail: 'The tank is empty. Fill the tank before restarting the pump.'
    };
  }

  return {
    allowed: true
  };
}
