# Chipo's Lux Apartments Admin Backend Plan

This admin panel is structured so the mock data in `mockData.ts` can be replaced with Firebase Auth, Firestore, Firebase Storage, and security rules without changing the page design.

## Suggested Firestore Collections

- `admin_users`: staff profile, role, department, active status, and last active time.
- `apartments`: unit details, rates, capacity, amenities, public visibility, and operational status.
- `apartment_images`: unit gallery image metadata and ordering.
- `bookings`: stay dates, guest, unit, source, status, payment state, notes, and audit fields.
- `guests`: CRM profile, preferences, ID reference fields, repeat guest state, and internal notes.
- `payments`: receipts, method, amount paid, balance, recorded by, and refund notes.
- `housekeeping_tasks`: turnover tasks, checklist items, status, due time, and assignee.
- `maintenance_issues`: repair tickets, priority, status, assigned staff, images, and resolution notes.
- `message_leads`: website form, WhatsApp, phone, and social inquiries before conversion.
- `website_content`: editable public website copy, gallery, SEO, FAQ, testimonials, and contact settings.
- `staff_activity_logs`: audit trail for admin actions.
- `blocked_dates`: maintenance or owner blocks that prevent bookings.
- `receipts`: receipt-ready snapshots for guest payment records.
- `settings`: business profile, booking rules, notification settings, and payment settings.

## Security TODOs

- Replace mock login with Firebase Auth.
- Add custom claims or Firestore-backed role checks for Owner/Admin, Manager, Receptionist, Housekeeper, Maintenance, Security, and Accountant.
- Write Firebase Security Rules for every collection before production writes are enabled.
- Move privileged staff creation and role assignment to a backend Admin SDK endpoint.
- Never store passwords in Firestore.
- Validate booking date overlap server-side before confirming a booking.
- Validate payment amounts and receipt numbers server-side.
- Store uploaded apartment and maintenance images in Firebase Storage with file type and size restrictions.
- Add audit log writes for booking, payment, content, staff, maintenance, and settings changes.
