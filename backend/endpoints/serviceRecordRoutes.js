import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// CREATE - Add new service record
router.post('/', async (req, res) => {
    try {
        const { ServiceDate, PlateNumber, ServiceCode } = req.body;
        const [result] = await pool.query(
            'INSERT INTO ServiceRecord (ServiceDate, PlateNumber, ServiceCode) VALUES (?, ?, ?)',
            [ServiceDate, PlateNumber, ServiceCode]
        );
        res.status(201).json({ id: result.insertId, message: 'Service record created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating service record' });
    }
});

// READ - Get all service records
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ServiceRecord');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching service records' });
    }
});

// READ - Get single service record
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ServiceRecord WHERE RecordNumber = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Service record not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching service record' });
    }
});

// UPDATE - Update service record
router.put('/:id', async (req, res) => {
    try {
        const { ServiceDate, PlateNumber, ServiceCode } = req.body;
        const [result] = await pool.query(
            'UPDATE ServiceRecord SET ServiceDate = ?, PlateNumber = ?, ServiceCode = ? WHERE RecordNumber = ?',
            [ServiceDate, PlateNumber, ServiceCode, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service record not found' });
        }
        res.json({ message: 'Service record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating service record' });
    }
});

// DELETE - Delete service record
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM ServiceRecord WHERE RecordNumber = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service record not found' });
        }
        res.json({ message: 'Service record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting service record' });
    }
});
// GET - Detailed service report
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