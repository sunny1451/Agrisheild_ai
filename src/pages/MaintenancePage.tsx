import React, { useState } from 'react';
import {
  Wrench,
  Cpu,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Zap,
  Activity,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MaintenancePage: React.FC = () => {
  const { pumpDetails, aiMotorRisk, selectedField } = useApp();

  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Check suction foot-valve & strainer for silt clogging', completed: true },
    { id: 'c2', label: 'Inspect capacitor start/run mfd rating with multimeter', completed: true },
    { id: 'c3', label: 'Grease upper thrust bearings with high-temperature lubricant', completed: false },
    { id: 'c4', label: 'Tighten contactor electrical terminals & inspect silver contacts', completed: false },
    { id: 'c5', label: 'Verify borewell ultrasonic transducer water level calibration', completed: true }
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const healthScore = Math.max(10, 100 - aiMotorRisk.riskScore);

  return (
    <div id="maintenance-center-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Predictive Equipment Maintenance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            AI-monitored Remaining Useful Life (RUL), mechanical wear, and service schedule
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
          Motor Health: {healthScore}/100
        </span>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Motor Health Condition</span>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            {healthScore > 80 ? 'EXCELLENT' : healthScore > 60 ? 'GOOD' : 'ATTENTION REQUIRED'}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Physics-informed vibration index
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Cumulative Runtime</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {pumpDetails.totalRuntimeHours.toFixed(1)} <span className="text-xs text-slate-400">hours</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Since commissioning in {pumpDetails.installationDate}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Est. Remaining Life (RUL)</span>
          <div className="text-2xl font-black text-purple-700 font-mono">
            ~1,850 <span className="text-xs text-slate-400">hours</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block">
            ~3.2 seasons of normal usage
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Next Service Target</span>
          <div className="text-2xl font-black text-slate-800">
            {pumpDetails.nextMaintenanceDue}
          </div>
          <span className="text-[10px] text-amber-700 font-bold block">
            Bearing lubrication & seal check
          </span>
        </div>
      </div>

      {/* Maintenance Action Plan & Motor Health Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Maintenance Checklist */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Seasonal Preventative Service Checklist
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-bold">
              {checklist.filter(c => c.completed).length} / {checklist.length} Completed
            </span>
          </div>

          <div className="space-y-2.5">
            {checklist.map(item => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  item.completed
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      item.completed ? 'bg-emerald-600 text-white' : 'border border-slate-400 bg-white'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className={item.completed ? 'line-through opacity-80' : ''}>
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Submersible Motor Hardware Specs */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Motor Telemetry Specsheet</span>
          </div>

          <div className="space-y-3 text-xs divide-y divide-slate-800">
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Equipment Unit:</span>
              <span className="font-bold text-white">{pumpDetails.name}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Horsepower Rating:</span>
              <span className="font-bold text-emerald-400">{pumpDetails.hpRating} HP Submersible</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Rated Current:</span>
              <span className="font-bold text-white">{pumpDetails.ratedCurrent} Amperes</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Dry-Run Trip Level:</span>
              <span className="font-bold text-rose-400">&lt; 1.5 Amps (10s timer)</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Overcurrent Trip Level:</span>
              <span className="font-bold text-rose-400">&gt; 18.0 Amps (2s timer)</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-400">Thermal Class:</span>
              <span className="font-bold text-white">Class F (Up to 155°C)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
