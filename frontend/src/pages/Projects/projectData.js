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

    mentor: {
      name: "Dr. N.V. Swamy Naidu",
      role: "Faculty In-Charge",
      image: "/assets/naidu.jpg",
    },

    contributors: [
      { name: "Pratyush Raj", role: "Lead Developer", image: "/team/pratyush.jpg" },
      { name: "Raghava", role: "Aerodynamics & CFD", image: "/team/raghava.jpg" },
      { name: "Pravalika", role: "Structure & CAD", image: "/team/pravalika.jpg" },
    ],

    objectives: [
      "Achieve efficient low-speed flight",
      "Reduce runway requirements",
      "Apply aerodynamic theory to practical aircraft design",
      "Validate aerodynamic behaviour through simulation",
      "Develop and test a functional aircraft",
    ],

    technologies: [
      {
        name: "OpenVSP",
        description: "Open Vehicle Sketch Pad is an open-source parametric aircraft geometry tool used for conceptual design.",
        link: "https://openvsp.org/"
      },
      {
        name: "VSPAERO",
        description: "Computational aerodynamics software integrated with OpenVSP for rapid aerodynamic analysis.",
        link: "https://openvsp.org/wiki/doku.php?id=vspaero"
      },
      {
        name: "Creo",
        description: "3D CAD software utilized for precise component modeling, assemblies, and structural layout planning.",
        link: "https://www.ptc.com/en/products/creo"
      },
      {
        name: "FEA",
        description: "Finite Element Analysis used to predict how structures react to real-world forces and stress.",
        link: "https://www.ansys.com/resources/what-is-fea"
      },
      {
        name: "CFD",
        description: "Computational Fluid Dynamics used to simulate fluid flow, lift, and drag behaviors over the aircraft body.",
        link: "https://www.sciencedirect.com/topics/engineering/computational-fluid-dynamics"
      },
      {
        name: "Aerodynamics",
        description: "The study of the properties of moving air and the interaction between solid bodies and air flows.",
        link: "https://www.nasa.gov/what-is-aerodynamics/"
      },
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

    mentor: {
      name: "Honumant Nethani",
      role: "Mentor",
      image: "/team/Honumant.jpg",
    },

    contributors: [
      { name: "Premanvitha", role: "Simulation Lead", image: "/team/premanvitha.jpg" },
      { name: "Amrutha", role: "Control Systems", image: "/team/amrutha.jpg" },
      { name: "Vaishnavi", role: "Flight Dynamics", image: "/team/Vaishnavi.jpg" },
    ],

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
      {
        name: "MATLAB",
        description: "High-level programming environment used for algorithm development, data analysis, and numerical simulation.",
        link: "https://www.mathworks.com/products/matlab.html"
      },
      {
        name: "VTOL Systems",
        description: "Aircraft architectures capable of vertical takeoff, hover, and landing combined with forward flight capabilities.",
        link: "https://www.nasa.gov/vertical-lift/"
      },
      {
        name: "Tilt-Wing Mechanism",
        description: "Aerodynamic system where the entire wing tilts to transition between vertical lift and horizontal cruise.",
        link: "https://en.wikipedia.org/wiki/Tiltwing"
      },
      {
        name: "Tilt-Rotor Mechanism",
        description: "Configuration featuring rotating nacelles to direct thrust vertically or horizontally.",
        link: "https://en.wikipedia.org/wiki/Tiltrotor"
      },
      {
        name: "Control Systems",
        description: "Mathematical modeling of feedback loops to maintain stability and trajectory during flight transitions.",
        link: "https://www.mathworks.com/discovery/control-system.html"
      },
      {
        name: "Aircraft Simulation",
        description: "Virtual modeling of aircraft physics, forces, and moments across diverse flight profiles.",
        link: "https://www.mathworks.com/solutions/aerospace-defense/flight-simulation.html"
      },
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