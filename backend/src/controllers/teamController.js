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
    role: "Core Team",
    section: "coreTeam",
    branch: "4th Year",
    image: "",
    order: 3,
  },
  {
    name: "Kritika Tripathi",
    role: "Core Team",
    section: "coreTeam",
    branch: "4th Year",
    image: "",
    order: 4,
  },
  // Technical Team
  {
    name: "RAGHAVA",
    role: "Technical Team",
    section: "technicalTeam",
    branch: "IT",
    image: "/team/raghava.jpg",
    order: 5,
  },
  {
    name: "PRATYUSH RAJ",
    role: "Technical Team",
    section: "technicalTeam",
    branch: "CSE",
    image: "/team/pratyush.jpg",
    order: 6,
  },
  {
    name: "PRAVALIKA",
    role: "Technical Team",
    section: "technicalTeam",
    branch: "IT",
    image: "/team/pravalika.jpg",
    order: 7,
  },
  {
    name: "PREMANVITHA",
    role: "Technical Team",
    section: "technicalTeam",
    branch: "CSE",
    image: "/team/premanvitha.jpg",
    order: 8,
  },
  {
    name: "AMRUTHA",
    role: "Technical Team",
    section: "technicalTeam",
    branch: "CSE",
    image: "/team/amrutha.jpg",
    order: 9,
  },
  {
    name: "VAISHNAVI",
    role: "Technical Team",
    section: "technicalTeam",
    branch: "CSE",
    image: "/team/Vaishnavi.jpg",
    order: 10,
  },
  // Non-Technical Team
  {
    name: "Subhash Kumar Saho",
    role: "Non-Technical Team",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/subhash.jpg",
    order: 11,
  },
  {
    name: "Ashwajit Dalal",
    role: "Non-Technical Team",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/ashwajit.jpg",
    order: 12,
  },
  {
    name: "Kritika Misti",
    role: "Non-Technical Team",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/kritika-misti.jpg",
    order: 13,
  },
  {
    name: "Shivesh Vikrant S",
    role: "Non-Technical Team",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/shivesh.jpg",
    order: 14,
  },
  {
    name: "Joshnavi",
    role: "Non-Technical Team",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/joshnavi.jpg",
    order: 15,
  },
  {
    name: "Aman",
    role: "Non-Technical Team",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/aman.jpg",
    order: 16,
  },
  {
    name: "Rasazna",
    role: "Non-Technical Team",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/Rasazna.jpg",
    order: 17,
  },
  {
    name: "Pranav",
    role: "Non-Technical Team",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/pranav.jpg",
    order: 18,
  },
  {
    name: "V Sai Akhil",
    role: "Non-Technical Team",
    section: "nonTechnicalTeam",
    branch: "MECHANICAL",
    image: "/team/abhijeet.jpg",
    order: 19,
  },
  {
    name: "Jasmitha Abhi",
    role: "Non-Technical Team",
    section: "nonTechnicalTeam",
    branch: "ECE",
    image: "/team/jamniti-abhi.jpg",
    order: 20,
  },
  {
    name: "Vijay Karan",
    role: "Non-Technical Team",
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

    res.status(200).json({
      success: true,
      count: members.length,
      data: grouped,
      allMembers: members,
    });
  } catch (error) {
    next(error);
  }
};

const addTeamMember = async (req, res, next) => {
  try {
    const { name, role, section, branch, image: imageUrlInput } = req.body;

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
      section,
      branch: branch ? branch.trim() : "",
      image: finalImageUrl,
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
