import React, { useEffect, useState } from "react"; 
import "./Home.css";
import facPhoto from "../../assets/fac.jpg";
import aviationLogo from "../../assets/aviation-logo.png"; 
import nitrrLogo from "../../assets/nitrr-logo.png";
import { FaPlane } from "react-icons/fa";

// ===================== NOTICE BOARD DATA & COMPONENT =====================
const notificationsData = [
  {
    id: 1,
    date: "04 Apr 2026",
    title: "Blitz Competition results announced",
    summary: "21 participants completed a three-hour CAD-FEA-CFD design sprint, earning a 100% 4-star-or-above feedback score.",
    extraText: " The judges were highly impressed with the rapid prototyping skills and simulated aerodynamics demonstrated under pressure."
  },
  {
    id: 2,
    date: "08 Feb 2026",
    title: "UAV Racing Competition: Team Garud wins",
    summary: "Team Garud topped the leaderboard on technical documentation and flight performance; Lakshmi Sahithi named Best Mentor.",
    extraText: " The final race came down to a nail-biting finish, with Team Garud securing the win by mere milliseconds."
  },
  {
    id: 3,
    date: "07 Feb 2026",
    title: "Deliver the Pizza (DTP): Team MACHX6 wins",
    summary: "MACHX6 built and flew the strongest quadcopter across four competing teams in this two-phase UAV challenge.",
    extraText: " Their custom payload dropping mechanism was incredibly precise, hitting the target perfectly during the final phase."
  },
  {
    id: 4,
    date: "31 Jan – 01 Feb 2026",
    title: "Two-day Aerodynamics Workshop concludes",
    summary: "95 participants covered flight principles, drone systems and a live air show with industry expert Dr. Aruna Rana.",
    extraText: " Students also got hands-on experience calibrating flight controllers and troubleshooting basic motor synchronization."
  },
  {
    id: 5,
    date: "08 Nov 2025",
    title: "DIMENSIONS CAD Workshop & Competition held",
    summary: "75 participants trained in Creo Parametric before competing across beginner and expert design categories.",
    extraText: " The winning designs have been sent to the 3D printing lab to be featured in the upcoming club showcase."
  },
  {
    id: 6,
    date: "08 Oct 2025",
    title: "Air Force Day celebrated at Hira Hall",
    summary: "50 participants joined an aviation quiz, RC plane landing and parachute landing challenge with Dr. N. V. Swamy Naidu.",
    extraText: " The event concluded with an inspiring speech about the future of aerospace engineering in India."
  }
];

function NoticeCard({ date, title, summary, extraText }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="notice">
      <div className="notice-date"><span aria-hidden="true">📌</span> {date}</div>
      <div className="notice-body">
        <h3>{title}</h3>
        <p>
          {summary}
          {isExpanded && <span className="extra-text">{extraText}</span>}
        </p>
      </div>
      <button 
        type="button" 
        className="link-btn" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
}
// =========================================================================

