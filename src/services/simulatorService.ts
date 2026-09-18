import { FaultSimulationType } from '../types/telemetry';

export interface SimulatorState {
  activeFault: FaultSimulationType;
  faultTriggeredAt: number | null;
  dryRunTimerSeconds: number;
  overcurrentTimerSeconds: number;
  isAutoLoopEnabled: boolean;
  manualOverrides: {
    soilMoisture?: number;
    motorCurrent?: number;
    voltage?: number;
    waterLevel?: number;
    temperature?: number;
    humidity?: number;
  };
  eventLog: {
    id: string;
    timestamp: string;
    message: string;
    type: 'info' | 'warning' | 'critical' | 'action';
  }[];
}

export const INITIAL_SIMULATOR_STATE: SimulatorState = {
  activeFault: 'NORMAL',
  faultTriggeredAt: null,
  dryRunTimerSeconds: 0,
  overcurrentTimerSeconds: 0,
  isAutoLoopEnabled: true,
  manualOverrides: {},
  eventLog: [
    {
      id: 'evt-init',
      timestamp: new Date().toISOString(),
      message: 'AgriShield IoT Virtual Gateway initialized. Streaming MQTT telemetry at 5s interval.',
      type: 'info'
    }
  ]
};

export const simulatorService = {
  getInitialState: (): SimulatorState => {
    return INITIAL_SIMULATOR_STATE;
  }
};
