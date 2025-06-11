import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import Modal from "../common/Modal";
import {
  formatDateTime,
  getStatusColor,
  getSeverityColor,
} from "../../utils/incidentReportConstants";

const IncidentReportDetailsModal = ({ report, isOpen, onClose, onEdit }) => {
  if (!report) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Incident Report Details"
      size="large"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Title</p>
            <p className="text-white font-medium">{report.title}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Status</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getStatusColor(
                report.status
              )}`}
            >
              {report.status}
            </span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Severity</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getSeverityColor(
                report.severity
              )}`}
            >
              {report.severity}
            </span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Priority</p>
            <p className="text-white">{report.priority}</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm mb-1">Description</p>
          <p className="text-white">{report.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Location</p>
            <p className="text-white">{report.location?.address}</p>
            {report.location?.landmark && (
              <p className="text-gray-300 text-sm mt-1">
                Near: {report.location.landmark}
              </p>
            )}
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Incident Types</p>
            <p className="text-white">{report.incidentTypes?.join(", ")}</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm mb-2">Reporter Information</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-300 text-xs">Name</p>
              <p className="text-white">{report.reporter?.name}</p>
            </div>
            <div>
              <p className="text-gray-300 text-xs">Contact</p>
              <p className="text-white">{report.reporter?.contactNumber}</p>
            </div>
            <div>
              <p className="text-gray-300 text-xs">Relationship</p>
              <p className="text-white">{report.reporter?.relationship}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Occurred Date/Time</p>
            <p className="text-white">
              {formatDateTime(report.dateTime?.occurred)}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm">Reported Date/Time</p>
            <p className="text-white">
              {formatDateTime(report.dateTime?.reported)}
            </p>
          </div>
        </div>

        {report.assignedTo?.department && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm mb-2">Assigned To</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-300 text-xs">Department</p>
                <p className="text-white">{report.assignedTo.department}</p>
              </div>
              {report.assignedTo.officer && (
                <div>
                  <p className="text-gray-300 text-xs">Officer</p>
                  <p className="text-white">{report.assignedTo.officer}</p>
                </div>
              )}
              {report.assignedTo.contactInfo && (
                <div>
                  <p className="text-gray-300 text-xs">Contact</p>
                  <p className="text-white">{report.assignedTo.contactInfo}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {report.updates && report.updates.length > 0 && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/20">
            <p className="text-gray-300 text-sm mb-2">Recent Updates</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {report.updates.slice(-5).map((update, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-3">
                  <p className="text-white text-sm">{update.message}</p>
                  <p className="text-gray-300 text-xs">
                    {formatDateTime(update.updateDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onEdit}
            className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10"
          >
            Edit Report
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default IncidentReportDetailsModal;
