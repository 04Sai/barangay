import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FormInput from "./components/FormInput";
import FormCheckbox from "./components/FormCheckbox";
import { BackButton } from "./buttons";
import { API_ENDPOINTS } from "../config/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.history.pushState(null, "", window.location.pathname);
    }

    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    setLoginSuccess(false);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setLoginSuccess(true);
        setSuccessMessage("Login successful! Redirecting to your account...");

        setTimeout(() => {
          navigate("/account");
        }, 1500);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setServerError(
          "Cannot connect to server. Please check your internet connection or try again later."
        );
      } else if (error.response?.data?.emailNotVerified) {
        setServerError(
          error.response.data.message + " " +
          "Check your email for the verification link or request a new one."
        );
        // Show resend verification option
        setShowResendVerification(true);
        setUserEmail(error.response.data.email);
      } else {
        setServerError(
          error.response?.data?.message ||
            "Login failed. Please check your credentials and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) return;

    setIsResendingVerification(true);
    try {
      await axios.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { 
        email: userEmail 
      });
      setSuccessMessage("Verification email sent! Please check your inbox.");
      setShowResendVerification(false);
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Failed to resend verification email."
      );
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) {
      setServerError("Please enter your email address");
      return;
    }

    setIsSendingReset(true);
    setServerError("");
    
    try {
      await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { 
        email: forgotPasswordEmail 
      });
      setSuccessMessage("Password reset instructions have been sent to your email.");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (error) {
      setServerError(
        error.response?.data?.message || "Failed to send password reset email."
      );
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-md w-full bg-gray-800/80 p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold mb-6">
          Sign in to your account
        </h2>

        {successMessage && (
          <div
            className={`${
              loginSuccess
                ? "bg-green-900/50 border border-green-500 text-green-300"
                : "bg-green-900/50 border border-green-500 text-green-300"
            } px-4 py-3 rounded mb-4`}
          >
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
            id="email"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <FormInput
            id="password"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <div className="flex items-center justify-between">
            <FormCheckbox
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              label="Remember me"
            />

            <div className="text-sm">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="mt-6 p-4 border border-gray-600 rounded-lg bg-gray-700">
            <h3 className="text-lg font-medium mb-4">Reset Password</h3>
            <form onSubmit={handleForgotPassword}>
              <FormInput
                id="forgotPasswordEmail"
                label="Email"
                name="forgotPasswordEmail"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Enter your email address"
              />
              <div className="flex space-x-3 mt-4">
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isSendingReset ? "Sending..." : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                    setServerError("");
                  }}
                  className="flex-1 py-2 px-4 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showResendVerification && (
          <div className="mt-4">
            <button
              onClick={handleResendVerification}
              disabled={isResendingVerification}
              className="w-full flex justify-center py-2 px-4 border border-blue-500 rounded-md shadow-sm text-sm font-medium text-blue-400 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isResendingVerification ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-col space-y-4">
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Register
            </Link>
          </p>
            <div className="flex justify-center mt-4">
              <BackButton onClick={handleGoBack} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
