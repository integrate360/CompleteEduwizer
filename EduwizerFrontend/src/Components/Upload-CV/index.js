import { FormControl } from "@mui/material";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { uploadCVAPI } from "../../Services/api";

const UploadCV = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const showCVAlert = () => {
    MySwal.fire({
      title: "CV Uploaded",
      text: "Thank you for uploading your resume",
      icon: "success",
      // confirmButtonText: 'OK'
    });
  };

  const continueToPayment = () => {
    return new Promise((resolve, reject) => {
      navigate("/dashboard");
      resolve();
    });
  };

  const fileHandle = async (e) => {
    try {
      let formData = new FormData();

      // Update the formData object

      formData.append("file", e.target.files[0]);

      await uploadCVAPI(formData);
      showCVAlert()
      continueToPayment();
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <div className="row py-5 w-100 uploadcv-with-bg">
      <form onSubmit={continueToPayment}>
        <div
          className="row justify-content-center align-items-center"
          style={{ padding: "8rem 0 0 0" }}
        >
          <div className="col-lg-12 col-sm-none text-center mt-3">
            <div className="col-12 font-weight-bold">Upload Your CV</div>
          </div>
          <div className="row p-3 justify-content-center mt-5">
            <label htmlFor="inputCV" className="btn w-25 upload-cv">
              Upload CV
            </label>
            <input
              multiple={false}
              id="inputCV"
              name="inputCV"
              type="file"
              hidden
              onChange={(e) => {
                fileHandle(e);
              }}
            />
          </div>
          <div className="col-12 text-center" style={{ margin: "6rem 0 0 0" }}>
            <FormControl sx={{ m: 1, width: "36ch" }} variant="outlined">
              <Button type="submit" variant="outlined" size="large" className="m-btn">
                Continue
              </Button>
            </FormControl>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadCV;
