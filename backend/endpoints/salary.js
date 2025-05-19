import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// Create a new salary record
router.post('/', async (req, res) => {
    try {
        const { glossSalary, totalDeducation, netSalary, employeNumber } = req.body;

        // Validate required fields
        if (!glossSalary || !totalDeducation || !netSalary || !employeNumber) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields (glossSalary, totalDeducation, netSalary, employeNumber) are required' 
            });
        }

        // Validate data types
        if (isNaN(glossSalary) || isNaN(totalDeducation) || isNaN(netSalary) || isNaN(employeNumber)) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields must be numbers' 
            });
        }

        const [result] = await pool.execute(
            'INSERT INTO salary (glossSalary, totalDeducation, netSalary, employeNumber) VALUES (?, ?, ?, ?)',
            [glossSalary, totalDeducation, netSalary, employeNumber]
        );

        res.status(201).json({
            success: true,
            message: 'Salary record created successfully',
            data: {
                insertId: result.insertId,
                glossSalary,
                totalDeducation,
                netSalary,
                employeNumber
            }
        });
    } catch (error) {
        console.error('Error creating salary record:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get all salary records
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM salary');
        
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching salary records:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get salary records by employee number
router.get('/employee/:employeNumber', async (req, res) => {
    try {
        const { employeNumber } = req.params;

        const [rows] = await pool.execute(
            'SELECT * FROM salary WHERE employeNumber = ?',
            [employeNumber]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No salary records found for this employee'
            });
        }

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching salary records by employee:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Update a salary record
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { glossSalary, totalDeducation, netSalary, employeNumber } = req.body;

        // Validate at least one field is provided
        if (!glossSalary && !totalDeducation && !netSalary && !employeNumber) {
            return res.status(400).json({
                success: false,
                message: 'At least one field (glossSalary, totalDeducation, netSalary, employeNumber) is required for update'
            });
        }

        // Build dynamic update query
        let updateQuery = 'UPDATE salary SET ';
        const updateParams = [];
        const fieldsToUpdate = [];

        if (glossSalary !== undefined) {
            fieldsToUpdate.push('glossSalary = ?');
            updateParams.push(glossSalary);
        }
        if (totalDeducation !== undefined) {
            fieldsToUpdate.push('totalDeducation = ?');
            updateParams.push(totalDeducation);
        }
        if (netSalary !== undefined) {
            fieldsToUpdate.push('netSalary = ?');
            updateParams.push(netSalary);
        }
        if (employeNumber !== undefined) {
            fieldsToUpdate.push('employeNumber = ?');
            updateParams.push(employeNumber);
        }

        updateQuery += fieldsToUpdate.join(', ') + ' WHERE id = ?';
        updateParams.push(id);

        const [result] = await pool.execute(updateQuery, updateParams);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Salary record not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Salary record updated successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Error updating salary record:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Delete a salary record
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            'DELETE FROM salary WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Salary record not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Salary record deleted successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Error deleting salary record:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

export default router;