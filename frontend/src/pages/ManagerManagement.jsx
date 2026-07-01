import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import useFormValidation from "../hooks/useFormValidation";
import { validators } from "../utils/validation";
export default function ManagerManagement() {
  const [managers, setManagers] =
    useState([]);

  const [form, setForm] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
    });

  const token =
    localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/managers",
      { headers }
    );

    setManagers(res.data);
  };

  const createManager =
    async () => {
      await axios.post(
        "http://localhost:5000/api/admin/managers",
        form,
        { headers }
      );

      loadManagers();
    };

  const deleteManager =
    async (id) => {
      await axios.delete(
        `http://localhost:5000/api/admin/managers/${id}`,
        { headers }
      );

      loadManagers();
    };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div className="container mt-4">
          <h2>Managers</h2>

          <input
            className="form-control mb-2"
            placeholder="First Name"
            onChange={(e) =>
              setForm({
                ...form,
                firstName:
                  e.target.value,
              })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Last Name"
            onChange={(e) =>
              setForm({
                ...form,
                lastName:
                  e.target.value,
              })
            }
          />
        <br/>
          <input
            className="form-control mb-2"
            placeholder="Email"
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Password"
            type="password"
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value,
              })
            }
          />
        <br/>
          <input
            className="form-control mb-2"
            placeholder="Phone"
            onChange={(e) =>
              setForm({
                ...form,
                phoneNumber:
                  e.target.value,
              })
            }
          />

          <button
            className="btn btn-primary mb-3"
            onClick={createManager}
          >
            Create Manager
          </button>

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>password</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {managers.map((m) => (
                <tr key={m.id}>
                  <td>
                    {m.firstName}{" "}
                    {m.lastName}
                  </td>

                  <td>{m.email}</td>

                  <td>
                    {m.phoneNumber}
                  </td>

                  <td>
                    {m.password}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteManager(
                          m.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}