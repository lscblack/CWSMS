import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// INSERT - Add new car
router.post('/', async (req, res) => {
    try {
        const { PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Car (PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName) VALUES (?, ?, ?, ?, ?, ?)',
            [PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName]
        );
        res.status(201).json({ message: 'Car created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating car' });
    }
});

export default router;