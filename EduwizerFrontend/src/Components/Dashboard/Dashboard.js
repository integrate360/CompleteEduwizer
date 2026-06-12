import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button } from "react-bootstrap";
import {
  Autocomplete,
  // Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Switch,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../../Assests/Logo/logo.png";
import { getProfileFromServer, updateProfile } from "../../Services/api";
import {
  getAllCitiesOfACountry,
  getCountries,
  getStates,
} from "../../Utils/countriesAndStates";
import CustomLoadingAnimation from "../Common/CustomLoadingAnimation";
import CustomToast from "../Common/CustomToast";
import UploadFile from "../PreLogin/UploadFile";

const Dashboard = () => {
  const navigate = useNavigate();
  // const { type } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null); // candidate, student, vendor, counseller, institute
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const userTypeAndFieldsMappings = {
    candidate: [
      "availableForHire",
      "firstName",
      "firstNameShowOnProfile",
      "lastName",
      "lastNameShowOnProfile",
      "url",
      "fileType",
      "educationBoard",
      "educationBoardShowOnProfile",
      "ctc",
      "ctcShowOnProfile",
      "expectedCtc",
      "expectedCtcShowOnProfile",
      "userName",
      "userNameShowOnProfile",
      "password",
      // 'passwordShowOnProfile',
      "reTypePassword",
      "contactShowOnProfile",
      "phone",
      "phoneShowOnProfile",
      "whatsapp",
      "whatsappShowOnProfile",
      "email",
      "emailShowOnProfile",
      "address",
      "addressShowOnProfile",
      "city",
      "cityShowOnProfile",
      "state",
      "stateShowOnProfile",
      "country",
      "countryShowOnProfile",
      "aboutMeShowOnProfile",
      "aboutMe",
      "experience",
      "experienceShowOnProfile",
      "education",
      "educationShowOnProfile",
      "skills",
      "skillsShowOnProfile",
      "languages",
      "languagesShowOnProfile",
      "awardsAndRecognition",
      "awardsAndRecognitionShowOnProfile",
    ],
    student: [
      "generalsShowOnProfile",
      "instituteName",
      "url",
      "fileType",
      // 'instituteNameShowOnProfile',
      "location",
      // 'locationShowOnProfile',
      "educationBoard",
      "ctc",
      "expectedCtc",
      // 'educationBoardShowOnProfile',
      "userName",
      // 'userNameShowOnProfile',
      "password",
      // 'passwordShowOnProfile',
      "reTypePassword",
      "contactShowOnProfile",
      "phone",
      // 'phoneShowOnProfile',
      "whatsapp",
      // 'whatsappShowOnProfile',
      "email",
      // 'emailShowOnProfile',
      "address",
      // 'addressShowOnProfile',
      "city",
      // 'cityShowOnProfile',
      "state",
      // "stateShowOnProfile",
      "country",
      // 'countryShowOnProfile',
    ],
    vendor: [
      "availableForHire",
      "firstName",
      "firstNameShowOnProfile",
      "url",
      "fileType",
      "lastName",
      "lastNameShowOnProfile",
      "category", //
      "categoryShowOnProfile",
      "userName",
      "userNameShowOnProfile",
      "password",
      // 'passwordShowOnProfile',
      "reTypePassword",
      "contactShowOnProfile",
      "phone",
      "phoneShowOnProfile",
      "whatsapp",
      "whatsappShowOnProfile",
      "email",
      "emailShowOnProfile",
      "address",
      "addressShowOnProfile",
      "city",
      "cityShowOnProfile",
      "state",
      "stateShowOnProfile",
      "country",
      "countryShowOnProfile",
      "aboutMeShowOnProfile",
      "aboutMe",
      "servicesProvided", //
      "servicesProvidedShowOnProfile",
    ],
    counseller: [
      "availableForHire",
      "firstName",
      "firstNameShowOnProfile",
      "url",
      "fileType",
      "lastName",
      "lastNameShowOnProfile",
      "educationBoard",
      "educationBoardShowOnProfile",
      "userName",
      "userNameShowOnProfile",
      "password",
      // 'passwordShowOnProfile',
      "reTypePassword",
      "contactShowOnProfile",
      "phone",
      "phoneShowOnProfile",
      "whatsapp",
      "whatsappShowOnProfile",
      "email",
      "emailShowOnProfile",
      "address",
      "addressShowOnProfile",
      "city",
      "cityShowOnProfile",
      "state",
      "stateShowOnProfile",
      "country",
      "countryShowOnProfile",
      "aboutMeShowOnProfile",
      "aboutMe",
      "experience",
      "experienceShowOnProfile",
      "education",
      "educationShowOnProfile",
      "skills",
      "skillsShowOnProfile",
      "languages",
      "languagesShowOnProfile",
      "awardsAndRecognition",
      "awardsAndRecognitionShowOnProfile",
    ],
    institute: [
      "instituteName",
      "instituteNameShowOnProfile",
      "url",
      "fileType",
      "location",
      "locationShowOnProfile",
      "educationBoard",
      "educationBoardShowOnProfile",
      "userName",
      // 'userNameShowOnProfile',
      "password",
      // 'passwordShowOnProfile',
      "reTypePassword",
      // 'contactShowOnProfile',
      "phone",
      "phoneShowOnProfile",
      "whatsapp",
      "whatsappShowOnProfile",
      "email",
      "emailShowOnProfile",
      "address",
      "addressShowOnProfile",
      "city",
      "cityShowOnProfile",
      "state",
      "stateShowOnProfile",
      "country",
      "countryShowOnProfile",
      "aboutUsShowOnProfile",
      "aboutUs",
      "lifeAtInstitute",
      "lifeAtInstituteShowOnProfile",
    ],
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const getProfile = async () => {
    const profileResp = await getProfileFromServer();
    setType(profileResp.data.data.userType);
    if (profileResp.data.data.country) {
      setCitiesDropdown(profileResp.data.data.country);
    }
    setProfileData(profileResp.data.data);
    console.log("profileResp", profileResp);
  };

  useEffect(() => {
    console.log("hahah");
    // const cities = getAllCitiesOfACountry("India");
    // setCities(cities);
    getProfile();
  }, []);

  useEffect(() => {
    const countries = getCountries();
    setCountries(countries);
    // const cities = getAllCitiesOfACountry(countries[0]);
    // setCities(cities);
  }, []);

  const setCitiesDropdown = (country) => {
    const cities = getAllCitiesOfACountry(country);
    setCities(cities);
  };
  const setStatesDropdown = (country) => {
    const states = getStates(country);
    setStates(states);
  };

  const callUpdateProfile = async (values, setSubmitting) => {
    try {
      setLoading(true);
      delete values.reTypePassword;
      delete values.email;
      if (!values.password) {
        delete values.password;
        delete values.reTypePassword;
      }
      const updateResp = await updateProfile(values);
      setLoading(false);
      // const userId = signupResp?.data?.data?._id
      // console.log('signupResp :>> ', signupResp, userId)
      // if (userId) {
      //     const sendOtpResp = await sendotp({ userId })
      //     localStorage.setItem('userId', userId)
      //     navigate('/verifyotp')
      //     console.log('sendOtpResp :>> ', sendOtpResp)
      // }
    } catch (error) {
      toast(<CustomToast type="error" message={error || error.message} />);
      console.log("error :>> ", error);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const validateTheForm = (values, errors) => {
    console.log("validation", values, errors);
    if (!values.firstName) {
      errors.firstName = "Required";
    }
    if (!values.url) {
      errors.url = "Required";
    }
    if (!values.fileType) {
      errors.fileType = "Required";
    }
    if (!values.lastName) {
      errors.lastName = "Required";
    }
    if (!values.userName) {
      errors.userName = "Required";
    }
    if (!values.password) {
      errors.password = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    }
    if (!values.phone) {
      errors.phone = "Required";
    }
    if (!values.pincode) {
      errors.pincode = "Required";
    }
    if (!values.city) {
      errors.city = "Required";
    }
    if (!values.preference) {
      errors.preference = "Required";
    }
    switch (type) {
      case "candidate":
      case "counseller":
        if (!values.age) {
          errors.age = "Required";
        }
        if (!values.experience) {
          errors.experience = "Required";
        }
        if (!values.board) {
          errors.board = "Required";
        }
        break;
      case "student":
        if (!values.age) {
          errors.age = "Required";
        }
        break;
      case "vendor":
      case "institute":
        if (!values.board) {
          errors.board = "Required";
        }
        break;
      default:
        break;
    }
    // return errors
    return {};
  };

  const setInitialValues = (type, response = {}) => {
    let initialValues = {};
    switch (type) {
      case "candidate":
        initialValues = {
          availableForHire: response.availableForHire || false,
          firstName: response.firstName || "",
          url: response.url || "",
          fileType: response.fileType || "",
          firstNameShowOnProfile: response.firstNameShowOnProfile || false,
          lastName: response.lastName || "",
          lastNameShowOnProfile: response.lastNameShowOnProfile || false,
          educationBoard: response.educationBoard || "",
          educationBoardShowOnProfile:
            response.educationBoardShowOnProfile || false,
          ctc: response.ctc || "",
          ctcShowOnProfile: response.ctcShowOnProfile || false,
          expectedCtc: response.expectedCtc || "",
          expectedCtcShowOnProfile: response.expectedCtcShowOnProfile || false,
          userName: response.userName || "",
          userNameShowOnProfile: response.userNameShowOnProfile || false,
          password: response.password || "",
          reTypePassword: response.reTypePassword || "",
          contactShowOnProfile: response.contactShowOnProfile || false,
          phone: response.phone || "",
          phoneShowOnProfile: response.phoneShowOnProfile || false,
          whatsapp: response.whatsapp || "",
          whatsappShowOnProfile: response.whatsappShowOnProfile || "",
          email: response.email || "",
          emailShowOnProfile: response.emailShowOnProfile || "",
          address: response.address || "",
          addressShowOnProfile: response.addressShowOnProfile || "",
          city: response.city || "",
          cityShowOnProfile: response.cityShowOnProfile || "",
          country: response.country || "",
          countryShowOnProfile: response.countryShowOnProfile || "",
          state: response.state || "",
          stateShowOnProfile: response.stateShowOnProfile || "",
          aboutMe: response.aboutMe || "",
          aboutMeShowOnProfile: response.aboutMeShowOnProfile || false,
          experience: response.experience || "",
          experienceShowOnProfile: response.experienceShowOnProfile || false,
          education: response.education || "",
          educationShowOnProfile: response.educationShowOnProfile || false,
          skills: response.skills || "",
          skillsShowOnProfile: response.skillsShowOnProfile || false,
          languages: response.languages || "",
          languagesShowOnProfile: response.languagesShowOnProfile || false,
          awardsAndRecognition: response.awardsAndRecognition || "",
          awardsAndRecognitionShowOnProfile:
            response.awardsAndRecognitionShowOnProfile || false,
        };
        break;
      case "counseller":
        initialValues = {
          availableForHire: response.availableForHire || false,
          firstName: response.firstName || "",
          url: response.url || "",
          fileType: response.fileType || "",
          firstNameShowOnProfile: response.firstNameShowOnProfile || false,
          lastName: response.lastName || "",
          lastNameShowOnProfile: response.lastNameShowOnProfile || false,
          educationBoard: response.educationBoard || "",
          educationBoardShowOnProfile:
            response.educationBoardShowOnProfile || false,
          userName: response.userName || "",
          userNameShowOnProfile: response.userNameShowOnProfile || false,
          password: response.password || "",
          reTypePassword: response.reTypePassword || "",
          contactShowOnProfile: response.contactShowOnProfile || false,
          phone: response.phone || "",
          phoneShowOnProfile: response.phoneShowOnProfile || false,
          whatsapp: response.whatsapp || "",
          whatsappShowOnProfile: response.whatsappShowOnProfile || "",
          email: response.email || "",
          emailShowOnProfile: response.emailShowOnProfile || "",
          address: response.address || "",
          addressShowOnProfile: response.addressShowOnProfile || "",
          city: response.city || "",
          cityShowOnProfile: response.cityShowOnProfile || "",
          country: response.country || "",
          countryShowOnProfile: response.countryShowOnProfile || "",
          state: response.state || "",
          stateShowOnProfile: response.stateShowOnProfile || "",
          aboutMe: response.aboutMe || "",
          aboutMeShowOnProfile: response.aboutMeShowOnProfile || false,
          experience: response.experience || "",
          experienceShowOnProfile: response.experienceShowOnProfile || false,
          education: response.education || "",
          educationShowOnProfile: response.educationShowOnProfile || false,
          skills: response.skills || "",
          skillsShowOnProfile: response.skillsShowOnProfile || false,
          languages: response.languages || "",
          languagesShowOnProfile: response.languagesShowOnProfile || false,
          awardsAndRecognition: response.awardsAndRecognition || "",
          awardsAndRecognitionShowOnProfile:
            response.awardsAndRecognitionShowOnProfile || false,
        };
        break;
      case "student":
        initialValues = {
          generalsShowOnProfile: response.generalsShowOnProfile || false,
          url: response.url || "",
          fileType: response.fileType || "",
          instituteName: response.instituteName || "",
          location: response.location || "",
          educationBoard: response.educationBoard || "",
          ctc: response.ctc || "",
          expectedCtc: response.expectedCtc || "",
          userName: response.userName || "",
          password: response.password || "",
          reTypePassword: response.reTypePassword || "",
          contactShowOnProfile: response.contactShowOnProfile || false,
          phone: response.phone || "",
          // phoneShowOnProfile: response.phoneShowOnProfile || false,
          whatsapp: response.whatsapp || "",
          // whatsappShowOnProfile: '',
          email: response.email || "",
          // emailShowOnProfile: '',
          address: response.address || "",
          // addressShowOnProfile: '',
          city: response.city || "",
          // cityShowOnProfile: '',
          state: response.state || "",
          // stateShowOnProfile: response.stateShowOnProfile || "",
          country: response.country || "",
          // countryShowOnProfile: '',
        };
        break;
      case "vendor":
        initialValues = {
          availableForHire: response.availableForHire || false,
          firstName: response.firstName || "",
          url: response.url || "",
          fileType: response.fileType || "",
          firstNameShowOnProfile: response.firstNameShowOnProfile || false,
          lastName: response.lastName || "",
          lastNameShowOnProfile: response.lastNameShowOnProfile || false,
          category: response.category || "",
          categoryShowOnProfile: response.categoryShowOnProfile || false,
          userName: response.userName || "",
          userNameShowOnProfile: response.userNameShowOnProfile || false,
          password: response.password || "",
          reTypePassword: response.reTypePassword || "",
          contactShowOnProfile: response.contactShowOnProfile || false,
          phone: response.phone || "",
          phoneShowOnProfile: response.phoneShowOnProfile || false,
          whatsapp: response.whatsapp || "",
          whatsappShowOnProfile: response.availableForHire || "",
          email: response.email || "",
          emailShowOnProfile: response.emailShowOnProfile || "",
          address: response.address || "",
          addressShowOnProfile: response.addressShowOnProfile || "",
          city: response.city || "",
          cityShowOnProfile: response.cityShowOnProfile || "",
          country: response.country || "",
          countryShowOnProfile: response.countryShowOnProfile || "",
          state: response.state || "",
          stateShowOnProfile: response.stateShowOnProfile || "",
          aboutMe: response.aboutMe || "",
          aboutMeShowOnProfile: response.aboutMeShowOnProfile || false,
          servicesProvided: response.servicesProvided || "",
          servicesProvidedShowOnProfile:
            response.servicesProvidedShowOnProfile || false,
        };
        break;
      case "institute":
        initialValues = {
          instituteName: response.instituteName || "",
          url: response.url || "",
          fileType: response.fileType || "",
          instituteNameShowOnProfile:
            response.instituteNameShowOnProfile || false,
          location: response.location || "",
          locationShowOnProfile: response.locationShowOnProfile || false,
          educationBoard: response.educationBoard || "",
          educationBoardShowOnProfile:
            response.educationBoardShowOnProfile || false,
          userName: response.userName || "",
          password: response.password || "",
          reTypePassword: response.reTypePassword || "",
          contactShowOnProfile: response.contactShowOnProfile || false,
          phone: response.phone || "",
          phoneShowOnProfile: response.phoneShowOnProfile || false,
          whatsapp: response.whatsapp || "",
          whatsappShowOnProfile: response.whatsappShowOnProfile || "",
          email: response.email || "",
          emailShowOnProfile: response.emailShowOnProfile || "",
          address: response.address || "",
          addressShowOnProfile: response.addressShowOnProfile || "",
          city: response.city || "",
          cityShowOnProfile: response.cityShowOnProfile || "",
          country: response.country || "",
          countryShowOnProfile: response.countryShowOnProfile || "",
          state: response.state || "",
          stateShowOnProfile: response.stateShowOnProfile || "",
          aboutUs: response.aboutUs || "",
          aboutUsShowOnProfile: response.aboutUSShowOnProfile || false,
          lifeAtInstitute: response.lifeAtInstitute || "",
          lifeAtInstituteShowOnProfile:
            response.lifeAtInstituteShowOnProfile || false,
        };
        break;
      default:
        break;
    }
    return initialValues;
  };

  return (
    <>
      <div className="row">
        {/* <h3 className='col-12 text-center'>Sign up as {type}</h3> */}
        <div className="col-md-3 col-lg-3 px-4">
          <div className="border-custom p-2">
            <div className="col-12 text-center font-weight-bold">
              {profileData?.url ? (
                <img
                  src={profileData?.url}
                  alt="image"
                  width="80%"
                  className="img-fluid m-2 rounded-circle"
                  style={{
                    height: "250px",
                    width: "250px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <img
                  src="http://localhost:3001/static/media/Footer-Logo.09843b48550aea11a6428bad1a242dc0.svg"
                  alt="sample image"
                  width="80%"
                  className="img-fluid m-2 rounded-circle object-cover"
                  style={{
                    height: "250px",
                    width: "250px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <div className="col-12 text-center font-weight-bold">
              {profileData?.firstName} {profileData?.lastName}
            </div>
            {profileData?.userType && (
              <div className="col-12 text-center font-weight-bold text-capitalize">
                ({profileData?.userType})
              </div>
            )}

            <hr></hr>
            <div className="col-12 text-center">{profileData?.phone}</div>
            <div className="col-12 text-center mt-2">{profileData?.email}</div>
          </div>
        </div>
        {type && profileData && (
          <div className="col-md-9 col-lg-9 row">
            <div className="col-12">
              <Formik
                initialValues={setInitialValues(type, profileData)}
                validate={(values) => {
                  const errors = {};
                  return validateTheForm(values, errors);
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  console.log("vivekkk", values);
                  // values.userType = type
                  callUpdateProfile(values, setSubmitting);
                  toast(
                    <CustomToast
                      type="success"
                      message={`Your profile has been updated`}
                    />
                  );
                  console.log("values", values);
                  // setSubmitting(false)
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue,
                  /* and other goodies */
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div>{/* {JSON.stringify(values)} */}</div>
                    <div className="row mt-2">
                      <div className="col-12 row">
                        <div className="col-4 font-weight-bold">
                          Edit Profile
                        </div>
                        <div className="col-8 text-right">
                          {userTypeAndFieldsMappings[type].includes(
                            "availableForHire"
                          ) && (
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "25ch" }}
                                variant="outlined"
                              >
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.availableForHire}
                                      value={values.availableForHire}
                                      onChange={(value) => {
                                        setFieldValue(
                                          "availableForHire",
                                          value.target.checked
                                        );
                                      }}
                                      defaultChecked
                                    />
                                  }
                                  label="Available for hire?"
                                />
                              </FormControl>
                            </div>
                          )}
                          <div className="d-inline-block mr-2">
                            <FormControl
                              sx={{ m: 1, width: "20ch" }}
                              variant="outlined"
                            >
                              <Button
                                variant="warning"
                                size="large"
                                className="m-btn"
                              >
                                Cancel
                              </Button>
                            </FormControl>
                          </div>
                          <div className="d-inline-block mr-2">
                            <FormControl
                              sx={{ m: 1, width: "20ch" }}
                              variant="warning"
                            >
                              <Button
                                type="submit"
                                variant="warning"
                                className="m-btn"
                                size="large"
                              >
                                Save Changes
                              </Button>
                            </FormControl>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 row mt-3">
                        <div className="col-4 font-weight-bold">Generals</div>
                        <div className="col-8 text-right">
                          {userTypeAndFieldsMappings[type].includes(
                            "generalsShowOnProfile"
                          ) && (
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "25ch" }}
                                variant="outlined"
                              >
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.generalsShowOnProfile}
                                      value={values.generalsShowOnProfile}
                                      onChange={(value) => {
                                        setFieldValue(
                                          "generalsShowOnProfile",
                                          value.target.checked
                                        );
                                      }}
                                      defaultChecked
                                    />
                                  }
                                  label="Show on profile"
                                />
                              </FormControl>
                            </div>
                          )}
                          <div className="d-inline-block mr-2">
                            <FormControl
                              sx={{ m: 1, width: "20ch" }}
                              variant="outlined"
                            >
                              {/* <Button
                                variant="warning"
                                className="m-btn"
                                size="large"
                              >
                                Edit
                              </Button> */}
                            </FormControl>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes(
                          "firstName"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                First Name
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "firstNameShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={
                                            values.firstNameShowOnProfile
                                          }
                                          value={values.firstNameShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "firstNameShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <OutlinedInput
                                id="outlined-adornment-firstName"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                // label='First Name'
                                name="firstName"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.firstName}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.firstName &&
                                touched.firstName &&
                                errors.firstName}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "lastName"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Last Name
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "lastNameShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.lastNameShowOnProfile}
                                          value={values.lastNameShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "lastNameShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <OutlinedInput
                                id="outlined-adornment-lastName"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="lastName"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.lastName}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.lastName &&
                                touched.lastName &&
                                errors.lastName}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes("url") && (
                          <>
                            <div className="col-12 col-md-6 col-lg-4 mt-5 d-flex align-items-center">
                              <UploadFile
                                accept=".png,.jpg,.jpeg,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.ogg,.ogv,.youtube"
                                editData={{
                                  url: values.url,
                                  fileType: values.fileType,
                                }}
                                uploadFileProp={(file, url, fileType) => {
                                  setFieldValue("url", url);
                                  setFieldValue("fileType", fileType);
                                }}
                              />
                              <div className="color-red">
                                {errors.url && touched.url && errors.url}
                                {values.url &&
                                  values.url.length > 1048576 &&
                                  "Upload an image smaller than 1 MB."}
                              </div>
                            </div>
                            {values.url && values.url.length <= 1048576 && (
                              <div className="d-flex justify-content-end">
                                <label className="color-red">
                                  Image Format Should be [.png, .jpg, or .jpeg]
                                </label>
                              </div>
                            )}
                          </>
                        )}

                        {userTypeAndFieldsMappings[type].includes(
                          "category"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Category
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "categoryShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.categoryShowOnProfile}
                                          value={values.categoryShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "categoryShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <OutlinedInput
                                id="outlined-adornment-category"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="category"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.category}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.category &&
                                touched.category &&
                                errors.category}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "instituteName"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Institute Name
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "instituteNameShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={
                                            values.instituteNameShowOnProfile
                                          }
                                          value={
                                            values.instituteNameShowOnProfile
                                          }
                                          onChange={(value) => {
                                            setFieldValue(
                                              "instituteNameShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <OutlinedInput
                                id="outlined-adornment-instituteName"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="instituteName"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.instituteName}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.instituteName &&
                                touched.instituteName &&
                                errors.instituteName}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "location"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Location
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "locationShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.locationShowOnProfile}
                                          value={values.locationShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "locationShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <OutlinedInput
                                id="outlined-adornment-location"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="location"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.location}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.location &&
                                touched.location &&
                                errors.location}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "educationBoard"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Education Board
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "educationBoardShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={
                                            values.educationBoardShowOnProfile
                                          }
                                          value={
                                            values.educationBoardShowOnProfile
                                          }
                                          onChange={(value) => {
                                            setFieldValue(
                                              "educationBoardShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select-educationBoard"
                                value={values.educationBoard}
                                name="educationBoard"
                                // label="EducationBoard"
                                onChange={handleChange}
                              >
                                <MenuItem value="icse">ICSE</MenuItem>
                                <MenuItem value="cbse">CBSE</MenuItem>
                                <MenuItem value="igse">IGSE</MenuItem>
                                <MenuItem value="state board">
                                  State Board
                                </MenuItem>
                                <MenuItem value="ib">IB</MenuItem>
                                <MenuItem value="cambridge">Cambridge</MenuItem>
                              </Select>
                            </FormControl>
                            <div className="color-red">
                              {errors.educationBoard &&
                                touched.educationBoard &&
                                errors.educationBoard}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes("ctc") && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                CTC
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "ctcShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.ctcShowOnProfile}
                                          value={values.ctcShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "ctcShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select-ctc"
                                value={values.ctc}
                                name="ctc"
                                // label="ctc"
                                onChange={handleChange}
                              >
                                <MenuItem value="1to3lpa">1 - 3 LPA</MenuItem>
                                <MenuItem value="3to5lpa">3 - 5 LPA</MenuItem>
                                <MenuItem value="5to10lpa">5 - 10 LPA</MenuItem>
                                <MenuItem value="10to15pa">
                                  10 - 15 LPA
                                </MenuItem>
                                <MenuItem value="15to25lpa">
                                  15 - 25 LPA
                                </MenuItem>
                                <MenuItem value="25+lpa">25+ LPA</MenuItem>
                              </Select>
                            </FormControl>
                            <div className="color-red">
                              {errors.ctc && touched.ctc && errors.ctc}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "expectedCtc"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Expected CTC
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "expectedCtcShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={
                                            values.expectedCtcShowOnProfile
                                          }
                                          value={
                                            values.expectedCtcShowOnProfile
                                          }
                                          onChange={(value) => {
                                            setFieldValue(
                                              "expectedCtcShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select-expectedCtc"
                                value={values.expectedCtc}
                                name="expectedCtc"
                                // label="expectedCtc"
                                onChange={handleChange}
                              >
                                <MenuItem value="1to3lpa">1 to 3 LPA</MenuItem>
                                <MenuItem value="3to5lpa">3 to 5 LPA</MenuItem>
                                <MenuItem value="5to10lpa">5 - 10 LPA</MenuItem>
                                <MenuItem value="10to15pa">
                                  10 - 15 LPA
                                </MenuItem>
                                <MenuItem value="15to25lpa">
                                  15 - 25 LPA
                                </MenuItem>
                                <MenuItem value="25+lpa">25+ LPA</MenuItem>
                              </Select>
                            </FormControl>
                            <div className="color-red">
                              {errors.expectedCtc &&
                                touched.expectedCtc &&
                                errors.expectedCtc}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "userName"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Username
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "userNameShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.userNameShowOnProfile}
                                          value={values.userNameShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "userNameShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <OutlinedInput
                                id="outlined-adornment-userName"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="userName"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.userName}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.userName &&
                                touched.userName &&
                                errors.userName}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "password"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Password
                              </FormHelperText>
                              <OutlinedInput
                                id="outlined-adornment-password"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.password &&
                                touched.password &&
                                errors.password}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "reTypePassword"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Re-Type Password
                              </FormHelperText>
                              <OutlinedInput
                                id="outlined-adornment-Re-Type-Password"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type={showPassword ? "text" : "password"}
                                name="reTypePassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.reTypePassword}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.reTypePassword &&
                                touched.reTypePassword &&
                                errors.reTypePassword}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-12 row mt-3">
                        <div className="col-4 font-weight-bold">CONTACT</div>
                        <div className="col-8 text-right">
                          <div className="d-inline-block mr-2">
                            <FormControl
                              sx={{ m: 1, width: "25ch" }}
                              variant="outlined"
                            >
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.contactShowOnProfile}
                                    value={values.contactShowOnProfile}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "contactShowOnProfile",
                                        value.target.checked
                                      );
                                    }}
                                    defaultChecked
                                  />
                                }
                                label="Show on profile"
                              />
                            </FormControl>
                          </div>
                          <div className="d-inline-block mr-2">
                            <FormControl
                              sx={{ m: 1, width: "20ch" }}
                              variant="outlined"
                            >
                              {/* <Button
                                variant="warning"
                                className="m-btn"
                                size="large"
                              >
                                Edit
                              </Button> */}
                            </FormControl>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes("phone") && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Phone Number
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "phoneShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.phoneShowOnProfile}
                                          value={values.phoneShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "phoneShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <OutlinedInput
                                id="outlined-adornment-phone"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="phone"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phone}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.phone && touched.phone && errors.phone}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "whatsapp"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Whatsapp
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "whatsappShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.whatsappShowOnProfile}
                                          value={values.whatsappShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "whatsappShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <OutlinedInput
                                id="outlined-adornment-Whatsapp"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="whatsapp"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.whatsapp}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.whatsapp &&
                                touched.whatsapp &&
                                errors.whatsapp}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes("email") && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Email
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "emailShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.emailShowOnProfile}
                                          value={values.emailShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "emailShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <OutlinedInput
                                id="outlined-adornment-email"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="email"
                                disabled="true"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.email && touched.email && errors.email}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "address"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Address
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "addressShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.addressShowOnProfile}
                                          value={values.addressShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "addressShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <OutlinedInput
                                id="outlined-adornment-address"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="address"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.address}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.address &&
                                touched.address &&
                                errors.address}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes(
                          "country"
                        ) && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Country
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "countryShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.countryShowOnProfile}
                                          value={values.countryShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "countryShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <Autocomplete
                                id="demo-simple-select-country"
                                value={values.country}
                                name="country"
                                disablePortal
                                onChange={(e, value) => {
                                  setFieldValue("country", value);
                                  setFieldValue("city", null);
                                  setCitiesDropdown(value);
                                  setStatesDropdown(value);
                                }}
                                options={countries}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.country &&
                                touched.country &&
                                errors.country}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes("state") && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                State
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "stateShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.stateShowOnProfile}
                                          value={values.stateShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "stateShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <Autocomplete
                                id="demo-simple-select-state"
                                value={values.state}
                                name="state"
                                disablePortal
                                onChange={(e, value) => {
                                  setFieldValue("state", value);
                                  setFieldValue("city", null);
                                  setCitiesDropdown(value);
                                }}
                                options={states}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.state && touched.state && errors.state}
                            </div>
                          </div>
                        )}
                        {userTypeAndFieldsMappings[type].includes("city") && (
                          <div className="col-12 col-md-6 col-lg-4 mt-3">
                            <FormControl
                              sx={{ m: 1, width: "36ch" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                City
                              </FormHelperText>
                              {userTypeAndFieldsMappings[type].includes(
                                "cityShowOnProfile"
                              ) && (
                                <div className="pos-viv">
                                  <FormControl
                                    sx={{ m: 1, width: "25ch" }}
                                    variant="outlined"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={values.cityShowOnProfile}
                                          value={values.cityShowOnProfile}
                                          onChange={(value) => {
                                            setFieldValue(
                                              "cityShowOnProfile",
                                              value.target.checked
                                            );
                                          }}
                                          defaultChecked
                                        />
                                      }
                                      label="Show on profile"
                                    />
                                  </FormControl>
                                </div>
                              )}
                              <Autocomplete
                                // labelId="demo-simple-select-label"
                                id="demo-simple-select-city"
                                value={values.city}
                                name="city"
                                // label="City"
                                disablePortal
                                // onChange={handleChange}
                                // inputValue={values.city}
                                // onInputChange={(event, newInputValue) => {
                                //   handleChange(newInputValue);
                                // }}
                                onChange={(e, value) =>
                                  setFieldValue("city", value)
                                }
                                options={cities}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                              {/* <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select-city"
                                value={values.city}
                                name="city"
                                // label="City"
                                onChange={handleChange}
                              >
                                {cities.map((city) => (
                                  <MenuItem value={city}>{city}</MenuItem>
                                ))}
                              </Select> */}
                            </FormControl>
                            <div className="color-red">
                              {errors.city && touched.city && errors.city}
                            </div>
                          </div>
                        )}
                      </div>
                      {userTypeAndFieldsMappings[type].includes("aboutMe") && (
                        <div className="col-12 row mt-3">
                          <div className="col-4 font-weight-bold">ABOUT ME</div>
                          <div className="col-8 text-right">
                            <div className="d-inline-block mr-2">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.aboutMeShowOnProfile}
                                    value={values.aboutMeShowOnProfile}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "aboutMeShowOnProfile",
                                        value.target.checked
                                      );
                                    }}
                                    defaultChecked
                                  />
                                }
                                label="Show on profile"
                              />
                            </div>
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              >
                                {/* <Button
                                  variant="warning"
                                  className="m-btn"
                                  size="large"
                                >
                                  Edit
                                </Button> */}
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes(
                          "aboutMe"
                        ) && (
                          <div className="col-12 col-md-12 col-lg-12 mt-3 w-100">
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Tell About You
                              </FormHelperText>
                              <TextareaAutosize
                                id="outlined-adornment-address"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="aboutMe"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.aboutMe}
                                minRows={5}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.aboutMe &&
                                touched.aboutMe &&
                                errors.aboutMe}
                            </div>
                          </div>
                        )}
                      </div>
                      {userTypeAndFieldsMappings[type].includes("aboutUs") && (
                        <div className="col-12 row mt-3">
                          <div className="col-4 font-weight-bold">ABOUT US</div>
                          <div className="col-8 text-right">
                            <div className="d-inline-block mr-2">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.aboutUsShowOnProfile}
                                    value={values.aboutUsShowOnProfile}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "aboutUsShowOnProfile",
                                        value.target.checked
                                      );
                                    }}
                                    defaultChecked
                                  />
                                }
                                label="Show on profile"
                              />
                            </div>
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              >
                                {/* <Button
                                  variant="warning"
                                  className="m-btn"
                                  size="large"
                                >
                                  Edit
                                </Button> */}
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes(
                          "aboutUs"
                        ) && (
                          <div className="col-12 col-md-12 col-lg-12 mt-3 w-100">
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Tell About You
                              </FormHelperText>
                              <TextareaAutosize
                                id="outlined-adornment-address"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="aboutUs"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.aboutUs}
                                minRows={5}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.aboutUs &&
                                touched.aboutUs &&
                                errors.aboutUs}
                            </div>
                          </div>
                        )}
                      </div>
                      {userTypeAndFieldsMappings[type].includes(
                        "lifeAtInstitute"
                      ) && (
                        <div className="col-12 row mt-3">
                          <div className="col-4 font-weight-bold">
                            Life at Institute
                          </div>
                          <div className="col-8 text-right">
                            <div className="d-inline-block mr-2">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={
                                      values.lifeAtInstituteShowOnProfile
                                    }
                                    value={values.lifeAtInstituteShowOnProfile}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "lifeAtInstituteShowOnProfile",
                                        value.target.checked
                                      );
                                    }}
                                    defaultChecked
                                  />
                                }
                                label="Show on profile"
                              />
                            </div>
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              >
                                {/* <Button
                                  variant="warning"
                                  className="m-btn"
                                  size="large"
                                >
                                  Edit
                                </Button> */}
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes(
                          "lifeAtInstitute"
                        ) && (
                          <div className="col-12 col-md-12 col-lg-12 mt-3 w-100">
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="outlined"
                            >
                              {/* <FormHelperText id="outlined-weight-helper-text" className='mb-3'>Tell About You</FormHelperText> */}
                              <TextareaAutosize
                                id="outlined-adornment-address"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="lifeAtInstitute"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.lifeAtInstitute}
                                minRows={5}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.lifeAtInstitute &&
                                touched.lifeAtInstitute &&
                                errors.lifeAtInstitute}
                            </div>
                          </div>
                        )}
                      </div>
                      {userTypeAndFieldsMappings[type].includes(
                        "servicesProvided"
                      ) && (
                        <div className="col-12 row mt-3">
                          <div className="col-4 font-weight-bold">
                            Services Provided
                          </div>
                          <div className="col-8 text-right">
                            <div className="d-inline-block mr-2">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={
                                      values.servicesProvidedShowOnProfile
                                    }
                                    value={values.servicesProvidedShowOnProfile}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "servicesProvidedShowOnProfile",
                                        value.target.checked
                                      );
                                    }}
                                    defaultChecked
                                  />
                                }
                                label="Show on profile"
                              />
                            </div>
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              ></FormControl>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes(
                          "servicesProvided"
                        ) && (
                          <div className="col-12 col-md-12 col-lg-12 mt-3 w-100">
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="outlined"
                            >
                              {/* <FormHelperText id="outlined-weight-helper-text" className='mb-3'>Tell About You</FormHelperText> */}
                              <TextareaAutosize
                                id="outlined-adornment-address"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="servicesProvided"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.servicesProvided}
                                minRows={5}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.servicesProvided &&
                                touched.servicesProvided &&
                                errors.servicesProvided}
                            </div>
                          </div>
                        )}
                      </div>
                      {userTypeAndFieldsMappings[type].includes(
                        "experience"
                      ) && (
                        <div className="col-12 row mt-3">
                          <div className="col-4 font-weight-bold">
                            EXPERIENCE
                          </div>
                          <div className="col-8 text-right">
                            <div className="d-inline-block mr-2">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.experienceShowOnProfile}
                                    value={values.experienceShowOnProfile}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "experienceShowOnProfile",
                                        value.target.checked
                                      );
                                    }}
                                    defaultChecked
                                  />
                                }
                                label="Show on profile"
                              />
                            </div>
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              >
                                {/* <Button
                                  variant="warning"
                                  className="m-btn"
                                  size="large"
                                >
                                  Edit
                                </Button> */}
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes(
                          "experience"
                        ) && (
                          <div className="col-12 col-md-12 col-lg-12 mt-3 w-100">
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Tell About You
                              </FormHelperText>
                              <TextareaAutosize
                                id="outlined-adornment-experience"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="number"
                                name="experience"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.experience}
                                minRows={5}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.experience &&
                                touched.experience &&
                                errors.experience}
                            </div>
                          </div>
                        )}
                      </div>
                      {userTypeAndFieldsMappings[type].includes(
                        "education"
                      ) && (
                        <div className="col-12 row mt-3">
                          <div className="col-4 font-weight-bold">
                            EDUCATION
                          </div>
                          <div className="col-8 text-right">
                            <div className="d-inline-block mr-2">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.educationShowOnProfile}
                                    value={values.educationShowOnProfile}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "educationShowOnProfile",
                                        value.target.checked
                                      );
                                    }}
                                    defaultChecked
                                  />
                                }
                                label="Show on profile"
                              />
                            </div>
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              ></FormControl>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes(
                          "education"
                        ) && (
                          <div className="col-12 col-md-12 col-lg-12 mt-3 w-100">
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Tell About You
                              </FormHelperText>
                              <TextareaAutosize
                                id="outlined-adornment-education"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="education"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.education}
                                minRows={5}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.education &&
                                touched.education &&
                                errors.education}
                            </div>
                          </div>
                        )}
                      </div>
                      {userTypeAndFieldsMappings[type].includes("skills") && (
                        <div className="col-12 row mt-3">
                          <div className="col-4 font-weight-bold">SKILLS</div>
                          <div className="col-8 text-right">
                            <div className="d-inline-block mr-2">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.skillsShowOnProfile}
                                    value={values.skillsShowOnProfile}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "skillsShowOnProfile",
                                        value.target.checked
                                      );
                                    }}
                                    defaultChecked
                                  />
                                }
                                label="Show on profile"
                              />
                            </div>
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              >
                                {/* <Button
                                  variant="warning"
                                  className="m-btn"
                                  size="large"
                                >
                                  Edit
                                </Button> */}
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes("skills") && (
                          <div className="col-12 col-md-12 col-lg-12 mt-3 w-100">
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Tell About You
                              </FormHelperText>
                              <TextareaAutosize
                                id="outlined-adornment-skills"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="skills"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.skills}
                                minRows={5}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.skills && touched.skills && errors.skills}
                            </div>
                          </div>
                        )}
                      </div>
                      {userTypeAndFieldsMappings[type].includes(
                        "languages"
                      ) && (
                        <div className="col-12 row mt-3">
                          <div className="col-4 font-weight-bold">
                            LANGUAGES
                          </div>
                          <div className="col-8 text-right">
                            <div className="d-inline-block mr-2">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.languagesShowOnProfile}
                                    value={values.languagesShowOnProfile}
                                    onChange={(value) => {
                                      setFieldValue(
                                        "languagesShowOnProfile",
                                        value.target.checked
                                      );
                                    }}
                                    defaultChecked
                                  />
                                }
                                label="Show on profile"
                              />
                            </div>
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              >
                                {/* <Button
                                  variant="warning"
                                  className="m-btn"
                                  size="large"
                                >
                                  Edit
                                </Button> */}
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes(
                          "languages"
                        ) && (
                          <div className="col-12 col-md-12 col-lg-12 mt-3 w-100">
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Tell About You
                              </FormHelperText>
                              <TextareaAutosize
                                id="outlined-adornment-languages"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="languages"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.languages}
                                minRows={5}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.languages &&
                                touched.languages &&
                                errors.languages}
                            </div>
                          </div>
                        )}
                      </div>
                      {userTypeAndFieldsMappings[type].includes(
                        "awardsAndRecognition"
                      ) && (
                        <div className="col-12 row mt-3">
                          <div className="col-4 font-weight-bold">
                            AWARDS AND RECOGNITION
                          </div>
                          <div className="col-8 text-right">
                            <div className="d-inline-block mr-2">
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={
                                      values.awardsAndRecognitionShowOnProfile
                                    }
                                    value={
                                      values.awardsAndRecognitionShowOnProfile
                                    }
                                    onChange={(value) => {
                                      setFieldValue(
                                        "awardsAndRecognitionShowOnProfile",
                                        value.target.checked
                                      );
                                    }}
                                    defaultChecked
                                  />
                                }
                                label="Show on profile"
                              />
                            </div>
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              >
                                {/* <Button
                                  variant="warning"
                                  className="m-btn"
                                  size="large"
                                >
                                  Edit
                                </Button> */}
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 col-lg-12 row">
                        {userTypeAndFieldsMappings[type].includes(
                          "awardsAndRecognition"
                        ) && (
                          <div className="col-12 col-md-12 col-lg-12 mt-3 w-100">
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="outlined"
                            >
                              <FormHelperText
                                id="outlined-weight-helper-text"
                                className="mb-3"
                              >
                                Tell About You
                              </FormHelperText>
                              <TextareaAutosize
                                id="outlined-adornment-awardsAndRecognition"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                  "aria-label": "weight",
                                }}
                                type="text"
                                name="awardsAndRecognition"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.awardsAndRecognition}
                                minRows={5}
                              />
                            </FormControl>
                            <div className="color-red">
                              {errors.awardsAndRecognition &&
                                touched.awardsAndRecognition &&
                                errors.awardsAndRecognition}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-12 row my-3">
                        {false && (
                          <div className="col-4 font-weight-bold">
                            UPLOAD CV
                          </div>
                        )}
                        {false && (
                          <div className="col-8 text-right">
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              >
                                <Button
                                  variant="warning"
                                  className="m-btn"
                                  size="large"
                                >
                                  Save Changes
                                </Button>
                              </FormControl>
                            </div>
                          </div>
                        )}

                        <div className="col-12 row">
                          <div className="col-4 font-weight-bold"></div>
                          <div className="col-8 text-right">
                            {userTypeAndFieldsMappings[type].includes(
                              "availableForHire"
                            ) && (
                              <div className="d-inline-block mr-2">
                                <FormControl
                                  sx={{ m: 1, width: "25ch" }}
                                  variant="outlined"
                                ></FormControl>
                              </div>
                            )}
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="outlined"
                              >
                                <Button
                                  variant="warning"
                                  size="large"
                                  className="m-btn"
                                >
                                  Cancel
                                </Button>
                              </FormControl>
                            </div>
                            <div className="d-inline-block mr-2">
                              <FormControl
                                sx={{ m: 1, width: "20ch" }}
                                variant="warning"
                              >
                                <Button
                                  type="submit"
                                  variant="warning"
                                  className="m-btn"
                                  size="large"
                                >
                                  Save Changes
                                </Button>
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
      <CustomLoadingAnimation isLoading={loading} />
    </>
  );
};

export default Dashboard;
