import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "./components/FormInput";
import FormCheckbox from "./components/FormCheckbox";
import { BackButton } from "./buttons";
import { API_ENDPOINTS } from "../config/api";
import { useSpeech } from "./components/WebSpeech";

const Register = () => {
  const { speak } = useSpeech();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Announce the page on load
    speak("Registration page. Create a new account here.");
  }, [speak]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle special validation for contact number (numbers only)
    if (name === "contactNumber") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else if (name === "firstName" || name === "lastName") {
      // Allow only letters and spaces for names
      const nameValue = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: nameValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First name should contain only letters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name should contain only letters";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number should contain only numbers";
    } else if (formData.contactNumber.length < 10) {
      newErrors.contactNumber = "Contact number must be at least 10 digits";
    } else if (formData.contactNumber.length > 11) {
      newErrors.contactNumber = "Contact number must not exceed 11 digits";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the terms and conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      speak("Please input the correct credentials in the form.");
      return;
    }

    setIsSubmitting(true);
    speak("Submitting registration. Please wait.");

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactNumber: formData.contactNumber,
          email: formData.email,
          password: formData.password,
          agreedToTerms: formData.agreedToTerms,
        }),
      });

      const data = await response.json();

      if (response.ok && data.emailSent) {
        // Redirect to login with success message instead of verification page
        navigate("/login", {
          state: {
            message:
              "Registration successful! Please check your email to verify your account before logging in.",
          },
        });
        speak(
          "Registration successful! Please check your email to verify your account."
        );
      } else if (response.ok && !data.emailSent) {
        setServerError(
          "Registration completed but verification email could not be sent. Please contact support."
        );
        speak(
          "Registration completed but verification email could not be sent. Please contact support."
        );
      } else {
        setServerError(data.message || "Registration failed");
        speak("Registration failed. Please try again.");
      }
    } catch (error) {
      setServerError("Network error. Please try again.");
      speak("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              pattern="[a-zA-Z\s]+"
              title="First name should contain only letters"
            />

            <FormInput
              id="lastName"
              label="Last Name *"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              pattern="[a-zA-Z\s]+"
              title="Last name should contain only letters"
            />
          </div>

          <FormInput
            id="contactNumber"
            label="Contact Number *"
            name="contactNumber"
            type="tel"
            value={formData.contactNumber}
            onChange={handleChange}
            error={errors.contactNumber}
            maxLength={11}
            pattern="[0-9]{10,11}"
            title="Contact number should be 10-11 digits"
            placeholder="09123456789"
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
