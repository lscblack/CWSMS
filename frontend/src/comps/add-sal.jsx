import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  DollarSign, 
  Users, 
  Calculator,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/salary';

const SalaryManagementApp = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [formData, setFormData] = useState({
    glossSalary: '',
    totalDeducation: '',
    netSalary: '',
    employeNumber: ''
  });

  // API helper function to handle fetch requests
  const apiRequest = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Fetch all salaries
  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(API_BASE_URL);
      setSalaries(data.success ? data.data : []);
      setError('');
    } catch (err) {
      setError('Failed to fetch salary records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search salaries by employee number
  const searchByEmployee = async () => {
    if (!searchEmployee) {
      fetchSalaries();
      return;
    }
    
    setLoading(true);
    try {
      const data = await apiRequest(`${API_BASE_URL}/employee/${searchEmployee}`);
      setSalaries(data.success ? data.data : []);
      setError('');
    } catch (err) {
      setSalaries([]);
      setError('No salary records found for this employee');
    } finally {
      setLoading(false);
    }
  };

  // Create salary record
  const createSalary = async () => {
    try {
      const data = await apiRequest(API_BASE_URL, {
        method: 'POST',
        body: JSON.stringify({
          glossSalary: parseFloat(formData.glossSalary),
          totalDeducation: parseFloat(formData.totalDeducation),
          netSalary: parseFloat(formData.netSalary),
          employeNumber: parseInt(formData.employeNumber)
        })
      });
      
      if (data.success) {
        setSuccess('Salary record created successfully');
        resetForm();
        fetchSalaries();
      }
    } catch (err) {
      setError(err.message || 'Failed to create salary record');
    }
  };

  // Update salary record
  const updateSalary = async () => {
    try {
      const updateData = {};
      if (formData.glossSalary) updateData.glossSalary = parseFloat(formData.glossSalary);
      if (formData.totalDeducation) updateData.totalDeducation = parseFloat(formData.totalDeducation);
      if (formData.netSalary) updateData.netSalary = parseFloat(formData.netSalary);
      if (formData.employeNumber) updateData.employeNumber = parseInt(formData.employeNumber);

      const data = await apiRequest(`${API_BASE_URL}/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      if (data.success) {
        setSuccess('Salary record updated successfully');
        resetForm();
        fetchSalaries();
      }
    } catch (err) {
      setError(err.message || 'Failed to update salary record');
    }
  };

  // Delete salary record
  const deleteSalary = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salary record?')) return;
    
    try {
      const data = await apiRequest(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (data.success) {
        setSuccess('Salary record deleted successfully');
        fetchSalaries();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete salary record');
    }
  };

  // Form handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateSalary();
    } else {
      createSalary();
    }
  };

  const handleEdit = (salary) => {
    setFormData({
      glossSalary: salary.glossSalary.toString(),
      totalDeducation: salary.totalDeducation.toString(),
      netSalary: salary.netSalary.toString(),
      employeNumber: salary.employeNumber.toString()
    });
    setEditingId(salary.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      glossSalary: '',
      totalDeducation: '',
      netSalary: '',
      employeNumber: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Auto-calculate net salary
  const calculateNetSalary = () => {
    const gross = parseFloat(formData.glossSalary) || 0;
    const deduction = parseFloat(formData.totalDeducation) || 0;
    const net = gross - deduction;
    setFormData(prev => ({ ...prev, netSalary: net.toFixed(2) }));
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Initial load
  useEffect(() => {
    fetchSalaries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Salary Management System</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Salary</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Employee Number
              </label>
              <input
                type="number"
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
                placeholder="Enter employee number..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={searchByEmployee}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
            <button
              onClick={() => {
                setSearchEmployee('');
                fetchSalaries();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? 'Edit Salary Record' : 'Add Salary Record'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Number
                  </label>
                  <input
                    type="number"
                    value={formData.employeNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeNumber: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gross Salary
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.glossSalary}
                    onChange={(e) => setFormData(prev => ({ ...prev, glossSalary: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Deduction
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.totalDeducation}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalDeducation: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Net Salary
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.netSalary}
                      onChange={(e) => setFormData(prev => ({ ...prev, netSalary: e.target.value }))}
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={calculateNetSalary}
                      className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Calculator className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Salary Records Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Salary Records</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{salaries.length} records</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <p className="mt-2 text-gray-500">Loading salary records...</p>
            </div>
          ) : salaries.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No salary records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Deduction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salaries.map((salary) => (
                    <tr key={salary.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {salary.employeNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${salary.glossSalary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${salary.totalDeducation.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${salary.netSalary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(salary)}
                            className="text-orange-600 hover:text-orange-900 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteSalary(salary.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {salaries.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Gross Salary</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${salaries.reduce((sum, salary) => sum + salary.glossSalary, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Deductions</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${salaries.reduce((sum, salary) => sum + salary.totalDeducation, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Net Salary</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${salaries.reduce((sum, salary) => sum + salary.netSalary, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryManagementApp;