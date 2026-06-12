import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import AboutUs from "./Components/About-Us";
import ContactUs from "./Components/Contact-Us";
import UserDashboard from "./Components/Dashboard/Dashboard";
import EventsBlogsPage from "./Components/EventsBlogs/EventsBlogsPage";
import BlogDetails from "./Components/Blogs/BlogDetails";
import EventDetails from "./Components/Events/EventDetails";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import Dashboard from "./Components/PreLogin/Dashboard";
import Login from "./Components/PreLogin/Login";
import Signup from "./Components/PreLogin/Signup";
import VerfiyOtp from "./Components/PreLogin/VerfiyOtp";
import CandidateSearch from "./Components/Search-Pages/CandidateSearch";
import CareerCounseling from "./Components/Search-Pages/CareerCounseling";
import InfrastructureSearch from "./Components/Search-Pages/InfrastructureSearch";
import RecruiterJobSearch from "./Components/Search-Pages/RecruiterJobSearch";
import TermsAndConditions from "./Components/Terms-and-Conditions/termsAndConditions";
import CandidateView from "./Components/CandidateView/Candidate";
import UploadCV from "./Components/Upload-CV";
import Protected from "./Protected";
import CandidatePackageScreen from "./Components/PreLogin/CandidatePackageScreen";
import VendorPackageScreen from "./Components/PreLogin/VendorPackageScreen";
import CounsellerPackageScreen from "./Components/PreLogin/CounsellerPackageScreen";
import InstitutePackageScreen from "./Components/PreLogin/InstitutePackageScreen";
import ForgotPassword from "./Components/PreLogin/forgotPassword";
import SetNewPassword from "./Components/PreLogin/SetNewPassword";
import { useEffect, useState } from "react";
import { getProfileFromServer, checkPaymentStatusAPI } from "./Services/api";
import { profileDataAction } from "./Redux/Actions/dataAction";
import { CircularProgress } from "@mui/material";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loginData, profileData } = useSelector((store) => store.dataReducer);
  const [isUnpaid, setIsUnpaid] = useState(false);
  const [loadingPaymentStatus, setLoadingPaymentStatus] = useState(true);

  useEffect(() => {
    if (loginData && !profileData) {
      const getProfile = async () => {
        try {
          const profileResp = await getProfileFromServer();
          dispatch(profileDataAction(profileResp.data.data));
        } catch (error) {
          console.error("Error fetching profile in App:", error);
        }
      };
      getProfile();
    }
  }, [loginData, profileData, dispatch]);

  useEffect(() => {
    if (loginData) {
      const checkUnpaid = async () => {
        try {
          const userId = localStorage.getItem("userId");
          if (userId) {
            const { data } = await checkPaymentStatusAPI(userId);
            setIsUnpaid(data.isUnpaid);
          }
        } catch (error) {
          console.error("Error checking payment status in App:", error);
        } finally {
          setLoadingPaymentStatus(false);
        }
      };
      checkUnpaid();
    } else {
      setLoadingPaymentStatus(false);
    }
  }, [loginData, location.pathname]); // Re-check on route changes to ensure real-time lock

  useEffect(() => {
    if (profileData && profileData.userType) {
      const type = profileData.userType.toLowerCase();
      const path = location.pathname.toLowerCase();

      // If payment is pending, force redirect to correct package page
      if (isUnpaid) {
        const targetPath = `/${type}packageselection`;
        if (path !== targetPath) {
          navigate(targetPath);
        }
      } else {
        // If paid, prevent them from going back to package selection pages
        if (
          path === "/candidatepackageselection" ||
          path === "/vendorpackageselection" ||
          path === "/counsellerpackageselection" ||
          path === "/institutepackageselection"
        ) {
          navigate("/");
        }
      }
    }
  }, [profileData, isUnpaid, location.pathname, navigate]);

  const isPackageScreen = [
    "/candidatepackageselection",
    "/vendorpackageselection",
    "/counsellerpackageselection",
    "/institutepackageselection"
  ].includes(location.pathname.toLowerCase());

  if (loadingPaymentStatus) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" exact element={<Dashboard />} />
          <Route path="/home" exact element={<Dashboard />} />
          <Route path="login" exact element={<Login />} />
          <Route path="forgotPassword" exact element={<ForgotPassword />} />
          <Route path="setNewPassword/:token" element={<SetNewPassword />} />
          <Route path="register/:type" exact element={<Signup />} />
          <Route path="verifyotp" exact element={<VerfiyOtp />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            exact
            element={
              <Protected isLoggedIn={loginData}>
                <UserDashboard />
              </Protected>
            }
          />
          <Route
            path="/contact-us"
            exact
            element={
              // <Protected isLoggedIn={loginData}>
              <ContactUs />
              // </Protected>
            }
          />
          <Route
            path="/about-us"
            element={
              // <Protected isLoggedIn={loginData}>
              <AboutUs />
              // {/* </Protected> */}
            }
          />
          <Route
            path="candidatepackageselection"
            element={
              <Protected isLoggedIn={loginData}>
                <CandidatePackageScreen userType="candidate" />
              </Protected>
            }
          />
          <Route
            path="vendorpackageselection"
            element={
              <Protected isLoggedIn={loginData}>
                <VendorPackageScreen userType="vendor" />
              </Protected>
            }
          />
          <Route
            path="counsellerpackageselection"
            element={
              <Protected isLoggedIn={loginData}>
                <CounsellerPackageScreen userType="counseller" />
              </Protected>
            }
          />
          <Route
            path="institutepackageselection"
            element={
              <Protected isLoggedIn={loginData}>
                <InstitutePackageScreen />
              </Protected>
            }
          />
          {/* Merged Events & Blogs page */}
          <Route path="events-blogs" element={<EventsBlogsPage />} />
          {/* Legacy redirects — keep detail pages working */}
          <Route path="events" element={<EventsBlogsPage />} />
          <Route path="blogs" element={<EventsBlogsPage />} />
          <Route
            path="events-details/:id"
            element={<EventDetails />}
          />
          <Route
            path="blogs-details/:id"
            element={<BlogDetails />}
          />
          <Route
            path="recruiter-job-search"
            element={
              <Protected isLoggedIn={loginData}>
                <RecruiterJobSearch />
              </Protected>
            }
          />
          <Route
            path="career-counselling/:preference"
            element={
              <Protected isLoggedIn={loginData}>
                <CareerCounseling />
              </Protected>
            }
          />
          <Route
            path="candidate"
            element={
              <Protected isLoggedIn={loginData}>
                <CandidateSearch />
              </Protected>
            }
          />
          <Route
            path="infrastructure-search/:preference"
            element={
              <Protected isLoggedIn={loginData}>
                <InfrastructureSearch />
              </Protected>
            }
          />
          <Route
            path="terms-conditions"
            element={
              // <Protected isLoggedIn={loginData}>
              <TermsAndConditions />
              // </Protected>
            }
          />
          <Route
            path="CandidateView"
            element={
              <Protected isLoggedIn={loginData}>
                <CandidateView />
              </Protected>
            }
          />
        </Routes>
      </div>
      {!isPackageScreen && <Footer />}
    </div>
  );
}

export default App;
