import React from "react";

const PersonalInformation = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="address">Complete Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter your complete address"
        />
      </div>

      <div className="space-y-3">
        <label htmlFor="contactNumber">Contact Number</label>
        <input
          type="text"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          placeholder="Enter your contact number"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <label htmlFor="appointmentDate">Preferred Date</label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white"
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="appointmentTime">Preferred Time</label>
          <input
            type="time"
            id="appointmentTime"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
