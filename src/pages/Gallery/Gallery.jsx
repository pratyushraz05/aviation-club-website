import { useState } from "react";
import "./Gallery.css";

const galleryData = [
  {
    title: "Air Force Day",
    category: "Events",
    folder: "01_Air_Force_Day",
    images: 3,
    note: "Air Force Day was organised as an engaging introduction to aviation and the role of the Indian Air Force. The programme combined knowledge-based activities with practical challenges, allowing students to explore aviation beyond the classroom. The aviation quiz tested participants on aircraft, aerospace and the Indian Air Force, while the RC Plane Landing Competition focused on precision and control. The Parachute Landing Challenge introduced another practical activity centred around controlled descent and accurate landing. Together, these activities created an interactive environment where students could learn, compete and develop an interest in aviation.",
    highlights: [
      "Aviation & Aerospace Quiz",
      "Indian Air Force Awareness",
      "RC Plane Landing Competition",
      "Precision & Control",
      "Parachute Landing Challenge",
      "Practical Aviation Activities",
    ],
  },

  {
    title: "DIMENSIONS",
    subtitle: "The CAD Workshop & Competition",
    category: "Workshops",
    folder: "02_DIMENSIONS_CAD_Workshop",
    images: 2,
    note: "DIMENSIONS was organised to give students practical exposure to Computer-Aided Design using Creo Parametric. The workshop introduced participants to CAD-based modelling and helped them understand how engineering concepts can be translated into digital three-dimensional models. After the learning session, students participated in separate beginner and expert-level competitions. The competition environment encouraged participants to apply their modelling knowledge independently, work accurately and solve design problems within a limited time. The event connected CAD learning with practical engineering design and healthy competition.",
    highlights: [
      "Creo Parametric",
      "Computer-Aided Design",
      "3D Engineering Modelling",
      "Parametric Modelling",
      "Beginner CAD Challenge",
      "Expert CAD Challenge",
      "Practical Design Skills",
    ],
  },

  {
    title: "Aerodynamics Workshop",
    category: "Workshops",
    folder: "03_Aerodynamics_Workshop",
    images: 3,
    note: "The Aerodynamics Workshop was designed to bridge the gap between theoretical understanding of flight and practical aircraft activities. Students were introduced to fundamental principles of aerodynamics and aircraft components before participating in hands-on activities. Glider making allowed participants to apply their understanding through physical construction, followed by a glider competition that encouraged experimentation and design thinking. The workshop also introduced students to drone technology and included demonstrations involving drones, gliders and RC planes. The combination of technical sessions, hands-on work and live demonstrations gave participants a broader understanding of how aircraft operate in practice.",
    highlights: [
      "Fundamentals of Flight",
      "Aircraft Components",
      "Aerodynamics Concepts",
      "Hands-on Glider Making",
      "Glider Competition",
      "Drone Technology",
      "RC Aircraft Demonstrations",
      "Live Air Show",
    ],
  },

  {
    title: "Deliver the Pizza",
    subtitle: "DTP Competition",
    category: "Competitions",
    folder: "04_Deliver_the_Pizza_DTP",
    images: 3,
    note: "Deliver the Pizza was a practical UAV challenge built around the design, assembly and operation of quadcopters. Participating teams worked with the major components required to build their drones and assembled their aircraft before moving to flight trials. The challenge required teams to take their UAV from the construction stage to an actual operational task. Students had to combine hardware assembly, coordination, flight preparation and problem solving to successfully complete the delivery challenge. The event provided a practical introduction to the engineering and operational aspects of drone technology.",
    highlights: [
      "Quadcopter Design",
      "Drone Assembly",
      "UAV Components",
      "Flight Preparation",
      "Live Flight Trials",
      "Drone Delivery Challenge",
      "Team-Based Engineering",
      "Practical Problem Solving",
    ],
  },

  {
    title: "UAV Racing Competition",
    category: "Competitions",
    folder: "05_UAV_Racing",
    images: 4,
    note: "The UAV Racing Competition followed a complete design-to-flight approach to unmanned aerial vehicle development. Teams worked on the design and manufacturing of their UAVs and used engineering analysis as part of the development process. Before competing, the aircraft went through preparation and technical inspection, followed by flight testing to evaluate their real-world performance. The final racing stage transformed the engineering work into a practical challenge where teams had to demonstrate how effectively their aircraft could perform in flight. The competition gave students exposure to the complete cycle of UAV development, from design and analysis to fabrication, testing and operation.",
    highlights: [
      "UAV Design",
      "Aircraft Manufacturing",
      "Engineering Analysis",
      "FEA & CFD",
      "Technical Inspection",
      "Flight Testing",
      "UAV Racing",
      "Design-to-Flight Workflow",
    ],
  },

  {
    title: "STOL Development",
    subtitle: "Short Take-Off and Landing Aircraft",
    category: "Projects",
    folder: "06_STOL_Development",
    images: 5,
    note: "The STOL aircraft project represents a complete aircraft development effort focused on short take-off and landing capability. The project began with aerodynamic sizing and analysis using OpenVSP to support the aircraft design process. A detailed model was then developed in Creo, while structural behaviour was studied using FEA and airflow behaviour was investigated using CFD. After the analysis and design stages, the aircraft was fabricated using Styrofoam reinforced with carbon-fibre tape. The completed aircraft underwent multiple rounds of flight testing, allowing the team to move from digital design and simulation towards a physical flying prototype. The project demonstrates the club's approach of combining modelling, simulation, fabrication and testing in a single engineering workflow.",
    highlights: [
      "STOL Aircraft Concept",
      "Aerodynamic Sizing",
      "OpenVSP Analysis",
      "Creo CAD Modelling",
      "FEA Structural Analysis",
      "CFD Analysis",
      "Styrofoam Airframe",
      "Carbon-Fibre Reinforcement",
      "Aircraft Fabrication",
      "Flight Testing",
    ],
  },

  {
    title: "VTOL Development",
    subtitle: "Vertical Take-Off and Landing UAV",
    category: "Projects",
    folder: "07_VTOL_Development",
    images: 3,
    note: "The VTOL development project focuses on the study and development of aircraft configurations capable of vertical take-off and landing. The work explores both tilt-wing and tilt-rotor concepts, with attention given to the mechanical feasibility of the required mechanisms. Alongside the physical configuration, the project also considers control-system development and the behaviour of the aircraft during different stages of flight. MATLAB-based dynamic simulation is being used to study the aircraft during hover, transition and cruise conditions. This project represents the club's work towards more advanced aircraft concepts where aerodynamic configuration, mechanical systems, simulation and flight control have to work together.",
    highlights: [
      "VTOL Aircraft Development",
      "Tilt-Wing Configuration",
      "Tilt-Rotor Configuration",
      "Mechanical Feasibility",
      "Flight Control Systems",
      "MATLAB Simulation",
      "Hover Behaviour",
      "Transition Behaviour",
      "Cruise Analysis",
    ],
  },

  {
    title: "Blitz Competition",
    category: "Competitions",
    folder: "08_Blitz_Competition",
    images: 3,
    note: "Blitz was designed as an intensive, time-bound engineering competition based on the complete CAD–FEA–CFD workflow. Participants were required to work through the stages of engineering design, modelling and analysis within a strict time constraint. The challenge tested how quickly and accurately participants could create their designs, evaluate their structural and aerodynamic behaviour and make improvements based on the analysis. Unlike a conventional workshop where participants can work at their own pace, Blitz placed emphasis on technical decision-making, efficiency and optimisation under pressure. It provided students with an opportunity to apply multiple engineering tools together in a competitive environment.",
    highlights: [
      "CAD Modelling",
      "Engineering Design",
      "FEA",
      "CFD",
      "Structural Analysis",
      "Aerodynamic Analysis",
      "Design Optimisation",
      "Time-Bound Problem Solving",
      "Complete CAD–FEA–CFD Workflow",
    ],
  },
];

