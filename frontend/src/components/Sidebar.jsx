import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  House,
  Building,
  People,
  GeoAlt,
  Truck,
  CurrencyDollar,
  PersonBadge,
  GraphUp,
  Gear,
  BoxArrowRight,
} from "react-bootstrap-icons";
import "../styles/dashboard.css";

export default function Sidebar() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `d-flex align-items-center gap-3 ${
      isActive(path) ? "bg-primary text-white" : ""
    }`;

  return (
    <div className="sidebar">

      <div className="sidebar-logo">
        🚌 Bus Ticketing
      </div>

      <ul>

        {/* ================= ADMIN ================= */}

        {role === "admin" && (
          <>
            <li>
              <Link to="/admin" className={linkClass("/admin")}>
                <House size={20} />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/stations" className={linkClass("/stations")}>
                <Building size={20} />
                <span>Stations</span>
              </Link>
            </li>

            <li>
              <Link to="/managers" className={linkClass("/managers")}>
                <People size={20} />
                <span>Managers</span>
              </Link>
            </li>

            <li>
              <Link to="/routes" className={linkClass("/routes")}>
                <GeoAlt size={20} />
                <span>Routes</span>
              </Link>
            </li>

            <li>
              <Link to="/vehicles" className={linkClass("/vehicles")}>
                <Truck size={20} />
                <span>Vehicles</span>
              </Link>
            </li>

            <li>
              <Link to="/prices" className={linkClass("/prices")}>
                <CurrencyDollar size={20} />
                <span>Prices</span>
              </Link>
            </li>

            <li>
              <Link to="/reports" className={linkClass("/reports")}>
                <GraphUp size={20} />
                <span>Reports</span>
              </Link>
            </li>

            <li>
              <Link to="/settings" className={linkClass("/settings")}>
                <Gear size={20} />
                <span>Settings</span>
              </Link>
            </li>
          </>
        )}

        {/* ================= MANAGER ================= */}

        {role === "manager" && (
          <>
            <li>
              <Link to="/manager" className={linkClass("/manager")}>
                <House size={20} />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/staff" className={linkClass("/staff")}>
                <PersonBadge size={20} />
                <span>Staff</span>
              </Link>
            </li>

            <li>
              <Link to="/routes" className={linkClass("/routes")}>
                <GeoAlt size={20} />
                <span>Routes</span>
              </Link>
            </li>

            <li>
              <Link to="/vehicles" className={linkClass("/vehicles")}>
                <Truck size={20} />
                <span>Vehicles</span>
              </Link>
            </li>
          </>
        )}

        {/* ================= GETTER ================= */}

        {role === "getter" && (
          <li>
            <Link to="/getter" className={linkClass("/getter")}>
              <PersonBadge size={20} />
              <span>Getter</span>
            </Link>
          </li>
        )}

        {/* ================= FINANCE ================= */}

        {role === "finance" && (
          <li>
            <Link to="/finance" className={linkClass("/finance")}>
              <CurrencyDollar size={20} />
              <span>Finance</span>
            </Link>
          </li>
        )}

        {/* ================= TICKETER ================= */}

        {role === "ticketer" && (
          <li>
            <Link to="/tickets" className={linkClass("/tickets")}>
              <Building size={20} />
              <span>Ticketing</span>
            </Link>
          </li>
        )}

        {/* ================= LOGOUT ================= */}

        <li className="mt-4">
          <Link
            to="/login"
            onClick={() => {
              localStorage.clear();
            }}
            className="d-flex align-items-center gap-3 text-danger"
          >
            <BoxArrowRight size={20} />
            <span>Logout</span>
          </Link>
        </li>

      </ul>
    </div>
  );
}