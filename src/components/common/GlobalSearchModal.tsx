import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, User, Wrench, Package, ArrowRight, X } from 'lucide-react';
import { mockStore } from '../../services/mockStore';
import { StatusChip } from './StatusChip';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, detailId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [storeState, setStoreState] = useState(mockStore.getState());

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Handled by parent toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        bookings: storeState.bookings.slice(0, 3),
        professionals: storeState.professionals.slice(0, 3),
        customers: storeState.customers.slice(0, 3),
        services: storeState.services.slice(0, 3)
      };
    }

    return {
      bookings: storeState.bookings.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        (b.professionalName && b.professionalName.toLowerCase().includes(q))
      ).slice(0, 4),
      professionals: storeState.professionals.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.skills.some(s => s.toLowerCase().includes(q))
      ).slice(0, 4),
      customers: storeState.customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      ).slice(0, 4),
      services: storeState.services.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      ).slice(0, 4)
    };
  }, [query, storeState]);

  if (!isOpen) return null;

  const totalResults =
    searchResults.bookings.length +
    searchResults.professionals.length +
    searchResults.customers.length +
    searchResults.services.length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass"
        style={{
          maxWidth: '680px',
          background: 'var(--surface)',
          padding: 0,
          border: '1px solid var(--border)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            gap: 12
          }}
        >
          <Search size={20} style={{ color: 'var(--primary)' }} />
          <input
            autoFocus
            type="text"
            placeholder="Search bookings, pros, customers, services... (Esc to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '16px',
              fontFamily: 'var(--font-heading)',
              color: 'var(--ink)',
              outline: 'none'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px 8px' }}
            >
              <X size={16} />
            </button>
          )}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: 6,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--ink-2)'
            }}
          >
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px 20px' }}>
          {totalResults === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-2)' }}>
              <p style={{ fontSize: '15px', fontWeight: 600 }}>No results found for "{query}"</p>
              <p style={{ fontSize: '13px', marginTop: 4 }}>Try searching for a booking ID (e.g. BK-9801), partner name or service.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Bookings */}
              {searchResults.bookings.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 8 }}>
                    <Calendar size={14} />
                    <span>Bookings</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {searchResults.bookings.map(b => (
                      <div
                        key={b.id}
                        onClick={() => {
                          onNavigate('bookings', b.id);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: 'var(--surface-2)',
                          cursor: 'pointer',
                          transition: 'background 0.12s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{b.id}</span>
                            <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{b.serviceName}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: 2 }}>
                            {b.customerName} • {b.slotDate} ({b.city})
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <StatusChip status={b.status} size="sm" />
                          <ArrowRight size={14} style={{ color: 'var(--ink-3)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Professionals */}
              {searchResults.professionals.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 8 }}>
                    <Wrench size={14} />
                    <span>Professionals</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {searchResults.professionals.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigate('professionals', p.id);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: 'var(--surface-2)',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={p.avatar}
                            alt={p.name}
                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>{p.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                              ★ {p.rating} • {p.city} • {p.skills.join(', ')}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: '12px', color: p.online ? 'var(--success)' : 'var(--ink-3)', fontWeight: 600 }}>
                          {p.online ? '● Online' : '○ Offline'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {searchResults.customers.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 8 }}>
                    <User size={14} />
                    <span>Customers</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {searchResults.customers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onNavigate('customers', c.id);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: 'var(--surface-2)',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>{c.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>{c.phone} • {c.city}</div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>
                          {c.bookingsCount} bookings (₹{c.lifetimeValue.toLocaleString('en-IN')})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {searchResults.services.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 8 }}>
                    <Package size={14} />
                    <span>Services</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {searchResults.services.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onNavigate('catalog', s.id);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: 'var(--surface-2)',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-2)'}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>{s.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>{s.duration} mins • ★ {s.rating}</div>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--ink)' }}>₹{s.basePrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
