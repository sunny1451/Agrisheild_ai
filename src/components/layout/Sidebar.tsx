import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Power,
  Cpu,
  Bell,
  BarChart3,
  Wrench,
  Radio,
  Settings,
  Sliders,
  Bot,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgriAdvisorModal } from '../ai/AgriAdvisorModal';
import { AgriShieldLogo } from '../common/AgriShieldLogo';

export const Sidebar: React.FC = () => {
  const {
    activeRoute,
    navigateTo,
    unreadAlertsCount,
    simulator,
    pumpDetails,
    t,
    user,
    themeConfig,
    isMobileMenuOpen,
    closeMobileMenu
  } = useApp();

  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const hasActiveTrip = !!pumpDetails.activeSafetyTrip && !pumpDetails.activeSafetyTrip.resolved;

  const navItems = [
    { id: '/dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: '/fields', label: t.fields, icon: Layers },
    {
      id: '/pump-control',
      label: t.pumpControl,
      icon: Power,
      badge: hasActiveTrip ? 'TRIP' : pumpDetails.status === 'RUNNING' ? 'ON' : undefined,
      badgeColor: hasActiveTrip ? 'bg-rose-500 text-white' : 'bg-emerald-400 text-slate-950'
    },
    { id: '/ai-insights', label: t.aiInsights, icon: Cpu },
    {
      id: '/alerts',
      label: t.alerts,
      icon: Bell,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount.toString() : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: '/reports', label: t.reports, icon: BarChart3 },
    { id: '/maintenance', label: t.maintenance, icon: Wrench },
    { id: '/devices', label: t.devices, icon: Radio },
    { id: '/settings', label: t.settings, icon: Settings },
    {
      id: '/admin/simulator',
      label: t.simulator,
      icon: Sliders,
      badge: simulator.activeFault !== 'NORMAL' ? 'FAULT' : 'LIVE',
      badgeColor: simulator.activeFault !== 'NORMAL' ? 'bg-rose-500 text-white' : 'bg-emerald-400 text-slate-950'
    }
  ];

  const renderNavContent = (isMobile: boolean = false) => (
    <div className="flex flex-col justify-between min-h-full w-full">
      {/* Scrollable Container with all sections */}
      <div className="p-3.5 space-y-4">
        {/* Brand Header for Mobile Drawer */}
        {isMobile && (
          <div className="pb-3 pt-1 px-1 border-b border-white/10 flex items-center justify-between">
            <AgriShieldLogo size="sm" lightText />
            <button
              onClick={closeMobileMenu}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* SECTION 1: MAIN MANAGEMENT */}
        <div className="space-y-1">
          <div className="px-3 pt-1 pb-1 text-[10px] font-black text-emerald-400/90 uppercase tracking-widest">
            Main Management
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id || (item.id === '/fields' && activeRoute.startsWith('/fields/'));

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  onClick={() => {
                    navigateTo(item.id);
                    if (isMobile) closeMobileMenu();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? `${themeConfig.sidebarActiveBg} ${themeConfig.sidebarActiveText} shadow-xs font-bold`
                      : `${themeConfig.sidebarMutedText} hover:bg-white/10 hover:text-white`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-[12px] font-bold tracking-normal">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SECTION 2: AI AGRONOMIST */}
        <div className="pt-2 space-y-2 border-t border-white/10">
          <div className="px-3 pt-1 text-[10px] font-black text-emerald-400/90 uppercase tracking-widest">
            AI Agronomist
          </div>
          <div className="bg-black/35 border border-white/10 rounded-2xl p-3 text-white space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: themeConfig.primaryColor }}
              >
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold leading-tight truncate">Twin Diagnostics</h4>
                <span className="text-[10px] text-slate-300 font-medium block truncate">Automated Crop Health</span>
              </div>
            </div>
            <button
              id="sidebar-btn-consult-advisor"
              onClick={() => {
                setIsAdvisorOpen(true);
                if (isMobile) closeMobileMenu();
              }}
              className="w-full py-2 px-3 rounded-xl text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95 active:scale-[0.98]"
              style={{ backgroundColor: themeConfig.primaryColor }}
            >
              <Bot className="w-3.5 h-3.5" />
              Consult Advisor
            </button>
          </div>
        </div>

        {/* SECTION 3: PROFILE */}
        {user && (
          <div className="pt-2 pb-2 space-y-2 border-t border-white/10">
            <div className="px-3 pt-1 text-[10px] font-black text-emerald-400/90 uppercase tracking-widest">
              Profile
            </div>
            <div
              id="sidebar-user-profile-card"
              onClick={() => {
                navigateTo('/settings');
                if (isMobile) closeMobileMenu();
              }}
              className="bg-white/10 hover:bg-white/15 p-3 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer border border-white/10 group shadow-xs"
              title="View profile and farm settings"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0"
                style={{ backgroundColor: themeConfig.primaryColor }}
              >
                {user.fullName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate text-white leading-tight group-hover:text-emerald-300 transition-colors">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-slate-300 font-medium truncate mt-0.5">
                  {user.farmName || 'Primary Farm'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Full height below navbar, sticky, independently scrollable) */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:flex flex-col w-64 xl:w-70 ${themeConfig.sidebarBg} text-white h-full shrink-0 shadow-lg border-r border-black/20 transition-colors duration-300 overflow-y-auto sidebar-scroll`}
      >
        {renderNavContent(false)}
      </aside>

      {/* Mobile Drawer (Responsive slide-out when hamburger is opened) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={closeMobileMenu}
          />

          {/* Drawer Panel */}
          <aside className={`relative w-72 max-w-[85vw] ${themeConfig.sidebarBg} text-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto sidebar-scroll z-10 animate-in slide-in-from-left duration-200 pb-6`}>
            {renderNavContent(true)}
          </aside>
        </div>
      )}

      <AgriAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />
    </>
  );
};
