import React from "react";
import profilePic from "../../../src/Assests/Images/image356.png";
import "./Candidate.jsx";

function Profile() {
  return (
    <div className="profile-info">
      <div className="profile-bg"></div>
      <div className="profile-img">
        <img src={profilePic} alt="profile pic" />
      </div>
      <div className="candidate-info">
        <h1>Candidate Name</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing
          <br /> elit. Curabitur dignissim rutrum dui quis malesuada. <br />
          Nam id dapibus augue. Nulla convallis <br />
          condimentum orci, et varius eros semper in
        </p>
      </div>
      <div className="info-btn">
        <div className="left">
          <button className="nav-btn">Message</button>
          <button className="nav-btn">Follow</button>
        </div>
        <div className="right">
          <button>No. of Followers</button>
          <button>No. of Followings</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
