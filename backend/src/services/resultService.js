const mongoose = require("mongoose");
const Result = require("../models/resultModel");

const defaultResults = [
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
    speakers: [
      "Aniket Singh, 3rd Year, Mechanical Department, NIT Raipur",
    ],
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
    speakers: [
      "Dr. N. V. Swamy Naidu, HOD, Mechanical Department, NIT Raipur",
    ],
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

const sanitizeList = (val) => {
  if (Array.isArray(val)) {
    return val.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof val === "string") {
    return val
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const pickFields = (body = {}) => {
  const result = {};
  if (body.event !== undefined) result.event = String(body.event).trim();
  if (body.year !== undefined) result.year = String(body.year).trim();
  if (body.date !== undefined) result.date = String(body.date).trim();
  if (body.venue !== undefined) result.venue = String(body.venue).trim();
  if (body.duration !== undefined) result.duration = String(body.duration).trim();
  if (body.position !== undefined) result.position = String(body.position).trim();
  if (body.team !== undefined) result.team = String(body.team).trim();
  if (body.category !== undefined) result.category = String(body.category).trim();
  if (body.description !== undefined) result.description = String(body.description).trim();
  if (body.purpose !== undefined) result.purpose = String(body.purpose).trim();
  if (body.feedback !== undefined) result.feedback = String(body.feedback).trim();
  if (body.speakers !== undefined) result.speakers = sanitizeList(body.speakers);
  if (body.activities !== undefined) result.activities = sanitizeList(body.activities);
  if (body.outcomes !== undefined) result.outcomes = sanitizeList(body.outcomes);
  return result;
};

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid result id");
    err.statusCode = 400;
    throw err;
  }
};

const notFound = () => {
  const err = new Error("Result not found");
  err.statusCode = 404;
  return err;
};

const getAllResults = async () => {
  const count = await Result.countDocuments();
  if (count === 0) {
    try {
      await Result.insertMany(defaultResults);
    } catch (err) {
      console.warn("Initial seeding error for results:", err.message);
    }
  }
  return Result.find().sort({ year: -1, createdAt: -1 });
};

const createResult = async (body) => Result.create(pickFields(body));

const updateResult = async (id, body) => {
  assertValidId(id);
  const updated = await Result.findByIdAndUpdate(id, pickFields(body), {
    new: true,
    runValidators: true,
  });
  if (!updated) throw notFound();
  return updated;
};

const deleteResult = async (id) => {
  assertValidId(id);
  const deleted = await Result.findByIdAndDelete(id);
  if (!deleted) throw notFound();
  return deleted;
};

module.exports = {
  getAllResults,
  createResult,
  updateResult,
  deleteResult,
  defaultResults,
};
