import React, { useState, useEffect } from 'react';
import {
  Calendar,
  IndianRupee,
  Users,
  Star,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { KPICard } from '../components/common/KPICard';
import { StatusChip } from '../components/common/StatusChip';
import { RevenueLineChart, CategoryDonutChart } from '../components/charts/InteractiveCharts';

interface OverviewViewProps {
  onNavigate: (view: string, detailId?: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const [store, setStore] = useState(mockStore.getState());
  const [dateRange, setDateRange] = useState('Today');

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStore(mockStore.getState());
    });
  }, []);

  const cityFilteredBookings = mockStore.getBookings();

  // Metrics computation
  const todayBookings = cityFilteredBookings;
  const bookingsCount = todayBookings.length;
  const revenueTotal = todayBookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + b.total, 0);

  const activePros = store.professionals.filter(p =>
    p.online && (store.activeCity === 'All Cities' || p.city === store.activeCity)
  ).length;

  const avgRating = (
    store.professionals.reduce((sum, p) => sum + p.rating, 0) / (store.professionals.length || 1)
  ).toFixed(2);

  const cancelledCount = cityFilteredBookings.filter(b => b.status === 'Cancelled').length;
  const cancelRate = ((cancelledCount / (cityFilteredBookings.length || 1)) * 100).toFixed(1);

  const pendingAssignments = cityFilteredBookings.filter(b => b.status === 'Requested');

  // Chart data
  const data7d = [
    { label: 'Thu 16', revenue: 38400, orders: 28 },
    { label: 'Fri 17', revenue: 44200, orders: 34 },
    { label: 'Sat 18', revenue: 61800, orders: 49 },
    { label: 'Sun 19', revenue: 68900, orders: 54 },
    { label: 'Mon 20', revenue: 41200, orders: 31 },
    { label: 'Tue 21', revenue: 49800, orders: 38 },
    { label: 'Today', revenue: Math.round(revenueTotal) || 52400, orders: bookingsCount }
  ];

  const data30d = [
    { label: 'W1', revenue: 210000, orders: 180 },
    { label: 'W2', revenue: 245000, orders: 210 },
    { label: 'W3', revenue: 289000, orders: 254 },
    { label: 'W4', revenue: 312000, orders: 290 }
  ];

  const data90d = [
    { label: 'Aug', revenue: 980000, orders: 840 },
    { label: 'Sep', revenue: 1140000, orders: 990 },
    { label: 'Oct', revenue: 1320000, orders: 1180 }
  ];

  // Category counts
  const categoryCounts = store.categories.map(cat => {
    const count = cityFilteredBookings.filter(b => b.categoryName === cat.name).length || Math.floor(Math.random() * 15 + 5);
    return { name: cat.name, count };
  });

  // Critical Alerts
  const pendingKycPros = store.professionals.filter(p => p.kycStatus === 'Pending KYC');
  const lowRatedReviews = store.reviews.filter(r => r.rating <= 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Date & Filter Strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
            Operations Pulse
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
            Real-time telemetry for {store.activeCity}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', background: 'var(--surface-2)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
            {['Today', 'This Week', 'This Month'].map(d => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                style={{
                  background: dateRange === d ? 'var(--surface)' : 'transparent',
                  color: dateRange === d ? 'var(--primary)' : 'var(--ink-2)',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: dateRange === d ? 'var(--shadow-e1)' : 'none'
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('live-operations')}
            className="btn btn-secondary btn-sm"
          >
            <span>Live Dispatch Map</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Row 1: KPI Strip (6 Cards) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16
        }}
      >
        <KPICard
          title="Bookings Today"
          value={bookingsCount}
          delta={{ value: '+14.2%', isPositive: true }}
          icon={Calendar}
          clayVariant="violet"
          onClick={() => onNavigate('bookings')}
        />

        <KPICard
          title="Revenue Today"
          value={`₹${Math.round(revenueTotal).toLocaleString('en-IN')}`}
          delta={{ value: '+18.5%', isPositive: true }}
          icon={IndianRupee}
          clayVariant="mint"
          onClick={() => onNavigate('payments-payouts')}
        />

        <KPICard
          title="Active Professionals"
          value={activePros}
          delta={{ value: '+4 online', isPositive: true }}
          icon={Users}
          clayVariant="violet"
          onClick={() => onNavigate('professionals')}
        />

        <KPICard
          title="Average Rating"
          value={`★ ${avgRating}`}
          delta={{ value: '+0.04', isPositive: true }}
          icon={Star}
          clayVariant="amber"
          onClick={() => onNavigate('reviews-quality')}
        />

        <KPICard
          title="Cancellation Rate"
          value={`${cancelRate}%`}
          delta={{ value: '-0.8%', isPositive: true, period: 'vs last week' }}
          icon={XCircle}
          clayVariant="amber"
          onClick={() => onNavigate('bookings')}
        />

        <KPICard
          title="Pending Assignments"
          value={pendingAssignments.length}
          subtext={pendingAssignments.length > 0 ? 'Requires dispatcher attention' : 'All matched'}
          icon={Clock}
          clayVariant={pendingAssignments.length > 0 ? 'amber' : 'mint'}
          onClick={() => onNavigate('bookings')}
        />
      </div>

      {/* Row 2: Charts (Revenue Line + Category Donut) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1.1fr',
          gap: 20
        }}
      >
        <RevenueLineChart data7d={data7d} data30d={data30d} data90d={data90d} />
        <CategoryDonutChart data={categoryCounts} />
      </div>

      {/* Row 3: Live Bookings Table + Alerts Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.7fr 1fr',
          gap: 20
        }}
      >
        {/* Latest Bookings Table */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                Live Bookings
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
                Latest 8 customer orders across {store.activeCity}
              </p>
            </div>
            <button
              onClick={() => onNavigate('bookings')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              <span>View All Bookings</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Status</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Professional</th>
                  <th>Amount</th>
                  <th>Slot</th>
                </tr>
              </thead>
              <tbody>
                {cityFilteredBookings.slice(0, 8).map(booking => (
                  <tr key={booking.id} onClick={() => onNavigate('bookings', booking.id)}>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                      {booking.id}
                    </td>
                    <td>
                      <StatusChip status={booking.status} size="sm" />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{booking.serviceName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{booking.categoryName}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{booking.customerName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{booking.city}</div>
                    </td>
                    <td>
                      {booking.professionalName ? (
                        <span style={{ color: 'var(--ink)' }}>{booking.professionalName}</span>
                      ) : (
                        <span style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '12px' }}>
                          ⚡ Unassigned
                        </span>
                      )}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--ink)' }} className="tabular">
                      ₹{Math.round(booking.total).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                      {booking.slotTime.split(' - ')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Alerts Panel */}
        <div className="card" style={{ padding: '22px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="clay-badge clay-amber" style={{ width: 28, height: 28, borderRadius: 8 }}>
                <AlertTriangle size={15} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                Action Items & Alerts
              </h3>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 10,
                background: 'var(--warning-soft)',
                color: '#B45309'
              }}
            >
              {pendingAssignments.length + pendingKycPros.length + lowRatedReviews.length} Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {/* Unassigned Bookings Alert */}
            {pendingAssignments.map(b => (
              <div
                key={b.id}
                onClick={() => onNavigate('bookings', b.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'var(--warning-soft)',
                  border: '1px solid rgba(245, 159, 0, 0.25)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#B45309' }}>
                    UNASSIGNED BOOKING
                  </span>
                  <span style={{ fontSize: '11px', color: '#B45309', fontWeight: 600 }}>10m ago</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginTop: 4 }}>
                  {b.id} • {b.serviceName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: 2 }}>
                  {b.customerName} waiting for assignment in {b.city}
                </div>
              </div>
            ))}

            {/* Pending KYC Alert */}
            {pendingKycPros.map(p => (
              <div
                key={p.id}
                onClick={() => onNavigate('professionals', p.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'var(--primary-soft)',
                  border: '1px solid rgba(108, 77, 255, 0.2)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                    PENDING KYC APPROVAL
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Review Docs</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginTop: 4 }}>
                  {p.name} ({p.skills[0]})
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: 2 }}>
                  Documents uploaded, awaiting identity verification
                </div>
              </div>
            ))}

            {/* Flagged Review Alert */}
            {lowRatedReviews.map(r => (
              <div
                key={r.id}
                onClick={() => onNavigate('reviews-quality')}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'var(--danger-soft)',
                  border: '1px solid rgba(240, 82, 79, 0.2)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--danger)' }}>
                    POOR RATING (★ {r.rating})
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--danger)' }}>Dispute</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginTop: 4 }}>
                  {r.professionalName} • {r.serviceName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: 2 }}>
                  "{r.comment.slice(0, 60)}..."
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Top Professionals Leaderboard & Top Services */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20
        }}
      >
        {/* Top Professionals */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                Top Professionals Leaderboard
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
                Highest customer satisfaction & job completion rates
              </p>
            </div>
            <button
              onClick={() => onNavigate('professionals')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--primary)' }}
            >
              View Directory →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {store.professionals
              .filter(p => p.stage === 'Approved')
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 4)
              .map((pro, index) => (
                <div
                  key={pro.id}
                  onClick={() => onNavigate('professionals', pro.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'var(--surface-2)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '14px',
                        color: index === 0 ? 'var(--accent)' : 'var(--ink-3)',
                        width: 18
                      }}
                    >
                      #{index + 1}
                    </span>
                    <img
                      src={pro.avatar}
                      alt={pro.name}
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--ink)' }}>
                        {pro.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                        {pro.skills[0]} • {pro.city}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '13px' }}>
                      ★ {pro.rating}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>
                      {pro.jobsCompleted} jobs completed
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Services Ranking */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
                Top Services & Packages
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
                Most ordered offerings across all categories
              </p>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--primary)' }}
            >
              Manage Catalog →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {store.services.slice(0, 4).map((srv, idx) => (
              <div
                key={srv.id}
                onClick={() => onNavigate('catalog', srv.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'var(--surface-2)',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={srv.imageUrl}
                    alt={srv.name}
                    style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--ink)' }}>
                      {srv.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                      {srv.duration} mins • ★ {srv.rating} ({srv.reviewCount} reviews)
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '14px' }}>
                    ₹{srv.basePrice}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                    Plus: ₹{srv.memberPrice}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
