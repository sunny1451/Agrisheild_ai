import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HealthScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  score,
  size = 'lg',
  showDetails = true
}) => {
  const { t } = useApp();

  // Status classification
  let statusText = 'HEALTHY';
  let colorClass = 'text-[#064D3B]';
  let strokeColor = '#2E7D32'; // Secondary green
  let badgeColor = 'bg-[#EAF6E5] text-[#064D3B] border-[#66BB6A]/40';
  let explanation = t.fieldHealthExplanationGood;
  let Icon = ShieldCheck;

  if (score < 50) {
    statusText = 'CRITICAL';
    colorClass = 'text-rose-600';
    strokeColor = '#e11d48'; // rose-600
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    explanation = t.fieldHealthExplanationCritical;
    Icon = AlertOctagon;
  } else if (score < 75) {
    statusText = 'WARNING';
    colorClass = 'text-amber-600';
    strokeColor = '#d97706'; // amber-600
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    explanation = t.fieldHealthExplanationWarning;
    Icon = AlertTriangle;
  } else if (score < 85) {
    statusText = 'GOOD';
    colorClass = 'text-[#2E7D32]';
    strokeColor = '#66BB6A';
    badgeColor = 'bg-[#EAF6E5] text-[#064D3B] border-[#66BB6A]/40';
  }

  // SVG Gauge Math (viewBox 0 0 100 100)
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      id="field-health-score-card"
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 w-full max-w-full"
    >
      <div className="flex flex-col items-center justify-center text-center shrink-0">
        <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">
          Field Health Score
        </h3>

        <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="8"
            />
            {/* Active Score Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight font-mono">
              {score}
            </span>
            <span className={`text-[10px] sm:text-xs font-bold tracking-tight uppercase ${colorClass}`}>
              {statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Details & Explanation */}
      {showDetails && (
        <div className="flex-1 text-center sm:text-left space-y-2.5 sm:space-y-3 pt-2 sm:pt-0 sm:border-l sm:border-slate-100 sm:pl-6 w-full min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Diagnostic Assessment
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold border ${badgeColor}`}>
              <Icon className="w-3.5 h-3.5" />
              {statusText}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-md mx-auto sm:mx-0">
            {explanation}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 pt-1 sm:pt-2 text-[11px] sm:text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              Edge Telemetry
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              {score >= 80 ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
              )}
              {score >= 80 ? 'Optimal Efficiency' : 'Action Suggested'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
