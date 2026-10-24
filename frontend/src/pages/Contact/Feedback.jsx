import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import API from "../../services/api";
import "./Feedback.css";

const ratingLabels = {
  1: "Needs Improvement (1/5)",
  2: "Fair (2/5)",
  3: "Good (3/5)",
  4: "Very Good (4/5)",
  5: "Excellent (5/5)",
};

function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({
        type: "error",
        text: "Please fill out all required fields (Name, Email, Message).",
      });
      return;
    }

    try {
      setSubmitting(true);
      setStatus(null);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        department: department.trim(),
        rating,
        message: message.trim(),
      };

      const res = await API.post("/feedback", payload);

      if (res.data?.success) {
        setStatus({
          type: "success",
          text: "🎉 Thank you! Your feedback has been recorded and submitted to the Aviation Club team.",
        });
        setName("");
        setEmail("");
        setDepartment("");
        setMessage("");
        setRating(5);
      } else {
        throw new Error(res.data?.message || "Failed to submit feedback");
      }
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || err.message || "Failed to submit feedback. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="feedback">
      <div className="feedback-header">
        <h1>Share Your Feedback</h1>
        <p>
          Your feedback helps us continuously improve our workshops, aircraft projects,
          aeromodelling events, and overall student experience at the Aviation Club.
        </p>
      </div>

      <div className="feedback-card">
        {status && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "0.95rem",
              fontWeight: 600,
              background:
                status.type === "success"
                  ? "rgba(34, 197, 94, 0.15)"
                  : "rgba(239, 68, 68, 0.15)",
              border: `1px solid ${
                status.type === "success"
                  ? "rgba(34, 197, 94, 0.4)"
                  : "rgba(239, 68, 68, 0.4)"
              }`,
              color: status.type === "success" ? "#4ade80" : "#f87171",
            }}
          >
            {status.text}
          </div>
        )}

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px" }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px" }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email (e.g. name@domain.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px" }}>
              Branch / Department
            </label>
            <input
              type="text"
              placeholder="e.g. Mechanical Engineering, CSE, ECE"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="rating">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ margin: 0 }}>Rate Your Experience</h3>
              <span style={{ fontSize: "0.85rem", color: "#fbbf24", fontWeight: 600 }}>
                {ratingLabels[hover || rating]}
              </span>
            </div>

            <div className="stars">
              {[...Array(5)].map((_, index) => {
                const currentRating = index + 1;
                return (
                  <FaStar
                    key={index}
                    className="star-icon"
                    size={30}
                    color={currentRating <= (hover || rating) ? "#fbbf24" : "#334155"}
                    onMouseEnter={() => setHover(currentRating)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(currentRating)}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px" }}>
              Your Message & Suggestions *
            </label>
            <textarea
              rows={5}
              required
              placeholder="Tell us what you liked, what can be improved, or suggestions for upcoming competitions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button type="submit" disabled={submitting} style={{ opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Feedback;
