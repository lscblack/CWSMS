import { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Plus, Search, Trash2, Edit, RefreshCw } from 'lucide-react';

export default function ServiceManagement() {
  // State for form inputs
  const [serviceCode, setServiceCode] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  
  // State for notifications
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await axios.post('http://127.0.0.1:3000/api/services', {
        ServiceCode: serviceCode,
        ServiceName: serviceName,
        ServicePrice: parseFloat(servicePrice),
      });
      
      // Show success notification
      setNotification({
        show: true,
        type: 'success',
        message: 'Service created successfully!'
      });
      
      // Reset form
      setServiceCode('');
      setServiceName('');
      setServicePrice('');
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 3000);
      
    } catch (error) {
      // Handle error
      setNotification({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Error creating service'
      });
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Service Management</h1>
      </div>
      
      {/* Notification */}
      {notification.show && (
        <div className={`p-4 mb-6 rounded-md flex items-center ${
          notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} className="mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          )}
          <p>{notification.message}</p>
        </div>
      )}
      
      {/* Add Service Form */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Add New Service</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="serviceCode" className="block text-sm font-medium text-slate-700 mb-1">
                Service Code
              </label>
              <input
                type="text"
                id="serviceCode"
                value={serviceCode}
                onChange={(e) => setServiceCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Enter service code"
                required
              />
            </div>
            
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-slate-700 mb-1">
                Service Name
              </label>
              <input
                type="text"
                id="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Enter service name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="servicePrice" className="block text-sm font-medium text-slate-700 mb-1">
                Service Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-slate-500">$</span>
                </div>
                <input
                  type="number"
                  id="servicePrice"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-md text-white ${
                isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700'
              } transition-colors`}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Add Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}