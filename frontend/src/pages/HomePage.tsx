import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, LinkedInIcon } from '../components/icons'
import Seo, { SITE_NAME, SITE_URL } from '../components/Seo'
import {
  getAboutChancellors,
  getAwardsAndRecognitions,
  getFeaturedLists,
  type Award,
  type FeaturedItem,
  type Leader,
} from '../services/api'

function scrollTrack(ref: RefObject<HTMLDivElement | null>, dir: -1 | 1, step: number) {
  ref.current?.scrollBy({ left: dir * step, behavior: 'smooth' })
}

const whyChooseUs = [
  { art: '/assets/figma/wcu-database.png', label: 'First comprehensive database' },
  { art: '/assets/figma/wcu-educators.png', label: 'Specially designed for educators' },
  { art: '/assets/figma/wcu-bespoke.png', label: 'Be Spoke approach' },
  { art: '/assets/figma/wcu-education-sector.png', label: 'Exclusively designed for Education Sector' },
  { art: '/assets/figma/wcu-interface.png', label: 'User friendly interface' },
]

const fallbackListings = [
  { img: '/assets/figma/listing-campus.png', alt: 'Campus walkthrough video' },
  { img: '/assets/figma/listing-award.png', alt: 'Aster Global Awards awardees' },
  { img: '/assets/figma/listing-campus.png', alt: 'Campus walkthrough video' },
  { img: '/assets/figma/listing-award.png', alt: 'Aster Global Awards awardees' },
]

/* Candidate counter grows 500/day since launch reference — same logic as the live site. */
const candidateCount = () => {
  const daysPassed = Math.floor((Date.now() - new Date('2023-06-23').getTime()) / 86400000)
  return (500 + 500 * daysPassed).toLocaleString('en-IN')
}

const stats = [
  { icon: '/assets/figma/stat-candidates.png', tint: 'peach', value: `${candidateCount()}+`, label: 'Candidates' },
  { icon: '/assets/figma/stat-colleges.png', tint: 'lavender', value: '350+', label: 'Colleges' },
  { icon: '/assets/figma/stat-institutes.png', tint: 'peach', value: '300+', label: 'Institutes' },
  { icon: '/assets/figma/stat-vendors.png', tint: 'peach', value: '250+', label: 'Vendors' },
]

const fallbackLeaders = [
  { photo: '/assets/figma/leader-1.png', name: 'Rachna Jain', role: 'Principal', org: 'Vishal Bharti Public School\nNew Delhi, India', linkedIn: 'https://linkedin.com' },
  { photo: '/assets/figma/leader-2.png', name: 'Dr. Sonal Yadav', role: 'Sr. Project Scientist', org: 'Ministry of Education\nNew Delhi, India', linkedIn: 'https://linkedin.com' },
  { photo: '/assets/figma/leader-3.png', name: 'Dr. John Harrison', role: 'Director cum Principal', org: 'Litera Valley School\nGurugram, India', linkedIn: 'https://linkedin.com' },
  { photo: '/assets/figma/leader-4.png', name: 'Dr. Vishal Varia', role: 'Director', org: 'Rosary School, Leader of GEG\nAhmedabad, Gujarat', linkedIn: 'https://linkedin.com' },
  { photo: '/assets/figma/leader-5.png', name: 'Dr. Sanjeeb Pal', role: 'Director', org: 'Amity University, Jaipur', linkedIn: 'https://linkedin.com' },
]

const fallbackAwards = [
  { img: '/assets/figma/award-1.png', label: 'Inspirational Woman Award 2024' },
  { img: '/assets/figma/award-2.png', label: 'Outstanding Leadership & Guidance In the Education Sector' },
  { img: '/assets/figma/award-3.png', label: 'Inspiration Award 2023' },
  { img: '/assets/figma/award-2.png', label: 'Global Leaders & Educators Conference 2023' },
  { img: '/assets/figma/award-1.png', label: 'India Inspirational Women Awards' },
  { img: '/assets/figma/award-3.png', label: 'HEInspiration Award — History Times' },
]

