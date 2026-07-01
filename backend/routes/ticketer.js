
const express = require("express");
const router = express.Router();

const db = require("../config/db");
const {  verifyToken, verifyRole,} = require("../middleware/auth");

// ==========================
// AVAILABLE SCHEDULES
// ==========================
router.get(
"/available",
async(req,res)=>{

try{

const [rows] = await db.query(`
SELECT
s.*,
v.seatCapacity,
p.totalPrice
FROM schedule s
JOIN vehicle v
ON s.plateNumber = v.plateNumber
LEFT JOIN price p
ON p.Destination = s.Destination
AND p.VehicleLevel = v.level
WHERE (s.status='SCHEDULED') || (s.status='DISABLED')
`);

res.json(rows);

}catch(err){
res.status(500).json(err);
}

});


// ==========================
// START SELLING
// ==========================
router.put(
"/start/:id",
verifyToken, verifyRole(["ticketer"]),
async(req,res)=>{

try{

const scheduleId =
req.params.id;

const email =
req.user.email;

const [schedule] =
await db.query(
`
SELECT *
FROM schedule
WHERE id=?
`,
[scheduleId]
);

if(schedule.length===0){

return res.status(404).json({
message:"Schedule not found"
});

}

if(
schedule[0].status
!== "SCHEDULED"
){

return res.status(400).json({
message:
"Already taken by another ticketer"
});

}

await db.query(
`
UPDATE schedule
SET
assignedTicketer=?,
status='STARTED'
WHERE id=?
`,
[
email,
scheduleId
]
);

res.json({
message:"Schedule Assigned"
});

}catch(err){

res.status(500).json(err);

}

});


// ==========================
// MY ACTIVE SCHEDULES
// ==========================
router.get(
"/my-active",
verifyToken, verifyRole(["ticketer"]),
async(req,res)=>{

try{

const email =
req.user.email;

const [rows] =
await db.query(
`
SELECT *
FROM schedule
WHERE assignedTicketer=?
ORDER BY Id DESC
`,
[email]
);

res.json(rows);

}catch(err){

res.status(500).json(err);

}

});


// ==========================
// PRINT TICKET
// ==========================
// ==========================
// PRINT MULTIPLE TICKETS
// ==========================
router.post(
  "/print/:id",
  verifyToken, verifyRole(["ticketer"]),
  async (req, res) => {
    try {
      const scheduleId = req.params.id;
      const quantity = Number(req.body.quantity) || 1;

      if (quantity < 1) {
        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      const [rows] = await db.query(
        `
        SELECT *
        FROM schedule
        WHERE id=?
        `,
        [scheduleId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Schedule not found",
        });
      }

      const schedule = rows[0];

      const remainingSeats =
        schedule.seatCapacity - schedule.soldSeats;

      if (quantity > remainingSeats) {
        return res.status(400).json({
          message: `Only ${remainingSeats} seats remaining.`,
        });
      }

      // Ticket numbers
      const tickets = [];

      for (let i = 1; i <= quantity; i++) {
        tickets.push(schedule.soldSeats + i);
      }

      const newSoldSeats =
        schedule.soldSeats + quantity;

      await db.query(
        `
        UPDATE schedule
        SET soldSeats=?
        WHERE id=?
        `,
        [newSoldSeats, scheduleId]
      );

      if (newSoldSeats >= schedule.seatCapacity) {
        await db.query(
          `
          UPDATE schedule
          SET status='COMPLETED'
          WHERE id=?
          `,
          [scheduleId]
        );
      }

      res.json({
        success: true,
        quantity,
        tickets,
        soldSeats: newSoldSeats,
        remaining:
          schedule.seatCapacity - newSoldSeats,
        message: `${quantity} ticket(s) printed successfully`
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message,
      });

    }
  }
);

//=========reprint================//

//========= REPRINT =================//

router.post(
  "/reprint/:id",
  verifyToken, verifyRole(["ticketer"]),
  async (req, res) => {
    try { 
      const scheduleId = req.params.id;
      const quantity = Number(req.body.quantity) || 1;

      if (quantity < 1) {
        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      const [rows] = await db.query(
        `
        SELECT *
        FROM schedule
        WHERE id=?
        `,
        [scheduleId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Schedule not found",
        });
      }

      const schedule = rows[0];

      // Cannot reprint more than sold tickets
      if (quantity > schedule.soldSeats) {
        return res.status(400).json({
          message: `Only ${schedule.soldSeats} ticket(s) have been sold.`,
        });
      }

      await db.query(
        `
        UPDATE schedule
        SET reprintedTickets = reprintedTickets + ?
        WHERE id=?
        `,
        [quantity, scheduleId]
      );

      // Ticket numbers being reprinted
      const tickets = [];

      for (let i = 1; i <= quantity; i++) {
        tickets.push(i);
      }

      res.json({
        success: true,
        quantity,
        tickets,
        soldSeats: schedule.soldSeats,
        reprintedTickets:
          schedule.reprintedTickets + quantity,
        message: `${quantity} ticket(s) reprinted successfully`,
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: err.message,
      });
    }
  }
);


