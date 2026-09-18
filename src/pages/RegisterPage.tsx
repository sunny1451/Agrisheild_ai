import React, { useState } from 'react';
import { User, Mail, Phone, Lock, MapPin, Building, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AgriShieldLogo } from '../components/common/AgriShieldLogo';

export const RegisterPage: React.FC = () => {
  const { register, navigateTo } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    farmName: '',
    farmLocation: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 8) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await register(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF6E5] flex items-center justify-center p-4 py-8">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-xl border border-[#66BB6A]/30 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AgriShieldLogo size="lg" withContainer />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#064D3B] tracking-tight">
              Register Farm Account
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Connect your field sensors and protect your irrigation assets
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-[#EAF6E5] border border-[#66BB6A]/40 text-[#064D3B] text-xs font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0" />
            <span>Registration successful! Launching your digital twin farm...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#064D3B] text-sm font-medium"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Phone (SMS Alerts) *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98480 00000"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#064D3B] text-sm font-medium"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh@myfarm.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#064D3B] text-sm font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Farm Name & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Farm Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={e => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="Green Valley Agro"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#064D3B] text-sm font-medium"
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Farm District / Location</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.farmLocation}
                  onChange={e => setFormData({ ...formData, farmLocation: e.target.value })}
                  placeholder="Godavari Basin, AP"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#064D3B] text-sm font-medium"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#064D3B] text-sm font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>Password Strength</span>
                  <span>{strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength <= 25 ? 'w-1/4 bg-rose-500' : strength <= 50 ? 'w-2/4 bg-amber-500' : strength <= 75 ? 'w-3/4 bg-blue-500' : 'w-full bg-[#2E7D32]'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#064D3B] hover:bg-[#2E7D32] active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Creating Farm Account...</span>
            ) : (
              <>
                <span>Complete Registration & Launch</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={() => navigateTo('/login')}
            className="font-bold text-[#064D3B] hover:text-[#2E7D32] underline cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
