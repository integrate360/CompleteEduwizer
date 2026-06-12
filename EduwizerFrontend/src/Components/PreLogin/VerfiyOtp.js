import { Button, FormControl } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { loginData } from "../../Redux/Actions/dataAction";
import { sendotp, verifyotp } from "../../Services/api";
import CustomLoadingAnimation from "../Common/CustomLoadingAnimation";
import CustomToast from "../Common/CustomToast";

const VerfiyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = useSelector((state) => !!state.dataReducer.loginData);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const MySwal = withReactContent(Swal);

  const showRecruiterAlert = () => {
    MySwal.fire({
      title: "Registered Successfully",
      text: "Thank you for registering. Our team will contact you",
      icon: "success",
    });
  };

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  // const callVerifyOtp = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     const userId = localStorage.getItem("userId");

  //     if (!userId) {
  //       toast(<CustomToast type="error" message="Invalid page" />);
  //       return;
  //     }

  //     // Log userId to ensure it's correct
  //     console.log("User ID:", userId);

  //     const verifyOtpResp = await verifyotp({ code: otp, userId });
  //     console.log("verifyOtpResp==", verifyOtpResp);

  //     const userType = verifyOtpResp?.data?.data?.userType;
  //     console.log("User Type:", userType);  // Log userType for debugging

  //     if (userType === "vendor") {
  //       dispatch(loginData(verifyOtpResp.data.token));
  //       navigate("/vendorpackageselection");
  //     } else if (userType === "institute") {
  //       dispatch(loginData(verifyOtpResp.data.token));
  //       navigate("/institutepackageselection");
  //     } else if (userType === "candidate") {
  //       dispatch(loginData(verifyOtpResp.data.token));
  //       navigate("/candidatepackageselection");
  //     } else if (userType === "counseller") {
  //       dispatch(loginData(verifyOtpResp.data.token));
  //       navigate("/counsellerpackageselection");
  //     } else {
  //       dispatch(loginData(verifyOtpResp.data.token));
  //       navigate("/packageselection");
  //     }
  //   } catch (error) {
  //     toast(<CustomToast type="error" message={error?.message || "An error occurred."} />);
  //     console.log("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const callVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast(<CustomToast type="error" message="Invalid page" />);
        return;
      }

      const response = await verifyotp({ code: otp, userId });

      const success = response?.data?.success;
      if (!success) {
        toast(<CustomToast type="error" message={"Invalid OTP"} />);
        return;
      }

      // ✅ OTP is valid — show success toast
      toast(
        <CustomToast type="success" message="OTP Verified Successfully!" />
      );
      dispatch(loginData(response.data.token));

      const userType = response?.data?.data?.userType;

      // ✅ Wait 1 second before navigating
      setTimeout(() => {
        if (userType === "vendor") {
          navigate("/vendorpackageselection");
        } else if (userType === "institute") {
          navigate("/institutepackageselection");
        } else if (userType === "candidate") {
          navigate("/candidatepackageselection");
        } else if (userType === "counseller") {
          navigate("/counsellerpackageselection");
        } else {
          navigate("/packageselection");
        }
      }, 1000); // 1000ms = 1 second
    } catch (error) {
      toast(
        <CustomToast
          type="error"
          message={error?.response?.data?.message || "Something went wrong!"}
        />
      );
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast(<CustomToast type="error" message="Invalid page" />);
      return;
    }

    try {
      setLoading(true);
      const response = await sendotp({ userId });

      const success = response?.data?.success;
      if (success) {
        toast(
          <CustomToast
            type="success"
            message="OTP has been resent to your email."
          />
        );
      } else {
        toast(
          <CustomToast
            type="error"
            message={response?.data?.message || "Failed to resend OTP"}
          />
        );
      }
    } catch (error) {
      toast(
        <CustomToast
          type="error"
          message={
            error?.response?.data?.message ||
            "Something went wrong while resending OTP!"
          }
        />
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row w-100 otp-with-bg" style={{ padding: "8rem 0" }}>
        <h3 className="col-12 text-center">Enter OTP sent to Email</h3>
        <form onSubmit={(e) => callVerifyOtp(e)}>
          <div className="row justify-content-center mt-3">
            <div className="col-lg-6 col-sm-6 col-12 mt-5 mb-3">
              <MuiOtpInput length={6} value={otp} onChange={handleChange} />
            </div>
          </div>
          {/* <div className="col-12 text-center mt-3 pointer">Resend OTP</div> */}
          <div
            className="col-12 text-center mt-3 pointer text-primary"
            onClick={handleResendOtp}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            Resend OTP
          </div>

          <div className="col-12 text-center mt-3">
            <FormControl
              sx={{ m: 1, width: isMobile ? "100%" : "36ch" }}
              variant="outlined"
            >
              <Button
                type="submit"
                className="m-btn"
                disabled={otp.length !== 6}
                variant="outlined"
                size="large"
              >
                Continue
              </Button>
            </FormControl>
          </div>
        </form>
      </div>
      <CustomLoadingAnimation isLoading={loading} />
    </>
  );
};

export default VerfiyOtp;
