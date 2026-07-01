const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyRole } = require("../middleware/auth");

// GET ROUTES
router.get("/", verifyRole(["getter", "admin"]), (req, res) => {
  const station = localStorage.setItem("station", res.data.user.station);
  db.query("SELECT * FROM route where source = station", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

module.exports = router;