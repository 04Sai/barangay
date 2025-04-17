import React from "react";

const Button = ({
  label,
  onClick,
  type = "primary",
  disabled = false,
  className = "",
  icon = null,
  fullWidth = false,
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
export const CreateAccountButton = (props) => (
  <Button
    className="mt-8 px-8 py-3"
    label="Create Account"
    type="primary"
    {...props}
  />
);

export const LoginButton = (props) => (
  <Button label="Login" type="primary" {...props} />
);

export const RegisterButton = (props) => (
  <Button label="Register" type="primary" {...props} />
);

export const CallButton = (props) => (
  <Button label="Call" type="success" {...props} />
);

export const BackButton = (props) => (
  <Button label="Back" type="secondary" {...props} />
);

export const NextButton = (props) => (
  <Button label="Next" type="primary" {...props} />
);

export const CancelButton = (props) => (
  <Button label="Cancel" type="cancel" {...props} />
);

export const SaveButton = (props) => (
  <Button label="Save" type="success" {...props} />
);

// Export the generic Button as default
export default Button;
