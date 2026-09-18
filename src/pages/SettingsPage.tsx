import React, { useState, useEffect } from 'react';
import {
  User,
  Building,
  Bell,
  Sliders,
  Globe,
  Eye,
  CheckCircle2,
  Save,
  Phone,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types/user';

export const SettingsPage: React.FC = () => {
  const { user, updateUserProfile, language, setLanguage, t, themeConfig } = useApp();

  const [selectedLang, setSelectedLang] = useState<LanguageCode>(language);

  useEffect(() => {
    setSelectedLang(language);
  }, [language]);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Ramesh Patel',
    email: user?.email || 'ramesh.patel@agrishield.farm',
    phone: user?.phone || '+91 98480 23456',
    farmName: user?.farmName || 'Patel Green Agro Farms',
    farmLocation: user?.farmLocation || 'Godavari Delta, AP'
  });

  const [thresholds, setThresholds] = useState({
    minMoisture: 35,
    maxCurrent: 18.0,
    minVoltage: 190,
    maxVoltage: 255
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectLanguage = (langCode: LanguageCode) => {
    setSelectedLang(langCode);
    setLanguage(langCode);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLanguage(selectedLang);
    updateUserProfile({
      ...formData,
      language: selectedLang
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div id="settings-management-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t.settings || 'Farm Profile & System Settings'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Configure hardware thresholds, emergency SMS numbers, and multilingual preferences
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{t.saveSuccess || 'All configurations and preferences updated successfully!'}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Language & Accessibility (Prominently at the top for quick farmer access) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>{t.languageAndAccessibility || 'Language & Farmer Accessibility'}</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Active: {selectedLang === 'te' ? 'తెలుగు' : selectedLang === 'hi' ? 'हिंदी' : selectedLang === 'ta' ? 'தமிழ்' : 'English'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { code: 'en', label: 'English', desc: 'Standard Technical English', badge: 'EN' },
              { code: 'te', label: 'తెలుగు (Telugu)', desc: 'రైతు అనుకూల పదజాలం', badge: 'TE' },
              { code: 'hi', label: 'हिंदी (Hindi)', desc: 'किसान अनुकूल शब्दावली', badge: 'HI' },
              { code: 'ta', label: 'தமிழ் (Tamil)', desc: 'விவசாயிகள் பயன்பாட்டிற்கு', badge: 'TA' }
            ].map(lang => (
              <button
                key={lang.code}
                type="button"
                id={`lang-select-${lang.code}`}
                onClick={() => handleSelectLanguage(lang.code as LanguageCode)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  selectedLang === lang.code
                    ? 'border-emerald-600 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-600/30 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{lang.label}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${selectedLang === lang.code ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {lang.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-normal">{lang.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Farmer & Farm Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <User className="w-4 h-4 text-emerald-700" />
            <span>{t.farmerInfo || 'Farmer Information & Contact'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">{t.fullName || 'Full Name'}</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:border-emerald-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">{t.mobilePhone || 'Mobile Phone (SMS Cutoff Alerts)'}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 font-mono focus:border-emerald-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">{t.emailAddress || 'Email Address'}</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:border-emerald-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">{t.farmName || 'Farm / Landholding Name'}</label>
              <input
                type="text"
                value={formData.farmName}
                onChange={e => setFormData({ ...formData, farmName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Hardware Thresholds & Safety Limits */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>{t.hardwareThresholds || 'Failsafe Trigger Thresholds (ESP32 Guard)'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="font-bold text-slate-700 block">Min Moisture (%)</label>
              <input
                type="number"
                value={thresholds.minMoisture}
                onChange={e => setThresholds({ ...thresholds, minMoisture: parseInt(e.target.value) || 0 })}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400">Triggers irrigation advice</span>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="font-bold text-slate-700 block">Overcurrent Trip (A)</label>
              <input
                type="number"
                step="0.5"
                value={thresholds.maxCurrent}
                onChange={e => setThresholds({ ...thresholds, maxCurrent: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold text-rose-700"
              />
              <span className="text-[10px] text-slate-400">Immediate contactor cutoff</span>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="font-bold text-slate-700 block">Min Voltage (V)</label>
              <input
                type="number"
                value={thresholds.minVoltage}
                onChange={e => setThresholds({ ...thresholds, minVoltage: parseInt(e.target.value) || 0 })}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400">Undervoltage alarm</span>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="font-bold text-slate-700 block">Max Voltage (V)</label>
              <input
                type="number"
                value={thresholds.maxVoltage}
                onChange={e => setThresholds({ ...thresholds, maxVoltage: parseInt(e.target.value) || 0 })}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold text-amber-700"
              />
              <span className="text-[10px] text-slate-400">Overvoltage alarm</span>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            id="btn-save-settings"
            className="px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveSettings || 'Save System Configurations'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
