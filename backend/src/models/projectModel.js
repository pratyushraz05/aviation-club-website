const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortTitle: { type: String },
  category: { type: String, required: true }, // e.g., "Current Projects", "Previous Projects"
  status: { type: String, required: true },   // e.g., "Completed", "Ongoing"
  description: { type: String, required: true },
  fullDescription: { type: String, required: true },
  
  mentor: {
    name: { type: String },
    role: { type: String },
    image: { type: String }, // Cloudinary image URL
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