import React from 'react';
import { AlertTriangle, Power, X, ShieldAlert } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  actionType: 'START' | 'STOP' | 'RESET';
  details?: { label: string; value: string }[];
  isSubmitting?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  actionType,
  details = [],
  isSubmitting = false
}) => {
  if (!isOpen) return null;

  const isStart = actionType === 'START';
  const isReset = actionType === 'RESET';

  let confirmBtnClass = 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200';
  let iconBgClass = 'bg-rose-100 text-rose-700';
  let Icon = Power;

  if (isStart) {
    confirmBtnClass = 'bg-[#064D3B] hover:bg-[#2E7D32] text-white shadow-sm';
    iconBgClass = 'bg-[#EAF6E5] text-[#064D3B] border border-[#66BB6A]/40';
    Icon = Power;
  } else if (isReset) {
    confirmBtnClass = 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-200';
    iconBgClass = 'bg-amber-100 text-amber-700';
    Icon = ShieldAlert;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {title}
              </h3>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Farmer Security Confirmation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm text-slate-700 leading-relaxed space-y-3">
          <p className="font-medium text-slate-800">{message}</p>

          {details.length > 0 && (
            <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
              {details.map((d, i) => (
                <div key={i} className="flex justify-between text-slate-600">
                  <span className="font-medium">{d.label}:</span>
                  <span className="font-bold text-slate-900">{d.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action distinction disclaimer */}
        <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            This is a <strong className="uppercase">MANUAL ACTION</strong> by the farmer. Hardware automated safety cutoffs operate independently 24/7.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isSubmitting}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all transform active:scale-95 cursor-pointer ${confirmBtnClass}`}
          >
            {isSubmitting ? 'Processing...' : isStart ? 'Confirm Start Pump' : isReset ? 'Reset Safety Lock' : 'Confirm Stop Pump'}
          </button>
        </div>
      </div>
    </div>
  );
};
