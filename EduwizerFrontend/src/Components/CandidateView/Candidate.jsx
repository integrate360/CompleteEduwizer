import React from "react";
import Profile from "./Profile";
import Feature from "./Feature";
import Award from "./Award";
import About from "./About";
import EESL from "./EESL";
import Review from "./Review"
import "./Candidate.jsx";
function Candidate() {
  return (
    <div className="main-div">
      <div className="content-div">
        <Profile />
        <Feature />
        <Award />
        <About />
        <EESL />
        <Review />
      </div>
      <div className="ad-div"></div>
    </div>
  );
}

export default Candidate;
