import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { sendotp, signup, uploadCVAPI } from "../../Services/api";
import CustomLoadingAnimation from "../Common/CustomLoadingAnimation";
import CustomToast from "../Common/CustomToast";
import "./Auth.css";

const CSC_API_KEY = "YWdZbVBYYTRXNml4WEFuMGdvYlVZeEhmaUZoOHFWWm9oUXFiQm03Rw==";
const cscHeaders = { headers: { "X-CSCAPI-KEY": CSC_API_KEY } };

const signupTypeAndFieldsMappings = {
  candidate: ["firstName", "lastName", "userName", "password", "email", "url", "resume", "fileType", "phone", "pincode", "state", "country", "city", "preference", "age", "experience", "board"],
  student: ["firstName", "lastName", "userName", "password", "email", "url", "resume", "fileType", "phone", "pincode", "state", "country", "city", "preference", "age"],
  vendor: ["firstName", "lastName", "userName", "password", "email", "url", "resume", "fileType", "phone", "pincode", "state", "country", "city", "preference", "board"],
  counseller: ["firstName", "lastName", "userName", "password", "email", "url", "resume", "fileType", "phone", "pincode", "state", "country", "city", "preference", "age", "experience", "board"],
  institute: ["firstName", "lastName", "userName", "password", "email", "url", "resume", "fileType", "phone", "pincode", "state", "country", "city", "preference", "board"],
};

const BOARDS = [
  { value: "icse", name: "ICSE" },
  { value: "cbse", name: "CBSE" },
  { value: "igse", name: "IGSE" },
  { value: "state board", name: "State Board" },
  { value: "ib", name: "IB" },
  { value: "cambridge", name: "Cambridge" },
];

