import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// GET - System-wide counts
router.get('/counts', async (req, res) => {
    try {
        const [servicesCount] = await pool.query('SELECT COUNT(*) as count FROM Services');
        const [carsCount] = await pool.query('SELECT COUNT(*) as count FROM Car');
        const [recordsCount] = await pool.query('SELECT COUNT(*) as count FROM ServiceRecord');
        const [paymentsCount] = await pool.query('SELECT COUNT(*) as count FROM Payment');
        const [totalRevenue] = await pool.query(`
            SELECT SUM(s.ServicePrice) as total
            FROM ServiceRecord sr
            JOIN Services s ON sr.ServiceCode = s.ServiceCode
        `);

        res.json({
            services: servicesCount[0].count,
            cars: carsCount[0].count,
            serviceRecords: recordsCount[0].count,
            payments: paymentsCount[0].count,
            totalRevenue: totalRevenue[0].total || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching system counts' });
    }
});

// GET - Recent activity
router.get('/recent-activity', async (req, res) => {
    try {
        const [recentServices] = await pool.query(`
            SELECT sr.RecordNumber, sr.ServiceDate, c.Model, s.ServiceName 
            FROM ServiceRecord sr
            JOIN Car c ON sr.PlateNumber = c.PlateNumber
            JOIN Services s ON sr.ServiceCode = s.ServiceCode
            ORDER BY sr.ServiceDate DESC
            LIMIT 5
        `);

        const [recentPayments] = await pool.query(`
            SELECT p.PaymentNumber, p.AmountPaid, p.PaymentDate, c.Model
            FROM Payment p
            JOIN ServiceRecord sr ON p.RecordNumber = sr.RecordNumber
            JOIN Car c ON sr.PlateNumber = c.PlateNumber
            ORDER BY p.PaymentDate DESC
            LIMIT 5
        `);

        res.json({
            recentServices,
            recentPayments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching recent activity' });
    }
});

export default router;