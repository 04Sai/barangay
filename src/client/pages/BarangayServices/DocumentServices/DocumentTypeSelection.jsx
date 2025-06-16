import React from "react";

const DocumentTypeSelection = ({ formData, handleDocumentTypeChange, handleInputChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-lg font-medium text-white text-shadow mb-3">
        Requesting For:
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="barangayClearance"
            checked={formData.documentType.barangayClearance}
            onChange={() => handleDocumentTypeChange("barangayClearance")}
            className="h-5 w-5 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="barangayClearance" className="ml-3 text-white">
            Barangay Clearance
          </label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            id="barangayCertificate"
            checked={formData.documentType.barangayCertificate}
            onChange={() => handleDocumentTypeChange("barangayCertificate")}
            className="h-5 w-5 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="barangayCertificate" className="ml-3 text-white">
            Barangay Certificate
          </label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            id="certificateOfIndigency"
            checked={formData.documentType.certificateOfIndigency}
            onChange={() => handleDocumentTypeChange("certificateOfIndigency")}
            className="h-5 w-5 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="certificateOfIndigency" className="ml-3 text-white">
            Certificate of Indigency
          </label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            id="other"
            checked={formData.documentType.other}
            onChange={() => handleDocumentTypeChange("other")}
            className="h-5 w-5 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="other" className="ml-3 text-white">
            Other
          </label>
        </div>
      </div>

      {formData.documentType.other && (
        <div className="mt-3">
          <input
            type="text"
            name="otherText"
            value={formData.documentType.otherText}
            onChange={handleInputChange}
            placeholder="Please specify other document"
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white"
          />
        </div>
      )}
    </div>
  );
};

export default DocumentTypeSelection;
