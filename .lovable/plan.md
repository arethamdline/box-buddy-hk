# BoxHarbour clickable prototype

## Goal
Build a polished, responsive frontend prototype for a Hong Kong storage booking and rental service. All data and actions remain simulated; no real accounts, payments, messaging, AI, or database connections are added.

## Customer experience
- Make `/` the working product dashboard, not a marketing page, with clear entry points to book storage, ask the assistant, and view rentals.
- Add a bilingual English / Traditional Chinese assistant with multiple browser-saved mock conversations, suggested questions, realistic answers, and a staff handoff fallback.
- Build the complete nine-step booking journey: plan, quantity/size, term, start date, pickup/drop-off, slot, review, simulated payment, and confirmation.
- Show unavailable time slots, a 15-minute reservation countdown, and visual Octopus, FPS, AlipayHK, and WeChat Pay HK choices.
- Build a customer portal with active rentals, logistics schedule, payment history, rental details, return-request scheduling, and full/partial deposit examples.

## Staff experience
- Add a clearly separate staff workspace with desktop navigation for Overview, Bookings, Calendar, Customers, Payments, Deposits, AI Knowledge, and Settings.
- Include operational metrics, booking filters, list/calendar switching, customer records, payment/deposit status, capacity, and clickable detail views.
- Build full and partial deposit refund review dialogs, required deduction details, and an audit history.
- Build AI knowledge management with category navigation plus add, edit, disable, and preview interactions.

## Design and interaction
- Use the uploaded image only as structural inspiration, not as an embedded asset or copied branding.
- Create a replaceable neutral brand, “BoxHarbour”, with a cobalt, teal, warm orange, and soft neutral palette; clean sans-serif typography; compact status badges; subtle corners; and generous whitespace.
- Prioritize mobile ergonomics for customer screens and dense desktop usability for staff screens, while keeping both responsive.
- Use shared UI primitives and centralized mock records so future service integrations can replace the prototype data cleanly.

## Technical details
- Use TanStack Start routes for major customer, booking, portal, and staff pages, each with unique metadata.
- Keep local prototype state in React; save only the selected multi-conversation assistant history in `localStorage`.
- Use the existing design token system and add reusable Button, Badge, Card, and Dialog primitives where needed.
- Validate the central flows in the running preview at desktop and mobile sizes, and resolve build/runtime errors before completion.
