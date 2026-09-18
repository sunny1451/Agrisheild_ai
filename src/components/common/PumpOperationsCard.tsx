import React, { useState } from 'react';
import {
  Power,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  Clock,
  Gauge
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmationModal } from './ConfirmationModal';

interface PumpOperationsCardProps {
  onViewControlCenter?: () => void;
}

export const PumpOperationsCard: React.FC<PumpOperationsCardProps> = ({
  onViewControlCenter
}) => {
  const {
    pumpDetails,
    currentReading,
    startPump,
    stopPump,
    resetSafetyTrip,
    selectedDevice,
    selectedField,
    navigateTo,
    t
  } = useApp();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: 'START' | 'STOP' | 'RESET';
    title: string;
    message: string;
  }>({
    isOpen: false,
    actionType: 'START',
    title: '',
    message: ''
  });

  const isRunning = pumpDetails.status === 'RUNNING';
  const hasSafetyTrip = !!pumpDetails.activeSafetyTrip && !pumpDetails.activeSafetyTrip.resolved;
  const motorCurrent = currentReading.motorCurrent;
  const voltage = currentReading.voltage;
  const ratedCurrent = pumpDetails.ratedCurrent || 14.5;
  const loadPercentage = isRunning ? Math.min(100, Math.round((motorCurrent / ratedCurrent) * 100)) : 0;

  const handleOpenStartModal = () => {
    if (hasSafetyTrip) {
      setModalState({
        isOpen: true,
        actionType: 'RESET',
        title: 'Reset Safety Lockout Required',
        message: 'The pump was halted by an automatic safety cutoff trip. Please confirm physical inspection before resetting the lockout.'
      });
      return;
    }
    setModalState({
      isOpen: true,
      actionType: 'START',
      title: 'Start Farm Pump',
      message: `Are you sure you want to energize the ${pumpDetails.name} on ${selectedField.name}?`
    });
  };

  const handleOpenStopModal = () => {
    setModalState({
      isOpen: true,
      actionType: 'STOP',
      title: 'Stop Farm Pump',
      message: `Are you sure you want to shut down ${pumpDetails.name}? Pump operation will pause.`
    });
  };

  const handleConfirmAction = () => {
    if (modalState.actionType === 'START') {
      startPump(selectedDevice.id);
    } else if (modalState.actionType === 'STOP') {
      stopPump(selectedDevice.id, 'Manual shutdown from dashboard', false);
    } else if (modalState.actionType === 'RESET') {
      resetSafetyTrip(selectedDevice.id);
    }
  };

  return (
    <>
      <div
        id="pump-operations-dashboard-card"
        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-2xl ${
                hasSafetyTrip
                  ? 'bg-rose-100 text-rose-700'
                  : isRunning
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Power className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                {t.pumpControl || 'Pump Control & Motor Operations'}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                {pumpDetails.name} ({pumpDetails.hpRating} HP)
              </h3>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 ${
              hasSafetyTrip
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : isRunning
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hasSafetyTrip
                  ? 'bg-rose-500 animate-ping'
                  : isRunning
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
            <span>{hasSafetyTrip ? 'TRIPPED' : isRunning ? 'RUNNING' : 'STOPPED'}</span>
          </span>
        </div>

        {/* Mid Row: Motor Load & Electrical Diagnostics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Motor Load Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                Motor Load
              </span>
              <span className="font-mono font-bold text-slate-900">
                {isRunning ? `${loadPercentage}%` : '0%'}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  loadPercentage > 95
                    ? 'bg-rose-500'
                    : loadPercentage > 75
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${loadPercentage}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium block truncate">
              {isRunning
                ? `${motorCurrent.toFixed(1)} A draw (Rated: ${ratedCurrent} A)`
                : `Rated capacity: ${ratedCurrent} A`}
            </span>
          </div>

          {/* Voltage & Runtime */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Line Voltage
              </span>
              <span className="font-mono font-bold text-slate-900">{voltage} V</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Active Runtime
              </span>
              <span className="font-mono font-bold text-emerald-800">
                {isRunning ? `${pumpDetails.currentRuntimeMinutes} mins` : '0 mins'}
              </span>
            </div>
          </div>
        </div>

        {/* Safety Protection Status Strip */}
        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-medium truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="truncate">Automatic Dry-Run & Overcurrent Protection Armed</span>
          </div>
          <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
            ACTIVE
          </span>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Quick Action Button */}
          {hasSafetyTrip ? (
            <button
              id="btn-quick-reset-pump"
              onClick={handleOpenStartModal}
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Reset Safety Lockout</span>
            </button>
          ) : isRunning ? (
            <button
              id="btn-quick-stop-pump"
              onClick={handleOpenStopModal}
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Power className="w-4 h-4" />
              <span>Stop Pump</span>
            </button>
          ) : (
            <button
              id="btn-quick-start-pump"
              onClick={handleOpenStartModal}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Power className="w-4 h-4" />
              <span>Start Pump</span>
            </button>
          )}

          {/* Full Pump Control Link */}
          <button
            id="btn-go-to-pump-control"
            onClick={() => {
              if (onViewControlCenter) {
                onViewControlCenter();
              } else {
                navigateTo('/pump-control');
              }
            }}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 transition-colors cursor-pointer py-1 self-end sm:self-center"
          >
            <span>Full Pump Controls</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={modalState.title}
        message={modalState.message}
        actionType={modalState.actionType}
        details={[
          { label: 'Field', value: selectedField.name },
          { label: 'Pump Unit', value: `${pumpDetails.name} (${pumpDetails.hpRating} HP)` },
          { label: 'Motor Telemetry', value: `${currentReading.motorCurrent.toFixed(1)} A / ${currentReading.voltage} V` }
        ]}
      />
    </>
  );
};
