const express = require("express");
const router = express.Router();
const db = require("../config/db");
const {  verifyToken, verifyRole,} = require("../middleware/auth");

/* =============================
   PROVIDERS
============================= */
 
// GET ALL PROVIDERS
router.get("/providers", verifyToken, verifyRole(["getter"]),
async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT providerName
      FROM mahiber
      ORDER BY providerName
    `);

    res.json(rows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

/* =============================
   VEHICLES
============================= */

// GET ALL VEHICLES
router.get("/vehicles/:station", verifyToken, verifyRole(["getter"]),
async (req, res) => {
  try {
      const { station } = req.params;
    const [rows] = await db.query("SELECT * FROM vehicle WHERE station = ? ORDER BY id DESC",
      [station]);

    res.json(rows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

// ADD VEHICLE
router.post("/vehicles", verifyToken, verifyRole(["getter"]),
async (req, res) => {

  try {

    const {
      plateNumber,
      seatCapacity,
      level,
      provider,
      sideNumber,
      station,
      creator
    } = req.body;

    await db.query(
      `
      INSERT INTO vehicle
      (
        plateNumber,
        seatCapacity,
        level,
        provider,
        sideNumber,
        station,
        creator,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')
      `,
      [
        plateNumber,
        seatCapacity,
        level,
        provider,
        sideNumber,
        station,
        creator
      ]
    );

    res.json({
      success: true,
      message: "Vehicle Added Successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

// UPDATE VEHICLE
router.put("/vehicles/:plateNumber", verifyToken, verifyRole(["getter"]),
async (req, res) => {

  try {

    const { plateNumber } = req.params;

    const {
      seatCapacity,
      level,
      provider,
      sideNumber
    } = req.body;

    await db.query(
      `
      UPDATE vehicle
      SET
        seatCapacity=?,
        level=?,
        provider=?,
        sideNumber=?
      WHERE plateNumber=?
      `,
      [
        seatCapacity,
        level,
        provider,
        sideNumber,
        plateNumber
      ]
    );

    res.json({
      success: true,
      message: "Vehicle Updated"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

// DELETE VEHICLE
router.delete("/vehicles/:plateNumber", verifyToken, verifyRole(["getter"]),
async (req, res) => {

  try {

    await db.query(
      `
      DELETE FROM vehicle
      WHERE plateNumber=?
      `,
      [req.params.plateNumber]
    );

    res.json({
      success: true,
      message: "Vehicle Deleted"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

/* =============================
   ROUTES
============================= */

// GET ROUTES FOR DROPDOWN
router.get("/routes/:station", verifyToken, verifyRole(["getter"]),
async (req, res) => {

  try {
        const { station } = req.params;
    const [rows] = await db.query(`
      SELECT *
      FROM route
      WHERE source = ?
      ORDER BY destinationName
    `, [station]);

    res.json(rows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

/* =============================
   SCHEDULES
============================= */

// GET ALL SCHEDULES
router.get("/schedules/:station", verifyToken, verifyRole(["getter"]),
async (req, res) => {

  try {
        const { station } = req.params;
    const [rows] = await db.query(`
      SELECT
        *,
        (seatCapacity - soldSeats) AS remainingSeats
      FROM schedule
      WHERE source=?
      ORDER BY id DESC
    `,[station]);

    res.json(rows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

// CREATE SCHEDULE
router.post("/schedules", verifyToken, verifyRole(["getter"]),
async (req, res) => {

  try {

    const {
      plateNumber,
      Destination,
      source,
      creator,
      travelDate
    } = req.body;

    // VEHICLE
    const [vehicleRows] = await db.query(
      `
      SELECT *
      FROM vehicle
      WHERE plateNumber=?
      `,
      [plateNumber]
    );

    if (vehicleRows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    const vehicle = vehicleRows[0];

    // PRICE
    const [priceRows] = await db.query(
      `
      SELECT totalPrice
      FROM price
      WHERE Destination=?
      AND VehicleLevel=?
      `,
      [
        Destination,
        vehicle.level
      ]
    );

    if (priceRows.length === 0) {
      return res.status(404).json({
        message:
          "Price not found for selected destination"
      });
    }

    const price = priceRows[0];

    await db.query(
      `
      INSERT INTO schedule
      (
        plateNumber,
        Destination,
        source,
        creator,
        travelDate,
        seatCapacity,
        totalPrice,
        soldSeats
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        plateNumber,
        Destination,
        source,
        creator,
        travelDate,
        vehicle.seatCapacity,
        price.totalPrice,
        0
      ]
    );

    await db.query(
      `
      UPDATE vehicle
      SET status='SCHEDULED'
      WHERE plateNumber=?
      `,
      [plateNumber]
    );

    res.json({
      success: true,
      message: "Schedule Created Successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
}); 
//===========GIVE PERMISSION==========//

router.post(
        "/permit/:id", 
        verifyToken, verifyRole(["getter"]),
        async (req, res) => {
            try {
                const scheduleId = req.params.id;
                const status = req.body.currentstatus;
              await db.query(
                `UPDATE schedule SET status=? WHERE id=?`,
                [status, scheduleId]
              );

              res.json({
                message: "SCHEDULE UPDATED",
              });
            } catch (err) {
              console.log(err);
              res.status(500).json(err);
            }
          });


// UPDATE SCHEDULE
router.put("/schedules/:id", verifyToken, verifyRole(["getter"]),
async (req, res) => {

  try {

    const { id } = req.params;

    const {
      plateNumber,
      Destination,
      travelDate
    } = req.body;

    const [vehicleRows] = await db.query(
      `
      SELECT *
      FROM vehicle
      WHERE plateNumber=?
      `,
      [plateNumber]
    );

    if (vehicleRows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    const vehicle = vehicleRows[0];

    const [priceRows] = await db.query(
      `
      SELECT totalPrice
      FROM price
      WHERE Destination=?
      AND VehicleLevel=?
      `,
      [
        Destination,
        vehicle.level
      ]
    );

    if (priceRows.length === 0) {
      return res.status(404).json({
        message: "Price not found"
      });
    }

    const price = priceRows[0];

    await db.query(
      `
      UPDATE schedule
      SET
        plateNumber=?,
        Destination=?,
        travelDate=?,
        seatCapacity=?,
        totalPrice=?
      WHERE id=?
      `,
      [
        plateNumber,
        Destination,
        travelDate,
        vehicle.seatCapacity,
        price.totalPrice,
        id
      ]
    );

    res.json({
      success: true,
      message: "Schedule Updated Successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

// DELETE SCHEDULE
router.delete("/schedules/:id", verifyToken, verifyRole(["getter"]),
async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT plateNumber
      FROM schedule
      WHERE id=?
      `,
      [req.params.id]
    );

    if (rows.length > 0) {

      await db.query(
        `
        UPDATE vehicle
        SET status='AVAILABLE'
        WHERE plateNumber=?
        `,
        [rows[0].plateNumber]
      );
    }

    await db.query(
      `
      DELETE FROM schedule
      WHERE id=?
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Schedule Deleted Successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
});

module.exports = router;