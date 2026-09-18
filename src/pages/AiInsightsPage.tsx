import React, { useState } from 'react';
import {
  Cpu,
  Droplets,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Zap,
  TrendingDown,
  Clock,
  ArrowRight,
  Bot,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AiMotorRiskMeter } from '../components/ai/AiMotorRiskMeter';
import { IrrigationAdviceCard } from '../components/ai/IrrigationAdviceCard';
import { AgriAdvisorModal } from '../components/ai/AgriAdvisorModal';

export const AiInsightsPage: React.FC = () => {
  const {
    aiMotorRisk,
    irrigationRecommendation,
    selectedField,
    selectedDevice,
    currentReading,
    healthScore,
    t
  } = useApp();

  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  return (
    <div id="ai-insights-center" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Predictive Models Active
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Field: {selectedField.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            AI Insights & Digital Twin Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Explainable neural risk scores, crop depletion curves, and proactive maintenance advisories
          </p>
        </div>

        <button
          onClick={() => setIsAdvisorOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Bot className="w-4 h-4 text-emerald-300" />
          Ask AI Agronomist
        </button>
      </div>

      {/* Top 2 Intelligence Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AiMotorRiskMeter assessment={aiMotorRisk} />
        <IrrigationAdviceCard recommendation={irrigationRecommendation} />
      </div>

      {/* Explainable AI Diagnostics & Physics-Informed ML breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Explainable Physics-Informed ML Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                How AgriShield calculates fault confidence & crop water loss rates
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
            Model: PINN-AgriTwin-v2.1
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Feature 1: Motor Winding Thermal Model */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Thermal & Voltage Stress</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Calculates cumulative thermal degradation ($I^2R$ losses) based on line voltage deviations ({currentReading.voltage}V) and duty cycles.
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] font-semibold text-slate-700 flex justify-between">
              <span>Winding Life Impact:</span>
              <span className="text-emerald-700 font-bold">Nominal (0.2% / day)</span>
            </div>
          </div>

          {/* Feature 2: Evapotranspiration Depletion Model */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>FAO-56 Penman-Monteith</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Simulates daily crop water demand ($ET_c = K_c \times ET_0$) for {selectedField.cropType} taking ambient temperature ({currentReading.temperature}°C) into account.
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] font-semibold text-slate-700 flex justify-between">
              <span>Depletion Rate:</span>
              <span className="text-blue-700 font-bold">4.2 mm / day</span>
            </div>
          </div>

          {/* Feature 3: Cavitation & Bearing Vibration Model */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Impeller & Cavitation FFT</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Monitors motor current ripple harmonics to detect early air bubbles in the suction pipe before impeller erosion occurs.
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] font-semibold text-slate-700 flex justify-between">
              <span>Harmonic Distortion:</span>
              <span className="text-emerald-700 font-bold">1.4% (Healthy)</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations Action List */}
        <div className="bg-linear-to-r from-emerald-950 to-slate-900 text-white rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Autonomous AI Action Checklist</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">Scheduled Soil Replenishment:</span>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Recommended watering for {selectedField.name} at 05:30 AM tomorrow for 45 minutes to minimize evaporative loss.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200">Motor Health Optimization:</span>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Electrical phase balance is 98.6%. Submersible pump expected life remaining is ~1,850 runtime hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AgriAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />
    </div>
  );
};
