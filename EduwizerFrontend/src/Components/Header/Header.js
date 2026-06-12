// import { useEffect, useState } from "react";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
// import Container from "react-bootstrap/Container";
// import Image from "react-bootstrap/Image";
// import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import Logo from "../../Assests/Logo/logo.png";
// import {
//   // loginData as disptachFunction,
//   logoutAction,
//   profileDataAction,
// } from "../../Redux/Actions/dataAction";
// import { getProfileFromServer } from "../../Services/api";
// import "./index.scss";

// function Header() {
//   const dispatch = useDispatch();
//   const [navExpanded, setNavExpanded] = useState(false);
//   const { loginData, profileData } = useSelector((store) => store.dataReducer);

//   useEffect(() => {
//     if (loginData && !profileData) {
//       getProfile();
//       // if (loginResp?.data?.success) {
//       //   dispatch(loginData(loginResp.data.session));
//       //   navigate("/");
//       // }
//     }
//   });

//   const getProfile = async () => {
//     const profileResp = await getProfileFromServer();
//     dispatch(profileDataAction(profileResp.data.data));
//     console.log("profileResp", profileResp);
//   };
//   const handleNavToggle = () => setNavExpanded(!navExpanded);
//   const handleNavClose = () => setNavExpanded(false);
//   return (
//     //! remove expand if dont want mobile hamburger
//     <Navbar
//       bg="white"
//       expand="lg"
//       sticky="top"
//       className=" shadow-on-bottom"
//       onToggle={handleNavToggle}
//       expanded={navExpanded}
//     >
//       <Container fluid>
//         <Navbar.Brand>
//           <Link to="">
//             <Image src={Logo} style={{ height: "45px" }} />
//           </Link>
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav" className="w-100">
//           <Nav className="me-auto">
//             <Nav.Link>
//               <Navbar.Text>
//                 <Link to="" onClick={handleNavClose}>
//                   Home
//                 </Link>
//               </Navbar.Text>
//             </Nav.Link>
//             {profileData?.userType !== "candidate" && (
//               <Nav.Link>
//                 <Navbar.Text>
//                   <Link to="candidate" onClick={handleNavClose}>
//                     Candidate
//                   </Link>
//                   {/* Candidate */}
//                 </Navbar.Text>
//               </Nav.Link>
//             )}
//             {/* {profileData?.userType !== "institute" && (
//               <Nav.Link>
//                 <Navbar.Text>
//                   <Link to="/recruiter-job-search">Recruiter</Link>
//                 </Navbar.Text>
//               </Nav.Link>
//             )} */}
//             {profileData?.userType !== "vendor" && (
//               <Nav.Link className="p-35">
//                 <Navbar.Text>
//                   <DropdownButton
//                     id="dropdown-basic-button-infra"
//                     title="Infrastructure"
//                     className="header-dropdown-button"
//                   >
//                     <Dropdown.Item className="p-2">
//                       <Link
//                         to="/infrastructure-search/financialLoanServices"
//                         onClick={handleNavClose}
//                       >
//                         Financial Loan Services
//                       </Link>
//                     </Dropdown.Item>
//                     <Dropdown.Item className="p-2">
//                       <Link
//                         to="/infrastructure-search/smartTechnology"
//                         onClick={handleNavClose}
//                       >
//                         Smart Technology
//                       </Link>
//                     </Dropdown.Item>
//                     <Dropdown.Item className="p-2">
//                       <Link
//                         to="/infrastructure-search/integratedCurriculum"
//                         onClick={handleNavClose}
//                       >
//                         Integrated Curriculum
//                       </Link>
//                     </Dropdown.Item>

//                     <Dropdown.Item className="p-2">
//                       <Link
//                         to="/infrastructure-search/teacherTraining"
//                         onClick={handleNavClose}
//                       >
//                         Teacher Training
//                       </Link>
//                     </Dropdown.Item>

