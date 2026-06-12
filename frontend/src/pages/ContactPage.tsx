import { useState, type FormEvent } from 'react'
import { ArrowRightIcon, ChatIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon, SendIcon, UserIcon } from '../components/icons'
import { contactUs } from '../services/api'
import Seo from '../components/Seo'

const ADDRESS =
  'Enam Sambhav, C-20, G Block Rd, G Block BKC, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051'

const officeRows = [
  {
    icon: <PinIcon size={22} />,
    title: 'Head Office',
    lines: ['NG Eduwizer Pvt Ltd, Enam Sambhav, C-20,', 'G Block BKC, Bandra Kurla Complex,', 'Bandra East, Mumbai, Maharashtra 400051'],
  },
  {
    icon: <PhoneIcon size={21} />,
    title: 'Phone',
    lines: ['+91 91677 80061 / +91 91678 64061'],
  },
  {
    icon: <MailIcon size={21} />,
    title: 'Email',
    lines: ['support@eduwizer.com'],
  },
  {
    icon: <ClockIcon size={21} />,
    title: 'Business Hours',
    lines: ['Mon – Sat: 9:00 AM – 6:30 PM', 'Sunday: Closed'],
  },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) return
    const fd = new FormData(form)
    setSending(true)
    setError('')
    try {
      await contactUs({
        name: String(fd.get('name') ?? ''),
        email: String(fd.get('email') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        message: String(fd.get('message') ?? ''),
      })
      setSent(true)
      form.reset()
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Could not send your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="contact-page">
      <Seo
        title="Contact Us"
        description="Get in touch with NG Eduwizer. Visit our Bandra Kurla Complex office in Mumbai, call +91 91677 80061, or send us a message — we reply within 24 hours."
        path="/contact-us"
        pageKey="contact-us"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact NG Eduwizer',
        }}
      />
      <div className="page-wrap contact-grid">
        <section className="panel-message">
          <img className="panel-message__plane" src="/assets/figma/contact-plane.png" alt="" />
          <h1>Send Us a Message</h1>
          <p className="panel-message__sub">
            We&apos;d love to hear from you! Fill out the form below and we&apos;ll get back to you
            within 24 hours.
          </p>
          <form className="contact-form" onSubmit={submit} noValidate={false}>
            <div className="contact-form__row">
              <div className="field">
                <label htmlFor="c-name">Full Name <em>*</em></label>
                <div className="input-shell">
                  <span className="input-shell__icon"><UserIcon size={19} /></span>
                  <input id="c-name" name="name" type="text" required placeholder="Your full name" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-email">Email Address <em>*</em></label>
                <div className="input-shell">
                  <span className="input-shell__icon"><MailIcon size={19} /></span>
                  <input id="c-email" name="email" type="email" required placeholder="you@example.com" />
                </div>
              </div>
            </div>
            <div className="field">
              <label htmlFor="c-phone">Phone Number <em>*</em></label>
              <div className="input-shell">
                <span className="input-shell__icon"><PhoneIcon size={19} /></span>
                <input id="c-phone" name="phone" type="tel" required placeholder="+91 90000 00000" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="c-msg">Your Message <em>*</em></label>
              <div className="input-shell input-shell--area">
                <span className="input-shell__icon"><ChatIcon size={19} /></span>
                <textarea id="c-msg" name="message" rows={7} required placeholder="How can we help you?" />
              </div>
            </div>
            <div className="contact-form__send">
              <button type="submit" className="btn btn--send" disabled={sending}>
                <SendIcon /> {sending ? 'Sending…' : sent ? 'Message Sent ✓' : 'Send Message'}
              </button>
              {error && <p style={{ color: '#e0492c', marginTop: 10, fontSize: 14 }}>{error}</p>}
            </div>
          </form>
          <img className="panel-message__envelope" src="/assets/figma/contact-envelope.png" alt="" />
        </section>

        <section className="panel-office">
          <h2>Our Office</h2>
          <p className="panel-office__sub">
            Visit us at our office or through any of our official communication channels.
          </p>
          {officeRows.map((row) => (
            <div key={row.title} className="office-row">
              <span className="office-row__icon">{row.icon}</span>
              <div>
                <h3>{row.title}</h3>
                <p>
                  {row.lines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>

      <section className="map-section">
        <iframe
          className="map-section__map"
          title="NG Eduwizer office location"
          src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="find-card">
          <h2>
            Find Us Here <img src="/assets/figma/contact-plane.png" alt="" />
          </h2>
          <p>
            We are located in the heart of the city for easy reach, letting us hear from your
            vision.
          </p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn--gold"
          >
            Get Directions <ArrowRightIcon />
          </a>
        </div>
        <div className="pin-card">
          <PinIcon size={26} />
          <div>
            <strong>NG Eduwizer</strong>
            <p>{ADDRESS}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
