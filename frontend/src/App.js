import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StationManagement from "./pages/StationManagement";
import ManagerManagement from "./pages/ManagerManagement";
import AdminRoute from "./auth/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/stations"
          element={
            <StationManagement />
          }
        />

        <Route
          path="/managers"
          element={
            <ManagerManagement />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;