//                     <Dropdown.Item className="p-2">
//                       <Link
//                         to="/infrastructure-search/academicAuditForSchoolsCollegesUniversitiesPrivateInstitutions"
//                         onClick={handleNavClose}
//                       >
//                         Academic Audit for Schools, Colleges, Universities,
//                         Private Institutions
//                       </Link>
//                     </Dropdown.Item>
//                     <Dropdown.Item className="p-2">
//                       <Link
//                         to="/infrastructure-search/websiteDevelopment"
//                         onClick={handleNavClose}
//                       >
//                         Website Development
//                       </Link>
//                     </Dropdown.Item>
//                     <Dropdown.Item className="p-2">
//                       <Link
//                         to="/infrastructure-search/artificialIntelligence"
//                         onClick={handleNavClose}
//                       >
//                         Artificial Intelligence
//                       </Link>
//                     </Dropdown.Item>
//                   </DropdownButton>
//                   {/* <Link to="/infrastructure-search">Infrastructure</Link> */}
//                   {/* Infrastructure */}
//                 </Navbar.Text>
//               </Nav.Link>
//             )}
//             {profileData?.userType !== "counseller" && (
//               <Nav.Link className="p-35">
//                 <Navbar.Text>
//                   <DropdownButton
//                     id="dropdown-basic-button-infra"
//                     title="Counsellors"
//                     className="header-dropdown-button"
//                   >
//                     <Dropdown.Item className="p-2">
//                       <Link
//                         to="/career-counselling/career"
//                         onClick={handleNavClose}
//                       >
//                         Career
//                       </Link>
//                     </Dropdown.Item>
//                     <Dropdown.Item className="p-2">
//                       <Link
//                         to="/career-counselling/psychologist"
//                         onClick={handleNavClose}
//                       >
//                         Psychologist
//                       </Link>
//                     </Dropdown.Item>
//                     <Dropdown.Item className="p-2">
//                       <Link
//                         to="/career-counselling/schoolOrCollegeCounsellors"
//                         onClick={handleNavClose}
//                       >
//                         School/College Counsellors
//                       </Link>
//                     </Dropdown.Item>
//                   </DropdownButton>
//                 </Navbar.Text>
//               </Nav.Link>
//             )}
//             {/* <Nav.Link>
//               <Navbar.Text>Infrastructure</Navbar.Text>
//             </Nav.Link> */}
//             <Nav.Link>
//               <Navbar.Text>
//                 <Link to="events" onClick={handleNavClose}>
//                   Events
//                 </Link>
//               </Navbar.Text>
//             </Nav.Link>
//             <Nav.Link>
//               <Navbar.Text>
//                 <Link to="blogs" onClick={handleNavClose}>
//                   Blogs
//                 </Link>
//               </Navbar.Text>
//             </Nav.Link>
//             <Nav.Link>
//               <Navbar.Text>
//                 <Link to="/contact-us" onClick={handleNavClose}>
//                   Contact Us
//                 </Link>
//               </Navbar.Text>
//             </Nav.Link>
//             <Nav.Link>
//               <Navbar.Text>
//                 <Link to="about-us" onClick={handleNavClose}>
//                   About Us
//                 </Link>
//               </Navbar.Text>
//             </Nav.Link>

//             {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
//               <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
//               <NavDropdown.Item href="#action/3.2">
//                 Another action
//               </NavDropdown.Item>
//               <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item href="#action/3.4">
//                 Separated link
//               </NavDropdown.Item>
//             </NavDropdown> */}
//           </Nav>
//         </Navbar.Collapse>
//         <Navbar.Collapse className="justify-content-end">
//           <Nav className="me-auto">
//             {!loginData && (
//               <Nav.Link>
//                 <DropdownButton
//                   id="dropdown-basic-button"
//                   title="Sign Up"
//                   variant="warning"
//                   className="text-nowrap"
//                 >
//                   <Dropdown.Item className="p-2">
//                     <Link to="/register/candidate" onClick={handleNavClose}>
//                       Candidate
//                     </Link>
//                   </Dropdown.Item>
//                   <Dropdown.Item className="p-2">
//                     <Link to="/register/counseller" onClick={handleNavClose}>
//                       Counseller
//                     </Link>
//                   </Dropdown.Item>
//                   {/* <Dropdown.Item className="p-2">
//                     <Link to="/register/student">Student</Link>
//                   </Dropdown.Item> */}

//                   <Dropdown.Item className="p-2">
//                     <Link to="/register/vendor" onClick={handleNavClose}>
//                       Vendor
//                     </Link>
//                   </Dropdown.Item>

