import React, { useState, useEffect } from 'react';
import {
  Radio,
  Wifi,
  WifiOff,
  Zap,
  Power,
  Clock,
  ShieldCheck,
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Battery,
  ChevronDown,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeviceInfo } from '../types/telemetry';

export const DevicesPage: React.FC = () => {
  const {
    devices,
    selectedDevice,
    setSelectedDeviceId,
    motorizedGateway,
    toggleMotorizedGateway,
    activateMotorizedGateway,
    deactivateMotorizedGateway,
    t
  } = useApp();

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Auto-dismiss toast after 3.5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleToggleGateway = () => {
    if (motorizedGateway.isActive) {
      deactivateMotorizedGateway();
      setToastMessage({
        text: 'Motorized Gateway deactivated.',
        type: 'info'
      });
    } else {
      activateMotorizedGateway();
      setToastMessage({
        text: 'Motorized Gateway activated successfully.',
        type: 'success'
      });
    }
  };

  const sensorLabelMap: Record<string, string> = {
    soilMoisture: 'Soil Moisture (Capacitive)',
    currentCT: 'Motor Current (CT Hall Sensor)',
    voltagePT: 'Mains Voltage (PT Sensor)',
    waterLevelUltrasonic: 'Water Level (Ultrasonic)',
    dht22: 'Temp & Humidity (DHT22)'
  };

  const onlineDevicesCount = devices.filter(d => d.status === 'ONLINE' || d.status === 'WEAK').length;
  const isGatewayActive = motorizedGateway.isActive;

  return (
    <div id="devices-management-view" className="w-full max-w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="gateway-toast-notification"
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 transform translate-y-0 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700 shadow-emerald-950/20'
              : 'bg-slate-900 text-white border-slate-700 shadow-slate-950/20'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-slate-300 shrink-0" />
          )}
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">AgriShield Gateway</p>
            <p className="text-sm font-medium">{toastMessage.text}</p>
          </div>
          <button
            id="close-gateway-toast"
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Device Gateway
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            IoT Edge Gateway controllers, telemetry transmission & simulated actuation control
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{onlineDevicesCount} of {devices.length} Gateways Operational</span>
        </div>
      </div>

      {/* Primary Gateway Selection & Control Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Status & Control Card */}
        <div
          id="motorized-gateway-card"
          className={`lg:col-span-2 rounded-3xl p-6 sm:p-8 border transition-all shadow-sm ${
            isGatewayActive
              ? 'bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 text-white border-emerald-600/50 ring-1 ring-emerald-500/30'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          {/* Card Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md transition-colors ${
                  isGatewayActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Radio className={`w-6 h-6 ${isGatewayActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Motorized Gateway
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isGatewayActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isGatewayActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
                    {isGatewayActive ? '● ACTIVE' : '● INACTIVE'}
                  </span>
                </div>
                <p className={`text-xs mt-1 font-medium ${isGatewayActive ? 'text-emerald-200/80' : 'text-slate-500'}`}>
                  Target Edge Node: <strong className={isGatewayActive ? 'text-white' : 'text-slate-800'}>{selectedDevice?.name || 'Growell Master Gateway'}</strong> ({selectedDevice?.id})
                </p>
              </div>
            </div>

            {/* Simulation mode indicator */}
            <div className={`self-start sm:self-auto px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
              isGatewayActive
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulated Edge Controller</span>
            </div>
          </div>

          {/* Core Gateway State Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
            {/* Status */}
            <div
              className={`p-4 rounded-2xl border transition-colors ${
                isGatewayActive
                  ? 'bg-white/5 border-white/10'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${isGatewayActive ? 'text-emerald-300' : 'text-slate-400'}`}>
                Status
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isGatewayActive ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                <span className={`text-sm sm:text-base font-black ${isGatewayActive ? 'text-emerald-300' : 'text-slate-700'}`}>
                  {isGatewayActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>

            {/* Connection */}
            <div
              className={`p-4 rounded-2xl border transition-colors ${
                isGatewayActive
                  ? 'bg-white/5 border-white/10'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${isGatewayActive ? 'text-emerald-300' : 'text-slate-400'}`}>
                Connection
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                {isGatewayActive ? (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-slate-400" />
                )}
                <span className={`text-sm sm:text-base font-black ${isGatewayActive ? 'text-emerald-300' : 'text-slate-700'}`}>
                  {isGatewayActive ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            </div>

            {/* Motor */}
            <div
              className={`p-4 rounded-2xl border transition-colors ${
                isGatewayActive
                  ? 'bg-white/5 border-white/10'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${isGatewayActive ? 'text-emerald-300' : 'text-slate-400'}`}>
                Motor
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <Zap className={`w-4 h-4 ${isGatewayActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className={`text-sm sm:text-base font-black ${isGatewayActive ? 'text-emerald-300' : 'text-slate-700'}`}>
                  {isGatewayActive ? 'READY' : 'STOPPED'}
                </span>
              </div>
            </div>

            {/* Last Activity */}
            <div
              className={`p-4 rounded-2xl border transition-colors ${
                isGatewayActive
                  ? 'bg-white/5 border-white/10'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${isGatewayActive ? 'text-emerald-300' : 'text-slate-400'}`}>
                Last Activity
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <Clock className={`w-4 h-4 ${isGatewayActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold truncate ${isGatewayActive ? 'text-slate-200' : 'text-slate-700'}`}>
                  {motorizedGateway.lastActivity}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              id="activate-motorized-gateway-button"
              onClick={handleToggleGateway}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg active:scale-[0.99] ${
                isGatewayActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-950/30'
                  : 'bg-[#064D3B] hover:bg-[#08634c] text-white shadow-emerald-950/20'
              }`}
            >
              <Power className="w-5 h-5" />
              <span>
                {isGatewayActive
                  ? 'DEACTIVATE MOTORIZED GATEWAY'
                  : 'ACTIVATE MOTORIZED GATEWAY'}
              </span>
            </button>
            <p className={`text-center text-xs mt-3 font-medium ${isGatewayActive ? 'text-emerald-300/80' : 'text-slate-400'}`}>
              {isGatewayActive
                ? 'Gateway active: telemetry streaming and automated digital twin motor protection engaged.'
                : 'Click to power on the gateway emulator and activate sensor telemetry ingestion.'}
            </p>
          </div>
        </div>

        {/* Selected Gateway Detail Panel */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Selected Gateway
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedDevice?.name}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {selectedDevice?.id}
            </span>
          </div>

          {/* Quick Gateway Selector Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">
              Switch Active Gateway
            </label>
            <div className="relative">
              <select
                id="gateway-device-selector"
                value={selectedDevice?.id}
                onChange={e => setSelectedDeviceId(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer pr-10"
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Gateway Hardware Specs */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Assigned Field:</span>
              <span className="font-bold text-slate-800">{selectedDevice?.fieldName}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">IP Address:</span>
              <span className="font-mono font-bold text-slate-800">{selectedDevice?.ipAddress || '192.168.1.101'}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Firmware Version:</span>
              <span className="font-mono font-bold text-emerald-700">{selectedDevice?.firmwareVersion || 'v2.4.1-agrishield'}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Battery / Power:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-emerald-600" />
                {selectedDevice?.batteryLevel ?? 96}% (Solar Powered)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5">
              <span className="text-slate-500 font-medium">Signal Strength:</span>
              <span className="font-mono font-bold text-slate-800">{selectedDevice?.rssi ?? -58} dBm (Strong)</span>
            </div>
          </div>
        </div>
      </div>

      {/* All Gateways Overview Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Registered Field Gateways & Nodes
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Click any gateway to switch monitoring focus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device: DeviceInfo) => {
            const isConnected = device.status === 'ONLINE' || device.status === 'WEAK';
            const isSelected = selectedDevice && device.id === selectedDevice.id;
            const sensorEntries = device.sensors ? Object.entries(device.sensors) : [];

            return (
              <div
                key={device.id}
                id={`gateway-card-${device.id}`}
                onClick={() => setSelectedDeviceId(device.id)}
                className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer space-y-5 shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top Banner */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                        isConnected ? 'bg-[#064D3B]' : 'bg-slate-500'
                      }`}
                    >
                      <Radio className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {device.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {device.id} • {device.fieldName}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${
                      isConnected
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {device.status || 'ONLINE'}
                  </span>
                </div>

                {/* Specs & Health metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Signal RSSI</span>
                    <span className="text-xs font-black text-slate-800 font-mono">
                      {device.rssi ?? -60} dBm {device.rssi > -65 ? '(Good)' : '(Fair)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Power / Battery</span>
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-600" />
                      {device.batteryLevel !== undefined ? `${device.batteryLevel}% (Solar/Bat)` : 'Mains 230V'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Firmware</span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {device.firmwareVersion || 'v2.4.1'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">IP Address</span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {device.ipAddress || '192.168.1.100'}
                    </span>
                  </div>
                </div>

                {/* Attached Sensor Channels */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Connected Sensor Probes ({sensorEntries.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sensorEntries.map(([sensorKey, status]) => (
                      <span
                        key={sensorKey}
                        className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1 ${
                          status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : status === 'degraded'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {sensorLabelMap[sensorKey] || sensorKey}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Selection Button */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    id={`select-gateway-btn-${device.id}`}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedDeviceId(device.id);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#064D3B] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ Selected Monitored Gateway' : 'Select This Gateway'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DevicesPage;
