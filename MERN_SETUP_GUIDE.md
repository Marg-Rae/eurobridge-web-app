# Complete MERN Stack Implementation Guide

This document provides a comprehensive guide to the authentication system and role-based dashboard implementation for the Eurobridge web application.

## Table of Contents
1. [Authentication System](#authentication-system)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Deployment Guide](#deployment-guide)
5. [API Documentation](#api-documentation)

---

## Authentication System

### Features
- **User Registration**: Create new user accounts with email validation and duplicate checking
- **User Login**: Authenticate users with password verification
- **JWT Tokens**: Secure token-based authentication with 7-day expiration
- **Password Security**: Bcrypt hashing with salt rounds (12)
- **Role-Based Access**: Support for student, staff, and admin roles
- **Protected Routes**: Frontend route protection based on user roles
- **Token Persistence**: Automatic token storage and recovery on page refresh

### User Roles
- **student**: Can only access student dashboard (`/dashboard/student`)
- **staff**: Can access staff dashboard (`/dashboard/staff`)
- **admin**: Can access staff dashboard (can be extended for admin privileges)

---

## Backend Setup

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
MONGODB_URI=mongodb+srv://your-username:password@cluster.mongodb.net/eurobridge
JWT_SECRET=your-secret-key-min-32-characters-recommended
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Running the Backend

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The backend will run on `http://localhost:5000` (or your configured PORT).

### MongoDB Setup

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get the connection string
4. Replace `your-username` and `password` in MONGODB_URI with your credentials

### JWT Secret

Generate a secure JWT secret (minimum 32 characters recommended):
```bash
# Option 1: Generate using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use any 32+ character string
your-super-secret-jwt-key-change-this-in-production
```

---

## Frontend Setup

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your API base URL in `.env`:
```env
# For local development
VITE_API_BASE_URL=http://localhost:5000

# For production
# VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

### Running the Frontend

**Development:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is in use).

**Production Build:**
```bash
npm run build
```

---

## File Structure

### Backend
```
backend/src/
├── controllers/
│   └── auth.controller.js      # Authentication logic
├── models/
│   └── User.js                  # User schema with roles
├── routes/
│   └── auth.routes.js           # Auth endpoints
├── middleware/
│   └── auth.js                  # JWT verification & role authorization
├── config/
│   └── db.js                    # MongoDB connection
├── app.js                       # Express app setup
└── server.js                    # Server startup
```

### Frontend
```
frontend/src/
├── pages/
│   ├── Login.jsx                # Login page (public)
│   ├── Register.jsx             # Registration page (public)
│   └── [other pages]
├── components/
│   ├── StudentDashboard.jsx     # Student dashboard (protected)
│   ├── StaffDashboard.jsx       # Staff dashboard (protected)
│   └── ProtectedRoute.jsx       # Route protection component
├── contexts/
│   └── AuthContext.jsx          # Auth state management
├── api/
│   └── axios.js                 # API client configuration
├── styles/
│   └── auth.css                 # Auth & dashboard styles
└── App.jsx                      # Main routing
```

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "userType": "student" // or "staff"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Email is already registered" // or other error message
}
```

---

#### POST /api/auth/login
Authenticate a user and receive JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

---

#### GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

#### POST /api/auth/logout
Logout user (token invalidation on frontend).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Signed out successfully"
}
```

---

## Frontend Authentication Flow

### Context API (AuthContext)

The `AuthContext` manages all authentication state and operations:

```jsx
const { 
  user,              // Current user object
  token,             // JWT token
  loading,           // Loading state
  isAuthenticated,   // Boolean flag
  register,          // Register function
  login,             // Login function
  logout             // Logout function
} = useAuth();
```

### Using Authentication in Components

```jsx
import { useAuth } from "../contexts/AuthContext.jsx";

const MyComponent = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Please login to continue</p>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Protected Routes

Routes are protected using the `ProtectedRoute` component:

```jsx
<Route
  path="/dashboard/student"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
```

### Token Management

- **Storage**: Token is stored in `localStorage` after login
- **Auto-Recovery**: Token is restored from localStorage on app load
- **API Headers**: Automatically added to all API requests
- **Cleanup**: Token is removed from localStorage on logout

---

## Deployment Guide

### Backend Deployment (Render)

1. **Prepare Repository**:
   - Push code to GitHub
   - Ensure `.env` is in `.gitignore`

2. **Create Render Service**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

3. **Configure Environment**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-secret-key
     CORS_ORIGIN=your-netlify-domain.netlify.app
     NODE_ENV=production
     ```

4. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy automatically

### Frontend Deployment (Netlify)

1. **Prepare Build**:
   ```bash
   npm run build
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Select repository and branch

3. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

4. **Set Environment Variables**:
   - Go to Site Settings → Build & Deploy → Environment
   - Add:
     ```
     VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
     ```

5. **Deploy**:
   - Netlify will automatically build and deploy

### CORS Configuration

Ensure your Render backend has the correct CORS origin pointing to your Netlify domain:

```env
# On Render backend
CORS_ORIGIN=your-netlify-domain.netlify.app
```

---

## Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` file to version control
   - Use `.env.example` for reference
   - Rotate JWT_SECRET in production

2. **Password Security**:
   - Passwords are hashed with bcrypt (12 rounds)
   - Never store plain text passwords
   - Require minimum 6 characters on frontend

3. **JWT Token**:
   - Set expiration to 7 days
   - Include email and role in payload
   - Verify token on protected routes

4. **HTTPS**:
   - Enable HTTPS on all deployed services
   - Render and Netlify provide free SSL certificates

5. **CORS**:
   - Configure CORS to only allow your frontend domain
   - Avoid using `"*"` in production

---

## Troubleshooting

### Common Issues

**Issue**: "CORS error when calling backend from frontend"
- **Solution**: Ensure `CORS_ORIGIN` in backend `.env` matches your frontend domain
- Check that frontend `VITE_API_BASE_URL` is correct

**Issue**: "Token undefined in requests"
- **Solution**: Clear browser cache and localStorage
- Ensure token is being saved after login
- Check browser DevTools → Application → localStorage

**Issue**: "MongoDB connection fails"
- **Solution**: Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct

**Issue**: "Dashboard shows protected route but user can still access"
- **Solution**: Verify role in `/api/auth/me` endpoint
- Check `ProtectedRoute` `allowedRoles` prop
- Clear localStorage and re-login

**Issue**: "Password hashing errors"
- **Solution**: Ensure bcryptjs package is installed
- Check that password is provided in registration
- Verify NODE_ENV is not blocking bcrypt operations

---

## Testing

### Manual Testing

1. **Registration Flow**:
   - Go to `/register`
   - Fill in form with valid data
   - Should redirect to appropriate dashboard

2. **Login Flow**:
   - Go to `/login`
   - Enter registered credentials
   - Should redirect to appropriate dashboard

3. **Route Protection**:
   - Logout (or manually remove token from localStorage)
   - Try accessing `/dashboard/student` directly
   - Should redirect to `/login`

4. **Role-Based Access**:
   - Register as student, login should go to `/dashboard/student`
   - Register as staff, login should go to `/dashboard/staff`

### API Testing

Use Postman or cURL to test endpoints:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123","userType":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas/)
- [JWT.io](https://jwt.io/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

---

## Next Steps

After implementing this authentication system, consider:

1. **Email Verification**: Add email confirmation for new registrations
2. **Password Recovery**: Implement "forgot password" functionality
3. **OAuth Integration**: Add GitHub/Google login options
4. **Two-Factor Authentication**: Enhance security with 2FA
5. **Rate Limiting**: Prevent brute force attacks
6. **User Profile Management**: Allow users to update their information
7. **Activity Logging**: Track user actions for security audit

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages in browser console and server logs
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed with correct versions
