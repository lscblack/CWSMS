import { useState, useEffect } from 'react';

export default function DailyReport() {
  const [reportData, setReportData] = useState({
    date: '',
    count: 0,
    data: []
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState(null);

  // Function to fetch the report
  const fetchReport = async (date) => {
    try {
      setError(null);
      const response = await fetch(`http://127.0.0.1:3000/api/reports/daily?date=${date}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError('Error fetching report data');
      console.error('Error:', err);
    }
  };

  // Fetch report on initial load and when date changes
  useEffect(() => {
    fetchReport(selectedDate);
  }, [selectedDate]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('RWF', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Daily Car Wash Report</h1>
            <p className="text-gray-600">
              {reportData.count} services on {reportData.date}
            </p>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="date-select" className="mr-2 text-sm font-medium text-gray-700">
              Select Date:
            </label>
            <input
              type="date"
              id="date-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 p-4 mb-6 rounded-md border border-red-300">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {reportData.data.length > 0 ? (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plate Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.PlateNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.PackageName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.PackageDescription}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.AmountPaid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.PaymentDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-700">No car wash services found for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
}