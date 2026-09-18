import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AgriShieldLogo } from '../components/common/AgriShieldLogo';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useApp();

  const [email, setEmail] = useState('ramesh.patel@agrishield.farm');
  const [password, setPassword] = useState('agrishield2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('agrishield2026');
  };

  return (
    <div className="min-h-screen bg-[#EAF6E5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-[#66BB6A]/30 space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AgriShieldLogo size="lg" withContainer />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#064D3B] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Sign in to monitor your fields and protect pump assets
            </p>
          </div>
        </div>

        {/* Quick Demo Fill Presets */}
        <div className="bg-[#EAF6E5] rounded-2xl p-3 border border-[#66BB6A]/40 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#064D3B]">
            <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>1-Click Demo Profiles</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('ramesh.patel@agrishield.farm')}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#EAF6E5]/70 border border-[#66BB6A]/40 text-[11px] font-semibold text-slate-800 text-left transition-colors cursor-pointer truncate"
            >
              🌾 Ramesh (Paddy)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('anita.sharma@agrishield.farm')}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#EAF6E5]/70 border border-[#66BB6A]/40 text-[11px] font-semibold text-slate-800 text-left transition-colors cursor-pointer truncate"
            >
              🌱 Anita (Cotton/Drip)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Farmer Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@agrishield.farm"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#064D3B] focus:ring-1 focus:ring-[#064D3B] text-sm font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 block">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-[#2E7D32] hover:text-[#064D3B] font-bold text-[11px] cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#064D3B] focus:ring-1 focus:ring-[#064D3B] text-sm font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#064D3B] hover:bg-[#2E7D32] active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to AgriShield</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          New to AgriShield?{' '}
          <button
            onClick={() => navigateTo('/register')}
            className="font-bold text-[#064D3B] hover:text-[#2E7D32] underline cursor-pointer"
          >
            Register Farm Account
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#064D3B]">Reset Farm Password</h3>
            <p className="text-xs text-slate-600">
              Enter your registered farmer email to receive a secure recovery code via SMS/Email.
            </p>

            {forgotSent ? (
              <div className="p-3 rounded-xl bg-[#EAF6E5] text-[#064D3B] font-medium text-xs border border-[#66BB6A]/40">
                Verification link sent to {forgotEmail || email}! Check your SMS inbox.
              </div>
            ) : (
              <input
                type="email"
                value={forgotEmail || email}
                onChange={e => setForgotEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-[#064D3B]"
                placeholder="farmer@example.com"
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setForgotSent(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
              {!forgotSent && (
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#064D3B] hover:bg-[#2E7D32] text-xs font-bold text-white"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
