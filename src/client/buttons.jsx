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
import { useSpeech } from "./components/WebSpeech";

// Button component now uses the speech context with delay
const Button = ({
  label,
  onClick,
  type = "primary",
  disabled = false,
  className = "",
  icon = null,
  fullWidth = false,
  buttonType = "button",
  speechText = "", // Optional custom text for speech
}) => {
  const { speak } = useSpeech();

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

  // Handle click with speech
  const handleClick = (e) => {
    // Speak the button label or custom speech text with shorter delay (100ms) for clicks
    const textToSpeak = speechText || `${label} button clicked`;
    speak(textToSpeak, 100); // Fast response for clicks

    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={buttonType}
      onClick={handleClick}
      disabled={disabled}
      className={`${combinedStyles} ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
      aria-label={label} // Add aria-label for accessibility
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

// Preset button components with speech support
export const CreateAccountButton = () => {
  const { speak } = useSpeech();

  // Using Link to directly navigate to register page with speech
  return (
    <Link to="/register" onClick={() => speak("Creating a new account", 100)}>
      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors duration-300 flex items-center">
        <FaUserPlus className="mr-2" />
        Create Account
      </button>
    </Link>
  );
};

export const LoginButton = (props) => (
  <Button
    label="Login"
    type="primary"
    icon={<FaSignInAlt />}
    speechText="Logging in"
    {...props}
  />
);

export const RegisterButton = (props) => (
  <Button
    label="Register"
    type="primary"
    icon={<FaUserPlus />}
    speechText="Registering a new account"
    {...props}
  />
);

export const CallButton = ({ phoneNumber, label, ...props }) => (
  <Button
    label={phoneNumber || "Contact info not available"}
    type="danger"
    icon={<FaPhone />}
    speechText={`Calling ${phoneNumber || "this number"}`}
    {...props}
  />
);

export const BackButton = (props) => (
  <Button
    label="Go Back"
    type="danger"
    icon={<FaArrowLeft />}
    speechText="Going back"
    {...props}
  />
);

export const NextButton = (props) => (
  <Button
    label="Next"
    type="primary"
    icon={<FaArrowRight />}
    speechText="Proceeding to next step"
    {...props}
  />
);

export const CancelButton = (props) => (
  <Button
    label="Cancel"
    type="cancel"
    icon={<FaBan />}
    speechText="Cancelling operation"
    {...props}
  />
);

export const SaveButton = (props) => (
  <Button
    label="Save"
    type="success"
    icon={<FaCheck />}
    speechText="Saving changes"
    {...props}
  />
);

// Export the generic Button as default
export default Button;
