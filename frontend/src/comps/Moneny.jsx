import { useState } from 'react';

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    RecordNumber: '',
    AmountPaid: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'AmountPaid' ? parseFloat(value) || '' : value
    });
  };

  const handleSubmit = async () => {
    if (!formData.RecordNumber || !formData.AmountPaid) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://127.0.0.1:3000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit payment');
      }

      const result = await response.json();
      setSuccessMessage(`Payment created successfully! Payment Number: ${result.paymentNumber}`);
      setFormData({
        RecordNumber: '',
        AmountPaid: ''
      });
    } catch (err) {
      setError('Error submitting payment. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Payment</h1>
          <p className="mt-2 text-gray-600">Submit new payment details</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 p-4 rounded-md border border-red-300">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 p-4 rounded-md border border-green-300">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <label htmlFor="RecordNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Record Number
            </label>
            <input
              type="text"
              id="RecordNumber"
              name="RecordNumber"
              value={formData.RecordNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="AmountPaid" className="block text-sm font-medium text-gray-700 mb-1">
              Amount Paid
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">RWF</span>
              </div>
              <input
                type="number"
                id="AmountPaid"
                name="AmountPaid"
                value={formData.AmountPaid}
                onChange={handleChange}
                className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
                step="0.07"
                min="0"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Submit Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}