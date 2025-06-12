import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import FormInput from "./components/FormInput";
import { BackButton } from "./buttons";
import { API_ENDPOINTS } from "../config/api";

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setIsValidToken(false);
      setServerError("Invalid password reset link");
    } else {
      setIsValidToken(true);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword: formData.newPassword,
      });

      setSuccessMessage(response.data.message);
      
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successful! Please log in with your new password." }
        });
      }, 2000);

    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setServerError(
          "Cannot connect to server. Please check your internet connection or try again later."
        );
      } else {
        setServerError(
          error.response?.data?.message ||
            "Failed to reset password. Please try again or request a new reset link."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate("/login");
  };

  if (isValidToken === false) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-md w-full bg-gray-800/80 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Invalid Reset Link</h2>
          <p className="mb-6 text-gray-300">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/login"
            className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-md w-full bg-gray-800/80 p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold mb-6">
          Reset Your Password
        </h2>

        <p className="text-center text-gray-400 mb-6">
          Enter your new password below
        </p>

        {successMessage && (
          <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {serverError && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {serverError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput
            id="newPassword"
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="Enter your new password"
          />

          <FormInput
            id="confirmPassword"
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Confirm your new password"
          />

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col space-y-4">
          <p className="text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Back to Login
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

export default PasswordReset;
