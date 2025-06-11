import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Announcements from "../pages/Account/Announcements";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ...existing routes... */}

      {/* Account Routes */}
      <Route path="/account" element={<ProtectedRoute />}>
        <Route path="announcements" element={<Announcements />} />
        {/* ...other account routes... */}
      </Route>

      {/* ...existing routes... */}
    </Routes>
  );
};

export default AppRoutes;