# 🏛️ GraceChurch Management System

A modern, full-stack church management platform built with the MERN stack (MongoDB, Express.js, React, Node.js). This comprehensive system enables churches to manage members, events, donations, ministries, and more through an intuitive and beautiful interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-38B2AC?logo=tailwind-css)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👥 User Management
- **Multi-role System**: Public users, Members, and Admins
- **Secure Authentication**: Session-based auth with bcrypt password hashing
- **Profile Management**: Update personal information, address, and password
- **Membership Upgrades**: Public users can upgrade to member status

### 📅 Event Management
- **Event Creation**: Members can create and manage events
- **RSVP System**: Track event attendance with accept/decline options
- **Ministry Association**: Link events to specific ministries
- **Public Access**: Public users can view and RSVP to events

### 💰 Donation Tracking
- **Donation Records**: Track all donations with amounts and purposes
- **Member Statistics**: View donation history and totals per member
- **Admin Analytics**: Dashboard with donation trends and insights
- **Secure Processing**: Safe handling of donation information

### 🏢 Ministry Management
- **Ministry Creation**: Organize church activities into ministries
- **Event Association**: Link events to specific ministries
- **Owner Management**: Assign ministry leaders
- **Admin Oversight**: View and manage all ministries

### 📊 Admin Dashboard
- **Real-time Statistics**: 
  - Total members and public users
  - Upcoming events (next 30 days)
  - Total donations
  - Active ministries
- **Recent Activity Feed**: Track latest events and activities
- **Top Contributors**: Leaderboard of donation contributors
- **User Management**: View, manage, and delete users
- **Data Insights**: Visual representation of church metrics

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Beautiful dark mode with gradient accents
- **Smooth Animations**: Fade-ins, slides, and hover effects
- **Toast Notifications**: Modern toast system for user feedback
- **Glassmorphism**: Modern design with backdrop blur effects
- **Background Images**: Immersive backgrounds on key pages

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **React Router DOM 7.10.1** - Client-side routing
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Axios 1.13.2** - HTTP client
- **React Icons 5.5.0** - Icon library
- **Vite 7.2.4** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express 5.2.1** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 9.0.0** - MongoDB ODM
- **Express Session 1.18.2** - Session management
- **Connect-Mongo 6.0.0** - MongoDB session store
- **Bcrypt 6.0.0** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing
- **Dotenv 17.2.3** - Environment variable management

---

## 📁 Project Structure

