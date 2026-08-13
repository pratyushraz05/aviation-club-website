const projectData = [
  {
    id: 1,
    title: "STOL Development",
    shortTitle: "STOL Aircraft",
    category: "Previous Projects",
    status: "Completed",

    description:
      "Design, analysis, and development of a Short Take-Off and Landing (STOL) aircraft focused on efficient low-speed flight and reduced runway requirements.",

    fullDescription:
      "During the 2025–26 academic session, the Aviation Club undertook the design, analysis, and development of a Short Take-Off and Landing (STOL) aircraft. The project focused on achieving efficient low-speed flight and reduced runway requirements. The development process included literature review, aerodynamic calculations, CAD modelling, structural analysis, CFD simulations, fabrication, testing, troubleshooting, and iterative improvements.",

    objectives: [
      "Achieve efficient low-speed flight",
      "Reduce runway requirements",
      "Apply aerodynamic theory to practical aircraft design",
      "Validate aerodynamic behaviour through simulation",
      "Develop and test a functional aircraft",
    ],

    technologies: [
      "OpenVSP",
      "VSPAERO",
      "Creo",
      "FEA",
      "CFD",
      "Aerodynamics",
    ],

    components: [
      "Lightweight Styrofoam structure",
      "Carbon fibre tape reinforcement",
      "Servo motors",
      "1800 KV brushless motor",
      "9 × 4.5 propeller",
      "11.1 V battery",
      "40 A ESC",
      "Landing gear",
    ],

    outcomes: [
      "Successfully designed and developed a functional STOL aircraft.",
      "Integrated aerodynamic theory with practical design and manufacturing.",
      "Validated analytical and simulation results through real-world flight performance.",
      "Improved understanding of aerodynamic optimization for low-speed and short take-off conditions.",
      "Gained hands-on experience in CAD modelling, FEA, CFD, and prototyping.",
      "Developed problem-solving and iterative design skills.",
      "Strengthened team collaboration, project management, and technical communication.",
    ],
  },

  {
    id: 2,
    title: "VTOL – Vertical Take-Off and Landing UAV",
    shortTitle: "VTOL UAV",
    category: "Current Projects",
    status: "Ongoing",

    description:
      "A VTOL aircraft project focused on analysing tilt-wing and tilt-rotor configurations, control systems, transition behaviour, and MATLAB-based flight simulation.",

    fullDescription:
      "The project focuses on the design, analysis and prototyping of a Vertical Take-Off and Landing (VTOL) aircraft. The team initially studied existing VTOL configurations, control strategies, and transition mechanisms. A tilt-wing mechanism was conceptualized and evaluated before the project shifted toward a tilt-rotor configuration. The current work focuses on MATLAB-based simulation of the tilt-rotor VTOL and analysis of its dynamic behaviour.",

    objectives: [
      "Study different VTOL configurations",
      "Analyse transition mechanisms",
      "Evaluate tilt-wing and tilt-rotor configurations",
      "Study aircraft control systems",
      "Analyse stability during hover, transition, and cruise",
      "Develop a simulation model for VTOL flight behaviour",
      "Establish a foundation for future physical prototyping",
    ],

    technologies: [
      "MATLAB",
      "VTOL Systems",
      "Tilt-Wing Mechanism",
      "Tilt-Rotor Mechanism",
      "Control Systems",
      "Aircraft Simulation",
    ],

    components: [
      "Tilt-wing mechanism",
      "Tilt-rotor configuration",
      "Aircraft control system",
      "Flight dynamics model",
      "MATLAB simulation model",
    ],

    outcomes: [
      "Gained knowledge of tilt-wing and tilt-rotor VTOL configurations.",
      "Developed and evaluated a tilt-wing mechanism.",
      "Performed mechanism calculations for transition feasibility.",
      "Studied control systems for hover, transition, and cruise.",
      "Developed a simulation model representing VTOL dynamic behaviour.",
      "Generated flight parameter plots for roll, pitch, yaw, and transition behaviour.",
      "Established a design and simulation base for future physical prototyping.",
    ],
  },
];

export default projectData;