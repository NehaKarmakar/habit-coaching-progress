# Habit Coaching System

## About the Project

The **Habit Coaching System** is a full-stack MERN application designed to help coaches and members manage and build healthy habits.

Coaches can create and manage groups, enroll members, assign habits and resources, monitor progress, and communicate with members through email notifications. Members can view their enrolled groups and assigned habits, track daily, weekly, and monthly progress, maintain habit streaks, and view their performance on the leaderboard.

The application also includes AI-powered habit advice, automated reminders, cloud-based resource storage, email notifications, SMS integration, and dashboard progress visualization.

## Features

### Authentication & Authorization

- User registration and login
- JWT authentication
- Password hashing with bcryptjs
- Coach and Member roles
- Role-based authorization and navigation
- Client-side and server-side validation
- Forgot password and password reset

### Coach Features

- Create, update, delete and view groups
- Search, sort and paginate groups
- Redux Toolkit for group state management
- Enroll members into groups
- Create, update, delete and view habits
- Assign habits to groups
- Search, sort and paginate habits
- Upload habit resources using Multer and Cloudinary
- View group members and assigned habits
- Coach dashboard with statistics
- Progress monitoring
- Leaderboard

### Member Features

- View enrolled groups
- View assigned habits
- Search, sort and paginate habits
- Access habit resources
- Track daily, weekly and monthly progress
- Current and longest streak tracking
- Progress summary
- Leaderboard

### Notifications & Integrations

- Registration email
- Forgot/reset password emails
- Group enrollment emails
- Habit assignment emails
- Nodemailer with Gmail OAuth2
- Twilio SMS integration
- Cron jobs for reminders
- Gemini AI for habit advice
- Motivational quote integration

### Dashboard & Analytics

- Group, member and habit statistics
- Daily, weekly and monthly progress
- Current and longest streak
- Progress visualization using Recharts
- shadcn/ui chart component

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Context API
- Redux Toolkit
- Tailwind CSS
- shadcn/ui
- Recharts
- React Toastify
- HTML & CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- Nodemailer
- Gmail OAuth2
- Gemini AI
- Twilio
- Cron Jobs
- Day.js

## Database

- MongoDB Atlas
- Mongoose relationships
- Mongoose `populate()`
- MongoDB aggregation

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- File Storage: Cloudinary


## Environment Variables
```.env
 PORT=your_port

 #MongoDB
 URL=your_mongodb_connection_string

#Authentication
JWT_SECRET=your_jwt_secret

#Gmail OAuth2 / Nodemailer
USER_EMAIL=your_gmail_address
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token

#Gemini AI
GEMINI_API_KEY=your_gemini_api_key

#Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

#Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
 ## User Roles & Access


- **Member:** New users can register through the public registration page and are assigned the Member role by default.
- **Coach:** Coach accounts are provisioned separately for demonstration and coach-specific access.

> **Note:** Public registration is restricted to the **Member** role to maintain role-based access control.