// ==========================
// PRINT TICKET
// ==========================
router.post(
"/checked/:id",
verifyToken, verifyRole(["ticketer"]),
async(req,res)=>{

try{

const scheduleId=req.params.id;

await db.query(
`
UPDATE schedule
SET status='COMPLETED'
WHERE id=?
`,
[scheduleId]
);


res.json({

success:true,

message:"CheckedOut"

});

}catch(err){

console.log(err);

res.status(500).json({
message:err.message
});

}

});




// ==========================
// SUBMIT TO FINANCE
// ==========================
router.post(
  "/submit-finance/:id",
  verifyToken, verifyRole(["ticketer"]),
  async (req, res) => {

    try {

      const scheduleId = req.params.id;
      const email = req.user.email;

      const {
        submissionType,
        returnedTickets = 0
      } = req.body;

      const [schedule] = await db.query(
        `
        SELECT
        soldSeats,
        seatCapacity,
        totalPrice
        FROM schedule
        WHERE id=?
        `,
        [scheduleId]
      );

      if (schedule.length === 0) {

        return res.status(404).json({
          message: "Schedule not found"
        });

      }

      const soldTickets = schedule[0].soldSeats;

      const remainingTickets =
        schedule[0].seatCapacity -
        schedule[0].soldSeats;

      const totalAmount =
        soldTickets *
        schedule[0].totalPrice;

      let cashAmount = 0;

      if (submissionType === "CASH") {

        cashAmount = totalAmount;

      }

      await db.query(
        `
        INSERT INTO finance_report
        (
        scheduleId,
        soldTickets,
        remainingTickets,
        totalAmount,
        cashAmount,
        returnedTickets,
        submissionType,
        submittedBy
        )
        VALUES
        (
        ?,?,?,?,?,?,?,?
        )
        `,
        [
          scheduleId,
          soldTickets,
          remainingTickets,
          totalAmount,
          cashAmount,
          returnedTickets,
          submissionType,
          email
        ]
      );

      await db.query(
        `
        UPDATE schedule
        SET status='PENDING'
        WHERE id=?
        `,
        [scheduleId]
      );

      res.json({

        success: true,

        message:
          submissionType === "CASH"
            ? "Cash submitted successfully."
            : "Returned ticket request submitted."

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);


// ==========================
// HISTORY
// ==========================
router.get(
"/history",
verifyToken, verifyRole(["ticketer"]),
async(req,res)=>{

try{

const email =
req.user.email;

const [rows] =
await db.query(
`
SELECT *
FROM finance_report
WHERE submittedBy=?
ORDER BY reportId DESC
`,
[email]
);

res.json(rows);

}catch(err){

res.status(500).json(err);

}

});

router.put(
  "/request-approval/:id",
  verifyToken, verifyRole(["ticketer"]),
  async (req, res) => {
    try {
      const scheduleId = req.params.id;

      const returnedTicket = Number(req.body.returnedTicket) || 0;
      const cashier = req.body.cashier;

      // Validate cashier
      if (!cashier) {
        return res.status(400).json({
          message: "Please select a finance user."
        });
      }

      // Get schedule
      const [rows] = await db.query(
        `SELECT soldSeats
         FROM schedule
         WHERE id = ?`,
        [scheduleId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Schedule not found."
        });
      }

      if (returnedTicket < 0) {
        return res.status(400).json({
          message: "Returned tickets cannot be negative."
        });
      }

      if (returnedTicket > rows[0].soldSeats) {
        return res.status(400).json({
          message: "Returned tickets cannot exceed sold tickets."
        });
      }

      // Update schedule
      await db.query(
        `UPDATE schedule
         SET
            cashier = ?,
            returnedTicket = ?,
            status = 'PENDDING'
         WHERE id = ?`,
        [
          cashier,
          returnedTicket,
          scheduleId
        ]
      );

      res.json({
        success: true,
        message: "Approval request sent successfully."
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Server error."
      });
    }
  }
);


//===========Cashier===============//


router.get("/cashier/:station", async (req, res) => {
  try { 
       const { station } = req.params;
     const [cashier] = await db.query(
      `SELECT *
       FROM user
       WHERE station = ?
       AND role = 'finance'
       ORDER BY id DESC`,
      [station]
    );
    res.json(cashier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;