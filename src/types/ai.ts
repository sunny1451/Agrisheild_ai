// AI Insights and Agronomic Recommendations Types

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AiMotorRiskAssessment {
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100 (0=perfect, 100=extreme danger)
  faultType: string; // e.g. "Bearing Degradation Risk", "None Detected", "Winding Thermal Overload"
  explanation: string;
  confidence: number; // e.g. 0.94
  recommendedAction: string;
  indicators: {
    name: string;
    value: string;
    status: 'good' | 'warning' | 'danger';
  }[];
}

export interface IrrigationRecommendation {
  needed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  headline: string;
  advice: string;
  reason: string;
  soilMoistureTrend: 'DROPPING_FAST' | 'DROPPING_STEADY' | 'OPTIMAL' | 'SATURATED';
  estimatedTimeToIrrigateHours: number; // e.g. 4 hours
  suggestedDurationMinutes: number;    // e.g. 45 mins
  waterSavingsPotentialLiters: number;
  lastEvaluated: string;
}

export interface PredictiveMaintenanceEstimate {
  motorHealthScore: number;      // 0-100%
  vibrationStressIndex: number;  // 0-10
  thermalStressIndex: number;    // 0-10
  totalOperatingHours: number;
  faultHistoryCount: number;
  remainingUsefulLifeDays: number;
  nextServiceDate: string;
  serviceRecommendation: string;
  checklist: {
    item: string;
    status: 'ok' | 'due_soon' | 'overdue';
    dueDate: string;
  }[];
}
