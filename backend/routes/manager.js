const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../config/db");
const {  verifyToken, verifyRole,} = require("../middleware/auth");


/* =========================================================
   USERS SECTION (already working - unchanged logic)
========================================================= */

// GET USERS BY ROLE
router.get("/users/:role",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    const { role } = req.params;

    const [users] = await db.query(
      `
      SELECT id, firstName, lastName, email, phoneNumber, role
      FROM user
      WHERE role = ?
      ORDER BY id DESC
      `,
      [role]
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD USER
router.post("/users",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const [existing] = await db.query(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO user (firstName, lastName, email, phoneNumber, password, role)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [firstName, lastName, email, phoneNumber, hashedPassword, role]
    );

    res.json({ success: true, message: "User Added Successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE USER
router.put("/users/:id",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber } = req.body;

    await db.query(
      `
      UPDATE user
      SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?
      WHERE id = ?
      `,
      [firstName, lastName, email, phoneNumber, id]
    );

    res.json({ success: true, message: "User Updated Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE USER
router.delete("/users/:id",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM user WHERE id = ?", [id]);

    res.json({ success: true, message: "User Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   ROUTE MANAGEMENT (NEW)
========================================================= */

// GET ROUTES
router.get("/routes/:station",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try { 
    const { station } = req.params;
     const [routes] = await db.query(
      "SELECT * FROM route WHERE source = ? ORDER BY id DESC",
      [station]
    );
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD ROUTE
router.post("/routes",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    const { destinationName, DestinationRegion, Distance,source, creator } = req.body;

    await db.query(
      `
      INSERT INTO route (destinationName, DestinationRegion, Distance,source, creator)
      VALUES (?, ?, ?, ?, ?)
      `,
      [destinationName, DestinationRegion, Distance,source, creator]
    );

    res.json({ success: true, message: "Route Added Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE ROUTE
router.put("/routes/:name",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    const { name } = req.params;
    const { DestinationRegion, Distance } = req.body;

    await db.query(
      `
      UPDATE route
      SET DestinationRegion = ?, Distance = ?
      WHERE destinationName = ?
      `,
      [DestinationRegion, Distance, name]
    );

    res.json({ success: true, message: "Route Updated Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE ROUTE
router.delete("/routes/:name",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    const { name } = req.params;

    await db.query("DELETE FROM route WHERE destinationName = ?", [name]);

    res.json({ success: true, message: "Route Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   PRICE MANAGEMENT (NEW)
========================================================= */

// GET PRICES
// ================= PRICE MANAGEMENT =================

// GET ALL PRICES
router.get("/prices",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    const [prices] = await db.query(
      "SELECT * FROM price ORDER BY id DESC"
    );

    res.json(prices);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ADD PRICE
router.post("/prices",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    const {
      totalPrice,
      Destination,
      VehicleLevel,
      Creator,
    } = req.body;

    const total = parseFloat(totalPrice);

    const serviceCharge = (
      total * 0.017
    ).toFixed(2);

    const tariff = (
      total - serviceCharge
    ).toFixed(2);

    const [result] = await db.query(
      `
      INSERT INTO price
      (
        totalPrice,
        tariff,
        serviceCharge,
        Destination,
        VehicleLevel,
        Creator
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        total,
        tariff,
        serviceCharge,
        Destination,
        VehicleLevel,
        Creator,
      ]
    );

    res.json({
      success: true,
      id: result.insertId,
      message: "Price Added Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE PRICE
router.put("/prices/:id",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    const { id } = req.params;

    const {
      totalPrice,
      Destination,
      VehicleLevel,
    } = req.body;

    const total = parseFloat(totalPrice);

    const serviceCharge = (
      total * 0.017
    ).toFixed(2);

    const tariff = (
      total - serviceCharge
    ).toFixed(2);

    await db.query(
      `
      UPDATE price
      SET
        totalPrice = ?,
        tariff = ?,
        serviceCharge = ?,
        Destination = ?,
        VehicleLevel = ?
      WHERE id = ?
      `,
      [
        total,
        tariff,
        serviceCharge,
        Destination,
        VehicleLevel,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Price Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE PRICE
router.delete("/prices/:id",  verifyToken, verifyRole(["manager"]),
  async (req, res) => {
  try {
    await db.query(
      "DELETE FROM price WHERE id = ?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Price Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// Reset manager password
router.put("/reset-password/:id",  verifyToken, verifyRole(["manager"]),
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
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;