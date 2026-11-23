import React, { useState, useEffect } from "react";
import "./Team.css";
import useAuth from "../../context/useAuth";
import API from "../../services/api";

function MemberCard({ member, featured = false, noPhoto = false, isHead = false, onEdit, onDelete }) {
  let displayRole = member.role;
  if (member.name === "Sivaratri Lakshmi Sahithi" && (!member.role || member.role === "Core Team")) {
    displayRole = "President";
  } else if ((member.name === "Kritika Tripathi" || member.name?.includes("Tripathi")) && (!member.role || member.role === "Core Team")) {
    displayRole = "Vice President";
  } else if (member.role === "Technical Team") {
    displayRole = "WEB dev team";
  } else if (
    member.role === "Non-Technical Team" ||
    member.role === "Technical Member" ||
    member.role === "Non-Technical Member"
  ) {
    displayRole = "Core Member";
  }

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

        {!noPhoto && <p>{displayRole}</p>}

        {member.branch && (
          <span className="branch">
            BRANCH: <b>{member.branch}</b>
          </span>
        )}

        {isHead && typeof member.order === "number" && (
          <div style={{ marginTop: "0.35rem" }}>
            <span
              style={{
                fontSize: "0.7rem",
                color: "#0284c7",
                background: "rgba(2, 132, 199, 0.12)",
                padding: "2px 8px",
                borderRadius: "999px",
                fontWeight: 600,
              }}
            >
              Position #{member.order}
            </span>
          </div>
        )}

        {isHead && member._id && (
          <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <button
              onClick={() => onEdit(member)}
              title="Edit member position, status and details"
              style={{
                background: "rgba(14, 165, 233, 0.18)",
                color: "#38bdf8",
                border: "1px solid rgba(14, 165, 233, 0.4)",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete(member._id, member.name)}
              title="Remove member from roster"
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                color: "#fca5a5",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🗑️ Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamSection({ title, members = [], featured = false, isHead = false, onEdit, onDelete }) {
  if (!members || members.length === 0) return null;

  const sortedMembers = [...members].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const gridClass = featured
    ? "faculty-grid"
    : title === "Mentor"
    ? "mentor-grid"
    : title === "Core Team"
    ? "core-grid"
    : "";

  return (
    <section className="team-section">
      <div className="section-title">
        <h2>{title}</h2>
        <span />
      </div>

      <div className={`members-grid ${gridClass}`}>
        {sortedMembers.map((member) => (
          <MemberCard
            key={member._id || member.name}
            member={member}
            featured={featured}
            isHead={isHead}
            onEdit={onEdit}
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
  const [customSections, setCustomSections] = useState({});
  const [loading, setLoading] = useState(true);

  // Unified Add / Edit Member Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    sectionSelect: "coreTeam",
    customSection: "",
    order: 0,
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
      if (res.data?.customSections) {
        setCustomSections(res.data.customSections);
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

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditingId(null);
    setFormData({
      name: "",
      role: "",
      sectionSelect: "coreTeam",
      customSection: "",
      order: 0,
      branch: "CSE",
      image: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setModalMode("edit");
    setEditingId(member._id);
    const standardSections = ["coreTeam", "technicalTeam", "nonTechnicalTeam", "Project Manager", "faculty", "mentor"];
    const isStandard = standardSections.includes(member.section);
    setFormData({
      name: member.name || "",
      role: member.role || "",
      sectionSelect: isStandard ? member.section : "custom",
      customSection: isStandard ? "" : (member.section || ""),
      order: member.order !== undefined ? member.order : 0,
      branch: member.branch || "",
      image: member.image || "",
    });
    setModalOpen(true);
  };

  const handleSubmitMember = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMsg("");

      const finalSection =
        formData.sectionSelect === "custom"
          ? (formData.customSection.trim() || "coreTeam")
          : formData.sectionSelect;

      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        section: finalSection,
        order: formData.order !== "" ? Number(formData.order) : 0,
        branch: formData.branch ? formData.branch.trim() : "",
        image: formData.image ? formData.image.trim() : "",
      };

      if (modalMode === "edit" && editingId) {
        await API.put(`/team/${editingId}`, payload);
        setMsg(`✓ Updated ${payload.name} successfully!`);
      } else {
        await API.post("/team", payload);
        setMsg(`✓ Added ${payload.name} successfully!`);
      }

      setModalOpen(false);
      await fetchTeam();
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || "Failed to save team member");
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
              onClick={handleOpenAdd}
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

      {/* Unified Modal for Adding & Updating Member */}
      {modalOpen && (
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
              maxWidth: "520px",
              width: "100%",
              color: "#ffffff",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ marginBottom: "1.25rem", color: "#facc15" }}>
              {modalMode === "edit" ? "✏️ Update Team Member" : "➕ Add Team Member"}
            </h3>

            <form onSubmit={handleSubmitMember} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sahil Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#fff",
                    marginTop: "0.25rem",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  Position / Role (Designation) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. President, Vice President, Lead, Core Member"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#fff",
                    marginTop: "0.25rem",
                  }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.45rem" }}>
                  {["President", "Vice President", "Project Manager", "Core Team", "WEB DEV team", "Core Member", "Faculty In-Charge", "Mentor"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: preset })}
                      style={{
                        background: formData.role === preset ? "#0284c7" : "rgba(255,255,255,0.06)",
                        color: formData.role === preset ? "#fff" : "#94a3b8",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "12px",
                        padding: "2px 8px",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Status / Section *</label>
                  <select
                    value={formData.sectionSelect}
                    onChange={(e) => setFormData({ ...formData, sectionSelect: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "8px",
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#fff",
                      marginTop: "0.25rem",
                    }}
                  >
                    <option value="coreTeam">Core Team (President / Core)</option>
                    <option value="technicalTeam">WEB DEV team</option>
                    <option value="nonTechnicalTeam">Core Team (General / Non-Tech)</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="faculty">Faculty</option>
                    <option value="mentor">Mentor</option>
                    <option value="custom">✨ Custom Status / Section...</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                    Position # (Order in List)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1 for top, 2, 3..."
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "8px",
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#fff",
                      marginTop: "0.25rem",
                    }}
                  />
                </div>
              </div>

              {formData.sectionSelect === "custom" && (
                <div style={{ background: "rgba(14, 165, 233, 0.08)", border: "1px dashed #0284c7", borderRadius: "10px", padding: "0.75rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 600 }}>
                    Enter Custom Status / Section Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aerodynamics Wing, Alumni, Advisory Board..."
                    value={formData.customSection}
                    onChange={(e) => setFormData({ ...formData, customSection: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "8px",
                      background: "#0f172a",
                      border: "1px solid #38bdf8",
                      color: "#fff",
                      marginTop: "0.35rem",
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "4px 0 0" }}>
                    Members with this status will be grouped under their own "{formData.customSection || "Custom"}" section header on the team page.
                  </p>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Branch / Year</label>
                  <input
                    type="text"
                    placeholder="e.g. MECHANICAL, CSE, 4th Year"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "8px",
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#fff",
                      marginTop: "0.25rem",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Photo URL (or static path)</label>
                  <input
                    type="text"
                    placeholder="e.g. /team/sahil.jpg or Cloudinary"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      borderRadius: "8px",
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#fff",
                      marginTop: "0.25rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#0284c7",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {submitting ? "Saving..." : modalMode === "edit" ? "Update Member" : "Save Member"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "0.75rem 1.25rem",
                    background: "transparent",
                    border: "1px solid #475569",
                    color: "#94a3b8",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
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
            onEdit={handleOpenEdit}
            onDelete={handleDeleteMember}
          />

          <TeamSection
            title="Mentor"
            members={teamData.mentor}
            isHead={isHead}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteMember}
          />

          {/* New / Custom Sections (e.g. Project Manager) placed above Core and WEB dev team */}
          {customSections &&
            Object.entries(customSections).map(([secTitle, secMembers]) => (
              <TeamSection
                key={secTitle}
                title={secTitle}
                members={secMembers}
                isHead={isHead}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteMember}
              />
            ))}

          <TeamSection
            title="Core Team"
            members={teamData.coreTeam}
            isHead={isHead}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteMember}
          />

          <TeamSection
            title="WEB dev team"
            members={teamData.technicalTeam}
            isHead={isHead}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteMember}
          />

          <TeamSection
            title="Core Team"
            members={teamData.nonTechnicalTeam}
            isHead={isHead}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteMember}
          />
        </>
      )}
    </main>
  );
}
