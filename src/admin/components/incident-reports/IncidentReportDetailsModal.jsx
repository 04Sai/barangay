import React, { useState } from "react";
import { FaEdit, FaSave, FaMapMarkerAlt, FaImage, FaDownload } from "react-icons/fa";
import Modal from "../common/Modal";
import IncidentReportStatusBadge from "./IncidentReportStatusBadge";
import { formatDateTime } from "../../utils/dateUtils";

const IncidentReportDetailsModal = ({ incident, isOpen, onClose, onUpdateStatus }) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(incident?.status || 'Pending');
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    'Pending',
    'Investigating', 
    'In Progress',
    'Resolved',
    'Closed',
    'Cancelled'
  ];

  if (!incident) return null;

  const downloadImage = (attachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Google Maps links
  const getMapViewLink = (lat, lng) => {
    return `https://www.google.com/maps?q=${lat},${lng}&z=17`;
  };

  const getDirectionsLink = (lat, lng) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === incident.status) {
      setIsEditingStatus(false);
      return;
    }

    try {
      setUpdating(true);
      await onUpdateStatus(incident._id || incident.id, selectedStatus);
      setIsEditingStatus(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedStatus(incident.status);
    setIsEditingStatus(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Incident Report Details"
      size="large"
    >
      <div className="space-y-5">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Title</p>
            <p className="text-white font-medium">{incident.title}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Status</p>
            <div className="mt-1 flex items-center space-x-2">
              {isEditingStatus ? (
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-white/10 border border-white/30 rounded px-3 py-1 text-white text-sm"
                    disabled={updating}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status} className="bg-gray-800">{status}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={updating}
                    className="px-3 py-1 bg-green-500/30 hover:bg-green-500/50 text-white text-sm rounded border border-green-500/50 transition-colors disabled:opacity-50"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={updating}
                    className="px-3 py-1 bg-gray-500/30 hover:bg-gray-500/50 text-white text-sm rounded border border-gray-500/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <IncidentReportStatusBadge status={incident.status} showIcon={true} />
                  <button
                    onClick={() => setIsEditingStatus(true)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Edit status"
                  >
                    <FaEdit size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Severity</p>
            <p className="text-white">{incident.severity}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Priority</p>
            <p className="text-white">{incident.priority}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Emergency</p>
            <p className="text-white">
              {incident.isEmergency ? (
                <span className="text-red-400 font-medium">Yes</span>
              ) : (
                <span className="text-gray-300">No</span>
              )}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Incident Types</p>
            <p className="text-white">{incident.incidentTypes?.join(', ')}</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm mb-1">Description</p>
          <p className="text-white">{incident.description}</p>
        </div>

        {/* Location Information */}
        {incident.location && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm mb-2">Location</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300 text-xs">Address/Description</p>
                <p className="text-white">{incident.location.address || 'Not provided'}</p>
              </div>
              {(incident.location.latitude && incident.location.longitude) && (
                <div>
                  <p className="text-gray-300 text-xs">Coordinates</p>
                  <p className="text-white text-sm mb-2">
                    {incident.location.latitude.toFixed(6)}, {incident.location.longitude.toFixed(6)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={getMapViewLink(incident.location.latitude, incident.location.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-blue-500/30 hover:bg-blue-500/50 text-white text-xs rounded border border-blue-500/50 transition-colors"
                    >
                      <FaMapMarkerAlt className="mr-1" size={10} />
                      View on Map
                    </a>
                    <a
                      href={getDirectionsLink(incident.location.latitude, incident.location.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-green-500/30 hover:bg-green-500/50 text-white text-xs rounded border border-green-500/50 transition-colors"
                    >
                      <FaMapMarkerAlt className="mr-1" size={10} />
                      Get Directions
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reporter Information */}
        {incident.reporter && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm mb-2">Reporter Information</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-300 text-xs">Name</p>
                <p className="text-white">{incident.reporter.name || 'Anonymous'}</p>
              </div>
              <div>
                <p className="text-gray-300 text-xs">Contact</p>
                <p className="text-white">{incident.reporter.contactNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-300 text-xs">Email</p>
                <p className="text-white">{incident.reporter.email || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Attachments */}
        {incident.attachments && incident.attachments.length > 0 && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm mb-3">Attached Images</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incident.attachments.map((attachment, index) => (
                <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FaImage className="text-blue-400" />
                      <span className="text-white text-sm font-medium truncate">{attachment.originalName}</span>
                    </div>
                    <button
                      onClick={() => downloadImage(attachment)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title="Download image"
                    >
                      <FaDownload size={14} />
                    </button>
                  </div>
                  <img
                    src={attachment.data}
                    alt={attachment.originalName}
                    className="w-full h-32 object-cover rounded border border-white/20"
                  />
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Size: {(attachment.size / 1024).toFixed(2)} KB</p>
                    <p>Uploaded: {formatDateTime(attachment.uploadedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Updates/Timeline */}
        {incident.updates && incident.updates.length > 0 && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm mb-3">Status Updates</p>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {incident.updates.map((update, index) => (
                <div key={index} className="border-l-4 border-blue-500/50 pl-4 py-2 bg-white/5 rounded-r">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white text-sm">{update.message}</p>
                      {update.statusChange && (
                        <p className="text-gray-300 text-xs mt-1">
                          Status: {update.statusChange.from} → {update.statusChange.to}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">{formatDateTime(update.updateDate)}</p>
                      {update.updatedBy && (
                        <p className="text-gray-400 text-xs">by {update.updatedBy}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Occurred Date/Time</p>
            <p className="text-white">{formatDateTime(incident.dateTime?.occurred)}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Reported Date/Time</p>
            <p className="text-white">{formatDateTime(incident.dateTime?.reported)}</p>
          </div>
          {incident.dateTime?.lastModified && (
            <div className="bg-white/5 p-4 rounded-lg border border-white/20 md:col-span-2">
              <p className="text-gray-300 text-sm">Last Modified</p>
              <p className="text-white">{formatDateTime(incident.dateTime.lastModified)}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default IncidentReportDetailsModal;
