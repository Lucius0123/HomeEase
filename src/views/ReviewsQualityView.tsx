import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldAlert,
  EyeOff,
  Eye,
  AlertTriangle,
  Award,
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Review } from '../types';
import { StatusChip } from '../components/common/StatusChip';

export const ReviewsQualityView: React.FC = () => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [filterRating, setFilterRating] = useState<'All' | 'Flagged' | '5' | '1-2'>('All');

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  const totalReviews = storeState.reviews.length;
  const rating5 = storeState.reviews.filter(r => r.rating === 5).length;
  const rating4 = storeState.reviews.filter(r => r.rating === 4).length;
  const rating3 = storeState.reviews.filter(r => r.rating === 3).length;
  const rating2 = storeState.reviews.filter(r => r.rating === 2).length;
  const rating1 = storeState.reviews.filter(r => r.rating === 1).length;

  const handleToggleHideReview = (r: Review) => {
    const nextStatus = r.status === 'Published' ? 'Hidden' : 'Published';
    mockStore.updateReviewStatus(r.id, nextStatus);
    addToast('info', `Review ${nextStatus}`, `Review ID: ${r.id} visibility toggled.`);
  };

  const handleWarnProfessional = (proName: string) => {
    addToast('warning', 'Formal Quality Warning Dispatched', `Issued formal quality strike to ${proName}.`);
  };

  const handleRetrainProfessional = (proName: string) => {
    addToast('info', 'Retraining Module Assigned', `Enrolled ${proName} in mandatory customer etiquette refresh.`);
  };

  const filteredReviews = storeState.reviews.filter(r => {
    if (filterRating === 'Flagged') return r.flagged;
    if (filterRating === '5') return r.rating === 5;
    if (filterRating === '1-2') return r.rating <= 2;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header & Distribution Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 20
        }}
      >
        {/* Rating Breakdown */}
        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
            Customer Satisfaction & Rating Distribution
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-2)', marginBottom: 16 }}>
            Aggregate quality score across all completed orders
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '38px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent)', lineHeight: 1 }}>
                4.86
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '6px 0' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={15} fill="var(--accent)" color="var(--accent)" />
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                Based on {totalReviews + 480} ratings
              </div>
            </div>

            {/* Distribution Bars */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { stars: '5 Stars', count: rating5 + 390, pct: 85 },
                { stars: '4 Stars', count: rating4 + 65, pct: 10 },
                { stars: '3 Stars', count: rating3 + 15, pct: 3 },
                { stars: '2 Stars', count: rating2 + 8, pct: 1.5 },
                { stars: '1 Star', count: rating1 + 4, pct: 0.5 }
              ].map(item => (
                <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '12px' }}>
                  <span style={{ width: 48, color: 'var(--ink-2)', fontWeight: 600 }}>{item.stars}</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${item.pct}%`, height: '100%', background: 'var(--accent)' }} />
                  </div>
                  <span style={{ width: 30, textAlign: 'right', fontWeight: 600, color: 'var(--ink-3)' }}>
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quality Scorecard Summary */}
        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
            Marketplace SLA Standards
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-2)', marginBottom: 16 }}>
            Core operational benchmarks monitored by algorithm
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 600 }}>On-Time Partner Arrival</span>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--success)' }}>96.8%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 600 }}>Repeat Booking Frequency (30d)</span>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--primary)' }}>42.4%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 600 }}>Dispute Escalate Rate</span>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--ink)' }}>1.2%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 600 }}>Net Promoter Score (NPS)</span>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--accent)' }}>+68</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Reviews & Moderation Queue */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
              Moderation & Feedback Queue
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
              Audit flagged complaints or negative experiences
            </p>
          </div>

          <div style={{ display: 'flex', background: 'var(--surface-2)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
            {(['All', 'Flagged', '1-2', '5'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterRating(f)}
                style={{
                  background: filterRating === f ? 'var(--surface)' : 'transparent',
                  color: filterRating === f ? 'var(--primary)' : 'var(--ink-2)',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: 6,
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {f === '1-2' ? 'Low Ratings (≤2★)' : f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredReviews.map(r => (
            <div
              key={r.id}
              style={{
                padding: '16px',
                borderRadius: 14,
                background: r.flagged ? 'var(--danger-soft)' : 'var(--surface-2)',
                border: `1px solid ${r.flagged ? 'rgba(240, 82, 79, 0.25)' : 'var(--border)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < r.rating ? 'var(--accent)' : 'none'}
                          color={i < r.rating ? 'var(--accent)' : 'var(--border)'}
                        />
                      ))}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                      {r.serviceName}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                      ({r.bookingId})
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: 2 }}>
                    By {r.customerName} for <strong>{r.professionalName}</strong> • {r.createdAt}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StatusChip status={r.status} size="sm" />
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>
                "{r.comment}"
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {r.tags.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--ink-2)'
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  onClick={() => handleToggleHideReview(r)}
                  className="btn btn-outline btn-sm"
                  style={{ height: 26, fontSize: '11.5px' }}
                >
                  {r.status === 'Published' ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{r.status === 'Published' ? 'Hide Review' : 'Publish Review'}</span>
                </button>

                {r.rating <= 2 && (
                  <>
                    <button
                      onClick={() => handleWarnProfessional(r.professionalName)}
                      className="btn btn-outline btn-sm"
                      style={{ height: 26, fontSize: '11.5px', color: 'var(--danger)' }}
                    >
                      <AlertTriangle size={13} />
                      <span>Issue Quality Warning</span>
                    </button>
                    <button
                      onClick={() => handleRetrainProfessional(r.professionalName)}
                      className="btn btn-secondary btn-sm"
                      style={{ height: 26, fontSize: '11.5px' }}
                    >
                      <GraduationCap size={13} />
                      <span>Assign Retraining</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
