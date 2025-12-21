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
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));

// Seed Admin and User (Run once or check inside controller)
// We will trigger a basic check on startup to ensure default users exist
const seedUsers = async () => {
    try {
        await registerUser({ body: { seed: true } }, { status: () => ({ json: () => { } }) });
        console.log("User check/seeding completed.");
    } catch (error) {
        console.error("Seeding error:", error.message);
    }
};
seedUsers();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
