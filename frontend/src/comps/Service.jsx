import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceRecords = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    PlateNumber: '',
    PackageNumber: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchRecords = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/service-records');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch service records');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/api/service-records/${editingId}`, form);
        setMessage('Record updated successfully');
      } else {
        await axios.post('http://localhost:3000/api/service-records', form);
        setMessage('Record created successfully');
      }
      setForm({ PlateNumber: '', PackageNumber: '' });
      setEditingId(null);
      fetchRecords();
    } catch (err) {
      console.error(err);
      setError('Failed to save record');
    }
  };

  const handleEdit = (record) => {
    setForm({
      PlateNumber: record.PlateNumber,
      PackageNumber: record.PackageNumber,
    });
    setEditingId(record.RecordNumber);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/service-records/${id}`);
      setMessage('Record deleted');
      fetchRecords();
    } catch (err) {
      console.error(err);
      setError('Failed to delete record');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg border">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        {editingId ? 'Update Service Record' : 'Add New Service Record'}
      </h2>

      {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          name="PlateNumber"
          value={form.PlateNumber}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Plate Number"
          required
        />
        <input
          name="PackageNumber"
          value={form.PackageNumber}
          onChange={handleChange}
          className="p-2 border rounded"
          placeholder="Package Number"
          required
        />
        <button
          type="submit"
          className="col-span-full bg-green-800 text-white py-2 rounded hover:bg-green-700"
        >
          {editingId ? 'Update Record' : 'Add Record'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4 text-gray-700">All Service Records</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">Record #</th>
              <th className="py-2 px-4 border">Service Date</th>
              <th className="py-2 px-4 border">Plate</th>
              <th className="py-2 px-4 border">Driver</th>
              <th className="py-2 px-4 border">Car Type</th>
              <th className="py-2 px-4 border">Package</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.RecordNumber}>
                <td className="py-2 px-4 border">{record.RecordNumber}</td>
                <td className="py-2 px-4 border">{record.ServiceDate?.split('T')[0]}</td>
                <td className="py-2 px-4 border">{record.PlateNumber}</td>
                <td className="py-2 px-4 border">{record.DriverName}</td>
                <td className="py-2 px-4 border">{record.CarType}</td>
                <td className="py-2 px-4 border">{record.PackageName}</td>
                <td className="py-2 px-4 border">{record.PackagePrice}</td>
                <td className="py-2 px-4 border space-x-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record.RecordNumber)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceRecords;
