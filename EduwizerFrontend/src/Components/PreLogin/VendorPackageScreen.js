import { Button, FormControl, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPackageByVendor, postcreatePayment, checkPaymentStatusAPI } from "../../Services/api";
import QRCodeImage from "./qr.jpeg";

const VendorPackageScreen = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPackage, setSelectedPackage] = useState(null);

  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState("");
  const [unpaidReason, setUnpaidReason] = useState("");
  const [pendingPackage, setPendingPackage] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const { data } = await checkPaymentStatusAPI(userId);
          setUnpaidReason(data.unpaidReason);
          setPendingPackage(data.pendingPackage);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };
    checkPaymentStatus();
  }, []);

  useEffect(() => {
    getPackageByVendor()
      .then((response) => {
        setPackages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching packages for vendor:", error);
        setLoading(false);
      });
  }, []);

  // Handle package selection
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setError(""); // Clear error when a package is selected
  };

  // Handle screenshot upload
  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setError(""); // Clear error when screenshot is uploaded
    }
  };

  // Handle payment process
  const continueToPayment = async (e) => {
    e.preventDefault();

    if (!selectedPackage) {
      setError("Please select a package.");
      return;
    }

    if (!screenshot) {
      setError("Please upload a payment screenshot.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("packageId", selectedPackage._id);
    formData.append("screenshot", screenshot);

    try {
      const response = await postcreatePayment(formData);
      console.log("Payment created successfully", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating payment:", error);
      setError("Failed to create payment. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "2rem",
      }}
    >
      <form
        onSubmit={continueToPayment}
        style={{
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        {unpaidReason !== "pending_verification" && (
          <h2
            style={{ marginBottom: "1.5rem", color: "#333", fontWeight: "600" }}
          >
            Vendor Packages
          </h2>
        )}

        {unpaidReason === "expired" && (
          <div style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ffccc7", backgroundColor: "#fff2f0", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ color: "#ff4d4f", fontWeight: "600" }}>Your previous plan has expired. Please select a package and make a payment to renew your access.</span>
          </div>
        )}

        {unpaidReason === "rejected" && (
          <div style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ffccc7", backgroundColor: "#fff2f0", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ color: "#ff4d4f", fontWeight: "600" }}>Your previous payment was rejected. Please select a package and upload a new payment screenshot.</span>
          </div>
        )}

        {unpaidReason === "pending_verification" ? (
          <div style={{ padding: "1.5rem", border: "1px solid #ffe58f", backgroundColor: "#fffbe6", borderRadius: "8px" }}>
            <h4 style={{ color: "#d46b08", fontWeight: "600", fontSize: "1.2rem", marginBottom: "1rem" }}>Verification Pending</h4>
            {pendingPackage && (
              <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e0e0e0", textAlign: "left" }}>
                <p style={{ margin: "0.25rem 0", color: "#333", fontWeight: "600" }}>
                  Selected Plan: {pendingPackage.months} Months
                </p>
                <p style={{ margin: "0.25rem 0", color: "#666" }}>
                  Price: ₹{pendingPackage.specialPrice || pendingPackage.specialPrize || pendingPackage.Price || pendingPackage.prize}
                </p>
              </div>
            )}
            <p style={{ margin: "0.5rem 0", color: "#555" }}>
              Your payment screenshot has been uploaded and is currently under verification. Our team will review and approve it shortly.
            </p>
          </div>
        ) : (
          <>
            {loading ? (
              <CircularProgress />
            ) : packages.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                {packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    style={{
                      flex: "1 1 250px",
                      maxWidth: "350px",
                      padding: "1.5rem",
                      border: selectedPackage === pkg ? "2px solid #007bff" : "1px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor:
                        selectedPackage === pkg ? "#e6f7ff" : "#f9f9f9",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => handlePackageSelect(pkg)} // Select package on click
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <p style={{ margin: "0.5rem 0", color: "#555" }}>
                      Duration: {pkg.months} months
                    </p>
                    <p style={{ margin: "0.5rem 0", color: "#777" }}>
                      Actual Price: {pkg.Price}
                    </p>
                    <p
                      style={{
                        margin: "0.5rem 0",
                        fontWeight: "700",
                        color: "#007bff",
                      }}
                    >
                      Special Price: {pkg.specialPrice}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No packages available.</p>
            )}

            {selectedPackage && (
              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <p style={{ marginBottom: "1rem", color: "#333" }}>
                  Scan the QR code below to pay:
                </p>
                <img
                  src={QRCodeImage}
                  alt="QR Code"
                  style={{
                    width: "250px",
                    height: "250px",
                    marginBottom: "1rem",
                    borderRadius: "8px",
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  style={{
                    display: "block",
                    margin: "1rem auto",
                  }}
                />
              </div>
            )}

            {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              style={{
                marginTop: "2rem",
                width: "100%",
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "0.75rem",
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: "600",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Continue
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default VendorPackageScreen;
