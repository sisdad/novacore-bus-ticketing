
const express = require("express");
const router = express.Router();

const db = require("../config/db");
const {  verifyToken, verifyRole,} = require("../middleware/auth");
 
router.get(
  "/pending",
  verifyToken, verifyRole(["finance"]),
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT *
        FROM schedule
        WHERE status='PENDDING'
        ORDER BY Id DESC
      `);

      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
);
router.put(
  "/approve/:id",
  verifyToken, verifyRole(["finance"]),
  async (req,res)=>{
    try{

      await db.query(
        `
        UPDATE schedule
        SET
          status='PAID',
          approvedBy=?,
          approvedDate=NOW()
        WHERE id=?
        `,
        [req.user.email,req.params.id]
      );

      res.json({
        message:"Schedule approved successfully."
      });

    }catch(err){
      res.status(500).json(err);
    }
});

router.get(
  "/paid",
  verifyToken, verifyRole(["finance"]),
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT *
        FROM schedule
        WHERE status='PAID'
        ORDER BY Id DESC
      `);

      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
);

module.exports = router;