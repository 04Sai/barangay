import React from "react";

const FormInput = ({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder = "",
  ...rest
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 block w-full rounded-md bg-gray-700 border ${
          error ? "border-red-500" : "border-gray-600"
        } px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default FormInput;
