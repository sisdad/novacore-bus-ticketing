const express = require("express");
const db = require("../config/db");
const bcrypt = require("bcrypt");

// ✅ IMPORTANT: only ONE import
const { verifyToken,verifyRole } = require("../middleware/auth");

const router = express.Router();

/* =========================================
   DASHBOARD (ADMIN ONLY)
========================================= */
router.get(
  "/dashboard",
  verifyToken,verifyRole(["admin"]),
  async (req, res) => {
    try {
      const [stations] = await db.query(`
        SELECT s.*, u.firstName AS creatorName
        FROM station s
        LEFT JOIN user u ON s.creator = u.id
      `);

      const [managers] = await db.query(`
        SELECT id, firstName, lastName, email, phoneNumber
        FROM user
        WHERE role='manager'
      `);

      res.json({ stations, managers });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* =========================================
   STATIONS (ADMIN ONLY)
========================================= */

// GET ALL STATIONS
router.get(
  "/stations",
  verifyToken,verifyRole(["admin"]),
  async (req, res) => {
    try {
      const [stations] = await db.query(`
        SELECT *
        FROM station
        ORDER BY id DESC
      `);

      res.json(stations);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// CREATE STATION
router.post(
  "/stations",
  verifyToken,verifyRole(["admin"]),
  async (req, res) => {
    try {
      const { stationName, Region } = req.body;

      const [result] = await db.query(
        `INSERT INTO station (stationName, Region) VALUES (?, ?)`,
        [stationName, Region]
      );

      res.json({ success: true, id: result.insertId });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// UPDATE STATION
router.put(
  "/stations/:id",
  verifyToken,verifyRole(["admin"]),
  async (req, res) => {
    try {
      const { stationName, Region } = req.body;

      await db.query(
        `UPDATE station SET stationName=?, Region=? WHERE id=?`,
        [stationName, Region, req.params.id]
      );

      res.json({ message: "Station Updated" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE STATION
router.delete(
  "/stations/:id",
  verifyToken,verifyRole(["admin"]),
  async (req, res) => {
    try {
      await db.query(`DELETE FROM station WHERE id=?`, [req.params.id]);
      res.json({ message: "Station Deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* =========================================
   MANAGERS (ADMIN ONLY)
========================================= */

// GET ALL MANAGERS
router.get(
  "/managers",
  verifyToken,verifyRole(["admin"]),
  async (req, res) => {
    try {
      const [managers] = await db.query(`
        SELECT *
        FROM user
        WHERE role='manager'
        ORDER BY id DESC
      `);

      res.json(managers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// CREATE MANAGER
router.post(
  "/managers",
  verifyToken,verifyRole(["admin"]),
  async (req, res) => {
    try {
      const { firstName, lastName, email, password, phoneNumber, stationId } = req.body;

      const hashed = await bcrypt.hash(password, 10);

      await db.query(
        `INSERT INTO user (firstName, lastName, email, password, phoneNumber, station, role)
         VALUES (?, ?, ?, ?, ?, 'manager')`,
        [firstName, lastName, email, hashed, phoneNumber, stationId]
      );

      res.json({ message: "Manager Created" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// UPDATE MANAGER
router.put(
  "/managers/:id",
  verifyToken,verifyRole(["admin"]),
  async (req, res) => {
    try {
      const { firstName, lastName, phoneNumber } = req.body;

      await db.query(
        `UPDATE user SET firstName=?, lastName=?, phoneNumber=? WHERE id=?`,
        [firstName, lastName, phoneNumber, req.params.id]
      );

      res.json({ message: "Manager Updated" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE MANAGER
router.delete(
  "/managers/:id",
  verifyToken,verifyRole(["admin"]),
  async (req, res) => {
    try {
      await db.query(`DELETE FROM user WHERE id=?`, [req.params.id]);

      res.json({ message: "Manager Deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// RESET PASSWORD
router.put(
  "/reset-password/:id",
  verifyToken,verifyRole(["admin"]),
  async (req, res) => {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          message: "Password is required",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.query(
        "UPDATE user SET password=? WHERE id=?",
        [hashedPassword, req.params.id]
      );

      res.json({
        message: "Password reset successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;