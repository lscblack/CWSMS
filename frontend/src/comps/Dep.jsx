import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Save, X, RefreshCw, AlertCircle } from "lucide-react";

// API base URL - change this to match your backend
const API_URL = "http://localhost:3000/dep";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form states
  const [newDepartment, setNewDepartment] = useState({
    departmentCode: "",
    departmentName: "",
    glossSalary: ""
  });
  
  // Edit form states (for existing departments)
  const [editForm, setEditForm] = useState({
    departmentName: "",
    glossSalary: ""
  });

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Function to fetch all departments
  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}`);
      if (response.data.success) {
        setDepartments(response.data.data);
      } else {
        setError("Failed to fetch departments");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching departments");
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new department
  const addDepartment = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Convert glossSalary to number for submission
      const departmentData = {
        ...newDepartment,
        departmentCode: parseInt(newDepartment.departmentCode),
        glossSalary: parseFloat(newDepartment.glossSalary)
      };
      
      const response = await axios.post(`${API_URL}`, departmentData);
      
      if (response.data.success) {
        // Reset form and refresh departments
        setNewDepartment({
          departmentCode: "",
          departmentName: "",
          glossSalary: ""
        });
        setIsAdding(false);
        showNotification("Department added successfully");
        fetchDepartments();
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Failed to add department");
      }
    }
  };

  // Function to update a department
  const updateDepartment = async (departmentCode) => {
    setError(null);
    
    try {
      // Only include non-empty fields in the update
      const updateData = {};
      if (editForm.departmentName) updateData.departmentName = editForm.departmentName;
      if (editForm.glossSalary) updateData.glossSalary = parseFloat(editForm.glossSalary);
      
      const response = await axios.put(`${API_URL}/${departmentCode}`, updateData);
      
      if (response.data.success) {
        setEditingId(null);
        showNotification("Department updated successfully");
        fetchDepartments();
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Failed to update department");
      }
    }
  };

  // Function to handle starting edit mode
  const startEditing = (department) => {
    setEditingId(department.departmentCode);
    setEditForm({
      departmentName: department.departmentName,
      glossSalary: department.glossSalary.toString()
    });
  };

  // Function to cancel editing or adding
  const cancelAction = () => {
    setEditingId(null);
    setIsAdding(false);
    setError(null);
  };

  // Show a temporary notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Department Management</h1>
      
      {/* Notification display */}
      {notification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-green-700">
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Controls */}
      <div className="flex justify-between mb-6">
        <button 
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center disabled:bg-orange-300"
        >
          <Plus size={18} className="mr-1" />
          Add Department
        </button>
        
        <button 
          onClick={fetchDepartments}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center"
        >
          <RefreshCw size={18} className="mr-1" />
          Refresh
        </button>
      </div>
      
      {/* Add Department Form */}
      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Add New Department</h2>
            <button onClick={cancelAction} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={addDepartment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                <input
                  type="number"
                  value={newDepartment.departmentCode}
                  onChange={(e) => setNewDepartment({...newDepartment, departmentCode: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={newDepartment.departmentName}
                  onChange={(e) => setNewDepartment({...newDepartment, departmentName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gloss Salary</label>
                <input
                  type="number"
                  step="0.01"
                  value={newDepartment.glossSalary}
                  onChange={(e) => setNewDepartment({...newDepartment, glossSalary: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={cancelAction}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
              >
                <Save size={18} className="mr-1" />
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Departments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gloss Salary</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading departments...
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No departments found. Add one to get started.
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr key={department.departmentCode}>
                  {/* Department Code */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {department.departmentCode}
                  </td>
                  
                  {/* Department Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === department.departmentCode ? (
                      <input
                        type="text"
                        defaultValue={department.departmentName}
                        onChange={(e) => setEditForm({...editForm, departmentName: e.target.value})}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      department.departmentName
                    )}
                  </td>
                  
                  {/* Gloss Salary */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingId === department.departmentCode ? (
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={department.glossSalary}
                        onChange={(e) => setEditForm({...editForm, glossSalary: e.target.value})}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      `$${department.glossSalary.toFixed(2)}`
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === department.departmentCode ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => updateDepartment(department.departmentCode)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={cancelAction}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(department)}
                        className="text-indigo-600 hover:text-indigo-900"
                        disabled={!!editingId}
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}