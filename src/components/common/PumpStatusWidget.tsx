import React, { useState } from 'react';
import { Power, AlertOctagon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmationModal } from './ConfirmationModal';

interface PumpStatusWidgetProps {
  compact?: boolean;
}

export const PumpStatusWidget: React.FC<PumpStatusWidgetProps> = ({
  compact = false
}) => {
  const {
    pumpDetails,
    currentReading,
    startPump,
    stopPump,
    resetSafetyTrip,
    selectedDevice,
    selectedField
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
      message: `Are you sure you want to shut down the ${pumpDetails.name}? Pump operation will pause.`
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
        id="pump-status-card"
        className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm p-4 sm:p-6 flex flex-col justify-between w-full max-w-full ${
          hasSafetyTrip
            ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20'
            : isRunning
            ? 'border-[#66BB6A]/40 ring-1 ring-[#66BB6A]/20'
            : 'border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest truncate">
              Main Farm Pump
            </h3>
            <p className="text-base sm:text-lg font-bold text-[#064D3B] truncate">
              {pumpDetails.name} ({pumpDetails.hpRating} HP)
            </p>
          </div>

          <span
            className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shrink-0 ${
              hasSafetyTrip
                ? 'bg-rose-100 text-rose-700'
                : isRunning
                ? 'bg-[#EAF6E5] text-[#064D3B] border border-[#66BB6A]/40'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hasSafetyTrip
                  ? 'bg-rose-500 animate-ping'
                  : isRunning
                  ? 'bg-[#66BB6A] animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
            <span>{hasSafetyTrip ? 'TRIPPED' : isRunning ? 'RUNNING' : 'STANDBY'}</span>
          </span>
        </div>

        {/* Live Active Runtime Card */}
        <div className="my-2 p-3 sm:p-4 rounded-xl bg-[#EAF6E5]/60 border border-[#66BB6A]/30 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Field Assignment
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#064D3B] mt-0.5 truncate">
              {selectedField.name} • {selectedField.cropType}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Active Runtime
            </span>
            <span className="text-sm sm:text-base font-black text-[#064D3B] font-mono">
              {isRunning ? `${pumpDetails.currentRuntimeMinutes} mins` : '0 mins'}
            </span>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-3 gap-2 my-2.5 text-center text-xs">
          <div className="bg-white rounded-lg p-2 sm:p-2.5 border border-[#66BB6A]/30 shadow-2xs">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Current</span>
            <span className="text-xs sm:text-sm font-bold text-[#064D3B] font-mono mt-0.5 block">
              {currentReading.motorCurrent.toFixed(1)} A
            </span>
          </div>
          <div className="bg-white rounded-lg p-2 sm:p-2.5 border border-[#66BB6A]/30 shadow-2xs">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Voltage</span>
            <span className="text-xs sm:text-sm font-bold text-[#064D3B] font-mono mt-0.5 block">
              {currentReading.voltage} V
            </span>
          </div>
          <div className="bg-white rounded-lg p-2 sm:p-2.5 border border-[#66BB6A]/30 shadow-2xs">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Hours</span>
            <span className="text-xs sm:text-sm font-bold text-[#064D3B] font-mono mt-0.5 block">
              {pumpDetails.totalRuntimeHours.toFixed(1)} h
            </span>
          </div>
        </div>

        {/* Action Controls (Clean button, separate Control button removed) */}
        <div className="pt-3 border-t border-slate-100 mt-1">
          {hasSafetyTrip ? (
            <button
              id="btn-reset-safety-trip"
              onClick={handleOpenStartModal}
              className="w-full py-2.5 sm:py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" />
              Reset Safety Trip
            </button>
          ) : isRunning ? (
            <button
              id="btn-stop-pump-action"
              onClick={handleOpenStopModal}
              className="w-full py-2.5 sm:py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Power className="w-4 h-4" />
              Stop Pump
            </button>
          ) : (
            <button
              id="btn-start-pump-action"
              onClick={handleOpenStartModal}
              className="w-full py-2.5 sm:py-3 bg-[#064D3B] hover:bg-[#2E7D32] text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Power className="w-4 h-4" />
              Start Pump
            </button>
          )}
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
          { label: 'Current Telemetry', value: `${currentReading.motorCurrent.toFixed(1)} A / ${currentReading.voltage} V` }
        ]}
      />
    </>
  );
};
