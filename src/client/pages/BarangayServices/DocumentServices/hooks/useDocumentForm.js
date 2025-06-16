import { useState, useCallback } from "react";

const useDocumentForm = (initialFormData) => {
  const [formData, setFormData] = useState(initialFormData);

  const handleDocumentTypeChange = useCallback((type) => {
    setFormData((prev) => ({
      ...prev,
      documentType: {
        ...prev.documentType,
        [type]: !prev.documentType[type],
      },
    }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "otherText") {
      setFormData((prev) => ({
        ...prev,
        documentType: {
          ...prev.documentType,
          otherText: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  const getSelectedDocuments = useCallback(() => {
    const selected = [];
    if (formData.documentType.barangayClearance)
      selected.push("Barangay Clearance");
    if (formData.documentType.barangayCertificate)
      selected.push("Barangay Certificate");
    if (formData.documentType.certificateOfIndigency)
      selected.push("Certificate of Indigency");
    if (formData.documentType.other && formData.documentType.otherText) {
      selected.push(`Other: ${formData.documentType.otherText}`);
    }
    return selected.join(", ");
  }, [formData.documentType]);

  const isFormValid = useCallback(() => {
    const hasDocumentType =
      formData.documentType.barangayClearance ||
      formData.documentType.barangayCertificate ||
      formData.documentType.certificateOfIndigency ||
      (formData.documentType.other && formData.documentType.otherText !== "");

    return (
      hasDocumentType &&
      formData.name.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.contactNumber.trim() !== "" &&
      formData.appointmentDate !== "" &&
      formData.appointmentTime !== ""
    );
  }, [formData]);

  const updateFormData = useCallback((newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  return {
    formData,
    setFormData,
    handleDocumentTypeChange,
    handleInputChange,
    getSelectedDocuments,
    isFormValid,
    updateFormData,
  };
};

export default useDocumentForm;
