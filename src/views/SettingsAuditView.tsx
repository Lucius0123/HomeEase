import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  History,
  RotateCcw,
  Save,
  Users,
  Percent,
  IndianRupee,
  Lock,
  CheckCircle,
  FileText
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/common/Modal';

export const SettingsAuditView: React.FC = () => {
  const { addToast } = useToast();
  const { role } = useAuth();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [activeTab, setActiveTab] = useState<'general' | 'commission' | 'team' | 'audit'>('general');

  // General Settings State
  const [brandName, setBrandName] = useState('HomeEase');
  const [currencySymbol, setCurrencySymbol] = useState('₹ (INR)');
  const [gstRate, setGstRate] = useState(18);
  const [freeCancelHours, setFreeCancelHours] = useState(4);
  const [platformFee, setPlatformFee] = useState(49);

  // Commission State
  const [globalCommission, setGlobalCommission] = useState(20);

  // Reset Demo Modal
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.logAudit('Settings Updated', 'General Configuration', `GST: ${gstRate}%, Fee: ₹${platformFee}`);
    addToast('success', 'General Settings Saved', 'Platform fees, GST rates, and brand policies updated.');
  };

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.logAudit('Commission Updated', 'Platform Take-Rate', `Global rate set to ${globalCommission}%`);
    addToast('success', 'Commission Policies Updated', `Default platform take-rate set to ${globalCommission}%.`);
  };

  const handleConfirmReset = () => {
    mockStore.resetDemoData();
    setShowResetModal(false);
    addToast('success', 'Demo Data Reset', 'All bookings, partners, payments and catalog restored to original seed values.');
  };

  const TEAM_MEMBERS = [
    { name: 'Raj Chaurasiya', email: 'raj@homease.in', role: 'Super Admin', status: 'Active' },
    { name: 'Sarah Jenkins', email: 'sarah.j@homease.in', role: 'Operations Manager', status: 'Active' },
    { name: 'Aman Mathur', email: 'aman.m@homease.in', role: 'Finance', status: 'Active' },
    { name: 'Kavita Sen', email: 'kavita.s@homease.in', role: 'Support Agent', status: 'Active' },
    { name: 'Rohan Deshmukh', email: 'rohan.d@homease.in', role: 'Marketing', status: 'Active' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
            Settings & Operational Audit Log
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
            Global marketplace parameters, commission take-rates, and immutable compliance log
          </p>
        </div>

        <button
          onClick={() => setShowResetModal(true)}
          className="btn btn-outline btn-sm"
          style={{ color: 'var(--danger)', borderColor: 'rgba(240, 82, 79, 0.4)' }}
        >
          <RotateCcw size={14} />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
        <button
          onClick={() => setActiveTab('general')}
          className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: 10 }}
        >
          <Settings size={16} />
          <span>General Policies</span>
        </button>
        <button
          onClick={() => setActiveTab('commission')}
          className={`btn ${activeTab === 'commission' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: 10 }}
        >
          <Percent size={16} />
          <span>Commission Rules</span>
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`btn ${activeTab === 'team' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: 10 }}
        >
          <Users size={16} />
          <span>Team Members & Roles</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: 10 }}
        >
          <History size={16} />
          <span>Audit Log ({storeState.auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: General */}
      {activeTab === 'general' && (
        <div className="card" style={{ padding: '28px', maxWidth: '720px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', marginBottom: 20 }}>
            Marketplace Brand & Policy Configuration
          </h3>

          <form onSubmit={handleSaveGeneral} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="form-label">Working Brand Name</label>
              <input
                type="text"
                className="form-input"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">Currency Symbol</label>
                <input
                  type="text"
                  className="form-input"
                  value={currencySymbol}
                  disabled
                />
              </div>

              <div>
                <label className="form-label">GST Tax Rate (%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={gstRate}
                  onChange={e => setGstRate(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="form-label">Free Cancellation Window (Hours)</label>
                <input
                  type="number"
                  className="form-input"
                  value={freeCancelHours}
                  onChange={e => setFreeCancelHours(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="form-label">Platform Convenience Fee (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={platformFee}
                  onChange={e => setPlatformFee(Number(e.target.value))}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: 180, marginTop: 10 }}>
              <Save size={15} />
              <span>Save Configuration</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Commission Rules */}
      {activeTab === 'commission' && (
        <div className="card" style={{ padding: '28px', maxWidth: '720px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
            Commission Structure & Take-Rates
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-2)', marginBottom: 20 }}>
            Automated percentage deducted on weekly payouts before partner disbursement
          </p>

          <form onSubmit={handleSaveCommission} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="form-label">Global Default Take-Rate (%)</label>
              <input
                type="number"
                className="form-input"
                value={globalCommission}
                onChange={e => setGlobalCommission(Number(e.target.value))}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label className="form-label">Category-Specific Overrides</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderRadius: 8, background: 'var(--surface-2)', fontSize: '13px' }}>
                <span>Salon & Spa for Women</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>18% (High Volume Incentive)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderRadius: 8, background: 'var(--surface-2)', fontSize: '13px' }}>
                <span>Painting & Waterproofing</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>22% (High Ticket Size)</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: 180, marginTop: 10 }}>
              <Save size={15} />
              <span>Save Take-Rate</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Team Members & Roles */}
      {activeTab === 'team' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', marginBottom: 16 }}>
            Backoffice Operator Directory & RBAC Roles
          </h3>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Email</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {TEAM_MEMBERS.map(m => (
                  <tr key={m.email}>
                    <td style={{ fontWeight: 700, color: 'var(--ink)' }}>{m.name}</td>
                    <td style={{ fontSize: '13px', color: 'var(--ink-2)' }}>{m.email}</td>
                    <td>
                      <span className="chip chip-violet" style={{ fontSize: '11.5px' }}>
                        {m.role}
                      </span>
                    </td>
                    <td>
                      <span className="chip chip-green" style={{ fontSize: '11px' }}>
                        ● Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log Table */}
      {activeTab === 'audit' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', marginBottom: 16 }}>
            Immutable Operational Audit Trail
          </h3>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Administrator</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Target Entity</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {storeState.auditLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '12px', color: 'var(--ink-2)' }}>{log.timestamp}</td>
                    <td style={{ fontWeight: 700, color: 'var(--ink)' }}>{log.adminName}</td>
                    <td>
                      <span className="chip chip-slate" style={{ fontSize: '11px' }}>
                        {log.role}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '13px' }}>
                      {log.action}
                    </td>
                    <td>
                      <code>{log.target}</code>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--ink)' }}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reset Demo Data Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Demo Data"
        subtitle="Restore all collections to pristine initial state"
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
        <p style={{ fontSize: '13.5px', color: 'var(--ink-2)' }}>
          This will reset all bookings, mock transactions, and live simulator states back to factory seed settings.
        </p>
      </Modal>
    </div>
  );
};
