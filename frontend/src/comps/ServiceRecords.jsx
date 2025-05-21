import { useState, useEffect } from 'react';

export default function App() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch packages from the API
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://127.0.0.1:3000/api/packages');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPackages(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load packages. Please try again later.');
        setIsLoading(false);
        console.error('Error fetching packages:', err);
      }
    };

    fetchPackages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Car Wash Packages</h1>
          <p className="mt-2 text-gray-600">Choose the perfect package for your vehicle</p>
        </div>
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.PackageNumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.PackageNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.PackageName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{pkg.PackageDescription}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof pkg.PackagePrice === 'number' 
                      ? new Intl.NumberFormat('RW', { 
                          style: 'currency', 
                          currency: 'RWF', 
                          minimumFractionDigits: 2 
                        }).format(pkg.PackagePrice/100)
                      : pkg.PackagePrice
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}