import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { WaterTankNotificationBanner } from './components/common/WaterTankNotificationBanner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { FieldsPage } from './pages/FieldsPage';
import { FieldDetailsPage } from './pages/FieldDetailsPage';
import { PumpControlPage } from './pages/PumpControlPage';
import { AiInsightsPage } from './pages/AiInsightsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { DevicesPage } from './pages/DevicesPage';
import { SettingsPage } from './pages/SettingsPage';
import { SimulatorPage } from './pages/SimulatorPage';

const AppContent: React.FC = () => {
  const { activeRoute, user } = useApp();

  // Public Fullscreen Pages (Landing, Login, Register)
  if (activeRoute === '/' && !user) {
    return <LandingPage />;
  }
  if (activeRoute === '/login' && !user) {
    return <LoginPage />;
  }
  if (activeRoute === '/register' && !user) {
    return <RegisterPage />;
  }

  // App Layout with Navbar, Sidebar, and Mobile Nav
  const renderCurrentPage = () => {
    switch (activeRoute) {
      case '/':
      case '/dashboard':
        return <DashboardPage />;
      case '/fields':
        return <FieldsPage />;
      case '/fields/:id':
        return <FieldDetailsPage />;
      case '/pump-control':
        return <PumpControlPage />;
      case '/ai-insights':
        return <AiInsightsPage />;
      case '/alerts':
        return <AlertsPage />;
      case '/reports':
        return <ReportsPage />;
      case '/maintenance':
        return <MaintenancePage />;
      case '/devices':
        return <DevicesPage />;
      case '/settings':
        return <SettingsPage />;
      case '/admin/simulator':
        return <SimulatorPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="h-screen w-full max-w-none bg-[#EAF6E5] text-slate-900 flex flex-col antialiased overflow-hidden box-border">
      {/* Top Navigation - Full Screen Width */}
      <Navbar />

      {/* Main Container - 100% full desktop width, extreme left to extreme right */}
      <div className="flex-1 flex w-full max-w-none min-h-0 overflow-hidden box-border">
        {/* Sidebar (handles desktop static sidebar & mobile responsive drawer) */}
        <Sidebar />

        {/* Main Content Area - occupies all remaining width and independently scrolls */}
        <main
          id="main-dashboard-scroll-container"
          className="flex-1 min-w-0 w-full h-full p-3 sm:p-5 md:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto overflow-x-hidden space-y-4 sm:space-y-6 box-border"
        >
          <WaterTankNotificationBanner />
          {renderCurrentPage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation (visible on mobile only) */}
      <MobileBottomNav />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
