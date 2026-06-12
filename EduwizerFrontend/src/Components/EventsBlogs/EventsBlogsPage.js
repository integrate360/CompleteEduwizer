import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, getBlogs } from "../../Services/api";
import "./EventsBlogs.css";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const formatBadge = (ts) => {
  if (!ts) return null;
  const d = new Date(ts);
  return { day: String(d.getDate()).padStart(2, "0"), month: MONTHS[d.getMonth()] };
};

const formatDate = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const readTime = (text = "") =>
  `${Math.max(1, Math.round(text.split(/\s+/).length / 200))} Min Read`;

function EventsBlogsPage() {
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const eventsRef = useRef(null);
  const blogsRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getEvents();
        setEvents(response.data.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoadingEvents(false);
      }
    })();
    (async () => {
      try {
        const resp = await getBlogs();
        setBlogs(resp.data.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoadingBlogs(false);
      }
    })();
  }, []);

  const scrollTo = (ref) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const featuredEvent = events[0];
  const upcomingEvents = events.length > 1 ? events.slice(1) : events;
  const featuredBlog = blogs[0];
  const latestBlogs = blogs.length > 1 ? blogs.slice(1) : blogs;

  const SkeletonCard = () => (
    <div className="ew-event-card" style={{ opacity: 0.5 }}>
      <div className="ew-event-img" style={{ background: "#dde0ef" }} />
      <div className="ew-event-body">
        <div style={{ height: 12, background: "#dde0ef", borderRadius: 6, width: "30%", marginBottom: 12 }} />
        <div style={{ height: 18, background: "#dde0ef", borderRadius: 6, width: "75%" }} />
      </div>
    </div>
  );

  return (
    <main className="ew-eb-page">
      {/* ============ HERO ============ */}
      <section className="ew-hero ew-eb-hero">
        <img
          className="ew-hero-art"
          alt=""
          src="/assets/images/figma/hero-character.png"
        />
        <div className="ew-hero-content">
          <div className="ew-hero-badge">✦ Knowledge Hub</div>
          <h1 className="ew-hero-title">Events &amp; Blogs</h1>
          <p className="ew-hero-sub">
            Stay updated with the latest events, industry insights, and expert
            articles curated just for you.
          </p>
          <div className="ew-hero-cta">
            <button
              className="ew-btn ew-btn--yellow"
              onClick={() => scrollTo(eventsRef)}
            >
              Explore Events →
            </button>
            <button
              className="ew-btn ew-btn--outline"
              onClick={() => scrollTo(blogsRef)}
            >
              Read Insights
            </button>
          </div>
        </div>
      </section>

      {/* ============ FEATURED EVENT ============ */}
      <section className="ew-section ew-eb-featured" ref={eventsRef}>
        <div className="ew-container">
          <h2 className="ew-section-title ew-section-title--left">Featured Event</h2>
          <p className="ew-eb-section-sub">Our flagship summit for institutional change-makers.</p>

          {loadingEvents ? (
            <SkeletonCard />
          ) : !featuredEvent ? (
            <div className="ew-eb-empty">📅 No events found at the moment. Check back soon!</div>
          ) : (
            <div className="ew-feature-card">
              <div className="ew-feature-media">
                <img src={featuredEvent.image} alt={featuredEvent.title} />
                {formatBadge(featuredEvent.createdTimestamp) && (
                  <div className="ew-date-badge">
                    <b>{formatBadge(featuredEvent.createdTimestamp).day}</b>
                    <span>{formatBadge(featuredEvent.createdTimestamp).month}</span>
                  </div>
                )}
              </div>
              <div className="ew-feature-body">
                <span className="ew-tag">Event</span>
                <h3>{featuredEvent.title}</h3>
                <div className="ew-feature-meta">
                  <span>
                    <i className="fa fa-calendar-o"></i>{" "}
                    {formatDate(featuredEvent.createdTimestamp)}
                  </span>
                </div>
                <p className="ew-feature-desc">{featuredEvent.description}</p>
                <Link
                  to={`/events-details/${featuredEvent._id}`}
                  className="ew-btn ew-btn--yellow ew-btn--sm"
                >
                  Get Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ UPCOMING EVENTS ============ */}
      <section className="ew-section ew-eb-upcoming">
        <div className="ew-container">
          <h2 className="ew-section-title ew-section-title--left">Upcoming Events</h2>
          <div className="ew-eb-grid">
            {loadingEvents
              ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
              : upcomingEvents.map((event) => (
                  <div className="ew-event-card" key={event._id}>
                    <div className="ew-event-img">
                      <img src={event.image} alt={event.title} />
                      {formatBadge(event.createdTimestamp) && (
                        <div className="ew-date-badge ew-date-badge--sm">
                          <b>{formatBadge(event.createdTimestamp).day}</b>
                          <span>{formatBadge(event.createdTimestamp).month}</span>
                        </div>
                      )}
                    </div>
                    <div className="ew-event-body">
                      <span className="ew-tag ew-tag--plain">Event</span>
                      <h3>
                        <Link to={`/events-details/${event._id}`}>{event.title}</Link>
                      </h3>
                      <Link
                        to={`/events-details/${event._id}`}
                        className="ew-eb-more"
                      >
                        Get Details →
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED BLOG ============ */}
      <section className="ew-section ew-eb-featured" ref={blogsRef}>
        <div className="ew-container">
          <h2 className="ew-section-title ew-section-title--left">Featured Blog</h2>

          {loadingBlogs ? (
            <SkeletonCard />
          ) : !featuredBlog ? (
            <div className="ew-eb-empty">📰 No blogs published yet. Stay tuned!</div>
          ) : (
            <div className="ew-feature-card ew-feature-card--reverse">
              <div className="ew-feature-body">
                <span className="ew-tag">Blog</span>
                <h3>{featuredBlog.title}</h3>
                <div className="ew-feature-meta">
                  {featuredBlog.author && (
                    <span className="ew-author">
                      <span className="ew-author-avatar">
                        {featuredBlog.author.charAt(0).toUpperCase()}
                      </span>
                      By {featuredBlog.author}
                    </span>
                  )}
                  <span>
                    {readTime(featuredBlog.description)} •{" "}
                    {formatDate(featuredBlog.createdTimestamp)}
                  </span>
                </div>
                <p className="ew-feature-desc">{featuredBlog.description}</p>
                <Link
                  to={`/blogs-details/${featuredBlog._id}`}
                  className="ew-btn ew-btn--yellow ew-btn--sm"
                >
                  Read Full Article
                </Link>
              </div>
              <div className="ew-feature-media">
                <img src={featuredBlog.image} alt={featuredBlog.title} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ LATEST INSIGHTS ============ */}
      <section className="ew-section ew-eb-upcoming">
        <div className="ew-container">
          <h2 className="ew-section-title ew-section-title--left">Latest Insights</h2>
          <div className="ew-eb-grid">
            {loadingBlogs
              ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
              : latestBlogs.map((blog) => (
                  <div className="ew-event-card" key={blog._id}>
                    <div className="ew-event-img">
                      <img src={blog.image} alt={blog.title} />
                    </div>
                    <div className="ew-event-body">
                      <span className="ew-tag ew-tag--plain">Blog</span>
                      <h3>
                        <Link to={`/blogs-details/${blog._id}`}>{blog.title}</Link>
                      </h3>
                      <div className="ew-eb-meta">
                        {readTime(blog.description)} • {formatDate(blog.createdTimestamp)}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default EventsBlogsPage;
