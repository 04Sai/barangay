import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CancelButton, NextButton } from "../buttons";
import IncidentReportImage from "../../assets/services/IncidentReport.svg";

const IncidentReport = () => {
  const [userData, setUserData] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    dateTime: "",
    incidentType: {
      firstAid: false,
      medicalEmergency: false,
      propertyDamage: false,
      equipmentFailure: false,
      theft: false,
      other: false,
    },
    otherIncidentType: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      incidentType: {
        ...prev.incidentType,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save form data to localStorage or state management solution
    localStorage.setItem("incidentReportData", JSON.stringify(formData));
    // Navigate to the next step
    navigate("/account/incident-report/step2");
  };

  const handleCancel = () => {
    // Navigate back to the dashboard
    navigate("/account");
  };

  useEffect(() => {
    // Get user data from localStorage
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }

    // Set current date
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));

    // Set default datetime to current time
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzOffset)
      .toISOString()
      .slice(0, 16);
    setFormData((prev) => ({
      ...prev,
      dateTime: localISOTime,
    }));
  }, []);

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        {/* Glassmorphism container */}
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
                BSERS | Incident Report
              </h2>
              <p className="text-white font-inter">
                Document community incidents and injuries
              </p>
            </div>
            <img
              src={IncidentReportImage}
              alt="Incident Report"
              className="w-16 h-16 md:w-24 md:h-24 object-contain"
            />
          </div>

          {/* Incident Report Form */}
          <div className="mt-8 backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
            <form onSubmit={handleSubmit} className="incident-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Column - Location, Description, Date/Time */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="location">Site/Location of Event</label>
                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      placeholder="Enter incident location"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description">Incident Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Describe what happened in detail"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="dateTime">Date and Time</label>
                    <input
                      id="dateTime"
                      type="datetime-local"
                      name="dateTime"
                      value={formData.dateTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Second Column - Incident Types Checkboxes */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow border-b border-white/30 pb-2">
                      Incident Types
                    </h3>

                    <div className="checkbox-group">
                      <div className="checkbox-item">
                        <input
                          id="firstAid"
                          name="firstAid"
                          type="checkbox"
                          checked={formData.incidentType.firstAid}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="firstAid">First Aid</label>
                      </div>

                      <div className="checkbox-item">
                        <input
                          id="medicalEmergency"
                          name="medicalEmergency"
                          type="checkbox"
                          checked={formData.incidentType.medicalEmergency}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="medicalEmergency">
                          Medical/Emergency Treatment
                        </label>
                      </div>

                      <div className="checkbox-item">
                        <input
                          id="propertyDamage"
                          name="propertyDamage"
                          type="checkbox"
                          checked={formData.incidentType.propertyDamage}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="propertyDamage">Property Damage</label>
                      </div>

                      <div className="checkbox-item">
                        <input
                          id="equipmentFailure"
                          name="equipmentFailure"
                          type="checkbox"
                          checked={formData.incidentType.equipmentFailure}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="equipmentFailure">
                          Equipment Failure
                        </label>
                      </div>

                      <div className="checkbox-item">
                        <input
                          id="theft"
                          name="theft"
                          type="checkbox"
                          checked={formData.incidentType.theft}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="theft">Theft</label>
                      </div>

                      <div className="checkbox-item">
                        <input
                          id="other"
                          name="other"
                          type="checkbox"
                          checked={formData.incidentType.other}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="other">Other</label>
                      </div>

                      {formData.incidentType.other && (
                        <div className="ml-8 mt-2">
                          <input
                            type="text"
                            name="otherIncidentType"
                            value={formData.otherIncidentType}
                            onChange={handleChange}
                            placeholder="Please specify"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="incident-notice">
                      <p>
                        Please ensure all information is accurate. Your report
                        will help us respond effectively to incidents in our
                        community.
                      </p>
                    </div>

                    <div className="flex space-x-4">
                      <CancelButton
                        onClick={handleCancel}
                        label="Cancel"
                        className="w-1/3"
                      />
                      <NextButton
                        onClick={handleSubmit}
                        label="Continue"
                        className="w-2/3"
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReport;
