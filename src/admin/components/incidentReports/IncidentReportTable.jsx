import React from "react";
import {
  FaFileAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaSpinner,
} from "react-icons/fa";
import {
  formatDateTime,
  getStatusColor,
  getSeverityColor,
  getPriorityColor,
} from "../../utils/incidentReportConstants";

const IncidentReportTable = ({
  reports,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusUpdate,
  statuses,
  loading,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-white">
        <thead>
          <tr className="bg-white/10 border-b border-white/20">
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={
                  selectedItems.length === reports.length && reports.length > 0
                }
                onChange={onSelectAll}
                className="rounded"
              />
            </th>
            <th className="px-4 py-3 text-left">Incident</th>
            <th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-left">Reporter</th>
            <th className="px-4 py-3 text-left">Date/Time</th>
            <th className="px-4 py-3 text-left">Priority</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-4 py-6 text-center text-gray-300">
                <div className="text-center py-12">
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <FaSpinner className="animate-spin text-gray-400 text-2xl mb-4" />
                      <p className="text-white text-lg ml-3">
                        Loading incident reports...
                      </p>
                    </div>
                  ) : (
                    <>
                      <FaFileAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                      <p className="text-white text-lg">
                        No incident reports found.
                      </p>
                      <p className="text-gray-300 mt-2">
                        Click "New Report" to create your first incident report.
                      </p>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr
                key={report._id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(report._id)}
                    onChange={() => onSelectItem(report._id)}
                    className="rounded"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {report.isEmergency ? (
                        <FaExclamationTriangle className="text-red-400" />
                      ) : (
                        <FaFileAlt className="text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-gray-300">
                        {report.incidentTypes?.join(", ")}
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs text-white mt-1 ${getSeverityColor(
                          report.severity
                        )}`}
                      >
                        {report.severity}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <FaMapMarkerAlt className="inline mr-1 text-gray-400" />
                    {report.location?.address}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <div className="flex items-center">
                      <FaUser className="mr-1 text-gray-400" />
                      {report.reporter?.name}
                    </div>
                    <div className="flex items-center mt-1">
                      <FaPhone className="mr-1 text-gray-400" />
                      {report.reporter?.contactNumber}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    {formatDateTime(report.dateTime?.occurred)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getPriorityColor(
                      report.priority
                    )}`}
                  >
                    {report.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={report.status}
                    onChange={(e) => onStatusUpdate(report._id, e.target.value)}
                    className={`text-xs rounded-full px-2 py-1 text-white border-0 ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onViewDetails(report)}
                      className="p-1.5 text-white hover:bg-white/10 rounded"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => onEdit(report)}
                      className="p-1.5 text-white hover:bg-white/10 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(report._id)}
                      className="p-1.5 text-red-400 hover:bg-white/10 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentReportTable;
