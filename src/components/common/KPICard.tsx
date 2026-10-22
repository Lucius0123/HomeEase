import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: {
    value: string;
    isPositive: boolean;
    period?: string;
  };
  icon: LucideIcon;
  clayVariant?: 'violet' | 'amber' | 'mint';
  subtext?: string;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  delta,
  icon: Icon,
  clayVariant = 'violet',
  subtext,
  onClick
}) => {
  let badgeStyle = 'clay-badge';
  if (clayVariant === 'amber') badgeStyle = 'clay-badge clay-amber';
  if (clayVariant === 'mint') badgeStyle = 'clay-badge clay-mint';

  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '136px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)' }}>{title}</span>
        <div className={badgeStyle} style={{ width: 38, height: 38, borderRadius: 12 }}>
          <Icon size={19} />
        </div>
      </div>

      <div>
        <div
          className="tabular"
          style={{
            fontSize: '28px',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            color: 'var(--ink)',
            lineHeight: 1.15
          }}
        >
          {value}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          {delta ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '12px',
                fontWeight: 600,
                color: delta.isPositive ? 'var(--success)' : 'var(--danger)'
              }}
            >
              {delta.isPositive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              <span>{delta.value}</span>
              <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>{delta.period || 'vs yesterday'}</span>
            </div>
          ) : subtext ? (
            <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{subtext}</span>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};