//                   <Dropdown.Item className="p-2">
//                     <Link to="/register/institute" onClick={handleNavClose}>
//                       Recruiter
//                     </Link>
//                   </Dropdown.Item>
//                 </DropdownButton>
//                 {/* <Button variant="warning" className="text-nowrap shadow-lg">
//                   <Link to="/register/candidate">Sign Up</Link>
//                 </Button> */}
//               </Nav.Link>
//             )}
//             {!loginData && (
//               <Nav.Link>
//                 <Button variant="warning" className="text-nowrap">
//                   <Link to="/login" onClick={handleNavClose}>
//                     Login
//                   </Link>
//                 </Button>
//               </Nav.Link>
//             )}
//             {loginData && (
//               <Nav.Link>
//                 <Button variant="warning" className="text-nowrap">
//                   <Link to="/dashboard" onClick={handleNavClose}>
//                     My Profile
//                   </Link>
//                 </Button>
//               </Nav.Link>
//             )}
//             {loginData && (
//               <Nav.Link>
//                 <Button
//                   onClick={() => {
//                     dispatch(logoutAction());
//                     handleNavClose();
//                   }}
//                   variant="warning"
//                   className="text-nowrap"
//                 >
//                   <Link to="/">Logout</Link>
//                 </Button>
//               </Nav.Link>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default Header;
import { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate, useLocation
import Logo from "../../Assests/Logo/logo.png";
import {
  logoutAction,
  profileDataAction,
} from "../../Redux/Actions/dataAction";
import { getProfileFromServer } from "../../Services/api";
import "./index.scss";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();
  const [navExpanded, setNavExpanded] = useState(false);
  const { loginData, profileData } = useSelector((store) => store.dataReducer);

  const isPackageScreen = [
    "/candidatepackageselection",
    "/vendorpackageselection",
    "/counsellerpackageselection",
    "/institutepackageselection",
  ].includes(location.pathname.toLowerCase());

  useEffect(() => {
    if (loginData && !profileData) {
      getProfile();
    }
  }, [loginData, profileData, dispatch]);

  const getProfile = async () => {
    const profileResp = await getProfileFromServer();
    dispatch(profileDataAction(profileResp.data.data));
    console.log("profileResp", profileResp);
  };

  const handleNavToggle = () => setNavExpanded(!navExpanded);
  const handleNavClose = () => setNavExpanded(false);

  if (isPackageScreen) {
    return (
      <Navbar bg="white" sticky="top" className="shadow-on-bottom">
        <Container fluid>
          <Navbar.Brand>
            <Link to="">
              <Image src={Logo} style={{ height: "45px" }} />
            </Link>
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center">
            {loginData && (
              <Nav.Link>
                <Button
                  onClick={() => {
                    dispatch(logoutAction());
                    navigate("/");
                  }}
                  variant="warning"
                  className="text-nowrap"
                >
                  Logout
                </Button>
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar
      bg="white"
      expand="xl"
      sticky="top"
      className="shadow-on-bottom"
      onToggle={handleNavToggle}
      expanded={navExpanded}
    >
      <Container fluid>
        <Navbar.Brand>
          <Link to="">
            <Image src={Logo} style={{ height: "45px" }} />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="w-100">
          <Nav className="mx-auto align-items-center">
            <Nav.Link>
              <Navbar.Text>
                <Link to="" onClick={handleNavClose}>
                  Home
                </Link>
              </Navbar.Text>
            </Nav.Link>

            {profileData?.userType !== "vendor" && (
              <Nav.Link className="p-35">
                <Navbar.Text>
                  <DropdownButton
                    id="dropdown-basic-button-infra"
                    title="Infrastructure"
                    className="header-dropdown-button"
                  >
                    <Dropdown.Item className="p-2">
                      <Link
                        to="/infrastructure-search/financialLoanServices"
                        onClick={handleNavClose}
                      >
                        Financial Loan Services
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item className="p-2">
                      <Link
                        to="/infrastructure-search/smartTechnology"
                        onClick={handleNavClose}
                      >
                        Smart Technology
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item className="p-2">
                      <Link
                        to="/infrastructure-search/integratedCurriculum"
                        onClick={handleNavClose}
                      >
                        Integrated Curriculum
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item className="p-2">
                      <Link
                        to="/infrastructure-search/teacherTraining"
                        onClick={handleNavClose}
                      >
                        Teacher Training
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item className="p-2">
                      <Link
                        to="/infrastructure-search/academicAuditForSchoolsCollegesUniversitiesPrivateInstitutions"
                        onClick={handleNavClose}
                      >
                        Academic Audit for Schools, Colleges, Universities,
                        Private Institutions
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item className="p-2">
                      <Link
                        to="/infrastructure-search/websiteDevelopment"
                        onClick={handleNavClose}
                      >
                        Website Development
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item className="p-2">
                      <Link
                        to="/infrastructure-search/artificialIntelligence"
                        onClick={handleNavClose}
                      >
                        Artificial Intelligence
                      </Link>
                    </Dropdown.Item>
                  </DropdownButton>
                </Navbar.Text>
              </Nav.Link>
            )}
            {profileData?.userType !== "counseller" && (
              <Nav.Link className="p-35">
                <Navbar.Text>
                  <DropdownButton
                    id="dropdown-basic-button-infra"
                    title="Counsellors"
                    className="header-dropdown-button"
                  >
                    <Dropdown.Item className="p-2">
                      <Link
                        to="/career-counselling/career"
                        onClick={handleNavClose}
                      >
                        Career
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item className="p-2">
                      <Link
                        to="/career-counselling/psychologist"
                        onClick={handleNavClose}
                      >
                        Psychologist
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item className="p-2">
                      <Link
                        to="/career-counselling/schoolOrCollegeCounsellors"
                        onClick={handleNavClose}
                      >
                        School/College Counsellors
                      </Link>
                    </Dropdown.Item>
                  </DropdownButton>
                </Navbar.Text>
              </Nav.Link>
            )}
            <Nav.Link>
              <Navbar.Text>
                <Link to="events-blogs" onClick={handleNavClose}>
                  Events &amp; Blogs
                </Link>
              </Navbar.Text>
            </Nav.Link>
            <Nav.Link>
              <Navbar.Text>
                <Link to="/contact-us" onClick={handleNavClose}>
                  Contact Us
                </Link>
              </Navbar.Text>
            </Nav.Link>
            <Nav.Link>
              <Navbar.Text>
                <Link to="about-us" onClick={handleNavClose}>
                  About Us
                </Link>
              </Navbar.Text>
            </Nav.Link>
            <Nav.Link
              className="nav-setup-school text-nowrap"
              onClick={() => {
                handleNavClose();
                window.open("https://ngeduwizer.com", "_blank");
              }}
            >
              Setup a School
            </Nav.Link>
          </Nav>

          {/* Auth buttons — always inside same collapse */}
          <Nav className="ms-auto align-items-center gap-2">
            {!loginData && (
              <Nav.Link>
                <DropdownButton
                  id="dropdown-basic-button"
                  title="Sign Up"
                  variant="warning"
                  className="text-nowrap"
                >
                  <Dropdown.Item className="p-2">
                    <Link to="/register/candidate" onClick={handleNavClose}>
                      Candidate
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item className="p-2">
                    <Link to="/register/counseller" onClick={handleNavClose}>
                      Counseller
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item className="p-2">
                    <Link to="/register/vendor" onClick={handleNavClose}>
                      Vendor
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item className="p-2">
                    <Link to="/register/institute" onClick={handleNavClose}>
                      Recruiter
                    </Link>
                  </Dropdown.Item>
                </DropdownButton>
              </Nav.Link>
            )}
            {!loginData && (
              <Nav.Link>
                <Button
                  variant="warning"
                  className="text-nowrap"
                  onClick={() => {
                    handleNavClose();
                    navigate("/login");
                  }}
                >
                  Login
                </Button>
              </Nav.Link>
            )}
            {loginData && (
              <Nav.Link>
                <Button
                  variant="warning"
                  className="text-nowrap"
                  onClick={() => {
                    handleNavClose();
                    navigate("/dashboard");
                  }}
                >
                  My Profile
                </Button>
              </Nav.Link>
            )}
            {loginData && (
              <Nav.Link>
                <Button
                  onClick={() => {
                    dispatch(logoutAction());
                    handleNavClose();
                    navigate("/");
                  }}
                  variant="warning"
                  className="text-nowrap"
                >
                  Logout
                </Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
