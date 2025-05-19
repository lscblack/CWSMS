import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// Add new department (POST)
router.post('/', async (req, res) => {
    try {
        const { departmentCode, departmentName, glossSalary } = req.body;

        // Validate required fields
        if (!departmentCode || !departmentName || glossSalary === undefined) {
            return res.status(400).json({
                success: false,
                message: 'departmentCode, departmentName, and glossSalary are required'
            });
        }

        // Validate numeric fields
        if (isNaN(departmentCode) || isNaN(glossSalary)) {
            return res.status(400).json({
                success: false,
                message: 'departmentCode and glossSalary must be numbers'
            });
        }

        const [result] = await pool.execute(
            'INSERT INTO department (departmentCode, departmentName, glossSalary) VALUES (?, ?, ?)',
            [departmentCode, departmentName, glossSalary]
        );

        res.status(201).json({
            success: true,
            message: 'Department added successfully',
            data: {
                departmentCode,
                departmentName,
                glossSalary
            }
        });
    } catch (error) {
        console.error('Error adding department:', error);
        
        // Handle duplicate department code
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Department code already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get all departments (GET)
router.get('/', async (req, res) => {
    try {
        const [departments] = await pool.execute('SELECT * FROM department ORDER BY departmentName');
        
        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Update department (PUT)
router.put('/:departmentCode', async (req, res) => {
    try {
        const { departmentCode } = req.params;
        const { departmentName, glossSalary } = req.body;

        // Validate at least one field is provided
        if (!departmentName && glossSalary === undefined) {
            return res.status(400).json({
                success: false,
                message: 'At least one field (departmentName or glossSalary) must be provided for update'
            });
        }

        // Validate glossSalary is a number if provided
        if (glossSalary !== undefined && isNaN(glossSalary)) {
            return res.status(400).json({
                success: false,
                message: 'glossSalary must be a number'
            });
        }

        // Build dynamic update query
        let updateQuery = 'UPDATE department SET ';
        const updateParams = [];
        const fieldsToUpdate = [];

        if (departmentName !== undefined) {
            fieldsToUpdate.push('departmentName = ?');
            updateParams.push(departmentName);
        }
        if (glossSalary !== undefined) {
            fieldsToUpdate.push('glossSalary = ?');
            updateParams.push(glossSalary);
        }

        updateQuery += fieldsToUpdate.join(', ') + ' WHERE departmentCode = ?';
        updateParams.push(departmentCode);

        const [result] = await pool.execute(updateQuery, updateParams);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

export default router;