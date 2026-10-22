import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Views
import { LoginView } from './views/LoginView';
import { OverviewView } from './views/OverviewView';
import { LiveOperationsView } from './views/LiveOperationsView';
import { BookingsView } from './views/BookingsView';
import { PartnerSimulatorView } from './views/PartnerSimulatorView';
import { ZonesSlotsView } from './views/ZonesSlotsView';
import { CatalogView } from './views/CatalogView';
import { ProfessionalsView } from './views/ProfessionalsView';
import { CustomersView } from './views/CustomersView';
import { PaymentsPayoutsView } from './views/PaymentsPayoutsView';
import { OffersMembershipsView } from './views/OffersMembershipsView';
import { SupportDisputesView } from './views/SupportDisputesView';
import { ReviewsQualityView } from './views/ReviewsQualityView';
import { AppContentCMSView } from './views/AppContentCMSView';
import { NotificationsView } from './views/NotificationsView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsAuditView } from './views/SettingsAuditView';

const DashboardShell: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [currentView, setCurrentView] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navDetailId, setNavDetailId] = useState<string | undefined>(undefined);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: string, detailId?: string) => {
    setCurrentView(view);
    setNavDetailId(detailId);
  };

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView onNavigate={handleNavigate} />;
      case 'live-operations':
        return <LiveOperationsView onNavigate={handleNavigate} />;
      case 'bookings':
        return (
          <BookingsView
            initialDetailId={navDetailId}
            onClearDetailId={() => setNavDetailId(undefined)}
          />
        );
      case 'partner-simulator':
        return <PartnerSimulatorView />;
      case 'zones-slots':
        return <ZonesSlotsView />;
      case 'catalog':
        return <CatalogView initialServiceId={navDetailId} />;
      case 'professionals':
        return <ProfessionalsView initialProId={navDetailId} />;
      case 'customers':
        return <CustomersView initialCustId={navDetailId} />;
      case 'payments-payouts':
        return <PaymentsPayoutsView />;
      case 'offers-memberships':
        return <OffersMembershipsView />;
      case 'support-disputes':
        return <SupportDisputesView />;
      case 'reviews-quality':
        return <ReviewsQualityView />;
      case 'app-content-cms':
        return <AppContentCMSView />;
      case 'notifications':
        return <NotificationsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings-audit':
        return <SettingsAuditView />;
      default:
        return <OverviewView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-container">
      {/* Aurora Ambient Backdrop */}
      <div className="aurora-backdrop" />

      {/* Solid Deep Indigo Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Glass Sticky Top Bar */}
        <TopBar
          currentView={currentView}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dynamic Page Content */}
        <main className="page-body">
          {renderActiveView()}
        </main>
      </div>

      {/* Cmd + K Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardShell />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
