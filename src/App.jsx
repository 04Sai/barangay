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
import EmailVerification from "./client/components/EmailVerification";
import PageNotFound from "./client/PageNotFound";

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

// Non-auth route component to redirect authenticated users away from public pages
const NonAuthRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (isAuthenticated) {
    // Redirect authenticated users to their appropriate dashboard
    return isAdmin ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/account" replace />
    );
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

// Landing page with redirection for logged-in users
const LandingPage = () => {
  // Only show landing page components for non-authenticated users
  return (
    <>
      <Hero />
      <Hero2 />
      <Hero3 />
      <Hero4 />
    </>
  );
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
        {/* Public routes that should redirect authenticated users */}
        <Route
          path="/login"
          element={
            <NonAuthRoute>
              <Login />
            </NonAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <NonAuthRoute>
              <Register />
            </NonAuthRoute>
          }
        />
        <Route path="/verify-email" element={<EmailVerification />} />
        {/* Protected routes */}
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
          <Route path="residents" element={<AdminResidents />} />{" "}
          <Route path="settings" element={<AdminSettings />} />
        </Route>{" "}
        {/* Root route with authentication check */}
        <Route
          path="/"
          element={
            <NonAuthRoute>
              <LandingPage />
            </NonAuthRoute>
          }
        />
        {/* 404 Page - This should be the last route */}
        <Route path="*" element={<PageNotFound />} />
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
