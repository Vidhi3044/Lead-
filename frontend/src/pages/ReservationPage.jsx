import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/ Footer";
import "../styles/reservation.css";
import Swal from "sweetalert2";

function ReservationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    reservationType: "",
    guests: "",
    date: "",
    time: "",
    duration: "",
    occasion: "",
    package: "",
    requirements: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Phone number is the only required field
  if (!formData.phone.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Phone Number Required",
      text: "Please enter your phone number.",
      confirmButtonColor: "#d4af37",
    });

    return;
  }

  try {
    // Loading Popup
    Swal.fire({
      title: "Submitting Request...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await axios.post(
      "/api/reservations",
      formData
    );

    console.log(response.data);

    // Success Popup
    await Swal.fire({
      icon: "success",
      title: "Thank You!",
      html: `
        <p>Your reservation enquiry has been received.</p>
        <p>Our team will contact you shortly via phone or WhatsApp.</p>
      `,
      confirmButtonColor: "#d4af37",
    });

    // Clear Form
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      reservationType: "",
      guests: "",
      date: "",
      time: "",
      duration: "",
      occasion: "",
      package: "",
      requirements: "",
      notes: "",
    });

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: "Please try again later.",
      confirmButtonColor: "#d4af37",
    });
  }
};

  return (
    <>
      <Navbar />

      {/* <section className="reservation-hero">
        <div className="reservation-hero-content">
          <h1>Reserve Your Experience</h1>

          <p>
            Whether you're planning an intimate dinner, a corporate gathering,
            or a grand celebration, our team is here to create an unforgettable
            experience.
          </p>
        </div>
      </section> */}

      <section className="reservation-container">
        <div className="reservation-form">
          <h2>Reservation Form</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                
              />

              <select
                name="reservationType"
                value={formData.reservationType}
                onChange={handleChange}
                
              >
                <option value="">Venue</option>
                <option value="Goa">
                  Goa
                </option>
                <option value="Aeroplane">
                  Aeroplane
                </option>
              </select>

              <input
                type="number"
                name="guests"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={handleChange}
                
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                
              />

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                
              />

              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                
              >
                <option value="">Duration</option>
                <option value="1 Hour">1 Hour</option>
                <option value="2 Hours">2 Hours</option>
                <option value="3 Hours">3 Hours</option>
                <option value="4+ Hours">4+ Hours</option>
              </select>

              <select
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
              >
                <option value="">Occasion</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Family Gathering">Family Gathering</option>
                <option value="Wedding Function">Wedding Function</option>
                <option value="Other">Other</option>
              </select>

           <select
  name="package"
  value={formData.package}
  onChange={handleChange}
>
  <option value="">
    Select Package
  </option>

  <option value="Silver Package - ₹1200/Pax">
    Silver Party Package - ₹1200/Pax
  </option>

  <option value="Gold Package - ₹1500/Pax">
    Gold Party Package - ₹1500/Pax
  </option>

  <option value="Diamond Package - ₹1800/Pax">
    Diamond Party Package - ₹1800/Pax
  </option>

  <option value="Platinum Package - ₹2200/Pax">
    Aeroplane Restaurant Table - ₹300
  </option>

  <option value="Royal Package - ₹2500/Pax">
    Couple Special Package - ₹999
  </option>
</select>
            </div>

            <textarea
              name="requirements"
              placeholder="Requirements & Arrangements (Decoration, Music Setup, Projector, Wheelchair Access, etc.)"
              rows="4"
              value={formData.requirements}
              onChange={handleChange}
            />

            <textarea
              name="notes"
              placeholder="Additional Notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
            />

            <button type="submit">
              Submit Reservation Request
            </button>
          </form>
        </div>

        {/* <div className="reservation-info">
          <h2>Reservation Information</h2>

          <ul>
            <li>✓ Reservation requests are reviewed within 2 hours</li>
            <li>✓ Hall bookings require confirmation from our staff</li>
            <li>✓ WhatsApp confirmation will be sent after submission</li>
            <li>✓ Our team may contact you for additional details</li>
            <li>✓ Dedicated support for special occasions and events</li>
          </ul>
        </div> */}
      </section>

      <Footer />
    </>
  );
}

export default ReservationPage;