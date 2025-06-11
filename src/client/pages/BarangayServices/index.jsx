import React from "react";
import { useNavigate } from "react-router-dom";

const BarangayServices = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceName) => {
    switch (serviceName) {
      case "Barangay Announcements":
        navigate("/account/announcements");
        break;
      case "Health Services":
        navigate("/barangay-services/health-services");
        break;
      case "Peace and Order":
        navigate("/barangay-services/peace-and-order");
        break;
      case "Document Services":
        navigate("/barangay-services/document-services");
        break;
      case "View Appointments":
        navigate("/barangay-services/appointments");
        break;
      default:
        console.log(`Service ${serviceName} not implemented yet`);
    }
  };

  return (
    <div>
      <h1>Barangay Services</h1>
      <button onClick={() => handleServiceClick("Barangay Announcements")}>
        Barangay Announcements
      </button>
      <button onClick={() => handleServiceClick("Health Services")}>
        Health Services
      </button>
      <button onClick={() => handleServiceClick("Peace and Order")}>
        Peace and Order
      </button>
      <button onClick={() => handleServiceClick("Document Services")}>
        Document Services
      </button>
      <button onClick={() => handleServiceClick("View Appointments")}>
        View Appointments
      </button>
    </div>
  );
};

export default BarangayServices;