import React, { useState } from 'react';
import {
  ArrowLeft,
  Layers,
  Droplets,
  Zap,
  Gauge,
  Thermometer,
  CloudRain,
  Activity,
  Cpu,
  Power,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { HealthScoreGauge } from '../components/common/HealthScoreGauge';
import { SensorCard } from '../components/common/SensorCard';
import { PumpStatusWidget } from '../components/common/PumpStatusWidget';
import { AiMotorRiskMeter } from '../components/ai/AiMotorRiskMeter';
import { IrrigationAdviceCard } from '../components/ai/IrrigationAdviceCard';

export const FieldDetailsPage: React.FC = () => {
  const {
    selectedField,
    selectedDevice,
    currentReading,
    healthScore,
    history24h,
    history7d,
    history30d,
    aiMotorRisk,
    irrigationRecommendation,
    navigateTo,
    t
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d'>('24h');
  const [selectedChartTab, setSelectedChartTab] = useState<'soil' | 'electrical' | 'environment'>('soil');

  const rawHistory = timeFilter === '24h' ? history24h : timeFilter === '7d' ? history7d : history30d;

  const chartData = rawHistory.map(item => {
    const d = new Date(item.timestamp);
    return {
      ...item,
      label: timeFilter === '24h'
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    };
  });

  return (
    <div id="field-details-view" className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={() => navigateTo('/fields')}
            className="flex items-center gap-1 font-bold text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Fields
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-900">{selectedField.name}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setTimeFilter('24h')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              timeFilter === '24h' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setTimeFilter('7d')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              timeFilter === '7d' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeFilter('30d')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              timeFilter === '30d' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Field Overview Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Zone ID: {selectedField.id.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Gateway: {selectedDevice.id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {selectedField.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 font-medium">
            <span><strong>Crop:</strong> {selectedField.cropType}</span>
            <span>•</span>
            <span><strong>Stage:</strong> {selectedField.stage}</span>
            <span>•</span>
            <span><strong>Area:</strong> {selectedField.areaAcres} Acres</span>
            <span>•</span>
            <span><strong>Soil:</strong> {selectedField.soilType}</span>
          </div>
        </div>

        <div className="shrink-0">
          <HealthScoreGauge score={healthScore} size="md" showDetails={false} />
        </div>
      </div>

      {/* 6 Sensor Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <SensorCard
          id="fd-moisture"
          title="Moisture"
          value={currentReading.soilMoisture}
          unit="%"
          icon={Droplets}
          status="normal"
          accentColor="blue"
        />
        <SensorCard
          id="fd-current"
          title="Current"
          value={currentReading.motorCurrent}
          unit="A"
          icon={Zap}
          status="normal"
          accentColor="emerald"
        />
        <SensorCard
          id="fd-voltage"
          title="Voltage"
          value={currentReading.voltage}
          unit="V"
          icon={Activity}
          status="normal"
          accentColor="amber"
        />
        <SensorCard
          id="fd-water"
          title="Water Head"
          value={currentReading.waterLevel}
          unit="cm"
          icon={Gauge}
          status="normal"
          accentColor="cyan"
        />
        <SensorCard
          id="fd-temp"
          title="Temperature"
          value={currentReading.temperature}
          unit="°C"
          icon={Thermometer}
          status="normal"
          accentColor="purple"
        />
        <SensorCard
          id="fd-humidity"
          title="Humidity"
          value={currentReading.humidity}
          unit="%"
          icon={CloudRain}
          status="normal"
          accentColor="blue"
        />
      </div>

      {/* Interactive Time-Series Charts */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Historical Telemetry & Twin Model Analytics ({timeFilter.toUpperCase()})
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setSelectedChartTab('soil')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedChartTab === 'soil' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Soil Moisture & Water Head
            </button>
            <button
              onClick={() => setSelectedChartTab('electrical')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedChartTab === 'electrical' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Current & Voltage Load
            </button>
            <button
              onClick={() => setSelectedChartTab('environment')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedChartTab === 'environment' ? 'bg-purple-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Temp, Humidity & Health
            </button>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {selectedChartTab === 'soil' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Legend />
                <Area type="monotone" dataKey="soilMoisture" name="Soil Moisture (%)" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#moistureGrad)" />
                <Line type="monotone" dataKey="waterLevel" name="Water Level (cm)" stroke="#06b6d4" strokeWidth={2} dot={false} />
              </AreaChart>
            ) : selectedChartTab === 'electrical' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="current" stroke="#059669" fontSize={11} domain={[0, 25]} />
                <YAxis yAxisId="voltage" orientation="right" stroke="#d97706" fontSize={11} domain={[160, 260]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Legend />
                <Line yAxisId="current" type="monotone" dataKey="motorCurrent" name="Motor Current (A)" stroke="#059669" strokeWidth={2.5} dot={false} />
                <Line yAxisId="voltage" type="monotone" dataKey="voltage" name="Voltage (V)" stroke="#d97706" strokeWidth={2} dot={false} />
              </LineChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="healthScore" name="Field Health Score" stroke="#7c3aed" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#e11d48" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Risk & Irrigation Advisory for this field */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AiMotorRiskMeter assessment={aiMotorRisk} />
        <IrrigationAdviceCard recommendation={irrigationRecommendation} />
      </div>
    </div>
  );
};
