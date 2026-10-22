# Web Admin Dashboard – Design & Prototype Specification

*Home-services marketplace (Urban Company–style) · Working brand name: **HomeEase** (replace with the client’s brand) · Prepared 22 Oct 2026 · Companion document: Customer Mobile App (Flutter)*

## 1. How to use this document

- **Goal:** build a clickable, fully working prototype of the web admin dashboard for the client demo. Every screen below lists layout, components, data, actions and states, so nothing has to be guessed while building.
- **No real backend needed.** Use one shared mock API (the same one the Flutter app uses) so a booking made in the app appears live in the dashboard, and an action in the dashboard updates the app.
- **Scope:** Super Admin / Operations web panel. The professional (partner) mobile app is out of scope for the demo; the dashboard includes a **Partner Simulator** so assignment, arrival and completion can be shown without a second app.
- **Priority tags:** **P0** = must be in the demo, **P1** = should be, **P2** = optional.

## 2. Research summary

### 2.1 What Urban Company–style platforms do

- **Three parts, not one:** a customer app, a professional app and a back office that controls quality. The back office is what this dashboard represents.
- **Auto-assignment instead of browsing:** the customer picks a service and a time slot, and the platform assigns the best available professional. So the dashboard needs slot capacity, assignment rules and a manual override.
- **Trust and transparency drive conversion:** verified professionals, pre-approved prices, in-app payment and tracking. A published checkout redesign for Urban Company was explicitly aimed at faster checkout and more trust.
- **Revenue levers:** commission per booking plus memberships (a third-party product teardown reports Urban Company Plus at over 1 million subscribers, roughly a fifth of the user base). The dashboard therefore needs commission settings, plans and coupons.
- **Brand language:** Urban Company states it kept its logo black and white deliberately, for simplicity. Its designers’ public work leans on flat, clean icon sets, illustrated empty states, and wallet/membership cards. Lesson: a calm, neutral canvas lets service imagery and one accent colour do the talking.

### 2.2 UI style trends relevant in 2026

| Style | 2026 status | Works well for | Fails at | Decision |
| --- | --- | --- | --- | --- |
| Glassmorphism (frosted, blurred, translucent) | Rising, helped by Apple’s Liquid Glass | Sticky headers, floating panels, short-label cards | Long body text, unpredictable contrast | **Use selectively** |
| Liquid Glass (Apple) | System material on Apple platforms; refracts and reacts to motion | Native-feeling navigation on iOS | Cannot be fully reproduced on the web | **Approximate lightly** |
| Claymorphism (soft, inflated 3D) | Stable niche | Onboarding, friendly icons, fintech accents | Dense forms and data tables | **Accents only** (icons, empty states, KPI badges) |
| Neumorphism (soft extruded) | Declining | Subtle texture inside a larger system | Low contrast, unclear clickable areas | **Avoid for controls** |
| Flat / clean UI | Evergreen | Dense data and tables | Can feel plain | **Base layer** |
| Aurora / mesh gradients | Popular | Depth behind glass panels | Can distract if overused | **Backdrops only** |

**Decision:** *Clean base + selective glass + clay accents.* Glass is used where users navigate (top bar, drawers, floating toolbars), never where they read dense data (tables, forms).

## 3. Design direction: “Calm Premium”

**Principles**

1. Opaque where people read, glass where people navigate.
2. One accent colour (Electric Violet) does the work; amber is reserved for ratings and highlights.
3. Data first: tables, charts and forms always sit on solid surfaces.
4. Depth comes from soft layered shadows, not heavy borders.
5. Motion explains change (drawer slides in, row highlights after update), it never decorates.

| Surface | Treatment |
| --- | --- |
| Page canvas | Flat #F6F7FB with a faint aurora blob in the top-right corner |
| Sidebar | Solid deep indigo with a subtle vertical gradient |
| Top bar | **Glass**, sticky; content blurs underneath as it scrolls |
| Cards, tables, forms | Solid white, 16 px radius, soft shadow |
| Right detail drawer | **Glass header** + solid body |
| KPI icons, empty states, onboarding | **Clay** 3D icons |
| Modals | Solid white with dimmed, blurred backdrop |
| Toasts | Glass, auto-dismiss |

## 4. Design tokens

