import {
  Booking,
  BookingStatus,
  Category,
  Customer,
  DocumentVerification,
  Payment,
  Payout,
  Professional,
  Review,
  Service,
  Ticket,
  Coupon,
  MembershipPlan,
  Banner,
  CMSSection,
  AuditLog,
  Zone,
  NotificationRecord
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_PROFESSIONALS,
  INITIAL_CUSTOMERS,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_PAYOUTS,
  INITIAL_COUPONS,
  INITIAL_MEMBERSHIPS,
  INITIAL_TICKETS,
  INITIAL_REVIEWS,
  INITIAL_BANNERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ZONES,
  INITIAL_CMS_SECTIONS,
  INITIAL_NOTIFICATIONS
} from './mockData';

const STORAGE_KEY = 'homease_admin_store_v1';

interface StoreState {
  categories: Category[];
  services: Service[];
  professionals: Professional[];
  customers: Customer[];
  bookings: Booking[];
  payments: Payment[];
  payouts: Payout[];
  coupons: Coupon[];
  memberships: MembershipPlan[];
  tickets: Ticket[];
  reviews: Review[];
  banners: Banner[];
  auditLogs: AuditLog[];
  zones: Zone[];
  cmsSections: CMSSection[];
  notifications: NotificationRecord[];
  activeCity: string;
  isSimulating: boolean;
}

type Listener = () => void;

