import React from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import "./Candidate.jsx";
const Review = () => {
  return (
    <div className="review">
      <h1>Reviews</h1>
      <div className="review-flex">
        <div className="left-review">
          <div className="info-review">
            <div className="img"></div>
            <div className="rev-content">
              <h3>Name</h3>
              <div className="stars">
                <MDBIcon icon="star" size="lg" className="star" />
                <MDBIcon icon="star" size="lg" className="star" />
                <MDBIcon icon="star" size="lg" className="star" />
                <MDBIcon icon="star" size="lg" className="star" />
                <MDBIcon icon="star" size="lg" className="star" />
              </div>
            </div>
          </div>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            eaque nesciunt praesentium dolor animi atque commodi natus
            voluptatibus aperiam magnam.
          </p>
          <span>Day Month Year</span>
        </div>
        <div className="right-review">
          <div className="info-review">
            <div className="img"></div>
            <div className="rev-content">
              <h3>Name</h3>
              <div className="stars">
                <MDBIcon icon="star" size="lg" className="star" />
                <MDBIcon icon="star" size="lg" className="star" />
                <MDBIcon icon="star" size="lg" className="star" />
                <MDBIcon icon="star" size="lg" className="star" />
                <MDBIcon icon="star" size="lg" className="star" />
              </div>
            </div>
          </div>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            eaque nesciunt praesentium dolor animi atque commodi natus
            voluptatibus aperiam magnam.
          </p>
          <span>Day Month Year</span>
        </div>
      </div>
      <hr />
      <p className="pCen">See more</p>
    </div>
  );
};

export default Review;