### 4.1 Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| --primary | #6C4DFF | #8B73FF | Buttons, links, active nav |
| --primary-soft | #EFEBFF | #2A2452 | Tinted backgrounds, chips |
| --ink | #11122B | #F3F3FA | Primary text |
| --ink-2 | #5B5F7A | #A7A9C4 | Secondary text |
| --canvas | #F6F7FB | #0C0B1E | Page background |
| --surface | #FFFFFF | #16152E | Cards, tables |
| --surface-2 | #FAFAFD | #1E1D3D | Hover, zebra-free striping |
| --border | #E6E8F0 | #2B2A4D | Dividers |
| --accent | #FFB547 | #FFC266 | Ratings, highlights |
| --success | #12B886 | #34D3A1 | Completed, paid |
| --warning | #F59F00 | #FFC145 | Pending, delayed |
| --danger | #F0524F | #FF7A78 | Cancelled, failed |
| --info | #3B82F6 | #6FA5FF | In progress, informational |

**Hero aurora gradient:** #6C4DFF → #9B7BFF → #FF8FB1 at 12–18 % opacity, only as a backdrop.

### 4.2 Typography

- Headings: **Plus Jakarta Sans** (600–700). Body and tables: **Inter** (400–500). Numbers in tables use tabular figures.
- Hindi support, if needed: Noto Sans Devanagari as fallback.

| Style | Size / line | Weight |
| --- | --- | --- |
| Display (KPI numbers) | 32 / 40 | 700 |
| H1 page title | 28 / 36 | 700 |
| H2 section | 20 / 28 | 600 |
| H3 card title | 16 / 24 | 600 |
| Body | 14 / 22 | 400 |
| Table cell | 14 / 20 | 400–500 |
| Caption / label | 12 / 16 | 500 |

### 4.3 Spacing, radius, elevation

- Spacing scale (4-pt grid): 4, 8, 12, 16, 24, 32, 48.
- Radius: 8 (inputs), 12 (buttons, chips), 16 (cards), 24 (hero cards, clay), 999 (pills).
- Elevation: e1 `0 1px 2px rgba(17,18,43,.06)`; e2 `0 6px 20px rgba(17,18,43,.08)`; e3 `0 16px 40px rgba(17,18,43,.14)` for drawers and menus.

### 4.4 Material recipes (CSS)

```css
:root {
  --primary: #6C4DFF; --ink: #11122B; --canvas: #F6F7FB; --surface: #FFFFFF;
  --border: #E6E8F0; --success: #12B886; --danger: #F0524F;
}

/* Glass: top bar, drawer header, toasts */
.glass {
  background: rgba(255,255,255,0.62);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.55);
  box-shadow: 0 8px 32px rgba(30,27,75,0.10);
}

/* Clay: icon tiles, empty-state art, KPI badges */
.clay {
  border-radius: 24px;
  background: linear-gradient(145deg, #8B73FF, #6C4DFF);
  box-shadow:
    0 12px 24px rgba(108,77,255,0.25),
    inset 0 6px 10px rgba(255,255,255,0.55),
    inset 0 -6px 12px rgba(0,0,0,0.12);
}

/* Safe fallback: users who prefer less transparency */
@media (prefers-reduced-transparency: reduce) {
  .glass { background: #FFFFFF; backdrop-filter: none; }
}
```

### 4.5 Components and icons

- Icons: Lucide, 1.75 px stroke, 20 px default. Service-category icons are custom clay-style 3D tiles (exportable as PNG/SVG).
- Buttons: primary (solid violet), secondary (soft violet), ghost, danger. Height 40 (default) / 32 (compact). Focus ring 2 px violet with 2 px offset.
- Status chips: tinted background + darker text of the same hue + small dot. Never rely on colour alone; always include the text.
- Chart palette: violet #6C4DFF, sky #3B82F6, mint #12B886, amber #FFB547, coral #F0524F, slate #8A8FA8.

## 5. Layout system

