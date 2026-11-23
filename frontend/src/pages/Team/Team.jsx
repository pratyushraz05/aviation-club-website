import React, { useState, useEffect } from "react";
import "./Team.css";
import useAuth from "../../context/useAuth";
import API from "../../services/api";

const DEFAULT_SECTION_ORDER = [
  "faculty",
  "mentor",
  "coreTeam",
  "Project Manager",
  "technicalTeam",
  "nonTechnicalTeam",
];

const SECTION_DISPLAY_LABELS = {
  faculty: "Faculty In-Charge",
  mentor: "Mentor",
  coreTeam: "Core Team (Leadership / Presidents)",
  "Project Manager": "Project Manager",
  technicalTeam: "WEB dev team",
  nonTechnicalTeam: "Core Team (Members)",
};

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

function TeamSection({
  id,
  title,
  members = [],
  featured = false,
  isHead = false,
  onEdit,
  onDelete,
  canMoveUp = false,
  canMoveDown = false,
  onMoveSection,
}) {
  if (!members || members.length === 0) return null;

  const sortedMembers = [...members].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const gridClass = featured
    ? "faculty-grid"
    : title === "Mentor"
    ? "mentor-grid"
    : title === "Core Team" || id === "coreTeam"
    ? "core-grid"
    : "";

  return (
    <section className="team-section">
      <div className="section-title">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
          <h2>{title}</h2>
          {isHead && onMoveSection && (
            <div style={{ display: "inline-flex", gap: "4px", marginLeft: "4px" }}>
              <button
                type="button"
                disabled={!canMoveUp}
                onClick={() => onMoveSection(id, -1)}
                title="Move section heading up"
                style={{
                  background: canMoveUp ? "rgba(14, 165, 233, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  color: canMoveUp ? "#38bdf8" : "#475569",
                  border: "1px solid rgba(14, 165, 233, 0.3)",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  fontSize: "0.75rem",
                  cursor: canMoveUp ? "pointer" : "default",
                }}
              >
                ▲
              </button>
              <button
                type="button"
                disabled={!canMoveDown}
                onClick={() => onMoveSection(id, 1)}
                title="Move section heading down"
                style={{
                  background: canMoveDown ? "rgba(14, 165, 233, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  color: canMoveDown ? "#38bdf8" : "#475569",
                  border: "1px solid rgba(14, 165, 233, 0.3)",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  fontSize: "0.75rem",
                  cursor: canMoveDown ? "pointer" : "default",
                }}
              >
                ▼
              </button>
            </div>
          )}
        </div>
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
  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);
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

  // Reorder Headings Modal State
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [savingOrder, setSavingOrder] = useState(false);

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
      if (res.data?.sectionOrder && Array.isArray(res.data.sectionOrder) && res.data.sectionOrder.length > 0) {
        setSectionOrder(res.data.sectionOrder);
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

  // Compute the active effective order including any custom sections
  const getEffectiveSectionOrder = () => {
    const knownKeys = [
      "faculty",
      "mentor",
      "coreTeam",
      "technicalTeam",
      "nonTechnicalTeam",
      ...Object.keys(customSections || {}),
    ];

    const effective = [...sectionOrder];
    knownKeys.forEach((key) => {
      if (!effective.includes(key)) {
        effective.push(key);
      }
    });
    return effective;
  };

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

  // Inline Section Move (▲ / ▼)
  const handleMoveSection = async (id, direction) => {
    const activeOrder = getEffectiveSectionOrder();
    const currIdx = activeOrder.indexOf(id);
    if (currIdx < 0) return;
    const targetIdx = currIdx + direction;
    if (targetIdx < 0 || targetIdx >= activeOrder.length) return;

    const newOrder = [...activeOrder];
    const [moved] = newOrder.splice(currIdx, 1);
    newOrder.splice(targetIdx, 0, moved);

    setSectionOrder(newOrder);

    try {
      await API.put("/team/section-order", { order: newOrder });
      setMsg(`✓ Heading order updated!`);
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.warn("Could not persist section order:", err);
    }
  };

  // Heading Reorder Modal Controls
  const handleOpenOrderModal = () => {
    setOrderList(getEffectiveSectionOrder());
    setOrderModalOpen(true);
  };

  const handleMoveOrderItem = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= orderList.length) return;
    const nextList = [...orderList];
    const [moved] = nextList.splice(idx, 1);
    nextList.splice(targetIdx, 0, moved);
    setOrderList(nextList);
  };

  const handleSaveSectionOrder = async () => {
    try {
      setSavingOrder(true);
      await API.put("/team/section-order", { order: orderList });
      setSectionOrder(orderList);
      setOrderModalOpen(false);
      setMsg("✓ Section heading order saved successfully!");
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || "Failed to save heading order");
    } finally {
      setSavingOrder(false);
    }
  };

  // Build the list of sections to render in exact configured order
  const allSectionsMap = {
    faculty: {
      id: "faculty",
      title: "Faculty",
      members: teamData.faculty || [],
      featured: true,
    },
    mentor: {
      id: "mentor",
      title: "Mentor",
      members: teamData.mentor || [],
      featured: false,
    },
    coreTeam: {
      id: "coreTeam",
      title: "Core Team",
      members: teamData.coreTeam || [],
      featured: false,
    },
    technicalTeam: {
      id: "technicalTeam",
      title: "WEB dev team",
      members: teamData.technicalTeam || [],
      featured: false,
    },
    nonTechnicalTeam: {
      id: "nonTechnicalTeam",
      title: "Core Team",
      members: teamData.nonTechnicalTeam || [],
      featured: false,
    },
  };

  // Add any custom sections
  Object.entries(customSections || {}).forEach(([secTitle, secMembers]) => {
    allSectionsMap[secTitle] = {
      id: secTitle,
      title: secTitle,
      members: secMembers || [],
      featured: false,
    };
  });

  const effectiveOrder = getEffectiveSectionOrder();
  const sectionsToRender = effectiveOrder
    .map((id) => allSectionsMap[id])
    .filter((sec) => sec && sec.members && sec.members.length > 0);

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
              gap: "0.85rem",
              flexWrap: "wrap",
              justifyContent: "center",
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
            <button
              onClick={handleOpenOrderModal}
              title="Change heading and section display order"
              style={{
                background: "rgba(14, 165, 233, 0.25)",
                color: "#38bdf8",
                border: "1px solid rgba(14, 165, 233, 0.5)",
                borderRadius: "8px",
                padding: "6px 14px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              ↕️ Reorder Headings
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

      {/* Reorder Headings Modal */}
      {orderModalOpen && (
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
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              borderRadius: "16px",
              padding: "1.75rem",
              maxWidth: "520px",
              width: "100%",
              color: "#ffffff",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, color: "#38bdf8" }}>↕️ Place Heading Order</h3>
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              Use the <b>▲ Up</b> and <b>▼ Down</b> buttons to arrange the sections in your preferred sequence.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
              {orderList.map((secId, idx) => {
                const label = SECTION_DISPLAY_LABELS[secId] || secId;
                return (
                  <div
                    key={secId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      padding: "0.65rem 1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span
                        style={{
                          background: "#0284c7",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#f8fafc" }}>{label}</span>
                    </div>

                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveOrderItem(idx, -1)}
                        style={{
                          background: idx === 0 ? "rgba(255,255,255,0.05)" : "rgba(14, 165, 233, 0.2)",
                          color: idx === 0 ? "#475569" : "#38bdf8",
                          border: "1px solid rgba(14, 165, 233, 0.3)",
                          borderRadius: "6px",
                          padding: "3px 9px",
                          fontSize: "0.8rem",
                          cursor: idx === 0 ? "default" : "pointer",
                        }}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === orderList.length - 1}
                        onClick={() => handleMoveOrderItem(idx, 1)}
                        style={{
                          background: idx === orderList.length - 1 ? "rgba(255,255,255,0.05)" : "rgba(14, 165, 233, 0.2)",
                          color: idx === orderList.length - 1 ? "#475569" : "#38bdf8",
                          border: "1px solid rgba(14, 165, 233, 0.3)",
                          borderRadius: "6px",
                          padding: "3px 9px",
                          fontSize: "0.8rem",
                          cursor: idx === orderList.length - 1 ? "default" : "pointer",
                        }}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                disabled={savingOrder}
                onClick={handleSaveSectionOrder}
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
                {savingOrder ? "Saving Order..." : "Save Heading Order"}
              </button>
              <button
                type="button"
                onClick={() => setOrderList(DEFAULT_SECTION_ORDER)}
                style={{
                  padding: "0.75rem 1rem",
                  background: "transparent",
                  border: "1px solid #475569",
                  color: "#94a3b8",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Reset Default
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Status / Section *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setModalOpen(false);
                        handleOpenOrderModal();
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#38bdf8",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      ↕️ Reorder headings
                    </button>
                  </div>
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
          {sectionsToRender.map((sec, idx) => (
            <TeamSection
              key={sec.id}
              id={sec.id}
              title={sec.title}
              members={sec.members}
              featured={sec.featured}
              isHead={isHead}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteMember}
              canMoveUp={idx > 0}
              canMoveDown={idx < sectionsToRender.length - 1}
              onMoveSection={handleMoveSection}
            />
          ))}
        </>
      )}
    </main>
  );
}
