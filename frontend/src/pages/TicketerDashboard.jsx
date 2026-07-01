import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import useFormValidation from "../hooks/useFormValidation";
import { validators } from "../utils/validation";
import Swal from "sweetalert2";
import "../components/TicketerDashboard.css";
import { FaPlay, FaSpinner, FaBan } from "react-icons/fa";
export default function TicketerDashboard() {

  
  
 const navigate = useNavigate();
     const token = localStorage.getItem("token");
     const role = localStorage.getItem("role");
  const station = localStorage.getItem("station");
   useEffect(() => {
     
   
     if (!token) {
       navigate("/");
     }
   
     if (role !== "ticketer") {
       navigate("/unauthorized");
     }
   }, []);

  const [activeTab, setActiveTab] =
    useState("schedules");

  const [availableSchedules,
    setAvailableSchedules] =
    useState([]);

  const [mySchedules,
    setMySchedules] =
    useState([]);
  
const [ticketQty, setTicketQty] = useState({});
const [returnedQty, setReturnedQty] = useState({});
const [cashier, setCashier] = useState([]);
  const [history,
    setHistory] =
    useState([]);


  // ==========================
  // LOAD AVAILABLE SCHEDULES
  // ==========================
  const loadAvailableSchedules =
    async () => {
      try {
        const res = await api.get(
          "http://localhost:5000/api/ticketer/available",
          
        );

        setAvailableSchedules(
          res.data
        );
      } catch (err) {
        console.error(err);
      }
    };

  // ==========================
  // LOAD MY ACTIVE SCHEDULES
  // ==========================
  
  const loadMySchedules =
    async () => {
      
      try {
        const res = await api.get(
          "http://localhost:5000/api/ticketer/my-active",
          
        );

        setMySchedules(
          res.data
        );
      } catch (err) {
        console.error(err);
      }
      
    };

  // ==========================
  // LOAD HISTORY
  // ==========================
 

  // ==========================
  // LOAD ALL
  // ==========================


 const loadCashier = async () => {
    const station=localStorage.getItem("station");
    const res = await api.get(`http://localhost:5000/api/ticketer/cashier/${station}`);
    setCashier(res.data);
  };

 const loadAll = () => {
    loadAvailableSchedules();
    loadMySchedules();
    
    loadCashier();
  };


  /* ================= ROUTES ================= */
  


  useEffect(() => {
    loadAll();
  }, []);


  // ==========================
  // START SELLING
  // ==========================
  const startSelling =
    async (scheduleId) => {
      try {
        const res =
          await api.put(
            `http://localhost:5000/api/ticketer/start/${scheduleId}`,
            {},
            
          );

        alert(res.data.message);

        loadAll();
      } catch (err) {
        alert(
          err.response?.data?.message ||
          "Error"
        );
      }
    };

  // ==========================
  // PRINT TICKET
  // ==========================
const printTicket = async (scheduleId, quantity = 1) => {

  try {

    const res = await api.post(
      `http://localhost:5000/api/ticketer/print/${scheduleId}`,
      {
        quantity,
      },
      
    );

    alert(
      `${res.data.quantity} ticket(s) printed\n\nTicket Numbers:\n${res.data.tickets.join(", ")}`
    );

    loadAll();

  } catch (err) {

    alert(
      err.response?.data?.message ||
      "Error"
    );

  }

}; 

// ==========================
  // Reprint
  // ==========================
const reprint = async (scheduleId, quantity = 1) => {

  try {

    const res = await api.post(
      `http://localhost:5000/api/ticketer/reprint/${scheduleId}`,
      {
        quantity,
      },
      
    );

    alert(
      `${res.data.quantity} ticket(s) reprinted\n\n${res.data.message}`
    );

    loadAll();

  } catch (err) {

    alert(
      err.response?.data?.message ||
      "Error"
    );

  }

};
  // ==========================
  // checkedout
  // ==========================
  const checkedout =
    async (scheduleId) => {
      try {
        const res =
          await api.post(
            `http://localhost:5000/api/ticketer/checked/${scheduleId}`,
            {},
            
          );

        alert(res.data.message);

        loadAll();
      } catch (err) {
        alert(
          err.response?.data?.message ||
          "Error"
        );
      }
    };



  // ==========================
  // SUBMIT FINANCE
  // ==========================
  const submitFinance = async (
    scheduleId,
    submissionType
) => {

    try {

        const body = {

            submissionType

        };

        if (submissionType === "RETURNED") {

            body.returnedTickets =
                Number(returnedQty[scheduleId]) || 0;

        }

        const res =
            await api.post(

                `http://localhost:5000/api/ticketer/submit-finance/${scheduleId}`,

                body,

                

            );

        alert(res.data.message);

        loadAll();

    } catch (err) {

        alert(

            err.response?.data?.message ||

            "Error"

        );

    }

};

const sendApprovalRequest = async (
  scheduleId,
  cashier,
  returnedTicket
) => {
  try {
    const res = await api.put(
      `http://localhost:5000/api/ticketer/request-approval/${scheduleId}`,
      {
        cashier,
        returnedTicket,
      },
      
    );

    Swal.fire({
      icon: "success",
      title: "Success",
      text: res.data.message,
    });

    loadAll();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || "Request failed",
    });
  }
};

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
        >
          

          {/* TABS */}
