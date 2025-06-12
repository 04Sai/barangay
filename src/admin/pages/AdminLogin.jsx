import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import FormInput from "../../client/components/FormInput";
import { BackButton } from "../../client/buttons";
import { API_ENDPOINTS } from "../../config/api";

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);

    useEffect(() => {
        // Check if admin is already logged in
        const token = localStorage.getItem("token");
        const adminData = localStorage.getItem("admin");

        if (token && adminData) {
            navigate("/admin/dashboard");
            return;
        }

        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }
    }, [location, navigate]);

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

        if (!formData.username.trim()) {
            newErrors.username = "Username or email is required";
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
            const response = await axios.post(API_ENDPOINTS.ADMIN.LOGIN, {
                username: formData.username,
                password: formData.password,
            });

            if (response.status === 200) {
                // Clear any existing client session data
                localStorage.removeItem("user");

                // Set admin session data
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("admin", JSON.stringify(response.data.admin));

                setLoginSuccess(true);
                setSuccessMessage("Admin login successful! Redirecting to dashboard...");

                setTimeout(() => {
                    navigate("/admin/dashboard");
                }, 1500);
            }
        } catch (error) {
            if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                setServerError(
                    "Cannot connect to server. Please check your internet connection or try again later."
                );
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

    const handleGoBack = () => {
        navigate("/");
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
            <div className="max-w-md w-full bg-gray-800/80 p-8 rounded-lg shadow-lg">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-yellow-400">
                        Admin Access
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to your admin account
                    </p>
                </div>

                {successMessage && (
                    <div
                        className={`${loginSuccess
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
                        id="username"
                        label="Username or Email"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                        placeholder="Enter your username or email"
                    />

                    <FormInput
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="Enter your password"
                    />

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-300"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>

                <div className="mt-6 flex flex-col space-y-4">
                    <p className="text-center text-sm text-gray-400">
                        Not an admin?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-400 hover:text-blue-300"
                        >
                            User Login
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

export default AdminLogin;