import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../Services/api";
import CustomToast from "../Common/CustomToast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword({ email });
      setSuccessMessage(
        "Password reset link sent to your email. Please check your inbox."
      );
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Failed to send password reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="text-center mb-4">Forgot Password</h2>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label visually-hidden">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    Reset Password
                  </button>
                </div>
              </form>
              {successMessage && (
                <div className="mt-3">
                  <CustomToast type="success" message={successMessage} />
                </div>
              )}
              {errorMessage && (
                <div className="mt-3">
                  <CustomToast type="error" message={errorMessage} />
                </div>
              )}
              <div className="text-center mt-3">
                <span className="pointer" onClick={() => navigate("/login")}>
                  Back to Login
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
