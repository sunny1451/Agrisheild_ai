import React, { useState } from 'react';
import {
  Power,
  Zap,
  Activity,
  Clock,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  History,
  Info,
  CheckCircle2,
  AlertTriangle,
  Waves,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { SafetyCutoffBanner } from '../components/common/SafetyCutoffBanner';
import { ConnectionBadge } from '../components/common/ConnectionBadge';
import { WaterTankCard } from '../components/common/WaterTankCard';
import { PumpDetails } from '../types/pump';

export const PumpControlPage: React.FC = () => {
  const {
    pumpDetails,
    allPumps,
    currentReading,
    startPump,
    stopPump,
    resetSafetyTrip,
    addPump,
    deletePump,
    pumpLogs = [],
    selectedDevice,
    setSelectedDeviceId,
    selectedField,
    fields,
    devices,
    connectionStatus,
    waterTankState,
    blockedStartAttempt,
    clearBlockedStartAttempt,
    checkPumpStartEligibility,
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

  const [isAddPumpModalOpen, setIsAddPumpModalOpen] = useState(false);
  const [successPumpMessage, setSuccessPumpMessage] = useState<string | null>(null);

  const [newPumpData, setNewPumpData] = useState({
    name: '',
    hpRating: '5.0',
    pumpType: 'Submersible Borewell Pump (Deep Well)',
    fieldId: fields[0]?.id || 'field-01',
    deviceId: devices[0]?.id || 'DEV-ESP32-01',
    ratedCurrent: '12.5',
    maxCurrentTrip: '16.0',
    dryRunCurrentThreshold: '1.2'
  });

  const pumpTypePresets = [
    'Submersible Borewell Pump (Deep Well)',
    'Openwell Monobloc Pump (Canal/Pond)',
    'Solar Hybrid DC Surface Pump',
    'High-Pressure Drip Booster Motor',
    'Centrifugal Pipeline Pump'
  ];

  const handleAddPumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hp = parseFloat(newPumpData.hpRating) || 5.0;
    const defaultRated = Math.round(hp * 2.2 * 10) / 10;
    const rated = parseFloat(newPumpData.ratedCurrent) || defaultRated;

    const created = addPump({
      name: newPumpData.name.trim() || `${newPumpData.pumpType.split(' ')[0]} ${hp} HP Motor`,
      hpRating: hp,
      fieldId: newPumpData.fieldId,
      deviceId: newPumpData.deviceId,
      ratedCurrent: rated,
      maxCurrentTrip: parseFloat(newPumpData.maxCurrentTrip) || Math.round(rated * 1.3 * 10) / 10,
      dryRunCurrentThreshold: parseFloat(newPumpData.dryRunCurrentThreshold) || Math.round(rated * 0.15 * 10) / 10
    });

    setIsAddPumpModalOpen(false);
    setSelectedDeviceId(created.deviceId);
    setSuccessPumpMessage(`Farm pump "${created.name}" registered and connected to actuator!`);
    setTimeout(() => setSuccessPumpMessage(null), 4500);

    setNewPumpData({
      name: '',
      hpRating: '5.0',
      pumpType: 'Submersible Borewell Pump (Deep Well)',
      fieldId: fields[0]?.id || 'field-01',
      deviceId: devices[0]?.id || 'DEV-ESP32-01',
      ratedCurrent: '12.5',
      maxCurrentTrip: '16.0',
      dryRunCurrentThreshold: '1.2'
    });
  };

  const activeDeviceId = selectedDevice?.id || pumpDetails?.id || 'DEV-ESP32-01';
  const fieldName = selectedField?.name || 'Assigned Field';
  const cropType = selectedField?.cropType || 'Active Crop';
  const pumpName = pumpDetails?.name || 'Submersible Farm Pump';
  const hpRating = pumpDetails?.hpRating ?? 5;
  const isRunning = pumpDetails?.status === 'RUNNING';
  const hasSafetyTrip = Boolean(pumpDetails?.activeSafetyTrip && !pumpDetails.activeSafetyTrip.resolved);
  
  const startEligibility = checkPumpStartEligibility ? checkPumpStartEligibility(activeDeviceId) : { allowed: true };
  const isStartAllowed = Boolean(startEligibility?.allowed);

  const handleOpenStart = () => {
    if (hasSafetyTrip) {
      setModalState({
        isOpen: true,
        actionType: 'RESET',
        title: 'Safety Lockout Active',
        message: 'A safety cutoff trip occurred. Please confirm you have inspected the motor and pump lines before clearing the lockout.'
      });
      return;
    }

    if (!isStartAllowed) {
      setModalState({
        isOpen: true,
        actionType: 'START',
        title: startEligibility.title || 'Safety Lockout: Unsafe Tank Condition',
        message: `${startEligibility.reason || 'Safety lock engaged.'} ${startEligibility.detail || 'The system prevents starting the pump until safe operating conditions return.'}`
      });
      return;
    }

    setModalState({
      isOpen: true,
      actionType: 'START',
      title: 'Energize Farm Pump',
      message: `Start ${pumpName} (${hpRating} HP) on ${fieldName}? Contactors will close and telemetry will be logged.`
    });
  };

  const handleOpenStop = () => {
    setModalState({
      isOpen: true,
      actionType: 'STOP',
      title: 'Stop Farm Pump',
      message: `Are you sure you want to stop ${pumpName}? Water delivery will halt immediately.`
    });
  };

  const handleConfirm = () => {
    if (modalState.actionType === 'START') {
      startPump?.(activeDeviceId);
    } else if (modalState.actionType === 'STOP') {
      stopPump?.(activeDeviceId, 'Manual shutdown from pump control page', false);
    } else if (modalState.actionType === 'RESET') {
      resetSafetyTrip?.(activeDeviceId);
    }
  };

  const motorCurrent = currentReading?.motorCurrent ?? 0;
  const voltage = currentReading?.voltage ?? 230;
  const waterLevel = currentReading?.waterLevel ?? 60;
  const currentRuntimeMinutes = isRunning ? (pumpDetails?.currentRuntimeMinutes ?? 0) : 0;
  const totalRuntimeHours = pumpDetails?.totalRuntimeHours ?? 0;
  const allPumpsList: PumpDetails[] = Object.values(allPumps);

  return (
    <div id="pump-control-center" className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 font-mono">
              Actuator Unit: {(pumpDetails?.id || 'PUMP-01').toUpperCase()}
            </span>
            <ConnectionBadge status={connectionStatus} compact />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t.pumpControl || 'Farm Pump Control Center'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {pumpName} • {fieldName} ({cropType})
          </p>
        </div>

        <button
          id="btn-add-farm-pump"
          onClick={() => setIsAddPumpModalOpen(true)}
          className="px-4.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addPump || 'Add Farm Pump'}</span>
        </button>
      </div>

      {/* Success alert notification */}
      {successPumpMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successPumpMessage}</span>
          </div>
          <button
            onClick={() => setSuccessPumpMessage(null)}
            className="p-1 text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Multiple Pumps Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">Select Pump:</span>
        {allPumpsList.map((p) => {
          const isSelected = p.deviceId === selectedDevice.id || p.id === pumpDetails.id;
          const pIsRunning = p.status === 'RUNNING';
          const pHasTrip = !!p.activeSafetyTrip && !p.activeSafetyTrip.resolved;

          return (
            <div
              key={p.id}
              onClick={() => {
                setSelectedDeviceId(p.deviceId);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  pHasTrip
                    ? 'bg-rose-500 animate-ping'
                    : pIsRunning
                    ? 'bg-emerald-400 animate-pulse'
                    : isSelected ? 'bg-emerald-300' : 'bg-slate-400'
                }`}
              />
              <span>{p.name} ({p.hpRating} HP)</span>
              {allPumpsList.length > 1 && (
                <button
                  type="button"
                  title="Remove pump"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Remove pump "${p.name}"?`)) {
                      deletePump(p.deviceId);
                    }
                  }}
                  className={`p-0.5 rounded hover:text-rose-600 ${isSelected ? 'text-emerald-200 hover:text-white' : 'text-slate-400'}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Blocked Start Attempt Toast / Warning */}
      {blockedStartAttempt && (
        <div
          id="pump-start-blocked-banner"
          className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 text-rose-950 shadow-md flex items-start justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-wider text-rose-900">
                {blockedStartAttempt.title || 'Pump Start Blocked — Automatic Safety Interlock'}
              </h4>
              <p className="text-xs font-medium text-rose-800 leading-relaxed">
                {blockedStartAttempt.detail || blockedStartAttempt.reason}
              </p>
              <div className="text-[11px] font-mono text-rose-700">
                Water Tank Level: {Math.round(waterLevel)}% ({waterTankState || 'NORMAL'})
              </div>
            </div>
          </div>
          <button
            onClick={clearBlockedStartAttempt}
            className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Safety Cutoff Alert Banner if Tripped */}
      {pumpDetails?.activeSafetyTrip && (
        <SafetyCutoffBanner
          tripEvent={pumpDetails.activeSafetyTrip}
          onReset={() => resetSafetyTrip?.(activeDeviceId)}
        />
      )}

      {/* Main Console & Water Tank Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Control Console Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-all ${
                  hasSafetyTrip
                    ? 'bg-rose-600 ring-4 ring-rose-200 animate-pulse'
                    : isRunning
                    ? 'bg-emerald-600 ring-4 ring-emerald-100'
                    : 'bg-slate-700'
                }`}
              >
                <Power className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Motor Operating State
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`text-3xl font-black tracking-tight ${
                      hasSafetyTrip
                        ? 'text-rose-600'
                        : isRunning
                        ? 'text-emerald-700'
                        : 'text-slate-800'
                    }`}
                  >
                    {hasSafetyTrip ? 'SAFETY TRIPPED' : isRunning ? 'RUNNING' : 'STOPPED'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      hasSafetyTrip
                        ? 'bg-rose-100 text-rose-800'
                        : isRunning
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {hasSafetyTrip ? 'Lockout Active' : isRunning ? 'Energized' : 'Standby'}
                  </span>
                </div>
              </div>
            </div>

            {/* Big Action Buttons */}
            <div className="flex items-center gap-3">
              {hasSafetyTrip ? (
                <button
                  id="btn-main-reset-safety"
                  onClick={handleOpenStart}
                  className="px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset & Unlock Safety Trip
                </button>
              ) : isRunning ? (
                <button
                  id="btn-main-stop-pump"
                  onClick={handleOpenStop}
                  className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-sm shadow-lg shadow-rose-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Power className="w-5 h-5" />
                  {t?.stopPump || 'Stop Pump'}
                </button>
              ) : (
                <button
                  id="btn-main-start-pump"
                  onClick={handleOpenStart}
                  className="px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-black text-sm shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Power className="w-5 h-5" />
                  {t?.startPump || 'Start Pump'}
                </button>
              )}
            </div>
          </div>

          {/* Real-time Telemetry Readout Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Motor Current
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                {motorCurrent.toFixed(1)} <span className="text-xs text-slate-500 font-normal">A</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Trip Threshold: {pumpDetails?.maxCurrentTrip || 18} A
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                Grid Voltage
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                {voltage} <span className="text-xs text-slate-500 font-normal">V</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Operating Window: 190–250 V
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                Active Runtime
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                {currentRuntimeMinutes} <span className="text-xs text-slate-500 font-normal">mins</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Current active cycle
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-purple-500" />
                Total Lifetime
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                {totalRuntimeHours} <span className="text-xs text-slate-500 font-normal">hrs</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Cumulative logged hours
              </span>
            </div>
          </div>

          {/* Safety Features Footer Status Bar */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold text-emerald-900 block">
                  Safety Interlock Active (ESP32 Hardware Contactor Protection)
                </span>
                <span className="text-emerald-700 text-[11px]">
                  Automatic dry-run cutoff (&lt;{pumpDetails?.dryRunCurrentThreshold || 1.5} A) and overcurrent protection (&gt;{pumpDetails?.maxCurrentTrip || 18} A) armed
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white text-emerald-800 rounded-full font-bold border border-emerald-200 self-start sm:self-auto shrink-0">
              FAILSAFE ARMED
            </span>
          </div>
        </div>

        {/* Water Tank Card in Right Column */}
        <div className="lg:col-span-4 flex flex-col">
          <WaterTankCard />
        </div>
      </div>

      {/* Actuation Audit Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Actuation & Safety Event Audit Log
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Records {pumpLogs.length} events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 pb-2">
                <th className="py-2.5 font-bold uppercase text-[10px]">Timestamp</th>
                <th className="py-2.5 font-bold uppercase text-[10px]">Event / Action</th>
                <th className="py-2.5 font-bold uppercase text-[10px]">Operator / Origin</th>
                <th className="py-2.5 font-bold uppercase text-[10px]">Telemetry at Event</th>
                <th className="py-2.5 font-bold uppercase text-[10px]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pumpLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-mono text-[11px] text-slate-500">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.action === 'AUTO_SAFETY_STOP'
                          ? 'bg-rose-100 text-rose-800'
                          : log.action === 'MANUAL_START'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-slate-900">
                    {log.operator}
                  </td>
                  <td className="py-3 font-mono text-[11px]">
                    {log.currentAmps !== undefined ? `${log.currentAmps} A` : '-'} / {log.voltageVolts ? `${log.voltageVolts} V` : '-'}
                  </td>
                  <td className="py-3 text-slate-500 max-w-xs truncate">
                    {log.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Farm Pump Modal Dialog */}
      {isAddPumpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div
            id="add-pump-modal"
            className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Power className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {t.addPump || 'Add Farm Pump'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure a new motor unit with telemetry actuator
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddPumpModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddPumpSubmit} className="space-y-4 text-xs">
              {/* Pump Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Pump Name / Motor Identifier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Borewell 7.5 HP Submersible"
                  value={newPumpData.name}
                  onChange={e => setNewPumpData({ ...newPumpData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              {/* Pump Type Preset */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Pump Mechanism & Motor Type
                </label>
                <select
                  value={newPumpData.pumpType}
                  onChange={e => setNewPumpData({ ...newPumpData, pumpType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                >
                  {pumpTypePresets.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* HP Rating & Rated Current */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Motor Power (HP) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="50"
                    required
                    value={newPumpData.hpRating}
                    onChange={e => {
                      const hp = parseFloat(e.target.value) || 5;
                      const rated = (hp * 2.2).toFixed(1);
                      const maxTrip = (hp * 2.2 * 1.3).toFixed(1);
                      setNewPumpData({
                        ...newPumpData,
                        hpRating: e.target.value,
                        ratedCurrent: rated,
                        maxCurrentTrip: maxTrip
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Rated Load Current (A)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newPumpData.ratedCurrent}
                    onChange={e => setNewPumpData({ ...newPumpData, ratedCurrent: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              {/* Overcurrent Trip & Dry-run Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Overcurrent Trip (A)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newPumpData.maxCurrentTrip}
                    onChange={e => setNewPumpData({ ...newPumpData, maxCurrentTrip: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-medium text-rose-700 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Dry-Run Low Current (A)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newPumpData.dryRunCurrentThreshold}
                    onChange={e => setNewPumpData({ ...newPumpData, dryRunCurrentThreshold: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-medium text-amber-700 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              </div>

              {/* Assigned Field & IoT Gateway */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Assigned Field Zone
                  </label>
                  <select
                    value={newPumpData.fieldId}
                    onChange={e => setNewPumpData({ ...newPumpData, fieldId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                  >
                    {fields.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.cropType})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    IoT Gateway Contactor
                  </label>
                  <select
                    value={newPumpData.deviceId}
                    onChange={e => setNewPumpData({ ...newPumpData, deviceId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                  >
                    {devices.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.id} ({d.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPumpModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t.cancel || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.createPump || 'Save & Connect Pump'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirm}
        title={modalState.title}
        message={modalState.message}
        actionType={modalState.actionType}
        details={[
          { label: 'Field', value: fieldName },
          { label: 'Pump Unit', value: `${pumpName} (${hpRating} HP)` },
          { label: 'Current State', value: isRunning ? 'RUNNING' : 'STOPPED' },
          { label: 'Water Tank Level', value: `${Math.round(waterLevel)}% (${waterTankState || 'NORMAL'})` },
          { label: 'Live Telemetry', value: `${motorCurrent.toFixed(1)} A / ${voltage} V` }
        ]}
      />
    </div>
  );
};
