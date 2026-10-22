import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Radio,
  Filter,
  Navigation,
  Phone,
  UserCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Professional, Booking } from '../types';
import { StatusChip } from '../components/common/StatusChip';

interface LiveOperationsViewProps {
  onNavigate: (view: string, detailId?: string) => void;
}

export const LiveOperationsView: React.FC<LiveOperationsViewProps> = ({ onNavigate }) => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'on-job' | 'unassigned'>('all');
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [selectedUnassignedBooking, setSelectedUnassignedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  const activeCity = storeState.activeCity === 'All Cities' ? 'Delhi NCR' : storeState.activeCity;

  // City map bounding boxes for SVG rendering
  const cityBounds: Record<string, { minLat: number; maxLat: number; minLng: number; maxLng: number }> = {
    'Delhi NCR': { minLat: 28.40, maxLat: 28.75, minLng: 77.00, maxLng: 77.38 },
    'Bengaluru': { minLat: 12.85, maxLat: 13.05, minLng: 77.50, maxLng: 77.80 },
    'Lucknow': { minLat: 26.78, maxLat: 26.95, minLng: 80.85, maxLng: 81.08 }
  };

  const bounds = cityBounds[activeCity] || cityBounds['Delhi NCR'];

  // Project lat/lng to SVG 800x500 coordinates
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 740 + 30;
    const y = 470 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 440;
    return {
      x: Math.max(40, Math.min(760, x)),
      y: Math.max(30, Math.min(460, y))
    };
  };

  const prosInCity = storeState.professionals.filter(p =>
    storeState.activeCity === 'All Cities' || p.city === storeState.activeCity
  );

  const bookingsInCity = storeState.bookings.filter(b =>
    (storeState.activeCity === 'All Cities' || b.city === storeState.activeCity) &&
    b.status === 'Requested'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Map Control Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="clay-badge" style={{ width: 36, height: 36, borderRadius: 10 }}>
            <Radio size={18} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)' }}>
              Live Telemetry & Field Operations ({activeCity})
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
              Showing {prosInCity.filter(p => p.online).length} online partners • {bookingsInCity.length} pending dispatch
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', background: 'var(--surface-2)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
            {(['all', 'available', 'on-job', 'unassigned'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  background: statusFilter === tab ? 'var(--surface)' : 'transparent',
                  color: statusFilter === tab ? 'var(--primary)' : 'var(--ink-2)',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Toggle Simulator */}
          <button
            onClick={() => mockStore.toggleSimulation()}
            className="btn btn-sm"
            style={{
              background: storeState.isSimulating ? 'rgba(18, 184, 134, 0.18)' : 'var(--surface)',
              border: `1px solid ${storeState.isSimulating ? 'var(--success)' : 'var(--border)'}`,
              color: storeState.isSimulating ? 'var(--success)' : 'var(--ink-2)'
            }}
          >
            <Activity size={14} />
            <span>{storeState.isSimulating ? 'Simulating GPS Motion' : 'Start Motion'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Vector Map Canvas */}
      <div
        className="card"
        style={{
          position: 'relative',
          padding: 0,
          overflow: 'hidden',
          height: '560px',
          background: 'var(--surface-2)'
        }}
      >
        <svg
          viewBox="0 0 800 500"
          style={{
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 50%, var(--surface) 0%, var(--surface-2) 100%)'
          }}
        >
          {/* Stylized City Grid / Roads */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-subtle)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="800" height="500" fill="url(#grid)" />

          {/* Main Arterial Expressways (Decorative Vector Network) */}
          <path
            d="M 60 120 Q 240 180 400 240 T 740 380"
            fill="none"
            stroke="var(--border)"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
          <path
            d="M 120 440 Q 320 300 480 200 T 720 80"
            fill="none"
            stroke="var(--border)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <circle cx="400" cy="240" r="140" fill="rgba(108, 77, 255, 0.04)" stroke="rgba(108, 77, 255, 0.15)" strokeWidth="1.5" />
          <circle cx="400" cy="240" r="260" fill="none" stroke="rgba(108, 77, 255, 0.08)" strokeDasharray="8 6" strokeWidth="1" />

          {/* Zone Labels */}
          <text x="400" y="245" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ink-3)" letterSpacing="0.08em">
            {activeCity.toUpperCase()} DISPATCH SECTOR
          </text>

          {/* Unassigned Bookings Pins (Amber Pulse) */}
          {statusFilter !== 'available' && statusFilter !== 'on-job' &&
            bookingsInCity.map(b => {
              const coords = projectCoords(b.lat, b.lng);
              return (
                <g
                  key={b.id}
                  onClick={() => {
                    setSelectedUnassignedBooking(b);
                    setSelectedPro(null);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <circle cx={coords.x} cy={coords.y} r="18" fill="rgba(245, 159, 0, 0.2)" />
                  <circle cx={coords.x} cy={coords.y} r="10" fill="#F59F00" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={coords.x} y={coords.y + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#FFFFFF">
                    !
                  </text>
                  <text x={coords.x} y={coords.y - 14} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--warning)">
                    {b.id}
                  </text>
                </g>
              );
            })
          }

          {/* Professional Markers */}
          {prosInCity.map(p => {
            const hasJob = storeState.bookings.some(
              b => b.professionalId === p.id && !['Completed', 'Cancelled', 'Refunded'].includes(b.status)
            );

            if (statusFilter === 'available' && (!p.online || hasJob)) return null;
            if (statusFilter === 'on-job' && !hasJob) return null;
            if (statusFilter === 'unassigned') return null;

            const coords = projectCoords(p.lat, p.lng);
            const pinColor = !p.online ? '#8E91B2' : hasJob ? '#3B82F6' : '#12B886';

            return (
              <g
                key={p.id}
                onClick={() => {
                  setSelectedPro(p);
                  setSelectedUnassignedBooking(null);
                }}
                style={{ cursor: 'pointer', transition: 'all 0.4s ease' }}
              >
                {p.online && (
                  <circle cx={coords.x} cy={coords.y} r="16" fill={pinColor} opacity="0.25">
                    <animate attributeName="r" values="10;22;10" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={coords.x} cy={coords.y} r="9" fill={pinColor} stroke="#FFFFFF" strokeWidth="2.5" />
                <text x={coords.x} y={coords.y + 22} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink)">
                  {p.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay in Bottom Left */}
        <div
          className="glass"
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            padding: '10px 14px',
            borderRadius: 12,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            gap: 16,
            fontSize: '11.5px',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#12B886' }} />
            <span>Available Partner</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} />
            <span>On Active Job</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59F00' }} />
            <span>Unassigned Booking</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8E91B2' }} />
            <span>Offline</span>
          </div>
        </div>

        {/* Floating Mini-Card for Selected Professional */}
        {selectedPro && (
          <div
            className="glass"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 310,
              borderRadius: 16,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-e3)',
              padding: 18,
              zIndex: 30
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={selectedPro.avatar}
                  alt={selectedPro.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
                    {selectedPro.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                    ★ {selectedPro.rating} • {selectedPro.zone}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPro(null)}
                className="btn btn-ghost btn-icon btn-sm"
                style={{ width: 28, height: 28 }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <StatusChip status={selectedPro.online ? 'Active' : 'Pending'} size="sm" />
              <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                {selectedPro.jobsCompleted} total completed
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <a
                href={`tel:${selectedPro.phone}`}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, height: 32 }}
              >
                <Phone size={13} />
                <span>Call</span>
              </a>
              <button
                onClick={() => onNavigate('professionals', selectedPro.id)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1.3, height: 32 }}
              >
                <span>View Full Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Mini-Card for Unassigned Booking */}
        {selectedUnassignedBooking && (
          <div
            className="glass"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 320,
              borderRadius: 16,
              background: 'var(--surface)',
              border: '1px solid var(--warning)',
              boxShadow: 'var(--shadow-e3)',
              padding: 18,
              zIndex: 30
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>
                  UNASSIGNED BOOKING
                </span>
                <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--ink)' }}>
                  {selectedUnassignedBooking.id}
                </div>
              </div>
              <button
                onClick={() => setSelectedUnassignedBooking(null)}
                className="btn btn-ghost btn-icon btn-sm"
                style={{ width: 28, height: 28 }}
              >
                <X size={15} />
              </button>
            </div>

            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
              {selectedUnassignedBooking.serviceName}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--ink-2)', marginBottom: 12 }}>
              Customer: {selectedUnassignedBooking.customerName} ({selectedUnassignedBooking.customerPhone})
            </p>

            <button
              onClick={() => onNavigate('bookings', selectedUnassignedBooking.id)}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', height: 34 }}
            >
              <span>Assign Professional Now →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
