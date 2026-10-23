import React, { useState } from "react"; // 🚀 1. We import useState here!
import { FaStar } from "react-icons/fa";
import "./Feedback.css";

function Feedback() {
  // 🚀 2. Create state variables to track the current rating and hover effects
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <section className="feedback">
      <div className="feedback-header">
        <h1>Feedback</h1>
        <p>
          Your feedback helps us improve our workshops, events, and overall
          experience at the Aviation Club.
        </p>
      </div>

      <div className="feedback-card">
        <form className="feedback-form">
          <input type="text" placeholder="Enter your name" required />
          <input type="email" placeholder="Enter your email" required />
          <input type="text" placeholder="Department" />

          <div className="rating">
            <h3>Rate Your Experience</h3>
            <div className="stars">
              
              {/* 🚀 3. We loop through 5 numbers to generate interactive stars */}
              {[...Array(5)].map((star, index) => {
                const currentRating = index + 1;
                return (
                  <FaStar
                    key={index}
                    className="star-icon"
                    size={28}
                    // This changes the color to yellow if active, or dark grey if inactive
                    color={currentRating <= (hover || rating) ? "#fbbf24" : "#334155"}
                    onMouseEnter={() => setHover(currentRating)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(currentRating)}
                  />
                );
              })}
              
            </div>
          </div>

          <textarea rows="6" placeholder="Write your feedback..." required></textarea>
          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </section>
  );
}

export default Feedback;