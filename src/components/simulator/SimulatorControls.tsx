import React from 'react';
import { Sliders, Play, RotateCcw, AlertTriangle, Zap, Droplets, WifiOff, Activity, ShieldAlert, Waves, CheckCircle2, AlertOctagon, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FaultSimulationType } from '../../types/telemetry';
import { getWaterTankState, WATER_TANK_THRESHOLDS } from '../../types/waterTank';

export const SimulatorControls: React.FC = () => {
  const {
    simulator,
    triggerFault,
    clearFault,
    setManualOverride,
    toggleAutoLoop,
    currentReading,
    selectedDevice,
    pumpDetails,
    simulateEmptyTank,
    simulateLowWater,
    simulateNormalLevel,
    simulateFullTank
  } = useApp();

  const waterLevel = Math.max(0, Math.min(100, Math.round(currentReading.waterLevel)));
  const tankState = getWaterTankState(waterLevel);

  const faultButtons: {
    type: FaultSimulationType;
    label: string;
    description: string;
    icon: any;
    color: string;
    activeColor: string;
  }[] = [
    {
      type: 'NORMAL',
      label: 'NORMAL OPERATION',
      description: 'Nominal telemetry (62% moisture, 8.4A motor load, 228V grid).',
      icon: Play,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
      activeColor: 'bg-emerald-700 text-white ring-2 ring-emerald-600 shadow-md'
    },
    {
      type: 'DRY_RUN',
      label: 'SIMULATE DRY RUN',
      description: 'Motor current drops < 1.5A for > 10s. Triggers dry-run safety stop.',
      icon: Droplets,
      color: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100',
      activeColor: 'bg-rose-600 text-white ring-2 ring-rose-500 shadow-md'
    },
    {
      type: 'OVERCURRENT',
      label: 'SIMULATE OVERCURRENT',
      description: 'Motor current surges > 18A for > 2s. Triggers instant safety trip.',
      icon: Zap,
      color: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100',
      activeColor: 'bg-amber-600 text-white ring-2 ring-amber-500 shadow-md'
    },
    {
      type: 'VOLTAGE_DROP',
      label: 'SIMULATE VOLTAGE DROP',
      description: 'Grid drops to 168V. Winding thermal stress & undervoltage alarm.',
      icon: AlertTriangle,
      color: 'bg-orange-50 text-orange-900 border-orange-300 hover:bg-orange-100',
      activeColor: 'bg-orange-600 text-white ring-2 ring-orange-500 shadow-md'
    },
    {
      type: 'LOW_MOISTURE',
      label: 'SIMULATE LOW MOISTURE',
      description: 'Soil moisture drops to 22.5%. Triggers urgent irrigation recommendation.',
      icon: Droplets,
      color: 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100',
      activeColor: 'bg-blue-600 text-white ring-2 ring-blue-500 shadow-md'
    },
    {
      type: 'DEVICE_OFFLINE',
      label: 'SIMULATE DEVICE OFFLINE',
      description: 'Virtual ESP32 gateway loses connectivity. Displays cached telemetry.',
      icon: WifiOff,
      color: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200',
      activeColor: 'bg-slate-800 text-white ring-2 ring-slate-700 shadow-md'
    }
  ];

  return (
    <div id="iot-simulator-panel" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-[#064D3B] to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 uppercase">
              IoT Telemetry Engine
            </span>
            <span className="text-xs text-emerald-300 font-mono">
              Target: {selectedDevice.id} ({selectedDevice.name})
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-1">
            AgriShield Virtual Sensor & Fault Simulator
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Simulate realistic ESP32 telemetry, water tank safety cutoffs, overcurrent surges, dry-run conditions, and grid fluctuations in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleAutoLoop}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              simulator.isAutoLoopEnabled
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {simulator.isAutoLoopEnabled ? 'Telemetry Engine: RUNNING' : 'Telemetry Engine: PAUSED'}
          </button>
          <button
            onClick={clearFault}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        </div>
      </div>

      {/* Simulator / Demo Safety Disclosure Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-950 uppercase tracking-wide">
            Simulator & Demo Safety Notice
          </h4>
          <p className="leading-relaxed text-amber-900">
            This automatic water-tank safety and failsafe trip control is currently running as a <strong>live demo / simulator behavior</strong> for software testing. While it models industrial cutoff logic, physical irrigation installations require local hardware relays, ultrasonic tank sensors, and certified motor contactor protection.
          </p>
        </div>
      </div>

      {/* Water Tank Automatic Safety Control Simulator Section */}
      <div className="bg-white rounded-2xl p-6 border-2 border-cyan-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Water-Tank Safety Control Engine
              </h3>
              <p className="text-xs text-slate-500">
                Test automatic pump stop at &ge;95% (Full) and 0% (Empty) with restart block
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Current Tank:</span>
            <span className="text-sm font-black font-mono text-slate-900">{waterLevel}%</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                tankState === 'FULL'
                  ? 'bg-teal-100 text-teal-800'
                  : tankState === 'EMPTY'
                  ? 'bg-rose-100 text-rose-800'
                  : tankState === 'LOW'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {tankState}
            </span>
          </div>
        </div>

        {/* 4 Dedicated Water Tank Simulation Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Water Tank State Injections
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Simulate Empty Tank (0%) */}
            <button
              id="simulate-empty-tank-btn"
              onClick={simulateEmptyTank}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                tankState === 'EMPTY'
                  ? 'bg-rose-600 text-white ring-2 ring-rose-500 shadow-md font-bold'
                  : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4" />
                  SIMULATE EMPTY TANK
                </span>
                <span className="text-xs font-mono font-black">0%</span>
              </div>
              <p className={`text-[11px] ${tankState === 'EMPTY' ? 'text-white/90' : 'text-slate-600'}`}>
                Engages immediate failsafe shutoff. Blocks manual restart.
              </p>
            </button>

            {/* 2. Simulate Low Water (15%) */}
            <button
              id="simulate-low-water-btn"
              onClick={simulateLowWater}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                tankState === 'LOW'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-500 shadow-md font-bold'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  SIMULATE LOW WATER
                </span>
                <span className="text-xs font-mono font-black">15%</span>
              </div>
              <p className={`text-[11px] ${tankState === 'LOW' ? 'text-white/90' : 'text-slate-600'}`}>
                Generates low-level warning alert. Pump continues running.
              </p>
            </button>

            {/* 3. Simulate Normal Level (60%) */}
            <button
              id="simulate-normal-level-btn"
              onClick={simulateNormalLevel}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                tankState === 'NORMAL'
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-600 shadow-md font-bold'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  SIMULATE NORMAL LEVEL
                </span>
                <span className="text-xs font-mono font-black">60%</span>
              </div>
              <p className={`text-[11px] ${tankState === 'NORMAL' ? 'text-white/90' : 'text-slate-600'}`}>
                Clears safety lockout. Pump stays OFF until manual restart.
              </p>
            </button>

            {/* 4. Simulate Full Tank (98%) */}
            <button
              id="simulate-full-tank-btn"
              onClick={simulateFullTank}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                tankState === 'FULL'
                  ? 'bg-teal-700 text-white ring-2 ring-teal-600 shadow-md font-bold'
                  : 'bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <Waves className="w-4 h-4" />
                  SIMULATE FULL TANK
                </span>
                <span className="text-xs font-mono font-black">98%</span>
              </div>
              <p className={`text-[11px] ${tankState === 'FULL' ? 'text-white/90' : 'text-slate-600'}`}>
                Automatically halts pump at &ge;95%. Blocks manual restart.
              </p>
            </button>
          </div>
        </div>

        {/* Dedicated Water Level Slider */}
        <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
            <span className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-600" />
              Continuous Water Level Slider (0% – 100%)
            </span>
            <span className="font-mono text-base font-black text-cyan-800">
              {waterLevel}% ({tankState})
            </span>
          </div>

          <input
            id="water-level-slider"
            type="range"
            min="0"
            max="100"
            step="1"
            value={waterLevel}
            onChange={e => setManualOverride('waterLevel', parseInt(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1">
            <span className="text-rose-600 font-bold">0% (Empty Cutoff)</span>
            <span className="text-amber-600">1% - 29% (Low)</span>
            <span className="text-emerald-700 font-bold">30% - 94% (Normal)</span>
            <span className="text-teal-700 font-bold">&ge;95% (Full Cutoff)</span>
          </div>
        </div>
      </div>

      {/* Electrical & Environmental Fault Injection Button Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            Electrical & Motor Fault Injections
          </h3>
          <span className="text-xs text-slate-500">
            Active Fault: <strong className="text-emerald-700">{simulator.activeFault}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {faultButtons.map(btn => {
            const isActive = simulator.activeFault === btn.type;
            const Icon = btn.icon;

            return (
              <button
                key={btn.type}
                onClick={() => (isActive && btn.type !== 'NORMAL' ? clearFault() : triggerFault(btn.type))}
                className={`p-4 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between gap-3 cursor-pointer ${
                  isActive ? btn.activeColor : btn.color
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Icon className="w-4 h-4" />
                    <span>{btn.label}</span>
                  </div>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-white text-slate-900">
                      ACTIVE
                    </span>
                  )}
                </div>

                <p className={`text-[11px] leading-relaxed ${isActive ? 'text-white/90' : 'text-slate-600'}`}>
                  {btn.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Active Safety Timers Indicator */}
      {(simulator.activeFault === 'DRY_RUN' || simulator.activeFault === 'OVERCURRENT') && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Safety Failsafe Timer Active: {simulator.activeFault}
              </h4>
              <p className="text-xs text-rose-700 font-medium">
                {simulator.activeFault === 'DRY_RUN'
                  ? `Dry run counter: ${simulator.dryRunTimerSeconds}s / 10s (Will trip contactor at 10s)`
                  : `Overcurrent surge counter: ${simulator.overcurrentTimerSeconds}s / 2s (Will trip contactor at 2s)`}
              </p>
            </div>
          </div>
          <span className="text-sm font-bold font-mono text-rose-900 bg-rose-200 px-3 py-1 rounded-lg">
            {simulator.activeFault === 'DRY_RUN' ? `${simulator.dryRunTimerSeconds}s` : `${simulator.overcurrentTimerSeconds}s`}
          </span>
        </div>
      )}

      {/* Fine-Tuning Telemetry Sliders */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Other Real-Time Sensor Channel Overrides
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Simulate motor load, grid voltage, and soil metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Motor Current Slider */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Motor Current (Amperes)</span>
              <span className="font-mono text-emerald-700 font-bold">
                {currentReading.motorCurrent.toFixed(1)} A
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={currentReading.motorCurrent}
              onChange={e => setManualOverride('motorCurrent', parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0A (Idle)</span>
              <span>1.5A (Dry-run)</span>
              <span>18A (Trip)</span>
              <span>25A</span>
            </div>
          </div>

          {/* Voltage Slider */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Line Voltage (Volts)</span>
              <span className="font-mono text-emerald-700 font-bold">
                {currentReading.voltage} V
              </span>
            </div>
            <input
              type="range"
              min="140"
              max="270"
              step="1"
              value={currentReading.voltage}
              onChange={e => setManualOverride('voltage', parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>140V (Brownout)</span>
              <span>230V (Optimal)</span>
              <span>270V (Surge)</span>
            </div>
          </div>

          {/* Soil Moisture Slider */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Soil Moisture (%)</span>
              <span className="font-mono text-emerald-700 font-bold">
                {currentReading.soilMoisture.toFixed(1)} %
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="1"
              value={currentReading.soilMoisture}
              onChange={e => setManualOverride('soilMoisture', parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10% (Wilting)</span>
              <span>60% (Adequate)</span>
              <span>95% (Saturated)</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Temperature (°C)</span>
              <span className="font-mono text-emerald-700 font-bold">
                {currentReading.temperature} °C
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="48"
              step="0.5"
              value={currentReading.temperature}
              onChange={e => setManualOverride('temperature', parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Humidity Slider */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Relative Humidity (%)</span>
              <span className="font-mono text-emerald-700 font-bold">
                {currentReading.humidity} %
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="98"
              step="1"
              value={currentReading.humidity}
              onChange={e => setManualOverride('humidity', parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Simulator Event & MQTT Payload Stream */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-inner space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-300">Live Virtual MQTT & Failsafe Event Log</span>
          </div>
          <span className="text-[11px] text-slate-500">Topic: agrishield/{selectedDevice.id}/telemetry</span>
        </div>

        <div className="h-44 overflow-y-auto space-y-1.5 text-xs pr-2 scrollbar-thin">
          {simulator.eventLog.map(evt => (
            <div key={evt.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-500 shrink-0 text-[11px]">
                [{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
              </span>
              <span
                className={`break-all ${
                  evt.type === 'critical'
                    ? 'text-rose-400 font-bold'
                    : evt.type === 'warning'
                    ? 'text-amber-300 font-semibold'
                    : evt.type === 'action'
                    ? 'text-emerald-300 font-semibold'
                    : 'text-slate-300'
                }`}
              >
                {evt.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
