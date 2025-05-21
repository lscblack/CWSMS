import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// Create a new service record
router.post('/', async (req, res) => {
    try {
        const { PlateNumber, PackageNumber } = req.body;
        const [result] = await pool.query(
            'INSERT INTO ServicePackage (PlateNumber, PackageNumber) VALUES (?, ?)',
            [PlateNumber, PackageNumber]
        );
        res.status(201).json({ 
            message: 'Service record created successfully',
            recordNumber: result.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating service record' });
    }
});

// Get all service records
router.get('/', async (req, res) => {
    try {
        const [records] = await pool.query(`
            SELECT sp.RecordNumber, sp.ServiceDate, 
                   sp.PlateNumber, sp.PackageNumber,
                   c.DriverName, c.CarType,
                   p.PackageName, p.PackagePrice
            FROM ServicePackage sp
            LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
            LEFT JOIN Package p ON sp.PackageNumber = p.PackageNumber
        `);
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching service records' });
    }
});

// Update a service record
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { PlateNumber, PackageNumber } = req.body;
        const [result] = await pool.query(
            'UPDATE ServicePackage SET PlateNumber = ?, PackageNumber = ? WHERE RecordNumber = ?',
            [PlateNumber, PackageNumber, id]
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

// Delete a service record
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            'DELETE FROM ServicePackage WHERE RecordNumber = ?',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service record not found' });
        }
        res.json({ message: 'Service record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting service record' });
    }
});

export default router;