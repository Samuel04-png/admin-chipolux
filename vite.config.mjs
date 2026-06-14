const adminRoutes = [
  "login",
  "dashboard",
  "bookings",
  "calendar",
  "apartments",
  "guests",
  "payments",
  "housekeeping",
  "maintenance",
  "messages",
  "content",
  "staff",
  "reports",
  "settings",
];

export default {
  base: "/",
  plugins: [],
  css: {
    postcss: {
      plugins: [],
    },
  },
  build: {
    rollupOptions: {
      input: {
        admin: "admin/index.html",
        ...Object.fromEntries(
          adminRoutes.map((route) => [
            `admin-${route}`,
            `admin/${route}/index.html`,
          ]),
        ),
      },
    },
  },
};
