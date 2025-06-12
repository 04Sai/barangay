import React from "react";
import { useIncidentReport } from "./IncidentReportContext";

const ReporterInformationForm = () => {
  const { formData, handleInputChange } = useIncidentReport();

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
        Your Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white mb-2">Full Name</label>
          <input
            type="text"
            name="reporter.name"
            value={formData.reporter.name}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Contact Number</label>
          <input
            type="tel"
            name="reporter.contactNumber"
            value={formData.reporter.contactNumber}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
            placeholder="Your contact number"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-white mb-2">Email Address</label>
          <input
            type="email"
            name="reporter.email"
            value={formData.reporter.email}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white"
            placeholder="Your email address"
          />
        </div>
      </div>
    </div>
  );
};

export default ReporterInformationForm;
