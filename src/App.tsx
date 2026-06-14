import { FormEvent, useState } from "react";
import { addBooking } from "./firebase";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  PlayCircle,
  Send,
  Star,
  X,
} from "lucide-react";
import {
  amenities,
  apartmentHighlights,
  business,
  careerAreas,
  directionsLink,
  footerLinks,
  galleryItems,
  hiringDetails,
  heroStats,
  images,
  jobsPageLink,
  landmarks,
  mapEmbedUrl,
  pricing,
  socialLinks,
  testimonials,
  trustPoints,
  whatsappLink,
  whatsappMessage,
} from "./content";

type BookingForm = {
  fullName: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
};

const navItems = [
  { label: "Apartments", href: "#apartments" },
  { label: "Amenities", href: "#amenities" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
  { label: "Reviews", href: "#reviews" },
  { label: "Careers", href: jobsPageLink },
  { label: "Contact", href: "#contact" },
];

const hiringMarqueeItems = [
  { text: "WE'RE HIRING", variant: "lead" },
  { text: "Join the Chipo's Lux Apartments Team" },
  { text: "Now hiring hospitality & apartment service staff" },
  { text: "View Open Positions", variant: "cta" },
];

const floatingSocialItems = [
  {
    label: "Book",
    ariaLabel: "Book Chipo's Lux Apartments on WhatsApp",
    href: whatsappLink,
    kind: "whatsapp",
  },
  ...socialLinks
    .filter((item) => item.href && (item.label === "Facebook" || item.label === "TikTok"))
    .map((item) => ({
      label: item.label,
      ariaLabel: `Open Chipo's Lux Apartments on ${item.label}`,
      href: item.href,
      kind: item.label.toLowerCase(),
    })),
];

function BrandIcon({ kind }: { kind: string }) {
  if (kind === "facebook") {
    return (
      <svg className="brand-icon" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M24 12.073C24 5.405 18.627.033 12 .033S0 5.405 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z"
        />
      </svg>
    );
  }

  if (kind === "tiktok") {
    return (
      <svg className="brand-icon" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97a12.1 12.1 0 0 1-1.62-.93c-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z"
        />
      </svg>
    );
  }

  return null;
}

const initialForm: BookingForm = {
  fullName: "",
  phone: "",
  email: "",
  checkIn: "",
  checkOut: "",
  guests: "1",
  message: "",
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [formError, setFormError] = useState("");

  const mapReady = mapEmbedUrl.startsWith("https://");
  const mapSrc = mapReady ? mapEmbedUrl : "about:blank";
  const phoneHref = `tel:${business.phoneDisplay.replace(/\s/g, "")}`;
  const careersEmailHref = `mailto:${business.careersEmail}?subject=${encodeURIComponent(
    "Career inquiry - Chipolux Apartment",
  )}`;

  const handleFieldChange = (field: keyof BookingForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (formError) setFormError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim()) {
      setFormError("Please add your name and phone number so Chipo's Lux Apartments can respond.");
      return;
    }

    // Save to Firestore
    addBooking({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests: form.guests,
      message: form.message.trim(),
    }).catch(console.error);

    const details = [
      whatsappMessage,
      "",
      `Full name: ${form.fullName.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : "",
      form.checkIn ? `Check-in date: ${form.checkIn}` : "",
      form.checkOut ? `Check-out date: ${form.checkOut}` : "",
      form.guests ? `Number of guests: ${form.guests}` : "",
      form.message.trim() ? `Message: ${form.message.trim()}` : "",
    ].filter(Boolean);

    const inquiryUrl = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
      details.join("\n"),
    )}`;

    window.open(inquiryUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-ivory text-ink">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/50 bg-ivory/95 shadow-[0_10px_35px_rgba(8,43,73,0.08)] backdrop-blur-xl">
        <div className="section-shell flex items-center justify-between gap-3 py-3">
          <a href="#top" className="flex min-w-0 items-center gap-3" aria-label="Chipo's Lux Apartments home">
            <span className="brand-mark">
              <img src={images.logo} alt="Chipo's Lux Apartments" className="w-14 object-contain sm:w-16" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-[1.2rem] font-bold text-ink sm:text-[1.4rem]">
                Chipo's Lux
              </span>
              <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.22em] text-wine sm:text-[0.68rem]">
                Apartments
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={phoneHref} className="icon-link">
              <Phone aria-hidden="true" size={18} />
              <span>{business.phoneDisplay}</span>
            </a>
            <a className="btn-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" size={18} />
              Book Now on WhatsApp
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded border border-sand bg-white text-ink shadow-sm xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>

        {menuOpen ? (
          <nav className="border-t border-sand/70 bg-ivory px-4 pb-5 pt-2 xl:hidden" aria-label="Mobile navigation">
            <div className="mx-auto grid max-w-7xl gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded px-2 py-3 text-sm font-bold uppercase tracking-[0.18em] text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <a className="btn-secondary justify-center" href={phoneHref}>
                  <Phone aria-hidden="true" size={18} />
                  {business.phoneDisplay}
                </a>
                <a className="btn-whatsapp justify-center" href={whatsappLink} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" size={18} />
                  Book Now
                </a>
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      <main id="top">
        <div className="hiring-banner-wrap">
          <a
            className="hiring-banner"
            href={jobsPageLink}
            aria-label={`${hiringDetails.bannerText}. Now hiring hospitality and apartment service staff. View open positions.`}
          >
            <div className="hiring-marquee" aria-hidden="true">
              {[0, 1].map((cycle) => (
                <div className="hiring-marquee-group" key={cycle}>
                  {hiringMarqueeItems.map((item) => (
                    <span
                      className={`hiring-marquee-item ${
                        item.variant ? `is-${item.variant}` : ""
                      }`}
                      key={`${cycle}-${item.text}`}
                    >
                      <span>{item.text}</span>
                      {item.variant === "cta" ? (
                        <ArrowRight className="hiring-marquee-cta-icon" aria-hidden="true" size={18} />
                      ) : null}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </a>
        </div>

        <section className="hero-section">
          <img
            src={images.heroFront}
            alt="Secure property setting exterior at Chipo's Lux Apartments in Choma"
            className="hero-bg"
          />
          <div className="hero-shade" />

          <div className="section-shell relative z-10 flex min-h-[calc(100svh-3rem)] flex-col justify-end pb-10 pt-32 lg:pb-14">
            <div className="max-w-5xl text-white">
              <p className="eyebrow text-champagne">Choma furnished accommodation</p>
              <h1 className="mt-5 max-w-5xl font-display text-[2.75rem] font-bold leading-[0.94] sm:text-6xl lg:text-7xl">
                Luxury Fully Furnished Apartments in Choma
              </h1>
              <p className="mt-6 max-w-[42rem] text-base leading-8 text-white/84 sm:text-lg">
                Comfortable short & long stay apartments with modern amenities, secure parking, Wi-Fi and excellent customer service.
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a className="btn-whatsapp w-full justify-center sm:w-auto" href={whatsappLink} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" size={19} />
                  Book Now on WhatsApp
                </a>
                <a className="btn-light w-full justify-center sm:w-auto" href="#gallery">
                  View Apartments / View Gallery
                  <ArrowRight aria-hidden="true" size={19} />
                </a>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {heroStats.map((item) => (
                <div key={item} className="hero-stat">
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-20 -mt-6">
          <div className="section-shell">
            <div className="arrival-strip">
              <div>
                <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.25em] text-wine">
                  {business.tagline}
                </p>
                <p className="mt-2 max-w-2xl font-display text-3xl font-bold leading-tight text-ink">
                  A secure, comfortable base for work trips, family visits, and longer stays in Choma.
                </p>
              </div>
              <div className="trust-grid">
                {trustPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <div key={point.label} className="trust-chip">
                      <Icon aria-hidden="true" size={18} />
                      <span>{point.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell grid gap-12 py-20 lg:grid-cols-[0.72fr_1fr] lg:items-center lg:py-28">
          <div>
            <p className="eyebrow">About the apartments</p>
            <h2 className="section-title mt-4">Comfortable stays with the essentials taken care of</h2>
            <p className="copy-large mt-6">
              Chipo's Lux Apartments provides furnished apartments in Choma for guests who want a clean, private,
              and convenient place to stay. The apartments are suitable for business travelers, families, tourists,
              and individuals looking for short-stay or long-stay accommodation.
            </p>
            <a className="btn-secondary mt-7" href="#contact">
              Ask About Availability
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          </div>

          <div className="about-collage">
            <img
              src={images.livingRoom}
              alt="Living room at Chipo's Lux Apartments"
              className="about-main"
              loading="lazy"
              decoding="async"
            />
            <img
              src={images.bedroomWarm}
              alt="Furnished bedroom at Chipo's Lux Apartments"
              className="about-inset"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        <section id="apartments" className="scroll-mt-24 bg-cream py-20 lg:py-28">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Apartments</p>
                <h2 className="section-title mt-4">Designed for easy, comfortable stays</h2>
              </div>
              <p className="copy max-w-2xl">
                Each apartment is set up for guests who want practical comfort: furnished rooms, seating, entertainment,
                security, and easy booking through WhatsApp.
              </p>
            </div>

            <div className="apartment-grid mt-10">
              {apartmentHighlights.map((item) => (
                <article key={item.title} className="apartment-card">
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  <div className="p-5">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="cta-strip mt-8">
              <p>Ready to check dates or ask about rates?</p>
              <a className="btn-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" size={18} />
                Book Now on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section id="gallery" className="scroll-mt-24 py-20 lg:py-28">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Gallery</p>
                <h2 className="section-title mt-4">A clear look at the rooms and property</h2>
              </div>
              <p className="copy max-w-2xl">
                Images are arranged by area so guests can quickly understand the bedrooms, bathrooms, lounge space,
                and exterior before making an inquiry.
              </p>
            </div>

            <div className="gallery-grid mt-10">
              {galleryItems.map((item) => (
                <article key={item.title} className={`gallery-card ${item.layout === "wide" ? "lg:col-span-2" : ""}`}>
                  <img
                    src={item.image}
                    alt={`${item.title} at Chipo's Lux Apartments`}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="gallery-overlay">
                    <small>{item.category}</small>
                    <span>{item.title}</span>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="amenities" className="scroll-mt-24 bg-mist py-20 lg:py-28">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Amenities</p>
                <h2 className="section-title mt-4">Modern Amenities for a Comfortable Stay</h2>
              </div>
              <p className="copy max-w-2xl">
                Enjoy everything you need for a relaxing short or long stay at Chipolux Apartment.
              </p>
            </div>

            <div className="amenity-grid mt-10">
              {amenities.map((amenity) => {
                const Icon = amenity.icon;
                return (
                  <article key={amenity.title} className="amenity-card">
                    <span className="amenity-icon">
                      <Icon aria-hidden="true" size={23} />
                    </span>
                    <h3>{amenity.title}</h3>
                    <p>{amenity.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.78fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">Video tour</p>
              <h2 className="section-title mt-4">See the apartment feel before you book</h2>
              <p className="copy mt-5">
                Take a quick look through the apartment spaces, finishes, and property setting before sending an inquiry.
              </p>
              <a className="btn-whatsapp mt-7" href={whatsappLink} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" size={18} />
                Book Now on WhatsApp
              </a>
            </div>
            <div className="video-frame">
              <video controls preload="metadata" poster={images.livingRoom}>
                <source src={images.videoTour} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-badge">
                <PlayCircle aria-hidden="true" size={18} />
                Property video tour
              </div>
            </div>
          </div>
        </section>

        <section id="rates" className="scroll-mt-24">
          <div className="rates-panel">
            <img
              src={images.livingRoom}
              alt="Living room seating at Chipo's Lux Apartments"
              className="rates-bg"
              loading="lazy"
              decoding="async"
            />
            <div className="rates-shade" />
            <div className="section-shell relative z-10 py-20 text-white lg:py-28">
              <div className="section-heading">
                <div>
                  <p className="eyebrow text-champagne">Rates & Booking</p>
                  <h2 className="section-title mt-4 text-white">Flexible stays, quoted directly</h2>
                </div>
                <p className="copy max-w-2xl text-white/75">
                  Rates may vary depending on length of stay, number of guests, and availability. Contact us directly
                  for the latest pricing.
                </p>
              </div>

              <div className="mt-10 grid gap-4 lg:grid-cols-3">
                {pricing.map((item) => (
                  <article key={item.name} className="rate-card">
                    <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-champagne">{item.name}</p>
                    <h3 className="mt-4 font-display text-4xl font-bold">{item.rate}</h3>
                    <p className="mt-4 text-sm leading-6 text-white/75">{item.note}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/20 pt-6 sm:flex-row sm:items-center">
                <p className="text-sm leading-6 text-white/75">Send your preferred dates and guest count for a direct response.</p>
                <a className="btn-gold" href={whatsappLink} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" size={18} />
                  Check Availability on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="scroll-mt-24 py-20 lg:py-28">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Guest reviews</p>
                <h2 className="section-title mt-4">What guests can expect</h2>
              </div>
              <p className="copy max-w-2xl">
                A simple guest feedback layout that can be updated with verified reviews when they are ready.
              </p>
            </div>

            <div className="review-grid mt-10">
              {testimonials.map((review) => (
                <article key={review.text} className="review-card">
                  <div className="flex gap-1 text-champagne" aria-label={`${review.rating} star rating`}>
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} size={18} fill="currentColor" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-5">{review.text}</p>
                  <strong>{review.name}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="location" className="scroll-mt-24 bg-cream py-20 lg:py-28">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.92fr_0.68fr] lg:items-center">
            <div className="map-wrap">
              <iframe
                title="Chipo's Lux Apartments location in Choma"
                src={mapSrc}
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {!mapReady ? (
                <div className="map-placeholder">
                  <MapPin aria-hidden="true" size={34} />
                  <span>[ADD GOOGLE MAPS EMBED LINK HERE]</span>
                </div>
              ) : null}
            </div>

            <div>
              <p className="eyebrow">Location</p>
              <h2 className="section-title mt-4">Find Us in Choma</h2>
              <p className="copy mt-5">
                The apartments are conveniently located in Choma with easy access to town, secure parking, and nearby
                services. {business.locationNote}
              </p>

              <div className="location-panel mt-7">
                <div className="flex gap-3">
                  <MapPin className="mt-1 shrink-0 text-wine" aria-hidden="true" size={21} />
                  <div>
                    <p className="font-bold text-ink">{business.name}</p>
                    <p className="mt-1 text-sm leading-6 text-ink/70">{business.location}</p>
                    <p className="mt-1 text-sm leading-6 text-ink/70">{business.distanceFromTown}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-2">
                  {landmarks.map((landmark) => (
                    <div key={landmark} className="landmark-row">
                      <CheckCircle2 aria-hidden="true" size={17} />
                      <span>{landmark}</span>
                    </div>
                  ))}
                </div>
                <a className="btn-secondary mt-5 w-full justify-center" href={directionsLink} target="_blank" rel="noreferrer">
                  <Navigation aria-hidden="true" size={18} />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="careers" className="scroll-mt-24 py-20 lg:py-28">
          <div className="section-shell">
            <div className="career-panel">
              <div className="career-intro">
                <p className="eyebrow">Careers</p>
                <h2 className="section-title mt-4">Work with Chipolux Apartment</h2>
                <p className="copy mt-5">
                  Chipo's Lux Apartments is receiving applications for apartment operations, housekeeping, security,
                  and reception roles. View the full advert, role details, deadline, and application form on the jobs page.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a className="btn-whatsapp justify-center" href={jobsPageLink}>
                    <ArrowRight aria-hidden="true" size={18} />
                    View Open Jobs
                  </a>
                  <a className="btn-secondary justify-center" href={careersEmailHref}>
                    <Mail aria-hidden="true" size={18} />
                    Email Your Details
                  </a>
                </div>
                <p className="career-email-note">Career email: {business.careersEmail}</p>
              </div>

              <div className="career-grid">
                {careerAreas.map((area) => (
                  <article key={area.title} className="career-card">
                    <CheckCircle2 aria-hidden="true" size={20} />
                    <div>
                      <h3>{area.title}</h3>
                      <p>{area.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-mist py-20 lg:py-28">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.72fr_1fr]">
            <div>
              <p className="eyebrow">Contact</p>
              <h2 className="section-title mt-4">Book or ask about availability</h2>
              <p className="copy mt-5">
                Share your preferred dates and guest count. The form opens WhatsApp with your details ready to send.
              </p>

              <div className="mt-8 grid gap-3">
                <a className="contact-line" href={phoneHref}>
                  <Phone aria-hidden="true" size={20} />
                  <span>{business.phoneDisplay}</span>
                </a>
                <a className="contact-line" href={`mailto:${business.email}`}>
                  <Mail aria-hidden="true" size={20} />
                  <span>{business.email}</span>
                </a>
                <a className="contact-line" href={whatsappLink} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" size={20} />
                  <span>WhatsApp: {business.phoneDisplay}</span>
                </a>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field">
                  <span>Full name *</span>
                  <input
                    value={form.fullName}
                    onChange={(event) => handleFieldChange("fullName", event.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="field">
                  <span>Phone number *</span>
                  <input
                    value={form.phone}
                    onChange={(event) => handleFieldChange("phone", event.target.value)}
                    autoComplete="tel"
                    required
                  />
                </label>
                <label className="field sm:col-span-2">
                  <span>Email address</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => handleFieldChange("email", event.target.value)}
                    autoComplete="email"
                  />
                </label>
                <label className="field">
                  <span>Check-in date</span>
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(event) => handleFieldChange("checkIn", event.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Check-out date</span>
                  <input
                    type="date"
                    value={form.checkOut}
                    onChange={(event) => handleFieldChange("checkOut", event.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Number of guests</span>
                  <input
                    type="number"
                    min="1"
                    value={form.guests}
                    onChange={(event) => handleFieldChange("guests", event.target.value)}
                  />
                </label>
                <label className="field sm:col-span-2">
                  <span>Message</span>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(event) => handleFieldChange("message", event.target.value)}
                    placeholder="Tell us the apartment type or stay length you are looking for."
                  />
                </label>
              </div>

              {formError ? <p className="mt-4 rounded bg-wine/10 px-4 py-3 text-sm font-semibold text-wine">{formError}</p> : null}

              <button className="btn-whatsapp mt-6 w-full justify-center" type="submit">
                <Send aria-hidden="true" size={18} />
                Send Inquiry on WhatsApp
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-shell footer-grid">
          <div>
            <img src={images.logo} alt="Chipo's Lux Apartments" className="h-14 w-auto rounded bg-white p-2" />
            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              Luxury fully furnished apartments in Choma for short and long stays.
            </p>
            <a className="btn-whatsapp mt-5" href={whatsappLink} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" size={18} />
              Book Now on WhatsApp
            </a>
          </div>

          <div>
            <p className="footer-title">Contact</p>
            <p className="footer-text">{business.location}</p>
            <p className="footer-text">{business.locationNote}</p>
            <p className="footer-text">Phone: {business.phoneDisplay}</p>
            <p className="footer-text">WhatsApp: {business.phoneDisplay}</p>
            <p className="footer-text">Email: {business.email}</p>
            <p className="footer-text">Careers: {business.careersEmail}</p>
          </div>

          <div>
            <p className="footer-title">Quick links</p>
            <div className="mt-3 grid gap-2">
              {footerLinks.map((item) => (
                <a key={item.href} href={item.href} className="footer-link">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-title">Social media</p>
            <div className="mt-3 grid gap-2">
              {socialLinks.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="social-link">
                  <span className={`social-icon-badge is-${item.label.toLowerCase()}`}>
                    <BrandIcon kind={item.label.toLowerCase()} />
                  </span>
                  {item.label}
                  <ExternalLink aria-hidden="true" size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="section-shell mt-8 border-t border-white/10 pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
          &copy; 2025 Chipolux Apartment. All rights reserved.
          <span className="ml-4 opacity-30">·</span>
          <a href="/admin/" className="ml-4 opacity-30 hover:opacity-100 transition-opacity">Admin</a>
        </div>
      </footer>

      <div className="floating-socials" aria-label="Quick contact links">
        {floatingSocialItems.map((item) => (
          <a
            key={item.kind}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={`floating-social-link is-${item.kind}`}
            aria-label={item.ariaLabel}
          >
            {item.kind === "whatsapp" ? (
              <MessageCircle aria-hidden="true" size={23} />
            ) : (
              <BrandIcon kind={item.kind} />
            )}
            <span className="floating-social-label">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default App;
