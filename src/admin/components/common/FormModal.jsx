import React from "react";
import { FaSpinner } from "react-icons/fa";
import Modal from "./Modal";

/**
 * A reusable form modal component with glassmorphism styling
 */
const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  submitText = "Save",
  cancelText = "Cancel",
  size = "medium",
  submitting = false,
  error = null,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={!submitting ? onClose : undefined}
      title={title}
      size={size}
      showCloseButton={!submitting}
    >
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/20 p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-5">{children}</div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-white/30 px-5 py-2.5 text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:opacity-70 transition-colors"
          >
            {submitting && <FaSpinner className="mr-2 animate-spin" />}
            {submitting ? "Saving..." : submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
