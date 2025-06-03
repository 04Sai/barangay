import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Hero from "./client/Hero";
import Hero2 from "./client/Hero2";
import Hero3 from "./client/Hero3";
import Hero4 from "./client/Hero4";
import NavBar from "./client/NavBar";
import Register from "./client/Register";
import Login from "./client/Login";
import Account from "./client/pages/AccountPage";

// Admin imports
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAnnouncements from "./admin/pages/AdminAnnouncements";
import AdminHotlines from "./admin/pages/AdminHotlines";
import AdminIncidentReports from "./admin/pages/AdminIncidentReports";
import AdminAppointments from "./admin/pages/AdminAppointments";
import AdminResidents from "./admin/pages/AdminResidents";
import AdminSettings from "./admin/pages/AdminSettings";

// Protected route component to check authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const location = useLocation();

  // If not authenticated, navigate to login
  if (!isAuthenticated) {
    // Use replace to prevent going back to protected routes after logout
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin route component to check admin authentication
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // For temporary access - remove this for production
  const allowTempAccess = true;

  // If not authenticated or not admin, navigate to login
  if (!allowTempAccess && (!isAuthenticated || !isAdmin)) {
    // Use replace to prevent going back to admin routes after logout
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout component to conditionally render the NavBar
const Layout = () => {
  const location = useLocation();
  const isAccountPage = location.pathname.startsWith("/account");
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="bg-black w-full overflow-hidden">
      {!isAccountPage && !isAdminPage && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/account/*"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="hotlines" element={<AdminHotlines />} />
          <Route path="incident-reports" element={<AdminIncidentReports />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="residents" element={<AdminResidents />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Temporary direct access to admin without authentication */}
        <Route path="/temp-admin" element={<AdminLayout />}>
          <Route
            path=""
            element={<Navigate to="/temp-admin/dashboard" replace />}
          />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="hotlines" element={<AdminHotlines />} />
          <Route path="incident-reports" element={<AdminIncidentReports />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="residents" element={<AdminResidents />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route
          path="/"
          element={
            <>
              <Hero />
              <Hero2 />
              <Hero3 />
              <Hero4 />
            </>
          }
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
