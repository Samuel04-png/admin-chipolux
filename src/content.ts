import type { LucideIcon } from "lucide-react";
import {
  AirVent,
  BedDouble,
  CalendarDays,
  Car,
  CookingPot,
  MapPin,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  Star,
  Waves,
  Wifi,
} from "lucide-react";

export const business = {
  name: "Chipo's Lux Apartments",
  shortName: "Chipolux Apartment",
  location: "Choma, Southern Province, Zambia",
  locationNote: "150 metres from the New Apostolic Church.",
  distanceFromTown: "Approximately 5 minutes from Choma Town.",
  phoneDisplay: "0764937372",
  whatsappNumber: "260764937372",
  email: "info@chiposluxapartments.com",
  careersEmail: "jobs@chiposluxapartments.com",
  tagline: "Home Away From Home",
};

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const homePageLink = import.meta.env.BASE_URL;
export const jobsPageLink = `${import.meta.env.BASE_URL}jobs/`;

export const images = {
  logo: asset("images/chipos-logo.png"),
  heroFront: asset("images/site/chipolux-garden-exterior.jpg"),
  frontExterior: asset("images/site/chipolux-front-exterior.jpg"),
  exteriorGarden: asset("images/site/chipolux-garden-exterior.jpg"),
  livingRoom: asset("images/site/chipolux-living-room.jpg"),
  bedroomWide: asset("images/site/chipolux-bedroom-wide.jpg"),
  bedroomWarm: asset("images/site/chipolux-bedroom-warm.jpg"),
  bedroomAc: asset("images/site/chipolux-bedroom-ac.jpg"),
  bathroomShower: asset("images/site/chipolux-bathroom-shower.jpg"),
  bathroomVanity: asset("images/site/chipolux-bathroom-vanity.jpg"),
  kitchen: asset("images/site/kitchen-main.jpg"),
  pool: asset("images/site/pool-courtyard.jpg"),
  hiringAdvert: asset("images/site/chipolux-hiring-advert.jpeg"),
  videoTour: asset("videos/chipolux-video-tour.mp4"),
};

export const whatsappMessage =
  "Hello, I would like to book an apartment at Chipolux Apartment.";

