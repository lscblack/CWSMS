import express from 'express';
import {  setupMiddleware } from './middleware.js';
import users from './endpoints/users.js';
import router from './endpoints/salary.js';
import emp from './endpoints/employee.js';
import dep from './endpoints/depa.js';

const app = express();
const PORT =  3000;

// Setup middleware
setupMiddleware(app);

app.use(users)
app.use("/salary",router)
app.use("/emp",emp)
app.use("/dep",dep)
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});