import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../Assests/Logo/logo.png";
import Candidates from "../Candidates";
import Subscribe from "../Subscribe";
import "./Dashboard.css";
import { Lightbox } from "react-modal-image";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import {
  getTeachers,
  getFeaturedLists,
  getAboutChancellors,
  getAwardsAndRecognitions,
  getTestimonials,
} from "../../Services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [width, setWidth] = useState(window.innerWidth);
  const [show, setShow] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(false);
  const { loginData } = useSelector((store) => store.dataReducer);

  //
  const [aboutTeachersList, setAboutTeachersList] = useState([]);
  const [featuredLists, setFeaturedLists] = useState([]);
  const [aboutChancellors, setAboutChancellors] = useState([]);
  const [awardsAndRecognitions, setAwardsAndRecognitions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

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

  const aboutUsDesc = `Globalization of education has been the real game changer in today’s world. The word “world is flat” has made quite a large impact today on the education sector. Education jobs are no longer country centered. Requirement of quality educators across the globe is need of the hour. With growing globalization educations is now considered intertwined & a global search to facilitate quality educators across the globe is required. NG Eduwizer fulfils the need of excellent educators with comprehensive resource staff in this portal. We believe to satisfy both the client and the clienteles. NG Eduwizer is one of its first kind database in the education sector which has exhaustive data to achieve meeting excellence in education related to all domains of education by following a seamless and systematic approach. This portal is specially designed to fulfil the need to filter out the best of educators. Just as our tag line says “The first comprehensive educator’s database portal “`;

  const featuredListings = [
    {
      img: "",
      link: "https://www.youtube.com/embed/axOT0bGr8gI",
      name: "College Name",
      loc: "College Location",
      board: "Education Board Name",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    },
    {
      img: "/assets/images/png/featured_2.jpeg",
      link: "",
      name: "College Name",
      loc: "College Location",
      board: "Education Board Name",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    },
    {
      img: "/assets/images/png/muni_international_school.jpeg",
      link: "",
      name: "College Name",
      loc: "College Location",
      board: "Education Board Name",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    },
    {
      img: "/assets/images/png/teachers_training_workshop.jpeg",
      link: "",
      name: "College Name",
      loc: "College Location",
      board: "Education Board Name",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    },
  ];

  // const teachers = Array.from({ length: 10 }).map((e) => ({
  //   name: "Name",
  //   position: "Position",
  //   age: "Age",
  //   location: "Location",
  //   country: "Country",
  //   img: "/assets/images/png/back-cover.png",
  //   rating: (Math.random() * 5).toString().slice(0, 3),
  // }));

  const teachers = [
    {
      name: "Rupa Bhowmick",
      position: "MYP coordinator",
      age: "44",
      location: "Noida, UP",
      country: "India",
      url: "/assets/images/png/rupa_bhowmick.jpeg",
      rating: (Math.random() * 5).toString().slice(0, 3),
    },
    {
      name: "Dr Shubhadeep Chakraborty",
      position: "Associate Professor of Finance & Head of IQAC",
      age: "44",
      location: "SRM University, Sikkim",
      country: "India",
      url: "/assets/images/png/shubhadeep.jpeg",
      rating: (Math.random() * 5).toString().slice(0, 3),
    },
    {
      name: "Soma Chatterjee",
      position: "Primary Teacher",
      age: "44",
      location: "Bangalore",
      country: "India",
      // url: "/assets/images/png/back-cover.png",
      rating: (Math.random() * 5).toString().slice(0, 3),
    },
    {
      name: "Aarti Chaturvedi",
      position: "Principal",
      age: "46",
      location: "Kanchipuram",
      country: "India",
      // url: "/assets/images/png/aarti_chaturvedi.png",
      rating: (Math.random() * 5).toString().slice(0, 3),
    },
    {
      name: "Jai Kumaresh Shetty",
      position: "Senior Talent Acquisition Specialist",
      age: "29",
      location: "Tamil Nadu",
      country: "India",
      // url: "/assets/images/png/back-cover.png",
      rating: (Math.random() * 5).toString().slice(0, 3),
    },
    {
      name: "Saisudha",
      position: "Biology Teacher",
      age: "31",
      location: "Madras",
      country: "India",
      // url: "/assets/images/png/back-cover.png",
      rating: (Math.random() * 5).toString().slice(0, 3),
    },
    {
      name: "Dibyendu Pyne",
      position: "Principal",
      age: "56",
      location: "West Bengal",
      country: "India",
      // url: "/assets/images/png/back-cover.png",
      rating: (Math.random() * 5).toString().slice(0, 3),
    },
    {
      name: "Pradyna Agawane",
      position: "Academic Head",
      age: "42",
      location: "Delhi",
      country: "India",
      // url: "/assets/images/png/back-cover.png",
      rating: (Math.random() * 5).toString().slice(0, 3),
    },
    {
      name: "Prof. Sanjay K. Sharma",
      position: "Associate Dean (Research)",
      age: "50",
      location: "West Bengal",
      country: "India",
      // url: "/assets/images/png/back-cover.png",
      rating: (Math.random() * 5).toString().slice(0, 3),
    },
    {
      name: "Mr. K. Choudhary",
      position: "Curriculum Development Head",
      age: "40",
      location: "Pune",
      country: "India",
      // url: "/assets/images/png/back-cover.png",
      rating: (Math.random() * 5).toString().slice(0, 3),
    },
  ];

  // const bosses = Array.from({ length: 10 }).map((e) => ({
  //   name: "Name",
  //   position: "Position",
  //   age: "Age",
  //   location: "Location",
  //   country: "Country",
  //   img: "/assets/images/png/back-cover.png",
  //   rating: (Math.random() * 5).toString().slice(0, 3),
  // }));

  const bosses = [
    {
      name: "Dr John Harrison",
      position: "Director cum Principal",
      age: "Age",
      location: "Litera Valley School",
      country: "Gurugram, India",
      img: "/assets/images/png/john_harrison.jpeg",
      rating: 5,
      linkedIn: "https://www.linkedin.com/in/dr-john-harrison-8675b6120",
      // email: "drvaria@rosaryschoolrajkot.org",
    },
    {
      name: "Dr Vishal Varia",
      position: "Director",
      age: "Age",
      location: "Rosary School, Leader of GEG",
      country: "Ahmedabad, Gujarat",
      img: "/assets/images/png/vishal_varia.jpeg",
      rating: 5,
      linkedIn: "https://www.linkedin.com/in/drvishalvaria/",
      email: "drvaria@rosaryschoolrajkot.org",
    },
    {
      name: "Dr Sanjeeb Pal",
      position: "Director",
      age: "Age",
      location: "Amity University",
      country: "Jaipur",
      img: "/assets/images/png/sanjeeb_pal.jpeg",
      rating: 5,
    },
    {
      name: "National Awardee",
      position: "Principal at kunwar’s Global school",
      age: "Age",
      location: "Lucknow",
      country: "India",
      img: "/assets/images/png/nationalAwardee.jpeg",
      rating: 5,
    },
    {
      name: "Prof .(Dr.) Shauli Mukherjee",
      position:
        "Director School of Education & Associate Dean School of liberal Arts & culture",
      age: "Age",
      location: "Admas university, Kolkata",
      country: "India",
      img: "/assets/images/png/shauliMukherjee.jpeg",
      rating: 5,
    },
  ];

  // const awards = Array.from({ length: 10 }).map((e) => ({
  //   img: "/assets/images/png/DadasahebPhalkeMemorialAward.jpg",
  //   // img: "/assets/images/png/back-cover.png",
  //   title: "Dadasaheb Phalke Memorial Award",
  //   desc: "Descriptions",
  // }));

  const awards = [
    {
      img: "/assets/images/png/inspirationAward.jpeg",
      // img: "/assets/images/png/back-cover.png",
      title: "Inspiration Award 2023",
      desc: "Descriptions",
    },
    {
      img: "/assets/images/png/leaderDeskArticle.jpeg",
      // img: "/assets/images/png/back-cover.png",
      title: "Leader Desk Article",
      desc: "Descriptions",
    },
    {
      img: "/assets/images/png/leaderGlobeMedia.jpeg",
      // img: "/assets/images/png/back-cover.png",
      title: "The Leader Globe Media Article",
      desc: "Descriptions",
    },
    {
      img: "/assets/images/png/Awards1.jpg",
      title: "A known name in Educational field",
      desc: "Descriptions",
    },
    {
      img: "/assets/images/png/Awards2.jpg",
      title: "Astral Global Award",
      desc: "Descriptions",
    },
    {
      img: "/assets/images/png/Awards3.jpg",
      title: "Business Connect Award",
      desc: "Descriptions",
    },
    {
      img: "/assets/images/png/Awards4.jpg",
      title: "GECL Women Entrepreneur Award",
      desc: "Descriptions",
    },

    {
      img: "/assets/images/png/DadasahebPhalkeMemorialAward.jpg",
      title: "Dadasaheb Phalke Memorial Award",
      desc: "Descriptions",
    },
    {
      img: "/assets/images/png/UdhyodBhartiAward.jpg",
      title: "Udyog Bharti Award",
      desc: "Descriptions",
    },
    {
      img: "/assets/images/png/WomenEntreprenuerAward-NGEduwizer.jpg",
      // img: "/assets/images/png/back-cover.png",
      title: "Women Entreprenuer Award - NG Eduwizer",
      desc: "Descriptions",
    },
    {
      img: "/assets/images/png/IBAEAward.jpg",
      // img: "/assets/images/png/back-cover.png",
      title: "IBAE Award",
      desc: "Descriptions",
    },
    {
      img: "/assets/images/png/WorldBookOfRecordsAward.jpg",
      // img: "/assets/images/png/back-cover.png",
      title: "World Book Of Records Award",
      desc: "Descriptions",
    },
  ];

  // const ratings = Array.from({ length: 10 }).map((e) => ({
  //   img: "/assets/images/png/back-cover.png",
  //   name: "Name",
  //   title: "Awards Title",
  //   rating: 5,
  //   date: "Day Month Year",
  //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  // }));

  const ratings = [
    {
      img: "/assets/images/png/back-cover.png",
      name: "Dr. Vishal Varia",
      title: "Director, Raikot Gujarat",
      rating: 5,
      date: "22 May 2019",
      desc: `On the occasion of first anniversary of Eduwizer, I take this opportunity to congratulate Dr. Nikkie Grover and Team Eduwiser for rendering professional services in educational sector.
      Though professional approach but their service is quite personal, helping candidates and educational institutes enabling skilled resources and sound platform.
      Dr. Nikkie, takes personal interest in providing key services. Apart from extending pool of opportunities they enable individuals to upskill their resume and provide a competitive edge.
      I wish the team all the very best for their future endeavours`,
    },
    {
      img: "/assets/images/png/back-cover.png",
      name: "Ashad Ullah Qureshi",
      title: "Principal, Horizon International School",
      rating: 5,
      date: "30 June 2019",
      desc: `NG Eduwizer Pvt. Ltd. & especially Nikki Mam is very keen intheir work & to provide the best talent to the stake holders whether from employer or the employee, they have managed both the aspects in a well structured manner.
      Recruitment is not easy nowadays it takes a lot to hunt the TALENT! well when you think for better professionals, eduwizer has got the profiles around the country.
      I personaly am inspired by the charismatic personality of Nikki Madam nonetheless the team she has is devoted & continuously working towards the better & happening RECRUITMENT!!!!!`,
    },
    {
      img: "/assets/images/png/back-cover.png",
      name: "Nehu Jain",
      title: "Little Hearts, Owner",
      rating: 5,
      date: "8 August 2019",
      desc: `It has always been a great experience to have Dr. Nikkie Grover around to counsel us for the growth of our play school.
      Besides, she is a charming lady with a big heart. Hard to find such a gem in today's time.
      Wishing Eduwizer all the best and may they grow year after year at this pace.`,
    },
    {
      img: "/assets/images/png/back-cover.png",
      name: "R. K. Tanwar",
      title: "",
      rating: 5,
      date: "19 August 2019",
      desc: `Dearest Dr Nikkie,
      What you have achieved through your accomplishments is exemplary. You are a true asset to the company. We are proud of you. Continue to raise the bar with your hard work and dedication.
      You have earned the trust, admiration and respect of your colleagues with your honesty, sincerity and commitment towards work. Every individual in this company looks up to you.
      Thank you for being the perfect role model.
      Even the smallest tasks well done will take you closer to achieving your dreams. Keep it up, sky is the limit.`,
    },
  ];

  // const faqs = Array.from({ length: 5 }).map((e) => ({
  //   ques: `Our delivery service application uses a direct point-to-point delivery model at all points in US.`,
  //   ans: `Our delivery service application uses a direct point-to-point delivery model at all points in US. After you order, the vehicle will come directly to your pick up address and deliver your goods immediately without stopping.`,
  // }));

  const faqs = [
    {
      ques: `What are the qualifications for teaching at a school or college?`,
      ans: [
        `The qualifications for teaching at a school or college vary depending on the institution. However, most schools and colleges require teachers to have a bachelor's degree in the subject they will be teaching. Some schools and colleges also require teachers to have a master's degree or a Ph.D.`,
      ],
    },
    {
      ques: `What are the steps involved in applying for a Professor job?`,
      ans: [
        `Firstly sign up as candidate and fill up all you details in your profile and once recruiter will see your profile they’ll contact you as per the position available.`,
      ],
    },
    {
      ques: `May I have some tips before applying for a job?`,
      ans: [
        `* Research the school or college you are applying to.`,
        `* Tailor your resume and cover letter to the specific job you are applying for.`,
        `* Practice your teaching skills.`,
        `* Dress professionally for your interview.`,
        `* Be prepared to answer questions about your teaching philosophy`,
      ],
    },
  ];

  const scrl = useRef(null);

  const slide = (shift) => {
    scrl.current.scrollLeft += shift;
  };

  const scrl1 = useRef(null);

  const slide1 = (shift) => {
    scrl1.current.scrollLeft += shift;
  };

  const scrl2 = useRef(null);

  const slide2 = (shift) => {
    scrl2.current.scrollLeft += shift;
  };

  const scrl3 = useRef(null);

  const slide3 = (shift) => {
    scrl3.current.scrollLeft += shift;
  };

  const getAboutTeachers = async () => {
    let teachersList = await getTeachers();
    teachersList = teachersList.data.data;
    setAboutTeachersList(teachersList);
    console.log("teachersList==", teachersList);
  };

  const getFeaturedListings = async () => {
    let featuredList = await getFeaturedLists();
    featuredList = featuredList.data.data;
    setFeaturedLists(featuredList);
    console.log("getFeaturedLists==", featuredList);
  };

  const getAboutChancellorsListings = async () => {
    let aboutChancellorList = await getAboutChancellors();
    aboutChancellorList = aboutChancellorList.data.data;
    setAboutChancellors(aboutChancellorList);
    console.log("getAboutChancellorsLists==", aboutChancellorList);
  };

  const getAwardsAndRecognitionsListings = async () => {
    let awardsAndRecognitionList = await getAwardsAndRecognitions();
    awardsAndRecognitionList = awardsAndRecognitionList.data.data;
    setAwardsAndRecognitions(awardsAndRecognitionList);
    console.log("getAboutChancellorsLists==", awardsAndRecognitionList);
  };

  const getTestimonialsListings = async () => {
    let testimonials = await getTestimonials();
    testimonials = testimonials.data.data;
    setTestimonials(testimonials);
    console.log("getAboutChancellorsLists==", testimonials);
  };

  useEffect(() => {
    getAboutTeachers();
    getFeaturedListings();
    getAboutChancellorsListings();
    getAwardsAndRecognitionsListings();
    getTestimonialsListings();
  }, []);

  return (
    <main className="home page">
      <section className="headline-swiper-wrapper no-side-gap">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          loop={true}
          className="hero-swiper"
        >
          <SwiperSlide>
            <section className="headline">
              <div className="fd-col headline-container section-content">
                <div className="ecosystem-badge">Eduwizer is an Ecosystem</div>
                <h1 className="headline-text fw-bi">
                  The First Comprehensive <br></br>Educator’s Database Portal
                </h1>
                <p className="fs-1.5 fw-l">
                  Subscribe, Relax, as our recruitment specialist work on your
                  CV
                  <br></br>
                  which reaches 1000+ Education Institutes
                </p>
                {loginData ? (
                  <div
                    className={
                      !isMobile ? "d-flex gap-3 btn-group w-100" : "gap-3"
                    }
                  >
                    <h1 className="w-full mt-4">
                      Thank You for Registering with Us
                    </h1>
                  </div>
                ) : (
                  <div
                    className={
                      !isMobile
                        ? "d-flex gap-3 btn-group w-50"
                        : "d-flex flex-column gap-2 align-items-center w-100"
                    }
                    style={
                      isMobile ? { maxWidth: "340px", margin: "0 auto" } : {}
                    }
                  >
                    <Button
                      variant="warning"
                      className="m-btn w-100 mt-2"
                      onClick={() => navigate("/register/candidate")}
                    >
                      <div className="btn-text p-1.5">Signup as Candidate</div>
                    </Button>
                    <Button
                      variant="warning"
                      className="m-btn w-100 mt-2"
                      onClick={() => navigate("/register/institute")}
                    >
                      <div className="btn-text p-1.5">Signup as Recruiter</div>
                    </Button>
                  </div>
                )}
                <div className="d-flex gap-3 image-group">
                  <img
                    className="image"
                    alt=""
                    src="/assets/images/png/three-people.png"
                  />
                  <p className="fs-1.5">20,000+ People get their dream Jobs!</p>
                </div>
              </div>
              <img
                className="head-boy"
                alt="Head boy showing the world"
                src="/assets/images/png/headline-boy.png"
              />
            </section>
          </SwiperSlide>

          <SwiperSlide>
            <section className="setup-school">
              <div className="fd-col headline-container section-content">
                <div className="ecosystem-badge">NG Eduwizer is an Educational Growth partner</div>
                <h1 className="headline-text fw-bi">
                  Want to setup a school?
                </h1>
                <p
                  className="fs-1.5 fw-l"
                  style={{
                    color: "var(--color-whitesmoke-100)",
                    whiteSpace: "normal",
                  }}
                >
                  We help entrepreneurs, trusts, and educational institutions establish, manage, expand, and transform schools through expert consulting and end-to-end execution.
                </p>
                <div
                  className={
                    !isMobile
                      ? "d-flex gap-3 btn-group w-50"
                      : "d-flex flex-column gap-2 align-items-center w-100"
                  }
                  style={
                    isMobile ? { maxWidth: "340px", margin: "0 auto" } : {}
                  }
                >
                  <Button
                    variant="warning"
                    className="m-btn w-100 mt-2"
                    onClick={() =>
                      window.open("https://ngeduwizer.com/", "_blank")
                    }
                  >
                    <div className="btn-text p-1.5">Visit Setup Portal</div>
                  </Button>
                </div>
              </div>
              <img
                className={
                  isMobile ? "setup-school-image-mobile" : "setup-school-image"
                }
                alt=""
                src="/assets/images/png/hey.png"
              />
            </section>
          </SwiperSlide>
        </Swiper>
      </section>
      <section className="home-about-us">
        <div className="section-content">
          <div className="image-container">
            <div className="image-content">
              <img
                className="image"
                alt=""
                src="/assets/images/png/image16@1x.png"
              />
            </div>
          </div>
          <div className="text-container">
            <p className={isMobile ? "fs-1 text" : "text"}>{aboutUsDesc}</p>

            <div
              className={
                !isMobile ? "flex-group" : "flex-column-reverse flex-group"
              }
            >
              <Button
                className="m-btn mt-2"
                variant="warning"
                onClick={() => navigate("/about-us")}
              >
                <div className="btn-text p-1 fs-15">Know More</div>
              </Button>
              <p className="bold mt-2">-Dr. Nikkie Grover, CEO</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why">
        <h1 className="why-head section-head fs-2.5 text-center">
          Why Choose Us
        </h1>
        <div
          className={
            isMobile
              ? "why-container-mobile section-content"
              : "why-container section-content"
          }
          style={{ justifyContent: "center" }}
        >
          {[
            {
              img: "/assets/images/png/image11@1x.png",
              title: "First comprehensive database",
            },
            {
              img: "/assets/images/png/image12@1x.png",
              title: "Specially designed for educators",
            },
            {
              img: "/assets/images/png/image13@1x.png",
              title: "Be Spoke approach",
            },
            {
              img: "/assets/images/png/image14@1x.png",
              title: "Exclusively designed for Education Sector",
            },
            {
              img: "/assets/images/png/image15@1x.png",
              title: "User friendly interface",
            },
          ].map(({ img, title }) => (
            <div className="point" key={title}>
              <img className="point-img" alt={title} src={img} />
              <p className="point-title">{title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-listings">
        <h1 className="featured-listings section-head fs-2.5 text-center">
          Featured Listings
        </h1>
        <div className="listings section-content row justify-content-center">
          {featuredLists.map(({ _id, url, fileType }) => (
            <div className="col-6 col-md-4 col-lg-3" key={_id}>
              {fileType.includes("image") && (
                <img className="icon w-100 my-3" alt="" src={url} />
              )}
              {fileType.includes("video") && (
                <video
                  width="100%"
                  height="240"
                  src={url}
                  className="my-3"
                  controls
                />
              )}
              {fileType.includes("youtube") && (
                <iframe
                  src={`${url}?rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loop="1"
                  title="Embedded YouTube"
                  className="w-100 my-3"
                  height={isMobile ? "200px" : "300px"}
                />
              )}
            </div>
          ))}
        </div>
        <div className="row mt-5 font-weight-bold" style={{ fontSize: "20px" }}>
          <div className="col-12 text-center">
            For advertisements / Featured listing your profile / Product
          </div>
          <div className="col-12 text-center">connect with</div>
          <div className="col-12 text-center">
            <a
              href="mailto:support@eduwizer.com"
              onClick={(e) => {
                window.location.href = "mailto:support@eduwizer.com";
                e.preventDefault();
              }}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              support@eduwizer.com
            </a>
          </div>
          <div className="col-12 text-center">
            Contact{" "}
            <a
              href="tel:+919167780061"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              9167780061
            </a>{" "}
            /{" "}
            <a
              href="tel:+919167864061"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              9167864061
            </a>
          </div>
        </div>
      </section>

      <section className="home-get-involved want-to no-side-gap text-center">
        <div className="section-content flex-column align-items-center py-5">
          <h1 className="fw-bold mb-4">Want to get involved?</h1>
          <p className="fs-1.5 mb-4 mx-auto" style={{ maxWidth: "800px" }}>
            Get in touch. Let’s build your perfect team or find your perfect job
            today.
          </p>
          <div className="btn-group w-auto">
            <Button
              className="m-btn px-5 py-3"
              variant="warning"
              onClick={() => navigate("/contact-us")}
            >
              <div className="btn-text fs-1.5">Contact Us</div>
            </Button>
          </div>
        </div>
      </section>

      <Candidates />

      {/* <section className="home-about-teachers no-side-gap no-bottom-gap scroll-section right">
        <div
          className={
            isMobile
              ? "section-head section-head-mobile scroll-head"
              : "section-head scroll-head"
          }
        >
          <h1 className="fs-2">About Teachers / Lecturers / Administrators</h1>
        </div>
        <div className="section-content scroll-content">
          <div className="fade-out"></div>
          <Button
            style={
              isMobile
                ? {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    top: "125px",
                    zIndex: "999",
                    position: "absolute",
                    marginLeft: "20%",
                    display: "none",
                  }
                : {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    alignSelf: "center",
                    zIndex: "999",
                    position: "absolute",
                    marginLeft: "20%",
                  }
            }
            onClick={() => slide(-100)}
          >
            <i className="fa fa-angle-left fa-2x"></i>
          </Button>
          <div
            ref={scrl}
            className="scroll-items"
            style={{ scrollBehavior: "smooth" }}
          >
            {aboutTeachersList.map(
              ({
                rating,
                name,
                url,
                location,
                age,
                country,
                position,
                linkedIn,
              }) => (
                <div className="teacher-card" key={name}>
                  <div
                    className="teacher-img-wrapper"
                    onClick={() => {
                      setShow(true);
                      setModalImageUrl(url || Logo);
                    }}
                  >
                    <img src={url || Logo} alt={name} className="teacher-img" />
                  </div>
                  <div className="teacher-info">
                    <div className="teacher-name">{name}</div>
                    <div className="teacher-position">{position}</div>
                    <div className="teacher-location">
                      {location}, {country}
                    </div>
                    {linkedIn && (
                      <a
                        href={linkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="linkedin-icon"
                      >
                        <img
                          src="/assets/images/svg/LinkedIn_icon_circle.svg"
                          alt="LinkedIn"
                        />
                      </a>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
          <Button
            style={
              isMobile
                ? {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    top: "125px",
                    zIndex: "999",
                    position: "absolute",
                    display: "none",
                    right: "30px",
                  }
                : {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    alignSelf: "center",
                    zIndex: "999",
                    position: "absolute",
                    right: "0",
                  }
            }
            onClick={() => slide(+100)}
          >
            <i className="fa fa-angle-right fa-2x"></i>
          </Button>
        </div>
        <div
          className={
            isMobile ? "scroll-image scroll-image-mobile" : "scroll-image"
          }
        >
          <img className="scroll-boy" alt="" src="/assets/images/png/1.png" />
        </div>
      </section> */}

      <section className="home-about-bosses no-side-gap no-bottom-gap scroll-section left">
        <div
          className={
            isMobile
              ? "section-head section-head-mobile scroll-head"
              : "section-head scroll-head"
          }
        >
          <h1 className="fs-2.5">Academic & Institutional Leaders</h1>
          {/* <Button className="m-btn right d-md-none d-lg-block">
            <div className="btn-text fs-1.5">View All</div>
          </Button> */}
        </div>
        <div className="section-content scroll-content">
          <div className="fade-out left"></div>
          <div className="fade-out"></div>
          <Button
            style={
              isMobile
                ? {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    top: "125px",
                    zIndex: "999",
                    display: "none",
                    position: "absolute",
                    left: "20px",
                    // marginLeft: "20%",
                  }
                : {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    alignSelf: "center",
                    zIndex: "999",
                    position: "absolute",
                    // right: "0",
                    // marginLeft: "20%",
                  }
            }
            onClick={() => slide1(-100)}
          >
            <i className="fa fa-angle-left fa-2x"></i>
          </Button>
          <div
            ref={scrl1}
            className="scroll-items-New"
            style={{ scrollBehavior: "smooth" }}
          >
            {aboutChancellors.map(
              ({ name, url, location, country, position, linkedIn, email }) => (
                <div className="chancellor-card" key={name}>
                  <div
                    className="chancellor-img-wrapper"
                    onClick={() => {
                      setShow(true);
                      setModalImageUrl(url);
                    }}
                  >
                    <img
                      src={url || Logo}
                      alt={name}
                      className="chancellor-img"
                    />
                  </div>
                  <div className="chancellor-info">
                    <div className="chancellor-name">{name}</div>
                    <div className="chancellor-position">{position}</div>
                    <div className="chancellor-location">
                      {location}, {country}
                    </div>

                    <div className="chancellor-icons">
                      {linkedIn && (
                        <a
                          href={linkedIn}
                          target="_blank"
                          rel="noreferrer"
                          className="linkedin-icon"
                        >
                          <img
                            src="/assets/images/svg/LinkedIn_icon_circle.svg"
                            alt="LinkedIn"
                          />
                        </a>
                      )}
                      {/* Optional email display */}
                      {/* {email && (
          <a href={`mailto:${email}`} className="email-link">
            <img src="/assets/images/svg/email_icon.svg" alt="Email" />
          </a>
        )} */}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
          <Button
            style={
              isMobile
                ? {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    top: "125px",
                    zIndex: "999",
                    position: "absolute",
                    display: "none",
                    right: "30px",
                    // marginLeft: "20%",
                  }
                : {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    alignSelf: "center",
                    zIndex: "999",
                    position: "absolute",
                    right: "17%",
                  }
            }
            onClick={() => slide1(+100)}
          >
            <i className="fa fa-angle-right fa-2x"></i>
          </Button>
        </div>
        <div
          className={
            isMobile ? "scroll-image scroll-image-mobile" : "scroll-image"
          }
        >
          <img className="scroll-boy" alt="" src="/assets/images/png/2.png" />
        </div>
      </section>

      <section className="home-about-awards no-side-gap no-bottom-gap scroll-section right">
        <div
          className={
            isMobile
              ? "section-head section-head-mobile scroll-head"
              : "section-head scroll-head"
          }
        >
          <h2 className="fs-2.5">Awards and Recognitions</h2>
          {/* <Button className="m-btn right d-md-none d-lg-block">
            <div className="btn-text fs-1.5">View All</div>
          </Button> */}
        </div>
        <div className="section-content scroll-content">
          <div className="fade-out"></div>
          <Button
            style={
              isMobile
                ? {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    top: "125px",
                    zIndex: "999",
                    position: "absolute",
                    display: "none",
                    // right: "0",
                    marginLeft: "20%",
                  }
                : {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    alignSelf: "center",
                    zIndex: "999",
                    position: "absolute",
                    // right: "0",
                    marginLeft: "20%",
                  }
            }
            onClick={() => {
              if (scrl2.current) {
                scrl2.current.scrollLeft -= 300; // small extra scroll to the left
              }
              slide2(-100);
            }}
          >
            <i className="fa fa-angle-left fa-2x"></i>
          </Button>
          <div
            ref={scrl2}
            className="scroll-items"
            style={{ scrollBehavior: "smooth" }}
          >
            {awardsAndRecognitions.map(({ title, url, fileType }) => (
              <div
                className="award-card"
                key={title}
                onClick={() => {
                  setShow(true);
                  setModalImageUrl(url);
                }}
              >
                <div className="award-img-wrapper">
                  <img src={url} alt={title} className="award-img" />
                </div>
                <div className="award-info">
                  <div className="award-title">{title}</div>
                </div>
              </div>
            ))}
          </div>
          <Button
            style={
              isMobile
                ? {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    top: "125px",
                    zIndex: "999",
                    position: "absolute",
                    display: "none",
                    right: "30px",
                  }
                : {
                    width: "50px",
                    height: "50px",
                    backgroundColor: "white",
                    alignSelf: "center",
                    zIndex: "999",
                    position: "absolute",
                    right: "0",
                  }
            }
            onClick={() => slide2(+100)}
          >
            <i className="fa fa-angle-right fa-2x"></i>
          </Button>
        </div>
        <div
          className={
            isMobile ? "scroll-image scroll-image-mobile" : "scroll-image"
          }
        >
          <img className="scroll-boy" alt="" src="/assets/images/png/3.png" />
        </div>
      </section>

      {/* <section className="home-faq no-side-gap no-bottom-gap">
        <h1
          className={
            isMobile ? "section-head-mobile section-head" : "section-head"
          }
        >
          Frequently Asked Question
        </h1>
        <div className="section-content fd-col gap-0">
          {faqs.map(({ ques, ans }, i) => (
            <div className="faq-container" key={i}>
              <input className="faq-check" type="checkbox"></input>
              <div className="faq-ques d-flex">
                <h5>{ques}</h5>
                <div className="faq-expand"></div>
              </div>
              <div className="faq-answer fs-1.5">
                {ans.map((answer) => (
                  <div className="mt-2">{answer}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section> */}
      {/* <YoutubeVideo></YoutubeVideo> */}

      <Subscribe bg={true} subHead={true}></Subscribe>
      <>
        {show && (
          <Lightbox
            medium={modalImageUrl}
            large={modalImageUrl}
            // alt="Hello World!"
            onClose={() => setShow(false)}
          />
        )}
      </>
    </main>
  );
};

export default Dashboard;
