import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  Send,
  Upload,
} from "lucide-react";
import {
  business,
  hiringDetails,
  homePageLink,
  images,
  jobOpenings,
  whatsappLink,
} from "./content";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

type ApplicationForm = {
  fullName: string;
  phone: string;
  email: string;
  position: string;
  message: string;
  cvName: string;
};

const initialApplication: ApplicationForm = {
  fullName: "",
  phone: "",
  email: "",
  position: jobOpenings[0]?.title ?? "",
  message: "",
  cvName: "",
};

function JobsPage() {
  const [form, setForm] = useState<ApplicationForm>(initialApplication);
  const [formError, setFormError] = useState("");

  const handleChange = (field: keyof ApplicationForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (formError) setFormError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.position.trim()) {
      setFormError("Please add your name, phone, email, and the position you are applying for.");
      return;
    }

    const db = getFirebaseDb();
    if (db) {
      addDoc(collection(db, "chippolux_applications"), {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        position: form.position.trim(),
        message: form.message.trim(),
        status: "new",
        createdAt: serverTimestamp(),
      }).catch(console.error);
    }

    const subject = `Job application - ${form.position.trim()} - ${form.fullName.trim()}`;
    const body = [
      "Hello Chipo's Lux Apartments,",
      "",
      "I would like to apply for a position.",
      "",
      `Full name: ${form.fullName.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Email: ${form.email.trim()}`,
      `Position applying for: ${form.position.trim()}`,
      form.message.trim() ? `Short message: ${form.message.trim()}` : "",
      form.cvName ? `CV/NRC file selected on website: ${form.cvName}` : "",
      "",
      "I will attach my CV and NRC copy to this email before sending.",
    ].filter(Boolean);

    window.location.href = `mailto:${hiringDetails.applyEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body.join("\n"))}`;
  };

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="jobs-header">
        <div className="section-shell flex items-center justify-between gap-3 py-3">
          <a href={homePageLink} className="flex min-w-0 items-center gap-3" aria-label="Back to Chipo's Lux Apartments home">
            <span className="brand-mark">
              <img src={images.logo} alt="Chipo's Lux Apartments" className="w-14 object-contain sm:w-16" />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-[1.2rem] font-bold text-ink sm:text-[1.4rem]">
                Chipo's Lux
              </span>
              <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.22em] text-wine sm:text-[0.68rem]">
                Careers
              </span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            <a className="btn-secondary hidden sm:inline-flex" href={homePageLink}>
              <ArrowLeft aria-hidden="true" size={18} />
              Back to Website
            </a>
            <a className="btn-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer">
              Book Now
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="jobs-hero">
          <div className="section-shell jobs-hero-grid">
            <div>
              <p className="eyebrow text-champagne">Chipo's Lux Apartments careers</p>
              <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.98] text-white sm:text-6xl">
                We're Hiring
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                {hiringDetails.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className="btn-gold justify-center" href="#apply">
                  <Send aria-hidden="true" size={18} />
                  Apply Now
                </a>
                <a className="btn-light justify-center" href={homePageLink}>
                  <ArrowLeft aria-hidden="true" size={18} />
                  Back to Website
                </a>
              </div>

              <div className="jobs-fact-grid">
                <div className="jobs-fact">
                  <span>Location</span>
                  <strong>{hiringDetails.location}</strong>
                </div>
                <div className="jobs-fact">
                  <span>Deadline</span>
                  <strong>{hiringDetails.deadline}</strong>
                </div>
                <div className="jobs-fact">
                  <span>Apply by email</span>
                  <strong>{hiringDetails.applyEmail}</strong>
                </div>
              </div>
            </div>

            <a className="jobs-advert-image" href={images.hiringAdvert} target="_blank" rel="noreferrer">
              <img src={images.hiringAdvert} alt="Chipo's Lux Apartments we're hiring job advert" />
            </a>
          </div>
        </section>

        <section className="section-shell py-16 lg:py-24">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Open positions</p>
              <h2 className="section-title mt-4">Available roles</h2>
            </div>
            <p className="copy max-w-2xl">
              These roles are based on the supplied job advert. Review the responsibilities and qualifications before applying.
            </p>
          </div>

          <div className="job-grid mt-10">
            {jobOpenings.map((job) => (
              <article className="job-card" key={job.title}>
                <div className="job-card-header">
                  <div>
                    <p className="eyebrow">Position</p>
                    <h2>{job.title}</h2>
                  </div>
                  <span className="position-count">{job.positions}</span>
                </div>

                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-extrabold text-ink">Key responsibilities</h3>
                    <ul className="job-list">
                      {job.responsibilities.map((item) => (
                        <li key={item}>
                          <CheckCircle2 aria-hidden="true" size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-ink">Qualifications</h3>
                    <ul className="job-list">
                      {job.qualifications.map((item) => (
                        <li key={item}>
                          <CheckCircle2 aria-hidden="true" size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="apply" className="bg-mist py-16 lg:py-24">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.72fr_1fr]">
            <div>
              <p className="eyebrow">Application details</p>
              <h2 className="section-title mt-4">Apply for a role</h2>
              <p className="copy mt-5">
                Fill in your details and the website will prepare an email to {hiringDetails.applyEmail}. Attach your CV
                and NRC copy in your email app before sending.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="contact-line">
                  <Briefcase aria-hidden="true" size={20} />
                  <span>{jobOpenings.length} open role groups</span>
                </div>
                <div className="contact-line">
                  <MapPin aria-hidden="true" size={20} />
                  <span>{hiringDetails.location}</span>
                </div>
                <div className="contact-line">
                  <CalendarDays aria-hidden="true" size={20} />
                  <span>Deadline: {hiringDetails.deadline}</span>
                </div>
                <a className="contact-line" href={`mailto:${hiringDetails.applyEmail}`}>
                  <Mail aria-hidden="true" size={20} />
                  <span>{hiringDetails.applyEmail}</span>
                </a>
              </div>
            </div>

            <form className="application-panel" onSubmit={handleSubmit} noValidate>
              <div className="application-note">
                {hiringDetails.applicationNote} The CV upload field helps you confirm the file name, but email attachments
                must be added in your email app before sending.
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="field">
                  <span>Full name *</span>
                  <input
                    value={form.fullName}
                    onChange={(event) => handleChange("fullName", event.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="field">
                  <span>Phone number *</span>
                  <input
                    value={form.phone}
                    onChange={(event) => handleChange("phone", event.target.value)}
                    autoComplete="tel"
                    required
                  />
                </label>
                <label className="field">
                  <span>Email address *</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    autoComplete="email"
                    required
                  />
                </label>
                <label className="field">
                  <span>Position applying for *</span>
                  <select
                    value={form.position}
                    onChange={(event) => handleChange("position", event.target.value)}
                    required
                  >
                    {jobOpenings.map((job) => (
                      <option key={job.title} value={job.title}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field sm:col-span-2">
                  <span>Short message</span>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(event) => handleChange("message", event.target.value)}
                    placeholder="Briefly mention your experience and availability."
                  />
                </label>
                <label className="file-input-shell sm:col-span-2">
                  <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-ink/70">
                    <Upload aria-hidden="true" size={17} />
                    CV / NRC copy
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={(event) => handleChange("cvName", event.target.files?.[0]?.name ?? "")}
                  />
                </label>
              </div>

              {formError ? <p className="mt-4 rounded bg-wine/10 px-4 py-3 text-sm font-semibold text-wine">{formError}</p> : null}

              <button className="btn-whatsapp mt-6 w-full justify-center" type="submit">
                <Send aria-hidden="true" size={18} />
                Prepare Application Email
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-shell flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="footer-title">Chipo's Lux Apartments</p>
            <p className="footer-text">{business.location}</p>
          </div>
          <a className="btn-gold" href={homePageLink}>
            <ArrowLeft aria-hidden="true" size={18} />
            Back to Main Website
          </a>
        </div>
        <div className="section-shell mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
          &copy; 2025 Chipolux Apartment. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default JobsPage;
