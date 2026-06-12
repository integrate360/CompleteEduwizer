import axios from "axios";
import React, { useEffect, useState } from "react";
import { getAds } from "../../Services/api";
import { Link, useNavigate } from "react-router-dom";

const BlogsAds = () => {
  const [sideData, setSideData] = useState([]);
  const navigate = useNavigate();
  const getData = async () => {
    try {
      const resp = await getAds();
      if (resp.status == 200 && resp.data.data.length > 0) {
        setSideData(resp.data.data); // Set the first blog in the response
        console.log(resp.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData(); // Fetch blog details when component mounts or when id changes
  }, []);

  return (
    <div className="col-lg-3 col-md-4 col-sm-12">
      <p
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        Advertisments
      </p>
      <div className="d-flex flex-column">
        {sideData?.map((element, index) => (
          <Link
            key={index}
            className="side mb-3"
            to={element?.link}
            target="_blank"
            // onClick={() => navigate(`${element?.link}`)}
          >
            <img
              src={element?.image || ""}
              alt="ads"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogsAds;
