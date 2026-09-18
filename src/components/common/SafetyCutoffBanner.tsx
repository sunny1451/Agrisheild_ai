import React from 'react';
import { ShieldAlert, AlertOctagon, RotateCcw, HelpCircle } from 'lucide-react';
import { SafetyCutoffEvent } from '../../types/pump';

interface SafetyCutoffBannerProps {
  tripEvent: SafetyCutoffEvent | null;
  onReset: () => void;
}

export const SafetyCutoffBanner: React.FC<SafetyCutoffBannerProps> = ({
  tripEvent,
  onReset
}) => {
  if (!tripEvent || tripEvent.resolved) return null;

  const isDryRun = tripEvent.reason === 'DRY_RUN_PROTECTION';

  return (
    <div
      id="safety-cutoff-active-banner"
      className="rounded-2xl border-2 border-rose-500 bg-rose-50 p-5 shadow-lg shadow-rose-100/50 space-y-4 animate-in slide-in-from-top-4 duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <AlertOctagon className="w-7 h-7 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white">
                CRITICAL ALERT
              </span>
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">
                AUTOMATIC SAFETY CUTOFF
              </span>
            </div>

            <h3 className="text-lg font-black text-rose-950 tracking-tight">
              {tripEvent.title}
            </h3>

            <p className="text-sm text-rose-900 font-medium max-w-2xl leading-relaxed">
              {tripEvent.description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={onReset}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Safety Lock
          </button>
        </div>
      </div>

      {/* Telemetry Snapshot at Trip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-rose-200 text-xs text-rose-900 font-medium">
        <div className="bg-white/80 rounded-lg p-2.5 border border-rose-200">
          <span className="text-[11px] text-rose-600 font-semibold block uppercase">Trigger Value</span>
          <span className="text-sm font-bold text-rose-950">
            {isDryRun ? `${tripEvent.triggerCurrent ?? 0.8} A (<1.5A)` : `${tripEvent.triggerCurrent ?? 21.4} A (>18A)`}
          </span>
        </div>
        <div className="bg-white/80 rounded-lg p-2.5 border border-rose-200">
          <span className="text-[11px] text-rose-600 font-semibold block uppercase">Device Target</span>
          <span className="text-sm font-bold text-rose-950">{tripEvent.deviceId}</span>
        </div>
        <div className="bg-white/80 rounded-lg p-2.5 border border-rose-200">
          <span className="text-[11px] text-rose-600 font-semibold block uppercase">Cutoff Timestamp</span>
          <span className="text-sm font-bold text-rose-950">
            {new Date(tripEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        <div className="bg-white/80 rounded-lg p-2.5 border border-rose-200">
          <span className="text-[11px] text-rose-600 font-semibold block uppercase">Hardware State</span>
          <span className="text-sm font-bold text-rose-950 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Failsafe Relay Open
          </span>
        </div>
      </div>

      {/* Helpful recovery hint */}
      <div className="flex items-center gap-2 text-xs text-rose-800 bg-white/60 p-2.5 rounded-lg border border-rose-200/80">
        <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
        <span>
          {isDryRun
            ? 'Safety logic engaged because the pump was running dry without water lubrication. Ensure groundwater level is recharged before re-arming.'
            : 'Safety logic engaged because electrical current exceeded safe thermal ratings. Ensure the pump motor rotor is free from mechanical jam.'}
        </span>
      </div>
    </div>
  );
};
