import { DeviceInfo } from '../types/telemetry';
import { FieldInfo, FarmInfo } from '../types/field';

export const INITIAL_FARMS: FarmInfo[] = [
  {
    id: 'farm-01',
    name: 'Green Valley Agro Farm',
    location: 'Godavari Basin, Andhra Pradesh',
    ownerName: 'Ramesh Patel',
    totalAcres: 24.5,
    fieldCount: 3,
    deviceCount: 3
  }
];

export const INITIAL_FIELDS: FieldInfo[] = [
  {
    id: 'field-01',
    name: 'North Paddy Block (Field 01)',
    farmId: 'farm-01',
    cropType: 'Paddy / Rice (BPT 5204)',
    stage: 'Vegetative Growth (Day 42)',
    areaAcres: 10.5,
    soilType: 'Clay Loam',
    deviceId: 'DEV-ESP32-01',
    healthScore: 87,
    moistureThresholdMin: 55,
    moistureThresholdMax: 85,
    coordinates: { lat: 16.9891, lng: 81.7840 },
    notes: 'Submersible 7.5 HP borewell pump. Drip + flood basin.'
  },
  {
    id: 'field-02',
    name: 'South Cotton Field (Field 02)',
    farmId: 'farm-01',
    cropType: 'Bt Cotton (Hybrid)',
    stage: 'Square Formation (Day 58)',
    areaAcres: 8.0,
    soilType: 'Black Cotton Soil',
    deviceId: 'DEV-ESP32-02',
    healthScore: 74,
    moistureThresholdMin: 40,
    moistureThresholdMax: 70,
    coordinates: { lat: 16.9845, lng: 81.7892 },
    notes: '5 HP Openwell Monobloc. Drip irrigation line.'
  },
  {
    id: 'field-03',
    name: 'East Organic Vegetable Plot (Field 03)',
    farmId: 'farm-01',
    cropType: 'Tomato & Chilli',
    stage: 'Flowering & Fruiting (Day 35)',
    areaAcres: 6.0,
    soilType: 'Sandy Loam',
    deviceId: 'DEV-ESP32-03',
    healthScore: 92,
    moistureThresholdMin: 60,
    moistureThresholdMax: 80,
    coordinates: { lat: 16.9920, lng: 81.7915 },
    notes: 'Solar DC 3 HP Hybrid pump. Precision micro-sprinklers.'
  }
];

export const INITIAL_DEVICES: DeviceInfo[] = [
  {
    id: 'DEV-ESP32-01',
    name: 'Growell Master Gateway (ESP32-S3)',
    fieldId: 'field-01',
    fieldName: 'North Paddy Block (Field 01)',
    status: 'ONLINE',
    lastHeartbeat: new Date().toISOString(),
    ipAddress: '192.168.1.101',
    firmwareVersion: 'v2.4.1-agrishield',
    installationDate: '2025-11-12',
    batteryLevel: 96,
    rssi: -58,
    sensors: {
      soilMoisture: 'active',
      currentCT: 'active',
      voltagePT: 'active',
      waterLevelUltrasonic: 'active',
      dht22: 'active'
    }
  },
  {
    id: 'DEV-ESP32-02',
    name: 'South Field Node (ESP32-WROOM)',
    fieldId: 'field-02',
    fieldName: 'South Cotton Field (Field 02)',
    status: 'ONLINE',
    lastHeartbeat: new Date(Date.now() - 15000).toISOString(),
    ipAddress: '192.168.1.102',
    firmwareVersion: 'v2.4.0-agrishield',
    installationDate: '2025-12-05',
    batteryLevel: 88,
    rssi: -72,
    sensors: {
      soilMoisture: 'active',
      currentCT: 'active',
      voltagePT: 'active',
      waterLevelUltrasonic: 'active',
      dht22: 'active'
    }
  },
  {
    id: 'DEV-ESP32-03',
    name: 'Greenhouse Micro-Node (ESP32-C3)',
    fieldId: 'field-03',
    fieldName: 'East Organic Vegetable Plot (Field 03)',
    status: 'ONLINE',
    lastHeartbeat: new Date(Date.now() - 8000).toISOString(),
    ipAddress: '192.168.1.103',
    firmwareVersion: 'v2.4.1-agrishield',
    installationDate: '2026-01-20',
    batteryLevel: 100,
    rssi: -52,
    sensors: {
      soilMoisture: 'active',
      currentCT: 'active',
      voltagePT: 'active',
      waterLevelUltrasonic: 'active',
      dht22: 'active'
    }
  }
];

export const deviceService = {
  getDevices: (): DeviceInfo[] => {
    const stored = localStorage.getItem('agrishield_devices');
    return stored ? JSON.parse(stored) : INITIAL_DEVICES;
  },

  getDeviceById: (id: string): DeviceInfo | undefined => {
    return deviceService.getDevices().find(d => d.id === id);
  },

  getFields: (): FieldInfo[] => {
    const stored = localStorage.getItem('agrishield_fields');
    return stored ? JSON.parse(stored) : INITIAL_FIELDS;
  },

  getFieldById: (id: string): FieldInfo | undefined => {
    return deviceService.getFields().find(f => f.id === id);
  },

  updateDeviceStatus: (id: string, status: DeviceInfo['status']): void => {
    const devices = deviceService.getDevices();
    const updated = devices.map(d => d.id === id ? { ...d, status, lastHeartbeat: new Date().toISOString() } : d);
    localStorage.setItem('agrishield_devices', JSON.stringify(updated));
  }
};
