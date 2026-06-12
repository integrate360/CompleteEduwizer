import React from "react";
import "./Candidate.jsx";

const About = () => {
  return (
    <div className="about">
      <h1>About</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
        dignissim rutrum dui quis malesuada. Nam id dapibus augue. Nulla
        convallis condimentum orci, et varius eros semper in Lorem ipsum dolor
        sit amet, consectetur adipiscing elit. Curabitur dignissim rutrum dui
        quis malesuada. Nam id dapibus augue. Nulla convallis condimentum orci,
        et varius eros semper in Nulla convallis condimentum or....
      </p>

      <div className="flexDiv">
        <div className="leftDiv">
          <h3>Contact Info</h3>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non, sed
            officiis in quam reiciendis veritatis eligendi voluptatem excepturi
            cumque autem quidem, ad ullam voluptate eos laborum. Nulla,
            repudiandae maxime. Omnis.
          </p>
        </div>
        <div className="rightDiv">
          <h3>Other Info</h3>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non, sed
            officiis in quam reiciendis veritatis eligendi voluptatem excepturi
            cumque autem quidem, ad ullam voluptate eos laborum. Nulla,
            repudiandae maxime. Omnis.
          </p>
        </div>
      </div>
      <hr />
      <p className="pCen">See more</p>
    </div>
  );
};

export default About;
