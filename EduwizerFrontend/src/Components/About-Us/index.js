import { useNavigate } from "react-router-dom";
import Candidates from "../../Components/Candidates";
import "./About.css";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <main className="ew-about">
      {/* ============ HERO ============ */}
      <section className="ew-about-hero ew-section">
        <div className="ew-container">
          <div className="ew-about-hero-grid">
            <div className="ew-about-media">
              <img alt="Mrs Ramneet Saini" src="/assets/images/png/brand-ambassador.png" />
              <div className="ew-media-tag">
                <span>Mrs Ramneet Saini</span>
                <span>Mrs Navi Mumbai 2021</span>
                <span>Brand Ambassador</span>
              </div>
            </div>
            <div className="ew-about-hero-text">
              <p className="ew-about-kicker">In 2018, We Rethought</p>
              <h1>Recruitment.</h1>
              <p className="ew-about-lede">
                We&apos;ve been growing Educational Institutes and careers ever
                since.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT US ============ */}
      <section className="ew-about-company ew-section">
        <div className="ew-container">
          <h2 className="ew-section-title">About Us</h2>
          <div className="ew-about-grid">
            <div className="ew-about-copy">
              <p>
                NG EDUWIZER PVT LTD is a Mumbai based MULTINATIONAL COMPANY,
                which has its wings spread globally. It has touched the stream
                of success in Singapore, Canada, Dubai markets and is now
                expanding to Europe. A company whose brand name touched the
                global markets in a very short span of time. It follows the
                Bespoke approach towards requirements of the clients. The
                company is the vision of two directors.
              </p>
              <p>
                In a time frame of few years, it has won many national and
                international awards. It caters to important mainstays of the
                industry, the education sector which is the backbone of any
                country. Senior &amp; Top position recruitments in the education
                sector are its forte. Its journey began with a seamless blend of
                academic as well as corporate professionals to procure
                excellence. Satiating towards excellence, EDUWIZER delivers the
                best professionals in today&apos;s world. India is the global
                market for education, and EDUWIZER connects elite professionals
                with the best domain services.
              </p>
            </div>
            <div className="ew-about-media">
              <img
                alt="Mr Prashant Poojari"
                src="/assets/images/png/brand-ambassador-prashant.png"
              />
              <div className="ew-media-tag">
                <span>Mr Prashant Poojari</span>
                <span>Actor</span>
                <span>Brand Ambassador</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT CEO ============ */}
      <section className="ew-about-ceo ew-section">
        <div className="ew-container">
          <h2 className="ew-section-title">About CEO</h2>
          <div className="ew-about-grid ew-about-grid--ceo">
            <div className="ew-about-media">
              <img alt="Dr. Nikkie Grover" src="/assets/images/png/ceo-dr-nikkie.png" />
            </div>
            <div className="ew-about-copy">
              <p>
                Dr. Nikkie Grover is a young, confident and determined
                personality with a diligent style of functioning, who leaves no
                stone unturned, to reach her goals. A go-getter with the zeal to
                bring success to her company. She is often referred to as a
                woman who walked her dreams in the education sector. At a very
                young age she started working as the headmistress of a reputed
                Prestige Public school &amp; then headed as Principal of City
                International Group of Schools. She worked as the youngest
                DIRECTOR of the school and was awarded as the youngest
                educationist.
              </p>
              <p>
                Being a researcher in educational management, she is able to
                deal with strategies of management and apply them in real-world
                scenarios. She brought many awards &amp; laurels for the
                company, including the INTERNATIONAL BUSINESS WOMAN AWARD IN
                DUBAI, RISING STAR AWARD, and the UDYOG BHARATI AWARD. The list
                is exhaustive. She is published in many national &amp;
                international magazines of repute.
              </p>
              <p>
                She is recognized amongst the top educators worldwide who could
                build her own brand. An inspiration to women who worked with
                dedication in the education sector for the past 19 years. She
                believes an educationist will always have the thirst for change
                in the education fraternity.
              </p>
            </div>
          </div>
          <p className="ew-about-foot-copy">
            Being a young educationist, she is able to research the new trends
            of education and apply them to new market trends. Apart from
            education, she has strong moral values and believes in the true
            values of kindness. She is an inspiring woman who believes in
            &ldquo;Bring home an abandoned girl child.&rdquo; India is a country
            where a girl child is often abandoned, especially if she is the
            third or fourth girl. Dr. Nikkie took up the lead in contributing
            back to society by stating as a member of GGA, where they propagate
            &ldquo;SAY YES TO ADOPTION OF AN ABANDONED GIRL CHILD.&rdquo; She
            also encourages many women entrepreneurs and organizes free
            campaigns for them. She is currently the Founder &amp; CEO. Her
            motto is: &ldquo;Dreams become reality when you work hard with
            dedication.&rdquo; She dreams of making education recruitment one of
            the strongest sectors.
          </p>
        </div>
      </section>

      {/* ============ YELLOW STATS BAND ============ */}
      <Candidates variant="yellow" />

      {/* ============ GET INVOLVED ============ */}
      <section className="ew-about-involved ew-section">
        <div className="ew-container" style={{ textAlign: "center" }}>
          <h2>Want to get involved?</h2>
          <p>
            Get in touch. Let&apos;s build your perfect team or find your
            perfect job today.
          </p>
          <button
            className="ew-btn ew-btn--yellow"
            onClick={() => navigate("/candidate")}
          >
            Look For Candidates
          </button>

          <h2 className="mt-block">Want to Work With Us?</h2>
          <p>
            Whether you&apos;re looking to build a team, or looking for a job,
            the best first step is to have a conversation with us. Get in touch
            today to schedule it in.
          </p>
          <button
            className="ew-btn ew-btn--yellow"
            onClick={() => navigate("/contact-us")}
          >
            Contact Us
          </button>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
