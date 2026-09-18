import { ThemeId } from './theme';

export type LanguageCode = 'en' | 'te' | 'hi' | 'ta';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  farmName: string;
  farmLocation: string;
  role: 'farmer' | 'admin' | 'agronomist';
  joinedDate: string;
  avatarUrl?: string;
  language?: LanguageCode;
}

export interface AppSettings {
  language: LanguageCode;
  themeId?: ThemeId;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    simpleMode: boolean;
  };
  notifications: {
    criticalSms: boolean;
    soundAlerts: boolean;
    emailDigest: boolean;
    pushEnabled: boolean;
  };
  thresholds: {
    overcurrentAmps: number;
    dryRunAmps: number;
    dryRunTimeoutSeconds: number;
    lowMoisturePercent: number;
  };
}
