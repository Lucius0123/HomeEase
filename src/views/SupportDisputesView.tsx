import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Search,
  Clock,
  Send,
  User,
  Calendar,
  AlertCircle,
  RotateCcw,
  ShieldAlert,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Ticket } from '../types';
import { StatusChip } from '../components/common/StatusChip';

export const SupportDisputesView: React.FC = () => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());
  const [selectedTicketId, setSelectedTicketId] = useState<string>(storeState.tickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
    });
  }, []);

  const selectedTicket = storeState.tickets.find(t => t.id === selectedTicketId) || storeState.tickets[0];
  const associatedBooking = selectedTicket?.bookingId
    ? storeState.bookings.find(b => b.id === selectedTicket.bookingId)
    : undefined;

  const handleSendReply = () => {
    if (!selectedTicket || !replyText.trim()) return;
    mockStore.sendTicketReply(selectedTicket.id, replyText.trim());
    setReplyText('');
    addToast('success', 'Reply Sent', 'Message dispatched to customer mobile app.');
  };

  const handleCannedReply = (text: string) => {
    setReplyText(text);
  };

  const handleDisputeResolution = (action: 'refund' | 'redo' | 'penalize' | 'none') => {
    if (!selectedTicket) return;
    mockStore.resolveTicket(selectedTicket.id, action, `Action taken: ${action.toUpperCase()}`);
    addToast('success', 'Dispute Resolved', `Applied ${action.toUpperCase()} resolution for ${selectedTicket.id}.`);
  };

  const filteredTickets = storeState.tickets.filter(t => {
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
          Support Desk & Dispute Arbitration
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-2)' }}>
          Three-pane operator inbox with SLA timers and instant order context
        </p>
      </div>

      {/* Three-Pane Container */}
      <div
        className="card"
        style={{
          padding: 0,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '320px 1.4fr 320px',
          minHeight: '640px',
          height: '75vh'
        }}
      >
        {/* Pane 1: Ticket List */}
        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'High', 'Medium', 'Low'].map(p => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className="btn btn-sm"
                  style={{
                    flex: 1,
                    fontSize: '11px',
                    height: 28,
                    padding: 0,
                    background: filterPriority === p ? 'var(--primary)' : 'var(--surface-2)',
                    color: filterPriority === p ? '#FFFFFF' : 'var(--ink-2)'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredTickets.map(ticket => {
              const isSelected = selectedTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--primary-soft)' : 'transparent',
                    transition: 'background 0.12s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                      {ticket.id}
                    </span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background:
                          ticket.priority === 'High'
                            ? 'var(--danger-soft)'
                            : ticket.priority === 'Medium'
                            ? 'var(--warning-soft)'
                            : 'var(--surface-2)',
                        color:
                          ticket.priority === 'High'
                            ? 'var(--danger)'
                            : ticket.priority === 'Medium'
                            ? '#B45309'
                            : 'var(--ink-2)'
                      }}
                    >
                      {ticket.priority} SLA: {ticket.slaMinutesRemaining}m
                    </span>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.3 }}>
                    {ticket.subject}
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--ink-3)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{ticket.customerName}</span>
                    <span>{ticket.createdAt.split(' ')[1]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pane 2: Conversation Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
          {selectedTicket ? (
            <>
              {/* Conversation Header */}
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                    {selectedTicket.subject}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                    Customer: {selectedTicket.customerName} • Status: {selectedTicket.status}
                  </div>
                </div>
                <StatusChip status={selectedTicket.status} size="sm" />
              </div>

              {/* Messages Body */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {selectedTicket.messages.map((msg, i) => {
                  const isAgent = msg.sender === 'agent';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div
                        key={i}
                        style={{
                          textAlign: 'center',
                          padding: '6px 12px',
                          borderRadius: 8,
                          background: 'var(--surface-2)',
                          fontSize: '11.5px',
                          color: 'var(--ink-2)',
                          alignSelf: 'center'
                        }}
                      >
                        ℹ️ {msg.text}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      style={{
                        alignSelf: isAgent ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        background: isAgent ? 'var(--primary)' : 'var(--surface-2)',
                        color: isAgent ? '#FFFFFF' : 'var(--ink)',
                        padding: '12px 16px',
                        borderRadius: isAgent ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        boxShadow: 'var(--shadow-e1)'
                      }}
                    >
                      <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
                        {msg.text}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          textAlign: 'right',
                          marginTop: 4,
                          color: isAgent ? 'rgba(255,255,255,0.7)' : 'var(--ink-3)'
                        }}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Canned Quick Replies */}
              <div style={{ padding: '8px 16px', background: 'var(--surface-2)', borderTop: '1px solid var(--border)', display: 'flex', gap: 6, overflowX: 'auto' }}>
                <button
                  onClick={() => handleCannedReply('We sincerely apologize for the delay. The professional is arriving shortly.')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
                >
                  ⚡ Apology for delay
                </button>
                <button
                  onClick={() => handleCannedReply('A full refund has been initiated to your original payment method.')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
                >
                  ⚡ Refund initiated
                </button>
                <button
                  onClick={() => handleCannedReply('We have scheduled a complimentary redo service for you.')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
                >
                  ⚡ Free redo offer
                </button>
              </div>

              {/* Reply Input Bar */}
              <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Type an official support reply..."
                  className="form-input"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                />
                <button onClick={handleSendReply} className="btn btn-primary btn-sm" style={{ padding: '0 16px' }}>
                  <Send size={15} />
                  <span>Send</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--ink-3)' }}>
              Select a ticket to view conversation
            </div>
          )}
        </div>

        {/* Pane 3: Order Context & Dispute Arbitrator */}
        <div style={{ padding: '18px', background: 'var(--surface-2)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
            Booking Context & Details
          </h4>

          {associatedBooking ? (
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--primary)' }}>
                {associatedBooking.id}
              </div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)', marginTop: 2 }}>
                {associatedBooking.serviceName}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: 4 }}>
                Partner: {associatedBooking.professionalName || 'None'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: 2 }}>
                Slot: {associatedBooking.slotDate} ({associatedBooking.slotTime})
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginTop: 8 }}>
                Total Paid: ₹{associatedBooking.total.toFixed(2)} ({associatedBooking.paymentMethod})
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--ink-3)' }}>General account inquiry without linked booking.</p>
          )}

          {/* Dispute Resolution Actions */}
          <div className="card" style={{ padding: 14 }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>
              Dispute Resolution Action:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => handleDisputeResolution('refund')}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', color: 'var(--danger)', fontSize: '12px' }}
              >
                <RotateCcw size={14} />
                <span>Issue Full Customer Refund</span>
              </button>

              <button
                onClick={() => handleDisputeResolution('redo')}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', color: 'var(--primary)', fontSize: '12px' }}
              >
                <Calendar size={14} />
                <span>Assign Free Redo Service</span>
              </button>

              <button
                onClick={() => handleDisputeResolution('penalize')}
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', color: 'var(--warning)', fontSize: '12px' }}
              >
                <ShieldAlert size={14} />
                <span>Penalise Partner (-₹500)</span>
              </button>

              <button
                onClick={() => handleDisputeResolution('none')}
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '12px' }}
              >
                <CheckCircle size={14} />
                <span>Dismiss / No Action</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
