
import { FaStar } from "react-icons/fa";

function Feedback() {
  return (
    <section className="feedback">

      <div className="feedback-header">
        <h1>Feedback</h1>
        <p>
          We value your feedback! Help us improve our workshops,
          events, and overall club experience.
        </p>
      </div>

      <div className="feedback-card">

        <form>

          <input
            type="text"
            placeholder="Your Name"
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            required
          />

          <input
            type="text"
            placeholder="Department"
          />

          <div className="rating">

            <label>Rate Us</label>

            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

          </div>

          <textarea
            rows="6"
            placeholder="Share your feedback..."
            required
          ></textarea>

          <button type="submit">
            Submit Feedback
          </button>

        </form>

      </div>

    </section>
  );
}

export default Feedback;