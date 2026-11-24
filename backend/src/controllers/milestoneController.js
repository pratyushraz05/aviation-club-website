const Milestone = require("../models/milestoneModel");
const EventSetting = require("../models/eventSettingModel");

const defaultMilestonesSeed = [
  {
    icon: "✈",
    date: "8 October 2025",
    title: "Air Force Day Celebration & Quiz",
    desc: "The event commenced with a presentation session, followed by a quiz competition designed to assess participants' knowledge of aviation technology and the history of the Indian Air Force. Dr. N. V. Swamy Naidu graced the occasion as the Chief Guest, providing valuable insights and encouragement to all 50 participants, followed by an RC Plane Landing Competition and Parachute Landing Challenge.",
    link: "/events",
    linkLabel: "Full Event Report →",
    order: 1,
  },
  {
    icon: "◧",
    date: "8 November 2025",
    title: "DIMENSIONS: CAD Workshop & Competition",
    desc: "The Aviation Club organized \"DIMENSIONS – The CAD Workshop & Competition\" to introduce 75 participants to the fundamentals of Computer-Aided Design (CAD). The workshop began with an introductory session teaching the basics of CAD using Creo Parametric software, covering fundamental 3D modelling techniques and engineering applications, followed by beginner and expert design challenges.",
    link: "/events",
    linkLabel: "Full Event Report →",
    order: 2,
  },
  {
    icon: "〜",
    date: "31 Jan – 1 Feb 2026",
    title: "Aerodynamics Workshop & Air Show",
    desc: "A two-day Aerodynamics Workshop organized for 95 participants covering key principles of flight, aircraft take-off mechanisms, forces (lift, drag, thrust, weight), and control mechanisms. The event featured hands-on glider-making, a flying competition, and sessions on drone flight controllers by Dr. Aruna Rana, concluding with a live air show featuring drones, gliders, and RC planes.",
    link: "/events",
    linkLabel: "Full Event Report →",
    order: 3,
  },
  {
    icon: "◆",
    date: "7 February 2026",
    title: "Deliver the Pizza (DTP)",
    desc: "The Aviation Club of NIT Raipur organized the \"Deliver the Pizza (DTP)\" Competition, an interactive, hands-on drone-based event designed to provide students with real-world exposure to drone design, assembly, and flight operations. Four teams participated—MACHX6, Aeroverse, Garud, and Vayuveg—comprising 24 members total, each guided by a senior mentor across design presentations and flight trials.",
    link: "/events",
    linkLabel: "Full Event Report →",
    order: 4,
  },
  {
    icon: "🏁",
    date: "8 February 2026",
    title: "UAV Racing Competition",
    desc: "The UAV Racing Competition combined design, theoretical analysis, fabrication, and flight performance. Beginning two months prior, four mentored teams (MACHX6, Aeroverse, Garud, Vayuveg) underwent training in basic aerodynamics, FEA, CFD, and bill-of-materials planning before building models in the college Makerspace and competing on a dynamic obstacle track on match day.",
    link: "/events",
    linkLabel: "Full Event Report →",
    order: 5,
  },
  {
    icon: "⚡",
    date: "4 April 2026",
    title: "Blitz Competition",
    desc: "Aviation Club conducted Blitz - a technical, software-led competition centred on the practical application of CAD, FEA, and CFD. The event is designed to provide participants (total 21 in number) with a hands-on experience of the complete engineering workflow, where they will design, analyse, and optimize a model within a competitive and time-bound environment.",
    link: "/events",
    linkLabel: "Full Event Report →",
    order: 6,
  },
];

const getMilestones = async (req, res) => {
  try {
    let milestones = await Milestone.find().sort({ order: 1, createdAt: 1 });
    if (milestones.length === 0) {
      const initialized = await EventSetting.findOne({ key: "milestones_initialized" });
      if (!initialized) {
        await Milestone.insertMany(defaultMilestonesSeed);
        await EventSetting.create({ key: "milestones_initialized", value: true });
        milestones = await Milestone.find().sort({ order: 1, createdAt: 1 });
      }
    }
    return res.status(200).json({ success: true, count: milestones.length, data: milestones });
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch milestones" });
  }
};

const createMilestone = async (req, res) => {
  try {
    const { title, date, icon, desc, link, linkLabel, order } = req.body;
    if (!title || !date || !desc) {
      return res.status(400).json({ success: false, message: "Title, date, and description/content are required." });
    }
    const newMilestone = await Milestone.create({
      title: title.trim(),
      date: date.trim(),
      icon: (icon || "✈").trim(),
      desc: desc.trim(),
      link: (link || "/events").trim(),
      linkLabel: (linkLabel || "Full Event Report →").trim(),
      order: Number(order) || 0,
    });
    return res.status(201).json({ success: true, data: newMilestone });
  } catch (error) {
    console.error("Error creating milestone:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create milestone" });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, icon, desc, link, linkLabel, order } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (date !== undefined) updateData.date = date.trim();
    if (icon !== undefined) updateData.icon = icon.trim();
    if (desc !== undefined) updateData.desc = desc.trim();
    if (link !== undefined) updateData.link = link.trim();
    if (linkLabel !== undefined) updateData.linkLabel = linkLabel.trim();
    if (order !== undefined) updateData.order = Number(order) || 0;

    const updated = await Milestone.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Milestone not found" });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating milestone:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update milestone" });
  }
};

const deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Milestone.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Milestone not found" });
    }
    return res.status(200).json({ success: true, message: "Milestone deleted successfully" });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to delete milestone" });
  }
};

const resetMilestones = async (req, res) => {
  try {
    await Milestone.deleteMany({});
    await Milestone.insertMany(defaultMilestonesSeed);
    const milestones = await Milestone.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({ success: true, message: "Milestones reset to defaults successfully", data: milestones });
  } catch (error) {
    console.error("Error resetting milestones:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to reset milestones" });
  }
};

module.exports = {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  resetMilestones,
};
