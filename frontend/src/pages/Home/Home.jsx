import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import API from "../../services/api";
import "./Home.css";

import facPhoto from "../../assets/fac.jpg";
import aviationLogo from "../../assets/aviation-logo.png";
import nitrrLogo from "../../assets/nitrr-logo.png";
import airplaneVideo from "../../assets/aeroplane.mp4";

// ===================== DEFAULT NOTICE BOARD DATA =====================

const defaultNotificationsData = [
  {
    _id: "notice-1",
    date: "04 Apr 2026",
    title: "Blitz Competition results announced",
    summary:
      "21 participants completed a three-hour CAD-FEA-CFD design sprint, earning a 100% 4-star-or-above feedback score.",
    extraText:
      " The judges were highly impressed by the rapid prototyping skills and simulated aerodynamics demonstrated under pressure.",
  },
  {
    _id: "notice-2",
    date: "08 Feb 2026",
    title: "UAV Racing Competition: Team Garud wins",
    summary:
      "Team Garud topped the leaderboard on technical documentation and flight performance; Lakshmi Sahithi named Best Mentor.",
    extraText:
      " The final race came down to a nail-biting finish, with Team Garud securing the win by mere milliseconds.",
  },
  {
    _id: "notice-3",
    date: "07 Feb 2026",
    title: "Deliver the Pizza (DTP): Team MACHX6 wins",
    summary:
      "MACHX6 built and flew the strongest quadcopter across four competing teams in this two-phase UAV challenge.",
    extraText:
      " Their custom payload dropping mechanism was incredibly precise, hitting the target perfectly during the final phase.",
  },
  {
    _id: "notice-4",
    date: "31 Jan – 01 Feb 2026",
    title: "Two-day Aerodynamics Workshop concludes",
    summary:
      "95 participants covered flight principles, drone systems and a live air show with industry expert Dr. Aruna Rana.",
    extraText:
      " Students also got hands-on experience calibrating flight controllers and troubleshooting basic motor synchronization.",
  },
  {
    _id: "notice-5",
    date: "08 Nov 2025",
    title: "DIMENSIONS CAD Workshop & Competition held",
    summary:
      "75 participants trained in Creo Parametric before competing across beginner and expert design categories.",
    extraText:
      " The winning designs have been sent to the 3D printing lab to be featured in the upcoming club showcase.",
  },
  {
    _id: "notice-6",
    date: "08 Oct 2025",
    title: "Air Force Day celebrated at Hira Hall",
    summary:
      "50 participants joined an aviation quiz, RC plane landing and parachute landing challenge with Dr. N. V. Swamy Naidu.",
    extraText:
      " The event concluded with an inspiring speech about the future of aerospace engineering in India.",
  },
];

// ===================== DEFAULT CLUB HISTORY =====================

const defaultMilestones = [
  {
    icon: "✈",
    date: "8 October 2025",
    title: "Air Force Day",
    desc: "Aviation quiz, RC plane landing and parachute landing challenges honoring the Indian Air Force, with 50 participants at Hira Hall.",
  },
  {
    icon: "◧",
    date: "8 November 2025",
    title: "DIMENSIONS: CAD Workshop & Competition",
    desc: "Creo Parametric training followed by a two-tier CAD design competition for 75 beginner and expert participants.",
  },
  {
    icon: "〜",
    date: "31 Jan – 1 Feb 2026",
    title: "Aerodynamics Workshop",
    desc: "Two-day session on flight principles and drone systems with glider-building and a live air show, for 95 participants.",
  },
  {
    icon: "◆",
    date: "7 February 2026",
    title: "Deliver the Pizza (DTP)",
    desc: "Drone design and assembly competition across four teams; Team MACHX6 won, Team Garud finished as runner-up.",
  },
  {
    icon: "🏁",
    date: "8 February 2026",
    title: "UAV Racing Competition",
    desc: "End-to-end UAV design, FEA/CFD analysis and a live racing round; Team Garud took first place, MACHX6 second.",
  },
  {
    icon: "⚡",
    date: "4 April 2026",
    title: "Blitz Competition",
    desc: "A three-hour, individual CAD-FEA-CFD sprint testing 21 participants on design, analysis and optimization speed.",
  },
];

