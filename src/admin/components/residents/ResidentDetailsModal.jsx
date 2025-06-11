import React from "react";
import Modal from "../common/Modal";

const ResidentDetailsModal = ({
  resident,
  isOpen,
  onClose,
  onEdit,
  calculateAge,
}) => {
  if (!resident) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resident Details"
      size="large"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm">Full Name</p>
          <p className="text-white">
            {resident.firstName} {resident.lastName}
          </p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm">Email</p>
          <p className="text-white">{resident.email || "Not provided"}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm">Phone Number</p>
          <p className="text-white">{resident.phoneNumber}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm">Address</p>
          <p className="text-white">{resident.address}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm">Gender</p>
          <p className="text-white">{resident.gender}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm">Birthdate</p>
          <p className="text-white">
            {resident.birthdate} ({calculateAge(resident.birthdate)} years old)
          </p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm">Civil Status</p>
          <p className="text-white">{resident.civilStatus || "Not provided"}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <p className="text-gray-300 text-sm">Occupation</p>
          <p className="text-white">{resident.occupation || "Not provided"}</p>
        </div>
        {resident.registeredDate && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/20 md:col-span-2">
            <p className="text-gray-300 text-sm">Registered Date</p>
            <p className="text-white">{resident.registeredDate}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={onEdit}
          className="px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10"
        >
          Edit Details
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ResidentDetailsModal;
