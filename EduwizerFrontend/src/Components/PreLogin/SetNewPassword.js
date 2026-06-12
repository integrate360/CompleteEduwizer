import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setNewPassword } from "../../Services/api";
import CustomToast from "../Common/CustomToast";

const SetNewPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  console.log(token, "token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await setNewPassword({ token, newPassword });
      setSuccessMessage(
        "Password reset successfully. You can now log in with your new password."
      );
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Failed to set a new password. Please try again.");
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
              <h2 className="text-center mb-4">Set New Password</h2>
              <form onSubmit={handleSetNewPassword}>
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label visually-hidden"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    Set New Password
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

export default SetNewPassword;