export default function Home() {
  useEffect(() => {
    // Scroll reveal
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
      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("in-view"));
    }

    // Smooth scroll for in-page anchors
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
    anchorEls.forEach((anchor) => anchor.addEventListener("click", handleAnchorClick));

    return () => {
      revealObserver?.disconnect();
      anchorEls.forEach((anchor) => anchor.removeEventListener("click", handleAnchorClick));
    };
  }, []);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="hero" id="hero" aria-label="Introduction">
        
        {/* 🚀 HERE IS THE NEW ANIMATED SKY! */}
        <div className="animated-sky" aria-hidden="true">
          <FaPlane className="flying-plane plane-1" />
          <FaPlane className="flying-plane plane-2" />
          <FaPlane className="flying-plane plane-3" />
          <FaPlane className="flying-plane plane-4" />
        </div>

        <div className="hero-overlay" aria-hidden="true"></div>

        <div className="hero-content reveal fade-up">
          <div className="hero-logos">
            <img src={aviationLogo} alt="Aviation Club" className="hero-logo-img" />
            <div className="logo-divider"></div>
            <img src={nitrrLogo} alt="NIT Raipur" className="hero-logo-img" />
          </div>

          <p className="eyebrow">Dream &bull; Design &bull; Fly</p>
          <h1>Aviation Club<br /><span>National Institute of Technology Raipur</span></h1>
          <p className="hero-sub">
            From glider builds and CAD workshops to STOL and VTOL aircraft development,
            the Aviation Club turns aerodynamic theory into flight-tested engineering —
            one competition, one prototype at a time.
          </p>
          <div className="hero-buttons">
            <a href="#about" className="btn btn-primary">Explore Club</a>
            <a href="https://www.instagram.com/aviation_nitrr/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Join Us</a>
          </div>
        </div>

        <a href="#about" className="scroll-cue" aria-label="Scroll to About section">
          <span></span>
        </a>
      </section>

      {/* ===================== ABOUT ===================== */}
      <section className="about" id="about" aria-labelledby="about-heading">
        <div className="container about-grid">
          <div className="about-image reveal fade-left">
            <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop" alt="Aviation Club members working on a UAV assembly" loading="lazy" />
          </div>

          <div className="about-content reveal fade-right">
            <p className="eyebrow">About the Club</p>
            <h2 id="about-heading">Engineering flight, one prototype at a time</h2>
            <p>
              The Aviation Club of NIT Raipur brings together students who want to
              move beyond theory and build things that actually fly. Through the
              academic year, the club runs workshops on aerodynamics and CAD,
              organizes UAV and drone competitions, and drives original aircraft
              projects from concept to flight test.
            </p>
            <p>
              Every activity — from the Air Force Day quiz and RC plane landings to
              the STOL and VTOL development projects — bridges classroom
              aerodynamics with practical engineering: precision, innovation and
              critical thinking applied to real aircraft.
            </p>
            <ul className="about-list">
              <li><strong>Innovation:</strong> Original STOL and VTOL aircraft projects, from literature review to flight test.</li>
              <li><strong>UAV &amp; Drones:</strong> Full-cycle quadcopter design, assembly and racing competitions.</li>
              <li><strong>Aeromodelling:</strong> Glider builds, RC plane landings and parachute-landing challenges.</li>
              <li><strong>Workshops:</strong> CAD (Creo Parametric), aerodynamics fundamentals, and simulation tools like OpenVSP, FEA and CFD.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===================== CLUB HISTORY (TIMELINE) ===================== */}
      <section className="history" id="history" aria-labelledby="history-heading">
        <div className="container">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Club History</p>
            <h2 id="history-heading">The route so far</h2>
          </div>

          <ol className="timeline">
            <li className="timeline-item reveal fade-right">
              <div className="timeline-dot" aria-hidden="true">✈</div>
              <div className="timeline-card">
                <span className="timeline-date">8 October 2025</span>
                <h3>Air Force Day</h3>
                <p>Aviation quiz, RC plane landing and parachute landing challenges honoring the Indian Air Force, with 50 participants at Hira Hall.</p>
              </div>
            </li>
            <li className="timeline-item reveal fade-left">
              <div className="timeline-dot" aria-hidden="true">◧</div>
              <div className="timeline-card">
                <span className="timeline-date">8 November 2025</span>
                <h3>DIMENSIONS: CAD Workshop &amp; Competition</h3>
                <p>Creo Parametric training followed by a two-tier CAD design competition for 75 beginner and expert participants.</p>
              </div>
            </li>
            <li className="timeline-item reveal fade-right">
              <div className="timeline-dot" aria-hidden="true">〜</div>
              <div className="timeline-card">
                <span className="timeline-date">31 Jan – 1 Feb 2026</span>
                <h3>Aerodynamics Workshop</h3>
                <p>Two-day session on flight principles and drone systems with glider-building and a live air show, for 95 participants.</p>
              </div>
            </li>
            <li className="timeline-item reveal fade-left">
              <div className="timeline-dot" aria-hidden="true">◆</div>
              <div className="timeline-card">
                <span className="timeline-date">7 February 2026</span>
                <h3>Deliver the Pizza (DTP)</h3>
                <p>Drone design and assembly competition across four teams; Team MACHX6 won, Team Garud finished as runner-up.</p>
              </div>
            </li>
            <li className="timeline-item reveal fade-right">
              <div className="timeline-dot" aria-hidden="true">🏁</div>
              <div className="timeline-card">
                <span className="timeline-date">8 February 2026</span>
                <h3>UAV Racing Competition</h3>
                <p>End-to-end UAV design, FEA/CFD analysis and a live racing round; Team Garud took first place, MACHX6 second.</p>
              </div>
            </li>
            <li className="timeline-item reveal fade-left">
              <div className="timeline-dot" aria-hidden="true">⚡</div>
              <div className="timeline-card">
                <span className="timeline-date">4 April 2026</span>
                <h3>Blitz Competition</h3>
                <p>A three-hour, individual CAD-FEA-CFD sprint testing 21 participants on design, analysis and optimization speed.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ===================== FACULTY IN-CHARGE ===================== */}
      <section className="faculty" aria-labelledby="faculty-heading">
        <div className="container">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Faculty In-Charge</p>
            <h2 id="faculty-heading">Guided by Experience</h2>
          </div>

          <div className="faculty-card reveal fade-up">
            <div className="faculty-photo">
              <img src={facPhoto} alt="Dr. N. V. Swamy Naidu" loading="lazy" />
            </div>

            <div className="faculty-info">
              <h3>Dr. N. V. Swamy Naidu</h3>
              <p className="faculty-role">
                Head of Department, Mechanical Engineering
              </p>
              <p className="faculty-org">
                National Institute of Technology Raipur
              </p>
              <p className="faculty-msg">
                As Chief Guest for Air Force Day and lead speaker at the
                Aerodynamics Workshop, Dr. Naidu has consistently encouraged
                students to combine strong engineering fundamentals with
                practical experimentation. His guidance inspires students to
                innovate, collaborate, and transform ideas into successful
                aviation projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== NOTIFICATIONS ===================== */}
      <section className="notifications" id="notifications" aria-labelledby="notifications-heading">
        <div className="container container-narrow">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Notice Board</p>
            <h2 id="notifications-heading">Recent Notifications</h2>
          </div>
          
          <div className="notice-board reveal fade-up">
            {notificationsData.map((notice) => (
              <NoticeCard 
                key={notice.id}
                date={notice.date}
                title={notice.title}
                summary={notice.summary}
                extraText={notice.extraText}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}