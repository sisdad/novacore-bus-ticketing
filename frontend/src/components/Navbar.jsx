import React, { useEffect, useState } from "react";
import {
  BellFill,
  PersonCircle,
  MoonStarsFill,
  SunFill,
  BoxArrowRight,
  GearFill,
  PersonFill,
} from "react-bootstrap-icons";

import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
// Import your logo
import logo from "../assets/logo.png"; // <-- Replace with your logo
import { checkSession } from "./SessionManager";


export default function Navbar() {
  
   useEffect(() => {
    checkSession();
  }, []);
  const navigate = useNavigate();

  const username =
    localStorage.getItem("username") || "Administrator";

  const role =
    localStorage.getItem("role") || "Admin";

  const [dateTime, setDateTime] = useState(new Date());

  const [darkMode, setDarkMode] = useState(true);

  const [profile, setProfile] = useState({
  username: localStorage.getItem("username") || "",
  role: localStorage.getItem("role") || "",
});

const openProfile = () => {
  Swal.fire({
    title: "My Profile",
    html: `
      <input id="swal-username" class="swal2-input" placeholder="Username"
        value="${profile.username}" />

      <input id="swal-role" class="swal2-input" placeholder="Role"
        value="${profile.role}" disabled />

      <input id="swal-password" type="password" class="swal2-input"
        placeholder="New Password (optional)" />
    `,
    confirmButtonText: "Update",
    showCancelButton: true,
    preConfirm: () => {
      return {
        username: document.getElementById("swal-username").value,
        password: document.getElementById("swal-password").value,
      };
    },
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    try {
      const { username, password } = result.value;

      await fetch("http://localhost:5000/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      localStorage.setItem("username", username);

      setProfile((prev) => ({
        ...prev,
        username,
      }));

      Swal.fire("Success", "Profile updated successfully", "success");
    } catch (err) {
      Swal.fire("Error", "Update failed", "error");
    }
  });
};
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);
 
  const logout = () => {
  Swal.fire({
    title: "Logout?",
    icon: "warning",
    showCancelButton: true,
  }).then((res) => {
    if (res.isConfirmed) {
      localStorage.clear();
      navigate("/");
    }
  });
};
  return (
    <nav className="dashboard-navbar">

      {/* LEFT */}

      <div className="nav-left">

        <img
          src={logo}
          alt="Logo"
          className="system-logo"
        />

        <div>

          <h4 className="system-title">
            Bus Ticketing System
          </h4>

          <small className="system-subtitle">
            Transport Management
          </small>

        </div>

      </div>

      {/* CENTER */}

      <div className="nav-center">

        <h5 className="clock-time">
          {dateTime.toLocaleTimeString()}
        </h5>

        <small className="clock-date">
          {dateTime.toLocaleDateString()}
        </small>

      </div>

      {/* RIGHT */}

      <div className="nav-right">

        {/* Theme */}

        <button
          className="icon-btn"
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >
          {darkMode ? (
            <SunFill />
          ) : (
            <MoonStarsFill />
          )}
        </button>

        {/* Notification */}

        <button className="icon-btn">

          <BellFill />

          <span className="notification-dot"></span>

        </button>

        {/* User */}

        <Dropdown align="end">

          <Dropdown.Toggle
            variant="transparent"
            className="profile-toggle"
          >

            <PersonCircle size={38} />

          </Dropdown.Toggle>

          <Dropdown.Menu className="profile-menu">

            <div className="profile-header">

              <PersonCircle
                size={60}
                className="mb-2"
              />

              <h6>{username}</h6>

              <small>{role}</small>

            </div>

            <Dropdown.Divider />

            <Dropdown.Item>

              <PersonFill
                className="me-2"
              />

              My Profile

            </Dropdown.Item>

            <Dropdown.Item>

              <GearFill
                className="me-2"
              />

              Update Profile

            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item
              className="text-danger"
              onClick={logout}
            >

              <BoxArrowRight
                className="me-2"
              />

              Logout

            </Dropdown.Item>

          </Dropdown.Menu>

        </Dropdown>

      </div>

    </nav>
  );
}   