const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  prize: {
    type: String,
    required: true,
  },
  months: {
    type: Number,
    required: true,
  },
  specialPrize: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    enum: ["vendor", "candidate", "counsellor", "institute"],
    required: true,
  },
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