export const whatsappLink = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage,
)}`;

export const directionsLink = "https://maps.google.com/?q=-16.809271,27.001781";

// Uses the provided coordinates in a normal Google Maps iframe embed.
// Do not add a Google Maps API key to this frontend project.
export const mapEmbedUrl =
  "https://maps.google.com/maps?q=-16.809271,27.001781&z=16&output=embed";

export const heroStats = [
  "Short & long stays",
  "Secure parking",
  "Wi-Fi available",
  "Customer service",
];

export const apartmentHighlights = [
  {
    title: "Secure property setting",
    text: "A private exterior with greenery, secure parking, and convenient access around the apartments.",
    image: images.exteriorGarden,
  },
  {
    title: "Modern bedrooms",
    text: "Comfortable furnished bedrooms with air conditioning, soft bedding, and a calm private feel.",
    image: images.bedroomWide,
  },
  {
    title: "Relaxed living spaces",
    text: "A polished lounge area with smart TV, seating, and room to settle in after a day in Choma.",
    image: images.livingRoom,
  },
];

export const galleryItems = [
  {
    title: "Secure property setting",
    category: "Exterior",
    detail: "A private exterior with greenery, secure parking, and convenient access around the apartments.",
    image: images.heroFront,
    layout: "wide",
  },
  {
    title: "Living room",
    category: "Apartment",
    detail: "A furnished lounge with smart TV and comfortable seating.",
    image: images.livingRoom,
    layout: "wide",
  },
  {
    title: "Garden bedroom",
    category: "Bedroom",
    detail: "Warm bedding, natural light, and a calm garden-side view.",
    image: images.bedroomWarm,
  },
  {
    title: "Air-conditioned bedroom",
    category: "Bedroom",
    detail: "A modern room with air conditioning and a private feel.",
    image: images.bedroomAc,
  },
  {
    title: "Wide bedroom view",
    category: "Bedroom",
    detail: "A neatly furnished bedroom with consistent finishes.",
    image: images.bedroomWide,
    layout: "wide",
  },
  {
    title: "Bathroom shower",
    category: "Bathroom",
    detail: "Marble-style finishes with a clean shower area.",
    image: images.bathroomShower,
  },
  {
    title: "Bathroom vanity",
    category: "Bathroom",
    detail: "Bright bathroom layout with towel rail and mirror.",
    image: images.bathroomVanity,
  },
  {
    title: "Garden exterior",
    category: "Exterior",
    detail: "Landscaped walkways and a quiet property setting.",
    image: images.exteriorGarden,
    layout: "wide",
  },
];

export const amenities: Array<{
  title: string;
  text: string;
  icon: LucideIcon;
}> = [
  {
    title: "Wi-Fi",
    text: "Fast and reliable internet access",
    icon: Wifi,
  },
  {
    title: "Air conditioning",
    text: "Comfortable rooms with air conditioning",
    icon: AirVent,
  },
  {
    title: "Smart TV",
    text: "Entertainment available in the apartment",
    icon: MonitorPlay,
  },
  {
    title: "Kitchen",
    text: "Convenient kitchen facilities",
    icon: CookingPot,
  },
  {
    title: "Security",
    text: "Safe and secure environment",
    icon: ShieldCheck,
  },
  {
    title: "Parking",
    text: "Secure on-site parking",
    icon: Car,
  },
  {
    title: "Swimming pool",
    text: "Relax and enjoy the outdoor pool area",
    icon: Waves,
  },
  {
    title: "Cleaning services",
    text: "Clean and well-maintained apartments",
    icon: Sparkles,
  },
];

export const pricing = [
  {
    name: "Nightly stays",
    rate: "Contact for rate",
    note: "Best for quick visits, work trips, and overnight stops in Choma.",
  },
  {
    name: "Weekly stays",
    rate: "Contact for rate",
    note: "A practical option for business travel, family visits, or short projects.",
  },
  {
    name: "Monthly stays",
    rate: "Contact for rate",
    note: "Suitable for longer assignments, relocation support, or extended family visits.",
  },
];

export const landmarks = [
  "150 metres from the New Apostolic Church",
];

export const testimonials = [
  {
    name: "Guest Review",
    rating: 5,
    text: "Very clean and comfortable apartments. The location is convenient and the staff were very helpful.",
  },
  {
    name: "Guest Review",
    rating: 5,
    text: "Perfect place for a short stay in Choma. Secure parking, good Wi-Fi, and a peaceful environment.",
  },
  {
    name: "Guest Review",
    rating: 5,
    text: "The apartment was modern, well furnished, and exactly what we needed for our stay.",
  },
];

export const careerAreas = [
  {
    title: "Guest care & bookings",
    text: "Friendly communication, guest check-ins, and support for booking inquiries.",
  },
  {
    title: "Housekeeping & apartment care",
    text: "Keeping rooms clean, fresh, and ready for short or long stay guests.",
  },
  {
    title: "Property support",
    text: "Helping maintain a secure, tidy, and welcoming apartment environment.",
  },
];

export const hiringDetails = {
  bannerText: "We're Hiring - Join the Chipo's Lux Apartments Team",
  intro:
    "Chipo's Lux Apartments is expanding its team and looking for qualified, dedicated, and service-driven people to join the business.",
  location: "Choma, Zambia",
  deadline: "18 June 2025",
  deadlineNote: "30 days from 19 May 2025, as shown on the supplied advert",
  applyEmail: business.careersEmail,
  applicationNote: "Interested candidates should send their CV and NRC copy. Only shortlisted candidates will be contacted.",
};

export const jobOpenings = [
  {
    title: "Apartment Manager",
    positions: "1 position",
    responsibilities: [
      "Oversee day-to-day operations of the apartments.",
      "Manage bookings, guest check-ins, and customer relations.",
      "Supervise housekeeping, maintenance, and security staff.",
      "Maintain cleanliness, hospitality, service delivery, records, reports, and inspections.",
      "Handle guest concerns professionally and coordinate operational schedules.",
    ],
    qualifications: [
      "Diploma or Degree in Hospitality Management, Business Administration, or a related field.",
      "Minimum 2 years experience in hospitality, hotel, lodge, or property management.",
      "Strong leadership, communication, customer service, and organizational skills.",
      "Proficient in Microsoft Office and basic computer systems.",
    ],
  },
  {
    title: "Housekeepers",
    positions: "3 positions",
    responsibilities: [
      "Clean and maintain apartments to high standards.",
      "Change linen, restock supplies, and ensure hygiene.",
      "Report damages or maintenance issues.",
      "Care for cleaning equipment and maintain common areas.",
    ],
    qualifications: [
      "Minimum Grade 9 or Grade 12 Certificate.",
      "At least 1 year experience in cleaning, lodge, hotel, or accommodation is an added advantage.",
      "Knowledge of cleaning standards and hygiene practices.",
      "Physically fit, honest, reliable, detail-oriented, and able to follow instructions.",
    ],
  },
  {
    title: "Security Guards",
    positions: "2 positions",
    responsibilities: [
      "Ensure safety of guests and property.",
      "Monitor premises and control access.",
      "Respond to incidents and maintain order.",
      "Conduct regular patrols, report suspicious activity, and support security procedures.",
    ],
    qualifications: [
      "Experience in security services is an added advantage.",
      "Physically fit, alert, honest, and disciplined.",
      "Minimum Grade 12 Certificate or equivalent.",
      "Able to work shifts including nights, weekends, and holidays.",
    ],
  },
  {
    title: "Receptionist",
    positions: "1 position",
    responsibilities: [
      "Handle phone calls, WhatsApp inquiries, and walk-in guests professionally.",
      "Manage online bookings and confirmations across booking platforms.",
      "Check availability, make reservations, and process payments.",
      "Keep guest records updated and coordinate with housekeeping and management.",
    ],
    qualifications: [
      "Minimum Grade 12 Certificate or Diploma in Hospitality/Tourism is an added advantage.",
      "At least 1 year experience in reception, customer service, or hospitality.",
      "Proficient in Microsoft Office and basic computer skills.",
      "Smart, friendly, organized, service-oriented, and comfortable with online booking platforms.",
    ],
  },
];

export const footerLinks = [
  { label: "Home", href: "#top" },
  { label: "Apartments", href: "#apartments" },
  { label: "Amenities", href: "#amenities" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
  { label: "Reviews", href: "#reviews" },
  { label: "Careers", href: jobsPageLink },
  { label: "Contact", href: "#contact" },
];

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1Gqg7K83dF/?mibextid=wwXIfr",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@chipos.lux.apartm?_r=1&_t=ZS-96MLkMCBryH",
  },
];

export const trustPoints = [
  { icon: BedDouble, label: "Fully furnished" },
  { icon: ShieldCheck, label: "Secure setting" },
  { icon: MapPin, label: "Choma location" },
  { icon: CalendarDays, label: "Short & long stays" },
  { icon: Star, label: "Guest-focused service" },
];
