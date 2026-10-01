# Boxsmart HK

Build a polished clickable frontend prototype for an AI-powered booking and rental management web app for a Hong Kong box storage company.

IMPORTANT: This is currently a UI/UX prototype only. Do NOT implement real authentication, payment processing, AI APIs, SMS, WhatsApp, email delivery, or a production database yet. Use realistic mock data and make all important flows clickable.

PRODUCT
The company provides storage boxes / storage units in Hong Kong.

Customers should be able to: ask an AI assistant questions about storage; view available storage plans; choose a box quantity or storage unit size; select a rental term; choose a rental start date; schedule a pickup or drop-off time; review their booking; proceed to a simulated secure payment; see payment / booking confirmation; log in to a customer portal; view active rentals; view upcoming pickups or deliveries; view payment history; view deposit status; request their stored boxes back and choose a delivery slot.

Staff should be able to: log in separately; view an overview dashboard; view bookings and rentals; view bookings as a calendar; filter bookings by status; view customer details; view payment status; view deposit status; review and approve full or partial deposit refunds; enter a reason when making a deduction; view a refund audit history; edit the AI assistant's knowledge base.

AI ASSISTANT
Create a customer-facing chat interface. The assistant should visually support both English and Traditional Chinese. For the prototype, use pre-written sample conversations. Example topics: storage box and unit sizes, prices, rental terms, prohibited items, access hours, deposit policy, pickup and delivery. Include a clear fallback state where the AI says it cannot answer and offers to pass the question to staff.

CUSTOMER BOOKING FLOW
Create a multi-step booking flow: 1. Choose storage plan, 2. Choose quantity / unit size, 3. Select rental term, 4. Select start date, 5. Select pickup or drop-off, 6. Select available time slot, 7. Review booking, 8. Payment, 9. Confirmation. Clearly show unavailable / fully-booked time slots. For payment, create a simulated hosted-checkout style page. Show payment options visually: Octopus, FPS, AlipayHK, WeChat Pay HK. Do not implement actual payment integrations. Show that unpaid reservations expire after 15 minutes.

CUSTOMER PORTAL
Create: account overview, active rentals, upcoming pickup / delivery, payment history, rental details, deposit tracker. Deposit tracker statuses: Held → Under Review → Refunded. Also include a partial-refund example showing: original deposit, deduction amount, written deduction reason, final refund amount.

STAFF DASHBOARD
Create a professional operational dashboard. Navigation: Overview, Bookings, Calendar, Customers, Payments, Deposits, AI Knowledge, Settings. Overview should include useful operational cards such as: today's pickups, today's drop-offs, active rentals, pending payments, deposits awaiting review, available storage capacity.

BOOKINGS
Support list view and calendar view. Example statuses: Pending Payment, Confirmed, Active, Completed, Cancelled. Include filters for: date, status, storage plan, payment status.

DEPOSIT REVIEW
Create a deposit review workflow. Staff should see: customer, rental, deposit amount, rental end date, condition / notes, payment method. Actions: Full Refund, Partial Refund. For partial refund: require deduction amount and written reason. Show an audit log such as: "Approved by Sarah Chan, 29 September 2026, 15:42".

AI KNOWLEDGE BASE
Create an admin interface where staff can manage information used by the AI assistant. Sections: Storage Plans, Pricing, Rental Terms, Prohibited Items, Access Hours, Pickup / Delivery, Deposit Policy, Frequently Asked Questions. Allow staff to add, edit, disable and preview entries.

DESIGN
Use the attached reference image only as inspiration for product structure and clarity. Do NOT copy its branding. Design direction: modern Hong Kong service business; trustworthy; clean; friendly; professional rather than overly corporate; mobile-first customer experience; desktop-first staff dashboard; generous whitespace; simple cards; clear status badges; clear date / calendar interactions; accessible typography; subtle rounded corners; minimal visual clutter. Create a consistent design system. Use a temporary neutral storage-company brand name and logo that can easily be replaced later. Make the interface feel like a real SaaS product rather than a marketing landing page.

TECHNICAL
Use React and TypeScript. Organize components cleanly so the project can later be connected to Supabase / PostgreSQL, authentication, a real AI API, payment gateway APIs, payment webhooks, and notification services. Keep mock data separate from UI components so it will be easy to replace with backend data later. Do not redesign the product into a generic chatbot. The main product is storage booking + rental management, with AI as one part of the customer experience.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cfb5b801-670f-46b7-be45-e5588cd84ac6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
