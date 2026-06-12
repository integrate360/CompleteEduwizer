import React, { useState } from "react";
import { Input, Label } from "reactstrap";
import { uploadCVAPI } from "../../Services/api";
import Swal from "sweetalert2";

const UploadFile = ({ uploadFileProp, editData, accept }) => {
  const [localUrl, setLocalUrl] = useState(editData.url);
  const [fileType, setFileType] = useState(editData.fileType);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const handleFileChange = (file) => {
    setError(false);
    setMessage("");
    const sizeLimit = 1 * 1024 * 1024; // 1MB in bytes

    if (!file) {
      setError(true);
      setMessage("Please Select a file to upload");

      return false;
    }
    if (file.size > sizeLimit) {
      // setError(true);
      // setMessage("File size exceeds 1MB. Please upload a smaller image.");
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "File size exceeds 1MB. Please upload a smaller image.",
      });
      return false;
    }
    return true;
  };
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!handleFileChange(file)) return;
    let formData = new FormData();
    formData.append("admin", true);
    formData.append("file", e.target.files[0]);
    setFileType(file.type);
    setLocalUrl(URL.createObjectURL(file));
    const uploadCvResponse = await uploadCVAPI(formData);
    const url = uploadCvResponse.data.data;
    // let url =
    //   "https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg";
    uploadFileProp(file, url, file.type);
  };

  {
    console.log("fileType==", fileType);
  }
  {
    console.log("localUrl==", localUrl);
  }

  return (
    <>
      <Input
        accept={accept}
        multiple={false}
        type="file"
        name="file"
        id="exampleFile"
        onChange={(e) => {
          handleFile(e);
        }}
      />
      {error && <p className="text-danger">{message}</p>}
    </>
  );
};

export default UploadFile;
