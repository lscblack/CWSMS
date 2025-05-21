import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// Create a new car
router.post('/', async (req, res) => {
    try {
        const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?, ?, ?, ?, ?)',
            [PlateNumber, CarType, CarSize, DriverName, PhoneNumber]
        );
        res.status(201).json({ message: 'Car created successfully', plateNumber: PlateNumber });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating car' });
    }
});

export default router;