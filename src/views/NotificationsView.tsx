import React, { useState } from 'react';
import {
  Bell,
  Send,
  MessageSquare,
  Smartphone,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { NotificationRecord } from '../types';

export const NotificationsView: React.FC = () => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<NotificationRecord['target']>('All Customers');
  const [channel, setChannel] = useState<'Push' | 'SMS'>('Push');

  React.useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const notif: NotificationRecord = {
      id: `notif-${Date.now()}`,
      title,
      message,
      target,
      channel,
      sentAt: 'Just now',
      sentCount: target === 'All Customers' ? 18500 : 2840,
      openRate: '32.4%'
    };

    mockStore.sendNotification(notif);
    setTitle('');
    setMessage('');
    addToast('success', 'Campaign Dispatched', `Broadcast sent to ${notif.target} via ${channel}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
          Customer Broadcast Notifications & SMS
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
          Send targeted push notifications and reminders to customer segments
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: 24,
          alignItems: 'start'
        }}
      >
        {/* Composer Form */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', marginBottom: 16 }}>
            Broadcast Composer
          </h3>

          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label">Channel</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setChannel('Push')}
                  className={`btn btn-sm ${channel === 'Push' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                >
                  <Bell size={14} />
                  <span>Mobile Push Notification</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`btn btn-sm ${channel === 'SMS' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                >
                  <MessageSquare size={14} />
                  <span>Transactional SMS</span>
                </button>
              </div>
            </div>

            <div>
              <label className="form-label">Target Audience Segment</label>
              <select
                className="form-select"
                value={target}
                onChange={e => setTarget(e.target.value as any)}
              >
                <option value="All Customers">All Active Customers (18,500)</option>
                <option value="HomeEase Plus">HomeEase Plus Subscribers (2,840)</option>
                <option value="Inactive (30d)">Inactive Users {'>'} 30 Days (4,120)</option>
                <option value="All Pros">All Verified Professionals (40)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Notification Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Flash 25% Off on Salon Prime Spa ✨"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Message Body</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Enter compelling broadcast copy..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: 42 }}>
              <Send size={15} />
              <span>Dispatch Campaign Immediately</span>
            </button>
          </form>
        </div>

        {/* Live Phone Notification Widget Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
            Live Device Lockscreen Preview
          </div>

          <div
            style={{
              padding: '24px 20px',
              borderRadius: 24,
              background: 'linear-gradient(145deg, #16152E, #0D0C22)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-e3)'
            }}
          >
            <div style={{ fontSize: '11px', color: '#8E91B2', marginBottom: 12, textAlign: 'center' }}>
              Thursday, October 22 • 12:45 PM
            </div>

            {/* Notification Banner */}
            <div
              style={{
                padding: '14px',
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={10} color="#FFFFFF" />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#C3B8FF' }}>HOMEEASE</span>
                </div>
                <span style={{ fontSize: '10px', color: '#A7A9C4' }}>now</span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '13px', color: '#FFFFFF' }}>
                {title || 'Festive Weekend Flash Sale ✨'}
              </div>
              <div style={{ fontSize: '12px', color: '#E1E2F6', marginTop: 2, lineHeight: 1.4 }}>
                {message || 'Book your home salon or deep clean today and enjoy guaranteed slot allocation!'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', marginBottom: 14 }}>
          Campaign Broadcast History
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title & Message</th>
                <th>Target Audience</th>
                <th>Channel</th>
                <th>Delivered</th>
                <th>Open Rate</th>
                <th>Dispatched</th>
              </tr>
            </thead>
            <tbody>
              {storeState.notifications.map(notif => (
                <tr key={notif.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{notif.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>{notif.message}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12.5px', color: 'var(--ink)', fontWeight: 600 }}>
                      {notif.target}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      {notif.channel}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--ink)' }} className="tabular">
                    {notif.sentCount.toLocaleString()}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                      {notif.openRate}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                    {notif.sentAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
