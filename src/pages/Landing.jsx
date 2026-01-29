import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Landing = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="landing-container">
      <h1 className="landing-title">Expense Tracker</h1>
      <p className="landing-subtitle">Track your expenses smartly</p>

      <div className="landing-actions">
        <Link to="/login">
          <button className="landing-btn">Login</button>
        </Link>
        <Link to="/register">
          <button className="landing-btn primary">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
