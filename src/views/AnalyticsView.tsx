import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';

export const AnalyticsView: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'funnel' | 'cohorts' | 'revenue'>('funnel');
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const FUNNEL_STAGES = [
    { stage: 'App Store / Web Visit', users: 124500, pct: 100, dropoff: '32% bounce' },
    { stage: 'Service Page View', users: 84660, pct: 68, dropoff: '38% cart drop' },
    { stage: 'Added to Cart', users: 52290, pct: 42, dropoff: '26% slot abandon' },
    { stage: 'Time Slot Selected', users: 38595, pct: 31, dropoff: '22% payment drop' },
    { stage: 'Order Paid & Confirmed', users: 29880, pct: 24, dropoff: 'Completed' }
  ];

  const COHORT_DATA = [
    { cohort: 'W36 (Sep 01)', size: 1420, w0: '100%', w1: '48%', w2: '36%', w3: '32%', w4: '28%', w5: '25%', w6: '24%', w7: '23%', w8: '22%' },
    { cohort: 'W37 (Sep 08)', size: 1680, w0: '100%', w1: '52%', w2: '41%', w3: '35%', w4: '31%', w5: '28%', w6: '27%', w7: '26%', w8: '25%' },
    { cohort: 'W38 (Sep 15)', size: 1890, w0: '100%', w1: '54%', w2: '43%', w3: '38%', w4: '34%', w5: '30%', w6: '29%', w7: '28%', w8: '-' },
    { cohort: 'W39 (Sep 22)', size: 2150, w0: '100%', w1: '56%', w2: '46%', w3: '40%', w4: '36%', w5: '33%', w6: '31%', w7: '-', w8: '-' },
    { cohort: 'W40 (Sep 29)', size: 2400, w0: '100%', w1: '58%', w2: '47%', w3: '42%', w4: '38%', w5: '35%', w6: '-', w7: '-', w8: '-' },
    { cohort: 'W41 (Oct 06)', size: 2750, w0: '100%', w1: '61%', w2: '50%', w3: '45%', w4: '41%', w5: '-', w6: '-', w7: '-', w8: '-' },
    { cohort: 'W42 (Oct 13)', size: 3100, w0: '100%', w1: '64%', w2: '53%', w3: '-', w4: '-', w5: '-', w6: '-', w7: '-', w8: '-' }
  ];

  const handleExportCSV = () => {
    addToast('success', 'Report Exported', `Generated analytics breakdown for ${timeRange}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
            Growth & Customer Funnel Analytics
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
            Deep dive into customer conversion, slot drop-offs, and 8-week repeat retention
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <select
            className="form-select"
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            style={{ width: 160, height: 36, fontSize: '13px' }}
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
          </select>

          <button onClick={handleExportCSV} className="btn btn-outline btn-sm">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
        <button
          onClick={() => setActiveTab('funnel')}
          className={`btn ${activeTab === 'funnel' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: 10 }}
        >
          <Layers size={16} />
          <span>Conversion Funnel</span>
        </button>
        <button
          onClick={() => setActiveTab('cohorts')}
          className={`btn ${activeTab === 'cohorts' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: 10 }}
        >
          <Users size={16} />
          <span>Cohort Retention Heatmap</span>
        </button>
      </div>

      {/* Tab 1: Conversion Funnel */}
      {activeTab === 'funnel' && (
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
            End-to-End Checkout Funnel
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-2)', marginBottom: 28 }}>
            Drop-off analysis from initial visitor discovery to service confirmation
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {FUNNEL_STAGES.map((stg, i) => (
              <div key={stg.stage} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'var(--primary-soft)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>
                      {stg.stage}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
                      {stg.dropoff}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }} className="tabular">
                      {stg.users.toLocaleString()} ({stg.pct}%)
                    </span>
                  </div>
                </div>

                {/* Funnel Progress Bar */}
                <div style={{ height: 28, borderRadius: 8, background: 'var(--surface-2)', overflow: 'hidden', padding: 2 }}>
                  <div
                    style={{
                      width: `${stg.pct}%`,
                      height: '100%',
                      borderRadius: 6,
                      background: `linear-gradient(90deg, #6C4DFF ${100 - i * 15}%, #9B7BFF 100%)`,
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 32,
              padding: 16,
              borderRadius: 12,
              background: 'var(--primary-soft)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <Sparkles size={20} color="var(--primary)" />
            <div style={{ fontSize: '13px', color: 'var(--primary)', lineHeight: 1.5 }}>
              <strong>Optimization Insight:</strong> Urban Company-style streamlined slot booking reduced slot
              drop-off by 8.4% this month. Overall visit-to-paid conversion rate stands at <strong>24.0%</strong>.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cohort Retention Heatmap */}
      {activeTab === 'cohorts' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
            8-Week Customer Repeat Retention Heatmap
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-2)', marginBottom: 20 }}>
            Percentage of customers ordering repeat services in weeks following first signup
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
              <thead>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', color: 'var(--ink-3)' }}>COHORT</th>
                  <th style={{ padding: 12, color: 'var(--ink-3)' }}>CUSTOMERS</th>
                  {['W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'].map(w => (
                    <th key={w} style={{ padding: 12, fontWeight: 700, color: 'var(--ink)' }}>
                      {w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COHORT_DATA.map(row => (
                  <tr key={row.cohort} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--ink)' }}>
                      {row.cohort}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--ink-2)' }}>
                      {row.size.toLocaleString()}
                    </td>
                    {[row.w0, row.w1, row.w2, row.w3, row.w4, row.w5, row.w6, row.w7, row.w8].map((val, idx) => {
                      const num = parseInt(val);
                      let cellBg = 'transparent';
                      let textColor = 'var(--ink)';

                      if (val !== '-') {
                        if (num >= 80) cellBg = 'rgba(108, 77, 255, 0.45)';
                        else if (num >= 50) cellBg = 'rgba(108, 77, 255, 0.32)';
                        else if (num >= 35) cellBg = 'rgba(108, 77, 255, 0.22)';
                        else if (num >= 20) cellBg = 'rgba(108, 77, 255, 0.12)';
                        else cellBg = 'rgba(108, 77, 255, 0.05)';
                      }

                      return (
                        <td key={idx} style={{ padding: 6 }}>
                          <div
                            style={{
                              padding: '8px 4px',
                              borderRadius: 6,
                              background: cellBg,
                              color: textColor,
                              fontWeight: 700
                            }}
                          >
                            {val}
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
      )}
    </div>
  );
};
