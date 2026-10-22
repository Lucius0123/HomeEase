import React from 'react';
import {
  LayoutDashboard,
  Radio,
  CalendarCheck,
  Smartphone,
  MapPin,
  Layers,
  Wrench,
  Users,
  CreditCard,
  TicketPercent,
  LifeBuoy,
  Star,
  SmartphoneNfc,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  History,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStore } from '../../services/mockStore';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeVariant?: 'violet' | 'amber' | 'red';
  allowedRoles?: string[];
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  collapsed,
  onToggleCollapse
}) => {
  const { role } = useAuth();
  const store = mockStore.getState();

  // Dynamic counts for badges
  const unassignedBookingsCount = store.bookings.filter(b => b.status === 'Requested').length;
  const openTicketsCount = store.tickets.filter(t => t.status === 'Open').length;
  const pendingKycCount = store.professionals.filter(p => p.kycStatus === 'Pending KYC').length;

  const NAV_GROUPS: NavGroup[] = [
    {
      group: 'Overview',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'live-operations', label: 'Live Operations', icon: Radio, allowedRoles: ['Super Admin', 'Operations Manager'] }
      ]
    },
    {
      group: 'Operations',
      items: [
        {
          id: 'bookings',
          label: 'Bookings',
          icon: CalendarCheck,
          badge: unassignedBookingsCount > 0 ? unassignedBookingsCount : undefined,
          badgeVariant: 'amber',
          allowedRoles: ['Super Admin', 'Operations Manager', 'Support Agent']
        },
        {
          id: 'partner-simulator',
          label: 'Partner Simulator',
          icon: Smartphone,
          badge: 'Demo',
          badgeVariant: 'violet',
          allowedRoles: ['Super Admin', 'Operations Manager']
        },
        {
          id: 'zones-slots',
          label: 'Zones & Slots',
          icon: MapPin,
          allowedRoles: ['Super Admin', 'Operations Manager']
        }
      ]
    },
    {
      group: 'Catalog',
      items: [
        {
          id: 'catalog',
          label: 'Services & Catalog',
          icon: Layers,
          allowedRoles: ['Super Admin', 'Operations Manager', 'Marketing']
        }
      ]
    },
    {
      group: 'People',
      items: [
        {
          id: 'professionals',
          label: 'Professionals',
          icon: Wrench,
          badge: pendingKycCount > 0 ? pendingKycCount : undefined,
          badgeVariant: 'amber',
          allowedRoles: ['Super Admin', 'Operations Manager']
        },
        {
          id: 'customers',
          label: 'Customers',
          icon: Users,
          allowedRoles: ['Super Admin', 'Operations Manager', 'Support Agent']
        }
      ]
    },
    {
      group: 'Money',
      items: [
        {
          id: 'payments-payouts',
          label: 'Payments & Payouts',
          icon: CreditCard,
          allowedRoles: ['Super Admin', 'Finance']
        },
        {
          id: 'offers-memberships',
          label: 'Offers & Plans',
          icon: TicketPercent,
          allowedRoles: ['Super Admin', 'Marketing']
        }
      ]
    },
    {
      group: 'Quality',
      items: [
        {
          id: 'support-disputes',
          label: 'Support & Disputes',
          icon: LifeBuoy,
          badge: openTicketsCount > 0 ? openTicketsCount : undefined,
          badgeVariant: 'red',
          allowedRoles: ['Super Admin', 'Operations Manager', 'Support Agent']
        },
        {
          id: 'reviews-quality',
          label: 'Reviews & Quality',
          icon: Star,
          allowedRoles: ['Super Admin', 'Operations Manager', 'Support Agent']
        }
      ]
    },
    {
      group: 'Growth',
      items: [
        {
          id: 'app-content-cms',
          label: 'App Content (CMS)',
          icon: SmartphoneNfc,
          badge: 'Live',
          badgeVariant: 'violet',
          allowedRoles: ['Super Admin', 'Marketing']
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          allowedRoles: ['Super Admin', 'Marketing']
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          allowedRoles: ['Super Admin', 'Operations Manager', 'Finance', 'Marketing']
        }
      ]
    },
    {
      group: 'Admin',
      items: [
        {
          id: 'settings-audit',
          label: 'Settings & Audit',
          icon: Settings,
          allowedRoles: ['Super Admin']
        }
      ]
    }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div
        style={{
          height: 72,
          padding: collapsed ? '0 18px' : '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--sidebar-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            className="clay-badge"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #8B73FF, #6C4DFF)',
              boxShadow: '0 8px 16px rgba(108, 77, 255, 0.35)'
            }}
          >
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          {!collapsed && (
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                HomeEase
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 6,
                    background: 'rgba(108, 77, 255, 0.3)',
                    color: '#C3B8FF',
                    border: '1px solid rgba(139, 115, 255, 0.3)'
                  }}
                >
                  ADMIN
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--sidebar-text-muted)' }}>
                Marketplace Operations
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--sidebar-border)',
              borderRadius: 8,
              color: 'var(--sidebar-text-muted)',
              cursor: 'pointer',
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <div style={{ padding: '10px 0', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--sidebar-border)',
              borderRadius: 8,
              color: 'var(--sidebar-text-muted)',
              cursor: 'pointer',
              padding: 6
            }}
            title="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Nav List */}
      <div style={{ flex: 1, padding: collapsed ? '12px 10px' : '16px 14px', overflowY: 'auto' }}>
        {NAV_GROUPS.map((grp, gIdx) => {
          // Filter items by role
          const visibleItems = grp.items.filter(item => {
            if (!item.allowedRoles) return true;
            return item.allowedRoles.includes(role);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={grp.group} style={{ marginBottom: 18 }}>
              {!collapsed && (
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--sidebar-text-muted)',
                    padding: '6px 12px',
                    marginBottom: 4
                  }}
                >
                  {grp.group}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {visibleItems.map(item => {
                  const isActive = currentView === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      title={collapsed ? item.label : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        width: '100%',
                        padding: collapsed ? '10px' : '9px 12px',
                        borderRadius: 10,
                        border: 'none',
                        background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                        color: isActive ? '#FFFFFF' : 'var(--sidebar-text-muted)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease-in-out',
                        outline: 'none',
                        position: 'relative'
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.color = '#FFFFFF';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--sidebar-text-muted)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                        <Icon
                          size={19}
                          style={{
                            color: isActive ? 'var(--primary)' : 'inherit',
                            flexShrink: 0
                          }}
                        />
                        {!collapsed && (
                          <span
                            style={{
                              fontSize: '13.5px',
                              fontWeight: isActive ? 600 : 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!collapsed && item.badge !== undefined && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: 10,
                            background:
                              item.badgeVariant === 'amber'
                                ? 'rgba(245, 159, 0, 0.25)'
                                : item.badgeVariant === 'red'
                                ? 'rgba(240, 82, 79, 0.25)'
                                : 'rgba(108, 77, 255, 0.25)',
                            color:
                              item.badgeVariant === 'amber'
                                ? '#FFC145'
                                : item.badgeVariant === 'red'
                                ? '#FF7A78'
                                : '#C3B8FF',
                            border: `1px solid ${
                              item.badgeVariant === 'amber'
                                ? 'rgba(245, 159, 0, 0.4)'
                                : item.badgeVariant === 'red'
                                ? 'rgba(240, 82, 79, 0.4)'
                                : 'rgba(108, 77, 255, 0.4)'
                            }`
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Role Indicator */}
      <div
        style={{
          padding: collapsed ? '14px 10px' : '16px 20px',
          borderTop: '1px solid var(--sidebar-border)',
          background: 'var(--sidebar-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--success)',
              boxShadow: '0 0 8px var(--success)',
              flexShrink: 0
            }}
          />
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '11px', color: 'var(--sidebar-text-muted)' }}>Acting as</div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {role}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
