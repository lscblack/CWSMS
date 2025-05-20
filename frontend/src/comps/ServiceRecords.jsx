import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Check, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ServiceRecordsManager() {
    const [serviceRecords, setServiceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentRecord, setCurrentRecord] = useState({
        // RecordNumber:'',
        ServiceDate: '',
        PlateNumber: '',
        ServiceCode: ''
    });

    // Alert state
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // Fetch service records
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:3000/api/service-records');
                setServiceRecords(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch service records');
                console.error('Error fetching service records:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, []);

    // Filter records based on search query
    const filteredRecords = serviceRecords.filter(record =>
        record.PlateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.ServiceCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRecord({ ...currentRecord, [name]: value });
    };

    const openCreateModal = () => {
        setCurrentRecord({ ServiceDate: new Date().toISOString().split('T')[0], PlateNumber: '', ServiceCode: '' });
        setModalMode('create');
        setShowModal(true);
    };

    const openEditModal = (record) => {
        setCurrentRecord({
            id: record.RecordNumber,
            ServiceDate: record.ServiceDate.split('T')[0],
            PlateNumber: record.PlateNumber,
            ServiceCode: record.ServiceCode
        });
        setModalMode('edit');
        setShowModal(true);
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(currentRecord)
        try {
            if (modalMode === 'create') {
                await axios.post('http://127.0.0.1:3000/api/service-records', currentRecord);
                showAlert('Service record created successfully', 'success');
            } else {
                await axios.put(`http://127.0.0.1:3000/api/service-records/${currentRecord.id}`, currentRecord);
                showAlert('Service record updated successfully', 'success');
                // console.log()
            }

            // Refresh records
            const response = await axios.get('http://127.0.0.1:3000/api/service-records');
            setServiceRecords(response.data);
            setShowModal(false);
        } catch (err) {
            showAlert(`Failed to ${modalMode === 'create' ? 'create' : 'update'} service record`, 'error');
            console.error(`Error ${modalMode === 'create' ? 'creating' : 'updating'} service record:`, err);
        }
    };

    const handleDelete = async (id) => {
        console.log(id)
        if (window.confirm('Are you sure you want to delete this service record?')) {
            try {
                await axios.delete(`http://127.0.0.1:3000/api/service-records/${id}`);
                showAlert('Service record deleted successfully', 'success');

                // Remove from local state
                setServiceRecords(serviceRecords.filter(record => record.RecordNumber !== id));
            } catch (err) {
                showAlert('Failed to delete service record', 'error');
                console.error('Error deleting service record:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-slate-800 animate-spin" />
                <p className="mt-4 text-slate-600">Loading service records...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 mt-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-red-700 font-medium">Error</h3>
                <p className="text-red-600">{error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Service Records</h1>

            {/* Alert */}
            {alert.show && (
                <div className={`mb-4 p-4 rounded ${alert.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} flex items-center justify-between`}>
                    <span>{alert.message}</span>
                    <button onClick={() => setAlert({ ...alert, show: false })}>
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Search and Add */}
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800"
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>

                <button
                    className="flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                    onClick={openCreateModal}
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Record</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Record number</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Service Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Plate Number</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Service Code</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.length === 0 ? (
                            <tr>
                                <td className="px-4 py-8 text-center text-slate-500" colSpan="4">
                                    {searchQuery ? 'No matching records found' : 'No service records available'}
                                </td>
                            </tr>
                        ) : (
                            currentRecords.map((record, index) => (
                                <tr key={record.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                    <td className="px-4 py-3 text-sm text-slate-700">{record.RecordNumber}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">
                                        {new Date(record.ServiceDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{record.PlateNumber}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{record.ServiceCode}</td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() => openEditModal(record)}
                                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(record.RecordNumber)}
                                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredRecords.length > recordsPerPage && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-slate-600">
                        Showing {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded ${currentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'}`}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                            // Show current page and adjacent pages
                            let pageNum;
                            if (totalPages <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage === 1) {
                                pageNum = i + 1;
                            } else if (currentPage === totalPages) {
                                pageNum = totalPages - 2 + i;
                            } else {
                                pageNum = currentPage - 1 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 rounded flex items-center justify-center ${currentPage === pageNum
                                            ? 'bg-slate-800 text-white'
                                            : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded ${currentPage === totalPages ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'}`}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-slate-200">
                            <h3 className="text-lg font-medium text-slate-800">
                                {modalMode === 'create' ? 'Add New Service Record' : 'Edit Service Record'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="ServiceDate" className="block text-sm font-medium text-slate-700 mb-1">
                                        Service Date
                                    </label>
                                    <input
                                        type="date"
                                        id="ServiceDate"
                                        name="ServiceDate"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
                                        value={currentRecord.ServiceDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="PlateNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                        Plate Number
                                    </label>
                                    <input
                                        type="text"
                                        id="PlateNumber"
                                        name="PlateNumber"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
                                        value={currentRecord.PlateNumber}
                                        onChange={handleInputChange}
                                        placeholder="e.g. ABC123"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="ServiceCode" className="block text-sm font-medium text-slate-700 mb-1">
                                        Service Code
                                    </label>
                                    <input
                                        type="text"
                                        id="ServiceCode"
                                        name="ServiceCode"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800"
                                        value={currentRecord.ServiceCode}
                                        onChange={handleInputChange}
                                        placeholder="e.g. OIL01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 flex items-center gap-2"
                                >
                                    <Check className="h-4 w-4" />
                                    {modalMode === 'create' ? 'Create' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}