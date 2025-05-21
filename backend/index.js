import express from 'express';
import {  setupMiddleware } from './middleware.js';
import users from './endpoints/users.js';
import carRoutes from './endpoints/carRoutes.js';
import packageRoutes from './endpoints/packageRoutes.js';
import servicePackageRoutes from './endpoints/servicePackageRoutes.js';
import paymentRoutes from './endpoints/paymentRoutes.js';
import reportRoutes from './endpoints/reportRoutes.js'; // Add this line
const app = express();
const PORT =  3000;

// Setup middleware
setupMiddleware(app);
// Routes
app.use('/api/cars', carRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/service-records', servicePackageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes); // Add this line
app.use(users)
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});