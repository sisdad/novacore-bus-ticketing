import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import DashboardCards from "../components/DashboardCards";
import { FaEdit, FaTrashAlt, FaKey } from "react-icons/fa";
import "../styles/dashboard.css";
import useFormValidation from "../hooks/useFormValidation";
import { validators } from "../utils/validation";

export default function AdminDashboard() {

  const showNotification = (message, type = "success") => {
          alert(message); // simple fallback
        };
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const {

            errors,
            validate

        } = useFormValidation();

        useEffect(() => {
          

          if (!token) {
            navigate("/");
          }

          if (role !== "admin") {
            navigate("/unauthorized");
          }
        }, []);


  /* ===========================================
      MAIN TABS
  =========================================== */

  const [mainTab, setMainTab] = useState("stations");

  const [stationTab, setStationTab] = useState("list");

  const [managerTab, setManagerTab] = useState("list");

  /* ===========================================
      DATA
  =========================================== */

  const [stations, setStations] = useState([]);

  const [managers, setManagers] = useState([]);

  /* ===========================================
      SEARCH
  =========================================== */

  const [stationSearch, setStationSearch] = useState("");

  const [managerSearch, setManagerSearch] = useState("");

  /* ===========================================
      FORMS
  =========================================== */

  const [stationForm, setStationForm] = useState({
    stationName: "",
    Region: "",
  });

  const [managerForm, setManagerForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  stationId: "",
});

  /* ===========================================
      EDIT
  =========================================== */

  const [editStation, setEditStation] =
    useState(null);

  const [editManager, setEditManager] =
    useState(null);

  /* ===========================================
      LOAD DATA
  =========================================== */

  useEffect(() => {
    loadStations();
    loadManagers();
  }, []);

  /* ===========================================
      LOAD STATIONS
  =========================================== */

  const loadStations = async () => {
    try {
      const res = await api.get(
        "http://localhost:5000/api/admin/stations"
      );

      setStations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ===========================================
      LOAD MANAGERS
  =========================================== */

  const loadManagers = async () => {
    try {
      const res = await api.get(
        "http://localhost:5000/api/admin/managers"
      );

      setManagers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ===========================================
      ADD STATION
  =========================================== */

  const addStation = async () => {
     const valid = validate(stationForm,{

        stationName:validators.name,

        Region:validators.name,


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
        "http://localhost:5000/api/admin/stations",
        stationForm
      );

      setStationForm({
        stationName: "",
        Region: "",
      });

      loadStations();

      alert("Station Added Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  /* ===========================================
      UPDATE STATION
  =========================================== */

  const updateStation = async () => {
    try {
      await api.put(
        `http://localhost:5000/api/admin/stations/${editStation.id}`,
        editStation
      );

      setEditStation(null);

      loadStations();

      alert("Station Updated");
    } catch (err) {
      console.log(err);
    }
  };

  /* ===========================================
      DELETE STATION
  =========================================== */

  const deleteStation = async (id) => {
    if (!window.confirm("Delete this station?")) return;

    try {
      await api.delete(
        `http://localhost:5000/api/admin/stations/${id}`
      );

      loadStations();
    } catch (err) {
      console.log(err);
    }
  };

  /* ===========================================
      ADD MANAGER
  =========================================== */

  const addManager = async () => {
  if (!managerForm.stationId) {
    alert("Please select a station.");
    return;
  }

    const valid = validate(managerForm,{

        firstName:validators.name,

        lastName:validators.name,

        email:validators.email,

        password:validators.password,

        phoneNumber:validators.phone,

        stationId:validators.select

    });

    if(!valid){

        showNotification(
            "Please fix validation errors.",
            "warning"
        );

        return;
    }

    try{

        await api.post(
            "/admin/managers",
            managerForm
        );

        showNotification(
            "Manager added successfully.",
            "success"
        );

    }

    catch(err){

        showNotification(
            "Unable to save manager.",
            "error"
        );

    }


  try {
    await api.post(
      "http://localhost:5000/api/admin/managers",
      managerForm
    );

    setManagerForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      stationId: "",
    });

    loadManagers();

    alert("Manager Added Successfully");
  } catch (err) {
    console.log(err);
  }
};

  /* ===========================================
      UPDATE MANAGER
  =========================================== */

  const updateManager = async () => {
    try {
      await api.put(
        `http://localhost:5000/api/admin/managers/${editManager.id}`,
        editManager
      );

      setEditManager(null);

      loadManagers();

      alert("Manager Updated");
    } catch (err) {
      console.log(err);
    }
  };

  /* ===========================================
      DELETE MANAGER
  =========================================== */

  const deleteManager = async (id) => {
    if (!window.confirm("Delete this manager?")) return;

    try {
      await api.delete(
        `http://localhost:5000/api/admin/managers/${id}`
      );

      loadManagers();
    } catch (err) {
      console.log(err);
    }
  };

  /* ===========================================
      FILTERED DATA
  =========================================== */

  const filteredStations = stations.filter((s) =>
    s.stationName
      .toLowerCase()
      .includes(stationSearch.toLowerCase())
  );

  const filteredManagers = managers.filter(
    (m) =>
      `${m.firstName} ${m.lastName}`
        .toLowerCase()
        .includes(managerSearch.toLowerCase()) ||
      m.email
        .toLowerCase()
        .includes(managerSearch.toLowerCase())
  );

  return (<div className="dashboard-container">

                  {/* ================= SIDEBAR ================= */}

                  

                  {/* ================= MAIN CONTENT ================= */}

                  <div
                    className="dashboard-content"
                   >

                      {/* NAVBAR */}

                      <Navbar />

                      {/* PAGE */}

                      <div className="page-content">

                        {/* PAGE TITLE */}

                          <div className="d-flex justify-content-between align-items-center mb-4">

                              <div>
                                <h2 className="fw-bold">
                                  Admin Dashboard
                                </h2>

                                
                            </div>

                          </div>

                            {/* ================= DASHBOARD CARDS ================= */}

                            <DashboardCards
                              stations={stations}
                              managers={managers}
                              routes={[]}
                              vehicles={[]}
                              staff={[]}
                              tickets={0}
                              revenue={0}
                            />

                            {/* ================= MAIN CARD ================= */}

                            <div className="card main-card">

                              <div className="card-body">

                                {/* MAIN TABS */}

                                <ul className="nav nav-pills mb-4">

                                  <li className="nav-item">

                                    <button
                                      className={`nav-link ${
                                        mainTab === "stations"
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setMainTab("stations")
                                      }
                                    >
                                      🚌 Stations
                                    </button>

                                  </li>

                                  <li className="nav-item">

                                    <button
                                      className={`nav-link ${
                                        mainTab === "managers"
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setMainTab("managers")
                                      }
                                    >
                                      👨‍💼 Managers
                                    </button>

                                  </li>

                                </ul>

                                {/* ===========================================================
                                    STATIONS
                                =========================================================== */}

                                {mainTab === "stations" && (

                                  <>

                                    {/* SUB TABS */}

                                    <ul className="nav nav-tabs mb-4">

                                      <li className="nav-item">

                                        <button
                                          className={`nav-link ${
                                            stationTab === "add"
                                              ? "active"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            setStationTab("add")
                                          }
                                        >
                                          ➕ Add Station
                                        </button>

                                      </li>

                                      <li className="nav-item">

                                        <button
                                          className={`nav-link ${
                                            stationTab === "list"
                                              ? "active"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            setStationTab("list")
                                          }
                                        >
                                          📋 Station List
                                        </button>

                                      </li>

                                    </ul>
                                    {/* ================= ADD STATION ================= */}

                            {stationTab === "add" && (
                              <div className="row">

                                <div className="col-lg-6">

                            <div className="card shadow border-0">

                              <div className="card-header bg-primary text-white">
                                <h4 className="mb-0">Add New Station</h4>
                              </div>

                              <div className="card-body">

                                <div className="mb-3">
                                  <label className="form-label">
                                    Station Name
                                  </label>

                                  <input
                                    className="form-control"
                                    placeholder="Enter Station Name"
                                    value={stationForm.stationName}
                                    onChange={(e) =>
                                      setStationForm({
                                        ...stationForm,
                                        stationName: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="mb-3">
                                  <label className="form-label">
                                    Region
                                  </label>

                                  <input
                                    className="form-control"
                                    placeholder="Enter Region"
                                    value={stationForm.Region}
                                    onChange={(e) =>
                                      setStationForm({
                                        ...stationForm,
                                        Region: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <button
                                  className="btn btn-success w-100"
                                  onClick={addStation}
                                >
                                  Save Station
                                </button>

                        </div>

                      </div>

                    </div>

                    <div className="col-lg-6 d-flex align-items-center">

                      <div className="card shadow border-0 w-100">

                        <div className="card-body text-center">

                          <h2>🚌</h2>

                          <h4>Station Information</h4>

                          <p className="text-muted">

                            Register bus stations for the transport system.

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>
                )}

                {/* ================= STATION LIST ================= */}

                {stationTab === "list" && (
                  <>

                    <div className="d-flex justify-content-between mb-3">

                    
                      <input
                        className="form-control search-box"
                        placeholder="Search Station..."
                        value={stationSearch}
                        onChange={(e) =>
                          setStationSearch(e.target.value)
                        }
                      />

                    </div>

                    <div className="table-responsive">

                      <table className="table table-hover table-striped">

                        <thead className="table-success">

                          <tr>

                            <th>#</th>

                            <th>Station Name</th>

                            <th>Region</th>

                            <th width="180">
                              Actions
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {filteredStations.map((station, index) => (

                            <tr key={station.id}>

                              <td>{index + 1}</td>

                              <td>{station.stationName}</td>

                              <td>{station.Region}</td>

                             <td>

  <button
    className="btn btn-outline-primary btn-sm me-2"
    title="Edit Station"
    onClick={() => setEditStation(station)}
  >
    <FaEdit />
  </button>

  <button
    className="btn btn-outline-danger btn-sm"
    title="Delete Station"
    onClick={() => deleteStation(station.id)}
  >
    <FaTrashAlt />
  </button>

</td>

                            </tr>

                          ))}

                        </tbody>

                      </table>

                    </div>

                    {/* ================= EDIT STATION ================= */}

                    {editStation && (

                      <div
                        className="modal fade show"
                        style={{
                          display: "block",
                          background: "rgba(0,0,0,.4)",
                        }}
                      >

                        <div className="modal-dialog">

                          <div className="modal-content">

                            <div className="modal-header">

                              <h4>Edit Station</h4>

                              <button
                                className="btn-close"
                                onClick={() =>
                                  setEditStation(null)
                                }
                              />

                            </div>

                            <div className="modal-body">

                              <input
                                className="form-control mb-3"
                                value={editStation.stationName}
                                onChange={(e) =>
                                  setEditStation({
                                    ...editStation,
                                    stationName: e.target.value,
                                  })
                                }
                              />

                              <input
                                className="form-control"
                                value={editStation.Region}
                                onChange={(e) =>
                                  setEditStation({
                                    ...editStation,
                                    Region: e.target.value,
                                  })
                                }
                              />

                            </div>

                            <div className="modal-footer">

                              <button
                                className="btn btn-secondary"
                                onClick={() =>
                                  setEditStation(null)
                                }
                              >
                                Cancel
                              </button>

                              <button
                                className="btn btn-primary"
                                onClick={updateStation}
                              >
                                Update
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    )}

                  </>
                )}
              </>

           )}
                {/* ================= END STATION SECTION ================= */}

                {mainTab === "managers" && (

                <>{/* ================= MANAGER TABS ================= */}

                <ul className="nav nav-tabs mb-4">

                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        managerTab === "add" ? "active" : ""
                      }`}
                      onClick={() => setManagerTab("add")}
                    >
                      ➕ Add Manager
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        managerTab === "list" ? "active" : ""
                      }`}
                      onClick={() => setManagerTab("list")}
                    >
                      📋 Manager List
                    </button>
                  </li>

                </ul>

                {/* ================= ADD MANAGER ================= */}

                {managerTab === "add" && (

                <div className="row">

                <div className="col-lg-6">

                <div className="card shadow border-0">

                <div className="card-header bg-success text-white">
                <h4 className="mb-0">
                Add New Manager
                </h4>
                </div>

                <div className="card-body">
                
                <input
                className="form-control mb-3"
                placeholder="First Name"
                value={managerForm.firstName}
                onChange={(e)=>
                setManagerForm({
                ...managerForm,
                firstName:e.target.value
                })
                }
                />

                <input
                className="form-control mb-3"
                placeholder="Last Name"
                value={managerForm.lastName}
                onChange={(e)=>
                setManagerForm({
                ...managerForm,
                lastName:e.target.value
                })
                }
                />

                <input
                className={`form-control ${
                    errors.email ? "is-invalid" : ""
                    }`}
                placeholder="Email"
                value={managerForm.email}
                onChange={(e)=>
                setManagerForm({
                ...managerForm,
                email:e.target.value
                })
                }
                />

                <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={managerForm.password}
                onChange={(e)=>
                setManagerForm({
                ...managerForm,
                password:e.target.value
                })
                }
                />

                <input
                className="form-control mb-3"
                placeholder="Phone Number"
                value={managerForm.phoneNumber}
                onChange={(e)=>
                setManagerForm({
                ...managerForm,
                phoneNumber:e.target.value
                })
                }
                />
                <div className="mb-3">
                
                  <select
                    className="form-select"
                    value={managerForm.stationId}
                    onChange={(e) =>
                      setManagerForm({
                        ...managerForm,
                        stationId: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Station</option>

                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.stationName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                className="btn btn-success w-100"
                onClick={addManager}
                >
                Save Manager
                </button>

                </div>

                </div>

                </div>

                <div className="col-lg-6">

                <div className="card shadow border-0">

                <div className="card-body text-center">

                <h1>👨‍💼</h1>

                <h4>Manager Registration</h4>

                <p className="text-muted">
                Create new station managers.
                </p>

                </div>

                </div>

                </div>

                </div>

                )}

                {/* ================= MANAGER LIST ================= */}

                {managerTab==="list" && (

                <>

                <div className="d-flex justify-content-between mb-3">

                
                <input
                className="form-control search-box"
                placeholder="Search Manager..."
                value={managerSearch}
                onChange={(e)=>
                setManagerSearch(e.target.value)
                }
                />

                </div>

                <div className="table-responsive">

                <table className="table table-hover table-striped">

                <thead className="table-success">

                <tr>

                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>station</th>
                <th width="250">
                Actions
                </th>

                </tr>

                </thead>

                <tbody>

                {filteredManagers.map((manager, index)=>(

                <tr key={manager.id}>

                <td>{index + 1}</td>

                <td>
                {manager.firstName} {manager.lastName}
                </td>

                <td>{manager.email}</td>

                <td>{manager.phoneNumber}</td>
                <td>{manager.station}</td>

               <td>

  {/* EDIT */}
  <button
    className="btn btn-outline-primary btn-sm me-2"
    title="Edit Manager"
    onClick={() => setEditManager(manager)}
  >
    <FaEdit />
  </button>

  {/* RESET PASSWORD */}
  <button
    className="btn btn-outline-info btn-sm me-2"
    title="Reset Password"
    onClick={() => {
      const password = prompt("Enter New Password");

      if (password) {
        api.put(
          `http://localhost:5000/api/admin/reset-password/${manager.id}`,
          { password },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(() => {
          alert("Password Reset Successfully");
        });
      }
    }}
  >
    <FaKey />
    Reset
  </button>

  {/* DELETE */}
  <button
    className="btn btn-outline-danger btn-sm"
    title="Delete Manager"
    onClick={() => deleteManager(manager.id)}
  >
    <FaTrashAlt />
  </button>

</td>

                </tr>

                ))}

                </tbody>

                </table>

                </div>

                {/* ================= EDIT MANAGER ================= */}

                {editManager && (

                <div
                className="modal fade show"
                style={{
                display:"block",
                background:"rgba(0,0,0,.5)"
                }}
                >

                <div className="modal-dialog modal-lg">

                <div className="modal-content">

                <div className="modal-header">

                <h4>Edit Manager</h4>

                <button
                className="btn-close"
                onClick={()=>
                setEditManager(null)
                }
                />

                </div>

                <div className="modal-body">

                <div className="row">

                <div className="col-md-6">

                <input
                className="form-control mb-3"
                value={editManager.firstName}
                onChange={(e)=>
                setEditManager({
                ...editManager,
                firstName:e.target.value
                })
                }
                />

                </div>

                <div className="col-md-6">

                <input
                className="form-control mb-3"
                value={editManager.lastName}
                onChange={(e)=>
                setEditManager({
                ...editManager,
                lastName:e.target.value
                })
                }
                />

                </div>

                <div className="col-md-6">

                <input
                className="form-control mb-3"
                value={editManager.email}
                onChange={(e)=>
                setEditManager({
                ...editManager,
                email:e.target.value
                })
                }
                />

                </div>

                <div className="col-md-6">

                <input
                className="form-control mb-3"
                value={editManager.phoneNumber}
                onChange={(e)=>
                setEditManager({
                ...editManager,
                phoneNumber:e.target.value
                })
                }
                />

                </div>

                </div>

                </div>

                <div className="modal-footer">

                <button
                className="btn btn-secondary"
                onClick={()=>
                setEditManager(null)
                }
                >
                Cancel
                </button>

                <button
                className="btn btn-primary"
                onClick={updateManager}
                >
                Update
                </button>

                </div>

                </div>

                </div>

                </div>

                )}

                </>

                )}

                </>

                )}

                </div>

                </div>

                </div>

                </div>
</div>
                );
                }