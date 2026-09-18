import React from 'react';
import { Sliders, Cpu, Activity, ShieldCheck, Zap } from 'lucide-react';
import { SimulatorControls } from '../components/simulator/SimulatorControls';
import { useApp } from '../context/AppContext';

export const SimulatorPage: React.FC = () => {
  const { currentReading, pumpDetails, healthScore, aiMotorRisk } = useApp();

  return (
    <div id="admin-simulator-view" className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          IoT Hardware & Fault Injection Sandbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Simulate real-time sensor streams, emergency safety cutoff triggers, and AI health degradations
        </p>
      </div>

      {/* Main Simulator Controls component */}
      <SimulatorControls />
    </div>
  );
};
