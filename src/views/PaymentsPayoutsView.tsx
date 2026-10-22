import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  IndianRupee,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  RotateCcw,
  Download,
  Search,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Payment, Payout } from '../types';
import { KPICard } from '../components/common/KPICard';
import { StatusChip } from '../components/common/StatusChip';
import { Modal } from '../components/common/Modal';

export const PaymentsPayoutsView: React.FC = () => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [activeTab, setActiveTab] = useState<'payments' | 'payouts'>('payments');
  const [searchQuery, setSearchQuery] = useState('');

  // Refund Modal State
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundReason, setRefundReason] = useState('Service dissatisfaction / customer complaint');

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  // Compute Financial KPIs
  const grossValue = storeState.payments
    .filter(p => p.status === 'Success')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunds = storeState.payments
    .filter(p => p.status === 'Refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  const platformRevenue = grossValue * 0.20; // 20% commission average

  const pendingPayoutsTotal = storeState.payouts
    .filter(po => po.status !== 'Paid')
    .reduce((sum, po) => sum + po.net, 0);

  const handleRefundClick = (p: Payment) => {
    setSelectedPayment(p);
    setShowRefundModal(true);
  };

  const handleConfirmRefund = () => {
    if (!selectedPayment) return;
    mockStore.refundPayment(selectedPayment.id, refundReason);
    setShowRefundModal(false);
    addToast('warning', 'Refund Processed', `Initiated refund of ₹${selectedPayment.amount} for ${selectedPayment.bookingId}`);
  };

  const handleApprovePayout = (poId: string) => {
    mockStore.approvePayout(poId);
    addToast('success', 'Payout Approved', `Weekly payout ${poId} approved for disbursement.`);
  };

  const handleMarkPaid = (poId: string) => {
    mockStore.markPayoutPaid(poId);
    addToast('success', 'Disbursement Settled', `Funds transferred via IMPS for ${poId}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Finance KPI Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16
        }}
      >
        <KPICard
          title="Gross Booking Value"
          value={`₹${Math.round(grossValue).toLocaleString('en-IN')}`}
          delta={{ value: '+14.6%', isPositive: true }}
          icon={IndianRupee}
          clayVariant="violet"
        />

        <KPICard
          title="Platform Commission"
          value={`₹${Math.round(platformRevenue).toLocaleString('en-IN')}`}
          delta={{ value: '+19.2%', isPositive: true }}
          icon={CreditCard}
          clayVariant="mint"
        />

        <KPICard
          title="Total Refunds Issued"
          value={`₹${Math.round(totalRefunds).toLocaleString('en-IN')}`}
          subtext="1.8% of gross GMV"
          icon={RotateCcw}
          clayVariant="amber"
        />

        <KPICard
          title="Pending Weekly Payouts"
          value={`₹${Math.round(pendingPayoutsTotal).toLocaleString('en-IN')}`}
          subtext="Disbursement due Thursday"
          icon={Clock}
          clayVariant="violet"
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('payments')}
            className={`btn ${activeTab === 'payments' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 10 }}
          >
            <CreditCard size={16} />
            <span>Customer Payments ({storeState.payments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`btn ${activeTab === 'payouts' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 10 }}
          >
            <ArrowUpRight size={16} />
            <span>Weekly Partner Payouts ({storeState.payouts.length})</span>
          </button>
        </div>

        <button
          onClick={() => addToast('info', 'Finance Report', 'Generated ledger reconciliation statement.')}
          className="btn btn-outline btn-sm"
        >
          <FileSpreadsheet size={14} />
          <span>Download Audit Ledger</span>
        </button>
      </div>

      {/* Tab 1: Customer Transactions Table */}
      {activeTab === 'payments' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {storeState.payments.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {p.id}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.bookingId}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{p.customerName}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '12px',
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        fontWeight: 600
                      }}
                    >
                      {p.method}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--ink)' }} className="tabular">
                    ₹{p.amount.toFixed(2)}
                  </td>
                  <td>
                    <StatusChip status={p.status} size="sm" />
                  </td>
                  <td style={{ fontSize: '12.5px', color: 'var(--ink-2)' }}>
                    {p.createdAt}
                  </td>
                  <td>
                    {p.status === 'Success' && (
                      <button
                        onClick={() => handleRefundClick(p)}
                        className="btn btn-outline btn-sm"
                        style={{ height: 26, fontSize: '11.5px', color: 'var(--danger)', borderColor: 'rgba(240, 82, 79, 0.3)' }}
                      >
                        Refund
                      </button>
                    )}
                    {p.status === 'Refunded' && (
                      <span style={{ fontSize: '11.5px', color: 'var(--danger)', fontWeight: 600 }}>
                        {p.refundReason || 'Refunded'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Weekly Partner Payouts Table */}
      {activeTab === 'payouts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Cycle Overview Cards */}
          <div
            style={{
              padding: '18px 22px',
              borderRadius: 14,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
                CURRENT CYCLE
              </span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)' }}>
                Cycle W42: Oct 14 – Oct 20, 2026
              </h3>
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Gross Earned</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>₹89,100</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Platform Cut</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>-₹17,040</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Net Payable</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--success)' }}>₹72,060</div>
              </div>
            </div>
          </div>

          {/* Payouts Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Professional</th>
                  <th>Cycle Period</th>
                  <th>Gross Billing</th>
                  <th>Platform Fee</th>
                  <th>Net Payable</th>
                  <th>Bank Account</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {storeState.payouts.map(po => (
                  <tr key={po.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                      {po.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{po.professionalName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{po.professionalId}</div>
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--ink-2)' }}>
                      {po.period}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }} className="tabular">
                      ₹{po.gross.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--danger)' }} className="tabular">
                      -₹{po.commission.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--success)', fontSize: '15px' }} className="tabular">
                      ₹{po.net.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--ink-2)' }}>
                      <code>{po.accountNo}</code>
                    </td>
                    <td>
                      <StatusChip status={po.status} size="sm" />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {po.status === 'Pending' && (
                          <button
                            onClick={() => handleApprovePayout(po.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ height: 26, fontSize: '11.5px', padding: '0 8px' }}
                          >
                            Approve
                          </button>
                        )}
                        {po.status === 'Approved' && (
                          <button
                            onClick={() => handleMarkPaid(po.id)}
                            className="btn btn-primary btn-sm"
                            style={{ height: 26, fontSize: '11.5px', padding: '0 8px' }}
                          >
                            Disburse IMPS
                          </button>
                        )}
                        {po.status === 'Paid' && (
                          <button
                            onClick={() => addToast('info', 'Statement Downloaded', `Generated advice PDF for ${po.professionalName}`)}
                            className="btn btn-ghost btn-sm"
                            style={{ height: 26, fontSize: '11px', padding: '0 6px' }}
                          >
                            <Download size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      <Modal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        title="Process Customer Refund"
        subtitle={`Payment ID: ${selectedPayment?.id} • Booking: ${selectedPayment?.bookingId}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowRefundModal(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleConfirmRefund}>
              Confirm Full Refund (₹{selectedPayment?.amount.toFixed(2)})
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Refund Reason (Audited)</label>
            <select
              className="form-select"
              value={refundReason}
              onChange={e => setRefundReason(e.target.value)}
            >
              <option value="Service dissatisfaction / customer complaint">Customer complaint</option>
              <option value="Partner no-show or excessive delay">Partner no-show</option>
              <option value="Overcharged or duplicate payment error">Overcharged / duplicate transaction</option>
              <option value="Booking cancelled prior to dispatch">Cancelled prior to dispatch</option>
            </select>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
            Funds will be instantly returned via original payment channel ({selectedPayment?.method}).
          </p>
        </div>
      </Modal>
    </div>
  );
};
