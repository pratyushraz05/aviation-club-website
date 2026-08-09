
import FeedbackCard from "../components/FeedbackCard";
import { FaStar } from "react-icons/fa";

function Feedback() {
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

          <input
            type="text"
            placeholder="Enter your name"
            required
          />

          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <input
            type="text"
            placeholder="Department"
          />

          <div className="rating">

            <h3>Rate Your Experience</h3>

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
            placeholder="Write your feedback..."
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