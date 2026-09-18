import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Filter,
  AlertTriangle,
  ShieldAlert,
  Info,
  Wrench,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AlertSeverity } from '../types/alerts';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertAsRead, markAllAlertsAsRead, navigateTo, setSelectedFieldId } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | AlertSeverity>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'ALL') return true;
    return a.severity === activeFilter;
  });

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          icon: ShieldAlert,
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          card: 'border-l-4 border-l-rose-600 bg-rose-50/30'
        };
      case 'WARNING':
        return {
          icon: AlertTriangle,
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          card: 'border-l-4 border-l-amber-500 bg-amber-50/20'
        };
      case 'MAINTENANCE':
        return {
          icon: Wrench,
          badge: 'bg-purple-100 text-purple-800 border-purple-300',
          card: 'border-l-4 border-l-purple-500 bg-purple-50/20'
        };
      default:
        return {
          icon: Info,
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          card: 'border-l-4 border-l-blue-500 bg-blue-50/20'
        };
    }
  };

  return (
    <div id="alerts-center-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Alerts & Safety Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Real-time audit log of hardware trips, environmental warnings, and maintenance alerts
          </p>
        </div>

        <button
          onClick={markAllAlertsAsRead}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          Mark All As Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {(['ALL', 'CRITICAL', 'WARNING', 'INFO', 'MAINTENANCE'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Alerts in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All sensors, field moisture levels, and pump motor current lines are running nominally.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const style = getSeverityBadge(alert.severity);
            const Icon = style.icon;

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${style.card} ${
                  !alert.isRead ? 'ring-1 ring-emerald-600/30' : 'opacity-90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${style.badge}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">
                        {alert.title}
                      </h4>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-black uppercase border ${style.badge}`}>
                        {alert.severity}
                      </span>
                      {!alert.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {alert.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(alert.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                      {alert.fieldId && <span>Field: {alert.fieldId.toUpperCase()}</span>}
                      {alert.deviceId && <span>Device: {alert.deviceId}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!alert.isRead && (
                    <button
                      onClick={() => markAlertAsRead(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}

                  {alert.fieldId && (
                    <button
                      onClick={() => {
                        setSelectedFieldId(alert.fieldId!);
                        navigateTo('/fields/:id', alert.fieldId);
                      }}
                      className="p-1.5 rounded-lg text-emerald-800 hover:bg-emerald-50 transition-colors"
                      title="Inspect Field"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