```
Project/
├── Backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── donationController.js
│   │   ├── eventController.js
│   │   ├── ministryController.js
│   │   ├── servicePlanController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── donationModel.js
│   │   ├── eventModel.js
│   │   ├── ministryModel.js
│   │   ├── servicePlanModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── ministryRoutes.js
│   │   ├── servicePlanRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── Frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   │   └── backgrounds/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PublicNavbar.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ToastContext.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Donations.jsx
    │   │   ├── Events.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Members.jsx
    │   │   ├── Membership.jsx
    │   │   ├── Ministries.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Register.jsx
    │   │   └── Services.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── apiInterceptor.js
    │   │   ├── authService.js
    │   │   ├── dashboardService.js
    │   │   ├── donationService.js
    │   │   ├── eventService.js
    │   │   ├── ministryService.js
    │   │   ├── servicePlanService.js
    │   │   └── userService.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Project
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` files in both Backend and Frontend directories (see [Environment Variables](#-environment-variables))

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

6. **Run the Application**
   
   **Backend** (Terminal 1):
   ```bash
   cd Backend
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd Frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## 🔐 Environment Variables

### Backend `.env`
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gracechurch
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gracechurch

# Session Secret
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "public"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: connect.sid=<session-cookie>
```

#### Logout
```http
POST /api/auth/logout
Cookie: connect.sid=<session-cookie>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Cookie: connect.sid=<session-cookie>
```

#### Update Profile
```http
PUT /api/users/profile
Cookie: connect.sid=<session-cookie>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "postalCode": "62701",
    "country": "USA"
  }
}
```

#### Upgrade to Member
```http
POST /api/users/upgrade-membership
Cookie: connect.sid=<session-cookie>
```

#### Get All Users (Admin Only)
```http
GET /api/users
Cookie: connect.sid=<session-cookie>
```

#### Delete User (Admin Only)
```http
DELETE /api/users/:id
Cookie: connect.sid=<session-cookie>
```

### Event Endpoints

#### Get All Events
```http
GET /api/events
```

#### Get Admin Events (Admin Only)
```http
GET /api/events/admin/all
Cookie: connect.sid=<session-cookie>
```

#### Create Event (Member/Admin)
```http
POST /api/events
Cookie: connect.sid=<session-cookie>
Content-Type: application/json

{
  "title": "Sunday Service",
  "description": "Weekly worship service",
  "date": "2024-12-20T10:00:00Z",
  "location": "Main Sanctuary",
  "ministry": "ministry-id-here"
}
```

#### RSVP to Event
```http
PUT /api/events/:id/rsvp
Cookie: connect.sid=<session-cookie>
Content-Type: application/json

{
  "status": "accepted"
}
```

#### Delete Event
```http
DELETE /api/events/:id
Cookie: connect.sid=<session-cookie>
```

### Ministry Endpoints

#### Get All Ministries
```http
GET /api/ministries
```

#### Get Admin Ministries (Admin Only)
```http
GET /api/ministries/admin/all
Cookie: connect.sid=<session-cookie>
```

#### Create Ministry (Member/Admin)
```http
POST /api/ministries
Cookie: connect.sid=<session-cookie>
Content-Type: application/json

{
  "name": "Youth Ministry",
  "description": "Ministry for young people"
}
```

#### Delete Ministry
```http
DELETE /api/ministries/:id
Cookie: connect.sid=<session-cookie>
```

### Donation Endpoints

#### Create Donation
```http
POST /api/donations
Cookie: connect.sid=<session-cookie>
Content-Type: application/json

{
  "amount": 100,
  "purpose": "Tithe",
  "date": "2024-12-16"
}
```

#### Get My Donations
```http
GET /api/donations/my
Cookie: connect.sid=<session-cookie>
```

#### Get Member Donation Stats (Admin Only)
```http
GET /api/donations/members-stats
Cookie: connect.sid=<session-cookie>
```

### Dashboard Endpoints

#### Get Dashboard Stats (Admin Only)
```http
GET /api/dashboard/stats
Cookie: connect.sid=<session-cookie>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalMembers": 25,
    "totalPublicUsers": 10,
    "totalMinistries": 5,
    "upcomingEvents": 8,
    "totalDonations": 15000,
    "monthlyDonations": [
      { "_id": 11, "total": 2500 },
      { "_id": 12, "total": 3000 }
    ]
  }
}
```

---

## 👤 User Roles

### Public User
- **Access**: Limited
- **Capabilities**:
  - View events
  - RSVP to events
  - Make donations
  - View profile
  - Upgrade to member

### Member
- **Access**: Standard
- **Capabilities**:
  - All public user capabilities
  - Create events
  - Create ministries
  - View member dashboard
  - Access member-only features

### Admin
- **Access**: Full
- **Capabilities**:
  - All member capabilities
  - View admin dashboard with analytics
  - Manage all users
  - Delete users
  - Delete ministries
  - View all donation statistics
  - Access system-wide insights

---

## 🎨 Key Features Explained

### Toast Notification System
Modern, non-intrusive notifications for user feedback:
- **Success** (Green): Successful operations
- **Error** (Red): Failed operations
- **Warning** (Amber): Cautionary messages
- **Info** (Blue): Informational messages
- **Confirm** (Modal): User confirmations for destructive actions

### Role-Based Navigation
Dynamic navigation based on user role:
- **Public Users**: Home, Events, Donations, Become Member, Profile
- **Members**: Home, Events, Donations, Profile
- **Admins**: Home, Admin Dashboard, Profile

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interfaces
- Optimized for all screen sizes

### Security Features
- Password hashing with bcrypt
- Session-based authentication
- Protected API routes
- Role-based access control
- CORS configuration
- Secure session storage in MongoDB

---

## 📸 Screenshots

### Admin Dashboard
Comprehensive overview with statistics, recent activity, top contributors, and ministry management.

### Event Management
Create, view, and RSVP to events with ministry associations.

### Donation Tracking
Record donations and view contribution history.

### Profile Management
Update personal information, address, and security settings.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Ayushman Bhattacharya**

---

## 🙏 Acknowledgments

- React Icons for the beautiful icon set
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- The open-source community for inspiration and tools

---

## 📞 Support

For support, email support@gracechurch.com or open an issue in the repository.

---

**Made with ❤️ for churches worldwide**
