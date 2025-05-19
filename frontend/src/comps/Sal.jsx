import { useState, useEffect } from 'react';
import axios from 'axios';
import { Printer, RefreshCw, Search, Download, ChevronUp, ChevronDown } from 'lucide-react';

// Primary color: Dark Orange
const PRIMARY_COLOR = '#92400E';

export default function SalaryReportSystem() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('employeeNumber');
  const [sortDirection, setSortDirection] = useState('asc');
  
  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/report/salary');
      if (response.data.success) {
        setReportData(response.data.data);
        setError(null);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = reportData.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.FirstNames?.toLowerCase().includes(searchLower) ||
      employee.LastName?.toLowerCase().includes(searchLower) ||
      employee.position?.toLowerCase().includes(searchLower) ||
      employee.departmentName?.toLowerCase().includes(searchLower) ||
      String(employee.employeeNumber).includes(searchTerm)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'employeeNumber' || sortField === 'glossSalary' || 
        sortField === 'totalDeducation' || sortField === 'netSalary') {
      comparison = a[sortField] - b[sortField];
    } else if (sortField === 'hiredDate') {
      comparison = new Date(a[sortField]) - new Date(b[sortField]);
    } else {
      comparison = (a[sortField] || '').localeCompare(b[sortField] || '');
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportToCsv = () => {
    if (sortedData.length === 0) return;
    
    const headers = Object.keys(sortedData[0]).join(',');
    const rows = sortedData.map(employee => 
      Object.values(employee).join(',')
    ).join('\n');
    
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'salary_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Print styles - will be hidden during printing */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-inside: avoid; }
          body { font-size: 12pt; }
          table { width: 100%; }
        }
      `}</style>
      
      {/* Header with Print Button */}
      <div className="bg-white shadow no-print sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>
              Salary Report
            </h1>
            <div className="flex gap-2">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded text-white"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
              <button 
                onClick={fetchReportData}
                className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
              <button 
                onClick={exportToCsv}
                className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar - No Print */}
        <div className="mb-6 no-print">
          <div className="flex items-center bg-white border rounded-lg px-3 max-w-md">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="px-2 py-3 w-full outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {/* Report Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-orange-500"></div>
              <p className="mt-2">Loading report data...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              {error}
              <button
                onClick={fetchReportData}
                className="block mx-auto mt-2 px-4 py-2 rounded text-white"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="text-left" style={{ backgroundColor: PRIMARY_COLOR }}>
                    <tr>
                      <th 
                        className="px-4 py-3 text-white font-semibold cursor-pointer"
                        onClick={() => handleSort('employeeNumber')}
                      >
                        <div className="flex items-center gap-1">
                          ID {renderSortIcon('employeeNumber')}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-white font-semibold cursor-pointer"
                        onClick={() => handleSort('FirstNames')}
                      >
                        <div className="flex items-center gap-1">
                          First Name {renderSortIcon('FirstNames')}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-white font-semibold cursor-pointer"
                        onClick={() => handleSort('LastName')}
                      >
                        <div className="flex items-center gap-1">
                          Last Name {renderSortIcon('LastName')}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-white font-semibold cursor-pointer"
                        onClick={() => handleSort('position')}
                      >
                        <div className="flex items-center gap-1">
                          Position {renderSortIcon('position')}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-white font-semibold cursor-pointer"
                        onClick={() => handleSort('departmentName')}
                      >
                        <div className="flex items-center gap-1">
                          Department {renderSortIcon('departmentName')}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-white font-semibold cursor-pointer"
                        onClick={() => handleSort('hiredDate')}
                      >
                        <div className="flex items-center gap-1">
                          Hire Date {renderSortIcon('hiredDate')}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-white font-semibold cursor-pointer text-right"
                        onClick={() => handleSort('glossSalary')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Gross Salary {renderSortIcon('glossSalary')}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-white font-semibold cursor-pointer text-right"
                        onClick={() => handleSort('totalDeducation')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Deductions {renderSortIcon('totalDeducation')}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-white font-semibold cursor-pointer text-right"
                        onClick={() => handleSort('netSalary')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Net Salary {renderSortIcon('netSalary')}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                          No employee records found
                        </td>
                      </tr>
                    ) : (
                      sortedData.map((employee, index) => (
                        <tr 
                          key={employee.employeeNumber}
                          className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-orange-50 print-break`}
                        >
                          <td className="px-4 py-3 border-t">{employee.employeeNumber}</td>
                          <td className="px-4 py-3 border-t">{employee.FirstNames}</td>
                          <td className="px-4 py-3 border-t">{employee.LastName}</td>
                          <td className="px-4 py-3 border-t">{employee.position}</td>
                          <td className="px-4 py-3 border-t">{employee.departmentName}</td>
                          <td className="px-4 py-3 border-t">{formatDate(employee.hiredDate)}</td>
                          <td className="px-4 py-3 border-t text-right">{formatCurrency(employee.glossSalary)}</td>
                          <td className="px-4 py-3 border-t text-right">{formatCurrency(employee.totalDeducation)}</td>
                          <td className="px-4 py-3 border-t text-right font-medium" style={{ color: PRIMARY_COLOR }}>
                            {formatCurrency(employee.netSalary)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {sortedData.length > 0 && (
                    <tfoot>
                      <tr className="bg-gray-100">
                        <td colSpan="6" className="px-4 py-3 font-semibold text-right">Total:</td>
                        <td className="px-4 py-3 font-semibold text-right">
                          {formatCurrency(sortedData.reduce((sum, emp) => sum + emp.glossSalary, 0))}
                        </td>
                        <td className="px-4 py-3 font-semibold text-right">
                          {formatCurrency(sortedData.reduce((sum, emp) => sum + emp.totalDeducation, 0))}
                        </td>
                        <td className="px-4 py-3 font-semibold text-right" style={{ color: PRIMARY_COLOR }}>
                          {formatCurrency(sortedData.reduce((sum, emp) => sum + emp.netSalary, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
              <div className="p-4 text-right text-gray-500 text-sm no-print">
                Showing {sortedData.length} of {reportData.length} employees
              </div>
            </>
          )}
        </div>
        
        {/* Report Footer - shown on both screen and print */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Generated on {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
          })}</p>
        </div>
      </div>
    </div>
  );
}