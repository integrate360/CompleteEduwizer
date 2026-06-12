import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, ClockIcon, PinIcon, VideoIcon } from '../components/icons'
import { getBlogs, getEvents, type BlogItem, type EventItem } from '../services/api'
import Seo from '../components/Seo'

const fmtDate = (ts?: string) =>
  ts
    ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

const readTime = (text = '') => `${Math.max(1, Math.round(text.split(/\s+/).length / 200))} Min Read`

const fallbackEvents = [
  {
    img: '/assets/figma/event-1.png',
    cat: 'Workshop',
    title: 'School Infrastructure Planning Workshop',
    place: 'New Delhi',
    online: false,
  },
  {
    img: '/assets/figma/event-2.png',
    cat: 'Seminar',
    title: 'Academic Leadership Seminar 2026',
    place: 'Bangalore',
    online: false,
  },
  {
    img: '/assets/figma/event-3.png',
    cat: 'Expo',
    title: 'Education Innovation Expo',
    place: 'Hyderabad',
    online: false,
  },
  {
    img: '/assets/figma/event-4.png',
    cat: 'Webinar',
    title: 'Digital Transformation in Admissions',
    place: 'Online',
    online: true,
  },
]

const fallbackInsights = [
  {
    img: '/assets/figma/insight-1.png',
    cat: 'Infrastructure',
    title: 'Top 7 Must-Have Spaces in a Modern School',
    meta: '6 Min Read • May 18, 2026',
  },
  {
    img: '/assets/figma/insight-2.png',
    cat: 'Academics',
    title: 'Emerging Trends in K-12 Education',
    meta: '7 Min Read • May 15, 2026',
  },
  {
    img: '/assets/figma/insight-3.png',
    cat: 'Technology',
    title: 'How EdTech is Shaping the Future',
    meta: '5 Min Read • May 12, 2026',
  },
  {
    img: '/assets/figma/insight-4.png',
    cat: 'Admissions',
    title: 'How to Build a Strong School Brand',
    meta: '6 Min Read • May 10, 2026',
  },
]

