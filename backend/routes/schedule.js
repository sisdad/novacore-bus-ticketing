const express = require("express");
const router = express.Router();

const db = require("../config/db");
const { verifyRole } = require("../middleware/auth");

/* ===================================
   GET ALL SCHEDULES
=================================== */
router.get(
  "/",
  verifyRole(["getter", "admin"]),
  async (req, res) => {
    try {

      const [rows] = await db.promise().query(`
        SELECT
          *,
          (seatCapacity - soldSeats) AS remainingSeats
        FROM schedule
        ORDER BY id DESC
      `);

      res.json(rows);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });
    }
  }
);

/* ===================================
   CREATE SCHEDULE
=================================== */
router.post(
  "/",
  verifyRole(["getter", "admin"]),
  async (req, res) => {

    try {

      const {
        plateNumber,
        Destination,
        creator
      } = req.body;

      // Vehicle Information
      const [vehicleRows] =
        await db.promise().query(
          `
          SELECT *
          FROM vehicle
          WHERE plateNumber = ?
          `,
          [plateNumber]
        );

      if (vehicleRows.length === 0) {
        return res.status(404).json({
          message: "Vehicle not found"
        });
      }

      const vehicle = vehicleRows[0];

      // Price Information
      const [priceRows] =
        await db.promise().query(
          `
          SELECT totalPrice
          FROM price
          WHERE Destination = ?
          AND VehicleLevel = ?
          `,
          [
            Destination,
            vehicle.level
          ]
        );

      if (priceRows.length === 0) {
        return res.status(404).json({
          message:
            "Price not found for selected route"
        });
      }

      const price = priceRows[0];
await db.promise().query(
`
INSERT INTO schedule
(
  plateNumber,
  Destination,
  creator,
  seatCapacity,
  totalPrice,
  soldSeats
)
VALUES (?, ?, ?, ?, ?, ?)
`,
[
  plateNumber,
  Destination,
  creator,
  vehicle.seatCapacity,
  price.totalPrice,
  0
]
);

      await db.promise().query(
        `
        UPDATE vehicle
        SET status = 'SCHEDULED'
        WHERE plateNumber = ?
        `,
        [plateNumber]
      );

      res.json({
        success: true,
        message: "Schedule Created Successfully"
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });
    }
  }
);

/* ===================================
   UPDATE SCHEDULE
=================================== */
router.put(
  "/:id",
  verifyRole(["getter", "admin"]),
  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        plateNumber,
        Destination
      } = req.body;

      const [vehicleRows] =
        await db.promise().query(
          `
          SELECT *
          FROM vehicle
          WHERE plateNumber = ?
          `,
          [plateNumber]
        );

      if (vehicleRows.length === 0) {
        return res.status(404).json({
          message: "Vehicle not found"
        });
      }

      const vehicle = vehicleRows[0];

      const [priceRows] =
        await db.promise().query(
          `
          SELECT totalPrice
          FROM price
          WHERE Destination = ?
          AND VehicleLevel = ?
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

      await db.promise().query(
        `
        UPDATE schedule
        SET
          plateNumber = ?,
          Destination = ?,
          travelDate = ?,
          seatCapacity = ?,
          totalPrice = ?
        WHERE id = ?
        `,
        [
          plateNumber,
          Destination,
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

      console.log(err);

      res.status(500).json({
        message: err.message
      });
    }
  }
);

/* ===================================
   DELETE SCHEDULE
=================================== */
router.delete(
  "/:id",
  verifyRole(["getter", "admin"]),
  async (req, res) => {

    try {

      const [scheduleRows] =
        await db.promise().query(
          `
          SELECT plateNumber
          FROM schedule
          WHERE id = ?
          `,
          [req.params.id]
        );

      if (scheduleRows.length > 0) {

        await db.promise().query(
          `
          UPDATE vehicle
          SET status = 'AVAILABLE'
          WHERE plateNumber = ?
          `,
          [scheduleRows[0].plateNumber]
        );
      }

      await db.promise().query(
        `
        DELETE FROM schedule
        WHERE id = ?
        `,
        [req.params.id]
      );

      res.json({
        success: true,
        message: "Schedule Deleted Successfully"
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });
    }
  }
);

module.exports = router;