import { Link } from "react-router-dom";
import "../styles/hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Luxury Dining & Hall Reservations</h1>

        <p>
          Reserve elegant dining spaces and premium halls
          for unforgettable experiences.
        </p>

        <Link to="/reservation">
          <button>
            Reserve Now
          </button>
        </Link>

      </div>
    </section>
  );
}

export default Hero;