const leaderToCard = (l: Leader) => ({
  photo: l.url || '/assets/figma/leader-1.png',
  name: l.name,
  role: l.position ?? '',
  org: [l.location, l.country].filter(Boolean).join('\n'),
  linkedIn: l.linkedIn,
})

export default function HomePage() {
  const leadersRef = useRef<HTMLDivElement>(null)
  const awardsRef = useRef<HTMLDivElement>(null)

  const [featured, setFeatured] = useState<FeaturedItem[]>([])
  const [apiLeaders, setApiLeaders] = useState<Leader[]>([])
  const [apiAwards, setApiAwards] = useState<Award[]>([])

  useEffect(() => {
    getFeaturedLists().then((r) => setFeatured(r.data ?? [])).catch(() => {})
    getAboutChancellors().then((r) => setApiLeaders(r.data ?? [])).catch(() => {})
    getAwardsAndRecognitions().then((r) => setApiAwards(r.data ?? [])).catch(() => {})
  }, [])

  const leaders = apiLeaders.length ? apiLeaders.map(leaderToCard) : fallbackLeaders

  const awards = apiAwards.length
    ? apiAwards.map((a) => ({ img: a.url, label: a.title }))
    : fallbackAwards

  return (
    <main>
      <Seo
        title="The First Comprehensive Educator's Database Portal"
        description="NG Eduwizer connects talented educators with leading institutions worldwide — recruitment, career counselling, school infrastructure services and education insights across India, Dubai, Canada, Singapore & Europe."
        path="/home"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/assets/logo-full.png`,
          description:
            'A comprehensive educator database portal for recruitment, counselling and school infrastructure services.',
          areaServed: ['India', 'Dubai', 'Canada', 'Singapore', 'Europe'],
        }}
      />
      <section className="hero">
        <div className="page-wrap hero__inner">
          <div>
            <span className="hero__chip">Eduwizer Is An Ecosystem</span>
            <h1 className="hero__title">
              The First Comprehensive
              <br />
              <span>Educator&apos;s Database</span>
              <br />
              <span>Portal</span>
            </h1>
            <p className="hero__sub">
              Connecting talented educators with leading institutions worldwide.
            </p>
            <div className="hero__actions">
              <Link to="/register/candidate" className="btn btn--gold">Sign Up as Candidate</Link>
              <Link to="/register/recruiter" className="btn btn--ghost-light">Sign Up as Recruiter</Link>
            </div>
            <div className="hero__proof">
              <img src="/assets/legacy/png/three-people.png" alt="" />
              <span>20,000+ People Get Their Dream Jobs</span>
            </div>
          </div>
          <div className="hero__visual">
            <img src="/assets/legacy/png/headline-boy.png" alt="Eduwizer mascot welcoming educators" />
          </div>
        </div>
      </section>

      <section className="page-wrap about-split">
        <div className="about-split__photo">
          <img src="/assets/figma/home-about-photo.png" alt="Dr. Nikkie Grover working at her desk" />
        </div>
        <div className="about-split__body">
          <h2 className="section-heading section-heading--upper">About Us</h2>
          <p className="about-split__text">
            Globalization of education has been the real game changer in today&apos;s world. The
            word &ldquo;world is flat&rdquo; has made quite a large impact today on the education
            sector. Education jobs are no longer country centered. Requirement of quality educators
            across the globe is need of the hour. With growing globalization educations is now
            considered intertwined &amp; a global search to facilitate quality educators across the
            globe is required. NG Eduwizer fulfils the need of excellent educators with
            comprehensive resource staff in this portal. We believe to satisfy both the client and
            the clienteles.
          </p>
          <div className="about-split__cta">
            <Link to="/about-us" className="btn btn--gold">
              Know More <ArrowRightIcon />
            </Link>
          </div>
          <div className="about-ceo-sig">
            <img src="/assets/figma/nikkie-avatar.png" alt="Dr. Nikkie Grover" />
            <div>
              <strong>-Dr. Nikkie Grover, CEO</strong>
              <em>Founder &amp; CEO</em>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section" id="infrastructure">
        <div className="page-wrap">
          <h2 className="section-heading section-heading--center section-heading--upper">Why Choose Us</h2>
          <div className="why-grid">
            {whyChooseUs.map((item) => (
              <article key={item.label} className="why-card">
                <div className="why-card__art">
                  <img src={item.art} alt="" />
                </div>
                <h3>{item.label}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="listings-section">
        <div className="page-wrap">
          <h2 className="section-heading section-heading--center section-heading--upper">Featured Listings</h2>
          <div className="listings-grid">
            {featured.length
              ? featured.map((item) =>
                  item.fileType.includes('youtube') ? (
                    <iframe
                      key={item._id}
                      src={`${item.url}?rel=0`}
                      title="Featured listing"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : item.fileType.includes('video') ? (
                    <video key={item._id} src={item.url} controls />
                  ) : (
                    <img key={item._id} src={item.url} alt="Featured listing" />
                  ),
                )
              : fallbackListings.map((item, i) => (
                  <img key={i} src={item.img} alt={item.alt} />
                ))}
          </div>
        </div>
      </section>

      <section className="involved-band">
        <div className="page-wrap involved-band__inner">
          <img className="involved-band__icon" src="/assets/figma/involved-icon.png" alt="" />
          <div>
            <h2 className="involved-band__title">Want to get involved?</h2>
            <p className="involved-band__sub">
              Get in touch. Let&apos;s build your perfect team — or find your perfect job — today.
            </p>
          </div>
          <Link to="/contact-us" className="btn btn--gold-shadow">
            Contact Us <ArrowRightIcon />
          </Link>
        </div>
      </section>

      <section className="stats-strip">
        <div className="page-wrap stats-strip__inner">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <span className={`stat__icon stat__icon--${s.tint}`}>
                <img src={s.icon} alt="" />
              </span>
              <div>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="leaders-section" id="counsellors">
        <div className="page-wrap">
          <h2 className="section-heading section-heading--center section-heading--upper">
            Academic &amp; Institutional Leaders
          </h2>
          <div className="leaders-rail">
            <button
              type="button"
              className="rail-arrow rail-arrow--left"
              aria-label="Previous leaders"
              onClick={() => scrollTrack(leadersRef, -1, 247)}
            >
              ‹
            </button>
            <div className="leaders-track" ref={leadersRef}>
              {leaders.map((l) => (
                <article key={l.name} className="leader-card">
                  <img src={l.photo} alt={l.name} />
                  <h3>{l.name}</h3>
                  <p className="leader-card__role">{l.role}</p>
                  <p className="leader-card__org">
                    {l.org.split('\n').map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  {l.linkedIn && (
                    <div className="leader-card__li">
                      <a href={l.linkedIn} target="_blank" rel="noreferrer" aria-label={`${l.name} on LinkedIn`}>
                        <LinkedInIcon size={26} />
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
            <button
              type="button"
              className="rail-arrow rail-arrow--right"
              aria-label="Next leaders"
              onClick={() => scrollTrack(leadersRef, 1, 247)}
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <section className="awards-section">
        <div className="page-wrap">
          <h2 className="section-heading section-heading--center section-heading--upper">Awards And Recognitions</h2>
          <div className="awards-rail">
            <div className="awards-mascot">
              <img src="/assets/figma/award-mascot.png" alt="" />
            </div>
            <div className="awards-viewport">
              <button
                type="button"
                className="rail-arrow rail-arrow--left"
                aria-label="Previous awards"
                onClick={() => scrollTrack(awardsRef, -1, 388)}
              >
                ‹
              </button>
              <div className="awards-track" ref={awardsRef}>
                {awards.map((a) => (
                  <article key={a.label} className="award-card">
                    <img src={a.img} alt={a.label} />
                    <h3>{a.label}</h3>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="rail-arrow rail-arrow--right"
                aria-label="Next awards"
                onClick={() => scrollTrack(awardsRef, 1, 388)}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
