import { useState } from "react";
import { contactUs } from "../../Services/api";
import CustomToast from "../Common/CustomToast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./Contact.css";

const MySwal = withReactContent(Swal);

const ADDRESS =
  "Enam Sambhav, C-20, G Block Rd, G Block BKC, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const validateForm = () => {
    if (name.trim().length === 0) return "Enter your name";
    if (email.trim().length === 0) return "Enter your email";
    if (phone.trim().length === 0) return "Enter your phone number";
    if (message.trim().length === 0) return "Enter a message";
    return null;
  };

  const sendContactUsMessage = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      MySwal.fire({ icon: "warning", title: error });
      return;
    }

    try {
      setSending(true);
      await contactUs({ name, email, phone, message });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");

      MySwal.fire({
        icon: "success",
        title: "Thank you for contacting us.",
        html: (
          <div>
            <CustomToast
              type="success"
              message="Our team will get back to you shortly"
            />
          </div>
        ),
        showConfirmButton: false,
        timer: 8000,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="ew-contact">
      <section className="ew-section">
        <div className="ew-container">
          <div className="ew-contact-grid">
            {/* ---- Send us a message ---- */}
            <div className="ew-card ew-contact-form-card">
              <h1>Send Us a Message</h1>
              <p className="ew-contact-sub">
                We&apos;d love to hear from you! Fill out the form below and
                we&apos;ll get back to you within 24 hours.
              </p>

              <form onSubmit={sendContactUsMessage}>
                <div className="ew-contact-form-row">
                  <div className="ew-field">
                    <label className="ew-label">
                      Full Name <span className="req">*</span>
                    </label>
                    <div className="ew-input-wrap">
                      <span className="ew-field-icon"><i className="fa fa-user-o"></i></span>
                      <input
                        className="ew-input"
                        value={name}
                        placeholder="Your full name"
                        onChange={(evt) => setName(evt.target.value)}
                      />
                    </div>
                  </div>
                  <div className="ew-field">
                    <label className="ew-label">
                      Email Address <span className="req">*</span>
                    </label>
                    <div className="ew-input-wrap">
                      <span className="ew-field-icon"><i className="fa fa-envelope-o"></i></span>
                      <input
                        className="ew-input"
                        type="email"
                        value={email}
                        placeholder="you@example.com"
                        onChange={(evt) => setEmail(evt.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="ew-field">
                  <label className="ew-label">
                    Phone Number <span className="req">*</span>
                  </label>
                  <div className="ew-input-wrap">
                    <span className="ew-field-icon"><i className="fa fa-phone"></i></span>
                    <input
                      className="ew-input"
                      type="tel"
                      value={phone}
                      placeholder="+91 91677 80061"
                      onChange={(evt) => setPhone(evt.target.value)}
                    />
                  </div>
                </div>

                <div className="ew-field">
                  <label className="ew-label">
                    Your Message <span className="req">*</span>
                  </label>
                  <div className="ew-input-wrap">
                    <textarea
                      className="ew-textarea"
                      value={message}
                      placeholder="How can we help you?"
                      onChange={(evt) => setMessage(evt.target.value)}
                    />
                  </div>
                </div>

                <button
                  className="ew-btn ew-btn--navy"
                  type="submit"
                  disabled={sending}
                >
                  <i className="fa fa-paper-plane"></i>&nbsp; Send Message
                </button>
              </form>
            </div>

            {/* ---- Our office ---- */}
            <div className="ew-contact-office">
              <h2>Our Office</h2>
              <p className="ew-contact-sub">
                Visit us at our office or reach us through any of our official
                communication channels.
              </p>

              <div className="ew-office-item">
                <span className="ew-office-icon"><i className="fa fa-map-marker"></i></span>
                <div>
                  <div className="ew-office-head">Head Office</div>
                  <p>
                    {ADDRESS}{" "}
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      (View on Google Maps)
                    </a>
                  </p>
                </div>
              </div>

              <div className="ew-office-item">
                <span className="ew-office-icon"><i className="fa fa-phone"></i></span>
                <div>
                  <div className="ew-office-head">Phone</div>
                  <p>
                    <a href="tel:+919167780061">+91 91677 80061</a> /{" "}
                    <a href="tel:+919167864061">+91 91678 64061</a>
                  </p>
                </div>
              </div>

              <div className="ew-office-item">
                <span className="ew-office-icon"><i className="fa fa-envelope-o"></i></span>
                <div>
                  <div className="ew-office-head">Email</div>
                  <p>
                    <a href="mailto:support@eduwizer.com">support@eduwizer.com</a>
                  </p>
                </div>
              </div>

              <div className="ew-office-item">
                <span className="ew-office-icon"><i className="fa fa-clock-o"></i></span>
                <div>
                  <div className="ew-office-head">Business Hours</div>
                  <p>
                    Mon – Sat: 9:00 AM – 6:30 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Find us here / map ---- */}
      <section className="ew-contact-map-section">
        <iframe
          title="Eduwizer Office Location"
          src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="ew-card ew-contact-map-card">
          <h2>Find Us Here</h2>
          <p>
            We are located in the heart of Mumbai&apos;s Bandra Kurla Complex —
            easy to reach, let&apos;s hear from you and your vision.
          </p>
          <a
            className="ew-btn ew-btn--yellow ew-btn--sm"
            href={`https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`}
            target="_blank"
            rel="noreferrer"
          >
            Get Directions →
          </a>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
