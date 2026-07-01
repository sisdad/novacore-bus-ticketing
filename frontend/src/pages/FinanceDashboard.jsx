import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import useFormValidation from "../hooks/useFormValidation";
import { validators } from "../utils/validation";
import Swal from "sweetalert2";
import "../components/TicketerDashboard.css";

export default function FinanceDashboard() {

const station = localStorage.getItem("station");

const navigate = useNavigate();
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

useEffect(() => {

    if (!token) {
        navigate("/");
        return;
    }

    if (role !== "finance") {
        navigate("/unauthorized");
    }

}, [navigate, token, role]);



  const [activeTab, setActiveTab] =
    useState("pending");

  const [pendingSchedules,
    setPendingSchedules] =
    useState([]);

  const [paidSchedules,
    setPaidSchedules] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  // ==========================
  // LOAD PENDING
  // ==========================
  const loadPendingSchedules =
    async () => {

      try {

        setLoading(true);

        const res = await api.get(
          "http://localhost:5000/api/finance/pending",
          
        );

        setPendingSchedules(res.data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

  // ==========================
  // LOAD PAID HISTORY
  // ==========================
  const loadPaidSchedules =
    async () => {

      try {

        const res = await api.get(
          "http://localhost:5000/api/finance/paid",
          
        );

        setPaidSchedules(res.data);

      } catch (err) {

        console.error(err);

      }

    };

  // ==========================
  // LOAD ALL
  // ==========================
  const loadAll = () => {

    loadPendingSchedules();
    loadPaidSchedules();

  };

  useEffect(() => {

    loadAll();

  }, []);

  // ==========================
  // APPROVE PAYMENT
  // ==========================
  const approveSchedule =
    async (scheduleId) => {

      const result =
        await Swal.fire({

          title: "Approve Payment?",

          text:
            "Are you sure you want to approve this request?",

          icon: "question",

          showCancelButton: true,

          confirmButtonText: "Approve",

          cancelButtonText: "Cancel",

          confirmButtonColor: "#198754",

          cancelButtonColor: "#6c757d",

        });

      if (!result.isConfirmed)
        return;

      try {

        const res =
          await api.put(

            `http://localhost:5000/api/finance/approve/${scheduleId}`,

            {},

            

          );

        Swal.fire({

          icon: "success",

          title: "Approved",

          text: res.data.message,

        });

        loadAll();

      } catch (err) {

        Swal.fire({

          icon: "error",

          title: "Error",

          text:
            err.response?.data?.message ||
            "Approval failed.",

        });

      }

    };

  // ==========================
  // REJECT REQUEST
  // ==========================
  const rejectSchedule =
    async (scheduleId) => {

      const result =
        await Swal.fire({

          title: "Reject Request?",

          text:
            "The schedule will be returned to the ticketer.",

          icon: "warning",

          showCancelButton: true,

          confirmButtonText: "Reject",

          cancelButtonText: "Cancel",

          confirmButtonColor: "#dc3545",

        });

      if (!result.isConfirmed)
        return;

      try {

        const res =
          await api.put(

            `http://localhost:5000/api/finance/reject/${scheduleId}`,

            {},

            

          );

        Swal.fire({

          icon: "success",

          title: "Rejected",

          text: res.data.message,

        });

        loadAll();

      } catch (err) {

        Swal.fire({

          icon: "error",

          title: "Error",

          text:
            err.response?.data?.message ||
            "Reject failed.",

        });

      }

    };

  // ==========================
  // RETURN JSX
  // ==========================
  return (

    <div
      style={{
        display: "flex",
      }}
    >


      <div
        style={{
          flex: 1,
        }}
      >

        <Navbar />

        <div
          style={{
            padding: "20px",
          }}
        >{/* ==========================
    TABS
========================== */}
<div className="tab-container mb-4">

  <button
    className={`tab-btn ${
      activeTab === "pending"
        ? "active"
        : ""
    }`}
    onClick={() =>
      setActiveTab("pending")
    }
  >
    Pending Approval
  </button>

  <button
    className={`tab-btn ${
      activeTab === "paid"
        ? "active"
        : ""
    }`}
    onClick={() =>
      setActiveTab("paid")
    }
  >
    Paid History
  </button>

</div>

{/* ==========================
    PENDING APPROVALS
========================== */}

{activeTab === "pending" && (

<>

<table
  border="1"
  width="100%"
>

<thead>

<tr>

<th>#</th>

<th>Vehicle</th>

<th>Destination</th>

<th>Ticketer</th>

<th>BOOKED</th>

<th>Returned</th>

<th>Reprinted</th>

<th>Total Price</th>

<th>TARIFF</th>

<th>commision</th>

<th>Cashier</th>

<th>Amount</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{loading ? (

<tr>

<td
colSpan="13"
style={{
textAlign:"center"
}}
>

Loading...

</td>

</tr>

) :

pendingSchedules.length===0 ? (

<tr>

<td
colSpan="13"
style={{
textAlign:"center"
}}
>

No Pending Requests

</td>

</tr>

) :

pendingSchedules.map((s,index)=>(

<tr key={s.id}>

<td>

{index+1}

</td>

<td>

{s.plateNumber}

</td>

<td>

{s.Destination}

</td>

<td>

{s.ticketer}

</td>

<td>

{s.soldSeats} / {s.seatCapacity}

</td>


<td>

{s.returnedTicket}

</td>

<td>

{s.reprintedTickets}

</td>

<td>

{s.totalPrice}

</td>
<td>

{s.soldSeats * s.totalPrice * 0.83} 

</td>
<td>

{s.soldSeats * s.totalPrice * 0.017} 

</td>




<td>

{s.cashier}

</td>

<td>

<b>

{(
(s.soldSeats-s.returnedTicket)
*
s.totalPrice
).toFixed(2)}

Birr

</b>

</td>

<td>

<span
className="badge bg-warning"
>

{s.status}

</span>

</td>

<td>

<div
style={{
display:"flex",
gap:"5px",
justifyContent:"center"
}}
>

<button
className="btn btn-success btn-sm"
onClick={()=>
approveSchedule(s.id)
}
>

Approve

</button>


</div>

</td>

</tr>

))

}

</tbody>

</table>

</>

)}
{/* ==========================
    PAID HISTORY
========================== */}

{activeTab === "paid" && (
  <>
    <table
      border="1"
      width="100%"
    >
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Vehicle</th>
          <th>Destination</th>
          <th>Ticketer</th>
          <th>Seats</th>
          <th>Sold</th>
          <th>Returned</th>
          <th>Reprinted</th>
          <th>Price</th>
          <th>Cashier</th>
          <th>Amount Paid</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td
              colSpan="13"
              style={{ textAlign: "center" }}
            >
              Loading...
            </td>
          </tr>
        ) : paidSchedules.length === 0 ? (
          <tr>
            <td
              colSpan="13"
              style={{ textAlign: "center" }}
            >
              No Paid Records
            </td>
          </tr>
        ) : (
          paidSchedules.map((s, index) => (
            <tr key={s.id}>
              <td>{index + 1}</td>

              <td>
                {new Date(s.created_at).toLocaleDateString()}
              </td>

              <td>{s.plateNumber}</td>

              <td>{s.Destination}</td>

              <td>{s.ticketer}</td>

              <td>{s.seatCapacity}</td>

              <td>{s.soldSeats}</td>

              <td>{s.returnedTicket}</td>

              <td>{s.reprintedTickets}</td>

              <td>{s.totalPrice}</td>

              <td>{s.cashier}</td>

              <td>
                <b>
                  {(
                    (s.soldSeats - s.returnedTicket) *
                    s.totalPrice
                  ).toFixed(2)}{" "}
                  Birr
                </b>
              </td>

              <td>
                <span className="badge bg-success">
                  {s.status}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </>
)}
    </div>
    </div>
    </div>
  );
}