- **App shell:** left sidebar 264 px (collapsed 76 px), glass top bar 72 px, content area with 32 px padding and a 1440 px max width on a 12-column grid with 24 px gutters.
- **Breakpoints:** ≥1280 full layout · 1024–1279 sidebar auto-collapses · 768–1023 sidebar becomes an overlay drawer · below 768 the dashboard is a read-only responsive view (cards instead of tables).
- **Page anatomy (top to bottom):** breadcrumb and title with primary action → KPI strip → filter bar → content (table / board / charts) → right detail drawer (480 px) opened by clicking a row.
- **Tables:** row height 56, sticky header, hover tint, checkbox bulk select, column chooser, saved views, search, export CSV, pagination with page-size selector. Status column always first after the ID.
- **Drawer vs modal rule:** viewing or editing a record opens a drawer; confirming a destructive action opens a modal.
- **Global search** (Cmd/Ctrl + K) finds bookings, customers, professionals, services.

## 6. Roles and permissions

| Role | Can do | Cannot do |
| --- | --- | --- |
| Super Admin | Everything, including roles, commission, audit log | – |
| Operations Manager | Bookings, assignment, professionals, zones, slots | Payouts approval, roles |
| Support Agent | Tickets, refunds up to a limit, booking notes | Catalog, pricing, payouts |
| Finance | Payments, refunds, payouts, reports | Catalog, assignment |
| Marketing | Banners, coupons, notifications, memberships | Bookings, payments |

Demo tip: a role switcher in the profile menu lets the client see menus change per role.

## 7. Information architecture (sidebar)

- **Overview:** Dashboard · Live Operations
- **Operations:** Bookings · Partner Simulator · Zones & Slots
- **Catalog:** Categories · Services & Packages · Add-ons
- **People:** Professionals · Customers
- **Money:** Payments · Payouts · Offers & Memberships
- **Quality:** Support & Disputes · Reviews
- **Growth:** App Content (CMS) · Notifications · Analytics
- **Admin:** Settings · Roles & Team · Audit Log

## 8. Screen specifications

### 8.1 Login and 2FA (P0)

- Split screen: left glass card over an aurora gradient with form; right a clay illustration and three trust points.
- Fields: email, password, show/hide, remember me, forgot password. Step two: 6-digit OTP boxes with 30-second resend timer.
- States: error shake, locked-account message, loading button. Any password works in demo mode; OTP is 123456.

### 8.2 Overview dashboard (P0)

- **KPI strip (6 cards):** Bookings today, Revenue today (₹), Active professionals, Avg. rating, Cancellation rate, Pending assignments. Each card shows a clay icon, value, and a trend delta versus yesterday.
- **Row 2:** Revenue line chart (7 / 30 / 90 days toggle) and Bookings by category donut.
- **Row 3:** Live bookings table (latest 8) and Alerts panel (unassigned bookings over 10 minutes, low-rated jobs, KYC pending).
- **Row 4:** Top professionals leaderboard and Top services list.
- Global filter: city and date range. All widgets update on change.

### 8.3 Live Operations map (P1)

- Full-width map with professional pins (green available, blue on job, grey offline) and booking pins (amber unassigned).
- Left glass filter panel: city, category, status. Click a pin for a mini card with Assign / Call / View actions.
- Pins move on a timer in demo mode to look live.

### 8.4 Bookings (P0)

- **List view:** columns: Booking ID, Status, Service, Customer, Professional, Slot, City, Amount, Payment, Created. Filters: status tabs with counts, date range, city, category, payment status. Bulk actions: assign, export, send reminder.
- **Detail drawer:** header (ID, status chip, amount) → vertical status timeline → customer card (call, chat) → service and add-ons table → address mini-map → payment breakdown (subtotal, discount, tax, platform fee, total) → professional card with rating → internal notes → action bar.
- **Actions:** Assign / Reassign, Reschedule (slot picker), Cancel (reason required, refund choice), Refund, Add note, Mark completed.
- **States:** empty (clay illustration, “No bookings match these filters”), loading skeleton rows, error with retry.

### 8.5 Partner Simulator (P0, demo-critical)

- A card list of professionals with a toggle for online/offline and, for each assigned job, big buttons that move the booking forward: **Accept → On the way → Arrived → Start service → Complete**.
- Each click updates the shared mock API, so the customer app’s live tracking screen updates in real time. This is what makes the end-to-end demo work without building the partner app.

### 8.6 Services and catalog (P0)

