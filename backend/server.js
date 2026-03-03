const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { registerUser } = require('./controllers/authController');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));

// Seed Admin and User
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    try {
        // await User.deleteMany({}); // Clear old users - DISABLED to save data

        // Check for Admin
        const adminExists = await User.findOne({ email: 'admin@institute.ece' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Faculty@123', salt);
            await User.create({
                name: 'Faculty Admin',
                email: 'admin@institute.ece',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin account created: admin@institute.ece / Faculty@123');
        } else {
            console.log('Admin already exists. Skipping seed.');
        }

        // Check for User
        const userExists = await User.findOne({ email: 'student@institute.ece' });
        if (!userExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Student@123', salt);
            await User.create({
                name: 'Student User',
                email: 'student@institute.ece',
                password: hashedPassword,
                role: 'user'
            });
            console.log('User account created: student@institute.ece / Student@123');
        } else {
            console.log('User already exists. Skipping seed.');
        }
    } catch (error) {
        console.error("Seeding error:", error.message);
    }
};
seedUsers();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
