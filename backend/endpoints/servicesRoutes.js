import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// INSERT - Add new service
router.post('/', async (req, res) => {
    try {
        const { ServiceCode, ServiceName, ServicePrice } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Services (ServiceCode, ServiceName, ServicePrice) VALUES (?, ?, ?)',
            [ServiceCode, ServiceName, ServicePrice]
        );
        res.status(201).json({ message: 'Service created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating service' });
    }
});

export default router;