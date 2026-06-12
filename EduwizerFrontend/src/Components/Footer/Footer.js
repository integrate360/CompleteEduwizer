import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../Assests/Logo/logo.png";
import Face from "../../Assests/Images/facebook.svg";
import Insta from "../../Assests/Images/instagram.svg";
import Linkedin from "../../Assests/Images/LinkedIn_icon_circle.svg";
import Subscribe from "../Subscribe";
import "./Footer.css";

const GTAG_IDS = ["G-EZ4CWQ65GF", "UA-287933216-1", "G-7N17D246M7"];

const Footer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const scripts = [];
    GTAG_IDS.forEach((id) => {
      const loader = document.createElement("script");
      loader.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      loader.async = true;
      document.body.appendChild(loader);

      const inline = document.createElement("script");
      inline.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${id}');`;
      document.body.appendChild(inline);

      scripts.push(loader, inline);
    });
    return () => scripts.forEach((s) => document.body.removeChild(s));
  }, []);

  const goTop = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="ew-footer">
      <Subscribe />

      <div className="ew-footer-main">
        <div className="ew-footer-grid">
          <div className="ew-footer-brand">
            <img src={Logo} alt="NG Eduwizer" />
            <p>
              Complete end-to-end solutions for educational excellence.
            </p>
          </div>

          <div className="ew-footer-col">
            <div className="ew-footer-head">Quick Links</div>
            <button onClick={() => goTop("/infrastructure-search/financialLoanServices")}>
              Infrastructure
            </button>
            <button onClick={() => goTop("/career-counselling/career")}>
              Career Counselling
            </button>
            <button onClick={() => goTop("/career-counselling/schoolOrCollegeCounsellors")}>
              Counsellors
            </button>
          </div>

          <div className="ew-footer-col">
            <div className="ew-footer-head">Our Company</div>
            <button onClick={() => goTop("/events-blogs")}>Events &amp; Blogs</button>
            <button onClick={() => goTop("/contact-us")}>Contact Us</button>
          </div>

          <div className="ew-footer-col">
            <div className="ew-footer-head">Legal</div>
            <button onClick={() => goTop("/terms-conditions")}>Privacy Policy</button>
            <button onClick={() => goTop("/terms-conditions")}>Terms of Service</button>
          </div>

          <div className="ew-footer-col">
            <div className="ew-footer-head">Follow Us</div>
            <div className="ew-footer-social">
              <a
                href="https://www.instagram.com/eduwizer_social_media_team_/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <img src={Insta} alt="Instagram" />
              </a>
              <a
                href="https://www.facebook.com/Eduwizer/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <img src={Face} alt="Facebook" />
              </a>
              <a
                href="https://www.linkedin.com/in/dr-nikkie-grover-37bb5521/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <img src={Linkedin} alt="LinkedIn" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="ew-footer-bottom">
        <span>
          © {new Date().getFullYear()} Eduwizer. All rights reserved. Design and
          developed by{" "}
          <a href="https://integrate360.in/" target="_blank" rel="noreferrer">
            Integrate360
          </a>
          .
        </span>
        <span className="ew-footer-cin">CIN Number - U74999MH2018PTC309935</span>
      </div>
    </footer>
  );
};

export default Footer;
