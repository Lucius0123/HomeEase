import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle,
  XCircle,
  RotateCw,
  Plus,
  AlertTriangle,
  ChevronRight,
  X,
  CreditCard,
  UserCheck,
  Send
} from 'lucide-react';
import { mockStore } from '../services/mockStore';
import { useToast } from '../context/ToastContext';
import { Booking, BookingStatus, Professional } from '../types';
import { StatusChip } from '../components/common/StatusChip';
import { Modal } from '../components/common/Modal';

interface BookingsViewProps {
  initialDetailId?: string;
  onClearDetailId?: () => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  initialDetailId,
  onClearDetailId
}) => {
  const { addToast } = useToast();
  const [storeState, setStoreState] = useState(mockStore.getState());

  // Search & Filter state
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [selectedBookingIds, setSelectedBookingIds] = useState<Set<string>>(new Set());

  // Detail Drawer state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Modals state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Modal form inputs
  const [assignProId, setAssignProId] = useState('');
  const [newSlotDate, setNewSlotDate] = useState('2026-10-23');
  const [newSlotTime, setNewSlotTime] = useState('10:00 AM - 11:30 AM');
  const [cancelReason, setCancelReason] = useState('Customer emergency');
  const [issueRefund, setIssueRefund] = useState(true);
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    return mockStore.subscribe(() => {
      setStoreState(mockStore.getState());
      if (selectedBooking) {
        const refreshed = mockStore.getBookingById(selectedBooking.id);
        if (refreshed) setSelectedBooking(refreshed);
      }
    });
  }, [selectedBooking]);

  useEffect(() => {
    if (initialDetailId) {
      const b = mockStore.getBookingById(initialDetailId);
      if (b) setSelectedBooking(b);
      if (onClearDetailId) onClearDetailId();
    }
  }, [initialDetailId, onClearDetailId]);

  const allBookings = mockStore.getBookings();

  // Status Tabs with Live Counts
  const statusTabs = [
    { label: 'All', count: allBookings.length },
    { label: 'Requested', count: allBookings.filter(b => b.status === 'Requested').length },
    { label: 'Confirmed', count: allBookings.filter(b => b.status === 'Confirmed').length },
    { label: 'On the way', count: allBookings.filter(b => b.status === 'On the way').length },
    { label: 'Arrived', count: allBookings.filter(b => b.status === 'Arrived').length },
    { label: 'In progress', count: allBookings.filter(b => b.status === 'In progress').length },
    { label: 'Completed', count: allBookings.filter(b => b.status === 'Completed').length },
    { label: 'Cancelled', count: allBookings.filter(b => b.status === 'Cancelled').length }
  ];

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return allBookings.filter(b => {
      if (selectedStatusTab !== 'All' && b.status !== selectedStatusTab) return false;
      if (selectedCategory !== 'All' && b.categoryName !== selectedCategory) return false;
      if (selectedPaymentStatus !== 'All' && b.paymentStatus !== selectedPaymentStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = b.id.toLowerCase().includes(q);
        const matchesCust = b.customerName.toLowerCase().includes(q);
        const matchesPhone = b.customerPhone.includes(q);
        const matchesPro = b.professionalName?.toLowerCase().includes(q);
        const matchesService = b.serviceName.toLowerCase().includes(q);
        if (!matchesId && !matchesCust && !matchesPhone && !matchesPro && !matchesService) return false;
      }

      return true;
    });
  }, [allBookings, selectedStatusTab, selectedCategory, selectedPaymentStatus, searchQuery]);

  // Bulk Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBookingIds(new Set(filteredBookings.map(b => b.id)));
    } else {
      setSelectedBookingIds(new Set());
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = new Set(selectedBookingIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedBookingIds(updated);
  };

  // Actions
  const handleExportCSV = () => {
    const rows = [
      ['Booking ID', 'Status', 'Service', 'Customer', 'Phone', 'Professional', 'Slot', 'Amount', 'Payment'],
      ...filteredBookings.map(b => [
        b.id,
        b.status,
        `"${b.serviceName}"`,
        `"${b.customerName}"`,
        b.customerPhone,
        `"${b.professionalName || 'Unassigned'}"`,
        `"${b.slotDate} ${b.slotTime}"`,
        b.total,
        b.paymentStatus
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HomeEase_Bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Export Completed', `Exported ${filteredBookings.length} bookings to CSV.`);
  };

  const handleConfirmAssign = () => {
    if (!selectedBooking || !assignProId) return;
    mockStore.assignProfessional(selectedBooking.id, assignProId);
    setShowAssignModal(false);
    addToast('success', 'Professional Assigned', `Assigned booking ${selectedBooking.id} successfully.`);
  };

  const handleConfirmReschedule = () => {
    if (!selectedBooking) return;
    mockStore.rescheduleBooking(selectedBooking.id, newSlotDate, newSlotTime);
    setShowRescheduleModal(false);
    addToast('info', 'Booking Rescheduled', `Slot shifted to ${newSlotDate} (${newSlotTime}).`);
  };

  const handleConfirmCancel = () => {
    if (!selectedBooking) return;
    mockStore.cancelBooking(selectedBooking.id, cancelReason, issueRefund);
    setShowCancelModal(false);
    addToast('warning', 'Booking Cancelled', `Cancelled ${selectedBooking.id}. Refund: ${issueRefund ? 'Processed' : 'None'}.`);
  };

  const handleAddNote = () => {
    if (!selectedBooking || !newNoteText.trim()) return;
    mockStore.addBookingNote(selectedBooking.id, newNoteText.trim());
    setNewNoteText('');
    addToast('info', 'Internal Note Saved', 'Operational note appended to booking record.');
  };

  const handleAdvanceSimulator = () => {
    if (!selectedBooking) return;
    mockStore.advancePartnerStep(selectedBooking.id);
    addToast('success', 'Simulator Step Executed', `Partner journey advanced for ${selectedBooking.id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Status Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 4,
          borderBottom: '1px solid var(--border)'
        }}
      >
        {statusTabs.map(tab => {
          const isActive = selectedStatusTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setSelectedStatusTab(tab.label)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 10,
                border: 'none',
                background: isActive ? 'var(--primary-soft)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--ink-2)',
                fontSize: '13.5px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 10,
                  background: isActive ? 'var(--primary)' : 'var(--surface-2)',
                  color: isActive ? '#FFFFFF' : 'var(--ink-3)'
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter & Action Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 280 }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
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
              placeholder="Search by ID, customer, service, phone..."
              className="form-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36, height: 38 }}
            />
          </div>

          {/* Category Filter */}
          <select
            className="form-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ width: 170, height: 38, fontSize: '13px' }}
          >
            <option value="All">All Categories</option>
            {storeState.categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Payment Filter */}
          <select
            className="form-select"
            value={selectedPaymentStatus}
            onChange={e => setSelectedPaymentStatus(e.target.value)}
            style={{ width: 140, height: 38, fontSize: '13px' }}
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Bulk & Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {selectedBookingIds.size > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 12px',
                borderRadius: 8,
                background: 'var(--primary-soft)',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              <span>{selectedBookingIds.size} selected</span>
              <button
                onClick={() => addToast('info', 'Bulk Reminder Sent', `Sent SMS reminders for ${selectedBookingIds.size} bookings.`)}
                className="btn btn-primary btn-sm"
              >
                Send Reminder
              </button>
            </div>
          )}

          <button onClick={handleExportCSV} className="btn btn-outline btn-sm">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={
                    filteredBookings.length > 0 &&
                    selectedBookingIds.size === filteredBookings.length
                  }
                  onChange={handleSelectAll}
                  style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </th>
              <th>Booking ID</th>
              <th>Status</th>
              <th>Service & Category</th>
              <th>Customer</th>
              <th>Professional</th>
              <th>Slot Time</th>
              <th>City</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div className="clay-badge clay-amber" style={{ width: 52, height: 52, borderRadius: 16 }}>
                      <AlertTriangle size={24} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>
                      No bookings match these filters
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--ink-2)', maxWidth: 360 }}>
                      Try adjusting the status tab, search keyword, or switch your active city.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedStatusTab('All');
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setSelectedPaymentStatus('All');
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredBookings.map(booking => {
                const isSelected = selectedBookingIds.has(booking.id);
                const isOpened = selectedBooking?.id === booking.id;

                return (
                  <tr
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    style={{
                      background: isOpened ? 'var(--primary-soft)' : undefined
                    }}
                  >
                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={e => handleToggleSelect(booking.id, e as any)}
                        style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                      {booking.id}
                    </td>
                    <td>
                      <StatusChip status={booking.status} size="sm" />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{booking.serviceName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{booking.categoryName}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{booking.customerName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>{booking.customerPhone}</div>
                    </td>
                    <td>
                      {booking.professionalName ? (
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{booking.professionalName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>
                            ★ {booking.professionalRating}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                            setShowAssignModal(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '11px', height: 26, padding: '0 8px' }}
                        >
                          ⚡ Assign Pro
                        </button>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>{booking.slotDate}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>{booking.slotTime}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px', color: 'var(--ink)' }}>{booking.city}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--ink)' }} className="tabular">
                      ₹{Math.round(booking.total).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color:
                            booking.paymentStatus === 'Paid'
                              ? 'var(--success)'
                              : booking.paymentStatus === 'Refunded'
                              ? 'var(--danger)'
                              : 'var(--warning)'
                        }}
                      >
                        {booking.paymentStatus} ({booking.paymentMethod})
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: 4 }}
                        title="View details"
                      >
                        <ChevronRight size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 480px Detail Drawer */}
      {selectedBooking && (
        <>
          <div className="drawer-backdrop" onClick={() => setSelectedBooking(null)} />
          <div className="drawer">
            {/* Drawer Glass Header */}
            <div className="drawer-header glass">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                      {selectedBooking.id}
                    </h3>
                    <StatusChip status={selectedBooking.status} size="sm" />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginTop: 2 }}>
                    Created at {selectedBooking.createdAt}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)' }}>
                  ₹{Math.round(selectedBooking.total).toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="btn btn-ghost btn-icon btn-sm"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Drawer Body Content */}
            <div className="drawer-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Simulator Quick Advance Action Banner */}
                {['Confirmed', 'On the way', 'Arrived', 'In progress'].includes(selectedBooking.status) && (
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: 'var(--primary-soft)',
                      border: '1px solid rgba(108, 77, 255, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                        PARTNER SIMULATOR
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                        Advance to next step on partner's phone
                      </div>
                    </div>
                    <button
                      onClick={handleAdvanceSimulator}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '12px' }}
                    >
                      <span>Advance Step →</span>
                    </button>
                  </div>
                )}

                {/* Vertical Status Timeline */}
                <div className="card" style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
                    Booking Lifecycle Timeline
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {selectedBooking.timeline.map((entry, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            marginTop: 5,
                            flexShrink: 0,
                            boxShadow: '0 0 6px var(--primary)'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                              {entry.status}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>
                              {entry.timestamp}
                            </span>
                          </div>
                          {entry.note && (
                            <p style={{ fontSize: '12px', color: 'var(--ink-2)', marginTop: 2 }}>
                              {entry.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Card */}
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
                      Customer Profile
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a
                        href={`tel:${selectedBooking.customerPhone}`}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px', height: 28 }}
                      >
                        <Phone size={13} />
                        <span style={{ fontSize: '11px' }}>Call</span>
                      </a>
                      <button
                        onClick={() => addToast('info', 'Chat Opened', `Started WhatsApp/SMS chat with ${selectedBooking.customerName}`)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px', height: 28 }}
                      >
                        <MessageSquare size={13} />
                        <span style={{ fontSize: '11px' }}>Chat</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      className="clay-badge"
                      style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }}
                    >
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                        {selectedBooking.customerName}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                        {selectedBooking.customerPhone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Professional Card */}
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
                      Assigned Professional
                    </span>
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--primary)', height: 26, fontSize: '12px' }}
                    >
                      {selectedBooking.professionalId ? 'Reassign' : 'Assign'}
                    </button>
                  </div>

                  {selectedBooking.professionalId ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        className="clay-badge clay-amber"
                        style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }}
                      >
                        <UserCheck size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                          {selectedBooking.professionalName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                          ★ {selectedBooking.professionalRating} • {selectedBooking.professionalPhone}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: 12, borderRadius: 8, background: 'var(--warning-soft)', color: '#B45309', fontSize: '13px' }}>
                      ⚡ No professional assigned yet. Auto-assigner looking in {selectedBooking.city}.
                    </div>
                  )}
                </div>

                {/* Services & Items Breakdown */}
                <div className="card" style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 12 }}>
                    Service Package & Add-ons
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedBooking.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: 'var(--ink)' }}>
                          {item.name} <span style={{ color: 'var(--ink-3)' }}>× {item.qty}</span>
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                          ₹{item.price * item.qty}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Payment Totals */}
                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      marginTop: 14,
                      paddingTop: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      fontSize: '12.5px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-2)' }}>
                      <span>Subtotal</span>
                      <span>₹{selectedBooking.subtotal}</span>
                    </div>
                    {selectedBooking.discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                        <span>Discount Applied</span>
                        <span>-₹{selectedBooking.discount}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-2)' }}>
                      <span>GST (18%)</span>
                      <span>₹{selectedBooking.tax.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-2)' }}>
                      <span>Platform Convenience Fee</span>
                      <span>₹{selectedBooking.platformFee}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 800,
                        fontSize: '14px',
                        color: 'var(--ink)',
                        marginTop: 4,
                        paddingTop: 6,
                        borderTop: '1px dashed var(--border)'
                      }}
                    >
                      <span>Grand Total</span>
                      <span>₹{selectedBooking.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Address Mini Map Preview */}
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <MapPin size={16} color="var(--primary)" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase' }}>
                      Service Address
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>
                    {selectedBooking.address}
                  </p>
                  <div
                    style={{
                      marginTop: 10,
                      height: 80,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #E6E8F0, #F6F7FB)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border)',
                      fontSize: '12px',
                      color: 'var(--ink-2)'
                    }}
                  >
                    📍 Lat: {selectedBooking.lat.toFixed(4)}, Lng: {selectedBooking.lng.toFixed(4)} ({selectedBooking.city})
                  </div>
                </div>

                {/* Internal Operational Notes */}
                <div className="card" style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 10 }}>
                    Internal Operational Notes
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                    {selectedBooking.internalNotes.length === 0 ? (
                      <p style={{ fontSize: '12px', color: 'var(--ink-3)' }}>No internal notes recorded yet.</p>
                    ) : (
                      selectedBooking.internalNotes.map((note, idx) => (
                        <div key={idx} style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--surface-2)', fontSize: '12.5px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink-3)', marginBottom: 2 }}>
                            <span style={{ fontWeight: 600 }}>{note.author}</span>
                            <span>{note.time}</span>
                          </div>
                          <div style={{ color: 'var(--ink)' }}>{note.text}</div>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add an internal operator note..."
                      value={newNoteText}
                      onChange={e => setNewNoteText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                      style={{ height: 34, fontSize: '12.5px' }}
                    />
                    <button onClick={handleAddNote} className="btn btn-secondary btn-sm" style={{ padding: '0 10px' }}>
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="drawer-footer">
              {selectedBooking.status !== 'Cancelled' && selectedBooking.status !== 'Completed' && (
                <>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--danger)', borderColor: 'rgba(240, 82, 79, 0.3)' }}
                  >
                    Cancel Booking
                  </button>

                  <button
                    onClick={() => setShowRescheduleModal(true)}
                    className="btn btn-outline btn-sm"
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={() => {
                      mockStore.updateBookingStatus(selectedBooking.id, 'Completed', 'Marked completed manually by admin');
                      addToast('success', 'Booking Completed', `Marked ${selectedBooking.id} as completed.`);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCircle size={14} />
                    <span>Mark Completed</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Assign Professional Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Professional"
        subtitle={`Select a verified partner in ${selectedBooking?.city} for booking ${selectedBooking?.id}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirmAssign} disabled={!assignProId}>
              Confirm Assignment
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {storeState.professionals
            .filter(p => p.stage === 'Approved' && (selectedBooking?.city ? p.city === selectedBooking.city : true))
            .map(pro => (
              <div
                key={pro.id}
                onClick={() => setAssignProId(pro.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: `2px solid ${assignProId === pro.id ? 'var(--primary)' : 'var(--border)'}`,
                  background: assignProId === pro.id ? 'var(--primary-soft)' : 'var(--surface)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={pro.avatar}
                    alt={pro.name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>{pro.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                      ★ {pro.rating} • {pro.skills.slice(0, 2).join(', ')} • {pro.zone}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: pro.online ? 'var(--success)' : 'var(--ink-3)'
                    }}
                  >
                    {pro.online ? '● Online & Available' : '○ Offline'}
                  </span>
                  <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>
                    {pro.jobsCompleted} jobs done
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Modal>

      {/* Reschedule Slot Modal */}
      <Modal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        title="Reschedule Service Slot"
        subtitle={`Pick a new date and time window for ${selectedBooking?.id}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowRescheduleModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleConfirmReschedule}>
              Confirm Reschedule
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">New Slot Date</label>
            <input
              type="date"
              className="form-input"
              value={newSlotDate}
              onChange={e => setNewSlotDate(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">New Slot Window</label>
            <select
              className="form-select"
              value={newSlotTime}
              onChange={e => setNewSlotTime(e.target.value)}
            >
              <option value="08:00 AM - 09:30 AM">08:00 AM - 09:30 AM</option>
              <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM (Popular)</option>
              <option value="12:00 PM - 01:30 PM">12:00 PM - 01:30 PM</option>
              <option value="02:30 PM - 04:00 PM">02:30 PM - 04:00 PM</option>
              <option value="05:00 PM - 06:30 PM">05:00 PM - 06:30 PM</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
        subtitle={`Confirm cancellation for booking ${selectedBooking?.id}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowCancelModal(false)}>
              Back
            </button>
            <button className="btn btn-danger" onClick={handleConfirmCancel}>
              Confirm Cancellation
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">Cancellation Reason (Mandatory)</label>
            <select
              className="form-select"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            >
              <option value="Customer emergency or reschedule failure">Customer emergency</option>
              <option value="No professional available in sector">No professional available</option>
              <option value="Duplicate booking order placed">Duplicate order</option>
              <option value="Customer requested cancellation via support">Customer requested via call</option>
            </select>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)'
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={issueRefund}
                onChange={e => setIssueRefund(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>
                  Issue Full Instant Refund (₹{selectedBooking?.total.toFixed(2)})
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-2)' }}>
                  Reverses charge back to customer's {selectedBooking?.paymentMethod} source account
                </div>
              </div>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
};
