import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as Yup from "yup";
import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendotp, signup } from "../../Services/api";
import {
  getAllCitiesOfACountry,
  getCountries,
  getStates,
} from "../../Utils/countriesAndStates";
import CustomLoadingAnimation from "../Common/CustomLoadingAnimation";
import CustomToast from "../Common/CustomToast";
import UploadFile from "./UploadFile";
import { Label } from "reactstrap";
import axios from "axios";

const Signup = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => !!state.dataReducer.loginData);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const showOTPAlert = () => {
    MySwal.fire({
      title: "OTP sent",
      text: "Kindly check your mail and enter OTP",
      icon: "success",
      // confirmButtonText: 'OK'
    });
  };
  const { type } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [preferenceDropdownOptions, setPreferenceDropdownOptions] = useState(
    []
  );

  const [selectedCountry, setSelectedCountry] = useState("In");
  const [selectedState, setSelectedState] = useState("MH");
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    const setPreferenceOptions = () => {
      if (type === "vendor") {
        setPreferenceDropdownOptions([
          { name: "Financial loan services", value: "financialLoanServices" },
          { name: "Smart Technology", value: "smartTechnology" },
          { name: "Integrated Curriculum", value: "integratedCurriculum" },
          { name: "Teacher Training", value: "teacherTraining" },
          {
            name: "Academic Audit for Schools, Colleges, Universities, Private Institutions",
            value:
              "academicAuditForSchoolsCollegesUniversitiesPrivateInstitutions",
          },
          { name: "Website Development", value: "websiteDevelopment" },
          { name: "Artificial Intelligence", value: "artificialIntelligence" },
        ]);
      } else if (type === "counseller") {
        setPreferenceDropdownOptions([
          { name: "Career", value: "career" },
          { name: "Psychologist", value: "psychologist" },
          {
            name: "School/College Counsellors",
            value: "schoolOrCollegeCounsellors",
          },
        ]);
      } else {
        setPreferenceDropdownOptions([
          { name: "School", value: "school" },
          { name: "College", value: "college" },
          { name: "University", value: "university" },
          { name: "Private Institutions", value: "privateInstitutions" },
        ]);
      }
    };

    if (type) {
      setInitialValues(); // Assuming this is defined elsewhere
      setPreferenceOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.countrystatecity.in/v1/countries`,
        {
          headers: {
            "X-CSCAPI-KEY":
              "YWdZbVBYYTRXNml4WEFuMGdvYlVZeEhmaUZoOHFWWm9oUXFiQm03Rw==",
          },
        }
      );

      if (response.data) {
        const coun = response.data;
        setCountries(coun);
      } else {
        console.log("Response data is null or undefined.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchState = async () => {
    console.log(selectedCountry);
    try {
      const response = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`,
        {
          headers: {
            "X-CSCAPI-KEY":
              "YWdZbVBYYTRXNml4WEFuMGdvYlVZeEhmaUZoOHFWWm9oUXFiQm03Rw==",
          },
        }
      );

      setStates(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCity = async () => {
    try {
      const response = await axios.get(
        `https://api.countrystatecity.in/v1/countries/IN/states/${selectedState}/cities`,
        {
          headers: {
            "X-CSCAPI-KEY":
              "YWdZbVBYYTRXNml4WEFuMGdvYlVZeEhmaUZoOHFWWm9oUXFiQm03Rw==",
          },
        }
      );
      setCities(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //fetech countries on the first load
  useEffect(() => {
    fetchData();
  }, []);

  //fetech state when the country change
  useEffect(() => {
    fetchState();
  }, [selectedCountry]);

  //fetech cites when the state change
  useEffect(() => {
    fetchCity();
  }, [selectedState]);

  const signupTypeAndFieldsMappings = {
    candidate: [
      "firstName",
      "lastName",
      "userName",
      "password",
      "email",
      "url",
      "resume",
      "fileType",
      "phone",
      "pincode",
      "state",
      "country",
      "city",
      "preference",
      "age",
      "experience",
      "board",
    ],
    student: [
      "firstName",
      "lastName",
      "userName",
      "password",
      "email",
      "url",
      "resume",
      "fileType",
      "phone",
      "pincode",
      "state",
      "country",
      "city",
      "preference",
      "age",
    ],
    vendor: [
      "firstName",
      "lastName",
      "userName",
      "password",
      "email",
      "url",
      "resume",
      "fileType",
      "phone",
      "pincode",
      "state",
      "country",
      "city",
      "preference",
      "board",
    ],
    counseller: [
      "firstName",
      "lastName",
      "userName",
      "password",
      "email",
      "url",
      "resume",
      "fileType",
      "phone",
      "pincode",
      "state",
      "country",
      "city",
      "preference",
      "age",
      "experience",
      "board",
    ],
    institute: [
      "firstName",
      "lastName",
      "userName",
      "password",
      "email",
      "url",
      "resume",
      "fileType",
      "phone",
      "pincode",
      "state",
      "country",
      "city",
      "preference",
      "board",
    ],
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const callRegister = async (values, setSubmitting) => {
    try {
      setLoading(true);
      const signupResp = await signup(values);
      const userId = signupResp?.data?.data?._id;
      console.log("signupResp :>> ", signupResp, userId);
      if (userId) {
        const sendOtpResp = await sendotp({ userId });
        localStorage.setItem("userId", userId);
        showOTPAlert();
        navigate("/verifyotp");
        console.log("sendOtpResp :>> ", sendOtpResp);
      } else {
        // showAlert()
        toast(
          <CustomToast
            type="error"
            message={signupResp?.data?.message || "Error while signing up"}
          />
        );
      }
    } catch (error) {
      toast(<CustomToast type="error" message={error || error.message} />);
      console.log("error :>> ", error);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const validateTheForm = (values, errors) => {
    const requiredFields = {
      firstName: "FirstName",
      lastName: "LastName",
      userName: "Username",
      password: "Password",
      email: "Email",
      phone: "Phone",
      pincode: "Pincode",
      country: "Country",
      state: "State",
      url: "Profile Image",
      resume: "Resume",
      preference: "Preference",
    };

    for (const field in requiredFields) {
      if (!values[field]) {
        errors[field] = `${requiredFields[field]} Required`;
      }
    }

    switch (type) {
      case "candidate":
      case "counseller":
        if (!values.age) {
          errors.age = "Age Required";
        }
        if (!values.experience) {
          errors.experience = "Experience Required";
        }
        if (!values.board) {
          errors.board = "Board Required";
        }
        break;
      case "student":
        if (!values.age) {
          errors.age = "Age Required";
        }
        break;
      case "vendor":
      case "institute":
        if (!values.board) {
          errors.board = "Board Required";
        }
        break;
      default:
        break;
    }

    return errors;
  };

  const setInitialValues = () => {
    let initialValues = {
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      email: "",
      url: "",
      resume: "",
      fileType: "",
      phone: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
      preference: "",
    };
    switch (type) {
      case "candidate":
      case "counseller":
        initialValues = {
          ...initialValues,
          age: "",
          experience: "",
          board: "",
        };
        break;
      case "student":
        initialValues = {
          ...initialValues,
          age: "",
        };
        break;
      case "vendor":
      case "institute":
        initialValues = {
          ...initialValues,
          board: "",
        };
        break;
      default:
        break;
    }
    return initialValues;
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[A-Za-z\s]+$/, "First name must contain only letters")
      .min(2, "First name must be at least 2 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(/^[A-Za-z\s]+$/, "Last name must contain only letters")
      .min(2, "Last name must be at least 2 characters"),
    userName: Yup.string()
      .required("Username is required")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .min(3, "Username must be at least 3 characters"),

    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    age: ["candidate", "student", "counseller"].includes(type)
      ? Yup.number()
          .typeError("Age must be a number")
          .required("Age is required")
          .min(18, "Minimum age is 18")
          .max(120, "Maximum age is 120")
      : Yup.mixed().notRequired(),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required"),
  });
  return (
    <>
      <div className="row col-12 py-5 signup-with-bg">
        <h3 className="col-12 text-center text-capitalize">
          Sign up as {type === "institute" ? "recruiter" : type}
        </h3>
        <div className="col-12">
          <input type="text" name="fakeuser" style={{ display: "none" }} />
          <input type="password" name="fakepass" style={{ display: "none" }} />
          <Formik
            initialValues={setInitialValues()}
            validate={(values) => {
              const errors = {};
              return validateTheForm(values, errors);
            }}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              values.userType = type;
              callRegister(values, setSubmitting);
              // setSubmitting(false)
            }}
            validationSchema={validationSchema}
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
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="row">
                  <div className="col-md-none col-lg-3" />
                  <div className="col-md-12 col-lg-6 row">
                    {/* {signupTypeAndFieldsMappings[type].includes(
                      "firstName"
                    ) && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel>First Name*</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-firstName"
                            type="text"
                            label="First Name"
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
                    )} */}
                    {signupTypeAndFieldsMappings[type].includes(
                      "firstName"
                    ) && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel htmlFor="outlined-adornment-firstName">
                            First Name*
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-firstName"
                            type="text"
                            label="First Name"
                            autoComplete="new-firstname"
                            name="firstName"
                            onChange={(e) => {
                              // Prevent numbers from being typed
                              const value = e.target.value;
                              if (/^[A-Za-z\s]*$/.test(value)) {
                                handleChange(e);
                              }
                            }}
                            onBlur={handleBlur}
                            value={values.firstName}
                            error={
                              touched.firstName && Boolean(errors.firstName)
                            }
                          />
                        </FormControl>
                        {touched.firstName && errors.firstName && (
                          <div style={{ color: "red", fontSize: "12px" }}>
                            {errors.firstName}
                          </div>
                        )}
                      </div>
                    )}

                    {signupTypeAndFieldsMappings[type].includes("lastName") && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel htmlFor="outlined-adornment-lastName">
                            Last Name*
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-lastName"
                            type="text"
                            label="Last Name"
                            name="lastName"
                            autoComplete="new-lastname"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[A-Za-z\s]*$/.test(value)) {
                                handleChange(e);
                              }
                            }}
                            onBlur={handleBlur}
                            value={values.lastName}
                            error={touched.lastName && Boolean(errors.lastName)}
                          />
                        </FormControl>
                        {touched.lastName && errors.lastName && (
                          <div style={{ color: "red", fontSize: "12px" }}>
                            {errors.lastName}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="signup-files-div">
                      {signupTypeAndFieldsMappings[type].includes("url") && (
                        <div className="text-center align-items-center mt-4 signup-files-div-element">
                          <Label style={{ color: "grey" }}>
                            {"Profile Image*"}
                          </Label>

                          <UploadFile
                            accept=".png,.jpg,.jpeg"
                            editData={{
                              url: values.url,
                              fileType: values.fileType,
                            }}
                            uploadFileProp={async (file, url, fileType) => {
                              // Validate file size (check if file size is greater than 2MB)
                              if (file.size > 1024 * 1024 * 2) {
                                // 2MB limit
                                Swal.fire({
                                  icon: "error",
                                  title: "Error",
                                  text: "File size must not be greater than 2MB.",
                                });
                                return; // Stop the upload process if file size exceeds limit
                              }

                              // If the file is valid, set the form values without blocking UI
                              setFieldValue("url", url);
                              setFieldValue("fileType", fileType);

                              try {
                                // Simulate the upload process (e.g., uploading the file to server)
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 500)
                                ); // Simulate upload delay (500ms)

                                // Show success message after the upload finishes
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Your profile photo has been uploaded successfully!",
                                });
                              } catch (error) {
                                // Handle any upload failure here
                                Swal.fire({
                                  icon: "error",
                                  title: "Upload Failed",
                                  text: "Something went wrong while uploading your file.",
                                });
                              }
                            }}
                          />

                          <div className="color-red">
                            {errors.url && touched.url && errors.url}
                          </div>
                          {values.url && values.url.size < 1024 * 1024 && (
                            <label className="color-red">
                              Upload an image smaller than 1 MB | Image format
                              should be [.png, .jpg, or .jpeg]
                            </label>
                          )}
                        </div>
                      )}

                      {signupTypeAndFieldsMappings[type].includes("resume") && (
                        <div
                          className="text-center d-grid align-items-center mt-4 signup-files-div-element"
                          // style={{
                          //   display: "grid",
                          //   justifyContent: "center",
                          //   width: "100%",
                          // }}
                        >
                          <Label style={{ color: "gray" }}>
                            Upload Resume*
                          </Label>

                          <UploadFile
                            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            editData={{
                              resume: values.resume,
                              fileType: values.fileType,
                            }}
                            uploadFileProp={(file, resume, fileType) => {
                              const allowedTypes = [
                                "application/pdf",
                                "application/msword",
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                              ];
                              if (
                                allowedTypes.includes(file.type) &&
                                file.size < 1024 * 1024
                              ) {
                                setFieldValue("resume", resume);
                                setFieldValue("fileType", fileType);
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Your resume has been uploaded successfully!",
                                });
                              }
                            }}
                          />
                          <div className="color-red">
                            {errors.resume && touched.resume && errors.resume}
                          </div>
                          {values.resume &&
                            values.resume.size < 1024 * 1024 && (
                              <label className="color-red">
                                Upload a file smaller than 1 MB | File format
                                should be [.pdf, .doc, or .docx]
                              </label>
                            )}
                        </div>
                      )}
                    </div>

                    {signupTypeAndFieldsMappings[type].includes("userName") && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel>Username*</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-username"
                            type="text"
                            label="Username"
                            name="userName"
                            autoComplete="new-username" // 👈 This disables autofill
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

{signupTypeAndFieldsMappings[type].includes("password") && (
  <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
    {/* 🧠 Add dummy fields to break autofill */}
    <input
      type="text"
      name="fake-username-field"
      autoComplete="off"
      style={{ display: "none" }}
    />
    <input
      type="password"
      name="fake-password-field"
      autoComplete="new-password"
      style={{ display: "none" }}
    />

    <FormControl
      sx={{ m: 1, width: "30ch" }}
      variant="outlined"
    >
      <InputLabel>Password*</InputLabel>
      <OutlinedInput
  id="user-pass-custom-field"
  type={showPassword ? "text" : "password"}
  name="password" // ✅ must match values key
  autoComplete="off"
  value={values.password}
  onChange={handleChange}
  onBlur={handleBlur}
  endAdornment={
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        edge="end"
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  }
  label="Password"
/>


    </FormControl>
    <div className="color-red">
      {errors.password && touched.password && errors.password}
    </div>
  </div>
)}




                    {signupTypeAndFieldsMappings[type].includes("email") && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel>Email*</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-Email"
                            type="email"
                            label="Email"
                            autoComplete="new-email"
                            name="email"
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
                    {signupTypeAndFieldsMappings[type].includes("phone") && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel htmlFor="outlined-adornment-phone">
                            Phone Number*
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-phone"
                            type="text"
                            label="Phone Number"
                            name="phone"
                            autoComplete="new-phone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone}
                            error={touched.phone && Boolean(errors.phone)}
                          />
                        </FormControl>

                        {touched.phone && errors.phone && (
                          <div style={{ color: "red", fontSize: "12px" }}>
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    )}

                    {signupTypeAndFieldsMappings[type].includes("age") && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel>Age*</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-age"
                            type="text"
                            label="Age"
                            name="age"
                            autoComplete="new-age"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.age}
                          />
                        </FormControl>
                        <div className="color-red">
                          {errors.age && touched.age && errors.age}
                        </div>
                      </div>
                    )}
                    {signupTypeAndFieldsMappings[type].includes(
                      "experience"
                    ) && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel>Experience*</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-experience"
                            type="text"
                            label="Experience"
                            name="experience"
                            autoComplete="new-experience"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.experience}
                          />
                        </FormControl>
                        <div className="color-red">
                          {errors.experience &&
                            touched.experience &&
                            errors.experience}
                        </div>
                      </div>
                    )}
                    {signupTypeAndFieldsMappings[type].includes("pincode") && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel>Pin code *</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-pincode"
                            type="text"
                            label="Pin code"
                            name="pincode"
                            autoComplete="new-pincode"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.pincode}
                          />
                        </FormControl>
                        <div className="color-red">
                          {errors.pincode && touched.pincode && errors.pincode}
                        </div>
                      </div>
                    )}
                    
                    {signupTypeAndFieldsMappings[type].includes("country") && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <Autocomplete
  id="demo-simple-select-country"
  value={values.name}
  name="country"
  disablePortal
  onChange={(e, value) => {
    setFieldValue("country", value?.name || "");
    setSelectedCountry(value?.iso2 || "");
    setFieldValue("city", null);
    setFieldValue("state", null);
    console.log(value?.name);
  }}
  options={countries}
  getOptionLabel={(option) => option.name}
  isOptionEqualToValue={(option, value) => option._id === value?._id}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Country*"
      name="country"
      inputProps={{
        ...params.inputProps,
        autoComplete: 'new-country', // effectively disables browser autocomplete
      }}
    />
  )}