const filters = ["All", "Events", "Workshops", "Competitions", "Projects"];

const getImages = (item) =>
  Array.from(
    { length: item.images },
    (_, i) => `/gallery/${item.folder}/${i + 1}.png`
  );

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const sections =
    filter === "All"
      ? galleryData
      : galleryData.filter((item) => item.category === filter);

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
      </header>

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

      <section className="gallery-grid">
        {sections.map((item) => {
          const images = getImages(item);

          return (
            <article className="gallery-card" key={item.folder}>
              <div className="gallery-cover">
                <img src={images[0]} alt={item.title} />
                <span>{item.category}</span>
                <b>{item.images} Photos</b>
              </div>

              <div className="gallery-card-content">
                <h2>{item.title}</h2>

                {item.subtitle && <h3>{item.subtitle}</h3>}

                <p>{item.note}</p>

                <div className="gallery-highlights">
                  {item.highlights.slice(0, 4).map((highlight) => (
                    <span key={highlight}>{highlight}</span>
                  ))}
                </div>

                <button
                  className="view-gallery"
                  onClick={() => setSelected(item)}
                >
                  Explore Gallery <span>→</span>
                </button>
              </div>
            </article>
          );
        })}
      </section>

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

              <p>{selected.note}</p>

              <h4>What We Explored</h4>

              <div className="gallery-highlights">
                {selected.highlights.map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
            </div>

            <div className="modal-images">
              {getImages(selected).map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`${selected.title} ${index + 1}`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}