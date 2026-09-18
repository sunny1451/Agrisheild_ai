import React, { useState } from 'react';
import {
  Droplets,
  Zap,
  Gauge,
  Thermometer,
  CloudRain,
  Activity,
  ArrowRight,
  TrendingUp,
  Bell,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { HealthScoreGauge } from '../components/common/HealthScoreGauge';
import { SensorCard } from '../components/common/SensorCard';
import { PumpStatusWidget } from '../components/common/PumpStatusWidget';
import { WaterTankCard } from '../components/common/WaterTankCard';
import { SafetyCutoffBanner } from '../components/common/SafetyCutoffBanner';
import { AiMotorRiskMeter } from '../components/ai/AiMotorRiskMeter';
import { PumpOperationsCard } from '../components/common/PumpOperationsCard';

export const DashboardPage: React.FC = () => {
  const {
    currentReading,
    previousReading,
    healthScore,
    history24h,
    pumpDetails,
    resetSafetyTrip,
    aiMotorRisk,
    alerts,
    navigateTo,
    selectedField,
    t
  } = useApp();

  const [activeChartMetric, setActiveChartMetric] = useState<'soilMoisture' | 'motorCurrent' | 'voltage' | 'healthScore'>('soilMoisture');

  // Trend computations
  const moistureTrend = currentReading.soilMoisture > previousReading.soilMoisture ? 'up' : currentReading.soilMoisture < previousReading.soilMoisture ? 'down' : 'stable';
  const currentTrend = currentReading.motorCurrent > previousReading.motorCurrent ? 'up' : currentReading.motorCurrent < previousReading.motorCurrent ? 'down' : 'stable';
  const voltageTrend = currentReading.voltage > previousReading.voltage ? 'up' : currentReading.voltage < previousReading.voltage ? 'down' : 'stable';

  // Format chart time
  const formattedChartData = history24h.map(item => ({
    ...item,
    timeLabel: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  const recentAlerts = alerts.slice(0, 3);

  return (
    <div id="main-dashboard-view" className="space-y-4 sm:space-y-6 w-full max-w-full">
      {/* 1. Header / Farmer Information */}
      <Header />

      {/* Active Automatic Safety Cutoff Banner (If Tripped) */}
      <SafetyCutoffBanner
        tripEvent={pumpDetails.activeSafetyTrip}
        onReset={() => resetSafetyTrip()}
      />

      {/* 2. Top Hero Row: Field Health Score, Main Pump, and Water Tank */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Field Health Score & Diagnostic Assessment */}
        <div className="lg:col-span-4 w-full">
          <HealthScoreGauge score={healthScore} size="lg" />
        </div>

        {/* Main Pump Status Widget */}
        <div className="lg:col-span-4 w-full">
          <PumpStatusWidget />
        </div>

        {/* Water Tank */}
        <div className="lg:col-span-4 w-full">
          <WaterTankCard
            onSimulateClick={() => navigateTo('/admin/simulator')}
          />
        </div>
      </div>

      {/* 3. AI Motor Health & Pump Operations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-6 w-full">
          <AiMotorRiskMeter
            assessment={aiMotorRisk}
          />
        </div>
        <div className="lg:col-span-6 w-full">
          <PumpOperationsCard
            onViewControlCenter={() => navigateTo('/pump-control')}
          />
        </div>
      </div>

      {/* 4. Live 6-Sensor Telemetry Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Live Sensor Telemetry ({selectedField.name})
            </h3>
          </div>
          <button
            onClick={() => navigateTo('/admin/simulator')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            Simulate Values
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {/* Soil Moisture */}
          <SensorCard
            id="card-soil-moisture"
            title={t.soilMoisture}
            value={currentReading.soilMoisture}
            unit="%"
            icon={Droplets}
            status={currentReading.soilMoisture < 35 ? 'critical' : currentReading.soilMoisture < 50 ? 'warning' : 'normal'}
            statusText={currentReading.soilMoisture < 35 ? 'Low' : currentReading.soilMoisture > 80 ? 'Wet' : 'Optimal'}
            trend={moistureTrend}
            timestamp={currentReading.timestamp}
            accentColor="blue"
            subText="Capacitive probe"
          />

          {/* Motor Current */}
          <SensorCard
            id="card-motor-current"
            title={t.motorCurrent}
            value={currentReading.motorCurrent}
            unit="A"
            icon={Zap}
            status={currentReading.motorCurrent > 18 ? 'critical' : currentReading.motorCurrent > 14 ? 'warning' : 'normal'}
            statusText={currentReading.motorCurrent > 18 ? 'Surge' : currentReading.motorCurrent > 0 ? 'Active' : 'Idle'}
            trend={currentTrend}
            timestamp={currentReading.timestamp}
            accentColor="emerald"
            subText="Current CT Clamp"
          />

          {/* Line Voltage */}
          <SensorCard
            id="card-voltage"
            title={t.voltage}
            value={currentReading.voltage}
            unit="V"
            icon={Activity}
            status={currentReading.voltage < 190 || currentReading.voltage > 250 ? 'critical' : currentReading.voltage < 210 ? 'warning' : 'normal'}
            statusText={currentReading.voltage < 190 ? 'Low' : currentReading.voltage > 250 ? 'Surge' : 'Normal'}
            trend={voltageTrend}
            timestamp={currentReading.timestamp}
            accentColor="amber"
            subText="Grid Phase PT"
          />

          {/* Water Level */}
          <SensorCard
            id="card-water-level"
            title={t.waterLevel}
            value={currentReading.waterLevel}
            unit="cm"
            icon={Gauge}
            status={currentReading.waterLevel < 25 ? 'warning' : 'normal'}
            statusText={currentReading.waterLevel < 25 ? 'Low Head' : 'Adequate'}
            trend="stable"
            timestamp={currentReading.timestamp}
            accentColor="cyan"
            subText="Ultrasonic depth"
          />

          {/* Temperature */}
          <SensorCard
            id="card-temperature"
            title={t.temperature}
            value={currentReading.temperature}
            unit="°C"
            icon={Thermometer}
            status={currentReading.temperature > 38 ? 'warning' : 'normal'}
            statusText={currentReading.temperature > 38 ? 'Hot' : 'Normal'}
            trend="stable"
            timestamp={currentReading.timestamp}
            accentColor="purple"
            subText="Ambient DHT22"
          />

          {/* Humidity */}
          <SensorCard
            id="card-humidity"
            title={t.humidity}
            value={currentReading.humidity}
            unit="%"
            icon={CloudRain}
            status="normal"
            statusText="Nominal"
            trend="stable"
            timestamp={currentReading.timestamp}
            accentColor="blue"
            subText="Relative humidity"
          />
        </div>
      </div>

      {/* 5. 24-Hour Telemetry Trend Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              24-Hour Telemetry & Health Stream
            </h3>
            <p className="text-xs text-slate-500">
              Live continuous time series for {selectedField.name}
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs bg-slate-100 p-1 rounded-xl scrollbar-none">
            <button
              onClick={() => setActiveChartMetric('soilMoisture')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeChartMetric === 'soilMoisture'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Moisture (%)
            </button>
            <button
              onClick={() => setActiveChartMetric('motorCurrent')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeChartMetric === 'motorCurrent'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Current (A)
            </button>
            <button
              onClick={() => setActiveChartMetric('voltage')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeChartMetric === 'voltage'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Voltage (V)
            </button>
            <button
              onClick={() => setActiveChartMetric('healthScore')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeChartMetric === 'healthScore'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Health Score
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-56 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={
                      activeChartMetric === 'soilMoisture'
                        ? '#2563eb'
                        : activeChartMetric === 'motorCurrent'
                        ? '#059669'
                        : activeChartMetric === 'voltage'
                        ? '#d97706'
                        : '#7c3aed'
                    }
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={
                      activeChartMetric === 'soilMoisture'
                        ? '#2563eb'
                        : activeChartMetric === 'motorCurrent'
                        ? '#059669'
                        : activeChartMetric === 'voltage'
                        ? '#d97706'
                        : '#7c3aed'
                    }
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                domain={
                  activeChartMetric === 'voltage'
                    ? [140, 270]
                    : activeChartMetric === 'motorCurrent'
                    ? [0, 25]
                    : [0, 100]
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                }}
              />
              <Area
                type="monotone"
                dataKey={activeChartMetric}
                stroke={
                  activeChartMetric === 'soilMoisture'
                    ? '#2563eb'
                    : activeChartMetric === 'motorCurrent'
                    ? '#059669'
                    : activeChartMetric === 'voltage'
                    ? '#d97706'
                    : '#7c3aed'
                }
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#chartGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. Recent Alerts & Notifications Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3 w-full max-w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Recent Notifications & Safety Events</h3>
          </div>
          <button
            onClick={() => navigateTo('/alerts')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            View All ({alerts.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recentAlerts.map(alert => (
            <div
              key={alert.id}
              onClick={() => navigateTo('/alerts')}
              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-xs ${
                alert.severity === 'CRITICAL'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="truncate">{alert.title}</span>
                <span className="text-[10px] opacity-75 shrink-0">
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[11px] opacity-90 line-clamp-2 leading-relaxed">
                {alert.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
