import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./index.css";

const Candidates = () => {
  const [showCand, setShowCandid] = useState(false);
  const [cands, setCands] = useState(false);

  const getCandidateCount = () => {
    // Set the reference timestamp
    const referenceTimestamp = new Date("2023-06-23");

    // Get the current timestamp
    const currentTimestamp = new Date();

    // Calculate the number of milliseconds that have passed
    const millisecondsPassed = currentTimestamp - referenceTimestamp;

    // Convert milliseconds to days
    const daysPassed = Math.floor(millisecondsPassed / (1000 * 60 * 60 * 24));

    // Calculate the increased value
    const increaseAmount = 500 * daysPassed;

    // Initial value of the variable
    let initialValue = 500;

    // Calculate the final value
    const finalValue = initialValue + increaseAmount;
    return finalValue;
  };

  useEffect(() => {
    let cand = [
      {
        url: "/register/candidate",
        name: "Candidates",
        count: getCandidateCount(),
      },
      { url: "/register/student", name: "Colleges", count: "350" },
      { url: "/register/institute", name: "Institutes", count: "300" },
      { url: "/register/vendor", name: "Vendors", count: "250" },
    ];
    setCands(cand);
    // cands[0].count =
    setShowCandid(true);
  }, []);

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  return (
    <section className="candidates no-side-gap">
      <div
        className={
          isMobile
            ? "candidate-container overflow-x-axis"
            : "candidate-container"
        }
      >
        {showCand &&
          cands.map((e) => (
            <div className="candidate" key={e.name}>
              <p className="candidate-count">
                {e.count}+ {e.name}
              </p>
              <Button className="m-btn" variant="warning">
                <Link to={e.url}>Register</Link>
              </Button>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Candidates;
