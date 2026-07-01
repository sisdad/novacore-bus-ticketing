import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import useFormValidation from "../hooks/useFormValidation";
import { validators } from "../utils/validation";
export default function StationManagement() {
  const [stations, setStations] =
    useState([]);

  const [stationName, setStationName] =
    useState("");

  const [Region, setRegion] =
    useState("");

  const token =
    localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    loadStations();
  }, []);

  
  const loadStations = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/stations",
      { headers }
    );

    setStations(res.data);
  };

  const addStation = async () => {
    await axios.post(
      "http://localhost:5000/api/admin/stations",
      {
        stationName,
        Region,
        creator: "admin",
      },
      { headers }
    );

    loadStations();
  };

  const deleteStation = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/admin/stations/${id}`,
      { headers }
    );

    loadStations();
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div className="container mt-4">
          <h2>Stations</h2>

          <input
            className="form-control mb-2"
            placeholder="Station Name"
            onChange={(e) =>
              setStationName(
                e.target.value
              )
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Region"
            onChange={(e) =>
              setRegion(e.target.value)
            }
          />

          <button
            className="btn btn-success mb-3"
            onClick={addStation}
          >
            Add Station
          </button>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Station</th>
                <th>Region</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {stations.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.stationName}</td>
                  <td>{s.Region}</td>

                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteStation(
                          s.id
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