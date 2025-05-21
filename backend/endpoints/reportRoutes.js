import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// GET /report/daily?date=YYYY-MM-DD
router.get('/daily', async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];

        const [report] = await pool.query(`
            SELECT 
                py.RecordNumber,
                c.PlateNumber,
                p.PackageName,
                p.PackageDescription,
                py.AmountPaid,
                py.PaymentDate
            FROM Payment py
            LEFT JOIN ServicePackage sp ON py.RecordNumber = sp.RecordNumber
            LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
            LEFT JOIN Package p ON sp.PackageNumber = p.PackageNumber
            WHERE DATE(py.PaymentDate) = ?
            ORDER BY py.PaymentDate DESC
        `, [date]);

        res.json({
            date,
            count: report.length,
            data: report
        });
    } catch (error) {
        console.error('Error fetching daily report:', error);
        res.status(500).json({ message: 'Error generating daily report' });
    }
});

export default router;
