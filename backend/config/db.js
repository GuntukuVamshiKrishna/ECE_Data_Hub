const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        });
        isConnected = db.connections[0].readyState;
        console.log(`MongoDB Connected: ${db.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Do not process.exit(1) on serverless, just throw the error
        throw error;
    }
};

module.exports = connectDB;