export default function EventsPage() {
  const [apiEvents, setApiEvents] = useState<EventItem[]>([])
  const [apiBlogs, setApiBlogs] = useState<BlogItem[]>([])

  useEffect(() => {
    getEvents().then((r) => setApiEvents(r.data ?? [])).catch(() => {})
    getBlogs().then((r) => setApiBlogs(r.data ?? [])).catch(() => {})
  }, [])

  const featuredEvent = apiEvents[0]
  const gridEvents = apiEvents.length > 1 ? apiEvents.slice(1) : apiEvents
  const featuredBlog = apiBlogs[0]
  const gridBlogs = apiBlogs.length > 1 ? apiBlogs.slice(1) : apiBlogs

  return (
    <main>
      <Seo
        title="Events & Blogs"
        description="Stay updated with the latest education events, industry insights and expert articles from NG Eduwizer — workshops, seminars, expos and leadership blogs for educators."
        path="/events-blogs"
      />
      <section className="hero">
        <div className="page-wrap hero__inner">
          <div>
            <span className="hero__chip hero__chip--plain">✦ Knowledge Hub</span>
            <h1 className="hero__title">Events &amp; Blogs</h1>
            <p className="hero__sub">
              Stay updated with the latest events, industry insights, and expert articles curated
              just for you.
            </p>
            <div className="hero__actions" style={{ marginBottom: 72 }}>
              <a href="#upcoming-events" className="btn btn--gold">
                Explore Events <ArrowRightIcon />
              </a>
              <a href="#latest-insights" className="btn btn--dark-outline">Read Insights</a>
            </div>
          </div>
          <div className="hero__visual">
            <img src="/assets/legacy/png/headline-boy.png" alt="Eduwizer mascot" />
          </div>
        </div>
      </section>

      <section className="featured-event-section">
        <div className="page-wrap">
          <div className="featured-event-head">
            <div>
              <h2 className="section-heading section-heading--left">Featured Event</h2>
              <p className="featured-event-head__sub">
                Our flagship summit for institutional change-makers.
              </p>
            </div>
            <div className="featured-event-head__arrows">
              <button type="button" className="circle-arrow" aria-label="Previous event">‹</button>
              <button type="button" className="circle-arrow" aria-label="Next event">›</button>
            </div>
          </div>
          <article className="featured-event-card">
            <div className="featured-event-card__poster">
              <img
                src={featuredEvent?.image ?? '/assets/figma/event-featured-poster.png'}
                alt={featuredEvent?.title ?? 'Featured event poster'}
              />
            </div>
            <div className="featured-event-card__body">
              <span className="eyebrow">Event</span>
              <h2 className="featured-event-card__title">
                {featuredEvent?.title ?? 'Future of Education Summit 2026'}
              </h2>
              {featuredEvent?.createdTimestamp && (
                <div className="icon-line">
                  <ClockIcon /> {fmtDate(featuredEvent.createdTimestamp)}
                </div>
              )}
              <p className="featured-event-card__text">
                {featuredEvent?.description ??
                  'Join leading educators, policymakers and innovators to discuss the future of learning, school infrastructure and student success.'}
              </p>
              <Link
                to={featuredEvent ? `/events-details/${featuredEvent._id}` : '/contact-us'}
                className="btn btn--gold"
              >
                Get Details
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="upcoming-section" id="upcoming-events">
        <div className="page-wrap">
          <h2 className="section-heading section-heading--left">Upcoming Events</h2>
          <div className="event-grid">
            {gridEvents.length
              ? gridEvents.map((e) => (
                  <article key={e._id} className="event-card">
                    <img src={e.image} alt={e.title} />
                    <div className="event-card__body">
                      <span className="event-card__cat">Event</span>
                      <h3>{e.title}</h3>
                      <div className="event-card__meta">
                        <PinIcon size={17} /> {fmtDate(e.createdTimestamp) || 'Eduwizer'}
                      </div>
                      <Link to={`/events-details/${e._id}`} className="event-card__link">
                        Get Details <ArrowRightIcon size={16} />
                      </Link>
                    </div>
                  </article>
                ))
              : fallbackEvents.map((e) => (
                  <article key={e.title} className="event-card">
                    <img src={e.img} alt={e.title} />
                    <div className="event-card__body">
                      <span className="event-card__cat">{e.cat}</span>
                      <h3>{e.title}</h3>
                      <div className="event-card__meta">
                        {e.online ? <VideoIcon /> : <PinIcon size={17} />} {e.place}
                      </div>
                      <Link to="/contact-us" className="event-card__link">
                        Get Details <ArrowRightIcon size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      <section className="featured-blog-section">
        <div className="page-wrap">
          <h2 className="section-heading section-heading--left">Featured Blog</h2>
          <article className="featured-blog-card">
            <div className="featured-blog-card__body">
              <span className="eyebrow">Blog</span>
              <h2 className="featured-blog-card__title">
                {featuredBlog?.title ?? 'How Visionary Leadership Transforms Schools'}
              </h2>
              <div className="byline">
                <img src="/assets/figma/blog-author.png" alt="" />
                <div>
                  <strong>By {featuredBlog?.author ?? 'Dr. Neha Sharma'}</strong>
                  <span>
                    {featuredBlog
                      ? `${readTime(featuredBlog.description)} • ${fmtDate(featuredBlog.createdTimestamp)}`
                      : '8 Min Read • May 20, 2026'}
                  </span>
                </div>
              </div>
              <p className="featured-blog-card__text">
                {featuredBlog?.description ??
                  'Effective leadership is the key to building future-ready institutions. Learn how school leaders can inspire change and drive long-term success through strategic empathy and operational excellence.'}
              </p>
              <Link
                to={featuredBlog ? `/blogs-details/${featuredBlog._id}` : '/contact-us'}
                className="btn btn--gold"
              >
                Read Full Article
              </Link>
            </div>
            <div className="featured-blog-card__img">
              <img
                src={featuredBlog?.image ?? '/assets/figma/blog-featured.png'}
                alt={featuredBlog?.title ?? 'Featured blog'}
              />
            </div>
          </article>
        </div>
      </section>

      <section className="insights-section" id="latest-insights">
        <div className="page-wrap">
          <h2 className="section-heading section-heading--left">Latest Insights</h2>
          <div className="insight-grid">
            {gridBlogs.length
              ? gridBlogs.map((b) => (
                  <article key={b._id} className="insight-card">
                    <img src={b.image} alt={b.title} />
                    <span className="event-card__cat">Blog</span>
                    <h3>
                      <Link to={`/blogs-details/${b._id}`}>{b.title}</Link>
                    </h3>
                    <time>{`${readTime(b.description)} • ${fmtDate(b.createdTimestamp)}`}</time>
                  </article>
                ))
              : fallbackInsights.map((i) => (
                  <article key={i.title} className="insight-card">
                    <img src={i.img} alt={i.title} />
                    <span className="event-card__cat">{i.cat}</span>
                    <h3>{i.title}</h3>
                    <time>{i.meta}</time>
                  </article>
                ))}
          </div>
        </div>
      </section>
    </main>
  )
}
