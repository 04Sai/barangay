import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus("error");
      setMessage("Invalid verification link.");
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}/${token}`);
      setVerificationStatus("success");
      setMessage(response.data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Email verified successfully! You can now log in." }
        });
      }, 3000);
    } catch (error) {
      setVerificationStatus("error");
      if (error.response?.data?.expired) {
        setMessage("Verification link has expired. Please request a new one.");
      } else {
        setMessage(error.response?.data?.message || "Email verification failed.");
      }
    }
  };

  const handleResendVerification = async () => {
    const email = prompt("Please enter your email address:");
    if (!email) return;

    setIsResending(true);
    try {
      await axios.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
      setMessage("New verification email sent! Please check your inbox.");
      setVerificationStatus("resent");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        );
      case "success":
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        );
      case "resent":
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case "verifying":
        return "Verifying Your Email";
      case "success":
        return "Email Verified Successfully!";
      case "error":
        return "Verification Failed";
      case "resent":
        return "Verification Email Sent";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-8 text-center">
          {getStatusIcon()}
          
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            {getStatusTitle()}
          </h2>
          
          <p className="mt-4 text-gray-300 text-center">
            {message}
          </p>

          <div className="mt-6 space-y-4">
            {verificationStatus === "success" && (
              <p className="text-sm text-blue-300">
                Redirecting to login page in 3 seconds...
              </p>
            )}

            {verificationStatus === "error" && (
              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </button>
                
                <button
                  onClick={handleBackToHome}
                  className="w-full flex justify-center py-2 px-4 border border-white/30 rounded-md shadow-sm text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Home
                </button>
              </div>
            )}

            {verificationStatus === "resent" && (
              <button
                onClick={handleBackToHome}
                className="w-full flex justify-center py-2 px-4 border border-white/30 rounded-md shadow-sm text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
