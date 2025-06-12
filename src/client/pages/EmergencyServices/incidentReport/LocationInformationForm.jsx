import React from "react";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import { useIncidentReport } from "./IncidentReportContext";

const LocationInformationForm = () => {
  const {
    formData,
    setFormData,
    handleInputChange,
    loading,
    setLoading,
    setError,
  } = useIncidentReport();

  // Get Google Maps direction link
  const getDirectionsLink = () => {
    if (
      formData.location.coordinates.latitude &&
      formData.location.coordinates.longitude
    ) {
      const { latitude, longitude } = formData.location.coordinates;
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    return null;
  };

  // Get Google Maps view link
  const getMapViewLink = () => {
    if (
      formData.location.coordinates.latitude &&
      formData.location.coordinates.longitude
    ) {
      const { latitude, longitude } = formData.location.coordinates;
      return `https://www.google.com/maps?q=${latitude},${longitude}&z=17`;
    }
    return null;
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: { latitude: lat, longitude: lng },
            },
          }));

          setError("");
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Failed to get current location.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location permissions and try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage =
                "An unknown error occurred while retrieving location.";
              break;
          }

          setError(errorMessage);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6">
      <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
        Location Information
      </h3>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-white mb-2">Address/Description</label>
          <input
            type="text"
            name="location.address"
            value={formData.location.address}
            onChange={handleInputChange}
            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-300"
            placeholder="Enter the incident location (e.g., Near City Hall, Barangay ABC)"
          />
          <p className="text-gray-300 text-sm mt-1">
            Provide a description of the location or use the button below to
            capture your current coordinates
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loading}
            className="flex items-center justify-center bg-blue-500/30 hover:bg-blue-500/50 text-white px-4 py-2 rounded-lg border border-blue-500/50 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaMapMarkerAlt className="mr-2" />
            )}
            Capture Current Location
          </button>

          {formData.location.coordinates.latitude && (
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={getMapViewLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-green-500/30 hover:bg-green-500/50 text-white px-4 py-2 rounded-lg border border-green-500/50 transition-colors"
              >
                <FaMapMarkerAlt className="mr-2" />
                View on Map
              </a>
              <a
                href={getDirectionsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-orange-500/30 hover:bg-orange-500/50 text-white px-4 py-2 rounded-lg border border-orange-500/50 transition-colors"
              >
                <FaMapMarkerAlt className="mr-2" />
                Get Directions
              </a>
            </div>
          )}
        </div>

        {formData.location.coordinates.latitude && (
          <div className="text-white text-sm p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="mr-2 text-green-400" />
              <span className="font-medium">
                Location Captured Successfully!
              </span>
            </div>
            <p>
              <strong>Coordinates:</strong>{" "}
              {formData.location.coordinates.latitude.toFixed(6)},{" "}
              {formData.location.coordinates.longitude.toFixed(6)}
            </p>
            <p className="text-xs mt-1 text-green-200">
              Emergency responders can use these coordinates to locate the
              incident precisely.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInformationForm;