- **Categories:** drag-to-reorder grid of clay tiles (Salon for Women, Men’s Grooming, AC & Appliance Repair, Cleaning, Plumbing & Electrical, Painting). Fields: name, icon, banner, active toggle, cities.
- **Services & Packages:** table plus drawer editor with tabs: Basic (name, description, duration), Pricing (base price, tiered quantity pricing, member price), Inclusions / Exclusions, Add-ons, Images, FAQs, Cities and availability.
- **Live preview:** right panel shows how the service card and detail page look in the customer app as the admin types.
- Publish toggle with a confirmation modal.

### 8.7 Professionals (P0)

- **List:** avatar, name, skills, city, rating, jobs completed, acceptance rate, status (Active, Pending KYC, Suspended), joined date.
- **Onboarding board (kanban):** Applied → Documents submitted → Verification → Training → Approved. Drag cards between columns; each card shows progress ring.
- **Profile drawer:** tabs for Overview (KPIs, ratings trend), Documents (ID, address proof, police verification with Approve/Reject and comment), Skills and zones, Jobs, Earnings, Reviews, Activity log.
- Actions: approve, suspend with reason, edit commission override, send message.

### 8.8 Customers (P1)

- Table with name, phone, city, bookings count, lifetime value, membership, last booking. Profile drawer with addresses, booking history, wallet balance, tickets, notes, and Block / Unblock.

### 8.9 Payments and payouts (P0)

- **Payments:** transaction table (ID, booking, method UPI / card / wallet / cash, amount, status, time). Refund action opens a modal with amount and reason.
- **Payouts:** weekly cycle cards (Period, Total earned, Commission deducted, Net payable). Table of professionals with Approve, Mark paid, Download statement. Commission summary donut.
- Finance KPIs: gross booking value, platform revenue, refunds, pending payouts.

### 8.10 Offers and memberships (P1)

- **Coupons:** create with code, type (percent or flat), cap, min cart value, validity, usage limit, categories, new-user-only toggle. Card list with usage progress.
- **Memberships:** plan cards (price, benefits such as priority slots, extra discount, free cancellation) with subscriber counts and a plan editor.

### 8.11 Support and disputes (P1)

- Three-pane inbox: ticket list, conversation, context panel (booking, customer, professional). Priority and SLA timers, canned replies, assign to agent, resolve with category. Dispute outcome options: refund, redo service, penalise professional, no action.

### 8.12 Reviews and quality (P1)

- Rating distribution chart, a flagged-reviews queue (rating ≤ 2 or keyword matches), professional quality scorecard (rating, punctuality, repeat rate, complaints). Actions: hide review, warn professional, start retraining.

### 8.13 Zones and slots (P1)

- City selector, polygon service-area map editor (mock drawing), slot template grid (days × hours) where each cell holds capacity. Surge toggle and blackout dates.

### 8.14 Analytics (P1)

- Tabs: Revenue, Bookings, Customers, Professionals, Funnel. The funnel shows Visit → Service view → Cart → Slot selected → Paid, with drop-off percentages. Cohort retention heatmap. Date and city filters; export PDF/CSV.

### 8.15 App Content CMS (P1, strong demo moment)

- Edit the customer app’s home screen: banner carousel (image, deep link, schedule), section order (drag), featured categories, promo strip, testimonials.
- A phone-frame preview on the right updates instantly, and the change shows in the Flutter app on refresh.

### 8.16 Notifications (P2)

- Compose push or SMS: audience segment, template, schedule, preview. History table with delivery stats.

### 8.17 Settings, roles and audit log (P2)

- General (brand, currency ₹, tax rate GST 18 %, cancellation windows), commission rules (global, per category, per professional), team members with role assignment, audit log table (who, what, when, before and after).

## 9. Booking lifecycle (shared with the app)

| Status | Chip colour | Triggered by |
| --- | --- | --- |
| Requested | Slate | Customer pays or confirms |
| Confirmed | Violet | Auto-assignment or admin assigns |
| On the way | Blue | Partner Simulator |
| Arrived | Blue | Partner Simulator |
| In progress | Amber | Partner Simulator |
| Completed | Green | Partner Simulator |
| Reviewed | Green outline | Customer rates in app |
| Rescheduled | Amber outline | Customer or admin |
| Cancelled | Red | Customer, admin or professional |
| Refunded | Red outline | Admin or Finance |

## 10. Demo script (five flows)

