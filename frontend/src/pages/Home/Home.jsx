import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import API from "../../services/api";
import { getRegistrationState } from "../Events/Events";
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

function getFirstParagraph(text) {
  if (!text) return "";
  const paragraphs = text.split(/\r?\n\s*\r?\n/);
  if (paragraphs.length > 0 && paragraphs[0].trim()) {
    return paragraphs[0].trim();
  }
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (line.trim()) return line.trim();
  }
  return text.trim();
}

const defaultMilestones = [
  {
    icon: "✈",
    date: "8 October 2025",
    title: "Air Force Day Celebration & Quiz",
    desc: "Aviation quiz, RC plane landing and parachute landing challenges honoring the Indian Air Force, with 50 participants at Hira Hall.",
    firstParagraph: "The event commenced with a presentation session, followed by a quiz competition designed to assess participants' knowledge of aviation technology and the history of the Indian Air Force. Dr. N. V. Swamy Naidu graced the occasion as the Chief Guest, providing valuable insights and encouragement to all 50 participants, followed by an RC Plane Landing Competition and Parachute Landing Challenge.",
  },
  {
    icon: "◧",
    date: "8 November 2025",
    title: "DIMENSIONS: CAD Workshop & Competition",
    desc: "Creo Parametric training followed by a two-tier CAD design competition for 75 beginner and expert participants.",
    firstParagraph: "The Aviation Club organized \"DIMENSIONS – The CAD Workshop & Competition\" to introduce 75 participants to the fundamentals of Computer-Aided Design (CAD). The workshop began with an introductory session teaching the basics of CAD using Creo Parametric software, covering fundamental 3D modelling techniques and engineering applications, followed by beginner and expert design challenges.",
  },
  {
    icon: "〜",
    date: "31 Jan – 1 Feb 2026",
    title: "Aerodynamics Workshop & Air Show",
    desc: "Two-day session on flight principles and drone systems with glider-building and a live air show, for 95 participants.",
    firstParagraph: "A two-day Aerodynamics Workshop organized for 95 participants covering key principles of flight, aircraft take-off mechanisms, forces (lift, drag, thrust, weight), and control mechanisms. The event featured hands-on glider-making, a flying competition, and sessions on drone flight controllers by Dr. Aruna Rana, concluding with a live air show featuring drones, gliders, and RC planes.",
  },
  {
    icon: "◆",
    date: "7 February 2026",
    title: "Deliver the Pizza (DTP)",
    desc: "Drone design and assembly competition across four teams; Team MACHX6 won, Team Garud finished as runner-up.",
    firstParagraph: "The Aviation Club of NIT Raipur organized the \"Deliver the Pizza (DTP)\" Competition, an interactive, hands-on drone-based event designed to provide students with real-world exposure to drone design, assembly, and flight operations. Four teams participated—MACHX6, Aeroverse, Garud, and Vayuveg—comprising 24 members total, each guided by a senior mentor across design presentations and flight trials.",
  },
  {
    icon: "🏁",
    date: "8 February 2026",
    title: "UAV Racing Competition",
    desc: "End-to-end UAV design, FEA/CFD analysis and a live racing round; Team Garud took first place, MACHX6 second.",
    firstParagraph: "The UAV Racing Competition combined design, theoretical analysis, fabrication, and flight performance. Beginning two months prior, four mentored teams (MACHX6, Aeroverse, Garud, Vayuveg) underwent training in basic aerodynamics, FEA, CFD, and bill-of-materials planning before building models in the college Makerspace and competing on a dynamic obstacle track on match day.",
  },
  {
    icon: "⚡",
    date: "4 April 2026",
    title: "Blitz Competition",
    desc: "A three-hour, individual CAD-FEA-CFD sprint testing 21 participants on design, analysis and optimization speed.",
    firstParagraph: "Aviation Club conducted Blitz - a technical, software-led competition centred on the practical application of CAD, FEA, and CFD. The event is designed to provide participants (total 21 in number) with a hands-on experience of the complete engineering workflow, where they will design, analyse, and optimize a model within a competitive and time-bound environment.",
  },
];

// ===================== DEFAULT UPCOMING FLAGSHIP EVENT =====================

