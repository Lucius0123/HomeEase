import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Wallet,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Unlock,
  Plus,
  CreditCard,
  ChevronRight,
  X
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Customer } from '../types';
import { Modal } from '../components/common/Modal';

export const CustomersView: React.FC<{ initialCustId?: string }> = ({ initialCustId }) => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  // Add Wallet Credit Modal
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState(500);
  const [walletNote, setWalletNote] = useState('Diwali promotional courtesy credit');

  useEffect(() => {
    return mockStore.subscribe(() => {
      const state = mockStore.getState();
      setStoreState(state);
      if (selectedCust) {
        const refreshed = state.customers.find(c => c.id === selectedCust.id);
        if (refreshed) setSelectedCust(refreshed);
      }
    });
  }, [selectedCust]);

  useEffect(() => {
    if (initialCustId) {
      const cust = storeState.customers.find(c => c.id === initialCustId);
      if (cust) setSelectedCust(cust);
    }
  }, [initialCustId, storeState.customers]);

  const filteredCustomers = storeState.customers.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchCity = c.city.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  const handleToggleBlock = () => {
    if (!selectedCust) return;
    mockStore.toggleBlockCustomer(selectedCust.id);
    addToast(
      selectedCust.isBlocked ? 'success' : 'warning',
      selectedCust.isBlocked ? 'Customer Unblocked' : 'Customer Blocked',
      `${selectedCust.name} account status updated.`
    );
  };

  const handleConfirmWalletCredit = () => {
    if (!selectedCust) return;
    mockStore.adjustCustomerWallet(selectedCust.id, walletAmount, walletNote);
    setShowWalletModal(false);
    addToast('success', 'Wallet Credited', `Added ₹${walletAmount} to ${selectedCust.name}'s wallet balance.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Search Bar */}
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
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--ink-3)'
            }}
          />
          <input
            type="text"
            placeholder="Search customer by name, phone, city..."
            className="form-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 36, height: 38 }}
          />
        </div>

        <div style={{ fontSize: '13px', color: 'var(--ink-2)', fontWeight: 600 }}>
          Showing {filteredCustomers.length} registered customers
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>Total Bookings</th>
              <th>Lifetime Value (LTV)</th>
              <th>Membership</th>
              <th>Wallet Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(cust => (
              <tr key={cust.id} onClick={() => setSelectedCust(cust)}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{cust.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{cust.email}</div>
                </td>
                <td style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
                  {cust.phone}
                </td>
                <td>
                  <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{cust.city}</span>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--ink)' }} className="tabular">
                  {cust.bookingsCount}
                </td>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }} className="tabular">
                  ₹{cust.lifetimeValue.toLocaleString('en-IN')}
                </td>
                <td>
                  {cust.membershipId ? (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'linear-gradient(135deg, #FFB547, #F59F00)',
                        color: '#FFFFFF'
                      }}
                    >
                      PLUS VIP
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Regular</span>
                  )}
                </td>
                <td style={{ fontWeight: 600, color: 'var(--ink)' }} className="tabular">
                  ₹{cust.walletBalance}
                </td>
                <td>
                  <span
                    className={`chip ${cust.isBlocked ? 'chip-red' : 'chip-green'}`}
                    style={{ fontSize: '11px' }}
                  >
                    <span className="chip-dot" />
                    {cust.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedCust(cust)}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: 4 }}
                  >
                    <ChevronRight size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Drawer (480px) */}
      {selectedCust && (
        <>
          <div className="drawer-backdrop" onClick={() => setSelectedCust(null)} />
          <div className="drawer">
            <div className="drawer-header glass">
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)' }}>
                  {selectedCust.name}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                  Member since {selectedCust.joinedDate}
                </div>
              </div>
              <button onClick={() => setSelectedCust(null)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="card" style={{ padding: 14 }}>
                    <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Total Bookings</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', marginTop: 4 }}>
                      {selectedCust.bookingsCount}
                    </div>
                  </div>
                  <div className="card" style={{ padding: 14 }}>
                    <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Lifetime Value</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>
                      ₹{selectedCust.lifetimeValue.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Wallet Balance Card with Add Credit */}
                <div className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
                        Customer Wallet
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', marginTop: 4 }}>
                        ₹{selectedCust.walletBalance}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowWalletModal(true)}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={14} />
                      <span>Add Credit</span>
                    </button>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div className="card" style={{ padding: 16 }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 12 }}>
                    Saved Delivery Addresses
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {selectedCust.addresses.map((addr, i) => (
                      <div
                        key={i}
                        style={{
                          padding: 10,
                          borderRadius: 8,
                          background: 'var(--surface-2)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10
                        }}
                      >
                        <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--ink)' }}>
                            {addr.tag}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                            {addr.line}, {addr.city}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="card" style={{ padding: 16 }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                    Customer Notes & Preferences
                  </h4>
                  {selectedCust.notes.length === 0 ? (
                    <p style={{ fontSize: '12px', color: 'var(--ink-3)' }}>No special instructions on file.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {selectedCust.notes.map((n, i) => (
                        <div key={i} style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--surface-2)', fontSize: '12px', color: 'var(--ink)' }}>
                          • {n}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="drawer-footer">
              <button
                onClick={handleToggleBlock}
                className="btn btn-outline btn-sm"
                style={{
                  color: selectedCust.isBlocked ? 'var(--success)' : 'var(--danger)',
                  borderColor: selectedCust.isBlocked ? 'rgba(18, 184, 134, 0.4)' : 'rgba(240, 82, 79, 0.4)'
                }}
              >
                {selectedCust.isBlocked ? (
                  <>
                    <Unlock size={14} />
                    <span>Unblock Customer</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Block Customer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add Wallet Credit Modal */}
      <Modal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="Add Customer Wallet Credit"
        subtitle={`Crediting wallet balance for ${selectedCust?.name}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowWalletModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirmWalletCredit}>
              Confirm Credit (₹{walletAmount})
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Credit Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              value={walletAmount}
              onChange={e => setWalletAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="form-label">Reason / Courtesy Note</label>
            <input
              type="text"
              className="form-input"
              value={walletNote}
              onChange={e => setWalletNote(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
