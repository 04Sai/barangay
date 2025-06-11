import React from "react";
import { FaTimes } from "react-icons/fa";

/**
 * A reusable modal component with glassmorphism styling
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  // Define sizing classes
  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "max-w-6xl",
  };

  const modalSizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose && onClose()}
    >
      <div
        className={`${modalSizeClass} w-full min-h-[350px] animate-fadeIn`}
        style={{ minHeight: "min(80vh, 650px)" }}
      >
        <div className="relative rounded-xl border border-white/20 bg-gradient-to-br from-blue-900/80 to-slate-900/80 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-xl border-b border-white/10 bg-white/5 p-5">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white hover:bg-white/10 transition-all transform hover:scale-110"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
