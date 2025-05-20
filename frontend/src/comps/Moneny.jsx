import React, { useState } from 'react';
import axios from 'axios';
import { CreditCard, Calendar, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    AmountPaid: '',
    PaymentDate: new Date().toISOString().split('T')[0],
    RecordNumber: ''
  });
  
  const [status, setStatus] = useState({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, isSuccess: false, isError: false, message: '' });
    
    try {
      const response = await axios.post('http://127.0.0.1:3000/api/payments', formData);
      setStatus({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        message: response.data.message || 'Payment submitted successfully!'
      });
      
      // Reset form after success
      setFormData({
        AmountPaid: '',
        PaymentDate: new Date().toISOString().split('T')[0],
        RecordNumber: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, isSuccess: false, message: '' }));
      }, 3000);
      
    } catch (error) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: error.response?.data?.message || 'Failed to submit payment. Please try again.'
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center">
        <CreditCard className="mr-2" size={24} />
        New Payment
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="AmountPaid" className="block text-sm font-medium text-slate-700">
            Amount Paid
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              id="AmountPaid"
              name="AmountPaid"
              value={formData.AmountPaid}
              onChange={handleChange}
              required
              className="pl-8 w-full py-2 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <label htmlFor="PaymentDate" className="block text-sm font-medium text-slate-700 flex items-center">
            <Calendar className="mr-1" size={16} />
            Payment Date
          </label>
          <input
            type="date"
            id="PaymentDate"
            name="PaymentDate"
            value={formData.PaymentDate}
            onChange={handleChange}
            required
            className="w-full py-2 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="RecordNumber" className="block text-sm font-medium text-slate-700 flex items-center">
            <FileText className="mr-1" size={16} />
            Record Number
          </label>
          <input
            type="text"
            id="RecordNumber"
            name="RecordNumber"
            value={formData.RecordNumber}
            onChange={handleChange}
            required
            className="w-full py-2 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            placeholder="Enter record number"
          />
        </div>
        
        <button
          type="submit"
          disabled={status.isSubmitting}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {status.isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Processing...
            </>
          ) : (
            'Submit Payment'
          )}
        </button>
      </form>
      
      {status.isSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
          <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-green-700 text-sm">{status.message}</p>
        </div>
      )}
      
      {status.isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-red-700 text-sm">{status.message}</p>
        </div>
      )}
    </div>
  );
}