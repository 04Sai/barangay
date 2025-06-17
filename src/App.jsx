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
import PasswordReset from "./client/PasswordReset";
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
import AdminLogin from "./admin/pages/AdminLogin";
import { SpeechProvider } from "./client/components/WebSpeech";

// Non-auth route component to redirect authenticated users away from public pages
const NonAuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const adminData = localStorage.getItem("admin");
  const userData = localStorage.getItem("user");

  if (token) {
    // If admin session exists, redirect to admin dashboard
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        if (admin.role && admin.username) {
          return <Navigate to="/admin/dashboard" replace />;
        }
      } catch (error) {
        // Invalid admin data, clear it
        localStorage.removeItem("admin");
      }
    }

    // If user session exists, redirect to user dashboard
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.firstName && user.email) {
          return <Navigate to="/account" replace />;
        }
      } catch (error) {
        // Invalid user data, clear it
        localStorage.removeItem("user");
      }
    }
  }

  return children;
};

// Admin route component to check admin authentication
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const adminData = localStorage.getItem("admin");

  // Check if user has valid admin session
  if (!token || !adminData) {
    return <Navigate to="/admin/login" replace />;
  }

  // Parse admin data to verify it's actually admin data
  try {
    const admin = JSON.parse(adminData);
    if (!admin.role || !admin.username) {
      // Invalid admin data structure
      localStorage.removeItem("admin");
      localStorage.removeItem("token");
      return <Navigate to="/admin/login" replace />;
    }
  } catch (error) {
    // Invalid JSON in admin data
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Protected route component to check CLIENT authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const adminData = localStorage.getItem("admin");

  // If admin session exists, redirect to admin
  if (adminData && token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Check if user has valid client session
  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  // Parse user data to verify it's actually user data
  try {
    const user = JSON.parse(userData);
    if (!user.firstName || !user.email) {
      // Invalid user data structure
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Invalid JSON in user data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
      {/* Only show NavBar on public pages and client pages, never on admin pages */}
      {!isAdminPage && <NavBar />}
      <Routes>
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
        <Route path="/reset-password/:token" element={<PasswordReset />} />
        <Route
          path="/admin/login"
          element={
            <NonAuthRoute>
              <AdminLogin />
            </NonAuthRoute>
          }
        />
        <Route
          path="/account/*"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
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
    <SpeechProvider>
      <Router>
        <Layout />
      </Router>
    </SpeechProvider>
  );
};

export default App;
