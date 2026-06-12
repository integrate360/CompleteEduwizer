import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getBlogs } from "../../Services/api";
import "./Blogs.css";
import BlogsAds from "./Ads";

function Blogs() {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const resp = await getBlogs();
      setData(resp.data.data);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container fluid className="blogs-container" style={{ minHeight: "100vh" }}>
      <div className="row d-flex title mb-4 mx-4">Blogs</div>
      <div className="row">
        {/* Blog Cards Section */}
        <div className="col-lg-9 col-md-8 col-sm-12">
          <div className="row">
            {data.map((element) => (
              <div
                className="shadow blog-card col-lg-3 col-md-4 col-sm-6 mb-4 mx-2 p-3"
                key={element?._id}
              >
                <div className="blog-image mb-2">
                  <img
                    src={element?.image}
                    alt="Blog"
                    className="img-fluid rounded"
                    style={{ height: "300px", maxHeight: "300px" }}
                  />
                </div>
                <div className="blog-content">
                  <h5 className="blog-title text-truncate fs-20">
                    {element?.title}
                  </h5>
                  <p className="blog-author text-muted mb-1">
                    <small>{element?.author}</small>
                  </p>
                  <p className="blog-description text-truncate">
                    {element?.description}
                  </p>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <Link
                    to={`/blogs-details/${element?._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Know More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Sidebar Section */}
        <BlogsAds />
      </div>
    </Container>
  );
}

export default Blogs;
