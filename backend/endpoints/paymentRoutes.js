import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// INSERT - Add new payment
router.post('/', async (req, res) => {
    try {
        const { AmountPaid, PaymentDate, RecordNumber } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Payment (AmountPaid, PaymentDate, RecordNumber) VALUES (?, ?, ?)',
            [AmountPaid, PaymentDate, RecordNumber]
        );
        res.status(201).json({ id: result.insertId, message: 'Payment created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating payment' });
    }
});

export default router;