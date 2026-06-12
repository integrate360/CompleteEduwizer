import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getEvents, getBlogs } from "../../Services/api";
import BlogsAds from "../Blogs/Ads";
import "./EventsBlogs.css";

function EventsBlogsPage() {
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  /* ---- Data Fetching ---- */
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await getEvents();
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const resp = await getBlogs();
      setBlogs(resp.data.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchBlogs();
  }, []);

  /* ---- Skeleton loaders ---- */
  const SkeletonEvent = () => (
    <div className="eb-event-card" style={{ opacity: 0.5 }}>
      <div className="eb-event-img-wrap" style={{ background: "#dde0ef", minHeight: 190 }} />
      <div className="eb-event-body">
        <div style={{ height: 12, background: "#dde0ef", borderRadius: 6, width: "30%", marginBottom: 12 }} />
        <div style={{ height: 20, background: "#dde0ef", borderRadius: 6, width: "70%", marginBottom: 10 }} />
        <div style={{ height: 12, background: "#dde0ef", borderRadius: 6, width: "90%", marginBottom: 6 }} />
      </div>
    </div>
  );

  const SkeletonBlog = () => (
    <div className="eb-blog-card" style={{ opacity: 0.5 }}>
      <div className="eb-blog-img-wrap" style={{ background: "#dde0ef" }} />
      <div className="eb-blog-body">
        <div style={{ height: 10, background: "#dde0ef", borderRadius: 6, width: "40%", marginBottom: 10 }} />
        <div style={{ height: 16, background: "#dde0ef", borderRadius: 6, width: "80%", marginBottom: 8 }} />
        <div style={{ height: 10, background: "#dde0ef", borderRadius: 6, width: "90%" }} />
      </div>
    </div>
  );

  return (
    <div className="eb-page">

      {/* ===================== HERO ===================== */}
      <div className="eb-hero">
        <Container>
          <div className="eb-hero-inner">
            <div className="eb-hero-content">
              <div className="eb-hero-badge">✦ Knowledge Hub</div>
              <h1 className="eb-hero-title">
                Events &amp; <span>Blogs</span>
              </h1>
              <p className="eb-hero-subtitle">
                Stay updated with the latest events, industry insights, and expert
                articles curated just for you.
              </p>
            </div>
            <div className="eb-hero-character-wrap">
              <img
                src="/assets/images/png/headline-boy.png"
                alt="Character"
                className="eb-hero-character"
              />
            </div>
          </div>
        </Container>
      </div>

      {/* ===================== CONTENT ===================== */}
      <div className="eb-content">
        <Container>
          <Row>
            {/* ---- Main Panel ---- */}
            <Col lg={9} md={8} sm={12}>

              {/* ========== EVENTS SECTION ========== */}
              <div className="eb-section-heading">
                <div className="eb-section-icon">🎯</div>
                <div className="eb-section-label">
                  Our Events
                  <small>Discover and explore events near you</small>
                </div>
                <hr className="eb-divider" />
              </div>

              {loadingEvents ? (
                [1, 2, 3].map((i) => <SkeletonEvent key={i} />)
              ) : events.length === 0 ? (
                <div className="eb-empty">
                  <div className="eb-empty-icon">📅</div>
                  <p>No events found at the moment. Check back soon!</p>
                </div>
              ) : (
                events.map((event, index) => (
                  <div className="eb-event-card" key={`event-${index}`}>
                    <div className="eb-event-img-wrap">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="eb-event-img"
                      />
                    </div>
                    <div className="eb-event-body">
                      <p className="eb-event-category">Event</p>
                      <h2 className="eb-event-title">
                        <Link to={`/events-details/${event?._id}`}>
                          {event.title}
                        </Link>
                      </h2>
                      <p className="eb-event-desc">{event.description}</p>
                      <div className="eb-event-footer">
                        <Link to={`/events-details/${event?._id}`} className="eb-btn-know-more">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* ========== BLOGS SECTION ========== */}
              <div className="eb-section-heading" style={{ marginTop: 48 }}>
                <div className="eb-section-icon">📝</div>
                <div className="eb-section-label">
                  Latest Blogs
                  <small>Expert articles and industry insights</small>
                </div>
                <hr className="eb-divider" />
              </div>

              {loadingBlogs ? (
                [1, 2, 3].map((i) => <SkeletonEvent key={i} />)
              ) : blogs.length === 0 ? (
                <div className="eb-empty">
                  <div className="eb-empty-icon">📰</div>
                  <p>No blogs published yet. Stay tuned!</p>
                </div>
              ) : (
                blogs.map((blog, index) => (
                  <div className="eb-event-card" key={`blog-${index}`}>
                    <div className="eb-event-img-wrap">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="eb-event-img"
                      />
                    </div>
                    <div className="eb-event-body">
                      <p className="eb-event-category">Blog</p>
                      <h2 className="eb-event-title">
                        <Link to={`/blogs-details/${blog?._id}`}>
                          {blog.title}
                        </Link>
                      </h2>
                      {blog.author && (
                        <p className="eb-blog-author" style={{ fontSize: "0.8rem", color: "#999", marginBottom: 8 }}>
                          ✍️ {blog.author}
                        </p>
                      )}
                      <p className="eb-event-desc">{blog.description}</p>
                      <div className="eb-event-footer">
                        <Link to={`/blogs-details/${blog?._id}`} className="eb-btn-know-more">
                          Know More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Col>

            {/* ---- Sidebar ---- */}
            <BlogsAds />
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default EventsBlogsPage;
