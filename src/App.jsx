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

// Protected route component to check authentication
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout component to conditionally render the NavBar
const Layout = () => {
  const location = useLocation();
  const isAccountPage = location.pathname.startsWith("/account");

  return (
    <div className="bg-black w-full overflow-hidden">
      {!isAccountPage && <NavBar />}
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