class MockStore {
  private state: StoreState;
  private listeners: Set<Listener> = new Set();
  private simTimer: any = null;

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): StoreState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved state from localStorage, falling back to seed data', e);
    }

    return {
      categories: [...INITIAL_CATEGORIES],
      services: [...INITIAL_SERVICES],
      professionals: [...INITIAL_PROFESSIONALS],
      customers: [...INITIAL_CUSTOMERS],
      bookings: [...INITIAL_BOOKINGS],
      payments: [...INITIAL_PAYMENTS],
      payouts: [...INITIAL_PAYOUTS],
      coupons: [...INITIAL_COUPONS],
      memberships: [...INITIAL_MEMBERSHIPS],
      tickets: [...INITIAL_TICKETS],
      reviews: [...INITIAL_REVIEWS],
      banners: [...INITIAL_BANNERS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      zones: [...INITIAL_ZONES],
      cmsSections: [...INITIAL_CMS_SECTIONS],
      notifications: [...INITIAL_NOTIFICATIONS],
      activeCity: 'All Cities',
      isSimulating: false
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public resetDemoData() {
    this.state = {
      categories: [...INITIAL_CATEGORIES],
      services: [...INITIAL_SERVICES],
      professionals: [...INITIAL_PROFESSIONALS],
      customers: [...INITIAL_CUSTOMERS],
      bookings: [...INITIAL_BOOKINGS],
      payments: [...INITIAL_PAYMENTS],
      payouts: [...INITIAL_PAYOUTS],
      coupons: [...INITIAL_COUPONS],
      memberships: [...INITIAL_MEMBERSHIPS],
      tickets: [...INITIAL_TICKETS],
      reviews: [...INITIAL_REVIEWS],
      banners: [...INITIAL_BANNERS],
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          adminName: 'Super Admin',
          role: 'Super Admin',
          action: 'Reset Demo Data',
          target: 'All Collections',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          details: 'Restored original demo dataset with 12 pros, 300+ bookings and catalog'
        },
        ...INITIAL_AUDIT_LOGS
      ],
      zones: [...INITIAL_ZONES],
      cmsSections: [...INITIAL_CMS_SECTIONS],
      notifications: [...INITIAL_NOTIFICATIONS],
      activeCity: 'All Cities',
      isSimulating: false
    };
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
    this.persist();
  }

  public getState(): StoreState {
    return this.state;
  }

  // Global Filter: City
  public setActiveCity(city: string) {
    this.state.activeCity = city;
    this.persist();
  }

  // Audit
  public logAudit(action: string, target: string, details: string, admin = 'Admin', role = 'Super Admin') {
    const entry: AuditLog = {
      id: `aud-${Date.now()}`,
      adminName: admin,
      role,
      action,
      target,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details
    };
    this.state.auditLogs = [entry, ...this.state.auditLogs];
    this.persist();
  }

  // Bookings
  public getBookings(): Booking[] {
    if (this.state.activeCity === 'All Cities') {
      return this.state.bookings;
    }
    return this.state.bookings.filter(b => b.city === this.state.activeCity);
  }

  public getBookingById(id: string): Booking | undefined {
    return this.state.bookings.find(b => b.id === id);
  }

  public updateBookingStatus(id: string, status: BookingStatus, note?: string) {
    const booking = this.state.bookings.find(b => b.id === id);
    if (!booking) return;

    booking.status = status;
    booking.timeline.push({
      status,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note
    });

    if (status === 'Completed') {
      // Create review prompt or auto-review
      const exists = this.state.reviews.some(r => r.bookingId === id);
      if (!exists && booking.professionalId) {
        this.state.reviews.unshift({
          id: `rev-${Date.now()}`,
          bookingId: id,
          serviceName: booking.serviceName,
          professionalId: booking.professionalId,
          professionalName: booking.professionalName || 'Professional',
          customerName: booking.customerName,
          rating: 5,
          tags: ['Prompt', 'Polite', 'Quality service'],
          comment: 'Job was completed smoothly and professionally!',
          flagged: false,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Published'
        });
      }
    }

    this.logAudit('Booking Status Updated', id, `Status changed to ${status}${note ? ` (${note})` : ''}`);
    this.persist();
  }

  public assignProfessional(bookingId: string, proId: string) {
    const booking = this.state.bookings.find(b => b.id === bookingId);
    const pro = this.state.professionals.find(p => p.id === proId);
    if (!booking || !pro) return;

    booking.professionalId = pro.id;
    booking.professionalName = pro.name;
    booking.professionalPhone = pro.phone;
    booking.professionalRating = pro.rating;
    booking.status = 'Confirmed';
    booking.timeline.push({
      status: 'Confirmed',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: `Assigned to ${pro.name}`
    });

    this.logAudit('Booking Reassigned', bookingId, `Assigned to ${pro.name} (${pro.id})`);
    this.persist();
  }

  public rescheduleBooking(bookingId: string, newDate: string, newSlot: string) {
    const booking = this.state.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    booking.slotDate = newDate;
    booking.slotTime = newSlot;
    booking.rescheduleSlot = `${newDate} ${newSlot}`;
    booking.timeline.push({
      status: 'Rescheduled',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: `Rescheduled to ${newDate} (${newSlot})`
    });

    this.logAudit('Booking Rescheduled', bookingId, `New slot: ${newDate} ${newSlot}`);
    this.persist();
  }

  public cancelBooking(bookingId: string, reason: string, issueRefund: boolean) {
    const booking = this.state.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    booking.status = 'Cancelled';
    booking.cancelReason = reason;
    booking.timeline.push({
      status: 'Cancelled',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: `Cancelled: ${reason}`
    });

    if (issueRefund && booking.paymentStatus === 'Paid') {
      booking.paymentStatus = 'Refunded';
      booking.timeline.push({
        status: 'Refunded',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: `Full refund initiated for ${booking.total}`
      });

      this.state.payments.push({
        id: `PAY-REF-${Date.now()}`,
        bookingId: booking.id,
        customerName: booking.customerName,
        method: booking.paymentMethod,
        amount: booking.total,
        status: 'Refunded',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        refundReason: reason
      });
    }

    this.logAudit('Booking Cancelled', bookingId, `Reason: ${reason}. Refund: ${issueRefund ? 'Yes' : 'No'}`);
    this.persist();
  }

  public addBookingNote(bookingId: string, text: string, author = 'Operations') {
    const booking = this.state.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    booking.internalNotes.push({
      author,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    });
    this.persist();
  }

  // Partner Simulator
  public advancePartnerStep(bookingId: string) {
    const booking = this.state.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const nextMap: Record<BookingStatus, BookingStatus | null> = {
      'Requested': 'Confirmed',
      'Confirmed': 'On the way',
      'On the way': 'Arrived',
      'Arrived': 'In progress',
      'In progress': 'Completed',
      'Completed': null,
      'Reviewed': null,
      'Rescheduled': 'Confirmed',
      'Cancelled': null,
      'Refunded': null
    };

    const nextStatus = nextMap[booking.status];
    if (nextStatus) {
      this.updateBookingStatus(bookingId, nextStatus, `Partner simulator action: advanced to ${nextStatus}`);
    }
  }

  public toggleProOnline(proId: string) {
    const pro = this.state.professionals.find(p => p.id === proId);
    if (!pro) return;
    pro.online = !pro.online;
    this.logAudit('Partner Status Changed', pro.name, `Partner went ${pro.online ? 'Online' : 'Offline'}`);
    this.persist();
  }

  // Professionals
  public updateProStatus(proId: string, status: 'Active' | 'Pending KYC' | 'Suspended', reason?: string) {
    const pro = this.state.professionals.find(p => p.id === proId);
    if (!pro) return;
    pro.kycStatus = status;
    if (status === 'Suspended') {
      pro.suspendReason = reason || 'Suspended by admin';
      pro.online = false;
    } else {
      pro.suspendReason = undefined;
    }
    this.logAudit('Professional Status Updated', pro.name, `Status set to ${status}${reason ? `: ${reason}` : ''}`);
    this.persist();
  }

  public updateProStage(proId: string, stage: Professional['stage']) {
    const pro = this.state.professionals.find(p => p.id === proId);
    if (!pro) return;
    pro.stage = stage;
    if (stage === 'Approved') {
      pro.kycStatus = 'Active';
    }
    this.logAudit('Onboarding Stage Changed', pro.name, `Moved to stage: ${stage}`);
    this.persist();
  }

  public verifyDocument(proId: string, docType: string, status: 'Approved' | 'Rejected', notes?: string) {
    const pro = this.state.professionals.find(p => p.id === proId);
    if (!pro) return;
    const doc = pro.documents.find(d => d.type === docType);
    if (doc) {
      doc.status = status;
      doc.notes = notes;
      doc.verifiedAt = new Date().toLocaleDateString();
      this.logAudit('Document Verification', `${pro.name} - ${docType}`, `Marked as ${status}`);
      this.persist();
    }
  }

  public updateProCommission(proId: string, commissionPct: number) {
    const pro = this.state.professionals.find(p => p.id === proId);
    if (!pro) return;
    const old = pro.commissionPct;
    pro.commissionPct = commissionPct;
    this.logAudit('Commission Override Updated', pro.name, `Changed from ${old}% to ${commissionPct}%`);
    this.persist();
  }

  // Catalog
  public toggleCategoryActive(id: string) {
    const cat = this.state.categories.find(c => c.id === id);
    if (!cat) return;
    cat.active = !cat.active;
    this.logAudit('Category Toggled', cat.name, cat.active ? 'Activated' : 'Deactivated');
    this.persist();
  }

  public updateCategory(id: string, partial: Partial<Category>) {
    const cat = this.state.categories.find(c => c.id === id);
    if (!cat) return;
    Object.assign(cat, partial);
    this.logAudit('Category Updated', cat.name, 'Updated details and configuration');
    this.persist();
  }

  public reorderCategories(newOrder: Category[]) {
    this.state.categories = newOrder.map((c, idx) => ({ ...c, order: idx + 1 }));
    this.logAudit('Category Reordered', 'Catalog Layout', 'Changed category priority order');
    this.persist();
  }

  public updateService(id: string, partial: Partial<Service>) {
    const srv = this.state.services.find(s => s.id === id);
    if (!srv) return;
    Object.assign(srv, partial);
    this.logAudit('Service Package Updated', srv.name, 'Updated pricing/specs');
    this.persist();
  }

  public addService(service: Service) {
    this.state.services.unshift(service);
    this.logAudit('New Service Added', service.name, `Created in category ${service.categoryId}`);
    this.persist();
  }

  public togglePublishService(id: string) {
    const srv = this.state.services.find(s => s.id === id);
    if (!srv) return;
    srv.published = !srv.published;
    this.logAudit('Service Publication Toggled', srv.name, srv.published ? 'Published to App' : 'Unpublished');
    this.persist();
  }

  // Customers
  public toggleBlockCustomer(id: string) {
    const cust = this.state.customers.find(c => c.id === id);
    if (!cust) return;
    cust.isBlocked = !cust.isBlocked;
    this.logAudit('Customer Status Updated', cust.name, cust.isBlocked ? 'Blocked customer' : 'Unblocked customer');
    this.persist();
  }

  public adjustCustomerWallet(id: string, delta: number, note: string) {
    const cust = this.state.customers.find(c => c.id === id);
    if (!cust) return;
    cust.walletBalance += delta;
    cust.notes.push(`[${new Date().toLocaleDateString()}] Wallet adjusted by ₹${delta}: ${note}`);
    this.logAudit('Customer Wallet Adjusted', cust.name, `₹${delta} (${note})`);
    this.persist();
  }

  public addCustomerNote(id: string, note: string) {
    const cust = this.state.customers.find(c => c.id === id);
    if (!cust) return;
    cust.notes.push(note);
    this.persist();
  }

  // Payments & Payouts
  public refundPayment(paymentId: string, reason: string) {
    const payment = this.state.payments.find(p => p.id === paymentId);
    if (!payment) return;
    payment.status = 'Refunded';
    payment.refundReason = reason;

    const booking = this.state.bookings.find(b => b.id === payment.bookingId);
    if (booking) {
      booking.paymentStatus = 'Refunded';
    }

    this.logAudit('Refund Processed', paymentId, `Amount: ₹${payment.amount}, Reason: ${reason}`);
    this.persist();
  }

  public approvePayout(payoutId: string) {
    const po = this.state.payouts.find(p => p.id === payoutId);
    if (!po) return;
    po.status = 'Approved';
    this.logAudit('Payout Approved', payoutId, `Payable: ₹${po.net} to ${po.professionalName}`);
    this.persist();
  }

  public markPayoutPaid(payoutId: string) {
    const po = this.state.payouts.find(p => p.id === payoutId);
    if (!po) return;
    po.status = 'Paid';
    po.paidAt = new Date().toISOString().split('T')[0];
    this.logAudit('Payout Settled', payoutId, `Transferred ₹${po.net} via IMPS to ${po.accountNo}`);
    this.persist();
  }

  // Support
  public sendTicketReply(ticketId: string, text: string) {
    const ticket = this.state.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    ticket.messages.push({
      sender: 'agent',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    ticket.status = 'In Progress';
    this.persist();
  }

  public resolveTicket(ticketId: string, resolutionAction: 'refund' | 'redo' | 'penalize' | 'none', notes: string) {
    const ticket = this.state.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    ticket.status = 'Resolved';
    ticket.disputeResolution = { action: resolutionAction, notes };
    ticket.messages.push({
      sender: 'system',
      text: `Dispute resolved with action: ${resolutionAction.toUpperCase()}. Notes: ${notes}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.logAudit('Support Dispute Resolved', ticketId, `Action: ${resolutionAction}`);
    this.persist();
  }

  // Reviews
  public toggleFlagReview(id: string) {
    const rev = this.state.reviews.find(r => r.id === id);
    if (!rev) return;
    rev.flagged = !rev.flagged;
    this.persist();
  }

  public updateReviewStatus(id: string, status: 'Published' | 'Hidden') {
    const rev = this.state.reviews.find(r => r.id === id);
    if (!rev) return;
    rev.status = status;
    this.logAudit('Review Moderated', id, `Status set to ${status}`);
    this.persist();
  }

  // Offers
  public addCoupon(coupon: Coupon) {
    this.state.coupons.unshift(coupon);
    this.logAudit('Coupon Created', coupon.code, `Discount ${coupon.value}${coupon.type === 'percent' ? '%' : '₹'}`);
    this.persist();
  }

  public toggleCoupon(id: string) {
    const c = this.state.coupons.find(cp => cp.id === id);
    if (!c) return;
    c.active = !c.active;
    this.persist();
  }

  public updateMembership(id: string, partial: Partial<MembershipPlan>) {
    const m = this.state.memberships.find(mb => mb.id === id);
    if (!m) return;
    Object.assign(m, partial);
    this.logAudit('Membership Plan Updated', m.name, 'Plan terms/price updated');
    this.persist();
  }

  // CMS
  public updateBanner(id: string, partial: Partial<Banner>) {
    const b = this.state.banners.find(ban => ban.id === id);
    if (!b) return;
    Object.assign(b, partial);
    this.logAudit('Banner Updated', b.title, 'Updated promo banner');
    this.persist();
  }

  public addBanner(banner: Banner) {
    this.state.banners.push(banner);
    this.logAudit('Banner Added', banner.title, 'Published banner to customer app');
    this.persist();
  }

  public reorderCMSSections(sections: CMSSection[]) {
    this.state.cmsSections = sections;
    this.logAudit('CMS Layout Changed', 'App Home Screen', 'Reordered home screen widgets');
    this.persist();
  }

  // Notifications
  public sendNotification(notif: NotificationRecord) {
    this.state.notifications.unshift(notif);
    this.logAudit('Notification Dispatched', notif.title, `Channel: ${notif.channel}, Sent to: ${notif.target}`);
    this.persist();
  }

  // Zones & Slots
  public toggleSurge(zoneId: string) {
    const z = this.state.zones.find(zn => zn.id === zoneId);
    if (!z) return;
    z.surgeActive = !z.surgeActive;
    z.capacityMultiplier = z.surgeActive ? 1.25 : 1.0;
    this.logAudit('Zone Surge Toggled', z.name, z.surgeActive ? 'Surge Enabled (+25%)' : 'Surge Disabled');
    this.persist();
  }

  // Live Movement Simulation
  public toggleSimulation() {
    this.state.isSimulating = !this.state.isSimulating;

    if (this.state.isSimulating) {
      this.simTimer = setInterval(() => {
        // Jiggle online pros lat/lng slightly to simulate real-time movement
        this.state.professionals.forEach(p => {
          if (p.online) {
            p.lat += (Math.random() - 0.5) * 0.001;
            p.lng += (Math.random() - 0.5) * 0.001;
          }
        });
        this.notify();
      }, 3000);
    } else {
      if (this.simTimer) {
        clearInterval(this.simTimer);
        this.simTimer = null;
      }
    }

    this.persist();
  }
}

export const mockStore = new MockStore();
