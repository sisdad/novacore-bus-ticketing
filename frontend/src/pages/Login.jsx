
import React, { useEffect, useState } from "react";

import axios from "axios";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const expiresAt = localStorage.getItem("expiresAt");

    // No session
    if (!token || !expiresAt) return;

    // Session expired
    if (Date.now() > Number(expiresAt)) {
      localStorage.clear();
      return;
    }

  // Redirect based on role
  switch (role) {
    case "admin":
      window.location.replace("/admin");
      break;

    case "manager":
      window.location.replace("/managers");
      break;

    case "getter":
      window.location.replace("/getter");
      break;

    case "finance":
      window.location.replace("/finance");
      break;

    case "ticketer":
      window.location.replace("/tickets");
      break;
    default:
      localStorage.clear();
  }
}, []);

  const login = async (e) => {
    e.preventDefault();
    setError("");
   
    try {
      setLoading(true);

      const res = await axios.post(
                    "http://localhost:5000/api/auth/login",
                    { email, password }
                  );

      // Store user session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("station", res.data.user.station);

      // Session expires after 8 hours
      const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
      localStorage.setItem("expiresAt", expiresAt);


      const role = res.data.user.role;

      if (role === "admin") window.location.href = "/admin";
      else if (role === "manager") window.location.href = "/managers";
      else if (role === "getter") window.location.href = "/getter";
      else if (role === "finance") window.location.href = "/finance";
      else if (role === "ticketer") window.location.href = "/tickets";
      else if (role === "User") window.location.href = "/dashboard";
      else window.location.href = "/";

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-header">
          <h2>🚍 Bus Ticketing System</h2>
          <p>Sign in to access your dashboard</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={login}>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

      </div>

      {/* Inline modern luxury styling */}
      <style>{`
  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    /* DARK BLUE NOVACORE STYLE */
    background: radial-gradient(
      circle at top left,
      #0b1b3a,
      #071024 40%,
      #050816 100%
    );

    font-family: "Segoe UI", sans-serif;
  }

  .login-card {
    width: 400px;
    padding: 35px;
    border-radius: 18px;

    /* darker glass look */
    background: rgba(10, 20, 45, 0.6);
    backdrop-filter: blur(18px);

    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .login-header {
    text-align: center;
    margin-bottom: 25px;
  }

  .login-header h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: #dbeafe;
  }

  .login-header p {
    font-size: 13px;
    opacity: 0.75;
    color: #93c5fd;
  }

  .input-group {
    margin-bottom: 15px;
  }

  label {
    font-size: 13px;
    display: block;
    margin-bottom: 5px;
    opacity: 0.9;
    color: #bfdbfe;
  }

  input {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid rgba(59, 130, 246, 0.2);
    outline: none;

    background: rgba(3, 10, 25, 0.6);
    color: white;
  }

  input:focus {
    border: 1px solid #3b82f6;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
  }

  input::placeholder {
    color: rgba(147, 197, 253, 0.4);
  }

  button {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 10px;
    margin-top: 10px;

    background: linear-gradient(90deg, #1d4ed8, #2563eb);
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;

    box-shadow: 0 0 20px rgba(37, 99, 235, 0.25);
  }

  button:hover {
    transform: scale(1.03);
    box-shadow: 0 0 25px rgba(37, 99, 235, 0.4);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-box {
    background: rgba(220, 38, 38, 0.15);
    border: 1px solid rgba(220, 38, 38, 0.4);
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 15px;
    font-size: 13px;
    color: #fecaca;
  }
    .password-wrapper {
  position: relative;
}

.password-wrapper input {
  width: 100%;
  padding-right: 45px;
  box-sizing: border-box;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #93c5fd;
  padding: 0;
  width: auto;
  box-shadow: none;
}

.toggle-password:hover {
  background: transparent;
  transform: translateY(-50%);
  box-shadow: none;
}

`}</style>
    </div>
  );
}