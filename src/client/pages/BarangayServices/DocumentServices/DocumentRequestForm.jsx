import React, { memo } from "react";
import DocumentTypeSelection from "./DocumentTypeSelection";
import PersonalInformation from "./PersonalInformation";

const DocumentRequestForm = memo(({ 
  formData, 
  handleDocumentTypeChange, 
  handleInputChange 
}) => {
  return (
    <div className="incident-form backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <h3 className="text-xl font-karla font-bold text-white mb-6 text-shadow">
        Document Request Form
      </h3>

      <DocumentTypeSelection
        formData={formData}
        handleDocumentTypeChange={handleDocumentTypeChange}
        handleInputChange={handleInputChange}
      />

      <PersonalInformation
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </div>
  );
});

DocumentRequestForm.displayName = 'DocumentRequestForm';

export default DocumentRequestForm;
