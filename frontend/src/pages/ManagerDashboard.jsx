import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import useFormValidation from "../hooks/useFormValidation";
import { validators } from "../utils/validation";
import { FaEdit,FaKey, FaTrashAlt, FaUserPlus, FaRoute, FaTimes, FaMoneyBillWave } from "react-icons/fa";
export default function ManagerDashboard() {

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
        return;
    }

    if (role !== "manager") {
        navigate("/unauthorized");
    }

}, [navigate, token, role]);


  const [activeTab, setActiveTab] = useState("getter");

  /* ================= USERS ================= */
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
 const [routeOptions, setRouteOptions] = useState([]);
const [showUserForm, setShowUserForm] = useState(false);
const [showRouteForm, setShowRouteForm] = useState(false);
const [showPriceForm, setShowPriceForm] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const loadRouteOptions = async () => {
  try {
    const res = await api.get(
      "http://localhost:5000/api/manager/routes"
    );

    setRouteOptions(res.data);
  } catch (err) {
    console.log(err);
  }
};
  /* ================= ROUTES ================= */
  const [routes, setRoutes] = useState([]);
  const [routeForm, setRouteForm] = useState({
    destinationName: "",
    DestinationRegion: "",
    Distance: "",
  });

  const [editRoute, setEditRoute] = useState(null);

  /* ================= PRICES ================= */
  const [prices, setPrices] = useState([]);


 const [priceForm, setPriceForm] = useState({
  totalPrice: "",
  Destination: "",
  VehicleLevel: "",
});

  const [editPrice, setEditPrice] = useState(null);

  const station = localStorage.getItem("station");

  /* =====================================================
     LOAD DATA
  ===================================================== */

 useEffect(() => {
  if (activeTab === "routes") {
    loadRoutes();
  }
  else if (activeTab === "prices") {
    loadPrices();
    loadRouteOptions();
  }
  else {
    loadUsers();
  }
}, [activeTab]);


  /* ================= USERS ================= */

  const loadUsers = async () => {
    try {
      const res = await api.get(
        `http://localhost:5000/api/manager/users/${activeTab}`,
         {
        headers: {
            Authorization: `Bearer ${token}`,
                 },
          }
      );
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const addUser = async () => {
    const valid = validate(form,{
    
            firstName:validators.name,
            lastName:validators.name,
            email:validators.email,
            phoneNumber:validators.number,
            password:validators.password,
    
    
    
        });
    
        if(!valid){
    
            showNotification(
                "Please fix validation errors.",
                "warning"
            );
    
            return;
        }

    await api.post("http://localhost:5000/api/manager/users",
          {
      ...form,
      role: activeTab,
    });

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
    });

    loadUsers();
  };

  const updateUser = async () => {
    await api.put(
      `http://localhost:5000/api/manager/users/${editUser.id}`,
         
      editUser
    );

    setEditUser(null);
    loadUsers();
  };

  const deleteUser = async (id) => {
    await api.delete(`http://localhost:5000/api/manager/users/${id}`,
         {
        headers: {
            Authorization: `Bearer ${token}`,
                 },
          });
    loadUsers();
  };

  /* ================= ROUTES ================= */

  const loadRoutes = async () => {
    const station=localStorage.getItem("station");
    const res = await api.get(`http://localhost:5000/api/manager/routes/${station}`,
         {
        headers: {
            Authorization: `Bearer ${token}`,
                 },
          });
    setRoutes(res.data);
  };

  const addRoute = async () => {
    
     const valid = validate(routeForm,{
    
            destinationName:validators.name,
            DestinationRegion:validators.name,
            Distance:validators.number,
    
        });
    
        if(!valid){
    
            showNotification(
                "Please fix validation errors.",
                "warning"
            );
    
            return;
        }


    await api.post("http://localhost:5000/api/manager/routes",
          {
      ...routeForm,
      creator: localStorage.getItem("email"),
      source: localStorage.getItem("station"),
    });

    setRouteForm({
      destinationName: "",
      DestinationRegion: "",
      Distance: "",
    });

    loadRoutes();
  };

  const updateRoute = async () => {
    await api.put(
      `http://localhost:5000/api/manager/routes/${editRoute.destinationName}`,
         
      editRoute
    );

    setEditRoute(null);
    loadRoutes();
  };

  const deleteRoute = async (name) => {
    await api.delete(
      `http://localhost:5000/api/manager/routes/${name}`,
         {
        headers: {
            Authorization: `Bearer ${token}`,
                 },
          }
    );
    loadRoutes();
  };

  /* ================= PRICES ================= */

  const loadPrices = async () => {
    const res = await api.get("http://localhost:5000/api/manager/prices",
         {
        headers: {
            Authorization: `Bearer ${token}`,
                 },
          });
    setPrices(res.data);
  };

  const addPrice = async () => {

    const valid = validate(priceForm,{
    
            Destination:validators.name,
            VehicleLevel:validators.name,
            totalPrice:validators.number,
    
        });
    
        if(!valid){
    
            showNotification(
                "Please fix validation errors.",
                "warning"
            );
    
            return;
        }

        
  await api.post(
    "http://localhost:5000/api/manager/prices",
         
    {
      totalPrice: priceForm.totalPrice,
      Destination: priceForm.Destination,
      VehicleLevel: priceForm.VehicleLevel, 
      source: localStorage.getItem("station"),
      Creator: localStorage.getItem("email"),
    }
  );

  setPriceForm({
    totalPrice: "",
    Destination: "",
    VehicleLevel: "",
  });

  loadPrices();
};
  const updatePrice = async () => {
    await api.put(
      `http://localhost:5000/api/manager/prices/${editPrice.id}`,
         
      editPrice
    );

    setEditPrice(null);
    loadPrices();
  };

  const deletePrice = async (id) => {
    await api.delete(`http://localhost:5000/api/manager/prices/${id}`,
         {
        headers: {
            Authorization: `Bearer ${token}`,
                 },
          });
    loadPrices();
  };

  /* =====================================================
     UI
  ===================================================== */


  
  const resetPassword = async (id) => {
    
  const newPassword = prompt("Enter new password");

  if (!newPassword) return;

  try {
    await api.put(
      `http://localhost:5000/api/manager/reset-password/${id}`,
         
      {
        password: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Password reset successfully.");
  } catch (err) {
    console.log(err);
    alert("Reset failed.");
  }
};

  return (
    <div style={{ display: "flex" }}>
     

      <div style={{ flex: 1 }}>
         <Navbar/>

        <div className="container-fluid mt-4 px-3">
          <h2>Manager Dashboard</h2>

          {/* ================= TABS ================= */}
          <div className="mb-4">
            <button
              className={`btn me-2 ${activeTab === "getter" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab("getter")}
            >
              Getter
            </button>

            <button
              className={`btn me-2 ${activeTab === "finance" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab("finance")}
            >
              Finance
            </button>

            <button
              className={`btn me-2 ${activeTab === "ticketer" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab("ticketer")}
            >
              Ticketer
            </button>

            <button
              className={`btn me-2 ${activeTab === "routes" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab("routes")}
            >
              Routes
            </button>

            <button
              className={`btn ${activeTab === "prices" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab("prices")}
            >
              Prices
            </button>
          </div>

          {/* =====================================================
              USERS SECTION
          ===================================================== */}

          {["getter", "finance", "ticketer"].includes(activeTab) && (
            <>
<button
  className="btn btn-primary mb-3"
  onClick={() => setShowUserForm(!showUserForm)}
>
  {showUserForm ? (
    <>
      <FaTimes className="me-2" />
      Close Form
    </>
  ) : (
    <>
      <FaUserPlus className="me-2" />
      Register {activeTab}
    </>
  )}
</button>

   {showUserForm && (
  <div className="card p-3 mb-4">

    <h4>Add {activeTab}</h4>

    <input
      className="form-control mb-2"
      placeholder="First Name"
      value={form.firstName}
      onChange={(e) =>
        setForm({ ...form, firstName: e.target.value })
      }
    />

    <input
      className="form-control mb-2"
      placeholder="Last Name"
      value={form.lastName}
      onChange={(e) =>
        setForm({ ...form, lastName: e.target.value })
      }
    />

    <input
      className="form-control mb-2"
      placeholder="Email"
      value={form.email}
      onChange={(e) =>
        setForm({ ...form, email: e.target.value })
      }
    />

    <input
      className="form-control mb-2"
      placeholder="Phone"
      value={form.phoneNumber}
      onChange={(e) =>
        setForm({ ...form, phoneNumber: e.target.value })
      }
    />

    <input
      type="password"
      className="form-control mb-2"
      placeholder="Password"
      value={form.password}
      onChange={(e) =>
        setForm({ ...form, password: e.target.value })
      }
    />

    <button
      className="btn btn-success"
      onClick={addUser}
    >
      Add {activeTab}
    </button>

  </div>
)}

              <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover align-middle shadow-sm">

                <thead className="table-success">
                  <tr>
                    <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr key={u.id}>
                      <td>{index + 1}</td>
                      <td>{u.firstName} {u.lastName}</td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>
                      <td>
  <button
    className="btn btn-primary btn-sm me-2"
    title="Edit User"
    onClick={() => setEditUser(u)}
  >
    <FaEdit className="me-1" />
    Edit
  </button>

  <button
    className="btn btn-danger btn-sm me-2"
    title="Delete User"
    onClick={() => {
      Swal.fire({
        title: "Delete User?",
        text: `Are you sure you want to delete ${u.firstName} ${u.lastName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteUser(u.id);

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User has been deleted successfully.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    }}
  >
    <FaTrashAlt className="me-1" />
    
  </button>

  <button
    className="btn btn-info btn-sm"
    title="Reset Password"
    onClick={() => resetPassword(u.id)}
  >
    <FaKey className="me-1" />
    Reset
  </button>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              {/* EDIT USER */}
              {editUser && (
                <div className="card p-3 mt-3">
                  <h4>Edit User</h4>

                  <input className="form-control mb-2"
                    value={editUser.firstName}
                    onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                  />

                  <input className="form-control mb-2"
                    value={editUser.lastName}
                    onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
                  />
                  <input className="form-control mb-2"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  />

                  <input className="form-control mb-2"
                    value={editUser.phoneNumber}
                    onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                  />

                  <button className="btn btn-primary" onClick={updateUser}>
                    Update
                  </button>
                </div>
              )}
            </>
          )}

          {/* =====================================================
              ROUTES SECTION
          ===================================================== */}

          {activeTab === "routes" && (
            <>

            <button
  className="btn btn-primary mb-3"
  onClick={() => setShowRouteForm(!showRouteForm)}
>
  {showRouteForm ? (
    <>
      <FaTimes className="me-2" />
      Close Route Form
    </>
  ) : (
    <>
      <FaRoute className="me-2" />
      Add Route
    </>
  )}
</button>

        {showRouteForm && (
  <div className="card p-3 mb-4">

    <h4>Add Route</h4>

    <input
      className="form-control mb-2"
      placeholder="Destination Name"
      value={routeForm.destinationName}
      onChange={(e) =>
        setRouteForm({
          ...routeForm,
          destinationName: e.target.value,
        })
      }
    />

    <input
      className="form-control mb-2"
      placeholder="Region"
      value={routeForm.DestinationRegion}
      onChange={(e) =>
        setRouteForm({
          ...routeForm,
          DestinationRegion: e.target.value,
        })
      }
    />

    <input
      className="form-control mb-2"
      placeholder="Distance"
      value={routeForm.Distance}
      onChange={(e) =>
        setRouteForm({
          ...routeForm,
          Distance: e.target.value,
        })
      }
    />

    <button
      className="btn btn-success"
      onClick={addRoute}
    >
      Add Route
    </button>

  </div>
)}

            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover align-middle shadow-sm">

                <thead className="table-success">
                  <tr>
                    <th>Station</th><th>Region</th><th>Distance</th><th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {routes.map((r) => (
                    <tr key={r.destinationName}>
                      <td>{r.destinationName}</td>
                      <td>{r.DestinationRegion}</td>
                      <td>{r.Distance}</td>
                     <td>
  <button
    className="btn btn-primary btn-sm me-2"
    title="Edit Route"
    onClick={() => setEditRoute(r)}
  >
    <FaEdit className="me-1" />
    Edit
  </button>

  <button
    className="btn btn-danger btn-sm"
    title="Delete Route"
    onClick={() => {
      Swal.fire({
        title: "Delete Route?",
        text: `Are you sure you want to delete the route "${r.destinationName}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteRoute(r.destinationName);

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Route has been deleted successfully.",
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
              {editRoute && (
                <div className="card p-3 mt-4">
                    <h4>Edit Route</h4>

                    <input
                    className="form-control mb-2"
                    value={editRoute.destinationName}
                    disabled
                    />

                    <input
                    className="form-control mb-2"
                    value={editRoute.DestinationRegion}
                    onChange={(e) =>
                        setEditRoute({
                        ...editRoute,
                        DestinationRegion: e.target.value,
                        })
                    }
                    />

                    <input
                    className="form-control mb-2"
                    value={editRoute.Distance}
                    onChange={(e) =>
                        setEditRoute({
                        ...editRoute,
                        Distance: e.target.value,
                        })
                    }
                    />

                    <button
                    className="btn btn-primary"
                    onClick={updateRoute}
                    >
                    Update Route
                    </button>
                </div>
                )}
            </>
          )}

          {/* =====================================================
              PRICES SECTION
          ===================================================== */}

          {activeTab === "prices" && (
            <>

            <button
  className="btn btn-primary mb-3"
  onClick={() => setShowPriceForm(!showPriceForm)}
>
  {showPriceForm ? (
    <>
      <FaTimes className="me-2" />
      Close Price Form
    </>
  ) : (
    <>
      <FaMoneyBillWave className="me-2" />
      Add Price
    </>
  )}
</button>


              {showPriceForm && (
  <div className="card p-3 mb-4">

    <h4>Add Price</h4>

    <input
      type="number"
      className="form-control mb-2"
      placeholder="Total Price"
      value={priceForm.totalPrice}
      onChange={(e) =>
        setPriceForm({
          ...priceForm,
          totalPrice: Number(e.target.value),
        })
      }
    />

    <select
      className="form-control mb-2"
      value={priceForm.Destination}
      onChange={(e) =>
        setPriceForm({
          ...priceForm,
          Destination: e.target.value,
        })
      }
    >
      <option value="">Select Destination</option>

      {routes.map((route) => (
        <option
          key={route.destinationName}
          value={route.destinationName}
        >
          {route.destinationName} - {route.DestinationRegion}
        </option>
      ))}
    </select>

    <select
      className="form-control mb-2"
      value={priceForm.VehicleLevel}
      onChange={(e) =>
        setPriceForm({
          ...priceForm,
          VehicleLevel: e.target.value,
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
      <option value="Large3rdlevel">Large 2nd Level</option>
    </select>

    <button
      className="btn btn-success w-100"
      onClick={addPrice}
    >
      Add Price
    </button>

  </div>
)}

  <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover align-middle shadow-sm">

                <thead className="table-success">
    <tr>
      <th>#</th>
      <th>Destination</th>
      <th>Vehicle Level</th>
      <th>Total Price</th>
      <th>Service Charge</th>
      <th>Tariff</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {prices.map((p,index) => (
      <tr key={p.id}>
        <td>{index + 1}</td>
        <td>{p.Destination}</td>
        <td>{p.VehicleLevel}</td>
        <td>{p.totalPrice}</td>
        <td>{p.serviceCharge}</td>
        <td>{p.tariff}</td>

        <td>
  <button
    className="btn btn-primary btn-sm me-2"
    onClick={() => setEditPrice(p)}
    title="Edit Price"
  >
    <FaEdit className="me-1" />
    Edit
  </button>

  <button
    className="btn btn-danger btn-sm"
    title="Delete Price"
    onClick={() => {
      Swal.fire({
        title: "Delete Price?",
        text: `Are you sure you want to delete the price for ${p.destinationName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deletePrice(p.id);

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Price has been deleted successfully.",
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
                 {editPrice && (
                    <div className="card p-3 mt-4">
                        <h4>Edit Price</h4>

                        <input
                        type="number"
                        className="form-control mb-2"
                        value={editPrice.totalPrice}
                        onChange={(e) =>
                            setEditPrice({
                            ...editPrice,
                            totalPrice: e.target.value,
                            })
                        }
                        />

                        <select
                        className="form-control mb-2"
                        value={editPrice.Destination}
                        onChange={(e) =>
                            setEditPrice({
                            ...editPrice,
                            Destination: e.target.value,
                            })
                        }
                        >
                        {routeOptions.map((route) => (
                            <option
                            key={route.destinationName}
                            value={route.destinationName}
                            >
                            {route.destinationName}
                            </option>
                        ))}
                        </select>

                        <select
                        className="form-control mb-2"
                        value={editPrice.VehicleLevel}
                        onChange={(e) =>
                            setEditPrice({
                            ...editPrice,
                            VehicleLevel: e.target.value,
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

                        <button
                        className="btn btn-primary"
                        onClick={updatePrice}
                        >
                        Update Price
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