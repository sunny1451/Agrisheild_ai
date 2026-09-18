import React from 'react';
import { AgriShieldLogo } from './AgriShieldLogo';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Initializing telemetry engine...',
  fullScreen = true
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 bg-[#EAF6E5]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4'
    : 'w-full py-16 flex flex-col items-center justify-center p-4';

  return (
    <div id="agrishield-loading-screen" className={containerClasses}>
      <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
        {/* Animated Brand Logo */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-3xl bg-emerald-300/30 animate-ping opacity-40" />
          <AgriShieldLogo size="xl" withContainer className="relative drop-shadow-md" />
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              {message}
            </p>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Smart Agriculture • Motor Protection • AI Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
