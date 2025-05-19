import express from 'express';
import { pool } from '../middleware.js';

const app = express.Router();

// Report Endpoint
app.get('/api/report/salary', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                e.employeeNumber, 
                e.FirstNames, 
                e.LastName, 
                e.position, 
                e.gender, 
                e.telephone, 
                e.address, 
                e.hiredDate, 
                d.departmentName, 
                s.glossSalary, 
                s.totalDeducation, 
                s.netSalary
            FROM employee e
            JOIN salary s ON e.employeeNumber = s.employeNumber
            JOIN department d ON d.glossSalary = s.glossSalary;
        `);

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while generating the report.'
        });
    }
});
export default app