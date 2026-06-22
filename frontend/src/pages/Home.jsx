import { useNavigate } from "react-router-dom";
import "../styles/hero.css";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";
import Footer from "../components/ Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;