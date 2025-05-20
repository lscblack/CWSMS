import express from 'express';
import {  setupMiddleware } from './middleware.js';
import users from './endpoints/users.js';
import serviceRecordRoutes from './endpoints/serviceRecordRoutes.js';
import servicesRoutes from './endpoints/servicesRoutes.js';
import carRoutes from './endpoints/carRoutes.js';
import paymentRoutes from './endpoints/paymentRoutes.js';
import statsRoutes from './endpoints/statsRoutes.js'; // Add this line
import repo from './endpoints/report.js';
const app = express();
const PORT =  3000;

// Setup middleware
setupMiddleware(app);
// Use the routes
app.use(repo);
app.use('/api/service-records', serviceRecordRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stats', statsRoutes); // Add this line
app.use(users)
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});