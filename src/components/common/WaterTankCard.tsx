import React from 'react';
import { Waves, ShieldAlert, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getWaterTankState, WATER_TANK_THRESHOLDS } from '../../types/waterTank';

interface WaterTankCardProps {
  onSimulateClick?: () => void;
}

export const WaterTankCard: React.FC<WaterTankCardProps> = ({ onSimulateClick }) => {
  const { currentReading, pumpDetails } = useApp();
  const waterLevel = Math.max(0, Math.min(100, Math.round(currentReading.waterLevel)));
  const tankState = getWaterTankState(waterLevel);
  const isPumpRunning = pumpDetails.status === 'RUNNING';

  // Check if pump was automatically stopped due to water tank condition
  const isTankFullCutoff = pumpDetails.activeSafetyTrip?.reason === 'WATER_TANK_FULL';
  const isTankEmptyCutoff = pumpDetails.activeSafetyTrip?.reason === 'WATER_TANK_EMPTY';
  const isSafetyStop = isTankFullCutoff || isTankEmptyCutoff;

  let stateBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

  if (tankState === 'FULL') {
    stateBadgeColor = 'bg-teal-100 text-teal-800 border-teal-300';
  } else if (tankState === 'EMPTY') {
    stateBadgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
  } else if (tankState === 'LOW') {
    stateBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  return (
    <div
      id="water-tank-safety-card"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 transition-all hover:shadow-md flex flex-col justify-between space-y-4 w-full max-w-full"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold shrink-0">
            <Waves className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest truncate">
              WATER TANK
            </h3>
            <span className="text-sm sm:text-base font-bold text-slate-900 truncate block">
              Storage Reservoir
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider border ${stateBadgeColor}`}
          >
            {tankState}
          </span>
          {onSimulateClick && (
            <button
              onClick={onSimulateClick}
              className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="Open Simulator"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Tank Graphic & Metric Row */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center py-1">
        {/* Left Side: Water Percentage and State Details */}
        <div className="col-span-7 space-y-2 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
              {waterLevel}
            </span>
            <span className="text-lg sm:text-2xl font-bold text-slate-400 font-mono">%</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 flex-wrap">
              <span>Pump:</span>
              <span
                className={`font-black uppercase px-2 py-0.5 rounded-md text-[11px] ${
                  isPumpRunning
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {isPumpRunning ? 'RUNNING' : 'OFF'}
              </span>
            </div>

            {/* Threshold legend */}
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium space-y-0.5 pt-0.5 leading-tight">
              <div>• Safe: {WATER_TANK_THRESHOLDS.NORMAL_MIN}% – {WATER_TANK_THRESHOLDS.NORMAL_MAX}%</div>
              <div>• Cutoff: &ge;{WATER_TANK_THRESHOLDS.FULL_MIN}% / {WATER_TANK_THRESHOLDS.EMPTY}%</div>
            </div>
          </div>
        </div>

        {/* Right Side: Animated Visual Water Tank Container */}
        <div className="col-span-5 flex justify-center">
          <div className="relative w-18 sm:w-24 h-28 sm:h-36 rounded-2xl border-3 sm:border-4 border-slate-700 bg-slate-100 shadow-inner overflow-hidden flex flex-col justify-end p-1">
            {/* Tick Markers */}
            <div className="absolute inset-y-0 right-1 flex flex-col justify-between py-1 pointer-events-none z-10">
              <span className="text-[7px] sm:text-[8px] font-mono font-bold text-slate-500">100%</span>
              <span className="text-[7px] sm:text-[8px] font-mono font-bold text-slate-400">95%</span>
              <span className="text-[7px] sm:text-[8px] font-mono font-bold text-slate-400">30%</span>
              <span className="text-[7px] sm:text-[8px] font-mono font-bold text-slate-500">0%</span>
            </div>

            {/* High Level Marker Line (95%) */}
            <div className="absolute top-[5%] inset-x-0 border-b border-dashed border-teal-500/80 pointer-events-none z-10" />
            {/* Low Level Marker Line (30%) */}
            <div className="absolute top-[70%] inset-x-0 border-b border-dashed border-amber-500/80 pointer-events-none z-10" />

            {/* Water Fill Level */}
            <div
              className={`w-full rounded-b-xl transition-all duration-700 ease-out relative ${
                tankState === 'FULL'
                  ? 'bg-linear-to-t from-teal-600 to-cyan-400'
                  : tankState === 'EMPTY'
                  ? 'bg-rose-500'
                  : tankState === 'LOW'
                  ? 'bg-linear-to-t from-amber-500 to-amber-300'
                  : 'bg-linear-to-t from-[#064D3B] to-[#2E7D32]'
              }`}
              style={{ height: `${Math.max(4, waterLevel)}%` }}
            >
              {/* Subtle water ripple wave at top of water fill */}
              {waterLevel > 0 && (
                <div className="absolute -top-1 inset-x-0 h-2 bg-white/30 rounded-full animate-pulse blur-xs" />
              )}
            </div>

            {/* Tank Cap / Valve visual */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-1.5 sm:h-2 rounded-t-md bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Safety Cutoff Reason Banner if Automatic Safety Stop is active */}
      {isSafetyStop && (
        <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1 animate-in fade-in">
          <div className="flex items-center gap-1.5 font-bold text-rose-800">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Automatic Safety Stop</span>
          </div>
          <p className="text-slate-700 font-medium">
            Reason: <strong className="text-rose-900">{isTankFullCutoff ? 'Water Tank Full' : 'Water Tank Empty'}</strong>
          </p>
        </div>
      )}

      {/* When Normal / Low */}
      {!isSafetyStop && tankState === 'NORMAL' && (
        <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-[11px] sm:text-xs">Normal Operating Range (30% - 94%)</span>
        </div>
      )}

      {!isSafetyStop && tankState === 'LOW' && (
        <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold text-[11px] sm:text-xs">Low Water Level: Refill recommended</span>
        </div>
      )}
    </div>
  );
};
