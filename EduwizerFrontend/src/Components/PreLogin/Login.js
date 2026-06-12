import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Formik } from "formik";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { loginData } from "../../Redux/Actions/dataAction";
import { login, checkPaymentStatusAPI } from "../../Services/api";
import CustomLoadingAnimation from "../Common/CustomLoadingAnimation";
import CustomToast from "../Common/CustomToast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  const isLoggedIn = useSelector((state) => !!state.dataReducer.loginData);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const preventMouseDown = (e) => e.preventDefault();

  const handleResize = () => setIsMobile(window.innerWidth <= 768);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async (values, setSubmitting) => {
    try {
      setLoading(true);
      const { data: loginResp } = await login(values);

      if (loginResp?.success) {
        const { session, data } = loginResp;
        const { userType, _id: userId } = data;

        localStorage.setItem("userId", userId);
        dispatch(loginData(session));

        const { data: paymentStatus } = await checkPaymentStatusAPI(userId);

        const redirectMap = paymentStatus.isUnpaid
          ? {
              vendor: "/vendorpackageselection",
              institute: "/institutepackageselection",
              counsellor: "/counsellorpackageselection",
              candidate: "/candidatepackageselection",
            }
          : {
              vendor: "/",
              institute: "/",
              counsellor: "/",
              candidate: "/",
            };

        if (paymentStatus.isUnpaid) {
          let title = "Payment Pending";
          let text = "You have pending payments. Please complete your payment to proceed.";

          if (paymentStatus.unpaidReason === "expired") {
            title = "Package Expired";
            text = "Your package has expired. Please complete your payment to renew your access.";
          } else if (paymentStatus.unpaidReason === "pending_verification") {
            title = "Payment Under Verification";
            text = "Your payment is pending approval. Our team is currently verifying your screenshot.";
          } else if (paymentStatus.unpaidReason === "rejected") {
            title = "Payment Rejected";
            text = "Your previous payment was rejected. Please select a package and make a payment again.";
          }

          MySwal.fire({
            title,
            text,
            icon: "warning",
          });
        }

        navigate(redirectMap[userType] || "/");
      } else {
        toast(
          <CustomToast
            type="error"
            message={loginResp?.message || "Incorrect credentials"}
          />
        );
      }
    } catch (error) {
      toast(
        <CustomToast
          type="error"
          message={error?.message || "An error occurred."}
        />
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center login-with-bg"
      style={{ height: "80vh" }}
    >
      <div className="container-fluid row py-5">
        <div className="col-12">
          <Formik
            initialValues={{ userName: "", password: "" }}
            validate={({ userName, password }) => {
              const errors = {};
              if (!userName) errors.userName = "Required";
              else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userName)
              )
                errors.userName = "Invalid username";
              if (!password) errors.password = "Required";
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) =>
              handleLogin(values, setSubmitting)
            }
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit} autoComplete="off">
                <input
                  type="text"
                  name="fakeuser"
                  style={{ display: "none" }}
                />
                <input
                  type="password"
                  name="fakepass"
                  style={{ display: "none" }}
                />
                <div className="row">
                  <div className="col-12 text-center">
                    <FormControl
                      sx={{ m: 1, width: isMobile ? "100%" : "36ch" }}
                      variant="outlined"
                    >
                      <InputLabel>Email</InputLabel>
                      <OutlinedInput
                        id="username"
                        type="text"
                        label="Username"
                        name="userName"
                        autoComplete="off"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.userName}
                      />
                    </FormControl>
                    <div className="color-red">
                      {errors.userName && touched.userName && errors.userName}
                    </div>
                  </div>
                  <div className="col-12 text-center mt-3">
                    <FormControl
                      sx={{ m: 1, width: isMobile ? "100%" : "36ch" }}
                      variant="outlined"
                    >
                      <InputLabel>Password</InputLabel>
                      <OutlinedInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        name="password"
                        autoComplete="new-password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={togglePasswordVisibility}
                              onMouseDown={preventMouseDown}
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
                      {errors.password && touched.password && errors.password}
                    </div>
                  </div>
                  <div className="col-12 text-center mt-3">
                    <Button
                      sx={{ m: 1, width: isMobile ? "100%" : "36ch" }}
                      type="submit"
                      disabled={isSubmitting || Object.keys(errors).length > 0}
                      variant="outlined"
                      size="large"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
        <div className="col-12 text-center mt-4">
          <u className="pointer" onClick={() => navigate("/forgotPassword")}>
            Forgot Password
          </u>
        </div>
        <div className="col-12 text-center mt-4">
          Don't have an account?{" "}
          <u
            className="pointer"
            onClick={() => navigate("/register/candidate")}
          >
            Create Account
          </u>
        </div>
      </div>
      <CustomLoadingAnimation isLoading={loading} />
    </div>
  );
};

export default Login;
