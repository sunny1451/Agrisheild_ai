import React from 'react';
import { ShieldAlert, CheckCircle2, AlertOctagon, X, ArrowRight, Droplets, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getWaterTankState } from '../../types/waterTank';

export const WaterTankNotificationBanner: React.FC = () => {
  const { currentReading, pumpDetails, navigateTo } = useApp();
  const [dismissedKey, setDismissedKey] = React.useState<string | null>(null);

  const waterLevel = Math.max(0, Math.min(100, Math.round(currentReading.waterLevel)));
  const tankState = getWaterTankState(waterLevel);

  const isFull = tankState === 'FULL';
  const isEmpty = tankState === 'EMPTY';
  const tripReason = pumpDetails.activeSafetyTrip?.reason;
  const isTankTrip = tripReason === 'WATER_TANK_FULL' || tripReason === 'WATER_TANK_EMPTY';

  if (!isFull && !isEmpty && !isTankTrip) {
    return null;
  }

  const bannerKey = `${tankState}-${pumpDetails.status}-${waterLevel}-${tripReason || 'notrip'}`;
  if (dismissedKey === bannerKey) {
    return null;
  }

  const isFullState = isFull || tripReason === 'WATER_TANK_FULL';

  return (
    <div
      id="water-tank-critical-floating-banner"
      className={`rounded-2xl p-4 sm:p-5 shadow-lg border-2 transition-all animate-in slide-in-from-top duration-300 ${
        isFullState
          ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-teal-900/10'
          : 'bg-rose-50 border-rose-500 text-rose-950 shadow-rose-900/10'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm ${
              isFullState ? 'bg-teal-600' : 'bg-rose-600 animate-pulse'
            }`}
          >
            {isFullState ? <CheckCircle2 className="w-6 h-6" /> : <AlertOctagon className="w-6 h-6" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5">
                {isFullState ? '🟢 WATER TANK FULL' : '🔴 WATER TANK EMPTY'}
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isFullState ? 'bg-teal-200 text-teal-900' : 'bg-rose-200 text-rose-900'
                }`}
              >
                Automatic Safety Stop
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium opacity-90">
              {isFullState
                ? 'The water tank is full. The irrigation pump has been automatically stopped.'
                : 'The water tank is empty. The irrigation pump has been automatically stopped to prevent unsafe operation.'}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold pt-0.5">
              <span>
                Pump Status: <strong className="font-black text-rose-700">OFF</strong>
              </span>
              <span>
                Reason: <strong className="font-black">{isFullState ? 'Water Tank Full' : 'Water Tank Empty'}</strong>
              </span>
              <span className="font-mono text-slate-700">
                Water Level: <strong className="underline">{waterLevel}%</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => navigateTo('/pump-control')}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-transform active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer ${
              isFullState ? 'bg-teal-700 hover:bg-teal-800' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <span>View Pump Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDismissedKey(bannerKey)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-black/5 rounded-xl transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
