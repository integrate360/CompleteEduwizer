import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Formik } from "formik";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { searchAPI } from "../../Services/api";
import Logo from "../../Assests/Logo/onlyImageLogo.png";
import "./index.css";
import Ads from "./Ads";

function CareerCounseling() {
  const { preference } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    educationBoard: "",
    location: "",
    expectedCtc: "",
    age: "",
  });
  const [width, setWidth] = useState(window.innerWidth);

  const isMobile = width <= 768;

  useEffect(() => {
    function handleWindowSizeChange() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    callSearch({}, null);
  }, [preference]);

  const ctcMapping = {
    "1to3lpa": "1 - 3 LPA",
    "3to5lpa": "3 - 5 LPA",
    "5to10lpa": "5 - 10 LPA",
    "10to15pa": "10 - 15 LPA",
    "15to25lpa": "15 - 25 LPA",
    "25+lpa": "25+ LPA",
  };

  const sideData = ["Other Events", "Sponsored Posts", "Ads"];

  const callSearch = async (req, setSubmitting) => {
    try {
      const resp = await searchAPI({
        ...req,
        userType: "counseller",
        preference,
      });
      const temp = resp.data.data.map((ele) => ({
        ...ele,
        name: ele.firstName + ele.lastName,
      }));
      setData(temp);
    } catch (error) {
      console.log("error :>> ", error);
    }
    if (setSubmitting !== null) {
      setSubmitting(false);
    }
  };

  const buttonStyles = isMobile
    ? {
        transform: "scale(0.7)",
      }
    : {};

  const imageStyles = {
    width: isMobile ? "100px" : "150px",
    height: isMobile ? "100px" : "150px",
    objectFit: "cover",
  };

  return (
    <Container fluid>
      <div className={isMobile ? "column" : "row"}>
        {/* Filter Section */}
        <div className={!isMobile ? "col-2" : undefined}>
          <div className="bg-warning d-flex flex-column justify-content-center">
            <h2 className="mx-auto my-3">Filters</h2>
            <Formik
              initialValues={initialValues}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                callSearch(values, setSubmitting);
              }}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                resetForm,
              }) => (
                <form onSubmit={handleSubmit}>
                  <FormControl
                    variant="outlined"
                    sx={{
                      m: 1,
                      width: "90%",
                    }}
                  >
                    <InputLabel>Education Board</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select-educationBoard"
                      value={values.educationBoard}
                      name="educationBoard"
                      onChange={handleChange}
                      label="Education Board"
                    >
                      <MenuItem value="icse">ICSE</MenuItem>
                      <MenuItem value="cbse">CBSE</MenuItem>
                      <MenuItem value="igse">IGSE</MenuItem>
                      <MenuItem value="state board">State Board</MenuItem>
                      <MenuItem value="ib">IB</MenuItem>
                      <MenuItem value="cambridge">Cambridge</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Location Input */}
                  <FormControl
                    variant="outlined"
                    sx={{
                      m: 1,
                      width: "90%",
                    }}
                  >
                    <InputLabel>Location</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-location"
                      name="location"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.location}
                      label="Location"
                    />
                  </FormControl>

                  {/* Expected CTC Select */}
                  <FormControl
                    variant="outlined"
                    sx={{
                      m: 1,
                      width: "90%",
                    }}
                  >
                    <InputLabel>Expected CTC</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select-expectedCtc"
                      value={values.expectedCtc}
                      name="expectedCtc"
                      onChange={handleChange}
                      label="Expected CTC"
                    >
                      {Object.entries(ctcMapping).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Buttons */}
                  <FormControl
                    sx={{
                      m: 1,
                      width: "90%",
                    }}
                  >
                    <Button
                      className="m-btn"
                      type="submit"
                      disabled={isSubmitting}
                      size="large"
                      variant="light"
                    >
                      Search
                    </Button>
                  </FormControl>
                  <FormControl
                    sx={{
                      m: 1,
                      width: "90%",
                    }}
                  >
                    <Button
                      className="m-btn"
                      size="large"
                      variant="light"
                      onClick={resetForm}
                    >
                      Clear all filters
                    </Button>
                  </FormControl>
                </form>
              )}
            </Formik>
          </div>
        </div>

        {/* Main Content Section */}
        <div className={!isMobile ? "col-7" : undefined}>
          {data && data.length > 0 ? (
            data.map((element) => (
              <div
                key={element.id}
                className="row m-2"
                style={{
                  border: "3px solid #000000",
                  borderRadius: "15px",
                  height: "fit-content",
                }}
              >
                <div className="col-3">
                  <img
                    src={element.url || Logo}
                    alt={element.url ? "profile" : "default"}
                    className="img-fluid m-2 rounded-circle"
                    style={imageStyles}
                  />
                </div>
                <div className="col-9 pt-2">
                  <div className="d-flex justify-content-between">
                    <div className="title">{element.name}</div>
                    {element.sponsored && (
                      <div className="sponsored p-2">Sponsored Post</div>
                    )}
                  </div>
                  <div className="desc">{element.description}</div>
                  <div className="d-flex justify-content-between">
                    <div className="desc">Location: {element.city}</div>
                    <div className="desc">
                      Preferences: {element.preference}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="desc">
                      Expected CTC: {ctcMapping[element.expectedCtc]}
                    </div>
                    <div className="desc">
                      Previous CTC: {ctcMapping[element.ctc]}
                    </div>
                  </div>
                  <div className="d-flex">
                    {element.tags?.map((tag, index) => (
                      <div key={index} className="tag mx-2 p-2">
                        {tag}
                      </div>
                    ))}
                  </div>
                  <div className="border-bottom my-2" />
                  <div
                    className="d-flex justify-content-end p-2"
                    style={buttonStyles}
                  >
                    <Button
                      variant="warning"
                      className="text-nowrap shadow-lg ms-2 m-btn"
                    >
                      <Link to="/contact-us">Contact Now</Link>
                    </Button>
                    <Button
                      variant="warning"
                      className="text-nowrap shadow-lg ms-2 m-btn"
                    >
                      <a href="mailto:ngeduwizer@gmail.com?subject='Need Help'&body='Just popped in to say hello'">
                        Email Us
                      </a>
                    </Button>
                    <Button
                      variant="warning"
                      className="text-nowrap shadow-lg ms-2 m-btn"
                    >
                      <a href="tel:+919167780061">Call Us</a>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <h5 className="mt-2">For enquiries/ services connect with us</h5>
              <div>
                <Button
                  onClick={() => navigate("/contact-us")}
                  className="w-50 mt-2"
                  variant="warning"
                >
                  Get In Touch
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Side Content Section */}
        <Ads isMobile={isMobile} />
      </div>
    </Container>
  );
}

export default CareerCounseling;
