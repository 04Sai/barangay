import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import { useSpeech } from "../components/WebSpeech";

// Map routes to descriptive names for speech
const routeDescriptions = {
  "/account": "Dashboard",
  "/account/profile": "Account Settings",
  "/account/incident-report": "Incident Report",
  "/account/incident-report/step2": "Incident Report Step 2",
  "/account/incident-report/preview": "Incident Report Preview",
  "/account/medical-assistance": "Medical Assistance",
  "/account/police-station": "Police Station",
  "/account/fire-station": "Fire Station",
  "/account/animal-bite-center": "Animal Bite Center",
  "/account/towing-assistance": "Towing Assistance",
  "/account/announcements": "Announcements",
  "/account/health-services": "Health Services",
  "/account/peace-and-order": "Peace and Order",
  "/account/document-services": "Document Services",
  "/account/appointments": "Appointments",
};

const Account = () => {
  const location = useLocation();
  const { speak } = useSpeech();

  // Announce page changes
  useEffect(() => {
    const description = routeDescriptions[location.pathname];
    if (description) {
      speak(`Navigated to ${description}`);
    }
  }, [location.pathname, speak]);

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