const defaultFlagshipEvent = {
  eventId: "aerosprint-annual-flagship-2027",
  title: "AeroSprint: UAV Racing & Deliver the Pizza (DTP)",
  tagline: "NIT Raipur's Premier Dual-Track Aviation Championship: Fixed-Wing UAV Racing & Multirotor Payload Delivery",
  date: "Upcoming 2026 – 2027 Academic Session",
  duration: "Full Day Aeromodelling & Multirotor Championship",
  venue: "Football Ground, NIT Raipur",
  speakerInfo: "Aviation Club Executive Team & Mentors",
  isUpcoming: true,
  isFlagship: true,
  flagshipStatus: "Upcoming",
  registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSepdVSIlzd3tuBHCDPkJ6t4WjY3rvN9TY_S3_fhc8kTWq_MHw/viewform?usp=publish-editor",
  registrationStatusMode: "auto",
  teamEligibility: "Members of a Team must be undergraduate or postgraduate student. Cross college and cross branches are allowed for the members of a team. Each team can have minimum of 3 members and maximum of 5 members. And one student from 2nd or Higher grade (year) is mandatory in one team.",
  registrationFee: "For club volunteers = Rs. 200 per person | For non volunteers = Rs. 300 per person | For Outsiders (from other institutes) = Rs. 500 per person",
  prizePool: "Cash Prizes + SAE AEROTHON 2027 Team Sponsorship",
  contactInfo: "Coordinator: +91 98765 43210 / aviation@nitrr.ac.in",
  image: "/images/6.png",
  tracks: [
    {
      id: "uav-racing",
      title: "Track 1: UAV Racing Competition",
      badge: "Fixed-Wing Challenge",
      tagline: "High-Speed Fixed-Wing Aerodynamic Design, Fabrication & Piloting",
      description: "**UAV Racing** is a hands-on aerospace challenge where innovation meets speed and precision. Participants will design, fabricate, and fly their own fixed-wing UAVs, putting their aerodynamic knowledge, engineering skills, and piloting abilities to the ultimate test. Build your aircraft, push the limits of performance, and race towards victory!",
      objectives: [
        "To encourage students to design and fabricate efficient, high-performance fixed-wing UAVs.",
        "To develop practical skills in aerodynamics, aircraft structures, propulsion, and flight control systems.",
        "To enhance problem-solving, innovation, and teamwork through hands-on aircraft development.",
        "To evaluate UAV performance in terms of speed, stability, manoeuvrability, and flight efficiency."
      ],
      image: "/images/6.png"
    },
    {
      id: "deliver-the-pizza",
      title: "Track 2: Deliver the Pizza (DTP)",
      badge: "Multirotor Challenge",
      tagline: "Autonomous / Manual Multirotor Drone Payload Delivery & Precision Flight",
      description: "**Deliver the Pizza** is an exciting drone engineering challenge that tests innovation, stability, and payload-carrying capabilities. Participants will design and develop custom multirotor drones capable of carrying and delivering a payload to a designated target. Engineer your solution, master precision, and prove that your drone can deliver under pressure!",
      objectives: [
        "To encourage the design and development of multirotor drones with payload-carrying capabilities.",
        "To develop practical knowledge of flight stability, propulsion systems, weight distribution, and control mechanisms.",
        "To challenge students to achieve accurate and reliable payload transportation and delivery.",
        "To promote innovation, teamwork, and problem-solving through real-world UAV applications."
      ],
      image: "/images/4.png"
    }
  ],
  purpose: [
    "Track 1 (UAV Racing): Encourage design & fabrication of high-performance fixed-wing UAVs.",
    "Track 1 (UAV Racing): Develop practical skills in aerodynamics, structures, propulsion, and flight control.",
    "Track 2 (Deliver the Pizza): Encourage design & development of multirotor drones with payload capabilities.",
    "Track 2 (Deliver the Pizza): Master flight stability, weight distribution, and precision payload delivery.",
    "Champion Selection: Winning NIT Raipur team & top performers selected for SAE AEROTHON 2027 representation."
  ],
  description: "Welcome to AeroSprint 2027, the flagship aeromodelling championship of the Aviation Club, NIT Raipur! Dual-track competition combining high-speed Fixed-Wing UAV Racing and precision Multirotor Payload Delivery ('Deliver the Pizza'). Complete engineering lifecycle, component expenditure by teams, and winner selection for SAE AEROTHON 2027.",
  outcomes: [
    "End-to-end fixed-wing & multirotor engineering, testing, and competitive flying experience",
    "Official selection & sponsorship for SAE AEROTHON 2027 representation on behalf of Aviation Club",
    "Cash prizes, merit certificates, and mentorship from senior aeromodellers"
  ]
};

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
  const [upcomingEvent, setUpcomingEvent] = useState(defaultFlagshipEvent);
  const [flagshipEvent, setFlagshipEvent] = useState(defaultFlagshipEvent);
  const [homeTrackIdx, setHomeTrackIdx] = useState(0);
  const [timelineItems, setTimelineItems] = useState(defaultMilestones);
  const [expandedTimelineIdx, setExpandedTimelineIdx] = useState(null);
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

  // Milestone Admin CRUD state (The Route So Far)
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    date: "",
    icon: "✈",
    desc: "",
    link: "/events",
    linkLabel: "Full Event Report →",
    order: 0,
  });
  const [milestoneMsg, setMilestoneMsg] = useState("");
  const [submittingMilestone, setSubmittingMilestone] = useState(false);

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

  // Fetch dynamic milestones (Route So Far) from backend
  const fetchMilestones = useCallback(async () => {
    try {
      const res = await API.get("/milestones");
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setTimelineItems(res.data.data);
      }
    } catch {
      // Keep initial default milestones if server unreachable
    }
  }, []);

  // Fetch dynamic highlights: Events, Projects, Faculty
  const fetchHighlights = useCallback(async () => {
    try {
      // 1. Fetch Events
      const evRes = await API.get("/events");
      if (evRes.data?.data && Array.isArray(evRes.data.data)) {
        const allEvents = evRes.data.data;
        const flagship = allEvents.find((e) => e.isFlagship) || allEvents.find((e) => e.isUpcoming);
        if (flagship) {
          setFlagshipEvent(flagship);
          setUpcomingEvent(flagship);
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
    fetchMilestones();
    fetchHighlights();
  }, [fetchNotifications, fetchMilestones, fetchHighlights]);

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

  // Milestone Admin CRUD Handlers (Route So Far)
  const openAddMilestoneModal = () => {
    setEditingMilestoneId(null);
    setMilestoneForm({
      title: "",
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      icon: "✈",
      desc: "",
      link: "/events",
      linkLabel: "Full Event Report →",
      order: (timelineItems?.length || 0) + 1,
    });
    setShowMilestoneModal(true);
  };

  const openEditMilestoneModal = (milestone) => {
    setEditingMilestoneId(milestone._id || milestone.id);
    setMilestoneForm({
      title: milestone.title || "",
      date: milestone.date || "",
      icon: milestone.icon || "✈",
      desc: milestone.desc || milestone.firstParagraph || "",
      link: milestone.link || "/events",
      linkLabel: milestone.linkLabel || "Full Event Report →",
      order: milestone.order !== undefined ? milestone.order : 0,
    });
    setShowMilestoneModal(true);
  };

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingMilestone(true);
      setMilestoneMsg("");

      const payload = {
        title: milestoneForm.title.trim(),
        date: milestoneForm.date.trim(),
        icon: milestoneForm.icon.trim() || "✈",
        desc: milestoneForm.desc.trim(),
        link: milestoneForm.link.trim() || "/events",
        linkLabel: milestoneForm.linkLabel.trim() || "Full Event Report →",
        order: Number(milestoneForm.order) || 0,
      };

      if (editingMilestoneId) {
        await API.put(`/milestones/${editingMilestoneId}`, payload);
        setMilestoneMsg("✓ Milestone updated successfully!");
      } else {
        await API.post("/milestones", payload);
        setMilestoneMsg("✓ New milestone added to Route So Far!");
      }

      setShowMilestoneModal(false);
      await fetchMilestones();
      setTimeout(() => setMilestoneMsg(""), 4000);
    } catch (err) {
      setMilestoneMsg(err.response?.data?.message || err.message || "Failed to save milestone");
    } finally {
      setSubmittingMilestone(false);
    }
  };

  const handleDeleteMilestone = async (milestone) => {
    if (!window.confirm(`Delete milestone "${milestone.title}" from Route So Far?`)) return;

    try {
      if (milestone._id) {
        await API.delete(`/milestones/${milestone._id}`);
      } else {
        setTimelineItems((prev) => prev.filter((item) => item !== milestone));
      }
      setMilestoneMsg(`✓ Milestone "${milestone.title}" deleted.`);
      await fetchMilestones();
      setTimeout(() => setMilestoneMsg(""), 3500);
    } catch (err) {
      setMilestoneMsg(err.response?.data?.message || err.message || "Failed to delete milestone");
    }
  };

  const handleResetMilestones = async () => {
    if (!window.confirm("Reset Route So Far back to default official club milestones? Any custom milestones will be replaced.")) return;

    try {
      await API.post("/milestones/reset");
      setMilestoneMsg("✓ Milestones reset to defaults.");
      await fetchMilestones();
      setTimeout(() => setMilestoneMsg(""), 3500);
    } catch (err) {
      setMilestoneMsg(err.response?.data?.message || err.message || "Failed to reset milestones");
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
            Where curiosity takes flight and engineering knows no boundaries.
            Aviation Club, NIT Raipur, is a community of innovators exploring aviation, aerospace, and UAV technology through hands-on projects, technical challenges, and collaborative learning.
            <br></br>
            **Dream. Design. Develop. Fly.**
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

          {/* DYNAMIC UPCOMING / FLAGSHIP EVENT ALERT BADGE */}
          {(flagshipEvent || upcomingEvent) && (() => {
            const featured = flagshipEvent || upcomingEvent;
            return (
              <div className="hero-live-badge-container">
                <span className="live-pulse"></span>
                <span>
                  🚀 {featured.isFlagship ? "CLUB FLAGSHIP" : "UPCOMING"} ({(featured.flagshipStatus || "UPCOMING").toUpperCase()}): <strong>{featured.title}</strong> ({featured.date})
                </span>
                <a href="#upcoming-event" className="hero-live-link">
                  View Upcoming Event &rarr;
                </a>
              </div>
            );
          })()}

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
          FEATURED FLAGSHIP EVENT SHOWCASE SECTION
      ===================================================== */}
      {flagshipEvent && (() => {
        const hasTracks = Array.isArray(flagshipEvent.tracks) && flagshipEvent.tracks.length > 0;
        const currentTrack = hasTracks ? (flagshipEvent.tracks[homeTrackIdx] || flagshipEvent.tracks[0]) : null;
        const displayImage = currentTrack?.image || flagshipEvent.image;

        return (
          <section className="home-flagship-section" id="upcoming-event" aria-labelledby="upcoming-event-heading">
            <div className="container">
              <div className="section-head reveal fade-up" style={{ textAlign: "center", marginBottom: "32px" }}>
                <p className="eyebrow">Upcoming Events &amp; Competitions</p>
                <h2 id="upcoming-event-heading">Featured Upcoming Flagship</h2>
              </div>
              <div className="home-flagship-card reveal fade-up">
                <div className="home-flagship-glow" aria-hidden="true"></div>
                <div className="home-flagship-inner">
                  {displayImage && (
                    <div className="home-flagship-media">
                      <img
                        src={displayImage}
                        alt={currentTrack ? currentTrack.title : flagshipEvent.title}
                        onError={(e) => {
                          e.currentTarget.src = "/images/7.png";
                        }}
                      />
                      <div className="home-flagship-media-badge">
                        {currentTrack ? currentTrack.badge : (flagshipEvent.flagshipStatus === "Ongoing" ? "🔴 LIVE NOW" : "⭐ CLUB FLAGSHIP")}
                      </div>
                    </div>
                  )}

                  <div className="home-flagship-content">
                    <div className="home-flagship-header">
                      <div className="home-flagship-pills">
                        <span className="home-flagship-pill">
                          <span className="live-pulse"></span>
                          {(flagshipEvent.flagshipStatus || "UPCOMING").toUpperCase()} FLAGSHIP
                        </span>
                        {(() => {
                          const regState = getRegistrationState(flagshipEvent);
                          if (regState.badgeText) {
                            return (
                              <span className={`flagship-reg-status-pill reg-pill-${regState.status}`} style={{ fontSize: "0.75rem" }}>
                                {regState.badgeText}
                              </span>
                            );
                          }
                          return null;
                        })()}
                        {flagshipEvent.prizePool && (
                          <span className="home-flagship-prize">
                            🏆 {flagshipEvent.prizePool}
                          </span>
                        )}
                      </div>
                      {isHead && (
                        <Link
                          to="/events"
                          className="home-flagship-head-edit"
                          title="Edit or switch flagship in Events page"
                        >
                          ✏️ Manage Flagship
                        </Link>
                      )}
                    </div>

                    <h2 className="home-flagship-title">{flagshipEvent.title}</h2>

                    {/* DUAL TRACK SWITCHER TABS ON HOME CARD */}
                    {hasTracks && (
                      <div className="home-flagship-track-switcher">
                        {flagshipEvent.tracks.map((track, tIdx) => {
                          const isUav = track.id?.includes('uav') || track.title.toLowerCase().includes('uav');
                          return (
                            <button
                              key={track.id || tIdx}
                              type="button"
                              className={`home-track-btn ${homeTrackIdx === tIdx ? 'active' : ''}`}
                              onClick={() => setHomeTrackIdx(tIdx)}
                            >
                              <span>{isUav ? '🏁' : '🍕'}</span> {track.title}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {currentTrack ? (
                      <div className="home-active-track-box">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span className="track-badge-pill" style={{ fontSize: '0.72rem' }}>{currentTrack.badge}</span>
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>{currentTrack.tagline}</span>
                        </div>
                        <p className="home-flagship-desc">
                          {currentTrack.description}
                        </p>
                        {Array.isArray(currentTrack.objectives) && currentTrack.objectives.length > 0 && (
                          <div className="home-track-objectives-preview">
                            <strong style={{ color: '#38bdf8', fontSize: '0.82rem', display: 'block', marginBottom: '6px' }}>
                              🎯 Key Track Objectives:
                            </strong>
                            <div className="home-track-obj-chips">
                              {currentTrack.objectives.map((obj, oIdx) => (
                                <span key={oIdx} className="home-obj-chip">
                                  <span className="obj-dot">✓</span> {obj}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {flagshipEvent.tagline && (
                          <p className="home-flagship-tagline">{flagshipEvent.tagline}</p>
                        )}
                        <p className="home-flagship-desc">
                          {flagshipEvent.description?.slice(0, 240)}...
                        </p>
                      </>
                    )}

                    <div className="home-flagship-meta">
                      <span>📅 {flagshipEvent.date}</span>
                      {flagshipEvent.duration && <span>🕒 {flagshipEvent.duration}</span>}
                      {flagshipEvent.venue && <span>📍 {flagshipEvent.venue}</span>}
                      {flagshipEvent.speakerInfo && <span>🎙️ {flagshipEvent.speakerInfo}</span>}
                    </div>

                    {/* Action Buttons */}
                    <div className="home-flagship-actions">
                      {(() => {
                        const regState = getRegistrationState(flagshipEvent);
                        if (regState.isClickable) {
                          return (
                            <a
                              href={flagshipEvent.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                            >
                              Register Now 🚀
                            </a>
                          );
                        }
                        if (flagshipEvent.registrationLink) {
                          return (
                            <button
                              type="button"
                              className="btn btn-primary btn-reg-inactive"
                              onClick={() => alert(regState.tooltip)}
                              title={regState.tooltip}
                              style={{ opacity: 0.65, cursor: "not-allowed" }}
                            >
                              {regState.btnText}
                            </button>
                          );
                        }
                        return (
                          <Link to="/events" className="btn btn-primary">
                            Register on Event Page
                          </Link>
                        );
                      })()}

                      {flagshipEvent.rulebookLink && (
                        <a
                          href={flagshipEvent.rulebookLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline home-rulebook-btn"
                        >
                          📘 Rule Book
                        </a>
                      )}

                      <Link to="/events" className="btn btn-secondary">
                        Full Dual-Track Details &rarr;
                      </Link>

                      {/* Dynamic custom links */}
                      {Array.isArray(flagshipEvent.customLinks) &&
                        flagshipEvent.customLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-custom-pill"
                          >
                            🔗 {link.label}
                          </a>
                        ))}
                    </div>

                    {/* Optional photo strip preview */}
                    {Array.isArray(flagshipEvent.photos) && flagshipEvent.photos.length > 0 && (
                      <div className="home-flagship-gallery-preview">
                        <p className="gallery-label">📸 Event Highlights &amp; Gallery Preview:</p>
                        <div className="gallery-strip">
                          {flagshipEvent.photos.slice(0, 4).map((pUrl, pIdx) => (
                            <img
                              key={pIdx}
                              src={pUrl}
                              alt={`Flagship highlight ${pIdx + 1}`}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section className="about" id="about" aria-labelledby="about-heading">
        <div className="container about-grid">
          <div className="about-image reveal fade-left">
            
          <img
            src="https://res.cloudinary.com/gftc80co/image/upload/v1795444549/WhatsApp_Image_2026-11-23_at_19.59.38.jpg"
            alt="Aviation Club members working on a UAV assembly"
            style={{
              width: "100%",
              height: "500px",
              objectFit: "cover",
            }}
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
          CLUB HISTORY & MILESTONES (DYNAMIC BACKEND CRUD)
      ===================================================== */}

      <section className="history" id="history" aria-labelledby="history-heading">
        <div className="container">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Club History &amp; Milestones</p>
            <h2 id="history-heading">The route so far</h2>
          </div>

          {/* Club Head Admin Route Controls */}
          {isHead && (
            <div className="milestone-admin-bar reveal fade-up">
              <div className="milestone-admin-info">
                <span className="milestone-admin-badge">👑 Club Head Mode Active</span>
                <p>Manage Route So Far: add new milestones, customize descriptions, or delete stops.</p>
              </div>
              <div className="milestone-admin-actions">
                <button
                  type="button"
                  className="btn-milestone-add"
                  onClick={openAddMilestoneModal}
                >
                  ➕ Add Milestone
                </button>
                <button
                  type="button"
                  className="btn-milestone-reset"
                  onClick={handleResetMilestones}
                  title="Reset to default official club milestones"
                >
                  🔄 Reset Defaults
                </button>
              </div>
            </div>
          )}

          {milestoneMsg && (
            <div
              className={`milestone-feedback-msg ${
                milestoneMsg.startsWith("✓") ? "success" : "error"
              }`}
            >
              {milestoneMsg}
            </div>
          )}

          <ol className="timeline">
            {timelineItems.map((item, index) => {
              const isExpanded = expandedTimelineIdx === index;
              const isExternal = item.link && (item.link.startsWith("http://") || item.link.startsWith("https://"));
              const itemContent = item.desc || item.firstParagraph || "";

              return (
                <li
                  key={item._id || item.id || index}
                  className={`timeline-item reveal ${index % 2 === 0 ? "fade-right" : "fade-left"}`}
                >
                  <div className="timeline-dot" aria-hidden="true">
                    {item.icon || "✈"}
                  </div>
                  <div
                    className={`timeline-card ${isExpanded ? "expanded" : ""}`}
                    onClick={() => setExpandedTimelineIdx(isExpanded ? null : index)}
                    title="Hover or tap to view details"
                  >
                    <div className="timeline-card-header">
                      <span className="timeline-date">{item.date}</span>

                      <div className="timeline-header-right">
                        <span className="timeline-hover-cue">
                          <span className="cue-icon">✨</span>
                          <span className="cue-text">Hover to read</span>
                        </span>

                        {isHead && (
                          <div
                            className="timeline-head-actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="btn-milestone-action btn-milestone-edit"
                              onClick={() => openEditMilestoneModal(item)}
                              title="Edit milestone title, content, or details"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              className="btn-milestone-action btn-milestone-delete"
                              onClick={() => handleDeleteMilestone(item)}
                              title="Delete this milestone from Route So Far"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="timeline-title">{item.title}</h3>

                    {/* Single unified first paragraph: clamped initially, unclamps on hover without glitch/layout shifts */}
                    <p className="timeline-card-desc">
                      {itemContent}
                    </p>

                    <div className="timeline-action-strip">
                      {isExternal ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-timeline-explore"
                        >
                          {item.linkLabel || "Full Event Report →"}
                        </a>
                      ) : (
                        <Link to={item.link || "/events"} className="btn-timeline-explore">
                          {item.linkLabel || "Full Event Report →"}
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
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

      {/* =====================================================
          HEAD MILESTONE MODAL: CREATE / EDIT (ROUTE SO FAR)
      ===================================================== */}
      {showMilestoneModal && (
        <div
          className="milestone-modal-overlay"
          onClick={() => setShowMilestoneModal(false)}
        >
          <div
            className="milestone-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="milestone-modal-header">
              <h3>
                {editingMilestoneId ? "✏️ Edit Route Milestone" : "➕ Add New Route Milestone"}
              </h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowMilestoneModal(false)}
              >
                ✕
              </button>
            </div>

            <p className="milestone-modal-subhead">
              Manage what displays on this Route So Far milestone card. The description below is displayed as the milestone paragraph and unclamps smoothly on hover.
            </p>

            <form onSubmit={handleMilestoneSubmit} className="milestone-modal-form">
              <div className="milestone-form-group">
                <label>Milestone Title *</label>
                <input
                  type="text"
                  required
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  placeholder="e.g. UAV Racing Competition or Air Show 2026"
                />
              </div>

              <div className="milestone-form-row">
                <div className="milestone-form-group" style={{ flex: 1 }}>
                  <label>Date / Timeframe *</label>
                  <input
                    type="text"
                    required
                    value={milestoneForm.date}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, date: e.target.value })}
                    placeholder="e.g. 8 October 2025 or April 2026"
                  />
                </div>

                <div className="milestone-form-group" style={{ width: "120px" }}>
                  <label>Icon / Symbol</label>
                  <input
                    type="text"
                    value={milestoneForm.icon}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, icon: e.target.value })}
                    placeholder="✈"
                    maxLength={4}
                    style={{ textAlign: "center", fontSize: "1.2rem" }}
                  />
                </div>
              </div>

              {/* Quick Preset Icon Chips */}
              <div className="milestone-icon-strip">
                <span className="milestone-icon-label">Presets:</span>
                {["✈", "🏁", "⚡", "🚀", "🏆", "🛸", "🎯", "◧", "〜", "◆"].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    className={`milestone-icon-chip ${milestoneForm.icon === sym ? "active" : ""}`}
                    onClick={() => setMilestoneForm({ ...milestoneForm, icon: sym })}
                  >
                    {sym}
                  </button>
                ))}
              </div>

              <div className="milestone-form-group">
                <label>Content / Description (What to display on the card) *</label>
                <textarea
                  required
                  rows={5}
                  value={milestoneForm.desc}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, desc: e.target.value })}
                  placeholder="Enter the full description to display on this card. It starts neatly clamped to 2 lines and unclamps fully on hover with zero glitch."
                />
              </div>

              <div className="milestone-form-row">
                <div className="milestone-form-group" style={{ flex: 1 }}>
                  <label>Action Button Link</label>
                  <input
                    type="text"
                    value={milestoneForm.link}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, link: e.target.value })}
                    placeholder="/events or external URL"
                  />
                </div>

                <div className="milestone-form-group" style={{ flex: 1 }}>
                  <label>Button Label</label>
                  <input
                    type="text"
                    value={milestoneForm.linkLabel}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, linkLabel: e.target.value })}
                    placeholder="Full Event Report →"
                  />
                </div>
              </div>

              <div className="milestone-form-group" style={{ maxWidth: "160px" }}>
                <label>Timeline Order / Position</label>
                <input
                  type="number"
                  value={milestoneForm.order}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, order: e.target.value })}
                  placeholder="1, 2, 3..."
                />
              </div>

              <div className="milestone-modal-actions">
                <button
                  type="button"
                  className="btn-milestone-cancel"
                  onClick={() => setShowMilestoneModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-milestone-submit"
                  disabled={submittingMilestone}
                >
                  {submittingMilestone
                    ? "Saving..."
                    : editingMilestoneId
                    ? "✓ Save Changes"
                    : "➕ Add to Route So Far"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
