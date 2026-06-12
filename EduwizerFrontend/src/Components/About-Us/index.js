import { Link, useNavigate } from "react-router-dom";
import Candidates from "../../Components/Candidates";
import Subscribe from "../../Components/Subscribe";

import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./index.css";

const AboutUs = () => {
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  return (
    <div className="about-us page pt-5">
      <section className="learn-more">
        <div className="section-content">
          <div
            className={
              isMobile ? "image-container img-cont-mobile" : "image-container"
            }
          >
            <div className="image-content">
              <img
                className="image"
                alt=""
                src="/assets/images/png/brand-ambassador.png"
              />
              <div className="image-detail">
                <span>Mrs Ramneet Saini</span>
                <span>Mrs Navi Mumbai 2021</span>
                <span>Brand Ambassador</span>
              </div>
            </div>
          </div>
          <div className="text-container text-md-left" style={{ flex: "2" }}>
            <h2 className={isMobile ? "fs-3 nowrap" : "fs-4"}>
              In 2018, We Rethought
              <br />
              <h1> Recruitment.</h1>
              <br />
            </h2>
            <p className={isMobile ? "fs-5 nowrap" : "fs-2"}>
              We’ve been growing Educational
              <br />
              Institutes and careers ever since.
            </p>
          </div>
        </div>
      </section>
      <section className="about-us-actor">
        <h1 className="section-head text-center">About Us</h1>
        <div className="section-content">
          <div className="text-container">
            <p className={isMobile ? "fs-1" : ""}>
              <span>
                NG EDUWIZER PVT LTD is a Mumbai based MULTINATIONAL COMPANY,
                which has its wings spread globally. It has touched the stream
                of success in Singapore, Canada, Dubai markets and is now
                expanding to Europe. A company whose brand name touched the
                global markets in a very short span of time. It follows the
                Bespoke approach towards requirements of the clients. The
                company is the vision of two directors.
              </span>
              <br></br>
              <span>
                In a time frame of few years, it has won many national and
                international awards. It caters to important mainstays of the
                industry, the education sector which is the backbone of any
                country. Senior & Top position recruitments in the education
                sector are its forte. Its journey began with a seamless blend of
                academic as well as corporate professionals to procure
                excellence. Satiating towards excellence, EDUWIZER delivers the
                best professionals in today's world. India is the global market
                for education, and EDUWIZER connects elite professionals with
                the best domain services.
              </span>
            </p>
          </div>
          <div
            className={
              isMobile ? "image-container img-cont-mobile" : "image-container"
            }
          >
            <div className="image-content">
              <img
                className="image"
                alt=""
                src="/assets/images/png/brand-ambassador-prashant.png"
              />
              <div className="image-detail">
                <span>Mr Prashant Poojari</span>
                <span>Actor</span>
                <span>Brand Ambassador</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="about-us-ceo">
        <h1 style={{ marginTop: "20px" }} className="section-head text-center">
          About CEO
        </h1>
        <div className="section-content">
          <div
            className={
              isMobile ? "image-container img-cont-mobile" : "image-container"
            }
          >
            <div className="image-content">
              <img
                className="image"
                alt=""
                src="/assets/images/png/ceo-dr-nikkie.png"
              />
            </div>
          </div>
          <div className="text-container">
            <span className={isMobile ? "fs-1" : ""}>
              Dr. Nikkie Grover is a young, confident and determined personality
              with a diligent style of functioning, who leaves no stone
              unturned, to reach her goals. A go-getter with the zeal to bring
              success to her company. She is often referred to as a woman who
              walked her dreams in the education sector. At a very young age she
              started working as the headmistress of a reputed Prestige Public
              school & then headed as Principal of City International Group of
              Schools. She worked as the youngest DIRECTOR of the school and was
              awarded as the youngest educationist.
            </span>
            <span className={isMobile ? "fs-1" : ""}>
              Being a researcher in educational management, she is able to deal
              with strategies of management and apply them in real-world
              scenarios. She brought many awards & laurels for the company,
              including the INTERNATIONAL BUSINESS WOMAN AWARD IN DUBAI, RISING
              STAR AWARD, and the UDYOG BHARATI AWARD. The list is exhaustive.
              She is published in many national & international magazines of
              repute.
            </span>
            <span className={isMobile ? "fs-1" : ""}>
              She is recognized amongst the top educators worldwide who could
              build her own brand. An inspiration to women who worked with
              dedication in the education sector for the past 19 years. She
              believes an educationist will always have the thirst for change in
              the education fraternity.
            </span>
          </div>
        </div>
        <div className="section-foot">
          <p className={isMobile ? "fs-1" : ""}>
            Being a young educationist, she is able to research the new trends
            of education and apply them to new market trends. Apart from
            education, she has strong moral values and believes in the true
            values of kindness. She is an inspiring woman who believes in “Bring
            home an abandoned girl child.” India is a country where a girl child
            is often abandoned, especially if she is the third or fourth girl.
            Dr. Nikkie took up the lead in contributing back to society by
            stating as a member of GGA, where they propagate “SAY YES TO
            ADOPTION OF AN ABANDONED GIRL CHILD.” She also encourages many women
            entrepreneurs and organizes free campaigns for them. She is
            currently the Founder & CEO. Her motto is: "Dreams become reality
            when you work hard with dedication." She dreams of making education
            recruitment one of the strongest sectors.
          </p>
        </div>
      </section>

      <Candidates></Candidates>

      <section className="want-to">
        <h1 className={isMobile ? "mobile-h1" : ""}>Want to get involved?</h1>
        <p className={isMobile ? "fs-1" : ""}>
          Get in touch. Let’s build your perfect team or find your perfect job
          today.
        </p>
        <div className="btn-group w-auto">
          <Button
            className="m-btn"
            variant="warning"
            onClick={() => navigate("/candidate")}
          >
            <div className="btn-text">Look For Candidates</div>
          </Button>
        </div>
      </section>

      <section className="want-to">
        <h1 className={isMobile ? "mobile-h1" : ""}>Want to Work With Us?</h1>
        <h3 className="want-text">
          <span className={isMobile ? "fs-1" : ""}>
            Whether you’re looking to build a team, or looking for a job, the
            best first step is to
          </span>
          <span className={isMobile ? "fs-1" : ""}>
            have a conversation with us. Get in touch today to schedule it in.
          </span>
        </h3>
        <div className="btn-group w-auto">
          <Button className="m-btn" variant="warning">
            <Link to="/contact-us">Contact Us</Link>
          </Button>
        </div>
      </section>

      <Subscribe bg={true} subHead={true}></Subscribe>
    </div>
  );
};

export default AboutUs;
