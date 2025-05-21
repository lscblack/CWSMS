import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const passwordCriteria = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Contains a number', test: (pwd) => /\d/.test(pwd) },
    { label: 'Contains special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordCriteria.every(criteria => criteria.test(formData.password))) {
      newErrors.password = 'Password does not meet all requirements';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:3000/register', {
        username: formData.username,
        password: formData.password
      });

      if (response.status === 201) {
        setSuccessMessage('User registered successfully!');
        setFormData({ username: '', password: '' });
        window.location.href = "/"
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          setErrors({ general: 'Username and password are required' });
        } else if (status === 409) {
          setErrors({ username: 'Username already exists' });
        } else {
          setErrors({ general: 'An unexpected error occurred' });
        }
      } else {
        setErrors({ general: 'Network error. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Create Account</h1>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-sm flex items-center gap-2">
            <CheckCircle size={16} /> {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm flex items-center gap-2">
            <XCircle size={16} /> {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`pl-9 w-full p-2 border rounded-md text-sm ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <XCircle size={12} /> {errors.username}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-9 w-full p-2 border rounded-md text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <XCircle size={12} /> {errors.password}
              </p>
            )}

            {formData.password && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-gray-700">Password Requirements:</p>
                <div className="space-y-1 bg-gray-50 p-2 rounded border border-gray-200">
                  {passwordCriteria.map((criteria, index) => {
                    const isValid = criteria.test(formData.password);
                    return (
                      <div key={index} className="flex items-center gap-2">
                        {isValid ? (
                          <CheckCircle size={12} className="text-green-600" />
                        ) : (
                          <XCircle size={12} className="text-gray-400" />
                        )}
                        <span className={`text-xs ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
                          {criteria.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-800 hover:bg-green-900 text-white p-2 rounded-md text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={16} /> Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <a href="/" className="text-green-800 hover:underline">
            Sign in here
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;