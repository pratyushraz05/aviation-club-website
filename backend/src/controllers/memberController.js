const Announcement = require("../models/announcementModel");
const Resource = require("../models/resourceModel");

// Default initial data for club members
const defaultAnnouncements = [
  {
    title: "Weekly Aeromodelling & Flight Test Session",
    content: "All technical domain members are required to attend this Saturday's flight test session at the Main Ground from 3:00 PM onwards. Bring your telemetry logs and battery packs.",
    category: "meeting",
    postedBy: "Technical Head",
    pinned: true,
  },
  {
    title: "CAD & Creo Modelling Repository Updated",
    content: "The latest 3D wing-spar structural models for the RC Glider have been uploaded. Check the Resources tab to review before Thursday's design review.",
    category: "workshop",
    postedBy: "Aerodynamics Lead",
    pinned: false,
  },
  {
    title: "Inter-College Drone Racing Registrations Open",
    content: "Team rosters for the upcoming UAV Racing championship are being finalized. Members interested in pilot or pit-crew roles, contact Sahithi or Kritika.",
    category: "competition",
    postedBy: "President",
    pinned: false,
  },
];

const defaultResources = [
  {
    title: "RC Aircraft Wing Design & NACA Airfoil Datasets",
    description: "Standard airfoil coordinates (NACA 2412, NACA 4412) and chord sizing spreadsheets for trainer gliders.",
    category: "Aerodynamics",
    url: "https://drive.google.com",
    fileType: "drive",
    uploadedBy: "Aerodynamics Team",
  },
  {
    title: "Creo Parametric 3D CAD Parts & Fuselage Assemblies",
    description: "Complete STEP and PRT files for STOL cargo plane and VTOL tilt-rotor mechanism.",
    category: "CAD",
    url: "https://github.com",
    fileType: "cad",
    uploadedBy: "Mechanical Team",
  },
  {
    title: "Flight Controller ArduPilot & Mission Planner Config",
    description: "PID tuning presets, waypoint navigation scripts, and telemetry baud-rate settings for Pixhawk 4.",
    category: "Avionics",
    url: "https://ardupilot.org",
    fileType: "link",
    uploadedBy: "Avionics Team",
  },
  {
    title: "NIT Raipur Aviation Club Constitution & Operating Manual",
    description: "Official club bylaws, workshop safety guidelines, and ground-pilot safety checklist.",
    category: "Guidelines",
    url: "https://nitrr.ac.in",
    fileType: "pdf",
    uploadedBy: "Core Team",
  },
];

const getAnnouncements = async (req, res, next) => {
  try {
    let announcements = await Announcement.find({}).sort({ pinned: -1, createdAt: -1 });
    if (announcements.length === 0) {
      await Announcement.insertMany(defaultAnnouncements);
      announcements = await Announcement.find({}).sort({ pinned: -1, createdAt: -1 });
    }
    res.status(200).json({ success: true, count: announcements.length, announcements });
  } catch (error) {
    next(error);
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, category, pinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      category: category || "general",
      postedBy: req.user.name || "Club Head",
      pinned: !!pinned,
    });

    res.status(201).json({ success: true, announcement });
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const item = await Announcement.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Announcement not found" });
    res.status(200).json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    next(error);
  }
};

const getResources = async (req, res, next) => {
  try {
    let resources = await Resource.find({}).sort({ createdAt: -1 });
    if (resources.length === 0) {
      await Resource.insertMany(defaultResources);
      resources = await Resource.find({}).sort({ createdAt: -1 });
    }
    res.status(200).json({ success: true, count: resources.length, resources });
  } catch (error) {
    next(error);
  }
};

const createResource = async (req, res, next) => {
  try {
    const { title, description, category, url, fileType } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, message: "Title and URL are required" });
    }

    const resource = await Resource.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      category: category || "Guidelines",
      url: url.trim(),
      fileType: fileType || "link",
      uploadedBy: req.user.name || "Club Lead",
    });

    res.status(201).json({ success: true, resource });
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const item = await Resource.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Resource not found" });
    res.status(200).json({ success: true, message: "Resource deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getResources,
  createResource,
  deleteResource,
};

