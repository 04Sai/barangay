import React from "react";
import { FaMapMarkerAlt, FaDirections, FaExternalLinkAlt } from "react-icons/fa";

const LocationDisplay = ({ 
  location, 
  showAddress = true, 
  showCoordinates = true, 
  showLinks = true,
  className = "" 
}) => {
  if (!location) return null;

  // Handle both coordinate structures
  const getCoordinates = () => {
    if (location.latitude && location.longitude) {
      return { latitude: location.latitude, longitude: location.longitude };
    }
    if (location.coordinates?.latitude && location.coordinates?.longitude) {
      return location.coordinates;
    }
    return null;
  };

  const coordinates = getCoordinates();

  const getMapViewLink = () => {
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      return `https://www.google.com/maps?q=${latitude},${longitude}&z=17`;
    }
    return null;
  };

  const getDirectionsLink = () => {
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    return null;
  };

  const hasCoordinates = coordinates !== null;

  return (
    <div className={`space-y-2 ${className}`}>
      {showAddress && location.address && (
        <div className="flex items-start space-x-2">
          <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" />
          <span className="text-white">{location.address}</span>
        </div>
      )}

      {showCoordinates && hasCoordinates && (
        <div className="text-white text-sm">
          <span className="font-medium">Coordinates:</span> {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
        </div>
      )}

      {showLinks && hasCoordinates && (
        <div className="flex flex-wrap gap-2 mt-3">
          <a
            href={getMapViewLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 bg-blue-500/30 hover:bg-blue-500/50 text-white text-sm rounded border border-blue-500/50 transition-colors"
          >
            <FaMapMarkerAlt className="mr-1" size={12} />
            View on Map
            <FaExternalLinkAlt className="ml-1" size={10} />
          </a>
          <a
            href={getDirectionsLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 bg-green-500/30 hover:bg-green-500/50 text-white text-sm rounded border border-green-500/50 transition-colors"
          >
            <FaDirections className="mr-1" size={12} />
            Get Directions
            <FaExternalLinkAlt className="ml-1" size={10} />
          </a>
        </div>
      )}
    </div>
  );
};

export default LocationDisplay;
