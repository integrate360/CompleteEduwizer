import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { subscribe } from "../../Services/api";
import CustomToast from "../Common/CustomToast";
import "./index.css";

const Subscribe = (props = { bg: true, subHead: true }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [email, setEmail] = useState("");

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const subscribeNewsLetter = async () => {
    if (email) {
      await subscribe({ email });
      setEmail("");
      toast(
        <CustomToast
          type="success"
          message={`Thank you for subscribing. We will be happy to be in touch with you`}
        />
      );
    }
  };

  const isMobile = width <= 768;
  return (
    <section className={(props.bg ? "subscribe-with-bg " : "") + "no-side-gap"}>
      <section className="subscribe">
        <h1 className="subscribe-head">Subscribe To Our Newsletter</h1>
        {props.subHead && (
          <h3 className={isMobile ? "fs-2 p-10" : "fs-2"}>
            If you want to receive new offers and notifications from us{" "}
          </h3>
        )}
        <div
          className={
            isMobile
              ? "subscribe-content subscribe-content-mobile m-input-container"
              : "subscribe-content m-input-container"
          }
          style={{ width: isMobile && "85%" }}
        >
          <input
            className="m-input"
            type="email"
            placeholder="Enter your email id"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          ></input>
          {/* <div className="title">Email-ID</div> */}
          <Button
            variant="warning"
            className={isMobile ? "m-btn w-100 mt-2" : "m-btn w-100 mt-2"}
            onClick={() => subscribeNewsLetter()}
          >
            <div className="btn-text p-1.5">Subscribe</div>
          </Button>
        </div>
      </section>
    </section>
  );
};

export default Subscribe;
