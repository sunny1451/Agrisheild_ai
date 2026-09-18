import React from 'react';
import { LayoutDashboard, Layers, Power, Bell, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { activeRoute, navigateTo, unreadAlertsCount, themeConfig, toggleMobileMenu, isMobileMenuOpen, pumpDetails, t } = useApp();

  const isPumpRunning = pumpDetails.status === 'RUNNING';
  const hasSafetyTrip = !!pumpDetails.activeSafetyTrip && !pumpDetails.activeSafetyTrip.resolved;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around w-full max-w-full">
      {/* Home / Dashboard */}
      <button
        onClick={() => navigateTo('/dashboard')}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeRoute === '/dashboard' || activeRoute === '/' ? 'font-bold' : 'text-slate-500 font-medium'
        }`}
        style={{ color: activeRoute === '/dashboard' || activeRoute === '/' ? themeConfig.primaryColor : undefined }}
      >
        <LayoutDashboard
          className={`w-5 h-5 ${activeRoute === '/dashboard' || activeRoute === '/' ? 'stroke-[2.5]' : 'text-slate-400'}`}
          style={{ color: activeRoute === '/dashboard' || activeRoute === '/' ? themeConfig.primaryColor : undefined }}
        />
        <span className="text-[10px] tracking-tight mt-0.5">{t.home || 'Home'}</span>
      </button>

      {/* Fields */}
      <button
        onClick={() => navigateTo('/fields')}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeRoute === '/fields' || activeRoute.startsWith('/fields/') ? 'font-bold' : 'text-slate-500 font-medium'
        }`}
        style={{ color: activeRoute === '/fields' || activeRoute.startsWith('/fields/') ? themeConfig.primaryColor : undefined }}
      >
        <Layers
          className={`w-5 h-5 ${activeRoute === '/fields' || activeRoute.startsWith('/fields/') ? 'stroke-[2.5]' : 'text-slate-400'}`}
          style={{ color: activeRoute === '/fields' || activeRoute.startsWith('/fields/') ? themeConfig.primaryColor : undefined }}
        />
        <span className="text-[10px] tracking-tight mt-0.5">{t.fields || 'Fields'}</span>
      </button>

      {/* Pump Control */}
      <button
        id="btn-nav-pump"
        onClick={() => navigateTo('/pump-control')}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeRoute === '/pump-control' ? 'font-bold' : 'text-slate-500 font-medium'
        }`}
        style={{ color: activeRoute === '/pump-control' ? themeConfig.primaryColor : undefined }}
      >
        <div className="relative">
          <Power
            className={`w-5 h-5 ${activeRoute === '/pump-control' ? 'stroke-[2.5]' : 'text-slate-400'}`}
            style={{ color: activeRoute === '/pump-control' ? themeConfig.primaryColor : undefined }}
          />
          {hasSafetyTrip ? (
            <span className="absolute -top-1 -right-2 min-w-[8px] h-2 w-2 rounded-full bg-rose-600 animate-ping" />
          ) : isPumpRunning ? (
            <span className="absolute -top-1 -right-2 min-w-[8px] h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          ) : null}
        </div>
        <span className="text-[10px] tracking-tight mt-0.5 font-bold uppercase">{t.pumpNav || 'Pump'}</span>
      </button>

      {/* Alerts */}
      <button
        onClick={() => navigateTo('/alerts')}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeRoute === '/alerts' ? 'font-bold' : 'text-slate-500 font-medium'
        }`}
        style={{ color: activeRoute === '/alerts' ? themeConfig.primaryColor : undefined }}
      >
        <div className="relative">
          <Bell
            className={`w-5 h-5 ${activeRoute === '/alerts' ? 'stroke-[2.5]' : 'text-slate-400'}`}
            style={{ color: activeRoute === '/alerts' ? themeConfig.primaryColor : undefined }}
          />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
              {unreadAlertsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{t.alerts ? t.alerts.split(' ')[0] : 'Alerts'}</span>
      </button>

      {/* More / Menu Drawer Toggle */}
      <button
        onClick={toggleMobileMenu}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isMobileMenuOpen ? 'font-bold' : 'text-slate-500 font-medium'
        }`}
        style={{ color: isMobileMenuOpen ? themeConfig.primaryColor : undefined }}
        aria-label="Toggle Full Menu"
      >
        <Menu
          className={`w-5 h-5 ${isMobileMenuOpen ? 'stroke-[2.5]' : 'text-slate-400'}`}
          style={{ color: isMobileMenuOpen ? themeConfig.primaryColor : undefined }}
        />
        <span className="text-[10px] tracking-tight mt-0.5">Menu</span>
      </button>
    </nav>
  );
};
