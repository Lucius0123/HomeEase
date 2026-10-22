import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Navigation,
  MapPin,
  Play,
  Award,
  Zap,
  Phone,
  Radio,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Professional, Booking, BookingStatus } from '../types';
import { StatusChip } from '../components/common/StatusChip';

export const PartnerSimulatorView: React.FC = () => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  const handleToggleOnline = (proId: string) => {
    mockStore.toggleProOnline(proId);
  };

  const handleStepAction = (bookingId: string, nextStatus: BookingStatus, stepName: string) => {
    mockStore.updateBookingStatus(bookingId, nextStatus, `Partner Simulator: ${stepName}`);
    addToast('success', `Partner Action: ${stepName}`, `Booking ${bookingId} updated to '${nextStatus}'.`);
  };

  const filteredPros = storeState.professionals.filter(p => {
    if (p.stage !== 'Approved') return false;
    if (selectedCity !== 'All' && p.city !== selectedCity) return false;
    return true;
  });

  // Partner status step sequence definition
  const STEPS: { status: BookingStatus; label: string; icon: any }[] = [
    { status: 'Confirmed', label: 'Accept Job', icon: CheckCircle2 },
    { status: 'On the way', label: 'On The Way', icon: Navigation },
    { status: 'Arrived', label: 'Arrived at Gate', icon: MapPin },
    { status: 'In progress', label: 'Start Service', icon: Play },
    { status: 'Completed', label: 'Complete & Bill', icon: Award }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Banner Explaining Demo Impact */}
      <div
        className="card"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #1C1948, #0E0D24)',
          border: '1px solid rgba(139, 115, 255, 0.25)',
          color: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div
                className="clay-badge"
                style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8B73FF, #6C4DFF)' }}
              >
                <Smartphone size={20} color="#FFFFFF" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                Professional Partner Mobile Simulator
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: 'rgba(18, 184, 134, 0.25)',
                  color: '#34D3A1',
                  border: '1px solid rgba(52, 211, 161, 0.4)'
                }}
              >
                LIVE BIDIRECTIONAL SYNC
              </span>
            </div>

            <p style={{ fontSize: '13.5px', color: '#B5B8DA', lineHeight: 1.6, maxWidth: 760 }}>
              This panel simulates the partner's mobile device. Clicking step buttons updates the booking lifecycle
              in real-time: Overview counters tick, Bookings table rows change state, and Customer app tracking updates
              instantly.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <select
              className="form-select"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: 38,
                fontSize: '13px'
              }}
            >
              <option value="All" style={{ color: '#000' }}>All Cities</option>
              <option value="Delhi NCR" style={{ color: '#000' }}>Delhi NCR</option>
              <option value="Bengaluru" style={{ color: '#000' }}>Bengaluru</option>
              <option value="Lucknow" style={{ color: '#000' }}>Lucknow</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Professionals Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 20
        }}
      >
        {filteredPros.map(pro => {
          // Find any active booking assigned to this pro
          const activeBooking = storeState.bookings.find(
            b => b.professionalId === pro.id && !['Completed', 'Cancelled', 'Refunded', 'Reviewed'].includes(b.status)
          );

          // Find current step index
          let currentStepIdx = -1;
          if (activeBooking) {
            currentStepIdx = STEPS.findIndex(s => s.status === activeBooking.status);
          }

          return (
            <div
              key={pro.id}
              className="card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: pro.online ? '1px solid rgba(18, 184, 134, 0.35)' : '1px solid var(--border)'
              }}
            >
              <div>
                {/* Pro Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={pro.avatar}
                        alt={pro.name}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: pro.online ? 'var(--success)' : 'var(--ink-3)',
                          border: '2px solid var(--surface)'
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>
                        {pro.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                        ★ {pro.rating} • {pro.city} ({pro.zone})
                      </div>
                    </div>
                  </div>

                  {/* Online Toggle */}
                  <button
                    onClick={() => handleToggleOnline(pro.id)}
                    className="btn btn-sm"
                    style={{
                      height: 30,
                      fontSize: '12px',
                      background: pro.online ? 'var(--success-soft)' : 'var(--surface-2)',
                      color: pro.online ? 'var(--success)' : 'var(--ink-2)',
                      border: `1px solid ${pro.online ? 'rgba(18, 184, 134, 0.3)' : 'var(--border)'}`
                    }}
                  >
                    <Radio size={12} />
                    <span>{pro.online ? 'Online' : 'Offline'}</span>
                  </button>
                </div>

                {/* Skills tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {pro.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: 'var(--surface-2)',
                        color: 'var(--ink-2)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Active Job Section */}
                {activeBooking ? (
                  <div
                    style={{
                      padding: '14px',
                      borderRadius: 14,
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      marginBottom: 16
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        ACTIVE JOB DISPATCHED
                      </span>
                      <StatusChip status={activeBooking.status} size="sm" />
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                      {activeBooking.serviceName}
                    </div>

                    <div style={{ fontSize: '12.5px', color: 'var(--ink-2)', marginTop: 4 }}>
                      👤 {activeBooking.customerName} • 📍 {activeBooking.address.slice(0, 36)}...
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginTop: 2 }}>
                      Slot: {activeBooking.slotDate} ({activeBooking.slotTime}) • Total: ₹{Math.round(activeBooking.total)}
                    </div>

                    {/* Step Progress Bar */}
                    <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
                      {STEPS.map((step, sIdx) => {
                        const isDone = sIdx <= currentStepIdx;
                        return (
                          <div
                            key={step.status}
                            style={{
                              flex: 1,
                              height: 4,
                              borderRadius: 2,
                              background: isDone ? 'var(--primary)' : 'var(--border)'
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '20px',
                      borderRadius: 14,
                      background: 'var(--surface-2)',
                      border: '1px dashed var(--border)',
                      textAlign: 'center',
                      color: 'var(--ink-3)',
                      fontSize: '13px',
                      marginBottom: 16
                    }}
                  >
                    {pro.online
                      ? 'No job currently assigned. Available for dispatch.'
                      : 'Partner is currently offline.'}
                  </div>
                )}
              </div>

              {/* Action Big Step Buttons */}
              {activeBooking && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
                    Simulate Mobile Partner Actions:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 6 }}>
                    {STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isCurrent = activeBooking.status === step.status;
                      const isPast = idx < currentStepIdx;

                      return (
                        <button
                          key={step.status}
                          onClick={() => handleStepAction(activeBooking.id, step.status, step.label)}
                          className="btn btn-sm"
                          style={{
                            height: 34,
                            padding: '0 8px',
                            fontSize: '11.5px',
                            background: isCurrent
                              ? 'var(--primary)'
                              : isPast
                              ? 'var(--success-soft)'
                              : 'var(--surface)',
                            color: isCurrent
                              ? '#FFFFFF'
                              : isPast
                              ? 'var(--success)'
                              : 'var(--ink)',
                            border: isCurrent
                              ? '1px solid var(--primary)'
                              : isPast
                              ? '1px solid rgba(18, 184, 134, 0.3)'
                              : '1px solid var(--border)'
                          }}
                        >
                          <Icon size={13} />
                          <span>{step.label.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
