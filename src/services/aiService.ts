import { AiMotorRiskAssessment, IrrigationRecommendation, PredictiveMaintenanceEstimate } from '../types/ai';
import { SensorReading } from '../types/telemetry';

export const aiService = {
  evaluateMotorRisk: (
    reading: SensorReading,
    isPumpRunning: boolean,
    activeFault?: string
  ): AiMotorRiskAssessment => {
    // Fault scenarios
    if (activeFault === 'OVERCURRENT' || reading.motorCurrent > 18) {
      return {
        riskLevel: 'HIGH',
        riskScore: 94,
        faultType: 'Critical Overcurrent / Impeller Jam Risk',
        explanation: 'Extreme electrical load detected (>18A). Possible pump impeller clogging, bearing seizure, or short-circuit.',
        confidence: 0.96,
        recommendedAction: 'Immediate safety shutoff triggered. Inspect pump inlet for silt or debris before restarting.',
        indicators: [
          { name: 'Current Surge', value: `${reading.motorCurrent.toFixed(1)} A`, status: 'danger' },
          { name: 'Voltage Stability', value: `${reading.voltage} V`, status: 'warning' },
          { name: 'Motor Thermal Rise', value: 'High (+42°C/hr)', status: 'danger' }
        ]
      };
    }

    if (activeFault === 'DRY_RUN' || (isPumpRunning && reading.motorCurrent < 1.5)) {
      return {
        riskLevel: 'HIGH',
        riskScore: 89,
        faultType: 'Dry-Run Cavitation Risk',
        explanation: 'Motor running with abnormally low current (<1.5A). Indicates borewell water column depletion or pump running unprimed.',
        confidence: 0.94,
        recommendedAction: 'Safety cutoff initiated. Allow groundwater table recharge for 2-4 hours before re-testing.',
        indicators: [
          { name: 'Motor Load', value: `${reading.motorCurrent.toFixed(1)} A (Unloaded)`, status: 'danger' },
          { name: 'Water Level', value: `${reading.waterLevel} cm (Low)`, status: 'warning' },
          { name: 'Hydraulic Pressure', value: 'Near Zero (0.2 Bar)', status: 'danger' }
        ]
      };
    }

    if (activeFault === 'VOLTAGE_DROP' || reading.voltage < 190) {
      return {
        riskLevel: 'MEDIUM',
        riskScore: 68,
        faultType: 'Undervoltage Thermal Stress',
        explanation: 'Supply voltage dropped below safe operating limit. Running motors at low voltage causes elevated winding heat and premature insulation breakdown.',
        confidence: 0.91,
        recommendedAction: 'Verify transformer phase balance and voltage stabilizer relay.',
        indicators: [
          { name: 'Line Voltage', value: `${reading.voltage} V (Low)`, status: 'danger' },
          { name: 'Current Compensation', value: `${reading.motorCurrent.toFixed(1)} A`, status: 'warning' },
          { name: 'Power Factor', value: '0.78 (Degraded)', status: 'warning' }
        ]
      };
    }

    if (activeFault === 'LOW_MOISTURE' || reading.soilMoisture < 35) {
      return {
        riskLevel: 'LOW',
        riskScore: 28,
        faultType: 'Optimal Motor Health / Crop Moisture Stress',
        explanation: 'Electrical telemetry is within normal manufacturer parameters. Crop requires water replenishment.',
        confidence: 0.95,
        recommendedAction: 'Start scheduled irrigation cycle.',
        indicators: [
          { name: 'Motor Load', value: isPumpRunning ? `${reading.motorCurrent.toFixed(1)} A` : 'Idle', status: 'good' },
          { name: 'Voltage Stability', value: `${reading.voltage} V (Balanced)`, status: 'good' },
          { name: 'Vibration Score', value: '1.2 mm/s (Smooth)', status: 'good' }
        ]
      };
    }

    // Default Normal evaluation
    const isSlightlyHighCurrent = isPumpRunning && reading.motorCurrent > 12;
    return {
      riskLevel: isSlightlyHighCurrent ? 'MEDIUM' : 'LOW',
      riskScore: isSlightlyHighCurrent ? 52 : 14,
      faultType: isSlightlyHighCurrent ? 'Minor Load Variance' : 'Healthy Operation',
      explanation: isSlightlyHighCurrent
        ? 'Current draw is elevated slightly above optimal curve. Monitor for slight debris resistance.'
        : 'All electrical, thermal, and hydraulic parameters are operating smoothly within nominal safe envelope.',
      confidence: 0.97,
      recommendedAction: isSlightlyHighCurrent
        ? 'Monitor next cycle runtime'
        : 'No maintenance action required. Motor operating optimally.',
      indicators: [
        { name: 'Current Profile', value: isPumpRunning ? `${reading.motorCurrent.toFixed(1)} A` : '0.0 A (Standby)', status: 'good' },
        { name: 'Grid Voltage', value: `${reading.voltage} V (Stable)`, status: 'good' },
        { name: 'Winding Temp', value: `${Math.round(reading.temperature + 12)} °C`, status: 'good' }
      ]
    };
  },

  getIrrigationRecommendation: (reading: SensorReading, cropType: string): IrrigationRecommendation => {
    const moisture = reading.soilMoisture;
    const temp = reading.temperature;

    if (moisture < 35) {
      return {
        needed: true,
        priority: 'CRITICAL',
        headline: 'Critical Moisture Depletion',
        advice: `Soil moisture (${moisture.toFixed(1)}%) is below critical wilting threshold for ${cropType}. Immediate irrigation recommended.`,
        reason: 'Evapotranspiration rate is accelerated by high ambient temperature.',
        soilMoistureTrend: 'DROPPING_FAST',
        estimatedTimeToIrrigateHours: 0.5,
        suggestedDurationMinutes: 75,
        waterSavingsPotentialLiters: 1200,
        lastEvaluated: new Date().toISOString()
      };
    }

    if (moisture < 50) {
      return {
        needed: true,
        priority: 'HIGH',
        headline: 'Moisture Trending Downward',
        advice: `Moisture is trending downward (${moisture.toFixed(1)}%). Consider irrigation within the next 4 to 6 hours.`,
        reason: `Root zone moisture depletion detected for ${cropType} during peak sunshine window.`,
        soilMoistureTrend: 'DROPPING_STEADY',
        estimatedTimeToIrrigateHours: 5,
        suggestedDurationMinutes: 45,
        waterSavingsPotentialLiters: 850,
        lastEvaluated: new Date().toISOString()
      };
    }

    if (moisture < 65) {
      return {
        needed: false,
        priority: 'MEDIUM',
        headline: 'Adequate Moisture Level',
        advice: `Soil moisture (${moisture.toFixed(1)}%) is in optimal range. Next irrigation window projected in ~18 hours.`,
        reason: 'Current soil moisture retention capacity is sufficient for active root uptake.',
        soilMoistureTrend: 'OPTIMAL',
        estimatedTimeToIrrigateHours: 18,
        suggestedDurationMinutes: 40,
        waterSavingsPotentialLiters: 600,
        lastEvaluated: new Date().toISOString()
      };
    }

    return {
      needed: false,
      priority: 'LOW',
      headline: 'Soil Fully Saturated',
      advice: 'Soil moisture is above 65%. Avoid excess irrigation to prevent root hypoxia and nutrient leaching.',
      reason: 'Sufficient water retention from previous cycle or recent condensation.',
      soilMoistureTrend: 'SATURATED',
      estimatedTimeToIrrigateHours: 36,
      suggestedDurationMinutes: 0,
      waterSavingsPotentialLiters: 1800,
      lastEvaluated: new Date().toISOString()
    };
  },

  getMaintenanceEstimate: (runtimeHours: number, faultCount: number): PredictiveMaintenanceEstimate => {
    const health = Math.max(45, Math.min(98, 100 - (runtimeHours / 40) - (faultCount * 5)));
    const rulDays = Math.max(30, Math.round(180 - (runtimeHours / 10) - (faultCount * 12)));

    return {
      motorHealthScore: Math.round(health),
      vibrationStressIndex: Math.round((1.2 + (runtimeHours / 500) + faultCount * 0.4) * 10) / 10,
      thermalStressIndex: Math.round((2.0 + (runtimeHours / 400) + faultCount * 0.5) * 10) / 10,
      totalOperatingHours: Math.round(runtimeHours * 10) / 10,
      faultHistoryCount: faultCount,
      remainingUsefulLifeDays: rulDays,
      nextServiceDate: new Date(Date.now() + rulDays * 24 * 3600 * 1000).toISOString().split('T')[0],
      serviceRecommendation: health > 80
        ? 'Routine visual check and terminal tightening at 500 operating hours.'
        : 'Schedule motor bearing regreasing and insulation resistance test.',
      checklist: [
        { item: 'Phase Voltage Balance & Contactor Contacts', status: 'ok', dueDate: '2026-09-15' },
        { item: 'Submersible Thrust Bearing & Seal Integrity', status: runtimeHours > 400 ? 'due_soon' : 'ok', dueDate: '2026-09-01' },
        { item: 'Capacitor Bank & Surge Suppressor Check', status: 'ok', dueDate: '2026-10-10' },
        { item: 'Impeller Sand & Silt Clearance', status: faultCount > 0 ? 'due_soon' : 'ok', dueDate: '2026-08-30' }
      ]
    };
  }
};
