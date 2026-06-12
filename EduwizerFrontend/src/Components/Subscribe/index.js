import { useState } from "react";
import { toast } from "react-toastify";
import { subscribe } from "../../Services/api";
import CustomToast from "../Common/CustomToast";
import "./index.css";

const Subscribe = () => {
  const [email, setEmail] = useState("");

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

  return (
    <section className="ew-newsletter-wrap">
      <div className="ew-newsletter">
        <div className="ew-newsletter-text">
          <h2>Subscribe To Our Newsletter</h2>
          <p>If you want to receive new offers and notifications from us</p>
        </div>
        <form
          className="ew-newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
            subscribeNewsLetter();
          }}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          />
          <button type="submit" className="ew-btn ew-btn--yellow ew-btn--sm">
            Subscribe Now
          </button>
        </form>
      </div>
    </section>
  );
};

export default Subscribe;
