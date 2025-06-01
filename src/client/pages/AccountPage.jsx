import React from "react";
import { Routes, Route } from "react-router-dom";
import AccountNav from "./AccountNav";
import Dashboard from "./Dashboard";
import AccountSettings from "./AccountSettings";
import IncidentReport from "./EmergencyServices/IncidentReport";
import IncidentReport2 from "./EmergencyServices/IncidentReport2";
import IncidentReportPreview from "./EmergencyServices/IncidentReportPreview";
import MedicalAssistance from "./EmergencyServices/MedicalAssistance";
import PoliceStation from "./EmergencyServices/PoliceStation";
import FireStation from "./EmergencyServices/FireStation";
import AnimalBiteCenter from "./EmergencyServices/AnimalBiteCenter";
import TowingAssistance from "./EmergencyServices/TowingAssistance";
import Announcement from "./BarangayServices/Announcement";
import HealthServices from "./BarangayServices/HealthServices";
import PO from "./BarangayServices/PO";
import DocumentServices from "./BarangayServices/DocumentServices";
import Appointment from "./BarangayServices/Appointment";

const Account = () => {
  return (
    <div className="account-bg">
      <AccountNav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<AccountSettings />} />
        <Route path="/incident-report" element={<IncidentReport />} />
        <Route path="/incident-report/step2" element={<IncidentReport2 />} />
        <Route
          path="/incident-report/preview"
          element={<IncidentReportPreview />}
        />
        <Route path="/medical-assistance" element={<MedicalAssistance />} />
        <Route path="/police-station" element={<PoliceStation />} />
        <Route path="/fire-station" element={<FireStation />} />
        <Route path="/animal-bite-center" element={<AnimalBiteCenter />} />
        <Route path="/towing-assistance" element={<TowingAssistance />} />
        <Route path="/announcements" element={<Announcement />} />
        <Route path="/health-services" element={<HealthServices />} />
        <Route path="/peace-and-order" element={<PO />} />
        <Route path="/document-services" element={<DocumentServices />} />
        <Route path="/appointments" element={<Appointment />} />
      </Routes>
    </div>
  );
};
export default Account;
