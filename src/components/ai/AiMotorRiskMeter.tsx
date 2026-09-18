import React from 'react';
import { Cpu, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Info } from 'lucide-react';
import { AiMotorRiskAssessment } from '../../types/ai';
import { useApp } from '../../context/AppContext';

interface AiMotorRiskMeterProps {
  assessment: AiMotorRiskAssessment;
  compact?: boolean;
}

export const AiMotorRiskMeter: React.FC<AiMotorRiskMeterProps> = ({
  assessment,
  compact = false
}) => {
  const { t } = useApp();

  let riskColor = 'text-emerald-700';
  let riskBg = 'bg-emerald-50 border-emerald-200';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let meterPosition = 'w-1/6 bg-emerald-500';

  if (assessment.riskLevel === 'MEDIUM') {
    riskColor = 'text-amber-700';
    riskBg = 'bg-amber-50 border-amber-200';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    meterPosition = 'w-1/2 bg-amber-500';
  } else if (assessment.riskLevel === 'HIGH') {
    riskColor = 'text-rose-700';
    riskBg = 'bg-rose-50 border-rose-300';
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    meterPosition = 'w-full bg-rose-600';
  }

  return (
    <div
      id="ai-motor-risk-component"
      className={`rounded-2xl p-5 border ${riskBg} bg-white shadow-sm transition-all duration-200 space-y-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.aiMotorRisk}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-base font-black ${riskColor}`}>
                {assessment.riskLevel === 'LOW' ? t.lowRisk : assessment.riskLevel === 'MEDIUM' ? t.mediumRisk : t.highRisk}
              </span>
              <span className="text-xs text-slate-400 font-semibold font-mono">
                ({assessment.riskScore}/100)
              </span>
            </div>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
          {(assessment.confidence * 100).toFixed(0)}% Confidence
        </span>
      </div>

      {/* Visual Risk Bar (LOW -> MEDIUM -> HIGH) */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <span className="text-emerald-700">LOW</span>
          <span className="text-amber-700">MEDIUM</span>
          <span className="text-rose-700">HIGH</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${meterPosition}`}
          />
        </div>
      </div>

      {/* Detected Fault Signature & Explanation */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2">
          {assessment.riskLevel === 'LOW' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : assessment.riskLevel === 'MEDIUM' ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-bold text-slate-800">
            {assessment.faultType}
          </span>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {assessment.explanation}
        </p>
      </div>

      {/* Key Diagnostic Indicators */}
      {!compact && assessment.indicators && (
        <div className="grid grid-cols-3 gap-2 pt-1">
          {assessment.indicators.map((ind, idx) => (
            <div key={idx} className="bg-white rounded-lg p-2 border border-slate-200 text-center text-xs">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase truncate">
                {ind.name}
              </span>
              <span
                className={`text-xs font-bold font-mono mt-0.5 block ${
                  ind.status === 'danger'
                    ? 'text-rose-600'
                    : ind.status === 'warning'
                    ? 'text-amber-600'
                    : 'text-emerald-700'
                }`}
              >
                {ind.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Notice / Architecture note */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>Edge TFLite / Neural inference model calibrated for agricultural induction motors.</span>
      </div>
    </div>
  );
};
