const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: { type: String, trim: true },
  title: { type: String, required: true },
  shortTitle: { type: String, default: "" },
  category: { type: String, required: true }, // e.g., "Current Projects", "Previous Projects"
  status: { type: String, default: "Ongoing" },   // e.g., "Completed", "Ongoing"
  description: { type: String, required: true },
  fullDescription: { type: String, default: "" },
  image: { type: String, default: "" },
  
  mentor: {
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    image: { type: String, default: "" }, // Cloudinary image URL
  },

  contributors: [
    {
      name: { type: String },
      role: { type: String },
      image: { type: String } // Cloudinary image URL
    }
  ],

  objectives: [{ type: String }],
  
  technologies: [
    {
      name: { type: String },
      description: { type: String },
      link: { type: String }
    }
  ],

  components: [{ type: String }],
  outcomes: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
