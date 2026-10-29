import React, { useState, useEffect } from "react";
import "./Results.css";
import useAuth from "../../context/useAuth";
import API from "../../services/api";

const DEFAULT_RESULTS = [
  {
    event: "Blitz Competition",
    year: "2026",
    date: "4 April 2026",
    venue: "S-11, Academic Building, NIT Raipur",
    duration: "2:00 PM – 6:00 PM",
    position: "Competition Highlights",
    team: "21 Participants",
    category: "CAD, FEA and CFD",
    description:
      "An individual, time-bound technical competition focused on completing an engineering design, analysis, and optimisation workflow.",
    purpose:
      "To bridge the gap between theoretical knowledge and engineering practice while improving proficiency in CAD, FEA, CFD, and time-bound problem-solving.",
    speakers: [],
    activities: [
      "Individual participation.",
      "An on-the-spot problem statement.",
      "Three hours to complete the assigned task.",
      "Evaluation based on design quality, analytical accuracy, optimisation, overall model performance, and speed of completion.",
    ],
    outcomes: [
      "Enhanced practical skills in CAD, FEA, and CFD.",
      "Improved end-to-end design, analysis, and optimisation abilities.",
      "Strengthened problem-solving and analytical thinking under time constraints.",
      "Improved understanding of engineering workflows.",
      "Developed time management and decision-making skills.",
      "Provided exposure to competitive, industry-relevant technical challenges.",
    ],
    feedback: "72.2% rated the event 5 stars and 27.8% rated it 4 stars.",
  },
  {
    event: "UAV Racing Competition",
    year: "2026",
    date: "8 February 2026",
    venue: "Football Ground, NIT Raipur",
    duration: "10:00 AM – 5:30 PM",
    position: "🥇 Winner: Team Garud | 🥈 Runner-up: Team MACHX6",
    team: "4 Teams · 24 Members",
    category: "UAV Design, Analysis and Flight Testing",
    description:
      "A team-based UAV competition combining aircraft design, aerodynamic analysis, fabrication, technical documentation, and real-world flight testing.",
    purpose:
      "To provide end-to-end experience in UAV engineering and encourage students to apply aerodynamics, FEA, and CFD in practical design and testing.",
    speakers: [
      "Results announced by Honumant Nethani, Overall Coordinator, Aviation Club",
    ],
    activities: [
      "Four teams: MACHX6, Aeroverse, Garud, and Vayuveg.",
      "Preparation and mentoring in aerodynamics, FEA, and CFD.",
      "Aerodynamic calculations, technical reports, bills of materials, and presentations.",
      "Aircraft manufacturing and assembly using the college Makerspace.",
      "Technical inspection followed by UAV racing.",
      "Evaluation based on technical report quality, presentation, and flight performance.",
    ],
    outcomes: [
      "Team Garud secured first place.",
      "Team MACHX6 secured second place.",
      "Lakshmi Sahithi received the Best Mentor award.",
      "Individual excellence awards went to Ravi (Aeroverse), Joshnavi (Vayuveg), Ajay (Garud), and Anmol (MACHX6), as nominated by their mentors.",
      "Participants gained hands-on experience in UAV design, aerodynamics, and flight testing.",
      "Improved understanding of Finite Element Analysis (FEA) and Computational Fluid Dynamics (CFD).",
      "Strengthened teamwork, project management, problem-solving, and technical competence.",
    ],
    feedback: "50% rated the event 5 stars, 40% rated it 4 stars, and 10% rated it 3 stars.",
  },
  {
    event: "Deliver the Pizza (DTP)",
    year: "2026",
    date: "7 February 2026",
    venue: "Football Ground, NIT Raipur",
    duration: "10:00 AM – 5:30 PM",
    position: "🥇 Winner: Team MACHX6 | 🥈 Runner-up: Team Garud",
    team: "4 Teams · 24 Members",
    category: "UAV Design and Drone Competition",
    description:
      "A drone-based competition designed to provide hands-on experience in UAV design, quadcopter assembly, flight operations, and practical engineering.",
    purpose:
      "To bridge theoretical knowledge and real-world UAV applications while developing drone assembly, operation, teamwork, and decision-making skills.",
    speakers: [],
    activities: [
      "Four participating teams: MACHX6, Aeroverse, Garud, and Vayuveg.",
      "First phase: technical reports and presentations covering drone design, components, working mechanisms, and delivery strategy.",
      "Teams Garud and MACHX6 qualified for the final phase.",
      "Finalists assembled quadcopters from scratch using frames, brushless motors, propellers, ESCs, flight controllers, and power systems.",
      "Flight trials evaluated stable take-off, controlled manoeuvring, and overall flight performance.",
    ],
    outcomes: [
      "Team MACHX6 secured first place.",
      "Team Garud secured the runner-up position.",
      "Participants gained practical experience assembling and operating quadcopters.",
      "Improved understanding of motors, ESCs, flight controllers, and power systems.",
      "Applied aerodynamics, control systems, and electronics in a practical setting.",
      "Developed teamwork, troubleshooting, time management, and technical thinking.",
    ],
    feedback: "54.5% rated the event 5 stars, 22.7% rated it 4 stars, 13.6% rated it 3 stars, and 9.1% rated it 2 stars.",
  },
  {
    event: "Aerodynamics Workshop",
    year: "2026",
    date: "31 January – 1 February 2026",
    venue: "S-11, Academic Building, NIT Raipur",
    duration: "10:00 AM – 5:30 PM",
    position: "Workshop Highlights",
    team: "95 Participants",
    category: "Aerodynamics and UAV Technology",
    description:
      "A two-day workshop introducing fundamental aerodynamics, flight principles, gliders, drones, and modern aviation technologies.",
    purpose:
      "To build foundational knowledge of aerodynamics, explain real-world aircraft and drone systems, and encourage practical learning through expert sessions and demonstrations.",
    speakers: [
      "Dr. N. V. Swamy Naidu, HOD, Mechanical Department, NIT Raipur",
      "Dr. Aruna Rana, Drone Technology Expert, Researcher, and former NCC Officer with over four decades of experience in aeromodelling and UAV systems",
      "Honumant Nethani, Overall Lead, Aviation Club, NIT Raipur",
    ],
    activities: [
      "Sessions on the principles of flight and aircraft take-off.",
      "Explanation of lift, drag, thrust, weight, and aircraft components.",
      "Hands-on glider-making activity followed by a friendly competition.",
      "Expert session on drone components and flight controllers.",
      "Air show featuring drones, gliders, and RC planes.",
    ],
    outcomes: [
      "Improved understanding of modern flight technologies.",
      "Connected theoretical aerodynamics concepts with practical applications.",
      "Encouraged exploration of aerodynamics and unmanned aerial systems.",
      "Provided practical exposure through glider-making and live demonstrations.",
    ],
    feedback: "52.5% rated the event 5 stars, 41.3% rated it 4 stars, 2.5% rated it 3 stars, 2.5% rated it 2 stars, and 1.3% rated it 1 star.",
  },
  {
    event: "DIMENSIONS – CAD Workshop & Competition",
    year: "2025",
    date: "8 November 2025",
    venue: "S-11, Academic Building, NIT Raipur",
    duration: "2:00 PM – 5:30 PM",
    position: "Workshop & Competition Highlights",
    team: "75 Participants",
    category: "CAD and Engineering Design",
    description:
      "A hands-on Computer-Aided Design workshop and competition introducing students to Creo Parametric, 3D modelling, and engineering design.",
    purpose:
      "To introduce students to CAD and develop design, modelling, creativity, and problem-solving skills through guided learning and competitive application.",
    speakers: ["Aniket Singh, 3rd Year, Mechanical Department, NIT Raipur"],
    activities: [
      "Introduction to CAD using Creo Parametric.",
      "Demonstration of fundamental 3D modelling techniques.",
      "Beginner category with one design round.",
      "Expert category with two rounds testing modelling efficiency, creativity, and problem-solving.",
      "Evaluation based on understanding, accuracy, complexity, optimisation, and innovation.",
    ],
    outcomes: [
      "Introduced participants to CAD using Creo Parametric.",
      "Helped beginners learn sketching, constraints, and basic 3D modelling.",
      "Helped experienced participants improve parametric design and modelling practices.",
      "Developed problem-solving abilities and spatial visualisation.",
      "Provided exposure to real-world engineering design workflows.",
      "Supported portfolio building and future job readiness.",
      "Improved confidence, time management, and technical competence.",
    ],
    feedback: "49.1% rated the event 5 stars, 47.2% rated it 4 stars, 2.1% rated it 3 stars, and 1.6% rated it 1 star.",
  },
  {
    event: "Air Force Day",
    year: "2025",
    date: "8 October 2025",
    venue: "Hira Hall, NIT Raipur",
    duration: "10:00 AM – 6:00 PM",
    position: "Event Highlights",
    team: "50 Participants",
    category: "Aviation Awareness",
    description:
      "An Air Force Day celebration combining aviation knowledge, a quiz, RC plane landing, and a parachute landing challenge.",
    purpose:
      "To celebrate Air Force Day, highlight the legacy of the Indian Air Force, increase awareness of aviation technology and history, and provide hands-on learning experiences.",
    speakers: ["Dr. N. V. Swamy Naidu, HOD, Mechanical Department, NIT Raipur"],
    activities: [
      "Presentation on aviation and the Indian Air Force.",
      "Quiz competition on aviation technology and Air Force history.",
      "RC Plane Landing Competition focusing on precision, control, and aerodynamic principles.",
      "Parachute Landing Challenge demonstrating stability, drag, and landing accuracy.",
    ],
    outcomes: [
      "Enhanced participants' knowledge of aviation and defence concepts.",
      "Promoted hands-on learning through practical competitions.",
      "Encouraged innovation and critical thinking.",
      "Developed teamwork and collaboration skills.",
      "Inspired students through the address by Dr. N. V. Swamy Naidu.",
      "Increased interest in aviation and club activities.",
    ],
    feedback: "63.2% rated the event 5 stars, 26.3% rated it 4 stars, and 10.5% rated it 3 stars.",
  },
];

