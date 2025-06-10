import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FormInput from "./components/FormInput";
import FormCheckbox from "./components/FormCheckbox";
import { BackButton } from "./buttons";
import { API_ENDPOINTS } from "../config/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Please provide a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to terms and conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;

      const response = await axios.post(
        API_ENDPOINTS.AUTH.REGISTER,
        dataToSend
      );

      if (response.status === 201) {
        navigate("/login", {
          state: { message: "Registration successful! Please log in." },
        });
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page in history
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-md w-full bg-gray-800/80 p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold mb-6">
          Create an Account
        </h2>

        {serverError && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {serverError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              id="firstName"
              label="First Name *"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />

            <FormInput
              id="lastName"
              label="Last Name *"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
          </div>

          <FormInput
            id="contactNumber"
            label="Contact Number *"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            error={errors.contactNumber}
          />

          <FormInput
            id="email"
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <FormInput
            id="password"
            label="Password *"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <FormInput
            id="confirmPassword"
            label="Confirm Password *"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <FormCheckbox
            id="agreedToTerms"
            name="agreedToTerms"
            checked={formData.agreedToTerms}
            onChange={handleChange}
            error={errors.agreedToTerms}
            label={
              <>
                I agree to the{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  Terms and Conditions
                </a>
              </>
            }
          />

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-col space-y-4">
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
          <div className="flex justify-center">
            <BackButton onClick={handleGoBack} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
