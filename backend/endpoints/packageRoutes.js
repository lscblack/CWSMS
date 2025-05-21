import express from 'express';
import { pool } from '../middleware.js';

const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
    try {
        const [packages] = await pool.query('SELECT * FROM Package');
        res.json(packages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching packages' });
    }
});

export default router;