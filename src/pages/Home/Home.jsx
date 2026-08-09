import { useEffect, useState } from "react";
import "./Home.css";
import logo from "../../assets/logo.png";
import facPhoto from "../../assets/fac.jpg";
// NOTE: about-club.jpg was referenced in the original markup but wasn't
// among the uploaded files. Drop a real photo into src/assets and
// uncomment the import + swap the <img> src below.
// import aboutClubPhoto from "../../assets/about-club.jpg";

export default function Home() {
  const [year] = useState(new Date().getFullYear());

  // Ported from script.js: sticky navbar, mobile menu, scroll reveal,
  // animated counters, smooth-scroll anchors. Runs once on mount and
  // cleans up its listeners/observers on unmount.
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const onScroll = () => {
      if (window.scrollY > 40) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    const closeMenu = () => {
      navLinks?.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    };

    const handleToggleClick = () => {
      const isOpen = navLinks?.classList.toggle("open");
      navToggle?.setAttribute("aria-expanded", String(isOpen));
    };
    navToggle?.addEventListener("click", handleToggleClick);

    const navLinkAnchors = navLinks ? navLinks.querySelectorAll("a") : [];
    navLinkAnchors.forEach((link) => link.addEventListener("click", closeMenu));

    const handleKeydown = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", handleKeydown);

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

    // Animated counters
    const counters = document.querySelectorAll(".reach-number");
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute("data-count"), 10) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1800;
      let start = null;

      const step = (timestamp) => {
        if (start === null) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        el.textContent = Math.floor(eased * target) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      };
      requestAnimationFrame(step);
    };

    let counterObserver;
    if ("IntersectionObserver" in window) {
      counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    } else {
      counters.forEach((el) => animateCounter(el));
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
      window.removeEventListener("scroll", onScroll);
      navToggle?.removeEventListener("click", handleToggleClick);
      navLinkAnchors.forEach((link) => link.removeEventListener("click", closeMenu));
      document.removeEventListener("keydown", handleKeydown);
      revealObserver?.disconnect();
      counterObserver?.disconnect();
      anchorEls.forEach((anchor) => anchor.removeEventListener("click", handleAnchorClick));
    };
  }, []);

  return (
    <>
     

      {/* ===================== HERO ===================== */}
      <section className="hero" id="hero" aria-label="Introduction">
        <div className="hero-bg" aria-hidden="true"></div>
        <div className="hero-overlay" aria-hidden="true"></div>

        <div className="clouds" aria-hidden="true">
          <span className="cloud c1"></span>
          <span className="cloud c2"></span>
          <span className="cloud c3"></span>
        </div>

        <div className="flight-path" aria-hidden="true">
          <svg viewBox="0 0 1000 400" preserveAspectRatio="none">
            <path id="heroPath" d="M -50 320 C 200 340, 350 180, 550 200 S 850 60, 1050 40" />
          </svg>
          <div className="plane-on-path" id="planeOnPath">✈</div>
        </div>

        <div className="hero-content reveal fade-up">
          <p className="eyebrow">Dream &bull; Design &bull; Fly</p>
          <h1>Aviation Club<br /><span>National Institute of Technology Raipur</span></h1>
          <p className="hero-sub">
            From glider builds and CAD workshops to STOL and VTOL aircraft development,
            the Aviation Club turns aerodynamic theory into flight-tested engineering —
            one competition, one prototype at a time.
          </p>
          <div className="hero-buttons">
            <a href="#about" className="btn btn-primary">Explore Club</a>
            <a href="#contact" className="btn btn-secondary">Join Us</a>
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
            <img src="/images/about-club.jpg" alt="Aviation Club members working on a UAV assembly" loading="lazy" />
            <div className="about-badge">
              <strong>6</strong>
              <span>Events organized this session</span>
            </div>
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

      {/* ===================== MISSION & VISION ===================== */}
      <section className="mission-vision" aria-labelledby="mv-heading">
        <div className="container">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Purpose</p>
            <h2 id="mv-heading">Mission &amp; Vision</h2>
          </div>
          <div className="mv-grid">
            <div className="mv-card mv-primary reveal fade-left">
              <div className="mv-icon" aria-hidden="true">🚀</div>
              <h3>Our Mission</h3>
              <p>
                To bridge aerodynamic theory and practical engineering by giving
                students hands-on exposure to CAD, FEA, CFD, and UAV systems —
                through workshops, competitions, and original aircraft projects
                such as our STOL and VTOL builds — while building teamwork,
                precision, and critical thinking along the way.
              </p>
            </div>
            <div className="mv-card reveal fade-right">
              <div className="mv-icon" aria-hidden="true">🔭</div>
              <h3>Our Vision</h3>
              <p>
                To grow NIT Raipur's Aviation Club into a launchpad for
                aerospace-minded engineers — inspiring students to explore
                emerging aviation technologies, take on increasingly complex
                UAV and aircraft designs, and carry that curiosity into
                industry-ready careers.
              </p>
            </div>
          </div>
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

      {/* ===================== CLUB REACH (COUNTERS) ===================== */}
      <section className="reach" aria-labelledby="reach-heading">
        <div className="container">
          <div className="section-head light reveal fade-up">
            <p className="eyebrow">Club Reach</p>
            <h2 id="reach-heading">Measured in flights, not just numbers</h2>
          </div>
          <div className="reach-grid">
            <div className="reach-card reveal fade-up">
              <span className="reach-number" data-count="6">0</span>
              <span className="reach-label">Events Organized</span>
            </div>
            <div className="reach-card reveal fade-up">
              <span className="reach-number" data-count="2">0</span>
              <span className="reach-label">Aircraft Projects</span>
            </div>
            <div className="reach-card reveal fade-up">
              <span className="reach-number" data-count="289" data-suffix="+">0</span>
              <span className="reach-label">Combined Event Participations</span>
            </div>
            <div className="reach-card reveal fade-up">
              <span className="reach-number" data-count="4">0</span>
              <span className="reach-label">Student Competition Teams</span>
            </div>
          </div>
          {/* 50 (Air Force Day) + 75 (DIMENSIONS) + 95 (Aerodynamics Workshop)
              + 24 (DTP) + 24 (UAV Racing) + 21 (Blitz) = 289 */}
        </div>
      </section>

      {/* ===================== ACTIVITIES ===================== */}
      <section className="activities" id="activities" aria-labelledby="activities-heading">
        <div className="container">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Activities</p>
            <h2 id="activities-heading">What we actually build and fly</h2>
          </div>
          <div className="activities-grid">
            <div className="activity-card reveal fade-up">
              <div className="activity-icon" aria-hidden="true">🛬</div>
              <h3>RC Plane Landing</h3>
              <p>Precision landing challenge from Air Force Day, testing control and basic aerodynamic judgment.</p>
            </div>
            <div className="activity-card reveal fade-up">
              <div className="activity-icon" aria-hidden="true">🪂</div>
              <h3>Parachute Landing Challenge</h3>
              <p>Exploring how small design changes affect stability, drag and landing accuracy.</p>
            </div>
            <div className="activity-card reveal fade-up">
              <div className="activity-icon" aria-hidden="true">📐</div>
              <h3>CAD Workshop &amp; Competition</h3>
              <p>Beginner and expert rounds in Creo Parametric as part of the DIMENSIONS workshop.</p>
            </div>
            <div className="activity-card reveal fade-up">
              <div className="activity-icon" aria-hidden="true">🌬️</div>
              <h3>Glider-Making Activity</h3>
              <p>Hands-on glider construction and a friendly build-off during the Aerodynamics Workshop.</p>
            </div>
            <div className="activity-card reveal fade-up">
              <div className="activity-icon" aria-hidden="true">🎥</div>
              <h3>Live Air Show</h3>
              <p>Demonstrations of drones, gliders and RC planes led by industry expert Dr. Aruna Rana.</p>
            </div>
            <div className="activity-card reveal fade-up">
              <div className="activity-icon" aria-hidden="true">🚁</div>
              <h3>Drone Assembly &amp; Flight Trials</h3>
              <p>Teams built quadcopters from scratch and ran live flight trials during Deliver the Pizza.</p>
            </div>
            <div className="activity-card reveal fade-up">
              <div className="activity-icon" aria-hidden="true">🏁</div>
              <h3>UAV Racing</h3>
              <p>A full design-to-flight competition on a dedicated football-ground race track.</p>
            </div>
            <div className="activity-card reveal fade-up">
              <div className="activity-icon" aria-hidden="true">⏱️</div>
              <h3>Blitz: Timed CAD-FEA-CFD Sprint</h3>
              <p>A three-hour individual challenge covering the complete design, analysis and optimization workflow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED PROJECTS ===================== */}
      <section className="projects" id="projects" aria-labelledby="projects-heading">
        <div className="container">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Featured Projects</p>
            <h2 id="projects-heading">From simulation to flight test</h2>
          </div>
          <div className="projects-grid">
            <article className="project-card reveal fade-left">
              <p className="project-tag">Short Take-Off &amp; Landing</p>
              <h3>STOL Aircraft Development</h3>
              <div className="chip-row">
                <span className="chip">Overview</span>
                <span className="chip">CAD</span>
                <span className="chip">CFD</span>
                <span className="chip">FEA</span>
                <span className="chip">Testing</span>
              </div>
              <p>
                A full-cycle STOL build: aerodynamic sizing validated in OpenVSP,
                a Creo CAD model, FEA on the wing structure, CFD on airflow, and a
                Styrofoam-and-carbon-fibre airframe that completed multiple
                flight test rounds.
              </p>
              <button type="button" className="link-btn">Learn More <span aria-hidden="true">→</span></button>
            </article>
            <article className="project-card reveal fade-right">
              <p className="project-tag">Vertical Take-Off &amp; Landing</p>
              <h3>VTOL Aircraft</h3>
              <div className="chip-row">
                <span className="chip">Tilt-Wing</span>
                <span className="chip">Tilt-Rotor</span>
                <span className="chip">MATLAB Simulation</span>
                <span className="chip">Control Systems</span>
              </div>
              <p>
                Ongoing work on a tilt-wing-to-tilt-rotor VTOL, now in
                MATLAB-based dynamic simulation, targeting a 12-14% cut in power
                consumption alongside improved transition stability and payload
                capacity.
              </p>
              <button type="button" className="link-btn">Learn More <span aria-hidden="true">→</span></button>
            </article>
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
            <div className="notice">
              <div className="notice-date"><span aria-hidden="true">📌</span> 04 Apr 2026</div>
              <div className="notice-body">
                <h3>Blitz Competition results announced</h3>
                <p>21 participants completed a three-hour CAD-FEA-CFD design sprint, earning a 100% 4-star-or-above feedback score.</p>
              </div>
              <button type="button" className="link-btn">Read More</button>
            </div>
            <div className="notice">
              <div className="notice-date"><span aria-hidden="true">📌</span> 08 Feb 2026</div>
              <div className="notice-body">
                <h3>UAV Racing Competition: Team Garud wins</h3>
                <p>Team Garud topped the leaderboard on technical documentation and flight performance; Lakshmi Sahithi named Best Mentor.</p>
              </div>
              <button type="button" className="link-btn">Read More</button>
            </div>
            <div className="notice">
              <div className="notice-date"><span aria-hidden="true">📌</span> 07 Feb 2026</div>
              <div className="notice-body">
                <h3>Deliver the Pizza (DTP): Team MACHX6 wins</h3>
                <p>MACHX6 built and flew the strongest quadcopter across four competing teams in this two-phase UAV challenge.</p>
              </div>
              <button type="button" className="link-btn">Read More</button>
            </div>
            <div className="notice">
              <div className="notice-date"><span aria-hidden="true">📌</span> 31 Jan – 01 Feb 2026</div>
              <div className="notice-body">
                <h3>Two-day Aerodynamics Workshop concludes</h3>
                <p>95 participants covered flight principles, drone systems and a live air show with industry expert Dr. Aruna Rana.</p>
              </div>
              <button type="button" className="link-btn">Read More</button>
            </div>
            <div className="notice">
              <div className="notice-date"><span aria-hidden="true">📌</span> 08 Nov 2025</div>
              <div className="notice-body">
                <h3>DIMENSIONS CAD Workshop &amp; Competition held</h3>
                <p>75 participants trained in Creo Parametric before competing across beginner and expert design categories.</p>
              </div>
              <button type="button" className="link-btn">Read More</button>
            </div>
            <div className="notice">
              <div className="notice-date"><span aria-hidden="true">📌</span> 08 Oct 2025</div>
              <div className="notice-body">
                <h3>Air Force Day celebrated at Hira Hall</h3>
                <p>50 participants joined an aviation quiz, RC plane landing and parachute landing challenge with Dr. N. V. Swamy Naidu.</p>
              </div>
              <button type="button" className="link-btn">Read More</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHY JOIN US ===================== */}
      <section className="why-join" aria-labelledby="why-heading">
        <div className="container">
          <div className="section-head reveal fade-up">
            <p className="eyebrow">Why Join</p>
            <h2 id="why-heading">Why students choose the Aviation Club</h2>
          </div>
          <div className="why-grid">
            <div className="why-card reveal fade-up">
              <div className="why-icon" aria-hidden="true">🤝</div>
              <h3>Hands-on Learning</h3>
              <p>Build gliders, assemble quadcopters and run live flight trials instead of only reading about aerodynamics.</p>
            </div>
            <div className="why-card reveal fade-up">
              <div className="why-icon" aria-hidden="true">🔬</div>
              <h3>Research</h3>
              <p>Apply OpenVSP, FEA and CFD on active aircraft projects like the club's STOL and VTOL development.</p>
            </div>
            <div className="why-card reveal fade-up">
              <div className="why-icon" aria-hidden="true">💡</div>
              <h3>Innovation</h3>
              <p>Take a project from literature review through to a working prototype, mentored by senior club members.</p>
            </div>
            <div className="why-card reveal fade-up">
              <div className="why-icon" aria-hidden="true">🏆</div>
              <h3>Competitions</h3>
              <p>Test your skills in Blitz, UAV Racing and Deliver the Pizza against fellow student teams.</p>
            </div>
            <div className="why-card reveal fade-up">
              <div className="why-icon" aria-hidden="true">🚁</div>
              <h3>Drone Technology</h3>
              <p>Work with real flight controllers, ESCs and motors through UAV racing and delivery-drone competitions.</p>
            </div>
            <div className="why-card reveal fade-up">
              <div className="why-icon" aria-hidden="true">📐</div>
              <h3>Technical Skills</h3>
              <p>Train in Creo Parametric from first sketches to parametric modelling in the DIMENSIONS workshop series.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CONTACT BANNER ===================== */}
      <div className="hero-buttons">
        <a href="#about" className="btn btn-primary">
          About Us
        </a>
        <a
          href="https://www.instagram.com/aviation_nitrr/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-light"
        >
          Contact Us
        </a>
      </div>

     
    </>
  );
}
