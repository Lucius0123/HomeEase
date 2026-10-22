import {
  Category,
  Service,
  Professional,
  Customer,
  Booking,
  Payment,
  Payout,
  Coupon,
  MembershipPlan,
  Ticket,
  Review,
  Banner,
  AuditLog,
  Zone,
  CMSSection,
  NotificationRecord
} from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-salon-women',
    name: 'Salon for Women',
    icon: 'Sparkles',
    banner: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    order: 1,
    active: true,
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow'],
    description: 'Expert wax, facial, manicure & hair treatments at home'
  },
  {
    id: 'cat-mens-grooming',
    name: "Men's Grooming & Hair",
    icon: 'Scissors',
    banner: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    order: 2,
    active: true,
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow'],
    description: 'Haircuts, beard styling, head massage & facials'
  },
  {
    id: 'cat-ac-appliance',
    name: 'AC & Appliance Repair',
    icon: 'Wind',
    banner: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    order: 3,
    active: true,
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow'],
    description: 'AC servicing, gas refill, washing machine & microwave repair'
  },
  {
    id: 'cat-cleaning',
    name: 'Cleaning & Pest Control',
    icon: 'Sparkle',
    banner: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    order: 4,
    active: true,
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow'],
    description: 'Intense bathroom, kitchen, sofa & full home deep cleaning'
  },
  {
    id: 'cat-plumbing-electric',
    name: 'Plumbing & Electrical',
    icon: 'Wrench',
    banner: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
    order: 5,
    active: true,
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow'],
    description: 'Certified electricians and plumbers for repairs & fixtures'
  },
  {
    id: 'cat-painting',
    name: 'Painting & Waterproofing',
    icon: 'Paintbrush',
    banner: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    order: 6,
    active: true,
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow'],
    description: 'Interior & exterior painting with laser consultation'
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-salon-prime',
    categoryId: 'cat-salon-women',
    name: 'Salon Prime: Waxing & Facial Spa',
    description: 'Complete beauty package with Honey Waxing, Glow Facial & Threading.',
    duration: 90,
    basePrice: 1299,
    memberPrice: 1099,
    tiers: [
      { qty: 1, price: 1299 },
      { qty: 2, price: 2399 }
    ],
    inclusions: ['Rica / Honey roll-on waxing (Full arms & legs)', 'Lotus Herbal Radiance Facial', 'Eyebrow & upper lip threading', 'Disposable kit & sanitized setup'],
    exclusions: ['Blow dry styling', 'Bleaching (available as add-on)'],
    addOns: [
      { id: 'add-1', serviceId: 'srv-salon-prime', name: 'Charcoal Detan Pack', price: 299, description: 'Instantly removes sun tan' },
      { id: 'add-2', serviceId: 'srv-salon-prime', name: 'Foot Reflexology Massage (20m)', price: 399, description: 'Relaxing pressure point massage' }
    ],
    rating: 4.88,
    reviewCount: 420,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow']
  },
  {
    id: 'srv-pedi-mani',
    categoryId: 'cat-salon-women',
    name: 'Classic Manicure & Pedicure Combo',
    description: 'Exfoliation, cuticle care, scrub, foot massage and fresh nail paint.',
    duration: 60,
    basePrice: 899,
    memberPrice: 749,
    tiers: [{ qty: 1, price: 899 }],
    inclusions: ['Warm bubble soak', 'Dead skin filing & scrubbing', 'Aroma massage cream', 'OPI nail lacquer'],
    exclusions: ['Gel nail extensions'],
    addOns: [
      { id: 'add-3', serviceId: 'srv-pedi-mani', name: 'French Tip Polish', price: 149, description: 'Classic white french tips' }
    ],
    rating: 4.82,
    reviewCount: 310,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow']
  },
  {
    id: 'srv-men-hair-beard',
    categoryId: 'cat-mens-grooming',
    name: "Men's Classic Haircut + Beard Grooming",
    description: 'Precision haircut with scissors & trimmer, tailored beard shaping, hot towel.',
    duration: 45,
    basePrice: 449,
    memberPrice: 349,
    tiers: [{ qty: 1, price: 449 }],
    inclusions: ['Consultation & custom cut', 'Beard trim & razor finish', 'Aftershave soothing lotion', 'Post-cut neck cleanup'],
    exclusions: ['Hair colour'],
    addOns: [
      { id: 'add-4', serviceId: 'srv-men-hair-beard', name: 'Head Massage with Cooling Oil (15m)', price: 199, description: 'Stress relieving scalp massage' }
    ],
    rating: 4.85,
    reviewCount: 512,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow']
  },
  {
    id: 'srv-ac-deep-clean',
    categoryId: 'cat-ac-appliance',
    name: 'AC Power Jet Foam Service (Split)',
    description: 'High-pressure water pump cleaning, indoor cooling coil foam spray & drain pipe flush.',
    duration: 60,
    basePrice: 599,
    memberPrice: 499,
    tiers: [
      { qty: 1, price: 599 },
      { qty: 2, price: 1099 },
      { qty: 3, price: 1599 }
    ],
    inclusions: ['Water foam jet wash of cooling coils', 'Filter & blower wheel extraction & deep clean', 'Drain tray unclogging', 'Ampere & gas leak check'],
    exclusions: ['Gas refilling', 'Spare part replacement'],
    addOns: [
      { id: 'add-5', serviceId: 'srv-ac-deep-clean', name: 'Outdoor Condenser Power Jet Wash', price: 249, description: 'Boosts cooling efficiency by 25%' },
      { id: 'add-6', serviceId: 'srv-ac-deep-clean', name: 'Anti-bacterial AC Sanitisation Spray', price: 149, description: 'Eliminates mold and odor' }
    ],
    rating: 4.91,
    reviewCount: 940,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow']
  },
  {
    id: 'srv-bath-deep-clean',
    categoryId: 'cat-cleaning',
    name: 'Intense Bathroom Deep Cleaning',
    description: 'Removal of hard water stains, tiles scrubbing, tap descaling, and WC disinfection.',
    duration: 75,
    basePrice: 799,
    memberPrice: 649,
    tiers: [
      { qty: 1, price: 799 },
      { qty: 2, price: 1499 },
      { qty: 3, price: 2099 }
    ],
    inclusions: ['Tile grout machine buffing', 'Chrome tap & shower descaling', 'Mirror & glass streak-free shine', 'Hospital-grade toilet bowl disinfection'],
    exclusions: ['Ceiling repair', 'Exhaust fan rewiring'],
    addOns: [
      { id: 'add-7', serviceId: 'srv-bath-deep-clean', name: 'Drain Deodoriser & Anti-clog Bio treatment', price: 199, description: 'Prevents cockroach breeding' }
    ],
    rating: 4.87,
    reviewCount: 680,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow']
  },
  {
    id: 'srv-kitchen-deep-clean',
    categoryId: 'cat-cleaning',
    name: 'Modular Kitchen Deep Degreasing',
    description: 'Complete degreasing of chimney filters, cabinets, countertop, sink & appliances exterior.',
    duration: 120,
    basePrice: 1499,
    memberPrice: 1299,
    tiers: [{ qty: 1, price: 1499 }],
    inclusions: ['Gas stove & burner degreasing', 'Chimney baffle filter oil strip', 'Exterior cabinet scrub & polish', 'Sink disinfectant wash'],
    exclusions: ['Appliance internal cleaning (oven/microwave internal)'],
    addOns: [
      { id: 'add-8', serviceId: 'srv-kitchen-deep-clean', name: 'Microwave & Oven Interior Steam Clean', price: 349, description: 'Dissolves baked-on grease' }
    ],
    rating: 4.84,
    reviewCount: 390,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow']
  },
  {
    id: 'srv-electric-switch-fan',
    categoryId: 'cat-plumbing-electric',
    name: 'Electrician Visit & Fix (Switch/Fan/Light)',
    description: 'Standard diagnosis and repair of lights, ceiling fans, short circuits or switchboards.',
    duration: 30,
    basePrice: 249,
    memberPrice: 199,
    tiers: [{ qty: 1, price: 249 }],
    inclusions: ['Certified technician inspection', 'Wiring diagnosis', 'Installation or replacement of 1 fixture'],
    exclusions: ['Cost of spare parts (switches, wires, bulbs)'],
    addOns: [
      { id: 'add-9', serviceId: 'srv-electric-switch-fan', name: 'Ceiling Fan Installation', price: 189, description: 'Mounting & balancing with rod check' }
    ],
    rating: 4.89,
    reviewCount: 710,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow']
  },
  {
    id: 'srv-plumber-leak',
    categoryId: 'cat-plumbing-electric',
    name: 'Plumbing Diagnosis & Tap/Pipe Repair',
    description: 'Expert plumber for water leakages, tap cartridge replacement, flush tank issue.',
    duration: 45,
    basePrice: 249,
    memberPrice: 199,
    tiers: [{ qty: 1, price: 249 }],
    inclusions: ['Inspection of inlet/outlet pressure', 'Tap washer/cartridge fitting', 'Teflon sealing'],
    exclusions: ['Underground pipe breaking/tiling'],
    addOns: [
      { id: 'add-10', serviceId: 'srv-plumber-leak', name: 'Flush Tank Repair', price: 249, description: 'Fixing ball-cock & siphon kit' }
    ],
    rating: 4.81,
    reviewCount: 450,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow']
  },
  {
    id: 'srv-room-painting',
    categoryId: 'cat-painting',
    name: 'Express Room Painting (1 Room)',
    description: 'Laser wall measurement, putty repair, primer & 2 coats of premium Royale luxury emulsion.',
    duration: 360,
    basePrice: 4999,
    memberPrice: 4499,
    tiers: [{ qty: 1, price: 4999 }],
    inclusions: ['Furniture masking & floor sheet protection', 'Crack filling with acrylic putty', 'Two finish coats with roller', 'Complete post-job cleanup'],
    exclusions: ['Exterior walls', 'Structural damp proofing'],
    addOns: [
      { id: 'add-11', serviceId: 'srv-room-painting', name: 'Accent Wall Geometric Stencil', price: 999, description: 'Designer metallic finish wall' }
    ],
    rating: 4.93,
    reviewCount: 210,
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    cities: ['Delhi NCR', 'Bengaluru', 'Lucknow']
  }
];

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'pro-101',
    name: 'Pooja Sharma',
    phone: '+91 98112 34501',
    email: 'pooja.sharma@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    skills: ['Salon Prime', 'Facial Spa', 'Waxing', 'Manicure'],
    city: 'Delhi NCR',
    zone: 'South Delhi & Noida',
    rating: 4.92,
    jobsCompleted: 432,
    acceptanceRate: 98,
    kycStatus: 'Active',
    stage: 'Approved',
    online: true,
    lat: 28.5355,
    lng: 77.2410,
    commissionPct: 18,
    joinedDate: '2024-03-12',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-8921-XXXX', fileUrl: '#', status: 'Approved', verifiedAt: '2024-03-12' },
      { type: 'Police Verification', docNumber: 'PV-DL-2024-8891', fileUrl: '#', status: 'Approved', verifiedAt: '2024-03-13' },
      { type: 'Trade Certificate', docNumber: 'LAKME-ACAD-771', fileUrl: '#', status: 'Approved', verifiedAt: '2024-03-14' }
    ]
  },
  {
    id: 'pro-102',
    name: 'Ramesh Verma',
    phone: '+91 98223 45602',
    email: 'ramesh.v@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    skills: ['AC Power Jet', 'Refrigerator Repair', 'Gas Check'],
    city: 'Delhi NCR',
    zone: 'Gurugram Central',
    rating: 4.88,
    jobsCompleted: 618,
    acceptanceRate: 95,
    kycStatus: 'Active',
    stage: 'Approved',
    online: true,
    lat: 28.4595,
    lng: 77.0266,
    commissionPct: 20,
    joinedDate: '2023-11-05',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-4412-XXXX', fileUrl: '#', status: 'Approved', verifiedAt: '2023-11-05' },
      { type: 'Police Verification', docNumber: 'PV-HR-2023-1029', fileUrl: '#', status: 'Approved', verifiedAt: '2023-11-08' }
    ]
  },
  {
    id: 'pro-103',
    name: 'Anil Kumar Gowda',
    phone: '+91 98451 90803',
    email: 'anil.gowda@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    skills: ['Bathroom Deep Clean', 'Kitchen Degreasing', 'Sofa Spa'],
    city: 'Bengaluru',
    zone: 'Indiranagar & Koramangala',
    rating: 4.84,
    jobsCompleted: 340,
    acceptanceRate: 92,
    kycStatus: 'Active',
    stage: 'Approved',
    online: true,
    lat: 12.9716,
    lng: 77.5946,
    commissionPct: 20,
    joinedDate: '2024-01-20',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-3119-XXXX', fileUrl: '#', status: 'Approved', verifiedAt: '2024-01-20' },
      { type: 'Police Verification', docNumber: 'PV-KA-2024-5120', fileUrl: '#', status: 'Approved', verifiedAt: '2024-01-22' }
    ]
  },
  {
    id: 'pro-104',
    name: 'Deepak Shukla',
    phone: '+91 97931 12304',
    email: 'deepak.s@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    skills: ['Electrician Visit', 'Inverter Wiring', 'Plumbing'],
    city: 'Lucknow',
    zone: 'Gomti Nagar & Hazratganj',
    rating: 4.81,
    jobsCompleted: 289,
    acceptanceRate: 94,
    kycStatus: 'Active',
    stage: 'Approved',
    online: true,
    lat: 26.8467,
    lng: 80.9462,
    commissionPct: 18,
    joinedDate: '2024-02-15',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-9901-XXXX', fileUrl: '#', status: 'Approved', verifiedAt: '2024-02-15' }
    ]
  },
  {
    id: 'pro-105',
    name: 'Sunita Chauhan',
    phone: '+91 98108 55405',
    email: 'sunita.c@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    skills: ['Salon Prime', 'Pedicure & Manicure'],
    city: 'Delhi NCR',
    zone: 'West Delhi & Dwarka',
    rating: 4.95,
    jobsCompleted: 580,
    acceptanceRate: 99,
    kycStatus: 'Active',
    stage: 'Approved',
    online: true,
    lat: 28.6139,
    lng: 77.0345,
    commissionPct: 18,
    joinedDate: '2023-08-10',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-7711-XXXX', fileUrl: '#', status: 'Approved', verifiedAt: '2023-08-10' }
    ]
  },
  {
    id: 'pro-106',
    name: 'Mohd. Imran',
    phone: '+91 99182 33406',
    email: 'imran.m@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    skills: ['Classic Haircut', 'Beard Grooming'],
    city: 'Lucknow',
    zone: 'Aliganj & Mahanagar',
    rating: 4.86,
    jobsCompleted: 310,
    acceptanceRate: 91,
    kycStatus: 'Active',
    stage: 'Approved',
    online: false,
    lat: 26.8850,
    lng: 80.9380,
    commissionPct: 20,
    joinedDate: '2024-04-01',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-2289-XXXX', fileUrl: '#', status: 'Approved' }
    ]
  },
  {
    id: 'pro-107',
    name: 'Suresh Reddy',
    phone: '+91 99801 88707',
    email: 'suresh.r@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    skills: ['AC Power Jet', 'Washing Machine Repair'],
    city: 'Bengaluru',
    zone: 'Whitefield & Marathahalli',
    rating: 4.79,
    jobsCompleted: 215,
    acceptanceRate: 88,
    kycStatus: 'Active',
    stage: 'Approved',
    online: true,
    lat: 12.9698,
    lng: 77.7500,
    commissionPct: 20,
    joinedDate: '2024-05-18',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-6621-XXXX', fileUrl: '#', status: 'Approved' }
    ]
  },
  {
    id: 'pro-108',
    name: 'Vikas Pandey',
    phone: '+91 97115 66708',
    email: 'vikas.p@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    skills: ['Room Painting', 'Waterproofing'],
    city: 'Delhi NCR',
    zone: 'South Delhi & Noida',
    rating: 4.89,
    jobsCompleted: 194,
    acceptanceRate: 96,
    kycStatus: 'Active',
    stage: 'Approved',
    online: true,
    lat: 28.5700,
    lng: 77.3200,
    commissionPct: 22,
    joinedDate: '2024-03-01',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-5532-XXXX', fileUrl: '#', status: 'Approved' }
    ]
  },
  {
    id: 'pro-109',
    name: 'Kavita Nair',
    phone: '+91 98450 11209',
    email: 'kavita.nair@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    skills: ['Salon Prime', 'Facial Spa'],
    city: 'Bengaluru',
    zone: 'HSR Layout & Bellandur',
    rating: 4.90,
    jobsCompleted: 48,
    acceptanceRate: 90,
    kycStatus: 'Pending KYC',
    stage: 'Documents submitted',
    online: false,
    lat: 12.9121,
    lng: 77.6446,
    commissionPct: 20,
    joinedDate: '2026-10-10',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-1928-XXXX', fileUrl: '#', status: 'Approved', verifiedAt: '2026-10-12' },
      { type: 'Police Verification', docNumber: 'PV-KA-PENDING', fileUrl: '#', status: 'Pending', notes: 'Verification slip uploaded, waiting for clearance' }
    ]
  },
  {
    id: 'pro-110',
    name: 'Tarun Joshi',
    phone: '+91 99119 88310',
    email: 'tarun.j@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    skills: ['Plumbing', 'Electrician Visit'],
    city: 'Delhi NCR',
    zone: 'North Delhi',
    rating: 3.75,
    jobsCompleted: 82,
    acceptanceRate: 72,
    kycStatus: 'Suspended',
    stage: 'Approved',
    online: false,
    lat: 28.7041,
    lng: 77.1025,
    commissionPct: 25,
    joinedDate: '2024-06-15',
    suspendReason: 'Repeated customer complaints regarding punctuality and overcharging',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-8120-XXXX', fileUrl: '#', status: 'Approved' }
    ]
  },
  {
    id: 'pro-111',
    name: 'Manoj Bajpayee',
    phone: '+91 98200 44111',
    email: 'manoj.b@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    skills: ['Room Painting', 'Putty Finish'],
    city: 'Lucknow',
    zone: 'Gomti Nagar Extension',
    rating: 4.70,
    jobsCompleted: 15,
    acceptanceRate: 85,
    kycStatus: 'Pending KYC',
    stage: 'Verification',
    online: false,
    lat: 26.8380,
    lng: 81.0100,
    commissionPct: 20,
    joinedDate: '2026-10-15',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-3390-XXXX', fileUrl: '#', status: 'Approved' },
      { type: 'Trade Certificate', docNumber: 'ASIAN-PAINTS-CERT', fileUrl: '#', status: 'Pending' }
    ]
  },
  {
    id: 'pro-112',
    name: 'Priyanka Das',
    phone: '+91 98711 99212',
    email: 'priyanka.d@partners.homease.in',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    skills: ['Salon Prime', 'Pedicure & Manicure'],
    city: 'Delhi NCR',
    zone: 'Central Delhi',
    rating: 4.96,
    jobsCompleted: 740,
    acceptanceRate: 100,
    kycStatus: 'Active',
    stage: 'Approved',
    online: true,
    lat: 28.6280,
    lng: 77.2180,
    commissionPct: 16,
    joinedDate: '2023-04-10',
    documents: [
      { type: 'ID Proof', docNumber: 'AADHAAR-1290-XXXX', fileUrl: '#', status: 'Approved' }
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-201',
    name: 'Aanya Kapoor',
    phone: '+91 98111 22301',
    email: 'aanya.kapoor@gmail.com',
    city: 'Delhi NCR',
    addresses: [
      { tag: 'Home', line: 'B-4/12, Safdarjung Enclave', city: 'Delhi NCR' },
      { tag: 'Work', line: 'DLF Cybercity Tower C, Gurugram', city: 'Delhi NCR' }
    ],
    walletBalance: 450,
    membershipId: 'mem-plus-annual',
    isBlocked: false,
    joinedDate: '2024-01-15',
    bookingsCount: 14,
    lifetimeValue: 18450,
    notes: ['Prefers morning slots before 10 AM', 'Requested eco-friendly cleaning agents']
  },
  {
    id: 'cust-202',
    name: 'Rohan Mehra',
    phone: '+91 98450 77402',
    email: 'rohan.mehra@techcorp.io',
    city: 'Bengaluru',
    addresses: [
      { tag: 'Home', line: 'Villa 42, Prestige Palms, Whitefield', city: 'Bengaluru' }
    ],
    walletBalance: 120,
    membershipId: 'mem-plus-monthly',
    isBlocked: false,
    joinedDate: '2024-03-22',
    bookingsCount: 8,
    lifetimeValue: 9890,
    notes: ['Has 2 pet dogs, inform partner beforehand']
  },
  {
    id: 'cust-203',
    name: 'Dr. Shalini Singh',
    phone: '+91 97930 44503',
    email: 'dr.shalini.s@apollohospitals.com',
    city: 'Lucknow',
    addresses: [
      { tag: 'Home', line: '14/B, Park Road, Hazratganj', city: 'Lucknow' }
    ],
    walletBalance: 0,
    membershipId: undefined,
    isBlocked: false,
    joinedDate: '2024-05-10',
    bookingsCount: 5,
    lifetimeValue: 5600,
    notes: []
  },
  {
    id: 'cust-204',
    name: 'Vikramaditya Roy',
    phone: '+91 98109 99404',
    email: 'v.roy@consulting.com',
    city: 'Delhi NCR',
    addresses: [
      { tag: 'Home', line: 'Apt 902, Magnolias, Golf Course Road, Gurugram', city: 'Delhi NCR' }
    ],
    walletBalance: 800,
    membershipId: 'mem-plus-annual',
    isBlocked: false,
    joinedDate: '2023-11-01',
    bookingsCount: 22,
    lifetimeValue: 34200,
    notes: ['VIP Customer - Auto assign top rated pros']
  },
  {
    id: 'cust-205',
    name: 'Neha Saxena',
    phone: '+91 98201 11305',
    email: 'neha.saxena@outlook.com',
    city: 'Lucknow',
    addresses: [
      { tag: 'Home', line: 'Flat 304, Rohtas Enclave, Gomti Nagar', city: 'Lucknow' }
    ],
    walletBalance: 50,
    membershipId: undefined,
    isBlocked: false,
    joinedDate: '2024-08-12',
    bookingsCount: 3,
    lifetimeValue: 2840,
    notes: []
  },
  {
    id: 'cust-206',
    name: 'Kartik Iyer',
    phone: '+91 98452 33406',
    email: 'kartik.iyer@fintech.co',
    city: 'Bengaluru',
    addresses: [
      { tag: 'Home', line: '77, 4th Cross, 12th Main, HAL 2nd Stage, Indiranagar', city: 'Bengaluru' }
    ],
    walletBalance: 0,
    membershipId: 'mem-plus-monthly',
    isBlocked: false,
    joinedDate: '2024-06-04',
    bookingsCount: 7,
    lifetimeValue: 8120,
    notes: []
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-9801',
    customerId: 'cust-201',
    customerName: 'Aanya Kapoor',
    customerPhone: '+91 98111 22301',
    professionalId: 'pro-101',
    professionalName: 'Pooja Sharma',
    professionalPhone: '+91 98112 34501',
    professionalRating: 4.92,
    serviceId: 'srv-salon-prime',
    serviceName: 'Salon Prime: Waxing & Facial Spa',
    categoryName: 'Salon for Women',
    items: [
      { name: 'Salon Prime Package', price: 1299, qty: 1 },
      { name: 'Charcoal Detan Pack', price: 299, qty: 1 }
    ],
    slotDate: '2026-10-22',
    slotTime: '02:00 PM - 03:30 PM',
    address: 'B-4/12, Safdarjung Enclave, New Delhi',
    city: 'Delhi NCR',
    lat: 28.5680,
    lng: 77.2000,
    status: 'In progress',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-22 11:30 AM', note: 'Booking confirmed via app' },
      { status: 'Confirmed', timestamp: '2026-10-22 11:32 AM', note: 'Assigned to Pooja Sharma' },
      { status: 'On the way', timestamp: '2026-10-22 01:25 PM', note: 'Partner departed from Malviya Nagar' },
      { status: 'Arrived', timestamp: '2026-10-22 01:52 PM', note: 'Partner arrived at customer gate' },
      { status: 'In progress', timestamp: '2026-10-22 02:05 PM', note: 'OTP verified (4819). Service started' }
    ],
    subtotal: 1598,
    discount: 200,
    tax: 251.64,
    platformFee: 49,
    total: 1698.64,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    createdAt: '2026-10-22 11:30 AM',
    internalNotes: [
      { author: 'Ops Bot', time: '11:32 AM', text: 'Auto-assigned based on 4.92 rating and proximity (3.2 km).' }
    ]
  },
  {
    id: 'BK-9802',
    customerId: 'cust-202',
    customerName: 'Rohan Mehra',
    customerPhone: '+91 98450 77402',
    professionalId: 'pro-103',
    professionalName: 'Anil Kumar Gowda',
    professionalPhone: '+91 98451 90803',
    professionalRating: 4.84,
    serviceId: 'srv-bath-deep-clean',
    serviceName: 'Intense Bathroom Deep Cleaning',
    categoryName: 'Cleaning & Pest Control',
    items: [
      { name: 'Bathroom Deep Clean (2 Bathrooms)', price: 1499, qty: 1 }
    ],
    slotDate: '2026-10-22',
    slotTime: '03:30 PM - 05:00 PM',
    address: 'Villa 42, Prestige Palms, Whitefield, Bengaluru',
    city: 'Bengaluru',
    lat: 12.9698,
    lng: 77.7500,
    status: 'On the way',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-22 12:10 PM' },
      { status: 'Confirmed', timestamp: '2026-10-22 12:15 PM' },
      { status: 'On the way', timestamp: '2026-10-22 02:45 PM', note: 'En route, ETA 28 mins' }
    ],
    subtotal: 1499,
    discount: 150,
    tax: 242.82,
    platformFee: 49,
    total: 1640.82,
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    createdAt: '2026-10-22 12:10 PM',
    internalNotes: []
  },
  {
    id: 'BK-9803',
    customerId: 'cust-203',
    customerName: 'Dr. Shalini Singh',
    customerPhone: '+91 97930 44503',
    serviceId: 'srv-ac-deep-clean',
    serviceName: 'AC Power Jet Foam Service (Split)',
    categoryName: 'AC & Appliance Repair',
    items: [
      { name: 'AC Power Jet Wash (1 Unit)', price: 599, qty: 1 }
    ],
    slotDate: '2026-10-22',
    slotTime: '04:00 PM - 05:00 PM',
    address: '14/B, Park Road, Hazratganj, Lucknow',
    city: 'Lucknow',
    lat: 26.8500,
    lng: 80.9400,
    status: 'Requested',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-22 01:10 PM', note: 'Customer waiting for assignment' }
    ],
    subtotal: 599,
    discount: 0,
    tax: 107.82,
    platformFee: 49,
    total: 755.82,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    createdAt: '2026-10-22 01:10 PM',
    internalNotes: [
      { author: 'Ops System', time: '01:10 PM', text: 'Unassigned alert raised. Available pros in Lucknow: 2.' }
    ]
  },
  {
    id: 'BK-9804',
    customerId: 'cust-204',
    customerName: 'Vikramaditya Roy',
    customerPhone: '+91 98109 99404',
    professionalId: 'pro-102',
    professionalName: 'Ramesh Verma',
    professionalPhone: '+91 98223 45602',
    professionalRating: 4.88,
    serviceId: 'srv-ac-deep-clean',
    serviceName: 'AC Power Jet Foam Service (Split)',
    categoryName: 'AC & Appliance Repair',
    items: [
      { name: 'AC Power Jet Foam Service (2 Units)', price: 1099, qty: 1 },
      { name: 'Outdoor Condenser Jet Wash', price: 249, qty: 2 }
    ],
    slotDate: '2026-10-22',
    slotTime: '10:00 AM - 11:30 AM',
    address: 'Apt 902, Magnolias, Golf Course Road, Gurugram',
    city: 'Delhi NCR',
    lat: 28.4600,
    lng: 77.0900,
    status: 'Completed',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-21 07:00 PM' },
      { status: 'Confirmed', timestamp: '2026-10-21 07:02 PM' },
      { status: 'On the way', timestamp: '2026-10-22 09:30 AM' },
      { status: 'Arrived', timestamp: '2026-10-22 09:50 AM' },
      { status: 'In progress', timestamp: '2026-10-22 10:02 AM' },
      { status: 'Completed', timestamp: '2026-10-22 11:28 AM', note: 'Customer rated 5.0' },
      { status: 'Reviewed', timestamp: '2026-10-22 11:35 AM' }
    ],
    subtotal: 1597,
    discount: 300,
    tax: 233.46,
    platformFee: 49,
    total: 1579.46,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    createdAt: '2026-10-21 07:00 PM',
    internalNotes: []
  },
  {
    id: 'BK-9805',
    customerId: 'cust-205',
    customerName: 'Neha Saxena',
    customerPhone: '+91 98201 11305',
    professionalId: 'pro-106',
    professionalName: 'Mohd. Imran',
    professionalPhone: '+91 99182 33406',
    professionalRating: 4.86,
    serviceId: 'srv-men-hair-beard',
    serviceName: "Men's Classic Haircut + Beard Grooming",
    categoryName: "Men's Grooming & Hair",
    items: [
      { name: 'Haircut + Beard Styling', price: 449, qty: 1 }
    ],
    slotDate: '2026-10-22',
    slotTime: '05:00 PM - 06:00 PM',
    address: 'Flat 304, Rohtas Enclave, Gomti Nagar, Lucknow',
    city: 'Lucknow',
    lat: 26.8520,
    lng: 81.0020,
    status: 'Confirmed',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-22 11:00 AM' },
      { status: 'Confirmed', timestamp: '2026-10-22 11:05 AM', note: 'Partner accepted slot' }
    ],
    subtotal: 449,
    discount: 0,
    tax: 80.82,
    platformFee: 49,
    total: 578.82,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    createdAt: '2026-10-22 11:00 AM',
    internalNotes: []
  },
  {
    id: 'BK-9806',
    customerId: 'cust-206',
    customerName: 'Kartik Iyer',
    customerPhone: '+91 98452 33406',
    professionalId: 'pro-107',
    professionalName: 'Suresh Reddy',
    professionalPhone: '+91 99801 88707',
    professionalRating: 4.79,
    serviceId: 'srv-kitchen-deep-clean',
    serviceName: 'Modular Kitchen Deep Degreasing',
    categoryName: 'Cleaning & Pest Control',
    items: [
      { name: 'Kitchen Deep Clean', price: 1499, qty: 1 }
    ],
    slotDate: '2026-10-22',
    slotTime: '01:00 PM - 03:00 PM',
    address: '77, 4th Cross, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru',
    city: 'Bengaluru',
    lat: 12.9780,
    lng: 77.6400,
    status: 'Arrived',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-22 09:15 AM' },
      { status: 'Confirmed', timestamp: '2026-10-22 09:20 AM' },
      { status: 'On the way', timestamp: '2026-10-22 12:15 PM' },
      { status: 'Arrived', timestamp: '2026-10-22 12:55 PM', note: 'Awaiting customer door open' }
    ],
    subtotal: 1499,
    discount: 150,
    tax: 242.82,
    platformFee: 49,
    total: 1640.82,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    createdAt: '2026-10-22 09:15 AM',
    internalNotes: []
  },
  {
    id: 'BK-9807',
    customerId: 'cust-201',
    customerName: 'Aanya Kapoor',
    customerPhone: '+91 98111 22301',
    serviceId: 'srv-electric-switch-fan',
    serviceName: 'Electrician Visit & Fix (Switch/Fan/Light)',
    categoryName: 'Plumbing & Electrical',
    items: [
      { name: 'Electrician Inspection', price: 249, qty: 1 }
    ],
    slotDate: '2026-10-21',
    slotTime: '06:00 PM - 07:00 PM',
    address: 'B-4/12, Safdarjung Enclave, New Delhi',
    city: 'Delhi NCR',
    lat: 28.5680,
    lng: 77.2000,
    status: 'Cancelled',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-21 04:00 PM' },
      { status: 'Cancelled', timestamp: '2026-10-21 05:15 PM', note: 'Customer cancelled: emergency travel' },
      { status: 'Refunded', timestamp: '2026-10-21 05:30 PM', note: 'Full refund of ₹342.82 issued to UPI' }
    ],
    subtotal: 249,
    discount: 0,
    tax: 44.82,
    platformFee: 49,
    total: 342.82,
    paymentStatus: 'Refunded',
    paymentMethod: 'UPI',
    createdAt: '2026-10-21 04:00 PM',
    cancelReason: 'Customer requested cancellation before partner dispatch',
    internalNotes: []
  },
  {
    id: 'BK-9808',
    customerId: 'cust-202',
    customerName: 'Rohan Mehra',
    customerPhone: '+91 98450 77402',
    professionalId: 'pro-108',
    professionalName: 'Vikas Pandey',
    professionalPhone: '+91 97115 66708',
    professionalRating: 4.89,
    serviceId: 'srv-room-painting',
    serviceName: 'Express Room Painting (1 Room)',
    categoryName: 'Painting & Waterproofing',
    items: [
      { name: 'Room Painting Luxury Emulsion', price: 4999, qty: 1 }
    ],
    slotDate: '2026-10-20',
    slotTime: '09:00 AM - 04:00 PM',
    address: 'Villa 42, Prestige Palms, Whitefield, Bengaluru',
    city: 'Bengaluru',
    lat: 12.9698,
    lng: 77.7500,
    status: 'Completed',
    timeline: [
      { status: 'Requested', timestamp: '2026-10-19 02:00 PM' },
      { status: 'Confirmed', timestamp: '2026-10-19 02:30 PM' },
      { status: 'On the way', timestamp: '2026-10-20 08:30 AM' },
      { status: 'Arrived', timestamp: '2026-10-20 08:50 AM' },
      { status: 'In progress', timestamp: '2026-10-20 09:10 AM' },
      { status: 'Completed', timestamp: '2026-10-20 03:45 PM' }
    ],
    subtotal: 4999,
    discount: 500,
    tax: 809.82,
    platformFee: 49,
    total: 5357.82,
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    createdAt: '2026-10-19 02:00 PM',
    internalNotes: []
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'PAY-7701',
    bookingId: 'BK-9801',
    customerName: 'Aanya Kapoor',
    method: 'UPI',
    amount: 1698.64,
    status: 'Success',
    createdAt: '2026-10-22 11:30 AM'
  },
  {
    id: 'PAY-7702',
    bookingId: 'BK-9802',
    customerName: 'Rohan Mehra',
    method: 'Card',
    amount: 1640.82,
    status: 'Success',
    createdAt: '2026-10-22 12:10 PM'
  },
  {
    id: 'PAY-7703',
    bookingId: 'BK-9803',
    customerName: 'Dr. Shalini Singh',
    method: 'UPI',
    amount: 755.82,
    status: 'Success',
    createdAt: '2026-10-22 01:10 PM'
  },
  {
    id: 'PAY-7704',
    bookingId: 'BK-9804',
    customerName: 'Vikramaditya Roy',
    method: 'UPI',
    amount: 1579.46,
    status: 'Success',
    createdAt: '2026-10-21 07:00 PM'
  },
  {
    id: 'PAY-7705',
    bookingId: 'BK-9807',
    customerName: 'Aanya Kapoor',
    method: 'UPI',
    amount: 342.82,
    status: 'Refunded',
    createdAt: '2026-10-21 04:00 PM',
    refundReason: 'Customer cancellation before dispatch'
  }
];

