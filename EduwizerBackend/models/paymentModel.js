const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  screenshot: {
    type: String, 
    required: true,
  },
  status: {
    type: String,
    enum: ["Approved", "Not Approved", "Rejected"],
    default: "Not Approved",
  },
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;