# ECE Data Hub
A MERN stack web application for elctronics and communication engineering students and faculty to access and manage student data and documents.

## Prerequisites
- Node.js installed

## Setup Instructions

1. **Install Dependencies**
   Navigate to both the `frontend` and `backend` folders and install the required npm packages.

   ```bash
   cd backend
   npm install

   cd ../frontend
   npm install
   ```

2. **Environment Variables**
   The backend uses a `.env` file for configuration. Since this is a university submission, the connection strings and ports have been predefined and the `.env` file is likely included in the submission folder for easy testing by the faculty.

3. **Running the Application**
   You will need to run the frontend and backend servers simultaneously. Open two terminal windows.

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Test Credentials
The database automatically seeds itself with test accounts upon startup. You can use these to test the application immediately:

**Faculty (Admin) Login:**
- **Email:** admin@institute.ece
- **Password:** Faculty@123

**Student (User) Login:**
- **Email:** student@institute.ece
- **Password:** Student@123