export const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'PO-2026-W42-01',
    professionalId: 'pro-101',
    professionalName: 'Pooja Sharma',
    period: 'Oct 14 – Oct 20, 2026',
    gross: 24800,
    commission: 4464, // 18%
    net: 20336,
    status: 'Approved',
    accountNo: 'HDFC-XXXX-8910',
    paidAt: undefined
  },
  {
    id: 'PO-2026-W42-02',
    professionalId: 'pro-102',
    professionalName: 'Ramesh Verma',
    period: 'Oct 14 – Oct 20, 2026',
    gross: 31200,
    commission: 6240, // 20%
    net: 24960,
    status: 'Paid',
    accountNo: 'SBI-XXXX-4421',
    paidAt: '2026-10-21'
  },
  {
    id: 'PO-2026-W42-03',
    professionalId: 'pro-103',
    professionalName: 'Anil Kumar Gowda',
    period: 'Oct 14 – Oct 20, 2026',
    gross: 18900,
    commission: 3780, // 20%
    net: 15120,
    status: 'Approved',
    accountNo: 'ICICI-XXXX-7123'
  },
  {
    id: 'PO-2026-W42-04',
    professionalId: 'pro-104',
    professionalName: 'Deepak Shukla',
    period: 'Oct 14 – Oct 20, 2026',
    gross: 14200,
    commission: 2556, // 18%
    net: 11644,
    status: 'Pending',
    accountNo: 'PNB-XXXX-0091'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-diwali20',
    code: 'FESTIVE20',
    type: 'percent',
    value: 20,
    cap: 400,
    minCart: 999,
    validTo: '2026-11-15',
    usageLimit: 2500,
    usedCount: 1420,
    newUserOnly: false,
    active: true,
    categories: ['cat-salon-women', 'cat-cleaning', 'cat-painting']
  },
  {
    id: 'cpn-welcome',
    code: 'WELCOME150',
    type: 'flat',
    value: 150,
    cap: 150,
    minCart: 499,
    validTo: '2026-12-31',
    usageLimit: 10000,
    usedCount: 4890,
    newUserOnly: true,
    active: true,
    categories: []
  },
  {
    id: 'cpn-acsummer',
    code: 'COOLAIR',
    type: 'percent',
    value: 15,
    cap: 250,
    minCart: 599,
    validTo: '2026-10-31',
    usageLimit: 1500,
    usedCount: 1105,
    newUserOnly: false,
    active: true,
    categories: ['cat-ac-appliance']
  }
];

