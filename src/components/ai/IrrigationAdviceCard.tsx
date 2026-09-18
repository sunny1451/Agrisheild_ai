import React, { useState } from 'react';
import { Droplets, Clock, ArrowRight, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import { IrrigationRecommendation } from '../../types/ai';
import { useApp } from '../../context/AppContext';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface IrrigationAdviceCardProps {
  recommendation: IrrigationRecommendation;
  onViewDetails?: () => void;
}

export const IrrigationAdviceCard: React.FC<IrrigationAdviceCardProps> = ({
  recommendation,
  onViewDetails
}) => {
  const { startPump, selectedDevice, selectedField, pumpDetails, t } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isRunning = pumpDetails.status === 'RUNNING';

  let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
  let cardBorder = 'border-blue-200 bg-linear-to-br from-blue-50/50 via-white to-emerald-50/30';

  if (recommendation.priority === 'CRITICAL') {
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
    cardBorder = 'border-rose-300 bg-rose-50/20';
  } else if (recommendation.priority === 'HIGH') {
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
    cardBorder = 'border-amber-200 bg-amber-50/20';
  }

  const handleStartPumpFromAdvice = () => {
    startPump(selectedDevice.id, `AI Recommended: ${recommendation.headline}`);
  };

  return (
    <>
      <div
        id="irrigation-advice-card"
        className={`rounded-2xl p-5 border shadow-sm transition-all duration-200 flex flex-col justify-between ${cardBorder}`}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t.irrigationAdvice}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {recommendation.headline}
                </h3>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase ${badgeColor}`}>
              {recommendation.priority} Priority
            </span>
          </div>

          {/* Advice Text */}
          <p className="text-sm text-slate-700 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-200/60">
            {recommendation.advice}
          </p>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-white rounded-lg p-2.5 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Target Window</span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {recommendation.estimatedTimeToIrrigateHours < 1
                  ? 'Immediate'
                  : `In ~${recommendation.estimatedTimeToIrrigateHours} hrs`}
              </span>
            </div>

            <div className="bg-white rounded-lg p-2.5 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Suggested Run</span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                {recommendation.suggestedDurationMinutes > 0
                  ? `${recommendation.suggestedDurationMinutes} mins`
                  : 'Skip cycle'}
              </span>
            </div>

            <div className="bg-white rounded-lg p-2.5 border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Water Savings</span>
              <span className="text-sm font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                ~{recommendation.waterSavingsPotentialLiters} L
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-200/80 mt-3">
          {recommendation.needed && !isRunning ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm shadow-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5" />
              Apply Advice (Start Pump)
            </button>
          ) : isRunning ? (
            <div className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Pump Currently Running ({pumpDetails.currentRuntimeMinutes} mins)
            </div>
          ) : (
            <div className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-medium text-xs text-center">
              Optimal Moisture — No Irrigation Required Now
            </div>
          )}

          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStartPumpFromAdvice}
        title="Start Irrigation Based on AI Advice"
        message={`Start ${pumpDetails.name} for the suggested ${recommendation.suggestedDurationMinutes} minutes duration?`}
        actionType="START"
        details={[
          { label: 'Field', value: selectedField.name },
          { label: 'Crop', value: selectedField.cropType },
          { label: 'Suggested Runtime', value: `${recommendation.suggestedDurationMinutes} mins` },
          { label: 'Expected Moisture Target', value: '65 - 75%' }
        ]}
      />
    </>
  );
};
