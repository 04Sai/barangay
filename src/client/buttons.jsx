import React from "react";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaSignInAlt,
  FaUserPlus,
  FaPhone,
  FaArrowLeft,
  FaArrowRight,
  FaBan,
  FaSave,
} from "react-icons/fa";

const Button = ({
  label,
  onClick,
  type = "primary",
  disabled = false,
  className = "",
  icon = null,
  fullWidth = false,
  buttonType = "button", // Add buttonType prop with default "button"
}) => {
  // Base button styles
  const baseStyles =
    "font-karla font-medium py-2 px-6 rounded-full transition-all duration-300 flex items-center justify-center";

  // Different button type styles
  const buttonStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    outline:
      "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    link: "bg-transparent text-blue-600 hover:underline px-2 py-1",
    cancel: "bg-gray-500 hover:bg-gray-600 text-white",
  };

  // Combined styles
  const combinedStyles = `${baseStyles} ${buttonStyles[type]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  return (
    <button
      type={buttonType} // Use buttonType to set the HTML button type
      onClick={onClick}
      disabled={disabled}
      className={`${combinedStyles} ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

// Preset button components
export const CreateAccountButton = () => {
  // Using Link to directly navigate to register page
  return (
    <Link to="/register">
      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors duration-300 flex items-center">
        <FaUserPlus className="mr-2" />
        Create Account
      </button>
    </Link>
  );
};

export const LoginButton = (props) => (
  <Button label="Login" type="primary" icon={<FaSignInAlt />} {...props} />
);

export const RegisterButton = (props) => (
  <Button label="Register" type="primary" icon={<FaUserPlus />} {...props} />
);

export const CallButton = ({ phoneNumber, label, ...props }) => (
  <Button 
    label={phoneNumber || "Contact info not available"} 
    type="danger" 
    icon={<FaPhone />} 
    {...props} 
  />
);

export const BackButton = (props) => (
  <Button label="Go Back" type="danger" icon={<FaArrowLeft />} {...props} />
);

export const NextButton = (props) => (
  <Button label="Next" type="primary" icon={<FaArrowRight />} {...props} />
);

export const CancelButton = (props) => (
  <Button label="Cancel" type="cancel" icon={<FaBan />} {...props} />
);

export const SaveButton = (props) => (
  <Button label="Save" type="success" icon={<FaCheck />} {...props} />
);

// Export the generic Button as default
export default Button;
