import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { searchAPI } from "../../Services/api";
import "./index.css";
import Logo from "../../Assests/Logo/onlyImageLogo.png";
import Ads from "./Ads";

function CareerCounseling() {
  const { preference } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  // const [initialValues] = useState({
  //   educationBoard: "",
  //   location: "",
  //   expectedCtc: "",
  //   age: "",
  // });
  const [initialValues] = useState({
    city: "",
  });

  const [width, setWidth] = useState(window.innerWidth);

  const isMobile = width <= 768;
  const sideData = ["Other Events", "Sponsored Posts", "Ads"];

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

  // const callSearch = async (req, setSubmitting) => {
  //   try {
  //     const resp = await searchAPI({ ...req, userType: "vendor", preference });
  //     const temp = resp.data.data.map((ele) => ({
  //       ...ele,
  //       name: ele.firstName + ele.lastName,
  //     }));
  //     setData(temp);
  //   } catch (error) {
  //     console.log("error :>> ", error);
  //   }
  //   if (setSubmitting !== null) {
  //     setSubmitting(false);
  //   }
  // };

  const callSearch = async ({ city }, setSubmitting) => {
    try {
      const resp = await searchAPI({ userType: "vendor", preference });
      let temp = resp.data.data.map((ele) => ({
        ...ele,
        name: ele.firstName + ele.lastName,
      }));

      // filter on frontend
      if (city) {
        temp = temp.filter((ele) =>
          ele.city?.toLowerCase().includes(city.toLowerCase())
        );
      }

      setData(temp);
    } catch (error) {
      console.log("error :>> ", error);
    }

    if (setSubmitting !== null) {
      setSubmitting(false);
    }
  };

  const imageStyles = {
    width: isMobile ? "100px" : "150px",
    height: isMobile ? "100px" : "150px",
    objectFit: "cover",
  };

  const mobileButtonContainerStyles = isMobile
    ? {
        transform: "scale(0.7)",
      }
    : {};

  return (
    <Container fluid>
      <div className={isMobile ? "column" : "row"}>
        {/* Filter Section */}
        <div className={isMobile ? "" : "col-2"}>
          <div className="bg-warning d-flex flex-column justify-content-center">
            <h2 className="mx-auto my-3">Filters</h2>
            {/* <Formik initialValues={initialValues} onSubmit={() => {}}>
              {({ values, handleBlur, setFieldValue, resetForm }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [formValues, setFormValues] = useState(values);

                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                  const delayDebounce = setTimeout(() => {
                    callSearch(formValues, null);
                  }, 300); // slight debounce

                  return () => clearTimeout(delayDebounce);
                }, [formValues]);

                const handleFilterChange = (e) => {
                  const { name, value } = e.target;
                  setFieldValue(name, value);
                  setFormValues((prev) => ({ ...prev, [name]: value }));
                };

                const handleResetFilters = () => {
                  resetForm();
                  setFormValues(initialValues);
                  callSearch({}, null);
                };

                return (
                  <form>
                    <FormControl variant="outlined" sx={{ m: 1, width: "90%" }}>
                      <InputLabel>Education Board</InputLabel>
                      <Select
                        name="educationBoard"
                        label="Education Board"
                        value={values.educationBoard}
                        onChange={handleFilterChange}
                      >
                        <MenuItem value="icse">ICSE</MenuItem>
                        <MenuItem value="cbse">CBSE</MenuItem>
                        <MenuItem value="igse">IGSE</MenuItem>
                        <MenuItem value="state board">State Board</MenuItem>
                        <MenuItem value="ib">IB</MenuItem>
                        <MenuItem value="cambridge">Cambridge</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl variant="outlined" sx={{ m: 1, width: "90%" }}>
                      <InputLabel>Location</InputLabel>
                      <OutlinedInput
                        name="location"
                        onBlur={handleBlur}
                        onChange={handleFilterChange}
                        value={values.location}
                        label="Location"
                      />
                    </FormControl>

                    <FormControl variant="outlined" sx={{ m: 1, width: "90%" }}>
                      <InputLabel>Expected CTC</InputLabel>
                      <Select
                        name="expectedCtc"
                        label="Expected CTC"
                        value={values.expectedCtc}
                        onChange={handleFilterChange}
                      >
                        <MenuItem value="1to3lpa">1 to 3 LPA</MenuItem>
                        <MenuItem value="3to5lpa">3 to 5 LPA</MenuItem>
                        <MenuItem value="5to10lpa">5 - 10 LPA</MenuItem>
                        <MenuItem value="10to15pa">10 - 15 LPA</MenuItem>
                        <MenuItem value="15to25lpa">15 - 25 LPA</MenuItem>
                        <MenuItem value="25+lpa">25+ LPA</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, width: "90%" }}>
                      <Button
                        className="m-btn"
                        size="large"
                        variant="light"
                        onClick={handleResetFilters}
                      >
                        Clear all filters
                      </Button>
                    </FormControl>
                  </form>
                );
              }}
            </Formik> */}
            <Formik initialValues={initialValues} onSubmit={() => {}}>
              {({ values, setFieldValue, resetForm }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                  const delay = setTimeout(() => {
                    callSearch({ city: values.city }, null);
                  }, 300);
                  return () => clearTimeout(delay);
                }, [values.city]);

                return (
                  <form>
                    <FormControl variant="outlined" sx={{ m: 1, width: "90%" }}>
                      <InputLabel>City</InputLabel>
                      <OutlinedInput
                        name="city"
                        value={values.city}
                        onChange={(e) => setFieldValue("city", e.target.value)}
                        label="City"
                      />
                    </FormControl>

                    <FormControl sx={{ m: 1, width: "90%" }}>
                      <Button
                        className="m-btn"
                        size="large"
                        variant="light"
                        onClick={() => {
                          resetForm();
                          callSearch({ city: "" }, null); // show all again
                        }}
                      >
                        Clear all filters
                      </Button>
                    </FormControl>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>

        {/* Main Content Section */}
        <div className={isMobile ? "" : "col-7"}>
          {data && data.length > 0 ? (
            data.map((element, index) => (
              <div
                key={index}
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
                    width="70%"
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

                  <div className="d-flex">
                    {element.tags?.map((tag, tagIndex) => (
                      <div key={tagIndex} className="tag mx-2 p-2">
                        {tag}
                      </div>
                    ))}
                  </div>
                  <div className="border-bottom my-2" />
                  <div
                    className="d-flex justify-content-end p-2"
                    style={mobileButtonContainerStyles}
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
