const rateLimit = require("express-rate-limit");

const json = (res, message) =>
  res.status(429).json({ success: 0, data: [], message });

/**
 * Auth endpoints (login / send-otp / verify-otp / forgot-password).
 * Tight enough to stop brute force, loose enough that no real user is affected.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 attempts / IP / window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    json(res, "Too many attempts. Please try again in a few minutes."),
});

/** Upload endpoint — blocks bulk/abusive uploads while keeping signup usable. */
const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 uploads / IP / window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    json(res, "Too many uploads. Please try again later."),
});

module.exports = { authLimiter, uploadLimiter };
