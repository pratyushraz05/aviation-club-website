const express = require("express");

const router = express.Router();

const team = {
  faculty: [
    {
      name: "Dr. N.V. Swamy Naidu",
      role: "Faculty In-Charge",
    },
  ],

  mentor: [
    {
      name: "Honumant Nethani",
      role: "Mentor",
    },
  ],

  coreTeam: [
    {
      name: "Sivaratri Lakshmi Sahithi",
      role: "Core Team",
    },
    {
      name: "Kritika Tripathi",
      role: "Core Team",
    },
  ],

  technicalTeam: [
    {
      name: "RAGHAVA",
      branch: "IT",
      role: "Technical Team",
    },
    {
      name: "PRATYUSH RAJ",
      branch: "CSE",
      role: "Technical Team",
    },
    {
      name: "PRAVALIKA",
      branch: "IT",
      role: "Technical Team",
    },
    {
      name: "PREMANVITHA",
      branch: "CSE",
      role: "Technical Team",
    },
    {
      name: "AMRUTHA",
      branch: "CSE",
      role: "Technical Team",
    },
    {
      name: "VAISHNAVI",
      branch: "CSE",
      role: "Technical Team",
    },
  ],

  nonTechnicalTeam: [
    {
      name: "Subhash Kumar Saho",
      branch: "MECHANICAL",
      role: "Non-Technical Team",
    },
    {
      name: "Ashwajit Dalal",
      branch: "MECHANICAL",
      role: "Non-Technical Team",
    },
    {
      name: "Kritika Misti",
      branch: "MECHANICAL",
      role: "Non-Technical Team",
    },
    {
      name: "Shivesh Vikrant S",
      branch: "MECHANICAL",
      role: "Non-Technical Team",
    },
    {
      name: "Joshnavi",
      branch: "MECHANICAL",
      role: "Non-Technical Team",
    },
    {
      name: "Aman",
      branch: "MECHANICAL",
      role: "Non-Technical Team",
    },
    {
      name: "Rasazna",
      branch: "MECHANICAL",
      role: "Non-Technical Team",
    },
    {
      name: "Pranav",
      branch: "MECHANICAL",
      role: "Non-Technical Team",
    },
    {
      name: "V Sai Akhil",
      branch: "MECHANICAL",
      role: "Non-Technical Team",
    },
    {
      name: "Jasmitha Abhi",
      branch: "ECE",
      role: "Non-Technical Team",
    },
    {
      name: "Vijay Karan",
      branch: "MECHANICAL",
      role: "Non-Technical Team",
    },
  ],
};

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: team,
  });
});

module.exports = router;