import React from 'react';
import { BookingStatus } from '../../types';

interface StatusChipProps {
  status: BookingStatus | string;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'md' }) => {
  let chipClass = 'chip-slate';

  switch (status) {
    case 'Requested':
      chipClass = 'chip-slate';
      break;
    case 'Confirmed':
      chipClass = 'chip-violet';
      break;
    case 'On the way':
    case 'Arrived':
      chipClass = 'chip-blue';
      break;
    case 'In progress':
      chipClass = 'chip-amber';
      break;
    case 'Completed':
      chipClass = 'chip-green';
      break;
    case 'Reviewed':
      chipClass = 'chip-green-outline';
      break;
    case 'Rescheduled':
      chipClass = 'chip-amber-outline';
      break;
    case 'Cancelled':
      chipClass = 'chip-red';
      break;
    case 'Refunded':
      chipClass = 'chip-red-outline';
      break;
    case 'Active':
    case 'Success':
    case 'Paid':
    case 'Approved':
      chipClass = 'chip-green';
      break;
    case 'Pending':
    case 'Pending KYC':
    case 'Open':
      chipClass = 'chip-amber';
      break;
    case 'Suspended':
    case 'Failed':
      chipClass = 'chip-red';
      break;
    default:
      chipClass = 'chip-slate';
  }

  return (
    <span
      className={`chip ${chipClass}`}
      style={{
        fontSize: size === 'sm' ? '11px' : '12px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px'
      }}
    >
      <span className="chip-dot" />
      {status}
    </span>
  );
};
