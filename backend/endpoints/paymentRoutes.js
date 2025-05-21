import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// Create a new payment
router.post('/', async (req, res) => {
    try {
        const { RecordNumber, AmountPaid } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Payment (RecordNumber, AmountPaid) VALUES (?, ?)',
            [RecordNumber, AmountPaid]
        );
        res.status(201).json({ 
            message: 'Payment created successfully',
            paymentNumber: result.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating payment' });
    }
});

export default router;