import { FormEvent, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  BedDouble,
  Building2,
  CalendarCheck,
  CalendarDays,
  Check,
  ClipboardCheck,
  CreditCard,
  Download,
  Eye,
  FileText,
  Home,
  HousePlus,
  ImagePlus,
  Mail,
  MessageCircle,
  MessageSquareText,
  MoreHorizontal,
  Phone,
  Plus,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserPlus,
  UsersRound,
  Wrench,
} from "./icons";
import { business, images } from "../content";
import {
  Drawer,
  EmptyState,
  Field,
  MiniBar,
  Modal,
  PageHeader,
  Panel,
  SearchInput,
  SegmentedControl,
  StatCard,
  StatusPill,
  ToggleSwitch,
} from "./SharedComponents";
import { TODAY_ISO } from "./mockData";
import type {
  AdminBooking,
  AdminData,
  AdminRoute,
  ApartmentUnit,
  BookingSource,
  BookingStatus,
  Guest,
  HousekeepingStatus,
  HousekeepingTask,
  LeadStatus,
  MaintenanceIssue,
  MessageLead,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Role,
  StaffUser,
} from "./types";
import { ROLE_LABELS, ROLE_PERMISSIONS } from "./types";
import {
  addDaysIso,
  calculateBalance,
  calculateNights,
  dateRange,
  formatCurrencyZMW,
  formatDate,
  formatShortDate,
  getApartmentStatusForDate,
  getApartmentStatusTone,
  getBookingStatusTone,
  getHousekeepingTone,
  getLeadStatusTone,
  getMaintenanceTone,
  getPaymentStatusTone,
  getPriorityTone,
  hasDateOverlap,
  isApartmentAvailable,
  makeBookingCode,
  occupancyRate,
  whatsappUrl,
} from "./utils";

interface PageProps {
  data: AdminData;
  onNavigate: (route: Exclude<AdminRoute, "login">) => void;
}

const bookingStatuses: Array<BookingStatus | "All"> = [
  "All",
  "Pending",
  "Awaiting Deposit",
  "Confirmed",
  "Checked In",
  "Checked Out",
  "Cancelled",
  "No Show",
];

const paymentStatuses: Array<PaymentStatus | "All"> = [
  "All",
  "Unpaid",
  "Deposit Paid",
  "Partially Paid",
  "Paid",
  "Refunded",
  "Overdue",
];

const bookingSources: Array<BookingSource | "All"> = [
  "All",
  "Website",
  "WhatsApp",
  "Walk-in",
  "Phone",
  "Referral",
  "Booking.com",
  "Facebook",
  "Instagram",
];

