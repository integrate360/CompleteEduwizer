require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");

// ---- CORS allowlist (env-driven with safe defaults) ----
// Override/extend via CORS_ORIGINS in .env (comma-separated). Known production
// + local dev origins are allowed by default so nothing breaks.
const DEFAULT_ORIGINS = [
  "https://eduwizer.com",
  "https://www.eduwizer.com",
  "https://ngeduwizer.com",
  "https://www.ngeduwizer.com",
  "http://localhost:5173",
  "http://localhost:4000",
  "http://localhost:3000",
];
const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...DEFAULT_ORIGINS, ...envOrigins]);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow no-origin requests (curl, mobile apps, server-to-server)
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

//listening on port
app.listen(process.env.port, function () {
  console.log("user " + " api started on port: " + process.env.port);
});

const routes = require("./routes/route");
const adminRoutes = require("./routes/routeAdminPanel");
routes(app);
adminRoutes(app);
