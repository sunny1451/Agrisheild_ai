import { SensorReading, HistoricalReading, SensorTrend } from '../types/telemetry';

export interface DeviceTelemetryState {
  currentReading: SensorReading;
  previousReading: SensorReading;
  healthScore: number;
  history24h: HistoricalReading[];
  history7d: HistoricalReading[];
  history30d: HistoricalReading[];
}

const DEFAULT_READINGS: Record<string, SensorReading> = {
  'DEV-ESP32-01': {
    soilMoisture: 62.4,
    motorCurrent: 8.4,
    voltage: 228.0,
    waterLevel: 74.0,
    temperature: 31.2,
    humidity: 68.0,
    timestamp: new Date().toISOString()
  },
  'DEV-ESP32-02': {
    soilMoisture: 41.5,
    motorCurrent: 0.0,
    voltage: 224.0,
    waterLevel: 62.0,
    temperature: 33.0,
    humidity: 61.0,
    timestamp: new Date().toISOString()
  },
  'DEV-ESP32-03': {
    soilMoisture: 72.0,
    motorCurrent: 4.2,
    voltage: 231.0,
    waterLevel: 88.0,
    temperature: 28.5,
    humidity: 76.0,
    timestamp: new Date().toISOString()
  }
};

// Generate realistic history
export function generateHistory(
  deviceId: string,
  hours: number,
  baseReading: SensorReading
): HistoricalReading[] {
  const data: HistoricalReading[] = [];
  const now = Date.now();
  const stepMs = (hours * 3600 * 1000) / (hours <= 24 ? 24 : hours <= 168 ? 28 : 30);
  const steps = hours <= 24 ? 24 : hours <= 168 ? 28 : 30;

  for (let i = steps; i >= 0; i--) {
    const time = new Date(now - i * stepMs);
    const hourOfDay = time.getHours();
    
    // Day/night temperature oscillation
    const tempOffset = Math.sin((hourOfDay - 8) * (Math.PI / 12)) * 5;
    const temp = Math.round((baseReading.temperature + tempOffset + (Math.random() * 1.5 - 0.75)) * 10) / 10;
    
    // Inverse humidity
    const humidity = Math.min(95, Math.max(40, Math.round(baseReading.humidity - tempOffset * 1.8 + (Math.random() * 4 - 2))));
    
    // Soil moisture gradual drop or bump
    const moistureDecay = (steps - i) * 0.15;
    const moisture = Math.min(95, Math.max(20, Math.round((baseReading.soilMoisture - (moistureDecay % 15) + (Math.random() * 1.2 - 0.6)) * 10) / 10));

    // Voltage grid variations (lower around 6pm-9pm)
    const isPeakHour = hourOfDay >= 18 && hourOfDay <= 21;
    const voltage = Math.round(baseReading.voltage + (isPeakHour ? -8 : 2) + (Math.random() * 4 - 2));

    // Pump status (simulate 2-3 hours morning and evening run)
    const isPumpTime = (hourOfDay >= 6 && hourOfDay <= 8) || (hourOfDay >= 16 && hourOfDay <= 18);
    const motorCurrent = isPumpTime ? Math.round((baseReading.motorCurrent || 8.4) * 10) / 10 : 0;

    // Water level drop slightly when pump runs, refill overnight
    const waterLevel = Math.round(Math.min(98, Math.max(30, baseReading.waterLevel + Math.sin(i * 0.4) * 10)));

    // Aggregate health score calculation
    let health = 90;
    if (moisture < 45) health -= 12;
    if (voltage < 200 || voltage > 245) health -= 15;
    if (motorCurrent > 16) health -= 25;
    health = Math.min(100, Math.max(35, Math.round(health + (Math.random() * 4 - 2))));

    data.push({
      timestamp: time.toISOString(),
      soilMoisture: moisture,
      motorCurrent,
      voltage,
      waterLevel,
      temperature: temp,
      humidity,
      healthScore: health,
      pumpRunning: isPumpTime
    });
  }

  return data;
}

export const sensorService = {
  getInitialReading: (deviceId: string): SensorReading => {
    return DEFAULT_READINGS[deviceId] || DEFAULT_READINGS['DEV-ESP32-01'];
  },

  calculateHealthScore: (reading: SensorReading, isPumpRunning: boolean, faultActive?: string): number => {
    if (faultActive === 'OVERCURRENT' || reading.motorCurrent > 18) return 32;
    if (faultActive === 'DRY_RUN' || (isPumpRunning && reading.motorCurrent < 1.5)) return 41;
    if (faultActive === 'VOLTAGE_DROP' || reading.voltage < 180) return 56;
    if (faultActive === 'LOW_MOISTURE' || reading.soilMoisture < 30) return 64;

    let score = 92;

    // Moisture penalty
    if (reading.soilMoisture < 45) score -= 10;
    else if (reading.soilMoisture > 85) score -= 5;

    // Voltage stability
    if (reading.voltage < 205 || reading.voltage > 240) score -= 8;

    // Motor current stability
    if (isPumpRunning) {
      if (reading.motorCurrent > 12) score -= 12;
      if (reading.motorCurrent < 3.0) score -= 10;
    }

    // High temperature stress
    if (reading.temperature > 38) score -= 6;

    return Math.max(25, Math.min(99, Math.round(score)));
  },

  getTrend: (current: number, previous: number): SensorTrend => {
    const change = Math.round((current - previous) * 10) / 10;
    let direction: SensorTrend['direction'] = 'stable';
    if (change > 0.3) direction = 'up';
    else if (change < -0.3) direction = 'down';

    return {
      value: current,
      change,
      direction,
      status: 'normal'
    };
  }
};
