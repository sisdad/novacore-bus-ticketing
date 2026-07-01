const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyRole } = require("../middleware/auth");

// GET ALL VEHICLES
router.get("/", verifyRole(["getter", "admin"]), (req, res) => {
  db.query("SELECT * FROM vehicle", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// INSERT VEHICLE (FIRST TIME REGISTRATION)
router.post("/", verifyRole(["getter", "admin"]), (req, res) => {
  const { plateNumber, seatCapacity, level, provider, creator } = req.body;

  const sql = `
    INSERT INTO vehicle (plateNumber, seatCapacity, level, provider, creator)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [plateNumber, seatCapacity, level, provider, creator],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Vehicle registered", result });
    }
  );
});

module.exports = router;