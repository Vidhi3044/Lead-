import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">The Royal Ember</Link>
      </div>

      <button className="nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      <ul className={`nav-links ${mobileMenuOpen ? "nav-active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        </li>

        <li>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
        </li>

        <li>
          <Link to="/spaces" onClick={() => setMobileMenuOpen(false)}>Spaces</Link>
        </li>

        <li>
          <Link to="/reservation" onClick={() => setMobileMenuOpen(false)}>Reservation</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;