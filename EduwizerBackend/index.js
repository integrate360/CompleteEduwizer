require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");

app.use(cors());

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
