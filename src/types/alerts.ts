// Alert and Notification Types

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'MAINTENANCE';

export interface AlertItem {
  id: string;
  type: 
    | 'SAFETY_CUTOFF'
    | 'DRY_RUN'
    | 'OVERCURRENT'
    | 'VOLTAGE_STRESS'
    | 'SOIL_MOISTURE'
    | 'SENSOR_HEALTH'
    | 'MOTOR_HEALTH'
    | 'MAINTENANCE'
    | 'SYSTEM'
    | 'WATER_TANK_FULL'
    | 'WATER_TANK_EMPTY'
    | 'WATER_TANK_LOW'
    | 'WATER_TANK_NORMAL';
  severity: AlertSeverity;
  title: string;
  description: string;
  deviceId: string;
  fieldId: string;
  fieldName: string;
  timestamp: string;
  isRead: boolean;
  waterLevel?: number;
  actionRequired?: boolean;
  suggestedAction?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  overcurrentTripThreshold: number; // e.g. 18A
  dryRunThreshold: number;          // e.g. 1.5A
  lowMoistureThreshold: number;     // e.g. 30%
  highTempThreshold: number;        // e.g. 40°C
}
