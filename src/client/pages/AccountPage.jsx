import React from "react";
import { Routes, Route } from "react-router-dom";
import AccountNav from "./AccountNav";
import Dashboard from "./Dashboard";
import AccountSettings from "./AccountSettings";
import IncidentReport from "./IncidentReport";
import IncidentReport2 from "./IncidentReport2";
import IncidentReportPreview from "./IncidentReportPreview";
import MedicalAssistance from "./MedicalAssistance";
import PoliceStation from "./PoliceStation";
import FireStation from "./FireStation";
import AnimalBiteCenter from "./AnimalBiteCenter";
import TowingAssistance from "./TowingAssistance";

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
      </Routes>
    </div>
  );
};
export default Account;
