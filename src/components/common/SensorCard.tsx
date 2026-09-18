import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface SensorCardProps {
  id: string;
  title: string;
  value: number | string;
  unit: string;
  icon: LucideIcon;
  status: 'normal' | 'warning' | 'critical' | 'info';
  statusText?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  timestamp?: string;
  accentColor?: 'emerald' | 'blue' | 'amber' | 'purple' | 'cyan' | 'rose';
  subText?: string;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  id,
  title,
  value,
  unit,
  icon: Icon,
  status,
  statusText,
  trend = 'stable',
  trendValue,
  timestamp,
  accentColor = 'emerald',
  subText
}) => {
  // Status styling
  let cardBorder = 'border-slate-200 hover:border-slate-300';
  let iconBg = 'bg-emerald-50 text-emerald-600';
  let trendColor = 'text-slate-400';

  if (status === 'warning') {
    cardBorder = 'border-amber-300 ring-1 ring-amber-100';
    iconBg = 'bg-amber-50 text-amber-600';
    trendColor = 'text-amber-600';
  } else if (status === 'critical') {
    cardBorder = 'border-rose-300 ring-2 ring-rose-100 animate-pulse';
    iconBg = 'bg-rose-50 text-rose-600';
    trendColor = 'text-rose-600';
  } else if (accentColor === 'blue') {
    iconBg = 'bg-blue-50 text-blue-600';
  } else if (accentColor === 'amber') {
    iconBg = 'bg-amber-50 text-amber-600';
  } else if (accentColor === 'purple') {
    iconBg = 'bg-purple-50 text-purple-600';
  } else if (accentColor === 'cyan') {
    iconBg = 'bg-cyan-50 text-cyan-600';
  }

  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live';

  return (
    <div
      id={id}
      className={`bg-white border ${cardBorder} rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-200 min-h-[160px]`}
    >
      {/* Top row: Icon & Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>

        {statusText && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {statusText}
          </span>
        )}
      </div>

      {/* Metric Title & Value */}
      <div className="my-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-mono">
            {typeof value === 'number' ? value.toFixed(1) : value}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {unit}
          </span>
        </div>
      </div>

      {/* Footer: Trend / Status */}
      <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-50 mt-1">
        <div className="flex items-center gap-1 font-bold">
          {trend === 'up' && (
            <span className="flex items-center text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              {trendValue || 'Rising'}
            </span>
          )}
          {trend === 'down' && (
            <span className="flex items-center text-amber-600">
              <ArrowDownRight className="w-3 h-3" />
              {trendValue || 'Dropping'}
            </span>
          )}
          {trend === 'stable' && (
            <span className="flex items-center text-slate-400">
              <Minus className="w-3 h-3" />
              Steady Load
            </span>
          )}
        </div>

        <span className="text-slate-400 font-mono">
          {formattedTime}
        </span>
      </div>
    </div>
  );
};
