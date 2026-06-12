import React from "react";
import { Spinner } from "react-bootstrap";
import "./customToast.scss";

function CustomLoadingAnimation({
  isLoading,
  message,
  backdropStyle = {},
  messageStyle,
}) {
  return isLoading ? (
    <div className="text-center loading">
      <Spinner
        animation="border"
        role="loader"
        variant="secondary"
        style={{ width: 50, height: 50 }}
      >
        {/* <span className="sr-only">Loading...</span> */}
      </Spinner>
      <p className="font-weight-bold h6 mt-4" style={messageStyle}>
        {message}
      </p>
    </div>
  ) : null;
}

export default CustomLoadingAnimation;
