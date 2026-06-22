import Navbar from "../components/Navbar";
import Footer from "../components/ Footer";

function AboutPage() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "120px 10%", minHeight: "60vh", textAlign: "center" }}>
        <h1>About Us</h1>
        <p style={{ marginTop: "20px", fontSize: "1.2rem", color: "#666" }}>
          Welcome to The Royal Ember. We provide luxury dining and premium hall reservations designed for unforgettable experiences.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default AboutPage;