<div className="tab-container mb-4">
  <button
    className={`tab-btn ${
      activeTab === "schedules" ? "active" : ""
    }`}
    onClick={() => setActiveTab("schedules")}
  >
    All
  </button>

  <button
    className={`tab-btn ${
      activeTab === "active" ? "active" : ""
    }`}
    onClick={() => setActiveTab("active")}
  >
    My Schedule
  </button>

  <button
    className={`tab-btn ${
      activeTab === "history" ? "active" : ""
    }`}
    onClick={() => setActiveTab("history")}
  >
    Checked Out
  </button>
</div>

          {/* ==========================
              AVAILABLE SCHEDULES
          ========================== */}

          {activeTab ===
            "schedules" && (
            <>
             
           <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover align-middle shadow-sm">

                <thead className="table-success">
                  <tr>
                    <th>#</th>
                    <th>
                      Vehicle
                    </th>
                    <th>
                      Destination
                    </th>
                    <th>Seats</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                 {availableSchedules.map((s, index) => (
  <tr key={s.id}>
    <td>{index + 1}</td>
    <td>{s.plateNumber}</td>
    <td>{s.Destination}</td>
    <td>{s.seatCapacity}</td>
    <td>{s.totalPrice}</td>

    <td>
  {s.status === "SCHEDULED" && (
    <button
      className="btn btn-success btn-sm"
      onClick={() => {
        Swal.fire({
          title: "Start Selling?",
          text: `Vehicle ${s.plateNumber} to ${s.Destination}?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Start",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#198754",
          cancelButtonColor: "#6c757d",
        }).then((result) => {
          if (result.isConfirmed) {
            startSelling(s.id);
          }
        });
      }}
    >
      <FaPlay className="me-1" />
      Start
    </button>
  )}

  {s.status === "DISABLED" && (
    <button
      className="btn btn-secondary btn-sm"
      disabled
    >
      <FaSpinner className="me-1 fa-spin" />
      Disabled
    </button>
  )}
</td>
          </tr>
        ))}
            </tbody>
  </table>
  </div>
            </>
          )}

          {/* ==========================
              ACTIVE SCHEDULES
          ========================== */}

          { activeTab ==="active"  && (
            <>
          <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover align-middle shadow-sm">

                <thead className="table-success">
                  <tr>
                    <th>#</th>

                    <th>
                      Vehicle
                    </th>

                    <th>
                      Destination
                    </th>

                    <th>BOOKED SEAT</th>
                    <th>reprint</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {mySchedules
                    .filter((s) => (s.status === "STARTED"||s.status === "COMPLETED"))
                    .map((s, index) => (
                      <tr
                        key={s.id}
                      >
                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {
                            s.plateNumber
                          }
                        </td>

                        <td>
                          {
                            s.Destination
                          }
                        </td>

                        <td>{s.soldSeats} / {s.seatCapacity}</td>
                        <td>{s.reprintedTickets}</td>
                        <td>{s.totalPrice}</td>

                        
   { (s.status === "STARTED" || s.status === "COMPLETED") && (
         <td>
  <button
    className="btn btn-primary btn-sm"
    onClick={() => {
      const availableSeats = s.seatCapacity - s.soldSeats;
      const soldTickets = s.soldSeats;
      const availableReprint = s.soldSeats - s.reprintedTickets
      const available = availableSeats === 0 ? availableReprint : availableSeats;
      Swal.fire({
        title: "Ticket Printing",
        html: `
        
          <div style="text-align:left;">
            <label><b>Number of Tickets</b></label>

            <input
              id="ticketQtyInput"
              type="number"
              class="swal2-input"
              min="1"
              max="${available}"
              value="1"
            />

            <small id="qtyInfo" style="display:block;color:#666;margin-top:-10px;margin-bottom:10px;">
              Print: Max ${availableSeats} <br/>
              Reprint: Max ${availableReprint}
            </small>

            <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:20px;">

              ${
                availableSeats > 0
                  ? `
                    <button
                      id="swalPrint"
                      class="swal2-confirm swal2-styled"
                    >
                      Print
                    </button>

                    <button
                      id="swalPrintAll"
                      class="swal2-deny swal2-styled"
                    >
                      Print All
                    </button>
                  `
                  : ""
              }

              ${
                `
                    <button
                      id="swalReprint"
                      class="swal2-cancel swal2-styled"
                      style="background:#0d6efd;"
                    >
                      Reprint
                    </button>
                  `
                 
              }

            </div>
          </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "Close",

        didOpen: () => {
          const qtyInput = document.getElementById("ticketQtyInput");
          const qtyInfo = document.getElementById("qtyInfo");

           let currentMax = available;

        // Force value between 1 and currentMax
        const validateInput = () => {
          let value = parseInt(qtyInput.value, 10);

          if (isNaN(value)) value = 1;

          if (value < 1) value = 1;

          if (value > currentMax) value = currentMax;

          qtyInput.value = value;
        };

           qtyInput.addEventListener("input", validateInput);
           qtyInput.addEventListener("blur", validateInput);
          // PRINT
          document
            .getElementById("swalPrint")
            ?.addEventListener("click", () => {
              qtyInput.max = available;
              qtyInfo.innerHTML = `Print: Max ${availableSeats} <br/> Reprint: Max ${availableReprint}`;

              let qty = Number(qtyInput.value) || 1;

              if (qty < 1 || qty > availableSeats) {
                Swal.showValidationMessage(
                  `You can print between maximum ${availableSeats} tickets.`
                );
                return;
              }

              setTicketQty({
                ...ticketQty,
                [s.id]: qty,
              });

              Swal.close();
              printTicket(s.id, qty);
            });

          // PRINT ALL
          document
            .getElementById("swalPrintAll")
            ?.addEventListener("click", () => {
              Swal.close();
              printTicket(s.id, availableSeats);
            });

          // REPRINT
          document
            .getElementById("swalReprint")
            ?.addEventListener("click", () => {
              qtyInput.max = availableReprint;
              qtyInfo.innerHTML = `Reprint: Max ${availableReprint}`;

              let qty = Number(qtyInput.value) || 1;

              if (qty < 1 || qty > availableReprint) {
                Swal.showValidationMessage(
                  `You can reprint Max  ${availableReprint} tickets.`
                );
                return;
              }

              setTicketQty({
                ...ticketQty,
                [s.id]: qty,
              });

             
                  if (qty < 1 || qty > s.availableReprint) {
                    Swal.showValidationMessage(
                      `You can reprint between 1 and ${s.availableReprint} ticket(s).`
                    );
                    return;
                  }

                  Swal.close();
                  reprint(s.id, qty);
            });
        },
      });
    }}
  >
    {s.status === "STARTED" ? "Print" : (s.soldSeats > s.reprintedTickets) ? "Reprint": null }
  </button>
</td> )}

                   
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              </div>
            </>
          )}

          {/* ==========================
              HISTORY
          ========================== */}

          { activeTab === "history"&& (
            <>
            
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle shadow-sm">

              <thead className="table-success">
                  <tr>
                    <th>#</th>

                    <th>
                      Vehicle
                    </th>

                    <th>
                      Destination
                    </th>

                    <th>BOOKED SEAT</th>
                    <th>reprint</th>
                    <th>returned</th>
                    <th>Price</th>
                    <th>cashier</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {mySchedules
                    .filter((s) => (s.status === "CHECKEDOUT"||s.status === "PENDDING"||s.status === "PAID"))
                    .map((s, index) => (
                      <tr
                        key={s.id}
                      >
                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {
                            s.plateNumber
                          }
                        </td>

                        <td>
                          {
                            s.Destination
                          }
                        </td>

                        <td>{s.soldSeats} / {s.seatCapacity}</td>
                        <td>{s.reprintedTickets}</td>
                         <td>{s.returnedTicket}</td>
                        <td>{s.totalPrice}</td>
                         <td>{s.cashier}</td>

                        
   { (s.status === "CHECKEDOUT") && (
         <td>
  <button
    className="btn btn-primary btn-sm"
    onClick={() => {
      
      const available = s.soldSeats;
Swal.fire({
  title: "Send Approval Request",
  html: `
    <div style="text-align:left">

      <label><b>Select Cashier</b></label>
      <select id="cashier" class="swal2-select">
        ${cashier
          .map(
            (c) => `
            <option value="${c.email}">
              ${c.email}
            </option>
          `
          )
          .join("")}
      </select>

      <label style="margin-top:10px;"><b>Returned Tickets</b></label>
      <input
        id="returned"
        type="number"
        class="swal2-input"
        min="0"
        max="${s.soldSeats}"
        value="0"
      />

      <div style="text-align:center;margin-top:20px">
        <button
          id="sendRequestBtn"
          class="swal2-confirm swal2-styled"
        >
          Send Request
        </button>
      </div>

    </div>
  `,
  showConfirmButton: false,
  showCancelButton: true,
  cancelButtonText: "Close",

  didOpen: () => {

    const returnedInput =
      document.getElementById("returned");

    returnedInput.addEventListener("input", () => {
      let value = Number(returnedInput.value);

      if (isNaN(value) || value < 0)
        value = 0;

      if (value > s.soldSeats)
        value = s.soldSeats;

      returnedInput.value = value;
    });

    document
      .getElementById("sendRequestBtn")
      .addEventListener("click", () => {

        const cashier =
          document.getElementById("cashier").value;

        const returnedTicket =
          Number(returnedInput.value);

        Swal.close();

        sendApprovalRequest(
          s.id,
          cashier,
          returnedTicket
        );
      });
   
        },
      });
    }}
  >
    SEND REQUEST
  </button>
</td> )}

 {( s.status === "PENDDING") && ( <td> <button  className="btn btn-warning btn-sm">
                                           PENDDING 
                                     </button></td>)}
   {( s.status === "PAID") && ( <td><button className="btn btn-success btn-sm">
                                      PAID 
                                 </button></td>)}               
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              </div>
            </>
          )}


        </div>
      </div>
    </div>
  );
}


