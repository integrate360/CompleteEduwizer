import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { getEventsById } from "../../Services/api";
import BlogsAds from "../Blogs/Ads";
import "./Events.css";
import { Editor, EditorState, convertFromRaw } from "draft-js";

function EventDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async (id) => {
    try {
      const resp = await getEventsById(id);
      if (resp.data.success === 1 && resp.data.data.length > 0) {
        setData(resp.data.data[0]);
      }
    } catch (error) {
      console.log("Error fetching event details: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(id);
    window.scrollTo(0, 0);
  }, [id]);

  const parseEditorState = (rawData) => {
    try {
      return EditorState.createWithContent(convertFromRaw(JSON.parse(rawData)));
    } catch (e) {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="ed-loading">
        <div className="ed-spinner" />
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ed-not-found">
        <div className="ed-nf-icon">📭</div>
        <h2>Event not found</h2>
        <p>The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events-blogs" className="ed-back-btn">← Back to Events</Link>
      </div>
    );
  }

  const editorState = data.data ? parseEditorState(data.data) : null;
  // Check if editor state contains actual text content (DraftJS can be empty block)
  const hasHighlights = editorState 
    ? editorState.getCurrentContent().hasText() 
    : (data.data && data.data.trim() !== "");

  const hasMeta = data.date || data.location;

  return (
    <div className="ed-page">
      {/* Hero Banner */}
      <div className="ed-hero">
        {data.image && (
          <img src={data.image} alt={data.title} className="ed-hero-img" />
        )}
        <div className="ed-hero-overlay">
          <div className="ed-hero-content-wrapper">
            <div className="ed-hero-badges-flex">
              <Link to="/events-blogs" className="ed-back-badge">
                ← Back to Hub
              </Link>
              <div className="ed-hero-badge">🎯 Event Detail</div>
            </div>
            <h1 className="ed-hero-title">{data.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <Container className="ed-container">
        <Row className="g-4">
          <Col lg={9} md={8} sm={12}>
            <div className="ed-card">
              {data.description && (
                <div className="ed-section">
                  <h2 className="ed-section-title">About this Event</h2>
                  <div className="ed-description">{data.description}</div>
                </div>
              )}

              {hasHighlights && (
                <div className="ed-section ed-content-data">
                  {editorState ? (
                    <Editor editorState={editorState} readOnly={true} />
                  ) : (
                    <div className="ed-description">{data.data}</div>
                  )}
                </div>
              )}

              {hasMeta && (
                <div className="ed-meta-box">
                  <h3 className="ed-meta-box-title">Event Schedule &amp; Venue</h3>
                  
                  {data.date && (
                    <div className="ed-meta-row">
                      <span className="ed-meta-icon">📅</span>
                      <div>
                        <div className="ed-meta-label">Date &amp; Time</div>
                        <div className="ed-meta-text">
                          {new Date(data.date).toLocaleDateString("en-IN", {
                            dateStyle: "full",
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {data.location && (
                    <div className="ed-meta-row">
                      <span className="ed-meta-icon">📍</span>
                      <div>
                        <div className="ed-meta-label">Location / Venue</div>
                        <div className="ed-meta-text">{data.location}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Col>
          <BlogsAds />
        </Row>
      </Container>
    </div>
  );
}

export default EventDetails;
