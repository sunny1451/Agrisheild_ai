// Telemetry and IoT Sensor Types for AgriShield AI

export interface SensorReading {
  soilMoisture: number; // % (0-100)
  motorCurrent: number; // Amperes (A) (e.g. 0 to 25A)
  voltage: number;      // Volts (V) (e.g. 150 to 250V)
  waterLevel: number;   // Centimeters (cm) or % (0-100)
  temperature: number;  // Celsius (°C)
  humidity: number;     // % (0-100)
  timestamp: string;    // ISO string
}

export interface SensorTrend {
  value: number;
  change: number; // percentage or absolute change
  direction: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
}

export interface HistoricalReading extends SensorReading {
  healthScore: number;
  pumpRunning: boolean;
}

export type ConnectionState = 'ONLINE' | 'WEAK' | 'OFFLINE';

export interface DeviceInfo {
  id: string;             // e.g. "DEV-ESP32-01"
  name: string;           // "Main Borewell ESP32 - North Block"
  fieldId: string;        // "field-01"
  fieldName: string;      // "North Paddy Field"
  status: ConnectionState;
  lastHeartbeat: string;
  ipAddress: string;
  firmwareVersion: string;
  installationDate: string;
  batteryLevel: number;   // % (for solar/battery IoT gateway)
  rssi: number;           // dBm (e.g. -65 dBm)
  sensors: {
    soilMoisture: 'active' | 'degraded' | 'offline';
    currentCT: 'active' | 'degraded' | 'offline';
    voltagePT: 'active' | 'degraded' | 'offline';
    waterLevelUltrasonic: 'active' | 'degraded' | 'offline';
    dht22: 'active' | 'degraded' | 'offline';
  };
}

export interface MotorizedGatewayState {
  isActive: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  connection: 'ONLINE' | 'OFFLINE';
  motor: 'READY' | 'STOPPED';
  lastActivity: string;
  isSimulated: boolean;
}

export type FaultSimulationType = 
  | 'NORMAL'
  | 'DRY_RUN'
  | 'OVERCURRENT'
  | 'VOLTAGE_DROP'
  | 'LOW_MOISTURE'
  | 'DEVICE_OFFLINE';
