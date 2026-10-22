import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Zap,
  Calendar,
  Layers,
  CheckCircle,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Zone, SlotCapacity } from '../types';

export const ZonesSlotsView: React.FC = () => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [selectedCity, setSelectedCity] = useState(
    storeState.activeCity === 'All Cities' ? 'Delhi NCR' : storeState.activeCity
  );

  const [surgeGlobal, setSurgeGlobal] = useState(false);

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  const cityZones = storeState.zones.filter(z => z.city === selectedCity);

  const handleToggleSurge = (zoneId: string) => {
    mockStore.toggleSurge(zoneId);
    addToast('info', 'Surge Pricing Updated', 'Toggled dynamic demand surge for selected sector.');
  };

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const HOURS = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header & City Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
            Zones & Slot Capacity Matrix
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
            Configure operational service boundaries, hourly slot limits & surge pricing
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['Delhi NCR', 'Bengaluru', 'Lucknow'].map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`btn btn-sm ${selectedCity === city ? 'btn-primary' : 'btn-outline'}`}
            >
              <MapPin size={13} />
              <span>{city}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Operating Zones & Surge Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16
        }}
      >
        {cityZones.map(zone => (
          <div
            key={zone.id}
            className="card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: zone.surgeActive ? '1.5px solid var(--accent)' : '1px solid var(--border)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
                  {zone.city} SECTOR
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: zone.surgeActive ? 'var(--warning-soft)' : 'var(--surface-2)',
                    color: zone.surgeActive ? '#B45309' : 'var(--ink-2)'
                  }}
                >
                  {zone.surgeActive ? '⚡ Surge +25% Active' : 'Normal Pricing'}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>
                {zone.name}
              </h3>

              <div style={{ fontSize: '13px', color: 'var(--ink-2)', marginTop: 6 }}>
                Active Field Partners: <strong>{zone.activePros} professionals</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Demand Multiplier</span>
              <button
                onClick={() => handleToggleSurge(zone.id)}
                className={`btn btn-sm ${zone.surgeActive ? 'btn-primary' : 'btn-outline'}`}
                style={{ height: 28, fontSize: '11.5px' }}
              >
                <Zap size={13} />
                <span>{zone.surgeActive ? 'Disable Surge' : 'Enable Surge (+25%)'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Slot Capacity Grid (Days x Hours Matrix) */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
              Weekly Slot Template Capacity Grid
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
              Click cells to adjust maximum concurrency capacity per time window
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => addToast('info', 'Blackout Window Added', 'Marked Diwali evening as blackout window.')}
              className="btn btn-outline btn-sm"
            >
              <Calendar size={14} />
              <span>Add Blackout Window</span>
            </button>
          </div>
        </div>

        {/* Capacity Matrix Grid */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ padding: 12, textAlign: 'left', fontSize: '12px', color: 'var(--ink-3)', fontWeight: 700 }}>
                  TIME WINDOW
                </th>
                {DAYS.map(day => (
                  <th key={day} style={{ padding: 12, fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hr, hrIdx) => (
                <tr key={hr} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '12.5px', color: 'var(--ink)' }}>
                    {hr}
                  </td>
                  {DAYS.map((day, dIdx) => {
                    const booked = (hrIdx * 3 + dIdx * 2 + 3) % 12;
                    const maxCap = 12;
                    const isFull = booked >= 10;
                    return (
                      <td key={day} style={{ padding: '8px' }}>
                        <div
                          style={{
                            padding: '8px 10px',
                            borderRadius: 10,
                            background: isFull ? 'var(--warning-soft)' : 'var(--surface-2)',
                            border: `1px solid ${isFull ? 'rgba(245, 159, 0, 0.4)' : 'var(--border)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onClick={() => addToast('info', 'Slot Capacity Updated', `Shifted capacity for ${day} ${hr}`)}
                        >
                          <div style={{ fontSize: '13px', fontWeight: 800, color: isFull ? '#B45309' : 'var(--ink)' }}>
                            {booked} / {maxCap}
                          </div>
                          <div style={{ fontSize: '10px', color: isFull ? '#B45309' : 'var(--ink-3)', marginTop: 2 }}>
                            {isFull ? '⚡ Near Full' : 'Available'}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
