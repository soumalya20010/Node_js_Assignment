import mongoose from 'mongoose';

// mongoose.set('strictQuery', true); // Set strictQuery to true to suppress the warning

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;