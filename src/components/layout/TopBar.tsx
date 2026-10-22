import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Sun,
  Moon,
  Bell,
  Activity,
  RotateCcw,
  LogOut,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../context/ToastContext';
import { Role } from '../../types';
import { Modal } from '../common/Modal';

interface TopBarProps {
  currentView: string;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onOpenSearch
}) => {
  const { user, role, setRole, logout, theme, toggleTheme } = useAuth();
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  React.useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  const viewTitles: Record<string, { group: string; title: string }> = {
    overview: { group: 'Overview', title: 'Dashboard' },
    'live-operations': { group: 'Overview', title: 'Live Operations Map' },
    bookings: { group: 'Operations', title: 'Bookings Management' },
    'partner-simulator': { group: 'Operations', title: 'Partner Mobile Simulator' },
    'zones-slots': { group: 'Operations', title: 'Zones & Slot Capacity' },
    catalog: { group: 'Catalog', title: 'Services & Packages' },
    professionals: { group: 'People', title: 'Professionals & Onboarding' },
    customers: { group: 'People', title: 'Customer Directory' },
    'payments-payouts': { group: 'Money', title: 'Payments & Payouts' },
    'offers-memberships': { group: 'Money', title: 'Offers & Memberships' },
    'support-disputes': { group: 'Quality', title: 'Support & Disputes Inbox' },
    'reviews-quality': { group: 'Quality', title: 'Customer Reviews & Quality' },
    'app-content-cms': { group: 'Growth', title: 'App Content (CMS)' },
    notifications: { group: 'Growth', title: 'Customer Notifications' },
    analytics: { group: 'Growth', title: 'Analytics & Funnels' },
    'settings-audit': { group: 'Admin', title: 'Settings & Audit Log' }
  };

  const currentMeta = viewTitles[currentView] || { group: 'HomeEase', title: 'Admin' };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setShowRoleMenu(false);
    addToast('info', `Switched role to ${newRole}`, `Sidebar menu & permission scopes updated.`);
  };

  const handleCityChange = (city: string) => {
    mockStore.setActiveCity(city);
    addToast('info', `City Filter: ${city}`, `Filtered overview, bookings and live pros for ${city}.`);
  };

  const handleToggleSimulation = () => {
    mockStore.toggleSimulation();
    const newState = !storeState.isSimulating;
    addToast(
      newState ? 'success' : 'info',
      newState ? 'Live Partner Simulator Active' : 'Simulation Paused',
      newState ? 'Professionals are moving in real time on the live operations map.' : 'Traffic simulation stopped.'
    );
  };

  const handleConfirmReset = () => {
    mockStore.resetDemoData();
    setShowResetModal(false);
    setShowProfileMenu(false);
    addToast('success', 'Demo Data Reset', 'All bookings, partners, payments and catalog restored to original seed values.');
  };

  const ROLES_LIST: Role[] = [
    'Super Admin',
    'Operations Manager',
    'Support Agent',
    'Finance',
    'Marketing'
  ];

  const CITIES = ['All Cities', 'Delhi NCR', 'Bengaluru', 'Lucknow'];

  return (
    <>
      <header className="topbar glass">
        {/* Left: Breadcrumbs & View Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--ink-2)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {currentMeta.group} /
            </div>
            <h1 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--ink)' }}>
              {currentMeta.title}
            </h1>
          </div>

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="btn btn-outline btn-sm"
            style={{
              gap: 8,
              padding: '6px 12px',
              borderRadius: 10,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              marginLeft: 12
            }}
          >
            <Search size={14} style={{ color: 'var(--ink-2)' }} />
            <span style={{ fontSize: '13px', color: 'var(--ink-2)' }}>Search...</span>
            <span
              style={{
                fontSize: '10px',
                padding: '1px 5px',
                borderRadius: 4,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                fontWeight: 700,
                color: 'var(--ink-3)'
              }}
            >
              ⌘K
            </span>
          </button>
        </div>

        {/* Right: City Filter, Live Traffic Simulator, Theme, Role Switcher, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* City Selector */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MapPin
              size={14}
              style={{
                position: 'absolute',
                left: 10,
                color: 'var(--primary)',
                pointerEvents: 'none',
                zIndex: 2
              }}
            />
            <select
              value={storeState.activeCity}
              onChange={e => handleCityChange(e.target.value)}
              className="form-select"
              style={{
                height: 36,
                paddingLeft: 30,
                paddingRight: 28,
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: 10,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              {CITIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Live Partner Traffic Simulation Toggle */}
          <button
            onClick={handleToggleSimulation}
            className="btn btn-sm"
            style={{
              background: storeState.isSimulating ? 'rgba(18, 184, 134, 0.15)' : 'var(--surface)',
              border: `1px solid ${storeState.isSimulating ? 'var(--success)' : 'var(--border)'}`,
              color: storeState.isSimulating ? 'var(--success)' : 'var(--ink-2)'
            }}
            title="Toggle live partner GPS traffic movement simulation"
          >
            <Activity
              size={14}
              style={{
                animation: storeState.isSimulating ? 'spin 3s linear infinite' : 'none'
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>
              {storeState.isSimulating ? 'Traffic: Live' : 'Simulate Traffic'}
            </span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ borderRadius: 10 }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Role Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="btn btn-secondary btn-sm"
              style={{ gap: 6, borderRadius: 10 }}
            >
              <UserCheck size={14} />
              <span>{role}</span>
              <ChevronDown size={14} />
            </button>

            {showRoleMenu && (
              <div
                className="glass"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: 220,
                  borderRadius: 12,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-e3)',
                  padding: '6px',
                  zIndex: 60
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                    padding: '6px 10px',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  Switch Demo Role
                </div>
                {ROLES_LIST.map(r => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: role === r ? 'var(--primary-soft)' : 'transparent',
                      color: role === r ? 'var(--primary)' : 'var(--ink)',
                      fontSize: '13px',
                      fontWeight: role === r ? 600 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{r}</span>
                    {role === r && <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 2
              }}
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name || 'Admin'}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--primary)'
                }}
              />
            </button>

            {showProfileMenu && (
              <div
                className="glass"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: 240,
                  borderRadius: 14,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-e3)',
                  padding: 8,
                  zIndex: 60
                }}
              >
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>{user?.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>{user?.email}</div>
                  <div style={{ marginTop: 6 }}>
                    <span className="chip chip-violet" style={{ fontSize: '11px' }}>{role}</span>
                  </div>
                </div>

                <div style={{ padding: '6px 0' }}>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowResetModal(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--warning)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--warning-soft)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <RotateCcw size={15} />
                    <span>Reset Demo Data</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      addToast('info', 'Logged Out', 'You have been logged out of HomeEase Admin.');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--danger)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-soft)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Reset Demo Data Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Demo Data?"
        subtitle="This will restore all bookings, professionals, payments, and catalog items to their initial seed state."
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowResetModal(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleConfirmReset}>
              Yes, Reset Everything
            </button>
          </>
        }
      >
        <div style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.6 }}>
          <p>
            Any reassignments, completed jobs, created coupons, or simulated events will be wiped
            clean and re-seeded with pristine data.
          </p>
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              background: 'var(--warning-soft)',
              color: '#8A5800',
              fontSize: '13px',
              display: 'flex',
              gap: 8
            }}
          >
            <span>💡</span>
            <span>Recommended right before doing a live client presentation walkthrough.</span>
          </div>
        </div>
      </Modal>
    </>
  );
};
