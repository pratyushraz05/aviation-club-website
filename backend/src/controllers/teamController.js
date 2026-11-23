const TeamMember = require("../models/teamMemberModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const defaultTeamMembers = [
  // Faculty
  {
    name: "Dr. N.V. Swamy Naidu",
    role: "Faculty In-Charge",
    section: "faculty",
    branch: "Mechanical",
    image: "/src/assets/naidu.jpg",
    order: 1,
  },
  // Mentor
  {
    name: "Honumant Nethani",
    role: "Mentor",
    section: "mentor",
    branch: "",
    image: "/team/Honumant.jpg",
    order: 2,
  },
  // Core Team
  {
    name: "Sivaratri Lakshmi Sahithi",
    role: "President",
    section: "coreTeam",
    branch: "4th Year",
    image: "",
    order: 3,
  },
  {
    name: "Kritika Tripathi",
    role: "Vice President",
    section: "coreTeam",
    branch: "4th Year",
    image: "",
    order: 4,
  },
  // Technical Team
  {
    name: "RAGHAVA",
    role: "Core Member",
    section: "technicalTeam",
    branch: "IT",
    image: "/team/raghava.jpg",
    order: 5,
  },
  {
    name: "PRATYUSH RAJ",
    role: "Core Member",
    section: "technicalTeam",
    branch: "CSE",
    image: "/team/pratyush.jpg",
    order: 6,
  },
  {
    name: "PRAVALIKA",
    role: "Core Member",
    section: "technicalTeam",
    branch: "IT",
    image: "/team/pravalika.jpg",
    order: 7,
  },
  {
    name: "PREMANVITHA",
    role: "Core Member",
    section: "technicalTeam",
    branch: "CSE",
    image: "/team/premanvitha.jpg",
    order: 8,
  },
  {
    name: "AMRUTHA",
    role: "Core Member",
    section: "technicalTeam",
    branch: "CSE",
    image: "/team/amrutha.jpg",
    order: 9,
  },
  {
    name: "VAISHNAVI",
    role: "Core Member",
    section: "technicalTeam",
    branch: "CSE",
    image: "/team/Vaishnavi.jpg",
    order: 10,
  },
  // Non-Technical Team
  {
    name: "Subhash Kumar Saho",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/subhash.jpg",
    order: 11,
  },
  {
    name: "Ashwajit Dalal",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/ashwajit.jpg",
    order: 12,
  },
  {
    name: "Kritika Misti",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/kritika-misti.jpg",
    order: 13,
  },
  {
    name: "Shivesh Vikrant S",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/shivesh.jpg",
    order: 14,
  },
  {
    name: "Joshnavi",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/joshnavi.jpg",
    order: 15,
  },
  {
    name: "Aman",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/aman.jpg",
    order: 16,
  },
  {
    name: "Rasazna",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/Rasazna.jpg",
    order: 17,
  },
  {
    name: "Pranav",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/pranav.jpg",
    order: 18,
  },
  {
    name: "V Sai Akhil",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/abhijeet.jpg",
    order: 19,
  },
  {
    name: "Jasmitha Abhi",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "ECE",
    image: "/team/jamniti-abhi.jpg",
    order: 20,
  },
  {
    name: "Vijay Karan",
    role: "Core Member",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/vijay.jpg",
    order: 21,
  },
];

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "aviation-club/team" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const getTeam = async (req, res, next) => {
  try {
    let count = await TeamMember.countDocuments();
    if (count === 0) {
      await TeamMember.insertMany(defaultTeamMembers);
    }

    const members = await TeamMember.find({}).sort({ order: 1, createdAt: 1 });

    const grouped = {
      faculty: members.filter((m) => m.section === "faculty"),
      mentor: members.filter((m) => m.section === "mentor"),
      coreTeam: members.filter((m) => m.section === "coreTeam"),
      technicalTeam: members.filter((m) => m.section === "technicalTeam"),
      nonTechnicalTeam: members.filter((m) => m.section === "nonTechnicalTeam"),
    };

    const standardKeys = new Set(["faculty", "mentor", "coreTeam", "technicalTeam", "nonTechnicalTeam"]);
    const customSections = {};
    members.forEach((m) => {
      if (m.section && !standardKeys.has(m.section)) {
        if (!customSections[m.section]) {
          customSections[m.section] = [];
        }
        customSections[m.section].push(m);
      }
    });

    res.status(200).json({
      success: true,
      count: members.length,
      data: grouped,
      customSections,
      allMembers: members,
    });
  } catch (error) {
    next(error);
  }
};

const addTeamMember = async (req, res, next) => {
  try {
    const { name, role, section, branch, image: imageUrlInput, order } = req.body;

    if (!name || !role || !section) {
      return res.status(400).json({
        success: false,
        message: "Name, role, and section are required",
      });
    }

    let finalImageUrl = imageUrlInput || "";

    if (req.file) {
      if (req.file.path) {
        finalImageUrl = req.file.path; // multer-storage-cloudinary path
      } else if (req.file.buffer) {
        finalImageUrl = await uploadToCloudinary(req.file.buffer);
      }
    }

    const member = await TeamMember.create({
      name: name.trim(),
      role: role.trim(),
      section: section.trim(),
      branch: branch ? branch.trim() : "",
      image: finalImageUrl,
      order: order !== undefined && order !== "" ? Number(order) : 0,
    });

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

const updateTeamMember = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      if (req.file.path) {
        updateData.image = req.file.path;
      } else if (req.file.buffer) {
        updateData.image = await uploadToCloudinary(req.file.buffer);
      }
    }

    if (updateData.order !== undefined && updateData.order !== "") {
      updateData.order = Number(updateData.order);
    }
    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.role) updateData.role = updateData.role.trim();
    if (updateData.section) updateData.section = updateData.section.trim();
    if (updateData.branch) updateData.branch = updateData.branch.trim();

    const member = await TeamMember.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeam,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
};

