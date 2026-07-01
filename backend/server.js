const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// AUTH ROUTES
app.use("/api/auth", require("./routes/auth"));

// ROLE MODULES
app.use("/api/admin", require("./routes/admin"));
app.use("/api/manager", require("./routes/manager"));
app.use("/api/ticketer", require("./routes/ticketer"));
app.use("/api/finance", require("./routes/finance"));

// FEATURE ROUTES
app.use("/api/vehicle", require("./routes/vehicles"));
app.use("/api/route", require("./routes/route"));
app.use("/api/schedule", require("./routes/schedule"));
app.use("/api/getter", require("./routes/getter"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});