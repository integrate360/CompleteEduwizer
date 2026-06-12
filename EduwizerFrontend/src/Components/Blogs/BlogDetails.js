import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { getBlogsById } from "../../Services/api";
import BlogsAds from "./Ads";
import "./Blogs.css";
import { Editor, EditorState, convertFromRaw } from "draft-js";

function BlogDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async (id) => {
    try {
      const resp = await getBlogsById(id);
      if (resp.data.success === 1 && resp.data.data.length > 0) {
        setData(resp.data.data[0]);
      }
    } catch (error) {
      console.log("Error fetching blog details: ", error);
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
      <div className="bd-loading">
        <div className="bd-spinner" />
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bd-not-found">
        <div className="bd-nf-icon">📭</div>
        <h2>Blog not found</h2>
        <p>The blog you're looking for doesn't exist or has been removed.</p>
        <Link to="/events-blogs" className="bd-back-btn">← Back to Blogs</Link>
      </div>
    );
  }

  const editorState = data.data ? parseEditorState(data.data) : null;
  // Check if editor state contains actual text content (DraftJS can be empty block)
  const hasContent = editorState 
    ? editorState.getCurrentContent().hasText() 
    : (data.data && data.data.trim() !== "");

  return (
    <div className="bd-page">
      {/* Hero Banner */}
      <div className="bd-hero">
        {data.image && (
          <img src={data.image} alt={data.title} className="bd-hero-img" />
        )}
        <div className="bd-hero-overlay">
          <div className="bd-hero-content-wrapper">
            <div className="bd-hero-badges-flex">
              <Link to="/events-blogs" className="bd-back-badge">
                ← Back to Hub
              </Link>
              <div className="bd-hero-badge">📝 Blog Post</div>
            </div>
            <h1 className="bd-hero-title">{data.title}</h1>
            {data.author && (
              <p className="bd-hero-author">
                ✍️ Published by <strong>{data.author}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <Container className="bd-container">
        <Row className="g-4">
          <Col lg={9} md={8} sm={12}>
            <div className="bd-card">
              {data.description && (
                <div className="bd-section">
                  <h2 className="bd-section-title">Overview</h2>
                  <div className="bd-description">{data.description}</div>
                </div>
              )}

              {hasContent && (
                <div className="bd-section bd-content-data">
                  <h2 className="bd-section-title">Content</h2>
                  {editorState ? (
                    <Editor editorState={editorState} readOnly={true} />
                  ) : (
                    <div className="bd-description">{data.data}</div>
                  )}
                </div>
              )}

              {data.author && (
                <div className="bd-author-box">
                  <div className="bd-author-avatar">
                    {data.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="bd-author-label">Author</div>
                    <div className="bd-author-name">{data.author}</div>
                  </div>
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

export default BlogDetails;
