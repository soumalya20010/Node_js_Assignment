import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import companyRoutes from './routes/companies.js';
import userRoutes from './routes/users.js';
import searchRoutes from './routes/search.js';

dotenv.config();

const app = express();


app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI )
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Error connecting to MongoDB", err));


app.use('/companies', companyRoutes);
app.use('/users', userRoutes);
app.use('/search', searchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});