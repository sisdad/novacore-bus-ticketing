import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../frontend/src/pages/Login";
import AdminDashboard from "../frontend/src/pages/AdminDashboard";
import ManagerDashboard from "../frontend/src/pages/ManagerDashboard";
import GetterDashboard from "../frontend/src/pages/GetterDashboard";
import StationManagement from "../frontend/src/pages/StationManagement";
import ManagerManagement from "../frontend/src/pages/ManagerManagement";
import TicketerDashboard from "../frontend/src/pages/TicketerDashboard";
import FinanceDashboard from "../frontend/src/pages/FinanceDashboard";


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
            <AdminDashboard />
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
            <ManagerDashboard />
          }
        />
 
        <Route
          path="/getter"
          element={
            <GetterDashboard />
          }
        />
      
      <Route
        path="/tickets"
        element={
        <TicketerDashboard/>
        }
        />
        
      <Route
        path="/finance"
        element={
        <FinanceDashboard/>
        }
        />
        </Routes>

    </BrowserRouter>
  );
}

export default App;