import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI )
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Error connecting to MongoDB", err));

// Import routes
import companyRoutes from './routes/companies.js';
import userRoutes from './routes/users.js';
import searchRoutes from './routes/search.js';

// Use routes
app.use('/companies', companyRoutes);
app.use('/users', userRoutes);
app.use('/search', searchRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});