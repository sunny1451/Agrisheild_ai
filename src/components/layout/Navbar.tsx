import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, LogOut, Sliders, Check, Menu, Layers, X, Cpu, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgriShieldLogo } from '../common/AgriShieldLogo';

export const Navbar: React.FC = () => {
  const {
    user,
    logout,
    selectedField,
    fields,
    setSelectedFieldId,
    connectionStatus,
    navigateTo,
    activeRoute,
    simulator,
    toggleMobileMenu
  } = useApp();

  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFieldModalOpen(false);
      }
    };
    if (isFieldModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFieldModalOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs w-full max-w-none">
        <div className="w-full max-w-none px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Menu, Logo & Fields Symbol with Arrow */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {user && (
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shrink-0"
                aria-label="Open Navigation Menu"
                title="Navigation Menu"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>
            )}

            {/* Logo Brand */}
            <button
              onClick={() => navigateTo(user ? '/dashboard' : '/')}
              className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer transition-opacity hover:opacity-95 shrink-0"
            >
              <AgriShieldLogo size="sm" />
            </button>

            {/* Fields Symbol with Arrow */}
            {user && (
              <button
                id="navbar-field-selector-btn"
                onClick={() => setIsFieldModalOpen(true)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs ml-1 ${
                  isFieldModalOpen
                    ? 'bg-emerald-100 border-emerald-600 ring-2 ring-emerald-600/20 text-[#064D3B]'
                    : 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-[#064D3B]'
                }`}
                title={`Current Field: ${selectedField.name} (Click to switch fields)`}
                aria-label="Open fields selection screen"
              >
                <Layers className="w-4 h-4 text-[#064D3B] shrink-0" />
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#064D3B] transition-transform duration-200 ${
                    isFieldModalOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {/* Right Action Controls: Simulator & User */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Simulator Quick Status Button */}
            <button
              id="navbar-simulator-btn"
              onClick={() => navigateTo('/admin/simulator')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                simulator.activeFault !== 'NORMAL'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                  : activeRoute === '/admin/simulator'
                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="Open IoT Telemetry & Fault Simulator"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulator</span>
              {simulator.activeFault !== 'NORMAL' && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-600 text-white font-black">
                  FAULT
                </span>
              )}
            </button>

            {/* User Profile */}
            {user ? (
              <div ref={userDropdownRef} className="relative">
                <button
                  id="navbar-user-profile-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-800 leading-none">
                      {user.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                      {user.farmName}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigateTo('/settings');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Farm Settings & Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('/login')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigateTo('/register')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer shadow-xs"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Screen-Centered Fields Selection Modal (Shown in center of screen, not on the side) */}
      {isFieldModalOpen && (
        <div
          id="fields-screen-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsFieldModalOpen(false)}
        >
          <div
            id="fields-screen-modal-content"
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#064D3B] text-white flex items-center justify-center shadow-xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Select Farm Field
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {fields.length} Monitored Crop Blocks • Current Active: <strong className="text-slate-800">{selectedField.name}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFieldModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fields List in the Screen */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 max-h-[60vh]">
              {fields.map((f, index) => {
                const isSelected = f.id === selectedField.id;
                return (
                  <button
                    key={f.id}
                    id={`modal-select-field-${f.id}`}
                    onClick={() => {
                      setSelectedFieldId(f.id);
                      setIsFieldModalOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-600 shadow-sm ring-1 ring-emerald-600/30'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      {/* Field Badge */}
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm transition-transform group-hover:scale-105 ${
                          isSelected
                            ? 'bg-[#064D3B] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {f.id === 'field-01' ? 'F1' : f.id === 'field-02' ? 'F2' : `F${index + 1}`}
                      </div>

                      {/* Field Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                            {f.name}
                          </span>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-700 text-white uppercase tracking-wider">
                              Active Field
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            {f.cropType}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-600">
                            {f.areaAcres} Acres
                          </span>
                          <span>•</span>
                          <span className="text-slate-500">
                            {f.soilType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Selection Indicator */}
                    <div className="shrink-0 flex items-center gap-2">
                      {isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                          Switch
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setIsFieldModalOpen(false);
                  navigateTo('/fields');
                }}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Open Full Field Map & Zones</span>
              </button>

              <button
                onClick={() => setIsFieldModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