/>
                        </FormControl>
                        <div className="color-red">
                          {errors.country && touched.country && errors.country}
                        </div>
                      </div>
                    )}

                    {signupTypeAndFieldsMappings[type].includes("state") && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          {signupTypeAndFieldsMappings[type].includes("state") && (
  <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
    <FormControl
      sx={{ m: 1, width: "30ch" }}
      variant="outlined"
    >
      <Autocomplete
        id="demo-simple-select-state"
        value={values.name}
        name="state"
        disablePortal
        onChange={(e, value) => {
          setFieldValue("state", value?.name || "");
          setSelectedState(value?.iso2 || "");
          setFieldValue("city", null);
        }}
        options={states}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option._id === value?._id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="State *"
            name="state"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-state', // Prevents browser autofill
            }}
          />
        )}
      />
    </FormControl>
    <div className="color-red">
      {errors.state && touched.state && errors.state}
    </div>
  </div>
)}
                        </FormControl>
                        <div className="color-red">
                          {errors.state && touched.state && errors.state}
                        </div>
                      </div>
                    )}


                    {signupTypeAndFieldsMappings[type].includes("city") && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          {signupTypeAndFieldsMappings[type].includes("city") && (
  <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
    <FormControl
      sx={{ m: 1, width: "30ch" }}
      variant="outlined"
    >
      <Autocomplete
        id="demo-simple-select-city"
        value={values.name}
        name="city"
        disablePortal
        onChange={(e, value) =>
          setFieldValue("city", value?.name || "")
        }
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option._id === value?._id}
        options={cities}
        renderInput={(params) => (
          <TextField
            {...params}
            label="City"
            name="city"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-city', // Disable browser autofill
            }}
          />
        )}
      />
    </FormControl>
    <div className="color-red">
      {errors.city && touched.city && errors.city}
    </div>
  </div>
)}
                        </FormControl>
                        <div className="color-red">
                          {errors.city && touched.city && errors.city}
                        </div>
                      </div>
                    )}
                    {signupTypeAndFieldsMappings[type].includes("board") && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel id="demo-simple-select-label">
                            Board*
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select-board"
                            value={values.board}
                            name="board"
                            label="Board"
                            onChange={handleChange}
                          >
                            <MenuItem value="icse">ICSE</MenuItem>
                            <MenuItem value="cbse">CBSE</MenuItem>
                            <MenuItem value="igse">IGSE</MenuItem>
                            <MenuItem value="state board">State Board</MenuItem>
                            <MenuItem value="ib">IB</MenuItem>
                            <MenuItem value="cambridge">Cambridge</MenuItem>
                            {/* <MenuItem value="Mumbai Board">
                              Mumbai Board
                            </MenuItem>
                            <MenuItem value="Gujarat Board">
                              Gujarat Board
                            </MenuItem> */}
                          </Select>
                        </FormControl>
                        <div className="color-red">
                          {errors.board && touched.board && errors.board}
                        </div>
                      </div>
                    )}
                    {signupTypeAndFieldsMappings[type].includes(
                      "preference"
                    ) && (
                      <div className="col-12 col-md-12 col-lg-6 text-center mt-3">
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel id="demo-simple-select-label">
                            {type === "vendor"
                              ? "Sector/Industry"
                              : type === "counseller"
                              ? "Counseller Type"
                              : "Preference*"}
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select-preference"
                            value={values.preference}
                            name="preference"
                            label={
                              type === "vendor"
                                ? "Sector/Industry"
                                : type === "counseller"
                                ? "Counseller Type"
                                : "Preference*"
                            }
                            onChange={handleChange}
                          >
                            {preferenceDropdownOptions.map((pref) => (
                              <MenuItem value={pref.value}>
                                {pref.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <div className="color-red">
                          {errors.preference &&
                            touched.preference &&
                            errors.preference}
                        </div>
                      </div>
                    )}
                    <div className="col-12 text-center mt-3">
                      <FormControl
                        sx={{ m: 1, width: "30ch" }}
                        variant="outlined"
                      >
                        <Button
                          type="submit"
                          // disabled={
                          //   isSubmitting || !!Object.keys(errors).length
                          // }
                          variant="outlined"
                          size="large"
                        >
                          Continue
                        </Button>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-none col-lg-3" />
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <CustomLoadingAnimation isLoading={loading} />
    </>
  );
};

export default Signup;
