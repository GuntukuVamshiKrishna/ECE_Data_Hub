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
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });
        if (!adminExists) {
            // Only create if NOT exists (Safety check)
            /*
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123', salt);
            await User.create({
                name: 'Admin User',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin account created: admin@gmail.com / Admin@123');
            */
            console.log('Admin already exists. Skipping seed.');
        }

        // Check for User
        const userExists = await User.findOne({ email: 'user@gmail.com' });
        if (!userExists) {
            // Only create if NOT exists (Safety check)
            /*
           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash('User@123', salt);
           await User.create({
               name: 'Regular User',
               email: 'user@gmail.com',
               password: hashedPassword,
               role: 'user'
           });
           console.log('User account created: user@gmail.com / User@123');
           */
            console.log('User already exists. Skipping seed.');
        }
    } catch (error) {
        console.error("Seeding error:", error.message);
    }
};
// seedUsers(); // seeding disabled to preserve data

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
