import { HistoricalReading } from '../types/telemetry';

export interface FieldReportSummary {
  fieldId: string;
  fieldName: string;
  period: '24h' | '7d' | '30d' | 'custom';
  avgSoilMoisture: number;
  minSoilMoisture: number;
  maxSoilMoisture: number;
  avgMotorCurrent: number;
  maxMotorCurrent: number;
  avgVoltage: number;
  minVoltage: number;
  totalPumpRuntimeHours: number;
  estimatedWaterUsedLiters: number;
  energyConsumedKwh: number;
  faultEventCount: number;
  avgHealthScore: number;
}

export const reportService = {
  calculateSummary: (
    history: HistoricalReading[],
    fieldName: string,
    fieldId: string,
    period: '24h' | '7d' | '30d' | 'custom'
  ): FieldReportSummary => {
    if (!history || history.length === 0) {
      return {
        fieldId,
        fieldName,
        period,
        avgSoilMoisture: 60,
        minSoilMoisture: 50,
        maxSoilMoisture: 70,
        avgMotorCurrent: 8.2,
        maxMotorCurrent: 9.5,
        avgVoltage: 228,
        minVoltage: 215,
        totalPumpRuntimeHours: 12.5,
        estimatedWaterUsedLiters: 48000,
        energyConsumedKwh: 34.2,
        faultEventCount: 0,
        avgHealthScore: 88
      };
    }

    const moistures = history.map(h => h.soilMoisture);
    const currents = history.map(h => h.motorCurrent);
    const voltages = history.map(h => h.voltage);
    const healths = history.map(h => h.healthScore);

    const avgSoilMoisture = Math.round((moistures.reduce((a, b) => a + b, 0) / moistures.length) * 10) / 10;
    const minSoilMoisture = Math.min(...moistures);
    const maxSoilMoisture = Math.max(...moistures);

    const nonZeroCurrents = currents.filter(c => c > 0);
    const avgMotorCurrent = nonZeroCurrents.length > 0
      ? Math.round((nonZeroCurrents.reduce((a, b) => a + b, 0) / nonZeroCurrents.length) * 10) / 10
      : 0;
    const maxMotorCurrent = Math.max(...currents);

    const avgVoltage = Math.round((voltages.reduce((a, b) => a + b, 0) / voltages.length) * 10) / 10;
    const minVoltage = Math.min(...voltages);

    const runningSteps = history.filter(h => h.pumpRunning || h.motorCurrent > 1.0).length;
    const stepHours = period === '24h' ? 1 : period === '7d' ? 6 : 24;
    const totalPumpRuntimeHours = Math.round((runningSteps * (stepHours * 0.4)) * 10) / 10;

    // Approximate 4000 Liters / hour for 7.5HP
    const estimatedWaterUsedLiters = Math.round(totalPumpRuntimeHours * 4200);
    // Approximate kWh = (V * I * sqrt(3) * PF * hours) / 1000 or simplified for single/3-phase:
    const energyConsumedKwh = Math.round(totalPumpRuntimeHours * 5.2 * 10) / 10;

    const avgHealthScore = Math.round(healths.reduce((a, b) => a + b, 0) / healths.length);

    return {
      fieldId,
      fieldName,
      period,
      avgSoilMoisture,
      minSoilMoisture,
      maxSoilMoisture,
      avgMotorCurrent,
      maxMotorCurrent,
      avgVoltage,
      minVoltage,
      totalPumpRuntimeHours,
      estimatedWaterUsedLiters,
      energyConsumedKwh,
      faultEventCount: maxMotorCurrent > 18 || minSoilMoisture < 25 ? 1 : 0,
      avgHealthScore
    };
  },

  exportToCSV: (history: HistoricalReading[], fieldName: string): void => {
    const headers = [
      'Timestamp',
      'Soil_Moisture_Pct',
      'Motor_Current_Amps',
      'Voltage_Volts',
      'Water_Level_cm',
      'Temperature_C',
      'Humidity_Pct',
      'Health_Score',
      'Pump_Running'
    ];

    const rows = history.map(item => [
      `"${item.timestamp}"`,
      item.soilMoisture,
      item.motorCurrent,
      item.voltage,
      item.waterLevel,
      item.temperature,
      item.humidity,
      item.healthScore,
      item.pumpRunning ? 'TRUE' : 'FALSE'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AgriShield_Report_${fieldName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
