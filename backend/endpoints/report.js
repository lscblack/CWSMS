import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// GET - General service report without relying on foreign keys
router.get('/reports/service-summary', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                sr.RecordNumber,
                sr.ServiceDate,

                c.PlateNumber,
                c.Model,
                c.Type,

                sr.ServiceCode, -- We fetch it from ServiceRecord
                s.ServiceName,
                s.ServicePrice,

                p.AmountPaid,
                p.PaymentDate

            FROM ServiceRecord sr

            LEFT JOIN Car c 
                ON sr.PlateNumber = c.PlateNumber

            LEFT JOIN Services s 
                ON sr.ServiceCode = s.ServiceCode

            LEFT JOIN Payment p 
                ON sr.RecordNumber = p.RecordNumber

            ORDER BY sr.ServiceDate DESC
        `);

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Service Summary Report Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching service summary report'
        });
    }
});


export default router;