import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  Star,
  Award,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  UserX,
  Percent,
  MessageSquare,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Professional } from '../types';
import { StatusChip } from '../components/common/StatusChip';
import { Modal } from '../components/common/Modal';

export const ProfessionalsView: React.FC<{ initialProId?: string }> = ({ initialProId }) => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selected Pro Detail Drawer
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'documents' | 'skills' | 'earnings'>('overview');

  // Modals
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('Customer complaints regarding punctuality');
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionPct, setCommissionPct] = useState(20);

  useEffect(() => {
    return mockStore.subscribe(() => {
      const state = mockStore.getState();
      setStoreState(state);
      if (selectedPro) {
        const refreshed = state.professionals.find(p => p.id === selectedPro.id);
        if (refreshed) setSelectedPro(refreshed);
      }
    });
  }, [selectedPro]);

  useEffect(() => {
    if (initialProId) {
      const pro = storeState.professionals.find(p => p.id === initialProId);
      if (pro) setSelectedPro(pro);
    }
  }, [initialProId, storeState.professionals]);

  const filteredPros = storeState.professionals.filter(p => {
    if (statusFilter !== 'All' && p.kycStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = p.name.toLowerCase().includes(q);
      const matchesSkill = p.skills.some(s => s.toLowerCase().includes(q));
      const matchesCity = p.city.toLowerCase().includes(q);
      if (!matchesName && !matchesSkill && !matchesCity) return false;
    }
    return true;
  });

  const KANBAN_STAGES: Professional['stage'][] = [
    'Applied',
    'Documents submitted',
    'Verification',
    'Training',
    'Approved'
  ];

  const handleMoveStage = (proId: string, newStage: Professional['stage']) => {
    mockStore.updateProStage(proId, newStage);
    addToast('success', 'Onboarding Updated', `Moved partner to stage: ${newStage}`);
  };

  const handleVerifyDocument = (docType: string, status: 'Approved' | 'Rejected', notes?: string) => {
    if (!selectedPro) return;
    mockStore.verifyDocument(selectedPro.id, docType, status, notes);
    addToast(
      status === 'Approved' ? 'success' : 'warning',
      `Document ${status}`,
      `${docType} marked as ${status} for ${selectedPro.name}.`
    );
  };

  const handleConfirmSuspend = () => {
    if (!selectedPro) return;
    mockStore.updateProStatus(selectedPro.id, 'Suspended', suspendReason);
    setShowSuspendModal(false);
    addToast('warning', 'Partner Suspended', `${selectedPro.name} has been suspended.`);
  };

  const handleConfirmCommission = () => {
    if (!selectedPro) return;
    mockStore.updateProCommission(selectedPro.id, commissionPct);
    setShowCommissionModal(false);
    addToast('success', 'Commission Override Saved', `Partner commission set to ${commissionPct}%.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Controls Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
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
              placeholder="Search partner by name, skill, zone..."
              className="form-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36, height: 38 }}
            />
          </div>

          <select
            className="form-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ width: 160, height: 38, fontSize: '13px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending KYC">Pending KYC</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* View Mode Toggle: List vs Onboarding Kanban */}
        <div style={{ display: 'flex', background: 'var(--surface-2)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              background: viewMode === 'list' ? 'var(--surface)' : 'transparent',
              color: viewMode === 'list' ? 'var(--primary)' : 'var(--ink-2)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: viewMode === 'list' ? 'var(--shadow-e1)' : 'none'
            }}
          >
            Directory List ({filteredPros.length})
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              background: viewMode === 'kanban' ? 'var(--surface)' : 'transparent',
              color: viewMode === 'kanban' ? 'var(--primary)' : 'var(--ink-2)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: viewMode === 'kanban' ? 'var(--shadow-e1)' : 'none'
            }}
          >
            Onboarding Board (Kanban)
          </button>
        </div>
      </div>

      {/* View 1: Professionals Table List */}
      {viewMode === 'list' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Professional</th>
                <th>Skills & Category</th>
                <th>City & Zone</th>
                <th>Rating</th>
                <th>Jobs Done</th>
                <th>Acceptance</th>
                <th>Commission</th>
                <th>KYC Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPros.map(pro => (
                <tr key={pro.id} onClick={() => setSelectedPro(pro)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ position: 'relative' }}>
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: pro.online ? 'var(--success)' : 'var(--ink-3)',
                            border: '2px solid var(--surface)'
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{pro.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>{pro.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 220 }}>
                      {pro.skills.map((s, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '11px',
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: 'var(--surface-2)',
                            color: 'var(--ink-2)',
                            border: '1px solid var(--border)'
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>{pro.city}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{pro.zone}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '13.5px' }}>
                      ★ {pro.rating}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--ink)' }} className="tabular">
                    {pro.jobsCompleted}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: pro.acceptanceRate >= 90 ? 'var(--success)' : 'var(--warning)' }}>
                      {pro.acceptanceRate}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                      {pro.commissionPct}%
                    </span>
                  </td>
                  <td>
                    <StatusChip status={pro.kycStatus} size="sm" />
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedPro(pro)}
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
      )}

      {/* View 2: Onboarding Kanban Board */}
      {viewMode === 'kanban' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
            overflowX: 'auto',
            alignItems: 'start'
          }}
        >
          {KANBAN_STAGES.map((stage, sIdx) => {
            const stagePros = storeState.professionals.filter(p => p.stage === stage);
            return (
              <div
                key={stage}
                style={{
                  background: 'var(--surface-2)',
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  minHeight: 480
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: '#FFF',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}
                    >
                      {sIdx + 1}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                      {stage}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 10,
                      background: 'var(--surface)',
                      color: 'var(--ink-2)'
                    }}
                  >
                    {stagePros.length}
                  </span>
                </div>

                {/* Cards in column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {stagePros.map(pro => (
                    <div
                      key={pro.id}
                      onClick={() => setSelectedPro(pro)}
                      className="card"
                      style={{
                        padding: '14px',
                        cursor: 'pointer',
                        background: 'var(--surface)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>
                            {pro.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--ink-2)' }}>
                            {pro.city} • {pro.skills[0]}
                          </div>
                        </div>
                      </div>

                      {/* Progress ring or status badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <StatusChip status={pro.kycStatus} size="sm" />
                        {sIdx < KANBAN_STAGES.length - 1 && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleMoveStage(pro.id, KANBAN_STAGES[sIdx + 1]);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ height: 24, fontSize: '11px', padding: '0 6px' }}
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Professional Profile Drawer (480px) */}
      {selectedPro && (
        <>
          <div className="drawer-backdrop" onClick={() => setSelectedPro(null)} />
          <div className="drawer">
            {/* Header */}
            <div className="drawer-header glass">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={selectedPro.avatar}
                  alt={selectedPro.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>
                    {selectedPro.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                    {selectedPro.phone} • {selectedPro.city}
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedPro(null)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              {(['overview', 'documents', 'skills', 'earnings'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  style={{
                    padding: '12px 14px',
                    fontSize: '12.5px',
                    fontWeight: drawerTab === tab ? 700 : 500,
                    color: drawerTab === tab ? 'var(--primary)' : 'var(--ink-2)',
                    border: 'none',
                    borderBottom: drawerTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                    background: 'transparent',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Drawer Body Content */}
            <div className="drawer-body">
              {drawerTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 12
                    }}
                  >
                    <div className="card" style={{ padding: 14 }}>
                      <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Customer Rating</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent)', marginTop: 4 }}>
                        ★ {selectedPro.rating}
                      </div>
                    </div>
                    <div className="card" style={{ padding: 14 }}>
                      <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Jobs Completed</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginTop: 4 }}>
                        {selectedPro.jobsCompleted}
                      </div>
                    </div>
                    <div className="card" style={{ padding: 14 }}>
                      <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Acceptance Rate</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)', marginTop: 4 }}>
                        {selectedPro.acceptanceRate}%
                      </div>
                    </div>
                    <div className="card" style={{ padding: 14 }}>
                      <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Commission Rate</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>
                        {selectedPro.commissionPct}%
                      </div>
                    </div>
                  </div>

                  <div className="card" style={{ padding: 16 }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 8 }}>
                      Operating Zone & Coordinates
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--ink)' }}>{selectedPro.zone}</p>
                    <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: 4 }}>
                      GPS: {selectedPro.lat.toFixed(4)}, {selectedPro.lng.toFixed(4)}
                    </div>
                  </div>

                  {selectedPro.suspendReason && (
                    <div style={{ padding: 14, borderRadius: 12, background: 'var(--danger-soft)', border: '1px solid rgba(240, 82, 79, 0.3)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--danger)' }}>
                        SUSPENSION REASON
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--ink)', marginTop: 4 }}>
                        {selectedPro.suspendReason}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'documents' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                    KYC & Compliance Verification
                  </h4>
                  {selectedPro.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="card"
                      style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                          {doc.type}
                        </span>
                        <StatusChip status={doc.status} size="sm" />
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                        Document No: <code>{doc.docNumber}</code>
                      </div>
                      {doc.notes && (
                        <div style={{ fontSize: '12px', color: 'var(--warning)', background: 'var(--warning-soft)', padding: 6, borderRadius: 6 }}>
                          Note: {doc.notes}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button
                          onClick={() => handleVerifyDocument(doc.type, 'Approved')}
                          className="btn btn-sm btn-primary"
                          style={{ flex: 1, height: 28, fontSize: '11.5px' }}
                        >
                          <CheckCircle size={13} />
                          <span>Approve Document</span>
                        </button>
                        <button
                          onClick={() => handleVerifyDocument(doc.type, 'Rejected', 'Document unreadable, please re-upload')}
                          className="btn btn-sm btn-outline"
                          style={{ flex: 1, height: 28, fontSize: '11.5px', color: 'var(--danger)' }}
                        >
                          <XCircle size={13} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === 'skills' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                    Accredited Skill Certifications
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedPro.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="chip chip-violet"
                        style={{ fontSize: '13px', padding: '6px 12px' }}
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {drawerTab === 'earnings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="card" style={{ padding: 16 }}>
                    <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Current Commission Rate</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>
                      {selectedPro.commissionPct}%
                    </div>
                    <button
                      onClick={() => {
                        setCommissionPct(selectedPro.commissionPct);
                        setShowCommissionModal(true);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: 10 }}
                    >
                      <Percent size={13} />
                      <span>Edit Commission Override</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="drawer-footer">
              {selectedPro.kycStatus === 'Suspended' ? (
                <button
                  onClick={() => {
                    mockStore.updateProStatus(selectedPro.id, 'Active');
                    addToast('success', 'Partner Re-activated', `${selectedPro.name} is now active.`);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <UserCheck size={14} />
                  <span>Re-activate Account</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowSuspendModal(true)}
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--danger)', borderColor: 'rgba(240, 82, 79, 0.3)' }}
                >
                  <UserX size={14} />
                  <span>Suspend Partner</span>
                </button>
              )}

              <button
                onClick={() => addToast('info', 'Message Sent', `Sent push broadcast to ${selectedPro.name}.`)}
                className="btn btn-secondary btn-sm"
              >
                <MessageSquare size={14} />
                <span>Message</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Suspend Partner Modal */}
      <Modal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        title="Suspend Partner Account"
        subtitle={`Confirm suspension for ${selectedPro?.name}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowSuspendModal(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleConfirmSuspend}>
              Confirm Suspension
            </button>
          </>
        }
      >
        <div>
          <label className="form-label">Reason for Suspension (Logged in Audit)</label>
          <select
            className="form-select"
            value={suspendReason}
            onChange={e => setSuspendReason(e.target.value)}
          >
            <option value="Customer complaints regarding punctuality">Customer complaints regarding punctuality</option>
            <option value="Rating dropped below minimum threshold (< 4.2)">Rating dropped below threshold</option>
            <option value="Overcharging or off-platform direct billing">Off-platform billing attempt</option>
            <option value="Failed police verification audit">Failed compliance audit</option>
          </select>
        </div>
      </Modal>

      {/* Commission Override Modal */}
      <Modal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        title="Edit Partner Commission Override"
        subtitle={`Override platform standard commission for ${selectedPro?.name}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowCommissionModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirmCommission}>
              Save Commission Override
            </button>
          </>
        }
      >
        <div>
          <label className="form-label">Platform Take-rate Commission (%)</label>
          <input
            type="number"
            className="form-input"
            value={commissionPct}
            onChange={e => setCommissionPct(Number(e.target.value))}
            min={5}
            max={50}
          />
          <p style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: 6 }}>
            Standard platform rate is 20%. Star performers typically receive 16–18%.
          </p>
        </div>
      </Modal>
    </div>
  );
};
