import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        jobs: "jobs/index.html",
        admin: "admin/index.html",
        adminLogin: "admin/login/index.html",
        adminDashboard: "admin/dashboard/index.html",
        adminBookings: "admin/bookings/index.html",
        adminCalendar: "admin/calendar/index.html",
        adminApartments: "admin/apartments/index.html",
        adminGuests: "admin/guests/index.html",
        adminPayments: "admin/payments/index.html",
        adminHousekeeping: "admin/housekeeping/index.html",
        adminMaintenance: "admin/maintenance/index.html",
        adminMessages: "admin/messages/index.html",
        adminContent: "admin/content/index.html",
        adminStaff: "admin/staff/index.html",
        adminReports: "admin/reports/index.html",
        adminSettings: "admin/settings/index.html",
      },
    },
  },
});