// ===================== NOTICE CARD =====================

function NoticeCard({ notice, isHead, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="notice"
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "22px", flex: 1, minWidth: "260px" }}>
        <div className="notice-date">
          <span aria-hidden="true">📌</span> {notice.date}
        </div>
        <div className="notice-body">
          <h3>{notice.title}</h3>
          <p>
            {notice.summary}
            {isExpanded && notice.extraText && <span className="extra-text">{notice.extraText}</span>}
          </p>
        </div>
      </div>

      {isHead && (
        <div
          style={{ display: "flex", gap: "8px", flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(notice)}
            style={{
              background: "#0284c7",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(notice)}
            style={{
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ===================== HOME COMPONENT =====================

export default function Home() {
  const { isHead } = useAuth();

  // Modals & Navigation state
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Dynamic Data States
  const [notifications, setNotifications] = useState(defaultNotificationsData);
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [timelineItems, setTimelineItems] = useState(defaultMilestones);
  const [faculty, setFaculty] = useState(null);
  const [stats, setStats] = useState({
    projectsCount: 2,
    eventsCount: 7,
    membersCount: 21,
    feedbackScore: "98%",
  });

  // Notice Admin CRUD state
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [noticeForm, setNoticeForm] = useState({
    date: "",
    title: "",
    summary: "",
    extraText: "",
  });
  const [noticeMsg, setNoticeMsg] = useState("");
  const [submittingNotice, setSubmittingNotice] = useState(false);

  // Fetch dynamic notices from backend
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get("/notifications");
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setNotifications(res.data.data);
      }
    } catch {
      // Keep initial default notifications if server unreachable
    }
  }, []);

  // Fetch dynamic highlights: Events, Projects, Faculty
  const fetchHighlights = useCallback(async () => {
    try {
      // 1. Fetch Events
      const evRes = await API.get("/events");
      if (evRes.data?.data && Array.isArray(evRes.data.data)) {
        const allEvents = evRes.data.data;
        const upcoming = allEvents.find((e) => e.isUpcoming);
        if (upcoming) setUpcomingEvent(upcoming);

        // Map past events to timeline milestones if available
        const pastEvents = allEvents.filter((e) => !e.isUpcoming);
        if (pastEvents.length > 0) {
          const iconList = ["✈", "◧", "〜", "◆", "🏁", "⚡"];
          const dynamicMilestones = pastEvents.map((e, idx) => ({
            icon: iconList[idx % iconList.length],
            date: e.date,
            title: e.title,
            desc: e.description?.slice(0, 160) + (e.description?.length > 160 ? "..." : ""),
          }));
          setTimelineItems(dynamicMilestones);
        }

        setStats((prev) => ({
          ...prev,
          eventsCount: allEvents.length || prev.eventsCount,
        }));
      }
    } catch {
      // Silently keep fallbacks
    }

    try {
      // 2. Fetch Projects Count
      const projRes = await API.get("/projects");
      if (projRes.data?.data && Array.isArray(projRes.data.data)) {
        setStats((prev) => ({
          ...prev,
          projectsCount: projRes.data.data.length || prev.projectsCount,
        }));
      }
    } catch {
      // Silently keep fallbacks
    }

    try {
      // 3. Fetch Faculty Member from Team backend
      const teamRes = await API.get("/team");
      if (teamRes.data?.data) {
        const teamData = teamRes.data.data;
        if (teamData.faculty && teamData.faculty.length > 0) {
          setFaculty(teamData.faculty[0]);
        }
        // Count total members across all sections
        const totalMembers = Object.values(teamData).reduce(
          (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
          0
        );
        if (totalMembers > 0) {
          setStats((prev) => ({
            ...prev,
            membersCount: totalMembers,
          }));
        }
      }
    } catch {
      // Silently keep fallbacks
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchHighlights();
  }, [fetchNotifications, fetchHighlights]);

  // Notice Admin CRUD Handlers
  const openAddNoticeModal = () => {
    setEditingNoticeId(null);
    setNoticeForm({
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      title: "",
      summary: "",
      extraText: "",
    });
    setShowNoticeModal(true);
  };

  const openEditNoticeModal = (notice) => {
    setEditingNoticeId(notice._id);
    setNoticeForm({
      date: notice.date || "",
      title: notice.title || "",
      summary: notice.summary || "",
      extraText: notice.extraText || "",
    });
    setShowNoticeModal(true);
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingNotice(true);
      setNoticeMsg("");

      const payload = {
        date: noticeForm.date.trim(),
        title: noticeForm.title.trim(),
        summary: noticeForm.summary.trim(),
        extraText: noticeForm.extraText.trim(),
      };

      if (editingNoticeId) {
        await API.put(`/notifications/${editingNoticeId}`, payload);
        setNoticeMsg("✓ Notice updated successfully!");
      } else {
        await API.post("/notifications", payload);
        setNoticeMsg("✓ Notice published to Notice Board!");
      }

      setShowNoticeModal(false);
      await fetchNotifications();
      setTimeout(() => setNoticeMsg(""), 4000);
    } catch (err) {
      setNoticeMsg(err.response?.data?.message || err.message || "Failed to save notice");
    } finally {
      setSubmittingNotice(false);
    }
  };

  const handleDeleteNotice = async (notice) => {
    if (!window.confirm(`Delete notice: "${notice.title}"?`)) return;

    try {
      await API.delete(`/notifications/${notice._id}`);
      setNoticeMsg(`✓ Notice "${notice.title}" deleted.`);
      await fetchNotifications();
      setTimeout(() => setNoticeMsg(""), 3000);
    } catch (err) {
      setNoticeMsg(err.response?.data?.message || err.message || "Failed to delete notice");
    }
  };

  // Scroll reveal setup
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    let revealObserver;

    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );

      revealEls.forEach((el) => {
        revealObserver.observe(el);
      });
    } else {
      revealEls.forEach((el) => {
        el.classList.add("in-view");
      });
    }

    const anchorEls = document.querySelectorAll('a[href^="#"]');
    const handleAnchorClick = function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    anchorEls.forEach((anchor) => {
      anchor.addEventListener("click", handleAnchorClick);
    });

    return () => {
      revealObserver?.disconnect();
      anchorEls.forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick);
      });
    };
  }, [timelineItems, notifications]);

  return (
    <div className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero" id="hero" aria-label="Introduction">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={airplaneVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay" aria-hidden="true"></div>

        <div className="hero-content reveal fade-up">
          <div className="hero-logos">
            <img src={aviationLogo} alt="Aviation Club" className="hero-logo-img" />
            <div className="logo-divider"></div>
            <img src={nitrrLogo} alt="NIT Raipur" className="hero-logo-img" />
          </div>

          <p className="eyebrow">Dream &bull; Design &bull; Fly</p>

          <h1>
            Aviation Club
            <span>National Institute of Technology Raipur</span>
          </h1>

          <p className="hero-sub">
            From glider builds and CAD workshops to STOL and VTOL
            aircraft development, the Aviation Club turns aerodynamic
            theory into flight-tested engineering — one competition,
            one prototype at a time.
          </p>

          <div className="hero-buttons">
            <a href="#about" className="btn btn-primary">
              Explore Club
            </a>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowJoinModal(true)}
            >
              Join Us
            </button>
          </div>

          {/* DYNAMIC UPCOMING EVENT ALERT BADGE */}
          {upcomingEvent && (
            <div className="hero-live-badge-container">
              <span className="live-pulse"></span>
              <span>
                🚀 LIVE FLAGSHIP: <strong>{upcomingEvent.title}</strong> ({upcomingEvent.date})
              </span>
              <Link to="/events" className="hero-live-link">
                View Event Details &rarr;
              </Link>
            </div>
          )}

          {/* Join Us Popup Modal */}
          {showJoinModal && (
            <div className="modal-backdrop" onClick={() => setShowJoinModal(false)}>
              <div className="join-modal-card" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowJoinModal(false)}
                >
                  &times;
                </button>
                
                <h3>Join the Aviation Club</h3>
                <p>Choose your platform to connect and stay updated with our latest events and projects:</p>
                
                <div className="join-modal-options">
                  <a
                    href="https://www.instagram.com/aviation_nitrr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary join-option-btn"
                  >
                    📷 Instagram
                  </a>
                  <a
                    href="https://www.linkedin.com/company/aviation-nitrr/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary join-option-btn"
                  >
                    💼 LinkedIn
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <a href="#about" className="scroll-cue" aria-label="Scroll to About section">
          <span></span>
        </a>
      </section>

      {/* =====================================================
          DYNAMIC CLUB METRICS STRIP
      ===================================================== */}

      <section className="home-stats-strip" aria-label="Club Statistics">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.projectsCount}+</div>
              <div className="stat-label">Aircraft R&amp;D Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.eventsCount}+</div>
              <div className="stat-label">Workshops &amp; Competitions</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.membersCount}+</div>
              <div className="stat-label">Engineers &amp; Innovators</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.feedbackScore}</div>
              <div className="stat-label">Positive Feedback Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section className="about" id="about" aria-labelledby="about-heading">
        <div className="container about-grid">
          <div className="about-image reveal fade-left">
            <img
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop"
              alt="Aviation Club members working on a UAV assembly"
              loading="lazy"
            />
          </div>

          <div className="about-content reveal fade-right">
            <p className="eyebrow">About the Club</p>
            <h2 id="about-heading">
              Engineering flight, one prototype at a time
            </h2>

            <p>
              The Aviation Club of NIT Raipur brings together students
              who want to move beyond theory and build things that
              actually fly. Through the academic year, the club runs
              workshops on aerodynamics and CAD, organizes UAV and drone
              competitions, and drives original aircraft projects from
              concept to flight test.
            </p>

            <p>
              Every activity — from the Air Force Day quiz and RC plane
              landings to the STOL and VTOL development projects —
              bridges classroom aerodynamics with practical engineering:
              precision, innovation and critical thinking applied to
              real aircraft.
            </p>

            <ul className="about-list">
              <li>
                <strong>Innovation:</strong> Original STOL and VTOL
                aircraft projects, from literature review to flight test.
              </li>
              <li>
                <strong>UAV &amp; Drones:</strong> Full-cycle quadcopter
                design, assembly and racing competitions.
              </li>
              <li>
                <strong>Aeromodelling:</strong> Glider builds, RC plane
                landings and parachute-landing challenges.
              </li>
              <li>
                <strong>Workshops:</strong> CAD (Creo Parametric),
                aerodynamics fundamentals, and simulation tools like
                OpenVSP, FEA and CFD.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =====================================================
          CLUB HISTORY (DYNAMIC FROM EVENTS)
      ===================================================== */}

      <section className="history" id="history" aria-labelledby="history-heading">
        <div className="container">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Club History &amp; Milestones</p>
            <h2 id="history-heading">The route so far</h2>
          </div>

          <ol className="timeline">
            {timelineItems.map((item, index) => (
              <li
                key={index}
                className={`timeline-item reveal ${index % 2 === 0 ? "fade-right" : "fade-left"}`}
              >
                <div className="timeline-dot" aria-hidden="true">
                  {item.icon || "✈"}
                </div>
                <div className="timeline-card">
                  <span className="timeline-date">{item.date}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =====================================================
          FACULTY (DYNAMIC FROM TEAM BACKEND)
      ===================================================== */}

      <section className="faculty" aria-labelledby="faculty-heading">
        <div className="container">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Faculty In-Charge</p>
            <h2 id="faculty-heading">Guided by Experience</h2>
          </div>

          <div className="faculty-card reveal fade-up">
            <div className="faculty-photo">
              <img
                src={faculty?.image || facPhoto}
                alt={faculty?.name || "Dr. N. V. Swamy Naidu"}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = facPhoto;
                }}
              />
            </div>

            <div className="faculty-info">
              <h3>{faculty?.name || "Dr. N. V. Swamy Naidu"}</h3>
              <p className="faculty-role">
                {faculty?.role || "Head of Department, Mechanical Engineering"}
              </p>
              <p className="faculty-org">
                {faculty?.branch
                  ? `${faculty.branch}, National Institute of Technology Raipur`
                  : "National Institute of Technology Raipur"}
              </p>
              <p className="faculty-msg">
                As Chief Guest for Air Force Day and lead speaker at the
                Aerodynamics Workshop, Dr. Naidu has consistently
                encouraged students to combine strong engineering
                fundamentals with practical experimentation. His
                guidance inspires students to innovate, collaborate,
                and transform ideas into successful aviation projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          NOTIFICATIONS / NOTICE BOARD (DYNAMIC BACKEND CRUD)
      ===================================================== */}

      <section className="notifications" id="notifications" aria-labelledby="notifications-heading">
        <div className="container container-narrow">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Notice Board</p>
            <h2 id="notifications-heading">Recent Notifications</h2>
          </div>

          {/* Head Editing Controls Banner */}
          {isHead && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(234, 179, 8, 0.12)",
                border: "1px solid rgba(234, 179, 8, 0.35)",
                padding: "14px 20px",
                borderRadius: "12px",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <span style={{ color: "#facc15", fontWeight: 700, fontSize: "0.95rem" }}>
                  👑 Head Edit Mode Active
                </span>
                <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                  You have admin permissions to publish, update, and remove notices.
                </p>
              </div>
              <button
                onClick={openAddNoticeModal}
                style={{
                  background: "#ca8a04",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 18px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                ➕ Add New Notice
              </button>
            </div>
          )}

          {noticeMsg && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 18px",
                borderRadius: "8px",
                background: noticeMsg.startsWith("✓")
                  ? "rgba(74, 222, 128, 0.15)"
                  : "rgba(248, 113, 113, 0.15)",
                border: `1px solid ${noticeMsg.startsWith("✓") ? "#4ade80" : "#f87171"}`,
                color: noticeMsg.startsWith("✓") ? "#4ade80" : "#f87171",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              {noticeMsg}
            </div>
          )}

          <div className="notice-board reveal fade-up">
            {notifications.map((notice) => (
              <NoticeCard
                key={notice._id || notice.id}
                notice={notice}
                isHead={isHead}
                onEdit={openEditNoticeModal}
                onDelete={handleDeleteNotice}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          HEAD NOTICE MODAL: CREATE / EDIT
      ===================================================== */}
      {showNoticeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowNoticeModal(false)}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "580px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.3rem", color: "#f8fafc" }}>
                {editingNoticeId ? "✏️ Edit Notice" : "➕ Publish New Notice"}
              </h3>
              <button
                type="button"
                onClick={() => setShowNoticeModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNoticeSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "4px" }}>
                  Notice Date *
                </label>
                <input
                  type="text"
                  required
                  value={noticeForm.date}
                  onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                  placeholder="e.g. 04 Apr 2026"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "4px" }}>
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="e.g. Blitz Competition results announced"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#ffffff",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "4px" }}>
                  Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  value={noticeForm.summary}
                  onChange={(e) => setNoticeForm({ ...noticeForm, summary: e.target.value })}
                  placeholder="Short overview displayed in the notice card..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#ffffff",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "4px" }}>
                  Extra Details (Expanded on Click)
                </label>
                <textarea
                  rows={3}
                  value={noticeForm.extraText}
                  onChange={(e) => setNoticeForm({ ...noticeForm, extraText: e.target.value })}
                  placeholder="Additional context revealed when a visitor clicks the notice card..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#ffffff",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  style={{
                    padding: "10px 18px",
                    background: "#334155",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingNotice}
                  style={{
                    padding: "10px 24px",
                    background: "#38bdf8",
                    color: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 700,
                    cursor: "pointer",
                    opacity: submittingNotice ? 0.7 : 1,
                  }}
                >
                  {submittingNotice
                    ? "Saving..."
                    : editingNoticeId
                    ? "Update Notice"
                    : "Publish Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
