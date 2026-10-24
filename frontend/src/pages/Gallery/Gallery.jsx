import React, { useState, useEffect } from "react";
import "./Gallery.css";
import useAuth from "../../context/useAuth";
import API from "../../services/api";

const filters = ["All", "Events", "Workshops", "Competitions", "Projects"];

export default function Gallery() {
  const { isHead } = useAuth();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: "",
    subtitle: "",
    category: "Events",
    note: "",
    highlights: "",
    imageUrls: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchGalleries = async () => {
    try {
      const res = await API.get("/gallery");
      if (res.data?.data) {
        setGalleries(res.data.data);
      }
    } catch (err) {
      console.warn("Failed to load galleries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleAddAlbum = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMsg("");

      const payload = {
        title: newAlbum.title,
        subtitle: newAlbum.subtitle,
        category: newAlbum.category,
        note: newAlbum.note,
        highlights: newAlbum.highlights.split(",").map((h) => h.trim()).filter(Boolean),
        imageUrls: newAlbum.imageUrls.split(",").map((u) => u.trim()).filter(Boolean),
      };

      await API.post("/gallery", payload);
      setMsg("✓ Album created successfully!");
      setNewAlbum({
        title: "",
        subtitle: "",
        category: "Events",
        note: "",
        highlights: "",
        imageUrls: "",
      });
      setShowAddModal(false);
      await fetchGalleries();
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || "Failed to create album");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAlbum = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the album "${title}"?`)) return;
    try {
      await API.delete(`/gallery/${id}`);
      await fetchGalleries();
      setMsg(`✓ Deleted album "${title}"`);
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.message || "Failed to delete album");
    }
  };

  const getAlbumImages = (item) => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images;
    }
    if (item.folder) {
      return ["/gallery/" + item.folder + "/1.png"];
    }
    return ["/images/cad-workshop.jpg"];
  };

  const sections =
    filter === "All"
      ? galleries
      : galleries.filter((item) => item.category === filter);

  return (
    <main className="gallery-page">
      <header className="gallery-header">
        <span className="gallery-eyebrow">
          AVIATION CLUB • NIT RAIPUR
        </span>

        <h1>
          Moments That <strong>Made Us Fly</strong>
        </h1>

        <div className="gallery-line" />

        <p>
          Explore the workshops, competitions and engineering projects
          <br />
          that shaped the Aviation Club journey.
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
              ➕ Add Gallery Album
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

      {/* Modal for Creating New Album */}
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
              maxWidth: "520px",
              width: "100%",
              color: "#ffffff",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#facc15" }}>Create Gallery Album</h3>
            <form onSubmit={handleAddAlbum} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Album Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drone Precision Landing 2026"
                  value={newAlbum.title}
                  onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Subtitle (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Autonomous Challenge"
                  value={newAlbum.subtitle}
                  onChange={(e) => setNewAlbum({ ...newAlbum, subtitle: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Category</label>
                <select
                  value={newAlbum.category}
                  onChange={(e) => setNewAlbum({ ...newAlbum, category: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                >
                  <option value="Events">Events</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Competitions">Competitions</option>
                  <option value="Projects">Projects</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Description / Summary Note</label>
                <textarea
                  rows="3"
                  placeholder="Overview of the event, activities, and achievements..."
                  value={newAlbum.note}
                  onChange={(e) => setNewAlbum({ ...newAlbum, note: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem", fontFamily: "inherit" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Highlights (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Drone Piloting, Obstacle Course, Precision Landing"
                  value={newAlbum.highlights}
                  onChange={(e) => setNewAlbum({ ...newAlbum, highlights: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Image URLs (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. https://res.cloudinary.com/.../img1.jpg, https://..."
                  value={newAlbum.imageUrls}
                  onChange={(e) => setNewAlbum({ ...newAlbum, imageUrls: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", background: "#1e293b", border: "1px solid #334155", color: "#fff", marginTop: "0.25rem" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ flex: 1, padding: "0.75rem", background: "#0284c7", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}
                >
                  {submitting ? "Publishing..." : "Publish Album"}
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

      <div className="gallery-filters">
        {filters.map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#94a3b8" }}>
          Loading club moments...
        </div>
      ) : (
        <section className="gallery-grid">
          {sections.map((item) => {
            const images = getAlbumImages(item);

            return (
              <article className="gallery-card" key={item._id || item.folder || item.title}>
                <div className="gallery-cover">
                  <img
                    src={images[0]}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1517976487507-5b39e0d12f7c?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <span>{item.category}</span>
                  <b>{images.length} Photos</b>
                </div>

                <div className="gallery-card-content">
                  <h2>{item.title}</h2>

                  {item.subtitle && <h3>{item.subtitle}</h3>}

                  <p>{item.note || item.description}</p>

                  {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                    <div className="gallery-highlights">
                      {item.highlights.slice(0, 4).map((highlight) => (
                        <span key={highlight}>{highlight}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", alignItems: "center" }}>
                    <button
                      className="view-gallery"
                      style={{ flex: 1 }}
                      onClick={() => setSelected({ ...item, images })}
                    >
                      Explore Gallery <span>→</span>
                    </button>

                    {isHead && item._id && (
                      <button
                        onClick={() => handleDeleteAlbum(item._id, item.title)}
                        style={{
                          background: "rgba(239, 68, 68, 0.2)",
                          color: "#fca5a5",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                        title="Delete this album"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {selected && (
        <div
          className="gallery-modal"
          onClick={() => setSelected(null)}
        >
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-gallery"
              onClick={() => setSelected(null)}
              aria-label="Close gallery"
            >
              ×
            </button>

            <div className="modal-heading">
              <span>{selected.category}</span>

              <h2>{selected.title}</h2>

              {selected.subtitle && <h3>{selected.subtitle}</h3>}

              <p>{selected.note || selected.description}</p>

              {Array.isArray(selected.highlights) && selected.highlights.length > 0 && (
                <>
                  <h4>What We Explored</h4>
                  <div className="gallery-highlights">
                    {selected.highlights.map((highlight) => (
                      <span key={highlight}>{highlight}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="modal-images">
              {getAlbumImages(selected).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${selected.title} ${index + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1517976487507-5b39e0d12f7c?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