1. **Customer books, ops sees it:** book a Salon service in the app, then watch the Overview counter increase and the booking appear in Bookings at the top.
2. **Assignment:** open the new booking, show the auto-assigned professional, reassign using the drawer.
3. **Live service:** in the Partner Simulator click Accept → On the way → Arrived; the app’s tracking screen updates each step.
4. **Complete, pay, review:** complete the job; the customer rates in the app; the review appears in Reviews and the professional’s rating changes.
5. **Control the catalogue:** edit a service price and a home banner in the dashboard; refresh the app and show the change. Finish with the Payouts screen.

## 11. Mock data model

| Entity | Key fields |
| --- | --- |
| Category | id, name, icon, banner, order, active |
| Service | id, categoryId, name, description, duration, basePrice, tiers, memberPrice, inclusions, rating, reviewCount |
| AddOn | id, serviceId, name, price |
| Professional | id, name, phone, skills, city, rating, jobsCompleted, kycStatus, online, lat, lng, commissionPct |
| Customer | id, name, phone, addresses, walletBalance, membershipId |
| Booking | id, customerId, professionalId, items, slotStart, address, status, timeline\[\], subtotal, discount, tax, total, paymentStatus |
| Payment | id, bookingId, method, amount, status, createdAt |
| Payout | id, professionalId, period, gross, commission, net, status |
| Coupon | id, code, type, value, cap, minCart, validTo, usageLimit |
| Ticket | id, bookingId, subject, priority, status, messages\[\] |
| Review | id, bookingId, rating, tags, comment, flagged |
| Banner | id, image, deepLink, order, startsAt, endsAt |

**Seed volume:** 6 categories, about 30 services, 40 professionals, 120 customers, 300 bookings spread over 90 days across Delhi NCR, Lucknow and Bengaluru. Prices in ₹ (for example Salon Prime ₹1,299, AC Service ₹599, Bathroom Deep Clean ₹799).

## 12. Recommended build stack and order

- **Frontend:** React with TypeScript (Next.js or Vite), Tailwind CSS, shadcn/ui, TanStack Table, Recharts (or ECharts), Framer Motion, React Hook Form with Zod, Lucide icons.
- **Shared mock backend (pick one):** Firebase Firestore or Supabase (gives real-time updates between web and Flutter, which the demo relies on); or a small Node server with Socket.IO and a JSON seed file.
- **Map:** Leaflet or Mapbox with fake coordinates.

**Build order**

1. Design tokens, theme, app shell, sidebar, glass top bar, dark mode.
2. Shared component kit: Button, Input, Select, Chip, Table, Drawer, Modal, Toast, KPI card, Empty state, Skeleton.
3. Seed data and mock API, plus real-time subscription.
4. P0 screens: Login, Overview, Bookings with drawer, Partner Simulator, Catalog, Professionals, Payments and Payouts.
5. P1 screens: Live Operations, Offers, Support, Reviews, Zones, Analytics, CMS.
6. Polish: loading skeletons, empty and error states, motion, role switcher, responsive pass, demo-reset button.

**Suggested folders:** `app/(auth)`, `app/(dashboard)/{overview,bookings,catalog,professionals,money,...}`, `components/ui`, `components/charts`, `lib/api`, `lib/mock`, `styles/tokens.css`.

## 13. Quality bar

- Text contrast at least 4.5:1 on every glass surface; test glass over both light and dark backdrops.
- Full keyboard navigation, visible focus rings, ARIA labels on icon-only buttons.
- Respect reduced motion and reduced transparency (solid fallback).
- Every list has loading, empty and error states. Every destructive action asks for confirmation.
- Include a **Reset demo data** button in Settings so the demo can be rerun cleanly.

## 14. Sources consulted

- RaftLabs: how an Urban Company–style marketplace works (auto-assignment, two apps plus quality control)
- Urban Company blog: the story behind its black-and-white logo
- Urban Company design team’s public Dribbble portfolio (icon sets, empty states, wallet, membership)
- 3 Sided Coin case study on the Urban Company checkout redesign
- Third-party Urban Company Plus product teardown (NextLeap submission)
- Setproduct, Pixso, The Plus Addons and daisyUI Blueprint: 2026 comparisons of glassmorphism, liquid glass, claymorphism and neumorphism

*Note: colours, names and layouts here are an original design direction inspired by the category, not a copy of Urban Company’s branding.*
