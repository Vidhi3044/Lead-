import "../styles/testimonials.css";

function Testimonials() {
  return (
    <section className="testimonials">

      <div className="testimonials-header">
        <h2>What Our Guests Say</h2>

        <p>
          Experiences shared by guests who chose
          The Royal Ember for their special moments.
        </p>
      </div>

      <div className="testimonial-container">

        <div className="testimonial-card">
          <div className="stars">★★★★★</div>

          <p>
            The ambience, food, and service were absolutely
            exceptional. The private hall exceeded our expectations.
          </p>

          <h4>Sarah Johnson</h4>
        </div>

        <div className="testimonial-card">
          <div className="stars">★★★★★</div>

          <p>
            We celebrated our anniversary here and everything
            was arranged perfectly. Highly recommended.
          </p>

          <h4>Rahul Sharma</h4>
        </div>

        <div className="testimonial-card">
          <div className="stars">★★★★★</div>

          <p>
            Elegant interiors, amazing hospitality,
            and a seamless reservation experience.
          </p>

          <h4>Priya Mehta</h4>
        </div>

      </div>

    </section>
  );
}

export default Testimonials;