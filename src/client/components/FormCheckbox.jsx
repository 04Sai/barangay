import React from "react";

const FormCheckbox = ({
  id,
  label,
  name,
  checked,
  onChange,
  error,
  ...rest
}) => {
  return (
    <div>
      <div className="flex items-start">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 ${
            error ? "border-red-500" : ""
          }`}
          {...rest}
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-300">
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default FormCheckbox;
