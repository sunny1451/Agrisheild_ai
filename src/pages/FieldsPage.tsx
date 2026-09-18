import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Plus,
  MapPin,
  X,
  CheckCircle2,
  Sprout,
  Activity,
  AlertTriangle,
  Cpu,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FieldInfo } from '../types/field';

export const FieldsPage: React.FC = () => {
  const {
    fields,
    allPumps,
    setSelectedFieldId,
    navigateTo,
    selectedFarm,
    addField,
    deleteField,
    devices,
    t,
    themeConfig
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [newFieldData, setNewFieldData] = useState({
    name: '',
    cropType: 'Paddy / Rice (BPT 5204)',
    customCrop: '',
    areaAcres: '3.5',
    soilType: 'Clay Loam',
    stage: 'Vegetative Phase',
    deviceId: devices[0]?.id || 'DEV-ESP32-01',
    initialMoisture: 65,
    healthScore: 92
  });

  const cropPresets = [
    'Paddy / Rice (BPT 5204)',
    'Bt Cotton (Hybrid)',
    'Sugarcane (Co 86032)',
    'Chilli & Tomato Intercrop',
    'Maize / Corn (Pioneer)',
    'Wheat (Sharbati)',
    'Groundnut (K6)',
    'Soybean (JS 335)',
    'Other / Custom Variety'
  ];

  const soilPresets = [
    'Clay Loam',
    'Black Clay Loam',
    'Red Sandy Loam',
    'Alluvial Silt',
    'Laterite Soil',
    'Sandy Clay'
  ];

  const stagePresets = [
    'Sowing / Germination',
    'Seedling & Rooting',
    'Vegetative Phase',
    'Flowering & Fruiting',
    'Grain Filling / Pod Formation',
    'Ripening & Maturity',
    'Harvest Ready'
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCrop =
      newFieldData.cropType === 'Other / Custom Variety' && newFieldData.customCrop.trim()
        ? newFieldData.customCrop.trim()
        : newFieldData.cropType;

    const created = addField({
      name: newFieldData.name.trim() || `Field Zone ${fields.length + 1}`,
      cropType: finalCrop,
      areaAcres: parseFloat(newFieldData.areaAcres) || 2.5,
      soilType: newFieldData.soilType,
      stage: newFieldData.stage,
      deviceId: newFieldData.deviceId,
      healthScore: Number(newFieldData.healthScore) || 90
    });

    setIsAddModalOpen(false);
    setSuccessMessage(`Field "${created.name}" created and active telemetry connected!`);
    setTimeout(() => setSuccessMessage(null), 4000);

    // Reset form
    setNewFieldData({
      name: '',
      cropType: 'Paddy / Rice (BPT 5204)',
      customCrop: '',
      areaAcres: '3.5',
      soilType: 'Clay Loam',
      stage: 'Vegetative Phase',
      deviceId: devices[0]?.id || 'DEV-ESP32-01',
      initialMoisture: 65,
      healthScore: 92
    });
  };

  return (
    <div id="fields-overview-view" className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.fieldZones || 'Farm Fields & Crop Blocks'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            {selectedFarm.name} • {fields.length} Active Monitored Zones
          </p>
        </div>

        <button
          id="btn-add-monitored-field"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addMonitoredField || 'Add Monitored Field'}</span>
        </button>
      </div>

      {/* Success alert notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="p-1 text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map(field => {
          const pump = allPumps[field.deviceId];
          const isRunning = pump?.status === 'RUNNING';
          const hasTrip = !!pump?.activeSafetyTrip && !pump?.activeSafetyTrip.resolved;

          let statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          let statusText = t.healthy || 'Healthy';
          if (hasTrip || field.healthScore < 50) {
            statusBadge = 'bg-rose-100 text-rose-800 border-rose-300';
            statusText = t.critical || 'Critical';
          } else if (field.healthScore < 75) {
            statusBadge = 'bg-amber-100 text-amber-800 border-amber-300';
            statusText = t.warning || 'Warning';
          }

          return (
            <div
              key={field.id}
              id={`field-card-${field.id}`}
              onClick={() => {
                setSelectedFieldId(field.id);
                navigateTo('/fields/:id', field.id);
              }}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-5 group relative"
            >
              {/* Top Row */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 font-mono">
                    {field.id.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge}`}>
                      {statusText}
                    </span>
                    {fields.length > 1 && (
                      <button
                        title="Delete Field Zone"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove field "${field.name}" from active monitoring?`)) {
                            deleteField(field.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {field.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {field.cropType} • {field.areaAcres} {t.acresLabel || 'Acres'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Soil: {field.soilType} • {field.stage}
                </p>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Health</span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {field.healthScore}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Moisture</span>
                  <span className="text-base font-black text-blue-700 font-mono">
                    {field.id === 'field-01' ? '62%' : field.id === 'field-02' ? '41%' : '72%'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Pump</span>
                  <span
                    className={`text-xs font-bold block mt-1 ${
                      hasTrip
                        ? 'text-rose-600'
                        : isRunning
                        ? 'text-emerald-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {hasTrip ? 'TRIPPED' : isRunning ? 'RUNNING' : 'STOPPED'}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-emerald-800">
                <span className="text-[11px] text-slate-400 font-normal">
                  Gateway: {field.deviceId}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Field Details</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Monitored Field Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div
            id="add-field-modal"
            className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {t.addMonitoredField || 'Add Monitored Field'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Register a new crop block with telemetry gateway
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              {/* Field Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  {t.fieldName || 'Field Name / Zone Identifier'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Sugarcane Zone (Zone D)"
                  value={newFieldData.name}
                  onChange={e => setNewFieldData({ ...newFieldData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              {/* Crop Variety */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  {t.cropTypeLabel || 'Crop Variety'} *
                </label>
                <select
                  value={newFieldData.cropType}
                  onChange={e => setNewFieldData({ ...newFieldData, cropType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                >
                  {cropPresets.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {newFieldData.cropType === 'Other / Custom Variety' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Custom Crop Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mustard / Sorghum"
                    value={newFieldData.customCrop}
                    onChange={e => setNewFieldData({ ...newFieldData, customCrop: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              )}

              {/* Area & Soil Type (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    {t.areaAcresLabel || 'Land Area (Acres)'} *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={newFieldData.areaAcres}
                    onChange={e => setNewFieldData({ ...newFieldData, areaAcres: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    {t.soilTypeLabel || 'Soil Type'}
                  </label>
                  <select
                    value={newFieldData.soilType}
                    onChange={e => setNewFieldData({ ...newFieldData, soilType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                  >
                    {soilPresets.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Growth Stage */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  {t.cropStageLabel || 'Crop Growth Stage'}
                </label>
                <select
                  value={newFieldData.stage}
                  onChange={e => setNewFieldData({ ...newFieldData, stage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                >
                  {stagePresets.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* IoT Gateway Device */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  {t.gatewayDevice || 'Assigned IoT Gateway Device'}
                </label>
                <select
                  value={newFieldData.deviceId}
                  onChange={e => setNewFieldData({ ...newFieldData, deviceId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-medium text-slate-800 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.id} — {d.name} ({d.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t.cancel || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.createField || 'Save & Monitor Field'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
