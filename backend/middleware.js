import mysql from 'mysql2/promise';
import cors from 'cors';
import express from 'express'
// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'crpms',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// CORS configuration
const corsOptions = {
    origin: '*', 
    methods: "*",
    allowedHeaders: "*"
};

// Middleware setup
const setupMiddleware = (app) => {
    app.use(cors(corsOptions));
    app.use(express.json());
};

export { pool, setupMiddleware };
export default dbConfig;