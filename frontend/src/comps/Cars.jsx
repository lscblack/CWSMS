import React, { useState } from 'react';
import axios from 'axios';

const AddCar = () => {
  const [form, setForm] = useState({
    PlateNumber: '',
    CarType: '',
    CarSize: '',
    DriverName: '',
    PhoneNumber: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/cars', form); // Adjust the URL as needed
      setMessage(res.data.message);
      setForm({
        PlateNumber: '',
        CarType: '',
        CarSize: '',
        DriverName: '',
        PhoneNumber: '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to create car. Please check the data and try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border">
      <h2 className="text-2xl font-semibold mb-4 text-green-800">Add New Car</h2>

      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="PlateNumber"
          value={form.PlateNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          placeholder="Plate Number"
          required
        />

        <input
          name="CarType"
          value={form.CarType}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          placeholder="Car Type"
          required
        />

        <input
          name="CarSize"
          value={form.CarSize}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          placeholder="Car Size"
          required
        />

        <input
          name="DriverName"
          value={form.DriverName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          placeholder="Driver Name"
          required
        />

        <input
          name="PhoneNumber"
          type="tel"
          value={form.PhoneNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          placeholder="Phone Number"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-800 text-white py-2 rounded hover:bg-green-700"
        >
          Save Car
        </button>
      </form>
    </div>
  );
};

export default AddCar;
