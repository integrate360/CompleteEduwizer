import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";

const getCandidateCount = () => {
  // Counter grows by 500/day since launch reference date
  const referenceTimestamp = new Date("2023-06-23");
  const daysPassed = Math.floor(
    (new Date() - referenceTimestamp) / (1000 * 60 * 60 * 24)
  );
  return 500 + 500 * daysPassed;
};

const ICONS = ["🎓", "🏛️", "🏫", "💼"];

/**
 * Stats strip.
 * variant="light"  — home page: icon circles + numbers (no buttons)
 * variant="yellow" — about page: yellow band with Register buttons
 */
const Candidates = ({ variant = "light" }) => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    setStats([
      { url: "/register/candidate", name: "Candidates", count: getCandidateCount() },
      { url: "/register/student", name: "Colleges", count: 350 },
      { url: "/register/institute", name: "Institutes", count: 300 },
      { url: "/register/vendor", name: "Vendors", count: 250 },
    ]);
  }, []);

  return (
    <section className={"ew-stats" + (variant === "yellow" ? " ew-stats--yellow" : "")}>
      <div className="ew-stats-grid">
        {stats.map((e, i) => (
          <div className="ew-stat" key={e.name}>
            {variant === "light" && (
              <span className={`ew-stat-icon c${i + 1}`}>{ICONS[i]}</span>
            )}
            <div>
              <div className="ew-stat-num">
                {e.count.toLocaleString("en-IN")}+
              </div>
              <div className="ew-stat-label">{e.name}</div>
            </div>
            {variant === "yellow" && (
              <Link to={e.url} className="ew-btn ew-btn--outline-dark ew-btn--sm">
                Register
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Candidates;
