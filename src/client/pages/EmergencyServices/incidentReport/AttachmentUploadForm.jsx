import React from "react";
import { FaUpload, FaImage, FaTimes } from "react-icons/fa";
import { useIncidentReport } from "./IncidentReportContext";

const AttachmentUploadForm = () => {
  const {
    formData,
    setFormData,
    setError,
    loading,
    setLoading,
    imagePreview,
    setImagePreview,
  } = useIncidentReport();

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    try {
      setLoading(true);
      const base64 = await convertToBase64(file);

      const attachment = {
        filename: `incident_${Date.now()}_${file.name}`,
        originalName: file.name,
        data: base64,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      };

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, attachment],
      }));

      setImagePreview(base64);
      setError("");
    } catch (err) {
      console.error("Error converting image:", err);
      setError("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
    if (index === 0) setImagePreview(null);
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
        Attach Evidence (Optional)
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/30 border-dashed rounded-lg cursor-pointer bg-white/10 hover:bg-white/20 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaUpload className="w-8 h-8 mb-4 text-gray-300" />
              <p className="mb-2 text-sm text-gray-300">
                <span className="font-semibold">Click to upload</span> an image
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {formData.attachments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-white font-medium">Attached Images:</h4>
            {formData.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/10 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <FaImage className="text-blue-400" />
                  <div>
                    <p className="text-white text-sm">
                      {attachment.originalName}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {(attachment.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}

        {imagePreview && (
          <div className="mt-4">
            <h4 className="text-white font-medium mb-2">Image Preview:</h4>
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-48 object-contain rounded-lg border border-white/30"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentUploadForm;