export function DashboardPage({ data, onNavigate }: PageProps) {
  const todayArrivals = data.bookings.filter((booking) => booking.checkInDate === TODAY_ISO);
  const todayDepartures = data.bookings.filter((booking) => booking.checkOutDate === TODAY_ISO);
  const pendingBookings = data.bookings.filter((booking) => ["Pending", "Awaiting Deposit"].includes(booking.status));
  const openMaintenance = data.maintenanceIssues.filter((issue) => !["Resolved", "Closed"].includes(issue.status));
  const dueHousekeeping = data.housekeepingTasks.filter((task) => task.dueDate === TODAY_ISO && task.status !== "Completed");
  const newLeads = data.messageLeads.filter((lead) => lead.status === "New");
  const monthlyRevenue = data.payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  const balances = data.payments.reduce((sum, payment) => sum + payment.balance, 0);
  const occupancy = occupancyRate(data.bookings, data.apartments, TODAY_ISO);

  return (
    <>
      <PageHeader
        eyebrow="Today's Operations"
        title="Front desk command center"
        description="Arrivals, departures, readiness, balances, and open work for the apartments."
        actions={
          <>
            <button className="button secondary" type="button" onClick={() => onNavigate("calendar")}>
              <CalendarDays size={17} aria-hidden="true" />
              Calendar
            </button>
            <button className="button primary" type="button" onClick={() => onNavigate("bookings")}>
              <Plus size={17} aria-hidden="true" />
              New Booking
            </button>
          </>
        }
      />

      <div className="stat-grid">
        <StatCard label="Today's Check-ins" value={todayArrivals.length} detail="Need arrival confirmation" icon={CalendarCheck} tone="blue" />
        <StatCard label="Today's Check-outs" value={todayDepartures.length} detail="Trigger turnover cleaning" icon={ClipboardCheck} tone="amber" />
        <StatCard label="Current Occupancy" value={`${occupancy}%`} detail={`${availableApartments(data.apartments)} apartments available`} icon={Home} tone="green" />
        <StatCard label="Pending Bookings" value={pendingBookings.length} detail="Awaiting action or deposit" icon={MessageSquareText} tone="amber" />
        <StatCard label="Monthly Revenue" value={formatCurrencyZMW(monthlyRevenue)} detail="Recorded payments" icon={TrendingUp} tone="charcoal" />
        <StatCard label="Outstanding Balances" value={formatCurrencyZMW(balances)} detail="Open guest balances" icon={CreditCard} tone="red" />
        <StatCard label="Maintenance Open" value={openMaintenance.length} detail="Active repair items" icon={Wrench} tone="red" />
        <StatCard label="New Inquiries" value={newLeads.length} detail="Website and WhatsApp leads" icon={MessageCircle} tone="blue" />
      </div>

      <div className="dashboard-grid">
        <Panel title="Today's Arrivals" eyebrow="Check-ins" action={<button className="text-action" onClick={() => onNavigate("bookings")}>View bookings</button>}>
          <div className="operation-list">
            {todayArrivals.map((booking) => (
              <button className="operation-row" type="button" key={booking.id} onClick={() => onNavigate("bookings")}>
                <div>
                  <strong>{booking.guestName}</strong>
                  <span>{booking.apartmentName} - {booking.guestsCount} guest{booking.guestsCount === 1 ? "" : "s"}</span>
                </div>
                <StatusPill label={booking.paymentStatus} tone={getPaymentStatusTone(booking.paymentStatus)} />
              </button>
            ))}
            {!todayArrivals.length ? <EmptyState title="No arrivals today" text="The front desk has no scheduled check-ins." /> : null}
          </div>
        </Panel>

        <Panel title="Today's Departures" eyebrow="Check-outs" action={<button className="text-action" onClick={() => onNavigate("housekeeping")}>Open housekeeping</button>}>
          <div className="operation-list">
            {todayDepartures.map((booking) => (
              <button className="operation-row" type="button" key={booking.id} onClick={() => onNavigate("housekeeping")}>
                <div>
                  <strong>{booking.guestName}</strong>
                  <span>{booking.apartmentName} - cleaning after checkout</span>
                </div>
                <StatusPill label="Turnover" tone="amber" />
              </button>
            ))}
            {!todayDepartures.length ? <EmptyState title="No departures today" text="No same-day turnover pressure." /> : null}
          </div>
        </Panel>

        <Panel title="Apartment Readiness" eyebrow="Units">
          <div className="readiness-board">
            {data.apartments.map((apartment) => (
              <div className="readiness-row" key={apartment.id}>
                <img src={apartment.featuredImage} alt="" />
                <div>
                  <strong>{apartment.unitNumber} - {apartment.name}</strong>
                  <span>{apartment.type}</span>
                </div>
                <StatusPill label={apartment.status} tone={getApartmentStatusTone(apartment.status)} />
                <StatusPill label={apartment.cleaningStatus} tone={getApartmentStatusTone(apartment.cleaningStatus)} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick Actions" eyebrow="Daily work">
          <div className="quick-action-grid">
            <button type="button" onClick={() => onNavigate("bookings")}><HousePlus size={18} />New Booking</button>
            <button type="button" onClick={() => onNavigate("guests")}><UserPlus size={18} />Add Guest</button>
            <button type="button" onClick={() => onNavigate("payments")}><Receipt size={18} />Record Payment</button>
            <button type="button" onClick={() => onNavigate("apartments")}><Building2 size={18} />Add Apartment</button>
            <button type="button" onClick={() => onNavigate("housekeeping")}><Sparkles size={18} />Cleaning Task</button>
            <button type="button" onClick={() => onNavigate("maintenance")}><Wrench size={18} />Report Issue</button>
          </div>
        </Panel>

        <Panel title="Housekeeping Due Today" eyebrow="Turnover">
          <div className="task-stack">
            {dueHousekeeping.map((task) => <HousekeepingTaskRow key={task.id} task={task} compact />)}
          </div>
        </Panel>

        <Panel title="Maintenance Alerts" eyebrow="Repair risk">
          <div className="task-stack">
            {openMaintenance.slice(0, 4).map((issue) => (
              <div className="issue-row" key={issue.id}>
                <StatusPill label={issue.priority} tone={getPriorityTone(issue.priority)} />
                <div>
                  <strong>{issue.title}</strong>
                  <span>{issue.apartmentName} - {issue.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Revenue Snapshot" eyebrow="June to date">
          <div className="revenue-panel">
            <MiniBar label="Occupancy" value={occupancy} />
            <MiniBar label="Paid balances" value={Math.round((monthlyRevenue / (monthlyRevenue + balances)) * 100)} />
            <div className="revenue-line"><span>Recorded revenue</span><strong>{formatCurrencyZMW(monthlyRevenue)}</strong></div>
            <div className="revenue-line"><span>Outstanding</span><strong>{formatCurrencyZMW(balances)}</strong></div>
          </div>
        </Panel>

        <Panel title="New Inquiries" eyebrow="Lead inbox">
          <div className="operation-list">
            {newLeads.slice(0, 4).map((lead) => (
              <button className="operation-row" key={lead.id} type="button" onClick={() => onNavigate("messages")}>
                <div>
                  <strong>{lead.name}</strong>
                  <span>{lead.source} - {lead.requestedApartmentType}</span>
                </div>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

export function BookingsPage({ data }: PageProps) {
  const [bookings, setBookings] = useState<AdminBooking[]>(data.bookings);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStatus | "All">("All");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "All">("All");
  const [source, setSource] = useState<BookingSource | "All">("All");
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [newBookingOpen, setNewBookingOpen] = useState(false);

  const filtered = useMemo(() => {
    return bookings
      .filter((booking) => status === "All" || booking.status === status)
      .filter((booking) => paymentStatus === "All" || booking.paymentStatus === paymentStatus)
      .filter((booking) => source === "All" || booking.source === source)
      .filter((booking) => {
        if (!search.trim()) return true;
        const query = search.toLowerCase();
        return [
          booking.bookingCode,
          booking.guestName,
          booking.guestPhone,
          booking.apartmentName,
          booking.source,
        ].some((value) => value.toLowerCase().includes(query));
      })
      .sort((a, b) => a.checkInDate.localeCompare(b.checkInDate));
  }, [bookings, paymentStatus, search, source, status]);

  const updateStatus = (bookingId: string, nextStatus: BookingStatus) => {
    setBookings((current) => current.map((booking) => (booking.id === bookingId ? { ...booking, status: nextStatus } : booking)));
    setSelected((current) => (current?.id === bookingId ? { ...current, status: nextStatus } : current));
  };

  const addBooking = (booking: AdminBooking) => {
    setBookings((current) => [booking, ...current]);
    setNewBookingOpen(false);
    setSelected(booking);
  };

  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="Bookings"
        description="Manage stays from inquiry through deposit, check-in, checkout, and final balance."
        actions={
          <>
            <button className="button secondary" type="button">
              <Download size={17} aria-hidden="true" />
              Export
            </button>
            <button className="button primary" type="button" onClick={() => setNewBookingOpen(true)}>
              <Plus size={17} aria-hidden="true" />
              New Booking
            </button>
          </>
        }
      />

      <Panel>
        <div className="toolbar">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by guest, phone, booking ID, apartment" />
          <select value={status} onChange={(event) => setStatus(event.target.value as BookingStatus | "All")}>
            {bookingStatuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus | "All")}>
            {paymentStatuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={source} onChange={(event) => setSource(event.target.value as BookingSource | "All")}>
            {bookingSources.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest</th>
                <th>Apartment</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Nights</th>
                <th>Source</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking.id}>
                  <td><strong>{booking.bookingCode}</strong></td>
                  <td>
                    <div className="cell-main">
                      <strong>{booking.guestName}</strong>
                      <span>{booking.guestPhone}</span>
                    </div>
                  </td>
                  <td>{booking.apartmentName}</td>
                  <td>{formatShortDate(booking.checkInDate)}</td>
                  <td>{formatShortDate(booking.checkOutDate)}</td>
                  <td>{booking.nights}</td>
                  <td>{booking.source}</td>
                  <td><StatusPill label={booking.status} tone={getBookingStatusTone(booking.status)} /></td>
                  <td><StatusPill label={booking.paymentStatus} tone={getPaymentStatusTone(booking.paymentStatus)} /></td>
                  <td>{formatCurrencyZMW(booking.totalAmount)}</td>
                  <td className={booking.balance > 0 ? "text-danger" : ""}>{formatCurrencyZMW(booking.balance)}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" onClick={() => setSelected(booking)} aria-label={`View ${booking.bookingCode}`}>
                        <Eye size={16} aria-hidden="true" />
                      </button>
                      <a href={whatsappUrl(booking.guestPhone, `Hello ${booking.guestName}, this is Chipo's Lux Apartments about booking ${booking.bookingCode}.`)} target="_blank" rel="noreferrer" aria-label="WhatsApp guest">
                        <MessageCircle size={16} aria-hidden="true" />
                      </a>
                      <button type="button" aria-label="More actions"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length ? <EmptyState title="No bookings found" text="Adjust the search or filters." /> : null}
        </div>
      </Panel>

      <BookingDetailDrawer booking={selected} onClose={() => setSelected(null)} onUpdateStatus={updateStatus} />
      <NewBookingModal
        open={newBookingOpen}
        onClose={() => setNewBookingOpen(false)}
        apartments={data.apartments}
        bookings={bookings}
        onCreate={addBooking}
        maintenanceIssues={data.maintenanceIssues}
      />
    </>
  );
}

export function CalendarPage({ data }: PageProps) {
  const [view, setView] = useState<"week" | "month">("week");
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ apartment: ApartmentUnit; date: string } | null>(null);
  const days = dateRange(TODAY_ISO, view === "week" ? 14 : 30);
  const occupancy = occupancyRate(data.bookings, data.apartments, TODAY_ISO);
  const maintenanceBlocked = data.apartments.filter((item) => item.status === "Maintenance" || item.maintenanceStatus === "Blocked").length;

  return (
    <>
      <PageHeader
        eyebrow="Availability"
        title="Apartment calendar"
        description="A unit-by-date board for confirmed stays, pending deposits, cleaning pressure, and maintenance blocks."
        actions={
          <SegmentedControl
            value={view}
            onChange={setView}
            options={[
              { label: "Week Board", value: "week" },
              { label: "Month Board", value: "month" },
            ]}
          />
        }
      />

      <div className="calendar-summary">
        <StatCard label="Occupancy Today" value={`${occupancy}%`} detail="bookable units" icon={Home} tone="green" />
        <StatCard label="Available Units" value={availableApartments(data.apartments)} detail="ready or inspected" icon={BedDouble} tone="blue" />
        <StatCard label="Maintenance Blocks" value={maintenanceBlocked} detail="not bookable" icon={Wrench} tone="red" />
        <div className="legend">
          {["Available", "Confirmed", "Checked In", "Awaiting Deposit", "Cleaning", "Maintenance"].map((item) => (
            <span key={item}><i className={`legend-dot tone-${calendarTone(item)}`} />{item}</span>
          ))}
        </div>
      </div>

      <Panel className="calendar-panel">
        <div className="availability-board">
          <div className="calendar-grid" style={{ gridTemplateColumns: `220px repeat(${days.length}, minmax(92px, 1fr))` }}>
            <div className="calendar-corner">Apartment</div>
            {days.map((day) => (
              <div key={day} className={`calendar-date ${day === TODAY_ISO ? "is-today" : ""}`}>
                <strong>{formatShortDate(day)}</strong>
                <span>{new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(new Date(`${day}T00:00:00`))}</span>
              </div>
            ))}
            {data.apartments.map((apartment) => (
              <CalendarRow
                key={apartment.id}
                apartment={apartment}
                days={days}
                bookings={data.bookings}
                apartments={data.apartments}
                maintenanceIssues={data.maintenanceIssues}
                onBooking={setSelectedBooking}
                onSlot={(date) => setSelectedSlot({ apartment, date })}
              />
            ))}
          </div>
        </div>
      </Panel>

      <BookingDetailDrawer booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      <Drawer title="Create booking from calendar" open={!!selectedSlot} onClose={() => setSelectedSlot(null)}>
        {selectedSlot ? (
          <div className="drawer-section">
            <p className="eyebrow">Selected slot</p>
            <h3>{selectedSlot.apartment.name}</h3>
            <p>{formatDate(selectedSlot.date)} - {selectedSlot.apartment.unitNumber}</p>
            <button className="button primary" type="button">
              <Plus size={17} />
              Start Booking
            </button>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}

export function ApartmentsPage({ data }: PageProps) {
  const [apartments, setApartments] = useState(data.apartments);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selected, setSelected] = useState<ApartmentUnit | null>(null);

  const toggleWebsite = (apartmentId: string) => {
    setApartments((current) =>
      current.map((item) => (item.id === apartmentId ? { ...item, visibleOnWebsite: !item.visibleOnWebsite } : item)),
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Inventory"
        title="Apartments / Units"
        description="Manage unit readiness, rates, amenities, images, and website visibility."
        actions={
          <>
            <SegmentedControl value={view} onChange={setView} options={[{ label: "Grid", value: "grid" }, { label: "Table", value: "table" }]} />
            <button className="button primary" type="button" onClick={() => setSelected(apartments[0])}>
              <Plus size={17} aria-hidden="true" />
              Add Apartment
            </button>
          </>
        }
      />

      {view === "grid" ? (
        <div className="apartment-grid-admin">
          {apartments.map((apartment) => (
            <article className="apartment-unit-card" key={apartment.id}>
              <img src={apartment.featuredImage} alt={apartment.name} />
              <div className="apartment-card-body">
                <div className="unit-heading">
                  <div>
                    <span>{apartment.unitNumber}</span>
                    <h2>{apartment.name}</h2>
                  </div>
                  <StatusPill label={apartment.status} tone={getApartmentStatusTone(apartment.status)} />
                </div>
                <p>{apartment.description}</p>
                <div className="unit-specs">
                  <span>{apartment.bedrooms} bed</span>
                  <span>{apartment.bathrooms} bath</span>
                  <span>{apartment.maxGuests} guests</span>
                  <span>{formatCurrencyZMW(apartment.pricePerNight)}/night</span>
                </div>
                <div className="unit-status-line">
                  <StatusPill label={apartment.cleaningStatus} tone={getApartmentStatusTone(apartment.cleaningStatus)} />
                  <ToggleSwitch checked={apartment.visibleOnWebsite} label="Visible on website" onChange={() => toggleWebsite(apartment.id)} />
                </div>
                <div className="card-actions">
                  <button className="button secondary" type="button" onClick={() => setSelected(apartment)}>
                    <Settings size={16} />
                    Edit
                  </button>
                  <button className="button ghost" type="button">
                    <ImagePlus size={16} />
                    Images
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Panel>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Cleaning</th>
                  <th>Nightly</th>
                  <th>Capacity</th>
                  <th>Website</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apartments.map((apartment) => (
                  <tr key={apartment.id}>
                    <td><strong>{apartment.unitNumber} - {apartment.name}</strong></td>
                    <td>{apartment.type}</td>
                    <td><StatusPill label={apartment.status} tone={getApartmentStatusTone(apartment.status)} /></td>
                    <td><StatusPill label={apartment.cleaningStatus} tone={getApartmentStatusTone(apartment.cleaningStatus)} /></td>
                    <td>{formatCurrencyZMW(apartment.pricePerNight)}</td>
                    <td>{apartment.maxGuests} guests</td>
                    <td>{apartment.visibleOnWebsite ? "Visible" : "Hidden"}</td>
                    <td><button className="text-action" type="button" onClick={() => setSelected(apartment)}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <ApartmentDrawer apartment={selected} onClose={() => setSelected(null)} />
    </>
  );
}

export function GuestsPage({ data }: PageProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "repeat" | "balances">("all");
  const [selected, setSelected] = useState<Guest | null>(null);
  const filtered = data.guests.filter((guest) => {
    if (filter === "repeat" && !guest.repeatGuest) return false;
    if (filter === "balances" && guest.outstandingBalance <= 0) return false;
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return [guest.fullName, guest.phone, guest.email, guest.city].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <>
      <PageHeader
        eyebrow="Guest CRM"
        title="Guests"
        description="Guest profiles, stay history, notes, preferences, and balance follow-up."
        actions={<button className="button primary" type="button"><UserPlus size={17} />Add Guest</button>}
      />

      <Panel>
        <div className="toolbar">
          <SearchInput value={search} onChange={setSearch} placeholder="Search guests by name, phone, email, or city" />
          <SegmentedControl
            value={filter}
            onChange={setFilter}
            options={[
              { label: "All Guests", value: "all" },
              { label: "Repeat Guests", value: "repeat" },
              { label: "Balances", value: "balances" },
            ]}
          />
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Bookings</th>
                <th>Total Spent</th>
                <th>Last Stay</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((guest) => (
                <tr key={guest.id}>
                  <td><strong>{guest.fullName}</strong><span className="subline">{guest.city}</span></td>
                  <td>{guest.phone}</td>
                  <td>{guest.email || "-"}</td>
                  <td>{guest.totalBookings}</td>
                  <td>{formatCurrencyZMW(guest.totalSpent)}</td>
                  <td>{formatDate(guest.lastStayDate)}</td>
                  <td className={guest.outstandingBalance > 0 ? "text-danger" : ""}>{formatCurrencyZMW(guest.outstandingBalance)}</td>
                  <td>{guest.repeatGuest ? <StatusPill label="Repeat Guest" tone="green" /> : <StatusPill label="New Guest" tone="slate" />}</td>
                  <td><button className="text-action" type="button" onClick={() => setSelected(guest)}>Profile</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <GuestProfileDrawer guest={selected} bookings={data.bookings} payments={data.payments} onClose={() => setSelected(null)} />
    </>
  );
}

export function PaymentsPage({ data }: PageProps) {
  const [payments, setPayments] = useState(data.payments);
  const [status, setStatus] = useState<PaymentStatus | "All">("All");
  const [method, setMethod] = useState<PaymentMethod | "All">("All");
  const [recordOpen, setRecordOpen] = useState(false);
  const filtered = payments.filter((payment) => (status === "All" || payment.status === status) && (method === "All" || payment.method === method));

  const revenue = payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  const outstanding = payments.reduce((sum, payment) => sum + payment.balance, 0);
  const mobileMoney = payments.filter((payment) => payment.method === "Mobile Money").reduce((sum, payment) => sum + payment.amountPaid, 0);
  const cash = payments.filter((payment) => payment.method === "Cash").reduce((sum, payment) => sum + payment.amountPaid, 0);
  const bank = payments.filter((payment) => payment.method === "Bank Transfer").reduce((sum, payment) => sum + payment.amountPaid, 0);

  const recordPayment = () => {
    const booking = data.bookings.find((item) => item.balance > 0) ?? data.bookings[0];
    const next: Payment = {
      id: `pay-${Date.now()}`,
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      guestId: booking.guestId,
      guestName: booking.guestName,
      apartmentName: booking.apartmentName,
      amountDue: booking.totalAmount,
      amountPaid: booking.balance,
      balance: 0,
      method: "Mobile Money",
      status: "Paid",
      receiptNumber: `RCP-2026-${Math.floor(400 + payments.length)}`,
      paymentDate: TODAY_ISO,
      recordedBy: "Ruth Njobvu",
      notes: "Recorded from admin payment modal.",
    };
    setPayments((current) => [next, ...current]);
    setRecordOpen(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Finance"
        title="Payments"
        description="Track receipts, deposits, balances, refunds, and revenue by method."
        actions={<button className="button primary" type="button" onClick={() => setRecordOpen(true)}><Receipt size={17} />Record Payment</button>}
      />

      <div className="stat-grid">
        <StatCard label="Revenue this month" value={formatCurrencyZMW(revenue)} icon={TrendingUp} tone="green" />
        <StatCard label="Cash received" value={formatCurrencyZMW(cash)} icon={Banknote} tone="charcoal" />
        <StatCard label="Mobile Money" value={formatCurrencyZMW(mobileMoney)} icon={Phone} tone="blue" />
        <StatCard label="Bank transfers" value={formatCurrencyZMW(bank)} icon={CreditCard} tone="blue" />
        <StatCard label="Outstanding" value={formatCurrencyZMW(outstanding)} icon={AlertTriangle} tone="red" />
      </div>

      <Panel>
        <div className="toolbar">
          <select value={status} onChange={(event) => setStatus(event.target.value as PaymentStatus | "All")}>
            {paymentStatuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod | "All")}>
            {["All", "Cash", "Mobile Money", "Bank Transfer", "Card", "Other"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className="button secondary" type="button"><Download size={17} />Export Report</button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Receipt No.</th>
                <th>Booking ID</th>
                <th>Guest</th>
                <th>Apartment</th>
                <th>Amount Due</th>
                <th>Amount Paid</th>
                <th>Balance</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Recorded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr key={payment.id}>
                  <td><strong>{payment.receiptNumber}</strong></td>
                  <td>{payment.bookingCode}</td>
                  <td>{payment.guestName}</td>
                  <td>{payment.apartmentName}</td>
                  <td>{formatCurrencyZMW(payment.amountDue)}</td>
                  <td>{formatCurrencyZMW(payment.amountPaid)}</td>
                  <td className={payment.balance > 0 ? "text-danger" : ""}>{formatCurrencyZMW(payment.balance)}</td>
                  <td>{payment.method}</td>
                  <td><StatusPill label={payment.status} tone={getPaymentStatusTone(payment.status)} /></td>
                  <td>{formatDate(payment.paymentDate)}</td>
                  <td>{payment.recordedBy}</td>
                  <td><button className="text-action" type="button">Receipt</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal
        title="Record payment"
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
        footer={
          <>
            <button className="button secondary" type="button" onClick={() => setRecordOpen(false)}>Cancel</button>
            <button className="button primary" type="button" onClick={recordPayment}>Save Payment</button>
          </>
        }
      >
        <div className="form-grid two">
          <Field label="Booking"><select defaultValue={data.bookings.find((item) => item.balance > 0)?.id}>{data.bookings.map((booking) => <option key={booking.id} value={booking.id}>{booking.bookingCode} - {booking.guestName}</option>)}</select></Field>
          <Field label="Payment method"><select defaultValue="Mobile Money"><option>Cash</option><option>Mobile Money</option><option>Bank Transfer</option><option>Card</option><option>Other</option></select></Field>
          <Field label="Amount paid"><input defaultValue="1200" type="number" /></Field>
          <Field label="Receipt date"><input defaultValue={TODAY_ISO} type="date" /></Field>
          <Field label="Notes"><textarea defaultValue="Payment received and receipt prepared." /></Field>
        </div>
      </Modal>
    </>
  );
}

export function HousekeepingPage({ data }: PageProps) {
  const [tasks, setTasks] = useState(data.housekeepingTasks);
  const statuses: HousekeepingStatus[] = ["Pending", "In Progress", "Ready for Inspection", "Completed", "Blocked"];

  const moveTask = (taskId: string, status: HousekeepingStatus) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)));
  };

  return (
    <>
      <PageHeader
        eyebrow="Apartment readiness"
        title="Housekeeping"
        description="Turnover cleaning, inspections, linen changes, amenity restocking, and ready-for-next-guest checks."
        actions={<button className="button primary" type="button"><Sparkles size={17} />Create Task</button>}
      />

      <Panel title="Today's Turnover" eyebrow="Checkout cleaning">
        <div className="turnover-grid">
          {tasks.filter((task) => task.dueDate === TODAY_ISO).map((task) => <HousekeepingTaskRow key={task.id} task={task} />)}
        </div>
      </Panel>

      <div className="kanban-board">
        {statuses.map((status) => (
          <section className="kanban-column" key={status}>
            <div className="kanban-heading">
              <h2>{status}</h2>
              <span>{tasks.filter((task) => task.status === status).length}</span>
            </div>
            {tasks.filter((task) => task.status === status).map((task) => (
              <article className="task-card" key={task.id}>
                <div className="task-card-top">
                  <StatusPill label={task.priority} tone={getPriorityTone(task.priority)} />
                  <span>{task.dueTime}</span>
                </div>
                <h3>{task.apartmentName}</h3>
                <p>{task.taskType}</p>
                <div className="checklist-preview">
                  {task.checklist.slice(0, 4).map((item) => (
                    <span key={item.label} className={item.done ? "is-done" : ""}><Check size={13} />{item.label}</span>
                  ))}
                </div>
                <div className="task-actions">
                  {status !== "In Progress" ? <button type="button" onClick={() => moveTask(task.id, "In Progress")}>Start</button> : null}
                  {status !== "Ready for Inspection" ? <button type="button" onClick={() => moveTask(task.id, "Ready for Inspection")}>Ready</button> : null}
                  {status !== "Completed" ? <button type="button" onClick={() => moveTask(task.id, "Completed")}>Complete</button> : null}
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>

      <Panel title="Apartment Readiness" eyebrow="Unit status">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Apartment</th><th>Current / Next guest</th><th>Cleaning Status</th><th>Assigned Staff</th><th>Last Cleaned</th><th>Notes</th></tr></thead>
            <tbody>
              {data.apartments.map((apartment) => {
                const nextBooking = data.bookings.find((booking) => booking.apartmentId === apartment.id && booking.checkInDate >= TODAY_ISO);
                const task = tasks.find((item) => item.apartmentId === apartment.id);
                return (
                  <tr key={apartment.id}>
                    <td><strong>{apartment.unitNumber} - {apartment.name}</strong></td>
                    <td>{nextBooking ? `${nextBooking.guestName} on ${formatShortDate(nextBooking.checkInDate)}` : "No scheduled arrival"}</td>
                    <td><StatusPill label={apartment.cleaningStatus} tone={getApartmentStatusTone(apartment.cleaningStatus)} /></td>
                    <td>{task?.assignedTo ?? "-"}</td>
                    <td>{task?.completedAt ? formatDate(task.completedAt) : "Today check pending"}</td>
                    <td>{apartment.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

export function MaintenancePage({ data }: PageProps) {
  const [issues, setIssues] = useState(data.maintenanceIssues);
  const [reportOpen, setReportOpen] = useState(false);
  const activeIssues = issues.filter((issue) => !["Resolved", "Closed"].includes(issue.status));

  const resolveFirstOpen = () => {
    const target = activeIssues[0];
    if (!target) return;
    setIssues((current) => current.map((issue) => (issue.id === target.id ? { ...issue, status: "Resolved", resolvedAt: TODAY_ISO } : issue)));
  };

  return (
    <>
      <PageHeader
        eyebrow="Property care"
        title="Maintenance"
        description="Repair tracking, blocked apartments, contractor follow-up, and recently resolved issues."
        actions={<button className="button primary" type="button" onClick={() => setReportOpen(true)}><Wrench size={17} />Report Issue</button>}
      />

      <div className="stat-grid">
        <StatCard label="Open urgent issues" value={issues.filter((issue) => issue.priority === "Urgent" && !["Resolved", "Closed"].includes(issue.status)).length} icon={AlertTriangle} tone="red" />
        <StatCard label="Apartments blocked" value={data.apartments.filter((apt) => apt.status === "Maintenance").length} icon={Home} tone="red" />
        <StatCard label="Avg resolution" value="1.8 days" detail="placeholder metric" icon={TrendingUp} tone="charcoal" />
        <StatCard label="Recently resolved" value={issues.filter((issue) => issue.status === "Resolved").length} icon={Check} tone="green" />
      </div>

      <div className="maintenance-board">
        {["Open", "In Progress", "Waiting for Parts", "Waiting for Contractor", "Resolved", "Closed"].map((status) => (
          <section className="maintenance-column" key={status}>
            <h2>{status}</h2>
            {issues.filter((issue) => issue.status === status).map((issue) => (
              <article key={issue.id} className="maintenance-card">
                <StatusPill label={issue.priority} tone={getPriorityTone(issue.priority)} />
                <h3>{issue.title}</h3>
                <p>{issue.apartmentName}</p>
                <span>Assigned to {issue.assignedTo}</span>
              </article>
            ))}
          </section>
        ))}
      </div>

      <Panel title="Issue Register" eyebrow="All maintenance">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Issue</th><th>Apartment</th><th>Priority</th><th>Status</th><th>Reported By</th><th>Assigned To</th><th>Reported</th><th>Age</th><th>Actions</th></tr></thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td><strong>{issue.title}</strong><span className="subline">{issue.description}</span></td>
                  <td>{issue.apartmentName}</td>
                  <td><StatusPill label={issue.priority} tone={getPriorityTone(issue.priority)} /></td>
                  <td><StatusPill label={issue.status} tone={getMaintenanceTone(issue.status)} /></td>
                  <td>{issue.reportedBy}</td>
                  <td>{issue.assignedTo}</td>
                  <td>{formatDate(issue.reportedAt)}</td>
                  <td>{issue.status === "Resolved" ? "Resolved" : "1 day"}</td>
                  <td><button className="text-action" type="button" onClick={resolveFirstOpen}>Resolve</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal
        title="Report maintenance issue"
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        footer={
          <>
            <button className="button secondary" type="button" onClick={() => setReportOpen(false)}>Cancel</button>
            <button className="button primary" type="button" onClick={() => setReportOpen(false)}>Save Issue</button>
          </>
        }
      >
        <div className="form-grid two">
          <Field label="Title"><input placeholder="Air conditioner not cooling" /></Field>
          <Field label="Apartment"><select>{data.apartments.map((apartment) => <option key={apartment.id}>{apartment.name}</option>)}</select></Field>
          <Field label="Priority"><select><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></Field>
          <Field label="Assigned to"><input defaultValue="Patrick Mweene" /></Field>
          <Field label="Description"><textarea placeholder="Describe the repair issue." /></Field>
          <Field label="Photos"><button className="upload-placeholder" type="button"><ImagePlus size={18} />Photo upload placeholder</button></Field>
        </div>
      </Modal>
    </>
  );
}

export function MessagesPage({ data }: PageProps) {
  const [leads, setLeads] = useState(data.messageLeads);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "All">("All");
  const [selected, setSelected] = useState<MessageLead | null>(leads[0] ?? null);

  const filtered = leads.filter((lead) => {
    if (status !== "All" && lead.status !== status) return false;
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return [lead.name, lead.phone, lead.source, lead.message, lead.requestedApartmentType].some((value) => value.toLowerCase().includes(query));
  });

  const updateLead = (leadId: string, nextStatus: LeadStatus) => {
    setLeads((current) => current.map((lead) => (lead.id === leadId ? { ...lead, status: nextStatus, lastContactedAt: new Date().toISOString() } : lead)));
    setSelected((current) => (current?.id === leadId ? { ...current, status: nextStatus } : current));
  };

  return (
    <>
      <PageHeader
        eyebrow="Lead inbox"
        title="Messages / Leads"
        description="Website inquiries, WhatsApp requests, social leads, follow-ups, and booking conversion."
        actions={<button className="button primary" type="button"><MessageCircle size={17} />New Lead</button>}
      />

      <div className="lead-layout">
        <Panel>
          <div className="toolbar">
            <SearchInput value={search} onChange={setSearch} placeholder="Search leads" />
            <select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus | "All")}>
              {["All", "New", "Contacted", "Quoted", "Follow Up", "Converted", "Lost"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="lead-list">
            {filtered.map((lead) => (
              <button key={lead.id} className={`lead-item ${selected?.id === lead.id ? "is-active" : ""}`} type="button" onClick={() => setSelected(lead)}>
                <div>
                  <strong>{lead.name}</strong>
                  <span>{lead.source} - {lead.requestedApartmentType}</span>
                </div>
                <StatusPill label={lead.status} tone={getLeadStatusTone(lead.status)} />
              </button>
            ))}
          </div>
        </Panel>

        <Panel title={selected ? selected.name : "Lead details"} eyebrow="Conversation">
          {selected ? (
            <div className="lead-detail">
              <div className="detail-grid">
                <span><strong>Phone</strong>{selected.phone}</span>
                <span><strong>Email</strong>{selected.email || "-"}</span>
                <span><strong>Requested dates</strong>{formatShortDate(selected.requestedCheckIn)} - {formatShortDate(selected.requestedCheckOut)}</span>
                <span><strong>Assigned to</strong>{selected.assignedTo}</span>
              </div>
              <blockquote>{selected.message}</blockquote>
              <p>{selected.notes}</p>
              <div className="timeline">
                <span>Lead created - {new Date(selected.createdAt).toLocaleString()}</span>
                {selected.lastContactedAt ? <span>Last contacted - {new Date(selected.lastContactedAt).toLocaleString()}</span> : null}
                {selected.convertedToBookingId ? <span>Converted to booking - {selected.convertedToBookingId}</span> : null}
              </div>
              <div className="drawer-actions">
                <a className="button secondary" href={whatsappUrl(selected.phone, `Hello ${selected.name}, this is Chipo's Lux Apartments. Thank you for your inquiry.`)} target="_blank" rel="noreferrer">
                  <MessageCircle size={17} />
                  WhatsApp Reply
                </a>
                <button className="button secondary" type="button" onClick={() => updateLead(selected.id, "Contacted")}>Mark Contacted</button>
                <button className="button primary" type="button" onClick={() => updateLead(selected.id, "Converted")}>Convert to Booking</button>
              </div>
            </div>
          ) : (
            <EmptyState title="No lead selected" />
          )}
        </Panel>
      </div>
    </>
  );
}

export function ContentPage({ data }: PageProps) {
  const tabs = ["Hero", "Apartments", "Amenities", "Gallery", "About", "Contact", "Testimonials", "FAQ", "SEO", "Banner"] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>("Hero");

  return (
    <>
      <PageHeader
        eyebrow="Website manager"
        title="Website Content"
        description="CMS-ready editing for public website copy, images, gallery, contact details, SEO, and promotional banners."
        actions={<button className="button primary" type="button"><Check size={17} />Save Draft</button>}
      />

      <Panel>
        <div className="content-tabs">
          {tabs.map((item) => <button key={item} className={tab === item ? "is-active" : ""} onClick={() => setTab(item)} type="button">{item}</button>)}
        </div>

        <div className="content-editor">
          {tab === "Hero" ? (
            <div className="editor-grid">
              <Field label="Hero title"><input defaultValue={data.websiteContent.heroTitle} /></Field>
              <Field label="Hero subtitle"><textarea defaultValue={data.websiteContent.heroSubtitle} /></Field>
              <Field label="CTA text"><input defaultValue={data.websiteContent.ctaText} /></Field>
              <div className="image-editor"><img src={images.heroFront} alt="" /><button type="button"><ImagePlus size={17} />Change hero image</button></div>
            </div>
          ) : null}
          {tab === "Apartments" ? <ContentApartmentSection apartments={data.apartments} /> : null}
          {tab === "Amenities" ? <CheckboxGrid items={data.websiteContent.amenities} /> : null}
          {tab === "Gallery" ? <GalleryEditor images={data.websiteContent.galleryImages} /> : null}
          {tab === "About" ? <Field label="About text"><textarea defaultValue={data.websiteContent.aboutText} rows={8} /></Field> : null}
          {tab === "Contact" ? (
            <div className="form-grid two">
              <Field label="Phone"><input defaultValue={data.websiteContent.contactPhone} /></Field>
              <Field label="WhatsApp number"><input defaultValue={data.websiteContent.whatsappNumber} /></Field>
              <Field label="Email"><input defaultValue={data.websiteContent.email} /></Field>
              <Field label="Location"><textarea defaultValue={data.websiteContent.location} /></Field>
              <Field label="Map link"><input defaultValue={data.websiteContent.mapLink} /></Field>
            </div>
          ) : null}
          {tab === "Testimonials" ? <TestimonialsEditor items={data.websiteContent.testimonials} /> : null}
          {tab === "FAQ" ? <FaqEditor items={data.websiteContent.faqItems} /> : null}
          {tab === "SEO" ? (
            <div className="form-grid">
              <Field label="SEO title"><input defaultValue={data.websiteContent.seoTitle} /></Field>
              <Field label="Meta description"><textarea defaultValue={data.websiteContent.seoDescription} /></Field>
              <Field label="Keywords placeholder"><input placeholder="furnished apartments Choma, short stay Choma" /></Field>
              <div className="social-preview"><strong>{data.websiteContent.seoTitle}</strong><span>{data.websiteContent.seoDescription}</span></div>
            </div>
          ) : null}
          {tab === "Banner" ? (
            <div className="form-grid two">
              <Field label="Banner text"><input defaultValue={data.websiteContent.promotionalBanner.text} /></Field>
              <Field label="Start date"><input type="date" defaultValue={data.websiteContent.promotionalBanner.startDate} /></Field>
              <Field label="End date"><input type="date" defaultValue={data.websiteContent.promotionalBanner.endDate} /></Field>
              <ToggleSwitch checked={data.websiteContent.promotionalBanner.active} label="Banner active" />
            </div>
          ) : null}
        </div>
      </Panel>
    </>
  );
}

export function StaffPage({ data }: PageProps) {
  const [selectedRole, setSelectedRole] = useState<Role>("owner_admin");
  const roles = Object.keys(ROLE_LABELS) as Role[];

  return (
    <>
      <PageHeader
        eyebrow="Team access"
        title="Staff"
        description="Role-ready staff management for owner, manager, reception, housekeeping, maintenance, security, and accounting."
        actions={<button className="button primary" type="button"><UserPlus size={17} />Add Staff User</button>}
      />

      <div className="role-grid">
        {roles.map((role) => (
          <button type="button" className={`role-card ${selectedRole === role ? "is-active" : ""}`} key={role} onClick={() => setSelectedRole(role)}>
            <strong>{ROLE_LABELS[role]}</strong>
            <span>{ROLE_PERMISSIONS[role].length} permissions</span>
          </button>
        ))}
      </div>

      <div className="staff-layout">
        <Panel title="Staff List" eyebrow="Users">
          <div className="staff-list">
            {data.staffUsers.map((staff) => (
              <div className="staff-row" key={staff.id}>
                <div className="avatar">{staff.avatar}</div>
                <div>
                  <strong>{staff.fullName}</strong>
                  <span>{staff.department} - {staff.email}</span>
                </div>
                <StatusPill label={ROLE_LABELS[staff.role]} tone="blue" />
                <StatusPill label={staff.status} tone={staff.status === "Active" ? "green" : "slate"} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={`${ROLE_LABELS[selectedRole]} Permissions`} eyebrow="Access summary">
          <div className="permission-list">
            {ROLE_PERMISSIONS[selectedRole].map((permission) => <span key={permission}>{permission}</span>)}
          </div>
        </Panel>

        <Panel title="Recent Activity" eyebrow="Audit placeholder">
          <div className="timeline">
            <span>Ruth confirmed booking CLA-260613-A02.</span>
            <span>Grace moved Family Apartment to In Progress.</span>
            <span>Kelvin recorded Mobile Money deposit.</span>
          </div>
        </Panel>
      </div>
    </>
  );
}

export function ReportsPage({ data }: PageProps) {
  const revenueByApartment = data.apartments.map((apartment) => {
    const amount = data.bookings.filter((booking) => booking.apartmentId === apartment.id).reduce((sum, booking) => sum + booking.amountPaid, 0);
    return { apartment: apartment.name, amount };
  });
  const maxRevenue = Math.max(...revenueByApartment.map((item) => item.amount), 1);

  return (
    <>
      <PageHeader
        eyebrow="Business reporting"
        title="Reports"
        description="Revenue, occupancy, sources, balances, apartment performance, and operations health."
        actions={<button className="button secondary" type="button"><Download size={17} />Export</button>}
      />

      <div className="report-metrics">
        {data.reportMetrics.map((metric) => (
          <article className={`report-card status-${metric.status}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.change} - {metric.period}</small>
          </article>
        ))}
      </div>

      <div className="reports-grid">
        <Panel title="Revenue by Apartment" eyebrow="June">
          <div className="bar-list">
            {revenueByApartment.map((item) => (
              <div className="bar-row" key={item.apartment}>
                <span>{item.apartment}</span>
                <i><b style={{ width: `${(item.amount / maxRevenue) * 100}%` }} /></i>
                <strong>{formatCurrencyZMW(item.amount)}</strong>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Booking Sources" eyebrow="Demand">
          <SourceBars bookings={data.bookings} />
        </Panel>

        <Panel title="Payments" eyebrow="Balance health">
          <MiniBar label="Paid" value={68} />
          <MiniBar label="Partial" value={21} />
          <MiniBar label="Unpaid or overdue" value={11} />
        </Panel>

        <Panel title="Operations" eyebrow="Service level">
          <div className="report-list">
            <span>Cleaning tasks completed <strong>{data.housekeepingTasks.filter((task) => task.status === "Completed").length}</strong></span>
            <span>Maintenance resolved <strong>{data.maintenanceIssues.filter((issue) => issue.status === "Resolved").length}</strong></span>
            <span>Open maintenance <strong>{data.maintenanceIssues.filter((issue) => !["Resolved", "Closed"].includes(issue.status)).length}</strong></span>
            <span>Best-performing apartment <strong>Deluxe Furnished Apartment</strong></span>
          </div>
        </Panel>
      </div>
    </>
  );
}

export function SettingsPage({ data }: PageProps) {
  return (
    <>
      <PageHeader
        eyebrow="System setup"
        title="Settings"
        description="Business profile, booking rules, payments, notifications, admin profile, and system controls."
        actions={<button className="button primary" type="button"><Check size={17} />Save Settings</button>}
      />

      <div className="settings-grid">
        <Panel title="Business Profile" eyebrow="Public details">
          <div className="form-grid two">
            <Field label="Business name"><input defaultValue={business.name} /></Field>
            <Field label="Location"><input defaultValue={business.location} /></Field>
            <Field label="Contact number"><input defaultValue={business.phoneDisplay} /></Field>
            <Field label="WhatsApp number"><input defaultValue={business.whatsappNumber} /></Field>
            <Field label="Email"><input defaultValue={business.email} /></Field>
            <Field label="Logo"><button className="upload-placeholder" type="button"><ImagePlus size={18} />Replace logo</button></Field>
          </div>
        </Panel>

        <Panel title="Booking Settings" eyebrow="Front desk rules">
          <div className="form-grid two">
            <Field label="Default check-in"><input type="time" defaultValue="14:00" /></Field>
            <Field label="Default check-out"><input type="time" defaultValue="10:00" /></Field>
            <Field label="Deposit requirement"><input defaultValue="First night deposit" /></Field>
            <Field label="Minimum stay"><input defaultValue="1 night" /></Field>
            <Field label="Cancellation policy"><textarea defaultValue="Cancellation policy placeholder for confirmed bookings." /></Field>
            <Field label="Long-stay discount"><input defaultValue="Monthly quote handled manually" /></Field>
          </div>
        </Panel>

        <Panel title="Payment Settings" eyebrow="Finance">
          <div className="form-grid two">
            <Field label="Currency"><input defaultValue="ZMW" /></Field>
            <Field label="Mobile money number"><input placeholder="+260..." /></Field>
            <Field label="Accepted methods"><input defaultValue="Cash, Mobile Money, Bank Transfer, Card" /></Field>
            <Field label="Bank details"><textarea placeholder="Bank account details placeholder" /></Field>
          </div>
        </Panel>

        <Panel title="Notifications" eyebrow="Alerts">
          <div className="toggle-list">
            {["New booking alerts", "Payment alerts", "Maintenance alerts", "Housekeeping alerts", "WhatsApp lead alerts"].map((item) => (
              <ToggleSwitch key={item} checked label={item} />
            ))}
          </div>
        </Panel>

        <Panel title="Admin Profile" eyebrow="Account">
          <div className="form-grid two">
            <Field label="Name"><input defaultValue="Chipo Mwanza" /></Field>
            <Field label="Email"><input defaultValue="owner@chiposluxapartments.com" /></Field>
            <Field label="Password"><input placeholder="Password change placeholder" type="password" /></Field>
          </div>
        </Panel>

        <Panel title="System" eyebrow="Data management">
          <div className="system-actions">
            <button className="button secondary" type="button"><Download size={17} />Export Data</button>
            <button className="button secondary" type="button"><FileText size={17} />Backup Placeholder</button>
            <button className="button secondary" type="button"><ShieldCheck size={17} />Audit Log</button>
          </div>
          <p className="settings-note">Firebase collections and security rules should be finalized before enabling production writes from this panel.</p>
        </Panel>
      </div>
    </>
  );
}

function BookingDetailDrawer({
  booking,
  onClose,
  onUpdateStatus,
}: {
  booking: AdminBooking | null;
  onClose: () => void;
  onUpdateStatus?: (bookingId: string, status: BookingStatus) => void;
}) {
  return (
    <Drawer title={booking ? booking.bookingCode : "Booking"} open={!!booking} onClose={onClose}>
      {booking ? (
        <div className="drawer-section">
          <div className="drawer-hero">
            <h3>{booking.guestName}</h3>
            <StatusPill label={booking.status} tone={getBookingStatusTone(booking.status)} />
          </div>
          <div className="detail-grid">
            <span><strong>Phone</strong>{booking.guestPhone}</span>
            <span><strong>Email</strong>{booking.guestEmail}</span>
            <span><strong>Apartment</strong>{booking.apartmentName}</span>
            <span><strong>Stay</strong>{formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}</span>
            <span><strong>Nights</strong>{booking.nights}</span>
            <span><strong>Source</strong>{booking.source}</span>
          </div>
          <div className="payment-summary">
            <span><strong>Total</strong>{formatCurrencyZMW(booking.totalAmount)}</span>
            <span><strong>Paid</strong>{formatCurrencyZMW(booking.amountPaid)}</span>
            <span><strong>Balance</strong>{formatCurrencyZMW(booking.balance)}</span>
          </div>
          <div className="drawer-note">
            <strong>Special requests</strong>
            <p>{booking.specialRequests || "None recorded."}</p>
          </div>
          <div className="drawer-note">
            <strong>Internal notes</strong>
            <p>{booking.internalNotes || "No notes yet."}</p>
          </div>
          <div className="timeline">
            <span>Created by {booking.createdBy} on {formatDate(booking.createdAt)}</span>
            <span>Updated {formatDate(booking.updatedAt)}</span>
            {booking.checkedInAt ? <span>Checked in {new Date(booking.checkedInAt).toLocaleString()}</span> : null}
            {booking.checkedOutAt ? <span>Checked out {new Date(booking.checkedOutAt).toLocaleString()}</span> : null}
          </div>
          <div className="drawer-actions">
            <a className="button secondary" href={whatsappUrl(booking.guestPhone, `Hello ${booking.guestName}, this is Chipo's Lux Apartments about booking ${booking.bookingCode}.`)} target="_blank" rel="noreferrer">
              <MessageCircle size={17} />
              WhatsApp
            </a>
            {onUpdateStatus ? (
              <>
                <button className="button secondary" type="button" onClick={() => onUpdateStatus(booking.id, "Confirmed")}>Confirm</button>
                <button className="button secondary" type="button" onClick={() => onUpdateStatus(booking.id, "Checked In")}>Check In</button>
                <button className="button secondary" type="button" onClick={() => onUpdateStatus(booking.id, "Checked Out")}>Check Out</button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}

function NewBookingModal({
  open,
  onClose,
  apartments,
  bookings,
  maintenanceIssues,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  apartments: ApartmentUnit[];
  bookings: AdminBooking[];
  maintenanceIssues: MaintenanceIssue[];
  onCreate: (booking: AdminBooking) => void;
}) {
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [apartmentId, setApartmentId] = useState(apartments[0]?.id ?? "");
  const [checkIn, setCheckIn] = useState(TODAY_ISO);
  const [checkOut, setCheckOut] = useState(addDaysIso(TODAY_ISO, 2));
  const [amountPaid, setAmountPaid] = useState(0);
  const [error, setError] = useState("");

  const apartment = apartments.find((item) => item.id === apartmentId) ?? apartments[0];
  const nights = calculateNights(checkIn, checkOut);
  const total = nights * (apartment?.pricePerNight ?? 0);
  const balance = calculateBalance(total, amountPaid);
  const available = apartment ? isApartmentAvailable(apartment.id, checkIn, checkOut, bookings, apartments, maintenanceIssues) : false;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!guestName.trim() || !phone.trim() || !apartment || !nights) {
      setError("Guest name, phone, apartment, and valid dates are required.");
      return;
    }
    if (!available) {
      setError("This apartment is not available for the selected dates.");
      return;
    }

    onCreate({
      id: `booking-${Date.now()}`,
      bookingCode: makeBookingCode(apartment.unitNumber, checkIn),
      guestId: `guest-${Date.now()}`,
      guestName: guestName.trim(),
      guestPhone: phone.trim(),
      guestEmail: email.trim(),
      apartmentId: apartment.id,
      apartmentName: apartment.name,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      guestsCount: 1,
      adults: 1,
      children: 0,
      source: "WhatsApp",
      status: amountPaid > 0 ? "Confirmed" : "Awaiting Deposit",
      paymentStatus: amountPaid >= total ? "Paid" : amountPaid > 0 ? "Deposit Paid" : "Unpaid",
      totalAmount: total,
      amountPaid,
      balance,
      depositRequired: apartment.pricePerNight,
      depositPaid: amountPaid >= apartment.pricePerNight,
      specialRequests: "",
      internalNotes: "Created from admin panel mock booking form.",
      createdBy: "Ruth Njobvu",
      createdAt: TODAY_ISO,
      updatedAt: TODAY_ISO,
    });
    setGuestName("");
    setPhone("");
    setEmail("");
    setError("");
  };

  return (
    <Modal
      title="New booking"
      open={open}
      onClose={onClose}
      footer={
        <>
          <button className="button secondary" type="button" onClick={onClose}>Cancel</button>
          <button className="button primary" type="submit" form="new-booking-form">Create Booking</button>
        </>
      }
    >
      <form id="new-booking-form" onSubmit={submit} className="form-grid two">
        <Field label="Guest name"><input value={guestName} onChange={(event) => setGuestName(event.target.value)} /></Field>
        <Field label="Phone"><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+260..." /></Field>
        <Field label="Email"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
        <Field label="Apartment"><select value={apartmentId} onChange={(event) => setApartmentId(event.target.value)}>{apartments.map((item) => <option value={item.id} key={item.id}>{item.unitNumber} - {item.name}</option>)}</select></Field>
        <Field label="Check-in"><input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} /></Field>
        <Field label="Check-out"><input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></Field>
        <Field label="Amount paid"><input type="number" value={amountPaid} onChange={(event) => setAmountPaid(Number(event.target.value))} /></Field>
        <div className="booking-calculation">
          <span>{nights} night{nights === 1 ? "" : "s"}</span>
          <strong>{formatCurrencyZMW(total)}</strong>
          <small>Balance: {formatCurrencyZMW(balance)}</small>
        </div>
        {!available ? <p className="form-warning">Selected apartment is not available for those dates.</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </Modal>
  );
}

function CalendarRow({
  apartment,
  days,
  bookings,
  apartments,
  maintenanceIssues,
  onBooking,
  onSlot,
}: {
  apartment: ApartmentUnit;
  days: string[];
  bookings: AdminBooking[];
  apartments: ApartmentUnit[];
  maintenanceIssues: MaintenanceIssue[];
  onBooking: (booking: AdminBooking) => void;
  onSlot: (date: string) => void;
}) {
  return (
    <>
      <div className="calendar-unit">
        <img src={apartment.featuredImage} alt="" />
        <div>
          <strong>{apartment.unitNumber}</strong>
          <span>{apartment.name}</span>
        </div>
      </div>
      {days.map((day) => {
        const booking = bookings.find(
          (item) =>
            item.apartmentId === apartment.id &&
            ["Confirmed", "Checked In", "Awaiting Deposit"].includes(item.status) &&
            hasDateOverlap(day, addDaysIso(day, 1), item.checkInDate, item.checkOutDate),
        );
        const status = getApartmentStatusForDate(apartment.id, day, bookings, apartments, maintenanceIssues);
        return (
          <button
            key={`${apartment.id}-${day}`}
            type="button"
            className={`calendar-cell tone-${calendarTone(status)}`}
            onClick={() => (booking ? onBooking(booking) : onSlot(day))}
          >
            <span>{booking ? booking.guestName.split(" ")[0] : status}</span>
          </button>
        );
      })}
    </>
  );
}

function ApartmentDrawer({ apartment, onClose }: { apartment: ApartmentUnit | null; onClose: () => void }) {
  return (
    <Drawer title={apartment ? `Edit ${apartment.unitNumber}` : "Apartment"} open={!!apartment} onClose={onClose}>
      {apartment ? (
        <div className="form-grid two">
          <Field label="Apartment name"><input defaultValue={apartment.name} /></Field>
          <Field label="Unit number"><input defaultValue={apartment.unitNumber} /></Field>
          <Field label="Apartment type"><input defaultValue={apartment.type} /></Field>
          <Field label="Max guests"><input type="number" defaultValue={apartment.maxGuests} /></Field>
          <Field label="Bedrooms"><input type="number" defaultValue={apartment.bedrooms} /></Field>
          <Field label="Bathrooms"><input type="number" defaultValue={apartment.bathrooms} /></Field>
          <Field label="Beds"><input type="number" defaultValue={apartment.beds} /></Field>
          <Field label="Price per night"><input type="number" defaultValue={apartment.pricePerNight} /></Field>
          <Field label="Price per week"><input type="number" defaultValue={apartment.pricePerWeek} /></Field>
          <Field label="Price per month"><input type="number" defaultValue={apartment.pricePerMonth} /></Field>
          <Field label="Description"><textarea defaultValue={apartment.description} /></Field>
          <Field label="Internal notes"><textarea defaultValue={apartment.notes} /></Field>
          <ToggleSwitch checked={apartment.visibleOnWebsite} label="Visible on website" />
          <ToggleSwitch checked={apartment.featuredOnHomepage} label="Featured on homepage" />
        </div>
      ) : null}
    </Drawer>
  );
}

function GuestProfileDrawer({
  guest,
  bookings,
  payments,
  onClose,
}: {
  guest: Guest | null;
  bookings: AdminBooking[];
  payments: Payment[];
  onClose: () => void;
}) {
  const guestBookings = guest ? bookings.filter((booking) => booking.guestId === guest.id) : [];
  const guestPayments = guest ? payments.filter((payment) => payment.guestId === guest.id) : [];

  return (
    <Drawer title={guest ? "Guest Profile" : "Guest"} open={!!guest} onClose={onClose}>
      {guest ? (
        <div className="drawer-section">
          <div className="drawer-hero">
            <h3>{guest.fullName}</h3>
            {guest.repeatGuest ? <StatusPill label="Repeat Guest" tone="green" /> : <StatusPill label="New Guest" tone="slate" />}
          </div>
          <div className="detail-grid">
            <span><strong>Phone</strong>{guest.phone}</span>
            <span><strong>Email</strong>{guest.email}</span>
            <span><strong>ID</strong>{guest.idType} - {guest.idNumber}</span>
            <span><strong>City</strong>{guest.city}</span>
            <span><strong>Total spent</strong>{formatCurrencyZMW(guest.totalSpent)}</span>
            <span><strong>Balance</strong>{formatCurrencyZMW(guest.outstandingBalance)}</span>
          </div>
          <div className="tag-list">
            {guest.preferences.map((preference) => <span key={preference}>{preference}</span>)}
          </div>
          <div className="drawer-note"><strong>Notes</strong><p>{guest.notes}</p></div>
          <h4>Booking History</h4>
          <div className="timeline">{guestBookings.map((booking) => <span key={booking.id}>{booking.bookingCode} - {booking.apartmentName} - {formatDate(booking.checkInDate)}</span>)}</div>
          <h4>Payment History</h4>
          <div className="timeline">{guestPayments.map((payment) => <span key={payment.id}>{payment.receiptNumber} - {formatCurrencyZMW(payment.amountPaid)} - {payment.status}</span>)}</div>
          <div className="drawer-actions">
            <a className="button secondary" href={whatsappUrl(guest.phone, `Hello ${guest.fullName}, this is Chipo's Lux Apartments.`)} target="_blank" rel="noreferrer"><MessageCircle size={17} />WhatsApp</a>
            <button className="button primary" type="button">Add Note</button>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}

function HousekeepingTaskRow({ task, compact = false }: { task: HousekeepingTask; compact?: boolean }) {
  return (
    <div className={`housekeeping-row ${compact ? "is-compact" : ""}`}>
      <div>
        <strong>{task.apartmentName}</strong>
        <span>{task.taskType} - due {task.dueTime}</span>
      </div>
      <StatusPill label={task.status} tone={getHousekeepingTone(task.status)} />
      <span>{task.assignedTo}</span>
    </div>
  );
}

function ContentApartmentSection({ apartments }: { apartments: ApartmentUnit[] }) {
  return (
    <div className="content-unit-list">
      {apartments.map((apartment) => (
        <div key={apartment.id} className="content-unit-row">
          <img src={apartment.featuredImage} alt="" />
          <div>
            <strong>{apartment.name}</strong>
            <span>{apartment.description}</span>
          </div>
          <ToggleSwitch checked={apartment.visibleOnWebsite} label="Visible" />
        </div>
      ))}
    </div>
  );
}

function CheckboxGrid({ items }: { items: string[] }) {
  return (
    <div className="checkbox-grid">
      {items.map((item) => <label key={item}><input type="checkbox" defaultChecked />{item}</label>)}
    </div>
  );
}

function GalleryEditor({ images: galleryImages }: { images: string[] }) {
  return (
    <div className="gallery-editor">
      {galleryImages.map((image, index) => (
        <div key={`${image}-${index}`}>
          <img src={image} alt="" />
          <button type="button"><Eye size={15} />Visible</button>
        </div>
      ))}
      <button type="button" className="gallery-upload"><ImagePlus size={20} />Upload placeholder</button>
    </div>
  );
}

function TestimonialsEditor({ items }: { items: Array<{ name: string; text: string; rating: number; visible: boolean }> }) {
  return (
    <div className="editor-list">
      {items.map((item) => (
        <div key={item.text}>
          <Field label="Name"><input defaultValue={item.name} /></Field>
          <Field label="Review"><textarea defaultValue={item.text} /></Field>
          <ToggleSwitch checked={item.visible} label="Visible" />
        </div>
      ))}
    </div>
  );
}

function FaqEditor({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <div className="editor-list">
      {items.map((item) => (
        <div key={item.question}>
          <Field label="Question"><input defaultValue={item.question} /></Field>
          <Field label="Answer"><textarea defaultValue={item.answer} /></Field>
        </div>
      ))}
    </div>
  );
}

function SourceBars({ bookings }: { bookings: AdminBooking[] }) {
  const counts = bookingSources
    .filter((source): source is BookingSource => source !== "All")
    .map((source) => ({ source, count: bookings.filter((booking) => booking.source === source).length }))
    .filter((item) => item.count > 0);
  const max = Math.max(...counts.map((item) => item.count), 1);
  return (
    <div className="bar-list">
      {counts.map((item) => (
        <div className="bar-row" key={item.source}>
          <span>{item.source}</span>
          <i><b style={{ width: `${(item.count / max) * 100}%` }} /></i>
          <strong>{item.count}</strong>
        </div>
      ))}
    </div>
  );
}

function availableApartments(apartments: ApartmentUnit[]): number {
  return apartments.filter((apartment) => apartment.status === "Available" && ["Ready", "Inspected"].includes(apartment.cleaningStatus)).length;
}

function calendarTone(status: string): string {
  if (status === "Confirmed" || status === "Booked") return "blue";
  if (status === "Checked In" || status === "Occupied") return "green";
  if (status === "Awaiting Deposit" || status === "Cleaning") return "amber";
  if (status === "Maintenance" || status === "Blocked") return "red";
  return "slate";
}
