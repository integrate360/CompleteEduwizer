import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Formik } from "formik";
import { loginData } from "../../Redux/Actions/dataAction";
import { login, checkPaymentStatusAPI } from "../../Services/api";
import CustomLoadingAnimation from "../Common/CustomLoadingAnimation";
import CustomToast from "../Common/CustomToast";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  const isLoggedIn = useSelector((state) => !!state.dataReducer.loginData);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

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
          let text =
            "You have pending payments. Please complete your payment to proceed.";

          if (paymentStatus.unpaidReason === "expired") {
            title = "Package Expired";
            text =
              "Your package has expired. Please complete your payment to renew your access.";
          } else if (paymentStatus.unpaidReason === "pending_verification") {
            title = "Payment Under Verification";
            text =
              "Your payment is pending approval. Our team is currently verifying your screenshot.";
          } else if (paymentStatus.unpaidReason === "rejected") {
            title = "Payment Rejected";
            text =
              "Your previous payment was rejected. Please select a package and make a payment again.";
          }

          MySwal.fire({ title, text, icon: "warning" });
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
    <div className="ew-auth-page">
      <div className="ew-auth-layout">
        <div className="ew-auth-card">
          <div className="ew-auth-icon">
            <i className="fa fa-lock"></i>
          </div>
          <h1 className="ew-auth-title">Welcome Back!</h1>
          <p className="ew-auth-sub">
            Login to your account and continue your journey with us
          </p>

          <Formik
            initialValues={{ userName: "", password: "" }}
            validate={({ userName, password }) => {
              const errors = {};
              if (!userName) errors.userName = "Required";
              else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userName)
              )
                errors.userName = "Invalid email address";
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
              <form
                className="ew-auth-form"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <input type="text" name="fakeuser" style={{ display: "none" }} />
                <input
                  type="password"
                  name="fakepass"
                  style={{ display: "none" }}
                />

                <div className="ew-field">
                  <label className="ew-label" htmlFor="username">
                    Email Address
                  </label>
                  <div className="ew-input-wrap">
                    <span className="ew-field-icon">
                      <i className="fa fa-envelope-o"></i>
                    </span>
                    <input
                      id="username"
                      className="ew-input"
                      type="text"
                      name="userName"
                      placeholder="Enter your email address"
                      autoComplete="off"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.userName}
                    />
                  </div>
                  {errors.userName && touched.userName && (
                    <span className="ew-error">{errors.userName}</span>
                  )}
                </div>

                <div className="ew-field">
                  <label className="ew-label" htmlFor="password">
                    Password
                  </label>
                  <div className="ew-input-wrap">
                    <span className="ew-field-icon">
                      <i className="fa fa-lock"></i>
                    </span>
                    <input
                      id="password"
                      className="ew-input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      autoComplete="new-password"
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
                      <i
                        className={
                          showPassword ? "fa fa-eye-slash" : "fa fa-eye"
                        }
                      ></i>
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <span className="ew-error">{errors.password}</span>
                  )}
                </div>

                <div className="ew-auth-row">
                  <label className="ew-remember">
                    <input
                      type="checkbox"
                      className="ew-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <span
                    className="ew-link"
                    onClick={() => navigate("/forgotPassword")}
                  >
                    Forgot Password?
                  </span>
                </div>

                <button
                  className="ew-btn ew-btn--navy ew-btn--block"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Login&nbsp;&nbsp;→
                </button>
              </form>
            )}
          </Formik>

          <div className="ew-auth-foot">
            Don&apos;t have an account?{" "}
            <span
              className="ew-link"
              onClick={() => navigate("/register/candidate")}
            >
              Create Account
            </span>
          </div>
        </div>

        <div className="ew-auth-art">
          <img alt="" src="/assets/images/figma/login-student.png" />
        </div>
      </div>
      <CustomLoadingAnimation isLoading={loading} />
    </div>
  );
};

export default Login;
