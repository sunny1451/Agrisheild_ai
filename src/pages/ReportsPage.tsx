import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Layers,
  Droplets,
  Zap,
  Activity,
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';

export const ReportsPage: React.FC = () => {
  const { fields, selectedField, history24h, history7d, history30d, pumpLogs } = useApp();

  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState(selectedField.id);
  const [isExporting, setIsExporting] = useState(false);

  const rawData = dateRange === '24h' ? history24h : dateRange === '7d' ? history7d : history30d;

  // Aggregate metrics
  const avgHealth = Math.round(rawData.reduce((acc, c) => acc + c.healthScore, 0) / (rawData.length || 1));
  const avgMoisture = (rawData.reduce((acc, c) => acc + c.soilMoisture, 0) / (rawData.length || 1)).toFixed(1);
  const totalHoursPumped = dateRange === '24h' ? 3.5 : dateRange === '7d' ? 24.8 : 98.4;
  const estimatedWaterLiters = Math.round(totalHoursPumped * 3600 * 2.8); // 2.8 L/s pump discharge
  const estimatedKwh = (totalHoursPumped * 5.5).toFixed(1); // 7.5 HP (~5.5kW)
  const safetyTripsCount = pumpLogs.filter(l => l.action === 'AUTO_SAFETY_STOP').length;

  const chartData = rawData.map(item => {
    const d = new Date(item.timestamp);
    return {
      ...item,
      label: dateRange === '24h'
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      waterEstimatedLiters: Math.round(item.motorCurrent > 0 ? 120 : 0)
    };
  });

  // Export to CSV functionality
  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['Timestamp', 'Field ID', 'Soil Moisture (%)', 'Motor Current (A)', 'Voltage (V)', 'Water Level (cm)', 'Temperature (C)', 'Humidity (%)', 'Health Score'];
      const rows = rawData.map(r => [
        new Date(r.timestamp).toISOString(),
        selectedFieldFilter,
        r.soilMoisture,
        r.motorCurrent,
        r.voltage,
        r.waterLevel,
        r.temperature,
        r.humidity,
        r.healthScore
      ]);

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `AgriShield_Report_${selectedFieldFilter}_${dateRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 400);
  };

  return (
    <div id="reports-analytics-view" className="space-y-6">
      {/* Header & Export button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Agricultural Telemetry & Resource Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Analyze historical water conservation, electricity usage, and equipment safety trends
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
          {isExporting ? 'Generating CSV...' : 'Export Telemetry CSV'}
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            Field Zone:
          </label>
          <select
            value={selectedFieldFilter}
            onChange={e => setSelectedFieldFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50"
          >
            {fields.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.cropType})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setDateRange('24h')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              dateRange === '24h' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 24h
          </button>
          <button
            onClick={() => setDateRange('7d')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              dateRange === '7d' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              dateRange === '30d' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Aggregate KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Avg Field Health</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 font-mono">{avgHealth}</span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block">Consistently Optimal</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Water Discharged</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-blue-700 font-mono">
              {(estimatedWaterLiters / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-400 font-bold">Liters</span>
          </div>
          <span className="text-[10px] text-blue-600 font-bold block">
            ~{totalHoursPumped} total runtime hours
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Electricity Consumed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-amber-700 font-mono">{estimatedKwh}</span>
            <span className="text-xs text-slate-400 font-bold">kWh</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Est. Cost: ~₹{Math.round(parseFloat(estimatedKwh) * 4.5)}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Failsafe Trips</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-rose-700 font-mono">{safetyTripsCount}</span>
            <span className="text-xs text-slate-400 font-bold">Trips</span>
          </div>
          <span className="text-[10px] text-rose-600 font-bold block">100% Motor Burnouts Averted</span>
        </div>
      </div>

      {/* Visual Bar Chart Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Soil Moisture vs Field Health Trajectory ({dateRange.toUpperCase()})
        </h3>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
              <Legend />
              <Bar dataKey="healthScore" name="Health Score" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="soilMoisture" name="Soil Moisture (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