const sortResultsByLatest = (list) => {
  return [...list].sort((a, b) => {
    const yearA = parseInt(a.year, 10) || 0;
    const yearB = parseInt(b.year, 10) || 0;
    if (yearB !== yearA) return yearB - yearA;

    const parseDate = (d) => {
      if (!d) return 0;
      const clean = d.includes("–")
        ? d.split("–")[1].trim()
        : d.includes("-")
        ? d.split("-")[1].trim()
        : d.trim();
      const ts = Date.parse(clean);
      return isNaN(ts) ? 0 : ts;
    };

    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    if (dateA && dateB && dateB !== dateA) return dateB - dateA;

    if (b.createdAt && a.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });
};

const initialFormState = {
  event: "",
  category: "Club Achievement",
  year: new Date().getFullYear().toString(),
  date: "",
  venue: "",
  duration: "",
  position: "Event Highlights",
  team: "Aviation Club",
  description: "",
  purpose: "",
  speakers: "",
  activities: "",
  outcomes: "",
  feedback: "",
};

function Results() {
  const { isHead } = useAuth();

  const [results, setResults] = useState(() => sortResultsByLatest(DEFAULT_RESULTS));
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectedEventName, setSelectedEventName] = useState(() =>
    new URLSearchParams(window.location.search).get("event")
  );

  const fetchResults = async () => {
    try {
      const response = await API.get("/results");
      const apiResults = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setResults(sortResultsByLatest(apiResults));
    } catch (error) {
      console.warn("Could not load results from API, using defaults:", error);
      setResults(sortResultsByLatest(DEFAULT_RESULTS));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Sync browser Back/Forward navigation with selected event
  useEffect(() => {
    const handlePopState = () => {
      setSelectedEventName(
        new URLSearchParams(window.location.search).get("event")
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openResultDetails = (eventName) => {
    const url = new URL(window.location.href);
    url.searchParams.set("event", eventName);
    window.history.pushState({}, "", url);
    setSelectedEventName(eventName);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const backToResults = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("event");
    window.history.pushState({}, "", url);
    setSelectedEventName(null);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const openAddModal = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setShowFormModal(true);
  };

  const openEditModal = (result) => {
    setFormData({
      event: result.event || "",
      category: result.category || "Club Achievement",
      year: result.year ? String(result.year) : new Date().getFullYear().toString(),
      date: result.date || "",
      venue: result.venue || "",
      duration: result.duration || "",
      position: result.position || "",
      team: result.team || "",
      description: result.description || "",
      purpose: result.purpose || "",
      speakers: Array.isArray(result.speakers)
        ? result.speakers.join("\n")
        : result.speakers || "",
      activities: Array.isArray(result.activities)
        ? result.activities.join("\n")
        : result.activities || "",
      outcomes: Array.isArray(result.outcomes)
        ? result.outcomes.join("\n")
        : result.outcomes || "",
      feedback: result.feedback || "",
    });
    setEditingId(result._id || null);
    setShowFormModal(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");

    try {
      const payload = {
        ...formData,
        speakers: formData.speakers
          ? formData.speakers.split("\n").map((s) => s.trim()).filter(Boolean)
          : [],
        activities: formData.activities
          ? formData.activities.split("\n").map((s) => s.trim()).filter(Boolean)
          : [],
        outcomes: formData.outcomes
          ? formData.outcomes.split("\n").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (editingId) {
        await API.put(`/results/${editingId}`, payload);
        setMsg(`✓ Updated "${formData.event}" successfully!`);
      } else {
        await API.post("/results", payload);
        setMsg(`✓ Published "${formData.event}" successfully!`);
      }

      setShowFormModal(false);
      setEditingId(null);
      await fetchResults();
      setTimeout(() => setMsg(""), 4000);
    } catch (error) {
      setMsg(
        error.response?.data?.message ||
          error.message ||
          "Failed to save result."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResult = async (id, eventName) => {
    if (!window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
      return;
    }

    try {
      // Optimistically remove from state immediately
      setResults((prev) => prev.filter((r) => r._id !== id));
      await API.delete(`/results/${id}`);
      await fetchResults();
      setMsg(`✓ Deleted "${eventName}"`);
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      setMsg(error.response?.data?.message || error.message || "Failed to delete result.");
      await fetchResults();
    }
  };

  const selectedResult = selectedEventName
    ? results.find(
        (r) =>
          String(r.event).toLowerCase() === selectedEventName.toLowerCase()
      )
    : null;

  // Single Event Detail View
  if (selectedEventName) {
    return (
      <section className="results-section results-detail-page">
        <div className="results-detail-top-nav">
          <button
            type="button"
            className="results-back-button"
            onClick={backToResults}
          >
            <span aria-hidden="true">←</span> Back to Results
          </button>

          {isHead && selectedResult && (
            <button
              type="button"
              className="results-detail-edit-btn"
              onClick={() => openEditModal(selectedResult)}
            >
              ✏️ Edit This Result
            </button>
          )}
        </div>

        {loading ? (
          <p className="results-loading">Loading event details...</p>
        ) : !selectedResult ? (
          <div className="results-not-found">
            <h2>Event Not Found</h2>
            <p>This event could not be found in the available results.</p>
            <button
              type="button"
              className="results-back-button"
              onClick={backToResults}
            >
              ← Back to All Results
            </button>
          </div>
        ) : (
          <>
            <header className="results-detail-header">
              <span className="results-eyebrow">
                AVIATION CLUB · NIT RAIPUR
              </span>
              <h2>{selectedResult.event}</h2>
              <p className="results-subtitle">
                Complete event details, learning outcomes, and achievements
              </p>
            </header>

            <article className="results-detail-card">
              <div className="results-detail-meta">
                <div>
                  <span>Year</span>
                  <strong>{selectedResult.year}</strong>
                </div>

                {selectedResult.date && (
                  <div>
                    <span>Date</span>
                    <strong>{selectedResult.date}</strong>
                  </div>
                )}

                {selectedResult.venue && (
                  <div>
                    <span>Venue</span>
                    <strong>{selectedResult.venue}</strong>
                  </div>
                )}

                {selectedResult.duration && (
                  <div>
                    <span>Duration</span>
                    <strong>{selectedResult.duration}</strong>
                  </div>
                )}

                {selectedResult.team && (
                  <div>
                    <span>Participants / Teams</span>
                    <strong>{selectedResult.team}</strong>
                  </div>
                )}

                {selectedResult.category && (
                  <div>
                    <span>Category</span>
                    <strong>{selectedResult.category}</strong>
                  </div>
                )}
              </div>

              <section className="results-detail-section">
                <h3>🏆 Results &amp; Achievements</h3>
                <p>{selectedResult.position}</p>
              </section>

              {selectedResult.description && (
                <section className="results-detail-section">
                  <h3>About the Event</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{selectedResult.description}</p>
                </section>
              )}

              {selectedResult.purpose && (
                <section className="results-detail-section">
                  <h3>Event Purpose</h3>
                  <p style={{ whiteSpace: "pre-line" }}>{selectedResult.purpose}</p>
                </section>
              )}

              {selectedResult.speakers?.length > 0 && (
                <section className="results-detail-section">
                  <h3>Speakers &amp; Coordinators</h3>
                  <ul>
                    {selectedResult.speakers.map((speaker, idx) => (
                      <li key={idx}>{speaker}</li>
                    ))}
                  </ul>
                </section>
              )}

              {selectedResult.activities?.length > 0 && (
                <section className="results-detail-section">
                  <h3>Activities &amp; Highlights</h3>
                  <ul>
                    {selectedResult.activities.map((activity, idx) => (
                      <li key={idx}>{activity}</li>
                    ))}
                  </ul>
                </section>
              )}

              {selectedResult.outcomes?.length > 0 && (
                <section className="results-detail-section">
                  <h3>Results &amp; Outcomes</h3>
                  <ul>
                    {selectedResult.outcomes.map((outcome, idx) => (
                      <li key={idx}>{outcome}</li>
                    ))}
                  </ul>
                </section>
              )}

              {selectedResult.feedback && (
                <section className="results-detail-section results-detail-feedback">
                  <h3>Participant Feedback</h3>
                  <p>{selectedResult.feedback}</p>
                </section>
              )}
            </article>

            <div className="results-detail-bottom-nav">
              <button
                type="button"
                className="results-back-button"
                onClick={backToResults}
              >
                ← Back to All Results
              </button>
              {isHead && (
                <button
                  type="button"
                  className="results-detail-edit-btn"
                  onClick={() => openEditModal(selectedResult)}
                >
                  ✏️ Edit This Result
                </button>
              )}
            </div>
          </>
        )}
      </section>
    );
  }

  // All Results Grid View
  return (
    <section className="results-section" id="results">
      <header className="results-header">
        <span className="results-eyebrow">
          AVIATION CLUB · NIT RAIPUR
        </span>
        <h2>Results &amp; Achievements</h2>
        <p className="results-subtitle">
          Celebrating our competitions, technical events, student
          achievements, and the impact of aviation learning.
        </p>
      </header>

      {isHead && (
        <div className="results-admin-bar">
          <span>👑 Head Edit Mode Active</span>
          <button
            type="button"
            className="results-add-button"
            onClick={openAddModal}
          >
            + Publish New Result
          </button>
        </div>
      )}

      {msg && (
        <div
          className={`results-message ${
            msg.startsWith("✓") ? "success" : "error"
          }`}
          role="status"
        >
          {msg}
        </div>
      )}

      {/* Unified Add / Edit Modal */}
      {showFormModal && (
        <div
          className="results-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowFormModal(false);
            }
          }}
        >
          <div
            className="results-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="results-modal-title"
          >
            <h3 id="results-modal-title">
              {editingId ? "✏️ Edit Result / Achievement" : "🏆 Publish Result / Award"}
            </h3>

            <form onSubmit={handleSubmitForm}>
              <div className="results-form-row">
                <div style={{ flex: 2 }}>
                  <label htmlFor="form-event">Competition / Event Name *</label>
                  <input
                    id="form-event"
                    type="text"
                    required
                    value={formData.event}
                    onChange={(e) =>
                      setFormData({ ...formData, event: e.target.value })
                    }
                    placeholder="e.g. Blitz Competition"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label htmlFor="form-year">Year *</label>
                  <input
                    id="form-year"
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    placeholder="e.g. 2026"
                  />
                </div>
              </div>

              <div className="results-form-row">
                <div>
                  <label htmlFor="form-category">Category</label>
                  <input
                    id="form-category"
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g. CAD, FEA and CFD"
                  />
                </div>

                <div>
                  <label htmlFor="form-date">Event Date</label>
                  <input
                    id="form-date"
                    type="text"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    placeholder="e.g. 4 April 2026"
                  />
                </div>
              </div>

              <div className="results-form-row">
                <div>
                  <label htmlFor="form-position">Position / Standing *</label>
                  <input
                    id="form-position"
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="e.g. 🥇 Winner: Team Garud"
                  />
                </div>

                <div>
                  <label htmlFor="form-team">Team / Participants *</label>
                  <input
                    id="form-team"
                    type="text"
                    required
                    value={formData.team}
                    onChange={(e) =>
                      setFormData({ ...formData, team: e.target.value })
                    }
                    placeholder="e.g. 4 Teams · 24 Members"
                  />
                </div>
              </div>

              <div className="results-form-row">
                <div>
                  <label htmlFor="form-venue">Venue</label>
                  <input
                    id="form-venue"
                    type="text"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    placeholder="e.g. S-11, Academic Building, NIT Raipur"
                  />
                </div>

                <div>
                  <label htmlFor="form-duration">Duration</label>
                  <input
                    id="form-duration"
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="e.g. 2:00 PM – 6:00 PM"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="form-description">Overview Description</label>
                <textarea
                  id="form-description"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Summary of the event, competition, or achievement..."
                />
              </div>

              <div>
                <label htmlFor="form-purpose">Event Purpose &amp; Objectives</label>
                <textarea
                  id="form-purpose"
                  rows="2"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  placeholder="The goal and learning objectives of the event..."
                />
              </div>

              <div>
                <label htmlFor="form-speakers">Speakers &amp; Coordinators (One per line)</label>
                <textarea
                  id="form-speakers"
                  rows="2"
                  value={formData.speakers}
                  onChange={(e) =>
                    setFormData({ ...formData, speakers: e.target.value })
                  }
                  placeholder="Dr. N. V. Swamy Naidu, HOD&#10;Honumant Nethani, Overall Lead"
                />
              </div>

              <div>
                <label htmlFor="form-activities">Key Activities &amp; Highlights (One per line)</label>
                <textarea
                  id="form-activities"
                  rows="3"
                  value={formData.activities}
                  onChange={(e) =>
                    setFormData({ ...formData, activities: e.target.value })
                  }
                  placeholder="Individual participation&#10;On-the-spot problem statement&#10;Three-hour CAD modelling round"
                />
              </div>

              <div>
                <label htmlFor="form-outcomes">Results &amp; Key Outcomes (One per line)</label>
                <textarea
                  id="form-outcomes"
                  rows="3"
                  value={formData.outcomes}
                  onChange={(e) =>
                    setFormData({ ...formData, outcomes: e.target.value })
                  }
                  placeholder="Enhanced skills in CAD and CFD&#10;Strengthened analytical thinking&#10;Team Garud awarded first place"
                />
              </div>

              <div>
                <label htmlFor="form-feedback">Participant Feedback / Rating Summary</label>
                <input
                  id="form-feedback"
                  type="text"
                  value={formData.feedback}
                  onChange={(e) =>
                    setFormData({ ...formData, feedback: e.target.value })
                  }
                  placeholder="e.g. 72.2% rated 5 stars, 27.8% rated 4 stars"
                />
              </div>

              <div className="results-modal-actions">
                <button
                  type="submit"
                  className="results-publish-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : editingId
                    ? "✓ Update Result"
                    : "+ Publish Result"}
                </button>
                <button
                  type="button"
                  className="results-cancel-button"
                  onClick={() => setShowFormModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="results-loading">Loading achievements...</div>
      ) : (
        <div className="results-container">
          {results.length === 0 ? (
            <p className="results-empty">No results recorded yet.</p>
          ) : (
            results.map((result, index) => (
              <article
                className="result-card"
                key={result._id || `${result.event}-${result.year}-${index}`}
              >
                <div className="result-card-top">
                  <span className="result-year">{result.year}</span>
                  <span className="result-category">
                    {result.category || "Club Achievement"}
                  </span>
                </div>

                <h3>{result.event}</h3>

                {result.date && (
                  <p className="result-date">📅 {result.date}</p>
                )}

                {result.venue && (
                  <p className="result-venue">📍 {result.venue}</p>
                )}

                <div className="result-position">{result.position}</div>
                <p className="result-team">{result.team}</p>

                {result.duration && (
                  <p className="result-duration">
                    <strong>Duration:</strong> {result.duration}
                  </p>
                )}

                <p className="result-description">{result.description}</p>

                <button
                  type="button"
                  className="result-view-details"
                  onClick={() => openResultDetails(result.event)}
                >
                  <span>View Full Details</span>
                  <span className="result-view-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>

                {isHead && (
                  <div className="result-admin-actions">
                    <button
                      type="button"
                      className="result-edit-button"
                      onClick={() => openEditModal(result)}
                    >
                      ✏️ Edit
                    </button>
                    {result._id && (
                      <button
                        type="button"
                        className="result-delete-button"
                        onClick={() =>
                          handleDeleteResult(result._id, result.event)
                        }
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default Results;