export const INITIAL_MEMBERSHIPS: MembershipPlan[] = [
  {
    id: 'mem-plus-monthly',
    name: 'HomeEase Plus (Monthly)',
    price: 299,
    duration: '1 Month',
    benefits: [
      'Flat 15% discount on all salon & cleaning services',
      'Guaranteed priority slots during peak hours',
      'Zero cancellation charges up to 2 hours prior',
      'Free upgrade to premium sanitized consumables'
    ],
    subscriberCount: 2840,
    active: true
  },
  {
    id: 'mem-plus-annual',
    name: 'HomeEase Plus VIP (Annual)',
    price: 1499,
    duration: '12 Months',
    benefits: [
      'Flat 20% discount on all catalog services',
      'Dedicated operations concierge hotline',
      '4 Free AC power jet foam services per year',
      'Complimentary damage protection warranty up to ₹25,000'
    ],
    subscriberCount: 5120,
    active: true
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TCK-401',
    bookingId: 'BK-9801',
    customerId: 'cust-201',
    customerName: 'Aanya Kapoor',
    subject: 'Request to add nail art to ongoing salon service',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-10-22 02:15 PM',
    slaMinutesRemaining: 22,
    messages: [
      { sender: 'customer', text: 'Hi! Pooja is at my home right now doing the facial. Can I add French gel tips nail art directly through the app?', timestamp: '02:15 PM' },
      { sender: 'agent', text: 'Hello Aanya! Yes, we can add this add-on to your active booking. The professional will receive the updated work order on her phone.', timestamp: '02:18 PM' }
    ]
  },
  {
    id: 'TCK-402',
    bookingId: 'BK-9807',
    customerId: 'cust-201',
    customerName: 'Aanya Kapoor',
    subject: 'Refund status inquiry for cancelled electrician booking',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-10-21 05:40 PM',
    slaMinutesRemaining: 0,
    messages: [
      { sender: 'customer', text: 'When will the refund reflect in my Google Pay account?', timestamp: '05:40 PM' },
      { sender: 'agent', text: 'The refund of ₹342.82 has been successfully settled with ARN: REF-881920. It usually credits within 24 hours.', timestamp: '05:48 PM' },
      { sender: 'customer', text: 'Received it! Thank you.', timestamp: '06:05 PM' }
    ],
    disputeResolution: { action: 'refund', notes: 'Instant UPI credit reversal completed.' }
  },
  {
    id: 'TCK-403',
    bookingId: 'BK-9803',
    customerId: 'cust-203',
    customerName: 'Dr. Shalini Singh',
    subject: 'Slot delayed - no partner assigned yet for 4 PM',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-10-22 01:45 PM',
    slaMinutesRemaining: 8,
    messages: [
      { sender: 'customer', text: 'My slot is at 4:00 PM and the app shows unassigned. Please ensure the technician arrives on time as I have clinic duty later.', timestamp: '01:45 PM' }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-501',
    bookingId: 'BK-9804',
    serviceName: 'AC Power Jet Foam Service (Split)',
    professionalId: 'pro-102',
    professionalName: 'Ramesh Verma',
    customerName: 'Vikramaditya Roy',
    rating: 5,
    tags: ['Punctual', 'Spotless cleanup', 'Super polite'],
    comment: 'Ramesh did an extraordinary job! The cooling has doubled instantly. He cleaned every drop of water before leaving. Truly 5 star service.',
    flagged: false,
    createdAt: '2026-10-22 11:35 AM',
    status: 'Published'
  },
  {
    id: 'rev-502',
    bookingId: 'BK-9755',
    serviceName: 'Bathroom Deep Cleaning',
    professionalId: 'pro-110',
    professionalName: 'Tarun Joshi',
    customerName: 'Sanjay Dutt',
    rating: 2,
    tags: ['Arrived late', 'Rushed job'],
    comment: 'Technician reached 40 minutes late and tried to rush through the cleaning. Grout stains are still visible in the master bath.',
    flagged: true,
    createdAt: '2026-10-21 04:20 PM',
    status: 'Published'
  },
  {
    id: 'rev-503',
    bookingId: 'BK-9760',
    serviceName: 'Salon Prime: Waxing & Facial Spa',
    professionalId: 'pro-101',
    professionalName: 'Pooja Sharma',
    customerName: 'Pooja Bhatt',
    rating: 5,
    tags: ['Very hygienic', 'Expert technique'],
    comment: 'Pooja is the absolute best beautician on HomeEase. Extremely gentle waxing and the glow after the facial is unreal!',
    flagged: false,
    createdAt: '2026-10-20 06:10 PM',
    status: 'Published'
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    title: 'Festive Home Glow',
    subtitle: 'Flat 25% off on Salon Spa & Deep Cleaning',
    deepLink: 'homease://category/cat-salon-women',
    order: 1,
    startsAt: '2026-10-01',
    endsAt: '2026-11-15',
    active: true
  },
  {
    id: 'ban-2',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    title: 'Post-Monsoon AC Care',
    subtitle: 'Power Jet Foam Wash starting at ₹599',
    deepLink: 'homease://category/cat-ac-appliance',
    order: 2,
    startsAt: '2026-10-10',
    endsAt: '2026-11-30',
    active: true
  },
  {
    id: 'ban-3',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
    title: 'Festival Wall Makeover',
    subtitle: 'Express 1-day luxury room painting',
    deepLink: 'homease://category/cat-painting',
    order: 3,
    startsAt: '2026-10-05',
    endsAt: '2026-11-10',
    active: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-901',
    adminName: 'Raj Chaurasiya',
    role: 'Super Admin',
    action: 'Commission Override',
    target: 'pro-101 (Pooja Sharma)',
    timestamp: '2026-10-22 10:15 AM',
    details: 'Commission reduced from 20% to 18% for Star Performer incentive.'
  },
  {
    id: 'aud-902',
    adminName: 'Sarah Jenkins',
    role: 'Operations Manager',
    action: 'Manual Reassignment',
    target: 'BK-9801',
    timestamp: '2026-10-22 11:32 AM',
    details: 'Reassigned from pro-105 to pro-101 based on ETA.'
  },
  {
    id: 'aud-903',
    adminName: 'Aman Mathur',
    role: 'Finance',
    action: 'Payout Approval',
    target: 'PO-2026-W42-01 & 03',
    timestamp: '2026-10-21 04:30 PM',
    details: 'Approved weekly cycle disbursements totaling ₹35,456.'
  },
  {
    id: 'aud-904',
    adminName: 'Raj Chaurasiya',
    role: 'Super Admin',
    action: 'Professional Suspension',
    target: 'pro-110 (Tarun Joshi)',
    timestamp: '2026-10-21 05:00 PM',
    details: 'Suspended partner account due to rating drop below 3.8 and multiple customer disputes.'
  }
];

export const INITIAL_ZONES: Zone[] = [
  { id: 'zn-delhi-south', city: 'Delhi NCR', name: 'South Delhi & Noida Express', surgeActive: true, capacityMultiplier: 1.2, activePros: 16 },
  { id: 'zn-delhi-gurgaon', city: 'Delhi NCR', name: 'Gurugram Cyber & Golf Course', surgeActive: false, capacityMultiplier: 1.0, activePros: 14 },
  { id: 'zn-blr-central', city: 'Bengaluru', name: 'Indiranagar & Koramangala Hub', surgeActive: true, capacityMultiplier: 1.25, activePros: 18 },
  { id: 'zn-blr-east', city: 'Bengaluru', name: 'Whitefield & Outer Ring Road', surgeActive: false, capacityMultiplier: 1.0, activePros: 12 },
  { id: 'zn-lko-central', city: 'Lucknow', name: 'Hazratganj & Gomti Nagar', surgeActive: false, capacityMultiplier: 1.0, activePros: 10 }
];

export const INITIAL_CMS_SECTIONS: CMSSection[] = [
  { id: 'sec-banner', type: 'banner', title: 'Hero Carousel Banners', order: 1, visible: true },
  { id: 'sec-cats', type: 'categories', title: 'Top Marketplace Categories', order: 2, visible: true },
  { id: 'sec-promo', type: 'promo', title: 'HomeEase Plus Privilege Strip', order: 3, visible: true },
  { id: 'sec-popular', type: 'popular', title: 'Most Booked Services This Week', order: 4, visible: true },
  { id: 'sec-reviews', type: 'testimonials', title: 'Customer Love & Verified Reviews', order: 5, visible: true }
];

export const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-1',
    title: 'Diwali Home Cleaning Blitz ✨',
    message: 'Book full bathroom or kitchen deep clean today & get flat ₹300 off!',
    target: 'All Customers',
    channel: 'Push',
    sentAt: '2026-10-21 10:00 AM',
    sentCount: 18450,
    openRate: '34.2%'
  },
  {
    id: 'notif-2',
    title: 'Reminder: Scheduled AC Servicing',
    message: 'Technician will arrive in your slot today. Track live in the HomeEase app.',
    target: 'All Customers',
    channel: 'SMS',
    sentAt: '2026-10-22 08:30 AM',
    sentCount: 124,
    openRate: '98.5%'
  }
];
