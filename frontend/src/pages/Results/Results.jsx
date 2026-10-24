import React, { useState, useEffect } from "react";
import "./Results.css";
import useAuth from "../../context/useAuth";
import API from "../../services/api";

function Results() {
  const { isHead } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResult, setNewResult] = useState({
    event: "",
    year: "2026",
    position: "🥇 1st Place",
    team: "Aviation Club",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchResults = async () => {
    try {
      const res = await API.get("/results");
      if (res.data?.data) {
        setResults(res.data.data);
      }
    } catch (err) {
      console.warn("Failed to load results from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleAddResult = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMsg("");
      await API.post("/results", newResult);
      setMsg("✓ Result published successfully!");
      setNewResult({
        event: "",
        year: "2026",
        position: "🥇 1st Place",
        team: "Aviation Club",
        description: "",
      });
      setShowAddModal(false);
      await fetchResults();
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || "Failed to publish result");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResult = async (id, eventName) => {
    if (!window.confirm(`Are you sure you want to delete the result for "${eventName}"?`)) return;
    try {
      await API.delete(`/results/${id}`);
      await fetchResults();
      setMsg(`✓ Removed result for ${eventName}`);
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.message || "Failed to delete result");
    }
  };

  return (
    <section className="results-section" id="results">
      <h2>Results & Achievements</h2>
      <p className="results-subtitle">
        Celebrating the achievements and competition victories of our Aviation Club members.
      </p>

      {/* Head / Admin Quick Actions Bar */}
      {isHead && (
        <div
          style={{
            margin: "0 auto 2rem",
            padding: "0.75rem 1.25rem",
            background: "rgba(234, 179, 8, 0.12)",
            border: "1px solid rgba(234, 179, 8, 0.35)",
            borderRadius: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span style={{ color: "#facc15", fontWeight: 700, fontSize: "0.85rem" }}>
            👑 Head Edit Mode Active
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: "#ca8a04",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "6px 14px",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            ➕ Publish New Result
          </button>
        </div>
      )}

      {msg && (
        <div
          style={{
            marginBottom: "1.5rem",
            color: msg.startsWith("✓") ? "#4ade80" : "#f87171",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {msg}
        </div>
      )}

      {/* Modal for Adding New Result */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(234, 179, 8, 0.3)",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "500px",
              width: "100%",
              color: "#ffffff",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#facc15" }}>Publish Result / Award</h3>
            <form onSubmit={handleAddResult} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Competition / Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Boeing Aeromodelling Challenge"
                  value={newResult.event}
                  onChange={(e) => setNewResult({ ...newResult, event: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Year</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026"
                    value={newResult.year}
                    onChange={(e) => setNewResult({ ...newResult, year: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Position / Standing</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 🥇 1st Place / 🥈 2nd Place"
                    value={newResult.position}
                    onChange={(e) => setNewResult({ ...newResult, position: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Team / Candidate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Team Aero-Raipur / Sahil & Pratyush"
                  value={newResult.team}
                  onChange={(e) => setNewResult({ ...newResult, team: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief summary of the achievement, score, and task..."
                  value={newResult.description}
                  onChange={(e) => setNewResult({ ...newResult, description: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ flex: 1, padding: "0.75rem", background: "#0284c7", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}
                >
                  {submitting ? "Publishing..." : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "0.75rem 1.25rem", background: "transparent", border: "1px solid #475569", color: "#94a3b8", borderRadius: "8px", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#94a3b8" }}>
          Loading achievements...
        </div>
      ) : (
        <div className="results-container">
          {results.length === 0 ? (
            <p style={{ color: "#94a3b8", gridColumn: "1 / -1" }}>No results recorded yet.</p>
          ) : (
            results.map((result) => (
              <div className="result-card" key={result._id || result.event}>
                <span className="result-year">{result.year}</span>

                <h3>{result.event}</h3>

                <h4>{result.position}</h4>

                <p className="result-team">{result.team}</p>

                <p className="result-description">
                  {result.description}
                </p>

                {isHead && result._id && (
                  <button
                    onClick={() => handleDeleteResult(result._id, result.event)}
                    style={{
                      marginTop: "1rem",
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#fca5a5",
                      border: "1px solid rgba(239, 68, 68, 0.35)",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Delete Result
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default Results;
