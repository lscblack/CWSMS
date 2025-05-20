import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Car, Wrench, CreditCard, Search, ChevronDown, ChevronUp, RefreshCw, FileText, Download } from 'lucide-react';

export default function ServiceSummaryReport() {
  const [serviceData, setServiceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('ServiceDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:3000/reports/service-summary');
      if (response.data.success) {
        setServiceData(response.data.data);
      } else {
        setError('Failed to load service data');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const filteredData = serviceData.filter(item => 
    item.RecordNumber?.toString().includes(searchTerm) ||
    item.PlateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ServiceName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField] === null) return 1;
    if (b[sortField] === null) return -1;
    
    let comparison = 0;
    if (typeof a[sortField] === 'string') {
      comparison = a[sortField].localeCompare(b[sortField]);
    } else if (sortField === 'ServiceDate' || sortField === 'PaymentDate') {
      comparison = new Date(a[sortField]) - new Date(b[sortField]);
    } else {
      comparison = a[sortField] - b[sortField];
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const pageCount = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaymentStatus = (paid, price) => {
    if (paid === null || paid === undefined) return 'Unpaid';
    if (paid >= price) return 'Paid';
    if (paid > 0 && paid < price) return 'Partial';
    return 'Unpaid';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin h-8 w-8 text-slate-800 mb-2" />
          <p className="text-slate-600">Loading service data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={fetchServiceData}
          className="mt-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 flex items-center justify-center mx-auto"
        >
          <RefreshCw size={16} className="mr-2" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center">
          <Wrench size={20} className="mr-2" /> Service Summary Report
        </h2>
      </div>

      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            placeholder="Search by plate number, model or service..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchServiceData}
            className="px-3 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 flex items-center"
          >
            <RefreshCw size={16} className="mr-1" /> Refresh
          </button>
          <button 
            className="px-3 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 flex items-center"
          >
            <Download size={16} className="mr-1" /> Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap table-auto">
          <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-600 tracking-wider">
            <tr>
              <th 
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort('RecordNumber')}
              >
                <div className="flex items-center">
                  <FileText size={16} className="mr-1" />
                  <span>Record#</span>
                  {getSortIcon('RecordNumber')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort('ServiceDate')}
              >
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>Service Date</span>
                  {getSortIcon('ServiceDate')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort('PlateNumber')}
              >
                <div className="flex items-center">
                  <Car size={16} className="mr-1" />
                  <span>Vehicle</span>
                  {getSortIcon('PlateNumber')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort('ServiceName')}
              >
                <div className="flex items-center">
                  <Wrench size={16} className="mr-1" />
                  <span>Service</span>
                  {getSortIcon('ServiceName')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort('ServicePrice')}
              >
                <div className="flex items-center">
                  <span>Price</span>
                  {getSortIcon('ServicePrice')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort('AmountPaid')}
              >
                <div className="flex items-center">
                  <CreditCard size={16} className="mr-1" />
                  <span>Payment</span>
                  {getSortIcon('AmountPaid')}
                </div>
              </th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((service, index) => (
                <tr 
                  key={`${service.RecordNumber}-${index}`}
                  className="hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    {service.RecordNumber || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(service.ServiceDate)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="font-medium text-slate-800">{service.PlateNumber || '-'}</div>
                      <div className="text-xs text-slate-500">{service.Model} {service.Type}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="font-medium text-slate-800">{service.ServiceName || '-'}</div>
                      <div className="text-xs text-slate-500">Code: {service.ServiceCode || '-'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatCurrency(service.ServicePrice)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="text-slate-600">{formatCurrency(service.AmountPaid)}</div>
                      <div className="text-xs text-slate-500">{formatDate(service.PaymentDate)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(getPaymentStatus(service.AmountPaid, service.ServicePrice))}`}>
                      {getPaymentStatus(service.AmountPaid, service.ServicePrice)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                  No service records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-slate-200">
          <div className="text-sm text-slate-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Previous
            </button>
            {[...Array(Math.min(5, pageCount))].map((_, i) => {
              let pageNum;
              if (pageCount <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pageCount - 2) {
                pageNum = pageCount - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
              className={`px-3 py-1 rounded ${
                currentPage === pageCount 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}