import React, { useState } from 'react';

// Palette from Section 4.5
const CHART_PALETTE = ['#6C4DFF', '#3B82F6', '#12B886', '#FFB547', '#F0524F', '#8A8FA8'];

interface RevenueChartProps {
  data7d: { label: string; revenue: number; orders: number }[];
  data30d: { label: string; revenue: number; orders: number }[];
  data90d: { label: string; revenue: number; orders: number }[];
}

export const RevenueLineChart: React.FC<RevenueChartProps> = ({ data7d, data30d, data90d }) => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const activeData = range === '7d' ? data7d : range === '30d' ? data30d : data90d;

  const maxRevenue = Math.max(...activeData.map(d => d.revenue), 1000);
  const width = 640;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const points = activeData.map((d, i) => {
    const x = paddingX + (i / (activeData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.revenue / maxRevenue) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cpx1 = prev.x + (pt.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (pt.x - prev.x) / 2;
    const cpy2 = pt.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
            Revenue & Booking Velocity
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
            Gross merchandise value (GMV) over time
          </p>
        </div>

        {/* Range Selector */}
        <div style={{ display: 'flex', background: 'var(--surface-2)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
          {(['7d', '30d', '90d'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                background: range === r ? 'var(--surface)' : 'transparent',
                color: range === r ? 'var(--primary)' : 'var(--ink-2)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: range === r ? 'var(--shadow-e1)' : 'none'
              }}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C4DFF" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#6C4DFF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - paddingY - ratio * (height - 2 * paddingY);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--ink-3)"
                  fontFamily="var(--font-body)"
                >
                  ₹{Math.round((maxRevenue * ratio) / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <path d={areaD} fill="url(#revGrad)" />

          {/* Smooth Line */}
          <path d={pathD} fill="none" stroke="#6C4DFF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Interactive Data Points */}
          {points.map((pt, i) => (
            <g
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoverIndex === i ? 6 : 4}
                fill="#FFFFFF"
                stroke="#6C4DFF"
                strokeWidth={hoverIndex === i ? 3 : 2}
              />
              <text
                x={pt.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill={hoverIndex === i ? 'var(--primary)' : 'var(--ink-3)'}
                fontWeight={hoverIndex === i ? '700' : '500'}
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoverIndex !== null && (
          <div
            className="glass"
            style={{
              position: 'absolute',
              left: `${(points[hoverIndex].x / width) * 100}%`,
              top: `${(points[hoverIndex].y / height) * 100 - 25}%`,
              transform: 'translate(-50%, -100%)',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: '12px',
              pointerEvents: 'none',
              zIndex: 20,
              boxShadow: 'var(--shadow-e2)',
              border: '1px solid var(--border)',
              background: 'var(--surface)'
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{points[hoverIndex].label}</div>
            <div style={{ color: 'var(--primary)', fontWeight: 600 }}>
              ₹{points[hoverIndex].revenue.toLocaleString('en-IN')} GMV
            </div>
            <div style={{ color: 'var(--ink-2)', fontSize: '11px' }}>
              {points[hoverIndex].orders} bookings completed
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DonutItem {
  name: string;
  count: number;
}

export const CategoryDonutChart: React.FC<{ data: DonutItem[] }> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="card" style={{ padding: '22px' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>
          Bookings by Category
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
          Distribution across active service domains
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        {/* SVG Donut */}
        <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
          <svg viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            {data.map((item, idx) => {
              const percent = item.count / (total || 1);
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;
              const color = CHART_PALETTE[idx % CHART_PALETTE.length];

              return (
                <circle
                  key={item.name}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth={hoveredIdx === idx ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
              {hoveredIdx !== null ? data[hoveredIdx].count : total}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--ink-3)', textTransform: 'uppercase' }}>
              {hoveredIdx !== null ? data[hoveredIdx].name.split(' ')[0] : 'Total'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {data.map((item, idx) => {
            const color = CHART_PALETTE[idx % CHART_PALETTE.length];
            const pct = Math.round((item.count / (total || 1)) * 100);

            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 6px',
                  borderRadius: 6,
                  background: hoveredIdx === idx ? 'var(--surface-hover)' : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                  <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 500 }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-2)' }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
