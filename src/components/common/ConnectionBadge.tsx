import React from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { ConnectionState } from '../../types/telemetry';
import { useApp } from '../../context/AppContext';

interface ConnectionBadgeProps {
  status: ConnectionState;
  showText?: boolean;
  compact?: boolean;
}

export const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({
  status,
  showText = true,
  compact = false
}) => {
  const { t } = useApp();

  if (status === 'ONLINE') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF6E5] text-[#064D3B] border border-[#66BB6A]/40 shadow-2xs ${compact ? 'text-[11px] py-0.5 px-2' : ''}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#66BB6A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32]"></span>
        </span>
        <Wifi className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
        {showText && <span>{t.liveDataConnected}</span>}
      </div>
    );
  }

  if (status === 'WEAK') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs ${compact ? 'text-[11px] py-0.5 px-2' : ''}`}>
        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        {showText && <span>{t.connectionUnstable}</span>}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs ${compact ? 'text-[11px] py-0.5 px-2' : ''}`}>
      <span className="h-2 w-2 rounded-full bg-rose-500"></span>
      <WifiOff className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      {showText && <span>{t.deviceOffline}</span>}
    </div>
  );
};
