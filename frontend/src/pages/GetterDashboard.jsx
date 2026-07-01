import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import useFormValidation from "../hooks/useFormValidation";
import { validators } from "../utils/validation";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import { FaBus,FaPlus, FaMinus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  FaCheckCircle,
  FaBan,
  FaEdit,
  FaTrash,
  FaTrashAlt 
} from "react-icons/fa";
import Select from "react-select";

export default function GetterDashboard() {

   const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
      const showNotification = (message, type = "success") => {
              alert(message); // simple fallback
            };
      const {
    
                errors,
                validate
    
            } = useFormValidation();
    
        
  useEffect(() => {
    
  
    if (!token) {
      navigate("/");
    }
  
    if (role !== "getter") {
      navigate("/unauthorized");
    }
  }, []);
  
const [activeTab, setActiveTab] = useState("vehicles");
const [search, setSearch] = useState("");
const [showAssignForm, setShowAssignForm] = useState(false);
const [showVehicleForm, setShowVehicleForm] = useState(false);
  /* ================= VEHICLES ================= */

  const [vehicles, setVehicles] = useState([]);

  const [vehicleForm, setVehicleForm] = useState({
    plateNumber: "",
    seatCapacity: "",
    level: "",
    provider: "",
    sideNumber: ""
  });

  const [editVehicle, setEditVehicle] = useState(null);

  /* ================= SCHEDULES ================= */

  const [schedules, setSchedules] = useState([]);

  const [scheduleForm, setScheduleForm] = useState({
  plateNumber: "",
  Destination: "" 
});

  const [editSchedule, setEditSchedule] = useState(null);


  const [providers, setProviders] = useState([]);


  /* ================= ROUTES ================= */

  const [routes, setRoutes] = useState([]);

  useEffect(() => {

    if (activeTab === "vehicles") {
      loadVehicles();
      loadProviders();
    }

    if (activeTab === "schedules") {
  loadSchedules();
  loadVehicles();
  loadRoutes();
  loadProviders();
}

  }, [activeTab]);

  /* =====================================
     VEHICLES
  ===================================== */

  const loadVehicles = async () => {
    try {
    const station=localStorage.getItem("station");
      const res = await api.get(
        `http://localhost:5000/api/getter/vehicles/${station}`);

      setVehicles(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const addVehicle = async () => {
     const valid = validate(vehicleForm,{
        
                plateNumber:validators.name,
                seatCapacity:validators.number,
                level:validators.select,
                provider:validators.select,
                sideNumber:validators.number,
        
            });
        
            if(!valid){
        
                showNotification(
                    "Please fix validation errors.",
                    "warning"
                );
        
                return;
            }

            
    try {

      await api.post(
        "http://localhost:5000/api/getter/vehicles",
        {
          ...vehicleForm,
          creator: localStorage.getItem("email"),
          station: localStorage.getItem("station")
        }
      );

      alert("Vehicle Added");

      setVehicleForm({
        plateNumber: "",
        seatCapacity: "",
        level: "",
        provider: "",
        sideNumber: ""
      });

      loadVehicles();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        err.message
      );
    }
  };

  const updateVehicle = async () => {

    try {

      await api.put(
        `http://localhost:5000/api/getter/vehicles/${editVehicle.plateNumber}`,
        editVehicle
      );

      alert("Vehicle Updated");

      setEditVehicle(null);

      loadVehicles();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        err.message
      );
    }
  };

  const deleteVehicle = async (plateNumber) => {

    if (!window.confirm("Delete Vehicle?"))
      return;

    try {

      await api.delete(
        `http://localhost:5000/api/getter/vehicles/${plateNumber}`
      );

      loadVehicles();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        err.message
      );
    }
  };


  //========ENABLE DISABLE==========//

const Permission = async (scheduleId, currentstatus) => {
  try {
    console.log(scheduleId, currentstatus);

    const res = await api.post(
      `http://localhost:5000/api/getter/permit/${scheduleId}`,
      {
        currentstatus,
      },
    );

    alert(res.data.message);

    loadAll();
  } catch (err) {
  console.log(err);
  console.log(err.response);

  alert(
    JSON.stringify(err.response?.data || err.message)
  );
}
};

  /* =====================================
     ROUTES
  ===================================== */

  const loadRoutes = async () => {

    try {
      const station=localStorage.getItem("station");
      const res = await api.get(
        `http://localhost:5000/api/getter/routes/${station}`
      );

      setRoutes(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  /* =====================================
     SCHEDULES
  ===================================== */

  const loadSchedules = async () => {

    try {
       const station=localStorage.getItem("station");
      
      const res = await api.get(
        `http://localhost:5000/api/getter/schedules/${station}`
      );

      setSchedules(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  const addSchedule = async () => {

    try {

      await api.post(
        "http://localhost:5000/api/getter/schedules",
        {
          ...scheduleForm,
          creator: localStorage.getItem("email"),
          source: localStorage.getItem("station")
        }
      );

      alert("Schedule Added");

      setScheduleForm({
        plateNumber: "",
        Destination: "",
        travelDate: ""
      });

      loadSchedules();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        err.message
      );
    }
  };

  const updateSchedule = async () => {

    try {

      await api.put(
        `http://localhost:5000/api/getter/schedules/${editSchedule.id}`,
        editSchedule
      );

      alert("Schedule Updated");

      setEditSchedule(null);

      loadSchedules();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        err.message
      );
    }
  };

  const deleteSchedule = async (id) => {

    if (!window.confirm("Delete Schedule?"))
      return;

    try {

      await api.delete(
        `http://localhost:5000/api/getter/schedules/${id}`
      );

      loadSchedules();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        err.message
      );
    }
  };


  const loadProviders = async () => {
  try {

    const res = await api.get(
      "http://localhost:5000/api/getter/providers"
    );

    setProviders(res.data);

  } catch (err) {
    console.log(err);
  }
};


  return (
    <div style={{ display: "flex" }}>


      <div style={{ flex: 1 }}>

       <Navbar/>

        <div className="container mt-4">

          <h2>Getter Dashboard</h2>

          {/* TABS */}

          <div className="mb-4">

            <button
              className={`btn me-2 ${
                activeTab === "vehicles"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
              onClick={() =>
                setActiveTab("vehicles")
              }
            >
              Vehicles
            </button>

            <button
              className={`btn ${
                activeTab === "schedules"
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
              onClick={() =>
                setActiveTab("schedules")
              }
            >
              Daily Schedule
            </button>

          </div>

          {/* ===================================
              VEHICLE TAB
          =================================== */}

          {activeTab === "vehicles" && (
            <>
             {showVehicleForm && (
  <div className="card p-3 mb-4">

    <h4>Register Vehicle</h4>

    <input
      className="form-control mb-2"
      placeholder="Plate Number"
      value={vehicleForm.plateNumber}
      onChange={(e) =>
        setVehicleForm({
          ...vehicleForm,
          plateNumber: e.target.value
        })
      }
    />

    <input
      type="number"
      className="form-control mb-2"
      placeholder="Seat Capacity"
      value={vehicleForm.seatCapacity}
      onChange={(e) =>
        setVehicleForm({
          ...vehicleForm,
          seatCapacity: e.target.value
        })
      }
    />

    <select
      className="form-control mb-2"
      value={vehicleForm.level}
      onChange={(e) =>
        setVehicleForm({
          ...vehicleForm,
          level: e.target.value
        })
      }
    >
      <option value="">Select Vehicle Level</option>
      <option value="Small1stlevel">Small 1st Level</option>
      <option value="Small2ndlevel">Small 2nd Level</option>
      <option value="Small3rdlevel">Small 3rd Level</option>
      <option value="Medium1stlevel">Medium 1st Level</option>
      <option value="Medium2ndlevel">Medium 2nd Level</option>
      <option value="Medium3rdlevel">Medium 3rd Level</option>
      <option value="Large1stlevel">Large 1st Level</option>
      <option value="Large2ndlevel">Large 2nd Level</option>
      <option value="Large3rdlevel">Large 3rd Level</option>
    </select>

    <select
      className="form-control mb-2"
      value={vehicleForm.provider}
      onChange={(e) =>
        setVehicleForm({
          ...vehicleForm,
          provider: e.target.value
        })
      }
    >
      <option value="">Select Provider</option>

      {providers.map((p) => (
        <option
          key={p.providerName}
          value={p.providerName}
        >
          {p.providerName}
        </option>
      ))}
    </select>

    <input
      className="form-control mb-2"
      placeholder="Side Number"
      value={vehicleForm.sideNumber}
      onChange={(e) =>
        setVehicleForm({
          ...vehicleForm,
          sideNumber: e.target.value
        })
      }
    />

    <button
      className="btn btn-success"
      onClick={addVehicle}
    >
      <FaBus className="me-2" />
      Register Vehicle
    </button>

  </div>
)}

<button
  className="btn btn-primary mb-3"
  onClick={() => setShowVehicleForm(!showVehicleForm)}
>
  <FaBus className="me-2" />
  {showVehicleForm ? (
    <>
      <FaChevronUp className="ms-2 me-2" />
      Hide Vehicle Registration
    </>
  ) : (
    <>
      <FaChevronDown className="ms-2 me-2" />
      Register Vehicle
    </>
  )}
</button>

            <div className="table-responsive">
  <table className="table table-bordered table-striped table-hover align-middle shadow-sm">

    <thead className="table-success">
      <tr>
        <th>#</th>
        <th>Vehicle</th>
        <th>Destination</th>
        <th>Total Price</th>
        <th>Booked Seat</th>
        <th>Creator</th>
        <th>Actions</th>
      </tr>
    </thead>
          <tbody>

                  {vehicles.map((v, index) => (

                    <tr key={v.plateNumber}>

                      <td>{index + 1}</td>
                      <td>{v.plateNumber}</td>
                      <td>{v.seatCapacity}</td>
                      <td>{v.level}</td>
                      <td>{v.provider}</td>
                      <td>{v.sideNumber}</td>
<td>
  <button
    className="btn btn-primary btn-sm me-2"
    onClick={() => setEditVehicle(v)}
    title="Edit Vehicle"
  >
    <FaEdit className="me-1" />
    Edit
  </button>

  <button
    className="btn btn-danger btn-sm"
    title="Delete Vehicle"
    onClick={() => {
      Swal.fire({
        title: "Delete Vehicle?",
        text: `Are you sure you want to delete vehicle ${v.plateNumber}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteVehicle(v.plateNumber);

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Vehicle has been deleted successfully.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    }}
  >
    <FaTrashAlt className="me-1" />
    
  </button>
</td>

                    </tr>

                  ))}

                </tbody>

              </table>
</div>
              {editVehicle && (
                <div className="card p-3 mt-3">

                  <h4>Edit Vehicle</h4>

                  <input
                    className="form-control mb-2"
                    value={editVehicle.seatCapacity}
                    onChange={(e) =>
                      setEditVehicle({
                        ...editVehicle,
                        seatCapacity: e.target.value
                      })
                    }
                  />

                 <select
                    className="form-control mb-2"
                    value={editVehicle.level}
                    onChange={(e) =>
                      setEditVehicle({
                        ...editVehicle,
                        level: e.target.value
                      })
                    }
                  >
  <option value="Small1stlevel">
    Small 1st Level
  </option>

  <option value="Small2ndlevel">
    Small 2nd Level
  </option>

  <option value="Small3rdlevel">
    Small 3rd Level
  </option>

  <option value="Medium1stlevel">
    Medium 1st Level
  </option>

  <option value="Medium2ndlevel">
    Medium 2nd Level
  </option>

  <option value="Medium3rdlevel">
    Medium 3rd Level
  </option>

  <option value="Large1stlevel">
    Large 1st Level
  </option>

  <option value="Large2ndlevel">
    Large 2nd Level
  </option>

  <option value="Large3rdlevel">
    Large 3rd Level
  </option>
</select>

<select
  className="form-control mb-2"
  value={editVehicle.provider}
  onChange={(e) =>
    setEditVehicle({
      ...editVehicle,
      provider: e.target.value
    })
  }
>
  {providers.map((p) => (
    <option
      key={p.providerName}
      value={p.providerName}
    >
      {p.providerName}
    </option>
  ))}
</select>

                  <button
                    className="btn btn-primary"
                    onClick={updateVehicle}
                  >
                    Update Vehicle
                  </button>

                </div>
              )}
            </>
          )}

          {/* ===================================
              SCHEDULE TAB
          =================================== */}

          {activeTab === "schedules" && (
            <>
             {showAssignForm && (
  <div className="card p-3 mb-4">

    <h4>Assign Vehicle Route</h4>

    <Select
      options={vehicles
        .filter(v => v.status === "AVAILABLE")
        .map(v => ({
          value: v.plateNumber,
          label: v.plateNumber,
        }))
      }
      onChange={(selected) =>
        setScheduleForm({
          ...scheduleForm,
          plateNumber: selected.value,
        })
      }
      placeholder="SELECT VEHICLE"
      isSearchable
    />

    <Select
      className="mb-2"
      placeholder="SELECT ROUTE"
      isSearchable
      options={routes.map((r) => ({
        value: r.destinationName,
        label: r.destinationName,
      }))}
      value={
        scheduleForm.Destination
          ? {
              value: scheduleForm.Destination,
              label: scheduleForm.Destination,
            }
          : null
      }
      onChange={(selected) =>
        setScheduleForm({
          ...scheduleForm,
          Destination: selected ? selected.value : "",
        })
      }
    />

    <button
      className="btn btn-success"
      onClick={addSchedule}
    >
      Create Schedule
    </button>

  </div>
)}
<button
  className="btn btn-primary mb-3"
  onClick={() => setShowAssignForm(!showAssignForm)}
>
  {showAssignForm ? (
    <>
      <FaMinus className="me-2" />
      Hide 
    </>
  ) : (
    <>
      <FaPlus className="me-2" />
      SCHEDULE
    </>
  )}
</button>
<div className="row mb-3">
  <div className="col-md-4">
    <input
      type="text"
      className="form-control"
      placeholder="Search "
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
</div>
                    <div className="table-responsive">
  <table className="table table-bordered table-striped table-hover align-middle shadow-sm">

    <thead className="table-success">
                  <tr>
                    <th>#</th>
                    <th>Vehicle</th>
                    <th>Destination</th>
                    <th>Total Price</th>
                    <th>Booked Seat</th>
                    <th>Creator</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
  {schedules
  .filter((s) =>
    s.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.Destination.toLowerCase().includes(search.toLowerCase())
  )
  .map((s, index) => (
    <tr key={s.id}>
      <td>{index + 1 }</td>
      <td>{s.plateNumber}</td>
      <td>{s.Destination}</td>
      <td>{s.totalPrice}</td>
      <td>{s.soldSeats} / {s.seatCapacity}</td>
      <td>{s.creator}</td>

     <td>

  <button
    className={`btn btn-sm me-2 ${
      s.status === "DISABLED"
        ? "btn-success"
        : "btn-secondary"
    }`}
    onClick={() =>
      Permission(
        s.id,
        s.status === "DISABLED"
          ? "SCHEDULED"
          : "DISABLED"
      )
    }
  >
    {s.status === "DISABLED" ? (
      <>
        <FaCheckCircle className="me-1" />
        Enable
      </>
    ) : (
      <>
        <FaBan className="me-1" />
        Disable
      </>
    )}
  </button>

  <button
    className="btn btn-primary btn-sm me-2"
    onClick={() => setEditSchedule(s)}
  >
    <FaEdit className="me-1" />
    
  </button>

  <button
    className="btn btn-danger btn-sm"
    onClick={() => {
      Swal.fire({
        title: "Delete Schedule?",
        text: `Are you sure you want to delete Schedule ${s.plateNumber}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteSchedule(s.id);

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Schedule has been deleted successfully.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    }}
  >
    <FaTrash className="me-1" />
   
  </button>

</td>
    </tr>
  ))}
</tbody> 
              </table>
</div>
              {editSchedule && (
                <div className="card p-3 mt-3">
                  <h4>Edit Schedule</h4>

                  <select
                    className="form-control mb-2"
                    value={editSchedule.plateNumber}
                    onChange={(e) =>
                      setEditSchedule({
                        ...editSchedule,
                        plateNumber: e.target.value
                      })
                    }
                  >
                    {vehicles.map((v) => (
                      <option
                        key={v.plateNumber}
                        value={v.plateNumber}
                      >
                        {v.plateNumber}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-control mb-2"
                    value={editSchedule.Destination}
                    onChange={(e) =>
                      setEditSchedule({
                        ...editSchedule,
                        Destination: e.target.value
                      })
                    }
                  >
                    {routes.map((r) => (
                      <option
                        key={r.destinationName}
                        value={r.destinationName}
                      >
                        {r.destinationName}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn btn-primary"
                    onClick={updateSchedule}
                  >
                    Update Schedule
                  </button>

                  <button
                    className="btn btn-secondary ms-2"
                    onClick={() => setEditSchedule(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  );
}