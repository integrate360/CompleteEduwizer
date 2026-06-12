const mongoose = require("mongoose");

const AdvertisingSchema = new mongoose.Schema(
  {
    targetAudience: { type: String, required: false },
    image: { type: String, required: true },
    link: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Advertising = mongoose.model("Advertising", AdvertisingSchema);

module.exports = Advertising;
