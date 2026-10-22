import React, { useState, useEffect } from 'react';
import {
  TicketPercent,
  Plus,
  Sparkles,
  Check,
  Calendar,
  Percent,
  Tag,
  Users,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Coupon, MembershipPlan } from '../types';
import { Modal } from '../components/common/Modal';

export const OffersMembershipsView: React.FC = () => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [activeTab, setActiveTab] = useState<'coupons' | 'memberships'>('coupons');

  // Coupon Create Modal
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percent' | 'flat'>('percent');
  const [newValue, setNewValue] = useState(20);
  const [newCap, setNewCap] = useState(300);
  const [newMinCart, setNewMinCart] = useState(699);
  const [newValidTo, setNewValidTo] = useState('2026-11-30');
  const [newLimit, setNewLimit] = useState(1000);
  const [newOnly, setNewOnly] = useState(false);

  // Membership Edit Modal
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  const handleToggleCoupon = (id: string) => {
    mockStore.toggleCoupon(id);
    addToast('info', 'Coupon Status Changed', 'Toggled coupon availability.');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const coupon: Coupon = {
      id: `cpn-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      type: newType,
      value: newValue,
      cap: newCap,
      minCart: newMinCart,
      validTo: newValidTo,
      usageLimit: newLimit,
      usedCount: 0,
      newUserOnly: newOnly,
      active: true,
      categories: []
    };

    mockStore.addCoupon(coupon);
    setShowCreateCouponModal(false);
    setNewCode('');
    addToast('success', 'Promo Coupon Created', `Code ${coupon.code} is now live.`);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    mockStore.updateMembership(editingPlan.id, editingPlan);
    setEditingPlan(null);
    addToast('success', 'Plan Terms Saved', `Updated ${editingPlan.name}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tab Switcher & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`btn ${activeTab === 'coupons' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 10 }}
          >
            <TicketPercent size={16} />
            <span>Discount Coupons ({storeState.coupons.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('memberships')}
            className={`btn ${activeTab === 'memberships' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 10 }}
          >
            <Sparkles size={16} />
            <span>HomeEase Plus Memberships ({storeState.memberships.length})</span>
          </button>
        </div>

        {activeTab === 'coupons' && (
          <button
            onClick={() => setShowCreateCouponModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} />
            <span>Create New Promo Code</span>
          </button>
        )}
      </div>

      {/* Tab 1: Discount Coupons */}
      {activeTab === 'coupons' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 20
          }}
        >
          {storeState.coupons.map(cpn => {
            const usagePct = Math.round((cpn.usedCount / cpn.usageLimit) * 100);
            return (
              <div
                key={cpn.id}
                className="card"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: cpn.active ? 1 : 0.65
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '18px',
                          fontWeight: 800,
                          color: 'var(--primary)',
                          background: 'var(--primary-soft)',
                          padding: '4px 10px',
                          borderRadius: 8,
                          letterSpacing: '0.05em',
                          border: '1px dashed var(--primary)'
                        }}
                      >
                        {cpn.code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleCoupon(cpn.id)}
                      className="btn btn-sm"
                      style={{
                        height: 26,
                        fontSize: '11px',
                        background: cpn.active ? 'var(--success-soft)' : 'var(--danger-soft)',
                        color: cpn.active ? 'var(--success)' : 'var(--danger)',
                        border: `1px solid ${cpn.active ? 'rgba(18, 184, 134, 0.3)' : 'rgba(240, 82, 79, 0.3)'}`
                      }}
                    >
                      {cpn.active ? 'Active' : 'Paused'}
                    </button>
                  </div>

                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginTop: 8 }}>
                    {cpn.type === 'percent' ? `${cpn.value}% Off up to ₹${cpn.cap}` : `Flat ₹${cpn.value} Off`}
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--ink-2)', marginTop: 4 }}>
                    Min order ₹{cpn.minCart} • Valid until {cpn.validTo}
                  </div>

                  {cpn.newUserOnly && (
                    <div style={{ marginTop: 8 }}>
                      <span className="chip chip-amber" style={{ fontSize: '11px' }}>
                        ★ New Users Only
                      </span>
                    </div>
                  )}

                  {/* Usage Progress */}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ink-2)', marginBottom: 4 }}>
                      <span>Redeemed: {cpn.usedCount.toLocaleString()} / {cpn.usageLimit.toLocaleString()}</span>
                      <span style={{ fontWeight: 700 }}>{usagePct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'var(--surface-2)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, usagePct)}%`, height: '100%', background: 'var(--primary)' }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Memberships (HomeEase Plus Plans) */}
      {activeTab === 'memberships' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 24
            }}
          >
            {storeState.memberships.map(plan => (
              <div
                key={plan.id}
                className="card"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: plan.name.includes('VIP') ? '2px solid var(--accent)' : '1px solid var(--border)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: plan.name.includes('VIP') ? 'linear-gradient(135deg, #FFB547, #F59F00)' : 'var(--primary-soft)',
                        color: plan.name.includes('VIP') ? '#FFFFFF' : 'var(--primary)'
                      }}
                    >
                      {plan.duration}
                    </span>
                    <button
                      onClick={() => setEditingPlan({ ...plan })}
                      className="btn btn-ghost btn-sm"
                      style={{ height: 28 }}
                    >
                      <Edit2 size={13} />
                      <span>Edit Plan</span>
                    </button>
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
                    {plan.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '14px 0' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
                      ₹{plan.price}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
                      / {plan.duration}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--surface-2)',
                      fontSize: '13px',
                      color: 'var(--ink)',
                      fontWeight: 600,
                      marginBottom: 16
                    }}
                  >
                    👥 {plan.subscriberCount.toLocaleString()} Active Subscribers
                  </div>

                  {/* Benefits */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {plan.benefits.map((b, bIdx) => (
                      <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '13px', color: 'var(--ink)' }}>
                        <Check size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      <Modal
        isOpen={showCreateCouponModal}
        onClose={() => setShowCreateCouponModal(false)}
        title="Create Promotional Coupon"
        subtitle="Publish a new discount code for mobile app customers"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowCreateCouponModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateCoupon}>
              Create & Publish Code
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Promo Code (e.g. DIWALI30)</label>
            <input
              type="text"
              className="form-input"
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
              required
              placeholder="DIWALI30"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Discount Type</label>
              <select
                className="form-select"
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
              >
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat ₹ Amount</option>
              </select>
            </div>
            <div>
              <label className="form-label">Discount Value</label>
              <input
                type="number"
                className="form-input"
                value={newValue}
                onChange={e => setNewValue(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Max Discount Cap (₹)</label>
              <input
                type="number"
                className="form-input"
                value={newCap}
                onChange={e => setNewCap(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="form-label">Min Cart Value (₹)</label>
              <input
                type="number"
                className="form-input"
                value={newMinCart}
                onChange={e => setNewMinCart(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={newOnly}
                onChange={e => setNewOnly(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>Restrict to first-time customer orders only</span>
            </label>
          </div>
        </form>
      </Modal>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={Boolean(editingPlan)}
        onClose={() => setEditingPlan(null)}
        title="Edit Membership Plan"
        subtitle={`Adjust pricing terms for ${editingPlan?.name}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setEditingPlan(null)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSavePlan}>
              Save Terms
            </button>
          </>
        }
      >
        {editingPlan && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Plan Name</label>
              <input
                type="text"
                className="form-input"
                value={editingPlan.name}
                onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Subscription Price (₹)</label>
              <input
                type="number"
                className="form-input"
                value={editingPlan.price}
                onChange={e => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
