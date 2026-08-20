import React from "react";
import "./Contact.css"; 
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaClock, 
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

// 1. ADDED THIS IMPORT SO THE PAGE CAN SEE YOUR FEEDBACK FORM!
import Feedback from "./Feedback"; 

function Contact() {
  return (
    <main className="contact-page">
      <div className="container">
        
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>
            Feel free to reach out to the Aviation Club for collaborations,
            workshops, competitions, or any aviation-related queries.
          </p>
        </div>

        <div className="contact-card">
          <div className="contact-item">
            <FaMapMarkerAlt className="icon" />
            <div>
              <h3>Address</h3>
              <p>
                Aviation Club <br />
                National Institute of Technology Raipur <br />
                Raipur, Chhattisgarh
              </p>
            </div>
          </div>

          <div className="contact-item">
            <FaEnvelope className="icon" />
            <div>
              <h3>Email</h3>
              <p>aviationclub@nitrr.ac.in</p>
            </div>
          </div>

          <div className="contact-item">
            <FaPhoneAlt className="icon" />
            <div>
              <h3>Phone</h3>
              <p>+91 9390060229</p>
            </div>
          </div>

          <div className="contact-item">
            <FaClock className="icon" />
            <div>
              <h3>Working Hours</h3>
              <p>Monday - Friday</p>
              <p>9:00 AM - 5:00 PM</p>
            </div>
          </div>

          <div className="social-section">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="#" target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href="#" target="_blank" rel="noreferrer"><FaYoutube /></a>
            </div>
          </div>
        </div>

        {/* 2. DROPPED THE FEEDBACK COMPONENT RIGHT HERE! */}
        <Feedback />

      </div>
    </main>
  );
}

export default Contact;