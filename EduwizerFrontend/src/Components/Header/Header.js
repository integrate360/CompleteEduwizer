import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../Assests/Logo/logo.png";
import {
  logoutAction,
  profileDataAction,
} from "../../Redux/Actions/dataAction";
import { getProfileFromServer } from "../../Services/api";
import "./Header.css";

const INFRA_LINKS = [
  { to: "/infrastructure-search/financialLoanServices", label: "Financial Loan Services" },
  { to: "/infrastructure-search/smartTechnology", label: "Smart Technology" },
  { to: "/infrastructure-search/integratedCurriculum", label: "Integrated Curriculum" },
  { to: "/infrastructure-search/teacherTraining", label: "Teacher Training" },
  {
    to: "/infrastructure-search/academicAuditForSchoolsCollegesUniversitiesPrivateInstitutions",
    label: "Academic Audit for Schools, Colleges, Universities, Private Institutions",
  },
  { to: "/infrastructure-search/websiteDevelopment", label: "Website Development" },
  { to: "/infrastructure-search/artificialIntelligence", label: "Artificial Intelligence" },
];

const COUNSELLOR_LINKS = [
  { to: "/career-counselling/career", label: "Career" },
  { to: "/career-counselling/psychologist", label: "Psychologist" },
  { to: "/career-counselling/schoolOrCollegeCounsellors", label: "School/College Counsellors" },
];

const SIGNUP_LINKS = [
  { to: "/register/candidate", label: "Candidate" },
  { to: "/register/counseller", label: "Counseller" },
  { to: "/register/vendor", label: "Vendor" },
  { to: "/register/institute", label: "Recruiter" },
];

function Dropdown({ label, items, isActive, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className={"ew-nav-item ew-dropdown" + (open ? " open" : "")} ref={ref}>
      <button
        type="button"
        className={"ew-nav-link" + (isActive ? " active" : "")}
        onClick={() => setOpen(!open)}
      >
        {label}
        <span className="ew-caret" />
      </button>
      {open && (
        <div className="ew-dropdown-menu">
          {items.map(({ to, label: l }) => (
            <Link
              key={to}
              to={to}
              className="ew-dropdown-item"
              onClick={() => {
                setOpen(false);
                onNavigate();
              }}
            >
              {l}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { loginData, profileData } = useSelector((store) => store.dataReducer);

  const path = location.pathname.toLowerCase();
  const isPackageScreen = [
    "/candidatepackageselection",
    "/vendorpackageselection",
    "/counsellerpackageselection",
    "/institutepackageselection",
  ].includes(path);

  useEffect(() => {
    if (loginData && !profileData) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData, profileData, dispatch]);

  const getProfile = async () => {
    const profileResp = await getProfileFromServer();
    dispatch(profileDataAction(profileResp.data.data));
  };

  const closeMenu = () => setMenuOpen(false);

  const isHome = path === "/" || path === "/home";
  const isEvents = path.startsWith("/events") || path.startsWith("/blogs");

  if (isPackageScreen) {
    return (
      <header className="ew-header">
        <div className="ew-header-inner">
          <Link to="/" className="ew-brand">
            <img src={Logo} alt="NG Eduwizer" />
          </Link>
          {loginData && (
            <button
              className="ew-btn ew-btn--yellow ew-btn--sm"
              onClick={() => {
                dispatch(logoutAction());
                navigate("/");
              }}
            >
              Logout
            </button>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="ew-header">
      <div className="ew-header-inner">
        <Link to="/" className="ew-brand" onClick={closeMenu}>
          <img src={Logo} alt="NG Eduwizer" />
        </Link>

        <button
          className={"ew-burger" + (menuOpen ? " open" : "")}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={"ew-header-collapse" + (menuOpen ? " show" : "")}>
          <nav className="ew-nav">
            <div className="ew-nav-item">
              <Link
                to="/"
                className={"ew-nav-link" + (isHome ? " active" : "")}
                onClick={closeMenu}
              >
                Home
              </Link>
            </div>
            {profileData?.userType !== "vendor" && (
              <Dropdown
                label="Infrastructure"
                items={INFRA_LINKS}
                isActive={path.startsWith("/infrastructure-search")}
                onNavigate={closeMenu}
              />
            )}
            {profileData?.userType !== "counseller" && (
              <Dropdown
                label="Counsellors"
                items={COUNSELLOR_LINKS}
                isActive={path.startsWith("/career-counselling")}
                onNavigate={closeMenu}
              />
            )}
            <div className="ew-nav-item">
              <Link
                to="/events-blogs"
                className={"ew-nav-link" + (isEvents ? " active" : "")}
                onClick={closeMenu}
              >
                Events &amp; Blogs
              </Link>
            </div>
            <div className="ew-nav-item">
              <Link
                to="/contact-us"
                className={"ew-nav-link" + (path === "/contact-us" ? " active" : "")}
                onClick={closeMenu}
              >
                Contact Us
              </Link>
            </div>
            <div className="ew-nav-item">
              <Link
                to="/about-us"
                className={"ew-nav-link" + (path === "/about-us" ? " active" : "")}
                onClick={closeMenu}
              >
                About Us
              </Link>
            </div>
          </nav>

          <div className="ew-header-actions">
            <button
              className="ew-btn ew-btn--brown ew-btn--sm"
              onClick={() => {
                closeMenu();
                window.open("https://ngeduwizer.com", "_blank");
              }}
            >
              Setup Of School
            </button>
            {!loginData && (
              <Dropdown
                label={<span className="ew-signup-label">Sign Up</span>}
                items={SIGNUP_LINKS}
                isActive={false}
                onNavigate={closeMenu}
              />
            )}
            {!loginData && (
              <button
                className="ew-btn ew-btn--outline-yellow ew-btn--sm ew-login-btn"
                onClick={() => {
                  closeMenu();
                  navigate("/login");
                }}
              >
                Login
              </button>
            )}
            {loginData && (
              <button
                className="ew-btn ew-btn--yellow ew-btn--sm"
                onClick={() => {
                  closeMenu();
                  navigate("/dashboard");
                }}
              >
                My Profile
              </button>
            )}
            {loginData && (
              <button
                className="ew-btn ew-btn--outline-yellow ew-btn--sm ew-login-btn"
                onClick={() => {
                  dispatch(logoutAction());
                  closeMenu();
                  navigate("/");
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
