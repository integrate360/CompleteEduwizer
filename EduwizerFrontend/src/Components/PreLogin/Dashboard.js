import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../../Assests/Logo/logo.png";
import Candidates from "../Candidates";
import "./Home.css";
import { Lightbox } from "react-modal-image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import {
  getFeaturedLists,
  getAboutChancellors,
  getAwardsAndRecognitions,
} from "../../Services/api";

const ABOUT_US_DESC = `Globalization of education has been the real game changer in today’s world. The word “world is flat” has made quite a large impact today on the education sector. Education jobs are no longer country centered. Requirement of quality educators across the globe is need of the hour. With growing globalization educations is now considered intertwined & a global search to facilitate quality educators across the globe is required. NG Eduwizer fulfils the need of excellent educators with comprehensive resource staff in this portal. We believe to satisfy both the client and the clienteles. NG Eduwizer is one of its first kind database in the education sector which has exhaustive data to achieve meeting excellence in education related to all domains of education by following a seamless and systematic approach. This portal is specially designed to fulfil the need to filter out the best of educators. Just as our tag line says “The first comprehensive educator’s database portal“`;

const WHY_CHOOSE_US = [
  { img: "/assets/images/figma/why-icon-1.png", title: "First comprehensive database" },
  { img: "/assets/images/figma/why-icon-2.png", title: "Specially designed for educators" },
  { img: "/assets/images/figma/why-icon-3.png", title: "Be Spoke approach" },
  { img: "/assets/images/figma/why-icon-4.png", title: "Exclusively designed for Education Sector" },
  { img: "/assets/images/figma/why-icon-5.png", title: "User friendly interface" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { loginData } = useSelector((store) => store.dataReducer);

  const [show, setShow] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(false);
  const [featuredLists, setFeaturedLists] = useState([]);
  const [aboutChancellors, setAboutChancellors] = useState([]);
  const [awardsAndRecognitions, setAwardsAndRecognitions] = useState([]);

  const leadersRef = useRef(null);
  const awardsRef = useRef(null);

  const scrollBy = (ref, shift) => {
    if (ref.current) ref.current.scrollLeft += shift;
  };

  const openLightbox = (url) => {
    setShow(true);
    setModalImageUrl(url || Logo);
  };

  useEffect(() => {
    (async () => {
      try {
        const [featured, chancellors, awards] = await Promise.all([
          getFeaturedLists(),
          getAboutChancellors(),
          getAwardsAndRecognitions(),
        ]);
        setFeaturedLists(featured.data.data || []);
        setAboutChancellors(chancellors.data.data || []);
        setAwardsAndRecognitions(awards.data.data || []);
      } catch (error) {
        console.error("Error loading home page data:", error);
      }
    })();
  }, []);

  return (
    <main className="ew-home">
      {/* ============ HERO ============ */}
      <section className="ew-home-hero">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          loop={true}
        >
          <SwiperSlide>
            <div className="ew-hero ew-hero-slide">
              <img
                className="ew-hero-art"
                alt=""
                src="/assets/images/figma/hero-character.png"
              />
              <div className="ew-hero-content">
                <div className="ew-hero-badge">Eduwizer Is An Ecosystem</div>
                <h1 className="ew-hero-title">
                  The First Comprehensive{" "}
                  <span className="hl">Educator&apos;s Database Portal</span>
                </h1>
                <p className="ew-hero-sub">
                  Connecting talented educators with leading institutions
                  worldwide. Subscribe, relax, as our recruitment specialists
                  work on your CV which reaches 1000+ education institutes.
                </p>
                {loginData ? (
                  <h2 style={{ fontSize: 26, fontWeight: 600 }}>
                    Thank You for Registering with Us
                  </h2>
                ) : (
                  <div className="ew-hero-cta">
                    <button
                      className="ew-btn ew-btn--yellow"
                      onClick={() => navigate("/register/candidate")}
                    >
                      Sign Up as Candidate
                    </button>
                    <button
                      className="ew-btn ew-btn--outline"
                      onClick={() => navigate("/register/institute")}
                    >
                      Sign Up as Recruiter
                    </button>
                  </div>
                )}
                <div className="ew-hero-people">
                  <img alt="" src="/assets/images/png/three-people.png" />
                  <p>20,000+ People Get Their Dream Jobs</p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="ew-hero ew-hero-slide">
              <img
                className="ew-hero-art"
                alt=""
                src="/assets/images/png/hey.png"
              />
              <div className="ew-hero-content">
                <div className="ew-hero-badge">
                  NG Eduwizer Is An Educational Growth Partner
                </div>
                <h1 className="ew-hero-title">
                  Want to <span className="hl">setup a school?</span>
                </h1>
                <p className="ew-hero-sub">
                  We help entrepreneurs, trusts, and educational institutions
                  establish, manage, expand, and transform schools through
                  expert consulting and end-to-end execution.
                </p>
                <div className="ew-hero-cta">
                  <button
                    className="ew-btn ew-btn--yellow"
                    onClick={() => window.open("https://ngeduwizer.com/", "_blank")}
                  >
                    Visit Setup Portal
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* ============ ABOUT US ============ */}
      <section className="ew-home-about ew-section">
        <div className="ew-container">
          <div className="ew-home-about-grid">
            <div className="ew-home-about-img">
              <img alt="Dr. Nikkie Grover" src="/assets/images/png/image16@1x.png" />
            </div>
            <div className="ew-home-about-text">
              <h2>About Us</h2>
              <p>{ABOUT_US_DESC}</p>
              <div className="ew-home-about-foot">
                <button
                  className="ew-btn ew-btn--yellow ew-btn--sm"
                  onClick={() => navigate("/about-us")}
                >
                  Know More →
                </button>
                <div className="ew-home-about-ceo">
                  <div>
                    <div className="ceo-name">-Dr. Nikkie Grover, CEO</div>
                    <div className="ceo-role">Founder &amp; CEO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="ew-why ew-section">
        <div className="ew-container">
          <h2 className="ew-section-title">Why Choose Us</h2>
          <div className="ew-why-grid">
            {WHY_CHOOSE_US.map(({ img, title }) => (
              <div className="ew-why-item" key={title}>
                <img alt={title} src={img} />
                <p>{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED LISTINGS ============ */}
      <section className="ew-featured ew-section">
        <div className="ew-container">
          <h2 className="ew-section-title">Featured Listings</h2>
          <div className="ew-featured-grid">
            {featuredLists.map(({ _id, url, fileType }) => (
              <div className="ew-featured-card" key={_id}>
                {fileType.includes("image") && (
                  <img alt="" src={url} onClick={() => openLightbox(url)} />
                )}
                {fileType.includes("video") && <video src={url} controls />}
                {fileType.includes("youtube") && (
                  <iframe
                    src={`${url}?rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded YouTube"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="ew-featured-contact">
            <b>For advertisements / featured listing of your profile or product</b>
            <br />
            connect with{" "}
            <a href="mailto:support@eduwizer.com">support@eduwizer.com</a>
            <br />
            Contact <a href="tel:+919167780061">9167780061</a> /{" "}
            <a href="tel:+919167864061">9167864061</a>
          </div>
        </div>
      </section>

      {/* ============ GET INVOLVED BAND ============ */}
      <section className="ew-involved">
        <div className="ew-involved-inner">
          <span className="ew-involved-icon" aria-hidden="true">
            ✦
          </span>
          <div className="ew-involved-text">
            <h2>Want to get involved?</h2>
            <p>
              Get in touch. Let&apos;s build your perfect team — or find your
              perfect job — today.
            </p>
          </div>
          <button
            className="ew-btn ew-btn--yellow"
            onClick={() => navigate("/contact-us")}
          >
            Contact Us →
          </button>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <Candidates variant="light" />

      {/* ============ ACADEMIC & INSTITUTIONAL LEADERS ============ */}
      <section className="ew-carousel-section cream ew-section">
        <div className="ew-container">
          <h2 className="ew-section-title">Academic &amp; Institutional Leaders</h2>
          <div className="ew-carousel-wrap">
            <button
              className="ew-arrow ew-arrow--yellow ew-carousel-nav prev"
              aria-label="Previous"
              onClick={() => scrollBy(leadersRef, -496)}
            >
              <i className="fa fa-angle-left"></i>
            </button>
            <div className="ew-carousel" ref={leadersRef}>
              {aboutChancellors.map(
                ({ name, url, location, country, position, linkedIn }) => (
                  <div className="ew-leader-card" key={name}>
                    <img
                      src={url || Logo}
                      alt={name}
                      className="leader-img"
                      onClick={() => openLightbox(url)}
                    />
                    <div className="leader-name">{name}</div>
                    <div className="leader-role">{position}</div>
                    <div className="leader-loc">
                      {location}
                      {country ? `, ${country}` : ""}
                    </div>
                    {linkedIn && (
                      <a
                        href={linkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="leader-social"
                      >
                        <img
                          src="/assets/images/svg/LinkedIn_icon_circle.svg"
                          alt="LinkedIn"
                        />
                      </a>
                    )}
                  </div>
                )
              )}
            </div>
            <button
              className="ew-arrow ew-arrow--yellow ew-carousel-nav next"
              aria-label="Next"
              onClick={() => scrollBy(leadersRef, 496)}
            >
              <i className="fa fa-angle-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* ============ AWARDS AND RECOGNITIONS ============ */}
      <section className="ew-carousel-section ew-section">
        <div className="ew-container">
          <h2 className="ew-section-title">Awards and Recognitions</h2>
          <div className="ew-carousel-wrap">
            <button
              className="ew-arrow ew-arrow--yellow ew-carousel-nav prev"
              aria-label="Previous"
              onClick={() => scrollBy(awardsRef, -544)}
            >
              <i className="fa fa-angle-left"></i>
            </button>
            <div className="ew-carousel" ref={awardsRef}>
              {awardsAndRecognitions.map(({ title, url }) => (
                <div
                  className="ew-award-card"
                  key={title}
                  onClick={() => openLightbox(url)}
                >
                  <img src={url} alt={title} />
                  <div className="award-title">{title}</div>
                </div>
              ))}
            </div>
            <button
              className="ew-arrow ew-arrow--yellow ew-carousel-nav next"
              aria-label="Next"
              onClick={() => scrollBy(awardsRef, 544)}
            >
              <i className="fa fa-angle-right"></i>
            </button>
          </div>
        </div>
      </section>

      {show && (
        <Lightbox
          medium={modalImageUrl}
          large={modalImageUrl}
          onClose={() => setShow(false)}
        />
      )}
    </main>
  );
};

export default Dashboard;
