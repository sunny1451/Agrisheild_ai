import { AlertItem } from '../types/alerts';

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-001',
    type: 'SOIL_MOISTURE',
    severity: 'WARNING',
    title: 'Moisture Trending Downward',
    description: 'South Cotton Field soil moisture reached 41.5% (Threshold: 40%). Recommend scheduling drip cycle.',
    deviceId: 'DEV-ESP32-02',
    fieldId: 'field-02',
    fieldName: 'South Cotton Field (Field 02)',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    isRead: false,
    actionRequired: true,
    suggestedAction: 'Start drip pump for 45 minutes.'
  },
  {
    id: 'alert-002',
    type: 'SENSOR_HEALTH',
    severity: 'INFO',
    title: 'Telemetry Heartbeat Synchronized',
    description: 'Borewell Master Gateway (ESP32-S3) completed telemetry sync on channel MQTT/agrishield/01.',
    deviceId: 'DEV-ESP32-01',
    fieldId: 'field-01',
    fieldName: 'North Paddy Block (Field 01)',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isRead: true,
    actionRequired: false
  },
  {
    id: 'alert-003',
    type: 'MAINTENANCE',
    severity: 'MAINTENANCE',
    title: 'Preventive Motor Check Recommended',
    description: 'Motor operating hours exceeded 400 hrs. Check bearing lubrication and starter contact points.',
    deviceId: 'DEV-ESP32-01',
    fieldId: 'field-01',
    fieldName: 'North Paddy Block (Field 01)',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isRead: true,
    actionRequired: false,
    suggestedAction: 'Schedule electrician inspection before monsoon peak.'
  }
];

export const alertService = {
  getInitialAlerts: (): AlertItem[] => {
    const stored = localStorage.getItem('agrishield_alerts');
    return stored ? JSON.parse(stored) : INITIAL_ALERTS;
  },

  saveAlerts: (alerts: AlertItem[]): void => {
    localStorage.setItem('agrishield_alerts', JSON.stringify(alerts));
  },

  createAlert: (alert: Omit<AlertItem, 'id' | 'timestamp' | 'isRead'>): AlertItem => {
    const newAlert: AlertItem = {
      ...alert,
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    return newAlert;
  }
};
