import React, { useState, useEffect } from "react";
import "./Team.css";
import useAuth from "../../context/useAuth";
import API from "../../services/api";

function MemberCard({ member, featured = false, noPhoto = false, isHead = false, onDelete }) {
  return (
    <div className={`member-card ${featured ? "featured" : ""} ${noPhoto ? "no-photo" : ""}`}>
      {!noPhoto && (
        <div className="member-image">
          <img
            src={member.image || "/team/default.jpg"}
            alt={member.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
            }}
          />
        </div>
      )}

      <div className="member-info">
        <h3>{member.name}</h3>

        {!noPhoto && <p>{member.role}</p>}

        {member.branch && (
          <span className="branch">
            BRANCH: <b>{member.branch}</b>
          </span>
        )}

        {isHead && member._id && (
          <button
            onClick={() => onDelete(member._id, member.name)}
            style={{
              marginTop: "0.75rem",
              background: "rgba(239, 68, 68, 0.2)",
              color: "#fca5a5",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            🗑️ Remove Member
          </button>
        )}
      </div>
    </div>
  );
}

function TeamSection({ title, members = [], featured = false, isHead = false, onDelete }) {
  if (!members || members.length === 0) return null;

  const gridClass = featured
    ? "faculty-grid"
    : title === "Mentor"
    ? "mentor-grid"
    : title === "Core Team"
    ? "core-grid"
    : title === "Non-Technical Team"
    ? "non-technical-grid"
    : "";

  return (
    <section className="team-section">
      <div className="section-title">
        <h2>{title}</h2>
        <span />
      </div>

      <div className={`members-grid ${gridClass}`}>
        {members.map((member) => (
          <MemberCard
            key={member._id || member.name}
            member={member}
            featured={featured}
            isHead={isHead}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}

export default function Team() {
  const { isHead } = useAuth();
  const [teamData, setTeamData] = useState({
    faculty: [],
    mentor: [],
    coreTeam: [],
    technicalTeam: [],
    nonTechnicalTeam: [],
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    section: "technicalTeam",
    branch: "CSE",
    image: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchTeam = async () => {
    try {
      const res = await API.get("/team");
      if (res.data?.data) {
        setTeamData(res.data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch team from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMsg("");
      await API.post("/team", newMember);
      setMsg("✓ Member added successfully!");
      setNewMember({
        name: "",
        role: "",
        section: "technicalTeam",
        branch: "CSE",
        image: "",
      });
      setShowAddModal(false);
      await fetchTeam();
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || "Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the team roster?`)) return;
    try {
      await API.delete(`/team/${id}`);
      await fetchTeam();
      setMsg(`✓ Removed ${name}`);
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.message || "Failed to remove member");
    }
  };

  return (
    <main className="team-page">
      <header className="team-header">
        <span>AVIATION CLUB • NIT RAIPUR</span>

        <h1>
          Our <strong>Team</strong>
        </h1>

        <div className="team-line" />

        <p>
          Meet the people behind the ideas, projects and activities
          <br />
          that drive the Aviation Club forward.
        </p>

        {/* Head / Admin Quick Actions Bar */}
        {isHead && (
          <div
            style={{
              marginTop: "1.5rem",
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
              ➕ Add Team Member
            </button>
          </div>
        )}

        {msg && (
          <div
            style={{
              marginTop: "1rem",
              color: msg.startsWith("✓") ? "#4ade80" : "#f87171",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {msg}
          </div>
        )}
      </header>

      {/* Modal for Adding Member */}
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
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#facc15" }}>Add New Team Member</h3>
            <form onSubmit={handleAddMember} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sahil Sharma"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aerodynamics Lead / Member"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Section</label>
                  <select
                    value={newMember.section}
                    onChange={(e) => setNewMember({ ...newMember, section: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                  >
                    <option value="technicalTeam">Technical Team</option>
                    <option value="nonTechnicalTeam">Non-Technical Team</option>
                    <option value="coreTeam">Core Team</option>
                    <option value="faculty">Faculty</option>
                    <option value="mentor">Mentor</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Branch</label>
                  <input
                    type="text"
                    placeholder="e.g. MECHANICAL, CSE"
                    value={newMember.branch}
                    onChange={(e) => setNewMember({ ...newMember, branch: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Photo URL (or static path)</label>
                <input
                  type="text"
                  placeholder="e.g. /team/sahil.jpg or Cloudinary URL"
                  value={newMember.image}
                  onChange={(e) => setNewMember({ ...newMember, image: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ flex: 1, padding: "0.75rem", background: "#0284c7", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}
                >
                  {submitting ? "Saving..." : "Save Member"}
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
          Loading team directory...
        </div>
      ) : (
        <>
          <TeamSection
            title="Faculty"
            members={teamData.faculty}
            featured
            isHead={isHead}
            onDelete={handleDeleteMember}
          />

          <TeamSection
            title="Mentor"
            members={teamData.mentor}
            isHead={isHead}
            onDelete={handleDeleteMember}
          />

          <TeamSection
            title="Core Team"
            members={teamData.coreTeam}
            isHead={isHead}
            onDelete={handleDeleteMember}
          />

          <TeamSection
            title="Technical Team"
            members={teamData.technicalTeam}
            isHead={isHead}
            onDelete={handleDeleteMember}
          />

          <TeamSection
            title="Non-Technical Team"
            members={teamData.nonTechnicalTeam}
            isHead={isHead}
            onDelete={handleDeleteMember}
          />
        </>
      )}
    </main>
  );
}
