import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        {/* <div className="footer-section">
          <h2>The Royal Ember</h2>

          <p>
            Luxury dining and premium hall reservations
            designed for unforgettable experiences.
          </p>
        </div> */}

        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li>Home</li>
            {/* <li>About</li>
            <li>Spaces</li> */}
            <li>Reservation</li>
            {/* <li>Contact</li> */}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>

          <p>📍 307-B, Tower A, I-Thum, Sector 62, Noida, UP-201301</p>
          <p>📞 +91 7836055511</p>
          <p>✉️ info@bizwoke.in</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 The Royal Ember. All Rights Reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;