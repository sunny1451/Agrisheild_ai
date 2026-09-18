import React from 'react';
import {
  Zap,
  Droplets,
  Activity,
  Cpu,
  ArrowRight,
  Radio,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Play,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AgriShieldLogo } from '../components/common/AgriShieldLogo';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useApp();

  const steps = [
    {
      number: '01',
      title: 'SENSE',
      subtitle: 'ESP32 Edge Sensing',
      description: 'Rugged sensors collect soil moisture, motor current (CT), line voltage (PT), water level (ultrasonic), and weather data in real-time.',
      icon: Radio,
      color: 'bg-[#EAF6E5] text-[#064D3B] border border-[#66BB6A]/40'
    },
    {
      number: '02',
      title: 'CONNECT',
      subtitle: 'Secure MQTT Telemetry',
      description: 'Low-latency, lightweight MQTT transport securely transmits edge packet data to the digital twin cloud gateway.',
      icon: Activity,
      color: 'bg-[#EAF6E5] text-[#2E7D32] border border-[#66BB6A]/40'
    },
    {
      number: '03',
      title: 'ANALYZE',
      subtitle: 'Predictive AI Models',
      description: 'Embedded neural networks evaluate motor vibration & thermal stress, predict faults, and compute crop water depletion curves.',
      icon: Cpu,
      color: 'bg-[#EAF6E5] text-[#064D3B] border border-[#66BB6A]/40'
    },
    {
      number: '04',
      title: 'ACT',
      subtitle: 'Autonomous Protection',
      description: 'Provides instant health scores, smart irrigation advice, automatic dry-run & overcurrent safety cutoff trips, and remote mobile control.',
      icon: ShieldCheck,
      color: 'bg-[#EAF6E5] text-[#2E7D32] border border-[#66BB6A]/40'
    }
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'Hardware Safety Cutoff Guard',
      desc: 'Automatic sub-second protection against dry-run cavitation (<1.5A) and winding overcurrent (>18A) prevents costly motor burnouts.'
    },
    {
      icon: Cpu,
      title: 'AI Motor Health Twin',
      desc: 'Predictive anomaly detection classifies bearing wear, impeller jams, and phase imbalance before catastrophic mechanical failure.'
    },
    {
      icon: Droplets,
      title: 'Crop-Aware Irrigation Advisor',
      desc: 'Soil moisture trend modeling calculates optimal irrigation windows and recommended pump runtimes, saving up to 35% groundwater.'
    },
    {
      icon: Smartphone,
      title: 'Multi-Language Farmer UX',
      desc: 'Designed for field accessibility with large high-contrast controls, voice-friendly summaries, and English, Telugu, and Hindi support.'
    },
    {
      icon: BarChart3,
      title: 'Historical Reports & Export',
      desc: 'Analyze power consumption (kWh), water pumped (Liters), voltage stability, and sensor health with 1-click CSV export.'
    },
    {
      icon: Sliders,
      title: 'Built-in Hardware Simulator',
      desc: 'Simulate realistic field conditions, virtual ESP32 sensor streams, and test safety cutoffs directly in your browser.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#EAF6E5] text-slate-900 flex flex-col justify-between">
      {/* Navigation Top */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#66BB6A]/30 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <AgriShieldLogo size="md" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/admin/simulator')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF6E5] hover:bg-[#EAF6E5]/80 text-[#064D3B] border border-[#66BB6A]/40 font-bold text-xs transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#2E7D32]" />
              Live Demo Simulator
            </button>
            <button
              onClick={() => navigateTo('/login')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#064D3B] hover:bg-[#EAF6E5] transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigateTo('/dashboard')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#064D3B] hover:bg-[#2E7D32] text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              Open Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#EAF6E5] via-[#EAF6E5]/80 to-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#66BB6A] text-[#064D3B] text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              Next-Gen AgriTech IoT & Predictive AI
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#064D3B] tracking-tight leading-tight">
              Smart Fields. <br />
              <span className="text-[#2E7D32]">Safer Pumps.</span> <br />
              Better Decisions.
            </h1>

            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              AgriShield AI combines real-time field monitoring, predictive AI and intelligent pump control to help farmers protect crops, water and equipment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-get-started-btn"
                onClick={() => navigateTo('/register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#064D3B] hover:bg-[#2E7D32] active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-request-demo-btn"
                onClick={() => navigateTo('/dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#EAF6E5] active:scale-95 text-[#064D3B] border-2 border-[#2E7D32]/30 font-bold text-sm shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#2E7D32]" />
                Explore Live Demo
              </button>
              <button
                onClick={() => navigateTo('/admin/simulator')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#EAF6E5] hover:bg-white text-[#064D3B] border border-[#66BB6A]/50 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-[#2E7D32]" />
                Test Fault Simulator
              </button>
            </div>

            {/* Quick Metrics Badge */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#66BB6A]/30 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <span className="text-2xl font-black text-[#064D3B] font-mono">99.8%</span>
                <span className="block text-xs text-slate-600 font-medium">Burnout Prevention</span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#2E7D32] font-mono">35%</span>
                <span className="block text-xs text-slate-600 font-medium">Water Conservation</span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#064D3B] font-mono">&lt; 2s</span>
                <span className="block text-xs text-slate-600 font-medium">Safety Cutoff Speed</span>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Mini-Preview */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#66BB6A]/30 space-y-5 relative z-10">
              <div className="flex items-center justify-between pb-3 border-b border-[#66BB6A]/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#064D3B] text-white flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#064D3B]">North Paddy Field</h3>
                    <span className="text-[10px] text-slate-500">ESP32-S3 Gateway • Online</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF6E5] text-[#064D3B] border border-[#66BB6A]/40">
                  Health: 87/100
                </span>
              </div>

              {/* Live Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#EAF6E5]/60 p-3 rounded-xl border border-[#66BB6A]/20">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase">Soil Moisture</span>
                  <span className="text-xl font-black text-[#064D3B] font-mono">62.4 %</span>
                  <span className="text-[10px] text-[#2E7D32] font-bold block mt-0.5">Optimal Range</span>
                </div>
                <div className="bg-[#EAF6E5]/60 p-3 rounded-xl border border-[#66BB6A]/20">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase">Motor Current</span>
                  <span className="text-xl font-black text-[#064D3B] font-mono">8.4 A</span>
                  <span className="text-[10px] text-[#2E7D32] font-bold block mt-0.5">Running Smooth</span>
                </div>
                <div className="bg-[#EAF6E5]/60 p-3 rounded-xl border border-[#66BB6A]/20">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase">Line Voltage</span>
                  <span className="text-xl font-black text-[#064D3B] font-mono">228 V</span>
                  <span className="text-[10px] text-slate-600 font-medium block mt-0.5">Grid Stable</span>
                </div>
                <div className="bg-[#EAF6E5]/60 p-3 rounded-xl border border-[#66BB6A]/20">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase">AI Fault Risk</span>
                  <span className="text-xl font-black text-[#2E7D32] font-mono">LOW</span>
                  <span className="text-[10px] text-[#2E7D32] font-bold block mt-0.5">Confidence 96%</span>
                </div>
              </div>

              {/* Pump Safety Status */}
              <div className="p-3.5 rounded-xl bg-[#EAF6E5] border border-[#66BB6A]/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#064D3B] uppercase block">Pump State</span>
                  <span className="text-sm font-bold text-[#064D3B] flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse" />
                    RUNNING (48 mins)
                  </span>
                </div>
                <button
                  onClick={() => navigateTo('/dashboard')}
                  className="px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#064D3B] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Live View
                </button>
              </div>
            </div>

            {/* Decorative background blur */}
            <div className="absolute -inset-4 bg-[#66BB6A]/30 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </section>

      {/* How it Works: 4-Step Pipeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#66BB6A]/20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              Architecture & Dataflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#064D3B] tracking-tight">
              How AgriShield AI Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              A 4-stage edge-to-cloud digital twin architecture connecting IoT sensor telemetry with predictive intelligence and fail-safe actuation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.number}
                  className="bg-[#EAF6E5] rounded-2xl p-6 border border-[#66BB6A]/30 hover:border-[#2E7D32] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color} font-bold`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-[#66BB6A]/60 font-mono">
                      {s.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#064D3B]">
                      {s.title}
                    </h3>
                    <p className="text-xs font-bold text-[#2E7D32] mt-0.5">
                      {s.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Benefits & Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#EAF6E5]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              Commercial-Grade Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#064D3B] tracking-tight">
              Built for Real Agricultural Realities
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Designed from the ground up for smallholder and mid-scale farmers dealing with unannounced power cuts, erratic grid voltage, and deep borewells.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-[#66BB6A]/30 hover:border-[#2E7D32] transition-all shadow-2xs space-y-3"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#EAF6E5] text-[#064D3B] flex items-center justify-center shadow-inner border border-[#66BB6A]/30">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#064D3B]">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Cutoff Showcase Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#064D3B] text-white">
        <div className="max-w-5xl mx-auto bg-[#064D3B]/90 rounded-3xl p-8 sm:p-10 border border-[#66BB6A]/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E7D32] border border-[#66BB6A]/40 text-white text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-[#66BB6A]" />
              24/7 Autonomous Protection
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Zero-Tolerance Motor Safety Cutoffs
            </h2>
            <p className="text-xs sm:text-sm text-[#EAF6E5]/90 leading-relaxed max-w-xl">
              When current drops below 1.5A (Dry Run) or surges above 18A (Overcurrent), AgriShield hardware relays trip in milliseconds to protect your pump motor from thousands of dollars in repairs.
            </p>
          </div>

          <button
            onClick={() => navigateTo('/admin/simulator')}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#66BB6A] hover:text-[#064D3B] active:scale-95 text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            Simulate Fault Scenarios
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#064D3B] text-[#EAF6E5] py-12 px-4 sm:px-8 border-t border-[#66BB6A]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <AgriShieldLogo size="sm" lightText />

          <div className="flex items-center gap-6 font-medium">
            <button onClick={() => navigateTo('/dashboard')} className="hover:text-white text-[#EAF6E5]/80 transition-colors cursor-pointer">Dashboard</button>
            <button onClick={() => navigateTo('/fields')} className="hover:text-white text-[#EAF6E5]/80 transition-colors cursor-pointer">Fields</button>
            <button onClick={() => navigateTo('/pump-control')} className="hover:text-white text-[#EAF6E5]/80 transition-colors cursor-pointer">Pump Control</button>
            <button onClick={() => navigateTo('/admin/simulator')} className="hover:text-white text-[#EAF6E5]/80 transition-colors cursor-pointer">Simulator</button>
          </div>

          <div className="text-[#EAF6E5]/70 text-center sm:text-right">
            © 2026 AgriShield AI. Built for Smart Agriculture.
          </div>
        </div>
      </footer>
    </div>
  );
};