const Signup = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const { type } = useParams();

  const isLoggedIn = useSelector((state) => !!state.dataReducer.loginData);

  const [showPassword, setShowPassword] = useState(false);
  const [preferenceDropdownOptions, setPreferenceDropdownOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("In");
  const [selectedState, setSelectedState] = useState("MH");
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [resumeName, setResumeName] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!type) return;
    if (type === "vendor") {
      setPreferenceDropdownOptions([
        { name: "Financial loan services", value: "financialLoanServices" },
        { name: "Smart Technology", value: "smartTechnology" },
        { name: "Integrated Curriculum", value: "integratedCurriculum" },
        { name: "Teacher Training", value: "teacherTraining" },
        { name: "Academic Audit for Schools, Colleges, Universities, Private Institutions", value: "academicAuditForSchoolsCollegesUniversitiesPrivateInstitutions" },
        { name: "Website Development", value: "websiteDevelopment" },
        { name: "Artificial Intelligence", value: "artificialIntelligence" },
      ]);
    } else if (type === "counseller") {
      setPreferenceDropdownOptions([
        { name: "Career", value: "career" },
        { name: "Psychologist", value: "psychologist" },
        { name: "School/College Counsellors", value: "schoolOrCollegeCounsellors" },
      ]);
    } else {
      setPreferenceDropdownOptions([
        { name: "School", value: "school" },
        { name: "College", value: "college" },
        { name: "University", value: "university" },
        { name: "Private Institutions", value: "privateInstitutions" },
      ]);
    }
  }, [type]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "https://api.countrystatecity.in/v1/countries",
          cscHeaders
        );
        setCountries(response.data || []);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`,
          cscHeaders
        );
        setStates(response.data || []);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [selectedCountry]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/IN/states/${selectedState}/cities`,
          cscHeaders
        );
        setCities(response.data || []);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [selectedState]);

  const showOTPAlert = () => {
    MySwal.fire({
      title: "OTP sent",
      text: "Kindly check your mail and enter OTP",
      icon: "success",
    });
  };

  const callRegister = async (values, setSubmitting) => {
    try {
      setLoading(true);
      const signupResp = await signup(values);
      const userId = signupResp?.data?.data?._id;
      if (userId) {
        await sendotp({ userId });
        localStorage.setItem("userId", userId);
        showOTPAlert();
        navigate("/verifyotp");
      } else {
        toast(
          <CustomToast
            type="error"
            message={signupResp?.data?.message || "Error while signing up"}
          />
        );
      }
    } catch (error) {
      toast(<CustomToast type="error" message={error?.message || String(error)} />);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("admin", true);
    formData.append("file", file);
    const uploadResp = await uploadCVAPI(formData);
    return uploadResp.data.data;
  };

  const handlePhotoUpload = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 2) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "File size must not be greater than 2MB.",
      });
      return;
    }
    try {
      const url = await uploadFile(file);
      setFieldValue("url", url);
      setFieldValue("fileType", file.type);
      setPhotoName(file.name);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your profile photo has been uploaded successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong while uploading your file.",
      });
    }
  };

  const handleResumeUpload = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type) || file.size > 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Resume must be a PDF/DOC/DOCX smaller than 1MB.",
      });
      return;
    }
    try {
      const url = await uploadFile(file);
      setFieldValue("resume", url);
      setFieldValue("fileType", file.type);
      setResumeName(file.name);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your resume has been uploaded successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong while uploading your file.",
      });
    }
  };

  const validateTheForm = (values, errors) => {
    const requiredFields = {
      firstName: "First Name",
      lastName: "Last Name",
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
        if (!values.age) errors.age = "Age Required";
        if (!values.experience) errors.experience = "Experience Required";
        if (!values.board) errors.board = "Board Required";
        break;
      case "student":
        if (!values.age) errors.age = "Age Required";
        break;
      case "vendor":
      case "institute":
        if (!values.board) errors.board = "Board Required";
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
        initialValues = { ...initialValues, age: "", experience: "", board: "" };
        break;
      case "student":
        initialValues = { ...initialValues, age: "" };
        break;
      case "vendor":
      case "institute":
        initialValues = { ...initialValues, board: "" };
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
      .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
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

  if (!type || !signupTypeAndFieldsMappings[type]) return null;
  const fields = signupTypeAndFieldsMappings[type];

  const fieldError = (errors, touched, name) =>
    errors[name] && touched[name] ? (
      <span className="ew-error">{errors[name]}</span>
    ) : null;

  const preferenceLabel =
    type === "vendor"
      ? "Sector/Industry"
      : type === "counseller"
      ? "Counseller Type"
      : "Preferred Category";

  return (
    <div className="ew-auth-page">
      <div className="ew-auth-layout">
        <div className="ew-auth-card ew-auth-card--wide">
          <h1 className="ew-auth-title">Create Your Account</h1>
          <p className="ew-auth-sub">
            Fill in your details to get started — signing up as{" "}
            <b style={{ textTransform: "capitalize" }}>
              {type === "institute" ? "recruiter" : type}
            </b>
          </p>

          <Formik
            initialValues={setInitialValues()}
            validate={(values) => validateTheForm(values, {})}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              if (!agreed) {
                toast(
                  <CustomToast
                    type="error"
                    message="Please agree to the Terms & Conditions and Privacy Policy"
                  />
                );
                setSubmitting(false);
                return;
              }
              setSubmitting(true);
              values.userType = type;
              callRegister(values, setSubmitting);
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
            }) => (
              <form className="ew-auth-form" onSubmit={handleSubmit} autoComplete="off">
                <input type="text" name="fakeuser" style={{ display: "none" }} />
                <input type="password" name="fakepass" style={{ display: "none" }} />

                <div className="ew-auth-grid">
                  {fields.includes("firstName") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        First Name<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap">
                        <span className="ew-field-icon"><i className="fa fa-user-o"></i></span>
                        <input
                          className="ew-input"
                          type="text"
                          name="firstName"
                          placeholder="Enter first name"
                          autoComplete="new-firstname"
                          onChange={(e) => {
                            if (/^[A-Za-z\s]*$/.test(e.target.value)) handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.firstName}
                        />
                      </div>
                      {fieldError(errors, touched, "firstName")}
                    </div>
                  )}

                  {fields.includes("lastName") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Last Name<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap">
                        <span className="ew-field-icon"><i className="fa fa-user-o"></i></span>
                        <input
                          className="ew-input"
                          type="text"
                          name="lastName"
                          placeholder="Enter last name"
                          autoComplete="new-lastname"
                          onChange={(e) => {
                            if (/^[A-Za-z\s]*$/.test(e.target.value)) handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.lastName}
                        />
                      </div>
                      {fieldError(errors, touched, "lastName")}
                    </div>
                  )}

                  {fields.includes("userName") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Username<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap">
                        <span className="ew-field-icon"><i className="fa fa-id-badge"></i></span>
                        <input
                          className="ew-input"
                          type="text"
                          name="userName"
                          placeholder="Choose a username"
                          autoComplete="new-username"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.userName}
                        />
                      </div>
                      {fieldError(errors, touched, "userName")}
                    </div>
                  )}

                  {fields.includes("password") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Password<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap">
                        <span className="ew-field-icon"><i className="fa fa-lock"></i></span>
                        <input
                          className="ew-input"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Create a strong password"
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                        />
                        <button
                          type="button"
                          className="ew-eye"
                          aria-label="Toggle password visibility"
                          onClick={() => setShowPassword((p) => !p)}
                        >
                          <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                        </button>
                      </div>
                      {fieldError(errors, touched, "password")}
                    </div>
                  )}

                  {fields.includes("email") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Email Address<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap">
                        <span className="ew-field-icon"><i className="fa fa-envelope-o"></i></span>
                        <input
                          className="ew-input"
                          type="email"
                          name="email"
                          placeholder="Enter email address"
                          autoComplete="new-email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                        />
                      </div>
                      {fieldError(errors, touched, "email")}
                    </div>
                  )}

                  {fields.includes("phone") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Phone Number<span className="req">*</span>
                      </label>
                      <div className="ew-phone-wrap">
                        <div className="ew-input-wrap ew-cc">
                          <input className="ew-input" value="🇮🇳 +91" readOnly tabIndex={-1} />
                        </div>
                        <div className="ew-input-wrap" style={{ flex: 1 }}>
                          <input
                            className="ew-input"
                            type="text"
                            name="phone"
                            placeholder="Enter your number"
                            autoComplete="new-phone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone}
                          />
                        </div>
                      </div>
                      {fieldError(errors, touched, "phone")}
                    </div>
                  )}

                  {fields.includes("age") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Age<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap">
                        <span className="ew-field-icon"><i className="fa fa-calendar-o"></i></span>
                        <input
                          className="ew-input"
                          type="text"
                          name="age"
                          placeholder="Enter your age"
                          autoComplete="new-age"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.age}
                        />
                      </div>
                      {fieldError(errors, touched, "age")}
                    </div>
                  )}

                  {fields.includes("experience") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Experience<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap">
                        <span className="ew-field-icon"><i className="fa fa-briefcase"></i></span>
                        <input
                          className="ew-input"
                          type="text"
                          name="experience"
                          placeholder="Years of experience"
                          autoComplete="new-experience"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.experience}
                        />
                      </div>
                      {fieldError(errors, touched, "experience")}
                    </div>
                  )}

                  {fields.includes("preference") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        {preferenceLabel}
                        <span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap ew-select-wrap">
                        <span className="ew-field-icon"><i className="fa fa-star-o"></i></span>
                        <select
                          className="ew-select"
                          name="preference"
                          value={values.preference}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">Select your preference</option>
                          {preferenceDropdownOptions.map((pref) => (
                            <option key={pref.value} value={pref.value}>
                              {pref.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(errors, touched, "preference")}
                    </div>
                  )}

                  {fields.includes("board") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Board<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap ew-select-wrap">
                        <span className="ew-field-icon"><i className="fa fa-graduation-cap"></i></span>
                        <select
                          className="ew-select"
                          name="board"
                          value={values.board}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">Select board</option>
                          {BOARDS.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(errors, touched, "board")}
                    </div>
                  )}

                  {fields.includes("pincode") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Pin Code<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap">
                        <span className="ew-field-icon"><i className="fa fa-map-pin"></i></span>
                        <input
                          className="ew-input"
                          type="text"
                          name="pincode"
                          placeholder="Enter pin code"
                          autoComplete="new-pincode"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.pincode}
                        />
                      </div>
                      {fieldError(errors, touched, "pincode")}
                    </div>
                  )}
                </div>

                <div className="ew-auth-grid-3">
                  {fields.includes("country") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Country<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap ew-select-wrap">
                        <select
                          className="ew-select"
                          name="country"
                          value={values.country}
                          onChange={(e) => {
                            const country = countries.find(
                              (c) => c.name === e.target.value
                            );
                            setFieldValue("country", country?.name || "");
                            setSelectedCountry(country?.iso2 || "");
                            setFieldValue("state", "");
                            setFieldValue("city", "");
                          }}
                          onBlur={handleBlur}
                        >
                          <option value="">Select country</option>
                          {countries.map((c) => (
                            <option key={c.iso2} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(errors, touched, "country")}
                    </div>
                  )}

                  {fields.includes("state") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        State<span className="req">*</span>
                      </label>
                      <div className="ew-input-wrap ew-select-wrap">
                        <select
                          className="ew-select"
                          name="state"
                          value={values.state}
                          onChange={(e) => {
                            const st = states.find((s) => s.name === e.target.value);
                            setFieldValue("state", st?.name || "");
                            setSelectedState(st?.iso2 || "");
                            setFieldValue("city", "");
                          }}
                          onBlur={handleBlur}
                        >
                          <option value="">Select state</option>
                          {states.map((s) => (
                            <option key={s.iso2 || s.name} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(errors, touched, "state")}
                    </div>
                  )}

                  {fields.includes("city") && (
                    <div className="ew-field">
                      <label className="ew-label">City</label>
                      <div className="ew-input-wrap ew-select-wrap">
                        <select
                          className="ew-select"
                          name="city"
                          value={values.city || ""}
                          onChange={(e) => setFieldValue("city", e.target.value)}
                          onBlur={handleBlur}
                        >
                          <option value="">Select city</option>
                          {cities.map((c) => (
                            <option key={c.id || c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(errors, touched, "city")}
                    </div>
                  )}
                </div>

                <div className="ew-upload-grid">
                  {fields.includes("url") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Profile Photo<span className="req">*</span>
                      </label>
                      <div className="ew-upload-box">
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => handlePhotoUpload(e, setFieldValue)}
                        />
                        <div className="up-icon"><i className="fa fa-camera"></i></div>
                        <div className="up-title">Upload photo</div>
                        <div className="up-hint">JPG, PNG (Max. 2MB)</div>
                        {photoName && <div className="up-file">{photoName}</div>}
                      </div>
                      {fieldError(errors, touched, "url")}
                    </div>
                  )}

                  {fields.includes("resume") && (
                    <div className="ew-field">
                      <label className="ew-label">
                        Upload Resume<span className="req">*</span>
                      </label>
                      <div className="ew-upload-box">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => handleResumeUpload(e, setFieldValue)}
                        />
                        <div className="up-icon"><i className="fa fa-file-text-o"></i></div>
                        <div className="up-title">
                          Drag &amp; drop your resume or <span className="browse">Browse file</span>
                        </div>
                        <div className="up-hint">PDF, DOC, DOCX (Max. 1MB)</div>
                        {resumeName && <div className="up-file">{resumeName}</div>}
                      </div>
                      {fieldError(errors, touched, "resume")}
                    </div>
                  )}
                </div>

                <label className="ew-agree">
                  <input
                    type="checkbox"
                    className="ew-checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span>
                    I agree to the{" "}
                    <Link to="/terms-conditions" className="ew-link">
                      Terms &amp; Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/terms-conditions" className="ew-link">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <button
                  className="ew-btn ew-btn--navy ew-btn--block"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Create My Account&nbsp;&nbsp;→
                </button>
              </form>
            )}
          </Formik>

          <div className="ew-auth-foot">
            Already have an account?{" "}
            <span className="ew-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </div>
        </div>

        <div className="ew-auth-art">
          <img alt="" src="/assets/images/figma/signup-boy.png" />
        </div>
      </div>
      <CustomLoadingAnimation isLoading={loading} />
    </div>
  );
};

export default Signup;
