const mongoose = require("mongoose");
const Project = require("../models/projectModel");

const defaultProjects = [
  {
    projectId: "vtol-uav",
    title: "VTOL – Vertical Take-Off and Landing UAV",
    shortTitle: "VTOL UAV",
    category: "Current Projects",
    status: "Ongoing",
    image: "/images/7.png",
    description: "A VTOL aircraft project focused on analysing tilt-wing and tilt-rotor configurations, control systems, transition behaviour, and MATLAB-based flight simulation.",
    fullDescription: "The project focuses on the design, analysis and prototyping of a Vertical Take-Off and Landing (VTOL) aircraft. The team initially studied existing VTOL configurations, control strategies, and transition mechanisms. A tilt-wing mechanism was conceptualized and evaluated before the project shifted toward a tilt-rotor configuration. The current work focuses on MATLAB-based simulation of the tilt-rotor VTOL and analysis of its dynamic behaviour.",
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
        link: "https://www.mathworks.com/products/matlab.html",
      },
      {
        name: "VTOL Systems",
        description: "Aircraft architectures capable of vertical takeoff, hover, and landing combined with forward flight capabilities.",
        link: "https://www.nasa.gov/vertical-lift/",
      },
      {
        name: "Tilt-Wing Mechanism",
        description: "Aerodynamic system where the entire wing tilts to transition between vertical lift and horizontal cruise.",
        link: "https://en.wikipedia.org/wiki/Tiltwing",
      },
      {
        name: "Tilt-Rotor Mechanism",
        description: "Configuration featuring rotating nacelles to direct thrust vertically or horizontally.",
        link: "https://en.wikipedia.org/wiki/Tiltrotor",
      },
      {
        name: "Control Systems",
        description: "Mathematical modeling of feedback loops to maintain stability and trajectory during flight transitions.",
        link: "https://www.mathworks.com/discovery/control-system.html",
      },
      {
        name: "Aircraft Simulation",
        description: "Virtual modeling of aircraft physics, forces, and moments across diverse flight profiles.",
        link: "https://www.mathworks.com/solutions/aerospace-defense/flight-simulation.html",
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
  {
    projectId: "stol-development",
    title: "STOL Development",
    shortTitle: "STOL Aircraft",
    category: "Previous Projects",
    status: "Completed",
    image: "/images/5.png",
    description: "Design, analysis, and development of a Short Take-Off and Landing (STOL) aircraft focused on efficient low-speed flight and reduced runway requirements.",
    fullDescription: "During the 2025–26 academic session, the Aviation Club undertook the design, analysis, and development of a Short Take-Off and Landing (STOL) aircraft. The project focused on achieving efficient low-speed flight and reduced runway requirements. The development process included literature review, aerodynamic calculations, CAD modelling, structural analysis, CFD simulations, fabrication, testing, troubleshooting, and iterative improvements.",
    mentor: {
      name: "Dr. N.V. Swamy Naidu",
      role: "Faculty In-Charge",
      image: "/src/assets/naidu.jpg",
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
        link: "https://openvsp.org/",
      },
      {
        name: "VSPAERO",
        description: "Computational aerodynamics software integrated with OpenVSP for rapid aerodynamic analysis.",
        link: "https://openvsp.org/wiki/doku.php?id=vspaero",
      },
      {
        name: "Creo",
        description: "3D CAD software utilized for precise component modeling, assemblies, and structural layout planning.",
        link: "https://www.ptc.com/en/products/creo",
      },
      {
        name: "FEA",
        description: "Finite Element Analysis used to predict how structures react to real-world forces and stress.",
        link: "https://www.ansys.com/resources/what-is-fea",
      },
      {
        name: "CFD",
        description: "Computational Fluid Dynamics used to simulate fluid flow, lift, and drag behaviors over the aircraft body.",
        link: "https://www.sciencedirect.com/topics/engineering/computational-fluid-dynamics",
      },
      {
        name: "Aerodynamics",
        description: "The study of the properties of moving air and the interaction between solid bodies and air flows.",
        link: "https://www.nasa.gov/what-is-aerodynamics/",
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
];

const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((e) => e.message);

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A project with this identifier already exists",
    });
  }

  const status = error.statusCode || 500;
  const message = status === 500 ? "Internal server error" : error.message;

  if (status === 500) console.error(error);

  return res.status(status).json({
    success: false,
    message,
  });
};

const getProjects = async (req, res) => {
  try {
    let count = await Project.countDocuments();
    if (count === 0) {
      await Project.insertMany(defaultProjects);
    }

    const data = await Project.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getProjectById = async (req, res) => {
  try {
    let data = null;
    if (mongoose.isValidObjectId(req.params.id)) {
      data = await Project.findById(req.params.id);
    }
    if (!data) {
      data = await Project.findOne({ projectId: req.params.id });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error);
  }
};

const sanitizeProjectPayload = (body, file) => {
  const projectData = { ...body };
  if (file) {
    projectData.image = file.path;
  }

  ["objectives", "components", "outcomes"].forEach((field) => {
    if (projectData[field] !== undefined) {
      if (typeof projectData[field] === "string") {
        try {
          const parsed = JSON.parse(projectData[field]);
          if (Array.isArray(parsed)) {
            projectData[field] = parsed;
            return;
          }
        } catch {
          // not JSON
        }
        projectData[field] = projectData[field]
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
  });

  if (projectData.technologies !== undefined && typeof projectData.technologies === "string") {
    try {
      projectData.technologies = JSON.parse(projectData.technologies);
    } catch {
      // Split comma separated technologies into { name } objects
      projectData.technologies = projectData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((name) => ({ name }));
    }
  }

  if (projectData.mentor !== undefined && typeof projectData.mentor === "string") {
    try {
      projectData.mentor = JSON.parse(projectData.mentor);
    } catch {
      projectData.mentor = { name: projectData.mentor, role: "Mentor", image: "" };
    }
  }

  if (projectData.contributors !== undefined && typeof projectData.contributors === "string") {
    try {
      projectData.contributors = JSON.parse(projectData.contributors);
    } catch {
      projectData.contributors = projectData.contributors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .map((name) => ({ name, role: "Contributor", image: "" }));
    }
  }

  return projectData;
};

const createProject = async (req, res) => {
  try {
    const projectData = sanitizeProjectPayload(req.body, req.file);

    if (!projectData.projectId || !projectData.projectId.trim()) {
      projectData.projectId =
        (projectData.title || "project")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") +
        "-" +
        Date.now().toString(36);
    }

    if (!projectData.fullDescription && projectData.description) {
      projectData.fullDescription = projectData.description;
    }

    const data = await Project.create(projectData);

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const updateProject = async (req, res) => {
  try {
    let filter = mongoose.isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { projectId: req.params.id };

    const updateData = sanitizeProjectPayload(req.body, req.file);

    const data = await Project.findOneAndUpdate(filter, updateData, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteProject = async (req, res) => {
  try {
    let filter = mongoose.isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { projectId: req.params.id };

    const data = await Project.findOneAndDelete(filter);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
