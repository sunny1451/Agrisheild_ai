import React from 'react';
import { Calendar, MapPin, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC<{ title?: string; subtitle?: string }> = ({
  title,
  subtitle
}) => {
  const { user, selectedField, currentReading, t, navigateTo } = useApp();

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  let defaultGreeting = t.greetingMorning;
  if (hour >= 12 && hour < 17) defaultGreeting = t.greetingAfternoon;
  else if (hour >= 17) defaultGreeting = t.greetingEvening;

  const displayTitle = title || (user ? `${defaultGreeting}, ${user.fullName.split(' ')[0]}` : defaultGreeting);

  const formattedTime = new Date(currentReading.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div id="page-top-header" className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:px-6 sm:py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-2xs w-full max-w-full">
      {/* Title */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
          {displayTitle}
        </h1>
      </div>

      {/* Field Details Pill & Timestamp */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-4 text-xs border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100">
        {/* Prominent Active Field Badge */}
        <button
          onClick={() => navigateTo('/fields/:id', selectedField.id)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-950 transition-colors cursor-pointer text-left group"
          title={`View details for ${selectedField.name}`}
        >
          <MapPin className="w-3.5 h-3.5 text-[#064D3B] shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-xs text-slate-900 block truncate max-w-[180px] sm:max-w-[240px]">
              {selectedField.name}
            </span>
            <span className="text-[10px] text-emerald-800 font-medium block truncate">
              {selectedField.cropType} • {selectedField.areaAcres} Acres
            </span>
          </div>
          <Layers className="w-3 h-3 text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
        </button>

        {/* Live sync time */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 shrink-0">
          <span>{t.lastUpdated}:</span>
          <strong className="text-slate-700 font-mono font-bold">{formattedTime}</strong>
        </div>

        {/* Date badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-medium shrink-0 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};
