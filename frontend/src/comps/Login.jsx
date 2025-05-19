import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, CheckCircle, XCircle, LogIn } from 'lucide-react';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear success message when user makes changes
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const makeApiCall = async (url, data) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
            const error = new Error(errorData.message || 'Request failed');
            error.status = response.status;
            error.response = { status: response.status, data: errorData };
            throw error;
        }

        return response.json();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await makeApiCall('http://localhost:3000/login', {
                username: formData.username,
                password: formData.password
            });

            setSuccessMessage(`Login successful! Welcome back, ${formData.username}!`);
            localStorage.setItem("uname", formData.username)
            window.location.href = "/dashboard"
            // You can redirect or update app state here
            console.log('Login successful:', response);
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                switch (status) {
                    case 400:
                        setErrors({ general: 'Username and password are required' });
                        break;
                    case 401:
                        setErrors({ general: 'Invalid credentials' });
                        break;
                    default:
                        setErrors({ general: 'An unexpected error occurred. Please try again.' });
                }
            } else {
                setErrors({ general: 'Network error. Please check your connection and try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account to continue</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-green-800 font-medium">{successMessage}</span>
                            </div>
                        </div>
                    )}

                    {/* General Error Message */}
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span className="text-red-800 font-medium">{errors.general}</span>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-3">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 grid place-items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${errors.username
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                            : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                                        }`}
                                    placeholder="Enter your username"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">
                                    <span className="flex items-center space-x-1">
                                        <XCircle className="w-4 h-4" />
                                        <span>{errors.username}</span>
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 grid place-items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                            : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 grid place-items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">
                                    <span className="flex items-center space-x-1">
                                        <XCircle className="w-4 h-4" />
                                        <span>{errors.password}</span>
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div>
                                <button
                                    type="button"
                                    className="text-sm text-orange-600 hover:text-orange-500 font-medium transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Signing in...</span>
                                </span>
                            ) : (
                                <span className="flex items-center justify-center space-x-2">
                                    <LogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="mt-8">

                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => window.location.href = "/register"}
                                type="button"
                                className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
                            >
                                Sign up now
                            </button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginForm;