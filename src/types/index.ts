// Types for HomeEase Web Admin Dashboard

export type Role = 'Super Admin' | 'Operations Manager' | 'Support Agent' | 'Finance' | 'Marketing';

export type BookingStatus = 
  | 'Requested' 
  | 'Confirmed' 
  | 'On the way' 
  | 'Arrived' 
  | 'In progress' 
  | 'Completed' 
  | 'Reviewed' 
  | 'Rescheduled' 
  | 'Cancelled' 
  | 'Refunded';

export type PaymentStatus = 'Success' | 'Paid' | 'Pending' | 'Refunded' | 'Failed';
export type PaymentMethod = 'UPI' | 'Card' | 'Wallet' | 'Cash';

export interface Category {
  id: string;
  name: string;
  icon: string;
  banner: string;
  order: number;
  active: boolean;
  cities: string[];
  description: string;
}

export interface ServiceTier {
  qty: number;
  price: number;
}

export interface AddOn {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  description: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  duration: number; // minutes
  basePrice: number;
  memberPrice: number;
  tiers: ServiceTier[];
  inclusions: string[];
  exclusions: string[];
  addOns: AddOn[];
  rating: number;
  reviewCount: number;
  published: boolean;
  imageUrl: string;
  cities: string[];
}

export interface DocumentVerification {
  type: 'ID Proof' | 'Address Proof' | 'Police Verification' | 'Trade Certificate';
  docNumber: string;
  fileUrl: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  notes?: string;
  verifiedAt?: string;
}

export interface Professional {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  skills: string[];
  city: string;
  zone: string;
  rating: number;
  jobsCompleted: number;
  acceptanceRate: number; // percentage
  kycStatus: 'Active' | 'Pending KYC' | 'Suspended';
  stage: 'Applied' | 'Documents submitted' | 'Verification' | 'Training' | 'Approved';
  online: boolean;
  currentJobId?: string;
  lat: number;
  lng: number;
  commissionPct: number;
  joinedDate: string;
  documents: DocumentVerification[];
  suspendReason?: string;
}

export interface CustomerAddress {
  tag: 'Home' | 'Work' | 'Other';
  line: string;
  city: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  addresses: CustomerAddress[];
  walletBalance: number;
  membershipId?: string;
  isBlocked: boolean;
  joinedDate: string;
  bookingsCount: number;
  lifetimeValue: number;
  notes: string[];
}

export interface BookingItem {
  name: string;
  price: number;
  qty: number;
}

export interface TimelineEntry {
  status: BookingStatus;
  timestamp: string;
  note?: string;
}

export interface InternalNote {
  author: string;
  time: string;
  text: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  professionalId?: string;
  professionalName?: string;
  professionalPhone?: string;
  professionalRating?: number;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  items: BookingItem[];
  slotDate: string;
  slotTime: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  status: BookingStatus;
  timeline: TimelineEntry[];
  subtotal: number;
  discount: number;
  tax: number;
  platformFee: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  internalNotes: InternalNote[];
  rescheduleSlot?: string;
  cancelReason?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  refundReason?: string;
}

export interface Payout {
  id: string;
  professionalId: string;
  professionalName: string;
  period: string;
  gross: number;
  commission: number;
  net: number;
  status: 'Pending' | 'Approved' | 'Paid';
  accountNo: string;
  paidAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'flat';
  value: number;
  cap: number;
  minCart: number;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  newUserOnly: boolean;
  active: boolean;
  categories: string[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  benefits: string[];
  subscriberCount: number;
  active: boolean;
}

export interface TicketMessage {
  sender: 'customer' | 'agent' | 'system';
  text: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  bookingId?: string;
  customerId: string;
  customerName: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  slaMinutesRemaining: number;
  messages: TicketMessage[];
  disputeResolution?: {
    action: 'refund' | 'redo' | 'penalize' | 'none';
    notes: string;
  };
}

export interface Review {
  id: string;
  bookingId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  customerName: string;
  rating: number;
  tags: string[];
  comment: string;
  flagged: boolean;
  createdAt: string;
  status: 'Published' | 'Hidden';
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  deepLink: string;
  order: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  adminName: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface Zone {
  id: string;
  city: string;
  name: string;
  surgeActive: boolean;
  capacityMultiplier: number;
  activePros: number;
}

export interface SlotCapacity {
  day: string;
  hour: string;
  capacity: number;
  booked: number;
  surge: boolean;
}

export interface CMSSection {
  id: string;
  type: 'banner' | 'categories' | 'promo' | 'popular' | 'testimonials';
  title: string;
  order: number;
  visible: boolean;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  target: 'All Customers' | 'Inactive (30d)' | 'HomeEase Plus' | 'All Pros';
  channel: 'Push' | 'SMS';
  sentAt: string;
  sentCount: number;
  openRate: string;
}
