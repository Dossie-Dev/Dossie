const mongoose = require("mongoose");

const ResearchPaperSchema = new mongoose.Schema({
  title: { type: String, default: "Unknown Title" },
  authors: { type: [String], default: [] },
  department: { type: String, default: "Unknown Department" },
  data: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ResearchPaper = mongoose.model("ResearchPaper", ResearchPaperSchema);

module.exports = { ResearchPaper };