import { useState } from 'react';
import axios from 'axios';
import { Car, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function CarRegistrationForm() {
  const [formData, setFormData] = useState({
    PlateNumber: '',
    type: '',
    Model: '',
    ManufacturingYear: '',
    DriverPhone: '',
    MechanicName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, success: false, message: '' });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('http://127.0.0.1:3000/api/cars', formData);
      setNotification({ 
        show: true, 
        success: true, 
        message: 'Car registered successfully!' 
      });
      
      // Reset form after successful submission
      setFormData({
        PlateNumber: '',
        type: '',
        Model: '',
        ManufacturingYear: '',
        DriverPhone: '',
        MechanicName: ''
      });
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, success: false, message: '' });
      }, 5000);
      
    } catch (error) {
      setNotification({ 
        show: true, 
        success: false, 
        message: error.response?.data?.message || 'Failed to register car. Please try again.' 
      });
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, success: false, message: '' });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6 text-slate-800">
        <Car className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-semibold">Register New Vehicle</h1>
      </div>
      
      {notification.show && (
        <div className={`mb-6 p-4 rounded-md flex items-center ${notification.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {notification.success ? 
            <CheckCircle className="h-5 w-5 mr-2" /> : 
            <AlertCircle className="h-5 w-5 mr-2" />
          }
          <p>{notification.message}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="PlateNumber" className="block text-sm font-medium text-slate-700">
              Plate Number *
            </label>
            <input
              type="text"
              id="PlateNumber"
              name="PlateNumber"
              value={formData.PlateNumber}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-slate-700">
              Vehicle Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            >
              <option value="">Select Type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="Model" className="block text-sm font-medium text-slate-700">
              Model *
            </label>
            <input
              type="text"
              id="Model"
              name="Model"
              value={formData.Model}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="ManufacturingYear" className="block text-sm font-medium text-slate-700">
              Manufacturing Year *
            </label>
            <input
              type="number"
              id="ManufacturingYear"
              name="ManufacturingYear"
              value={formData.ManufacturingYear}
              onChange={handleChange}
              min="1900"
              max="2030"
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="DriverPhone" className="block text-sm font-medium text-slate-700">
              Driver Phone *
            </label>
            <input
              type="tel"
              id="DriverPhone"
              name="DriverPhone"
              value={formData.DriverPhone}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="MechanicName" className="block text-sm font-medium text-slate-700">
              Mechanic Name
            </label>
            <input
              type="text"
              id="MechanicName"
              name="MechanicName"
              value={formData.MechanicName}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 transition duration-150 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Registering...
              </>
            ) : (
              'Register Vehicle'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}