import { Link } from 'react-router-dom'
import { LinkedInIcon } from './icons'

function InstagramGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="#fff" stroke="none" />
    </svg>
  )
}

function FacebookGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff" aria-hidden>
      <path d="M13.6 21v-7.4h2.5l.38-2.9H13.6V8.85c0-.84.23-1.41 1.44-1.41h1.54V4.85c-.27-.04-1.18-.11-2.24-.11-2.22 0-3.74 1.35-3.74 3.83v2.14H8.1v2.9h2.5V21h3Z" />
    </svg>
  )
}

function LinkedInGlyph() {
  return <LinkedInIcon size={17} color="#fff" />
}

const socials = [
  { name: 'Instagram', Glyph: InstagramGlyph, href: 'https://www.instagram.com/eduwizer_social_media_team_/' },
  { name: 'Facebook', Glyph: FacebookGlyph, href: 'https://www.facebook.com/Eduwizer/' },
  { name: 'LinkedIn', Glyph: LinkedInGlyph, href: 'https://www.linkedin.com/in/dr-nikkie-grover-37bb5521/' },
]

function SocialRow() {
  return (
    <div className="footer__socials">
      {socials.map(({ name, Glyph, href }) => (
        <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name}>
          <Glyph />
        </a>
      ))}
    </div>
  )
}

/** Site-wide footer, shared by every page. */
export function MarketingFooter() {
  return (
    <footer className="footer">
      <div className="page-wrap footer__grid">
        <div className="footer__brand">
          <img src="/assets/logo-full.png" alt="NG Eduwizer" />
          <p>Complete end-to-end solutions for educational excellence.</p>
        </div>
        <div className="footer__col">
          <h3>Quick Links</h3>
          <Link to="/infrastructure-search/financialLoanServices">Infrastructure</Link>
          <Link to="/career-counselling/career">Career Counselling</Link>
          <Link to="/career-counselling/schoolOrCollegeCounsellors">Counsellors</Link>
        </div>
        <div className="footer__col">
          <h3>Our Company</h3>
          <Link to="/events-blogs">Events &amp; Blogs</Link>
          <Link to="/contact-us">Contact Us</Link>
        </div>
        <div className="footer__col">
          <h3>Legal</h3>
          <Link to="/terms-conditions">Privacy Policy</Link>
          <Link to="/terms-conditions">Terms of Service</Link>
        </div>
        <div className="footer__col">
          <h3>Follow Us</h3>
          <SocialRow />
        </div>
      </div>
      <div className="footer__legal">
        © {new Date().getFullYear()} Eduwizer. All rights reserved. Design and developed by{' '}
        <a href="https://integrate360.in/" target="_blank" rel="noreferrer">Integrate360</a>.
        <span className="footer__cin">CIN Number - U74999MH2018PTC309935</span>
      </div>
    </footer>
  )
}
