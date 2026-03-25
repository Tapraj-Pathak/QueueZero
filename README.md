# QueueZero - Smart Hospital Appointment & Token Management System

A full-stack web application for managing hospital appointments, token generation, and emergency alerts with QR code validation.

## Tech Stack

- **Frontend**: React.js with Vite, TailwindCSS, Zustand
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io
- **QR Codes**: qrcode library

## Features

### Patient Features

- User registration and login (email/password)
- Browse hospitals and departments
- Book appointments with available time slots
- View token with QR code
- Real-time appointment status updates
- Emergency alert system (3 levels: Risky, Very Risky, Critical)

### Admin Features

- View all booked appointments
- Validate QR tokens for check-ins
- Mark appointments as completed
- Real-time emergency alert notifications
- Manage hospital and department data

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```env
   MONGODB_URI=mongodb://localhost:27017/queuezero
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start MongoDB service

5. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` (no environment variables needed)

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Seeding

You can add sample data by making POST requests to the API endpoints or by creating a seed script.

Example hospitals and departments can be added via the admin interface or API calls.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create user account
- `GET /api/auth/me` - Get current user info

### Hospitals & Departments

- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals` - Create hospital (admin)
- `GET /api/departments` - Get all departments
- `GET /api/departments/hospital/:hospitalId` - Get departments by hospital

### Appointments

- `POST /api/appointments` - Book appointment
- `GET /api/appointments/user` - Get user's appointments
- `POST /api/appointments/validate-token` - Validate QR token
- `PUT /api/appointments/:id/complete` - Mark appointment complete
- `GET /api/appointments` - Get all appointments (admin)

### Emergency

- `POST /api/emergency` - Create emergency alert
- `GET /api/emergency` - Get all emergency alerts (admin)
- `PUT /api/emergency/:id/resolve` - Resolve emergency alert

## Demo Flow

1. **User Registration**: Sign up with email/password
2. **Browse & Book**: Select hospital, department, and available time slot
3. **Token Generation**: Receive unique token with QR code
4. **Admin Validation**: Admin scans QR code to validate check-in
5. **Emergency Alerts**: Users can send emergency alerts that appear in real-time on admin dashboard
6. **Appointment Completion**: Admin marks appointments as completed

## Project Structure

```
queuezero/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── lib/
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
└── README.md
```

## Technologies Used

- **Frontend**: React, React Router, TailwindCSS, Axios, Zustand, Socket.io Client, QRCode React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.io, JWT, bcrypt
- **Authentication**: JWT with bcrypt password hashing
- **Real-time Communication**: Socket.io
- **QR Code Generation**: qrcode library

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
