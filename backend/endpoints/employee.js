import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// Add a new employee (POST)
router.post('/', async (req, res) => {
    try {
        const { 
            employeeNumber, 
            FirstNames, 
            LastName, 
            position, 
            gender, 
            telephone, 
            address, 
            hiredDate 
        } = req.body;

        // Validate required fields
        if (!employeeNumber || !FirstNames || !LastName || !position || 
            !gender || !telephone || !address || !hiredDate) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }

        // Validate employeeNumber is a number
        if (isNaN(employeeNumber)) {
            return res.status(400).json({ 
                success: false,
                message: 'Employee number must be a number' 
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO employee 
            (employeeNumber, FirstNames, LastName, position, gender, telephone, address, hiredDate) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [employeeNumber, FirstNames, LastName, position, gender, telephone, address, hiredDate]
        );

        res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            data: {
                employeeNumber,
                FirstNames,
                LastName,
                position,
                gender,
                telephone,
                address,
                hiredDate
            }
        });
    } catch (error) {
        console.error('Error adding employee:', error);
        
        // Handle duplicate employee number
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Employee number already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get all employees (GET)
router.get('/', async (req, res) => {
    try {
        const [employees] = await pool.execute('SELECT * FROM employee ORDER BY LastName, FirstNames');
        
        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Update employee (PUT)
router.put('/:employeeNumber', async (req, res) => {
    try {
        const { employeeNumber } = req.params;
        const { 
            FirstNames, 
            LastName, 
            position, 
            gender, 
            telephone, 
            address, 
            hiredDate 
        } = req.body;

        // Validate at least one field is provided
        if (!FirstNames && !LastName && !position && !gender && 
            !telephone && !address && !hiredDate) {
            return res.status(400).json({
                success: false,
                message: 'At least one field must be provided for update'
            });
        }

        // Build dynamic update query
        let updateQuery = 'UPDATE employee SET ';
        const updateParams = [];
        const fieldsToUpdate = [];

        if (FirstNames !== undefined) {
            fieldsToUpdate.push('FirstNames = ?');
            updateParams.push(FirstNames);
        }
        if (LastName !== undefined) {
            fieldsToUpdate.push('LastName = ?');
            updateParams.push(LastName);
        }
        if (position !== undefined) {
            fieldsToUpdate.push('position = ?');
            updateParams.push(position);
        }
        if (gender !== undefined) {
            fieldsToUpdate.push('gender = ?');
            updateParams.push(gender);
        }
        if (telephone !== undefined) {
            fieldsToUpdate.push('telephone = ?');
            updateParams.push(telephone);
        }
        if (address !== undefined) {
            fieldsToUpdate.push('address = ?');
            updateParams.push(address);
        }
        if (hiredDate !== undefined) {
            fieldsToUpdate.push('hiredDate = ?');
            updateParams.push(hiredDate);
        }

        updateQuery += fieldsToUpdate.join(', ') + ' WHERE employeeNumber = ?';
        updateParams.push(employeeNumber);

        const [result] = await pool.execute(updateQuery, updateParams);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

export default router;