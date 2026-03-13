# Quick Start Guide - Local Development

Get the Eurobridge web app running locally in minutes!

---

## Prerequisites

- **Node.js** (v16+) and npm installed
- **MongoDB Atlas** account (free tier available)
- **Git** installed

---

## Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd Eurobridge-web-app
```

---

## Step 2: Backend Setup (Terminal 1)

### 2a. Navigate to Backend
```bash
cd backend
```

### 2b. Install Dependencies
```bash
npm install
```

### 2c. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/eurobridge
JWT_SECRET=your-secure-secret-key-here-at-least-32-chars
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 2d. Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
API running on port 5000
Database connection successful
```

---

## Step 3: Frontend Setup (Terminal 2)

### 3a. Navigate to Frontend
```bash
cd frontend
```

### 3b. Install Dependencies
```bash
npm install
```

### 3c. Configure Environment
```bash
cp .env.example .env
```

Verify `.env` has:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3d. Start Frontend Server
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Step 4: Test the Application

### Open Browser
Go to: `http://localhost:5173`

### Test Registration
1. Click on navbar or navigate to `/register`
2. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@test.com
   - **Account Type**: Student
   - **Password**: password123
   - **Confirm**: password123
3. Click "Register"
4. Should redirect to `/dashboard/student`

### Test Login
1. Navigate to `/login`
2. Enter credentials:
   - **Email**: john@test.com
   - **Password**: password123
3. Click "Sign In"
4. Should redirect to dashboard

### Test Logout
1. From dashboard, click "Logout" button
2. Should return to home page
3. Try accessing `/dashboard/student` directly
4. Should redirect to `/login`

---

## Step 5: Test API Directly (Optional)

### Register via cURL
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test",
    "email": "api@test.com",
    "password": "password123",
    "userType": "staff"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "API Test",
    "email": "api@test.com",
    "role": "staff"
  }
}
```

### Login via cURL
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@test.com",
    "password": "password123"
  }'
```

---

## Troubleshooting

### Issue: MongoDB won't connect
```
Error: MongoNetworkError
```

**Solutions:**
1. Verify connection string in `.env`
2. Check username/password are correct
3. Add your IP address to MongoDB Atlas IP Whitelist:
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Add `127.0.0.1` for local development
4. Ensure database user has database access privileges

### Issue: CORS errors in frontend
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Verify `CORS_ORIGIN=http://localhost:5173` in backend `.env`
2. Restart backend server after changing `.env`
3. Clear browser cache (Ctrl+F5)

### Issue: Token not persisting
```
Token undefined after refresh
```

**Solutions:**
1. Check browser DevTools → Application → Local Storage
2. Verify token is being stored after login
3. Clear localStorage and login again:
   ```javascript
   localStorage.clear(); // in browser console
   ```

### Issue: Backend won't start
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Change PORT in `.env`:
   ```env
   PORT=5001
   ```
2. Or kill process on port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

### Issue: Dependencies not found
```
Error: Cannot find module 'express'
```

**Solutions:**
1. Delete `node_modules` folder
2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## Common Commands

### Backend
```bash
# Start development server (auto-reloads)
npm run dev

# Start production server
npm start

# Install new dependency
npm install <package-name>
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new dependency
npm install <package-name>
```

---

## Project Structure

### Backend
```
backend/
├── src/
│   ├── app.js                    # Express app
│   ├── server.js                 # Server startup
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/auth.*.js     # Auth logic
│   ├── models/User.js            # Database schema
│   ├── middleware/auth.js        # JWT verification
│   └── routes/auth.routes.js     # API routes
└── .env                          # Environment config
```

### Frontend
```
frontend/
├── src/
│   ├── App.jsx                   # Main component
│   ├── main.jsx                  # App entry point
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── components/
│   │   ├── StudentDashboard.jsx
│   │   ├── StaffDashboard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx       # Auth state
│   ├── api/
│   │   └── axios.js              # API client
│   └── styles/auth.css
└── .env                          # Environment config
```

---

## File Changes Checklist

### Backend Files
- ✅ `backend/src/controllers/auth.controller.js` - Updated
- ✅ `backend/src/routes/auth.routes.js` - Updated
- ✅ `backend/.env.example` - Created

### Frontend Files
- ✅ `frontend/src/contexts/AuthContext.jsx` - Created
- ✅ `frontend/src/pages/Login.jsx` - Created
- ✅ `frontend/src/pages/Register.jsx` - Created
- ✅ `frontend/src/components/ProtectedRoute.jsx` - Created
- ✅ `frontend/src/components/StudentDashboard.jsx` - Updated
- ✅ `frontend/src/components/StaffDashboard.jsx` - Updated
- ✅ `frontend/src/App.jsx` - Updated
- ✅ `frontend/src/styles/auth.css` - Created
- ✅ `frontend/.env.example` - Updated

### Documentation Files
- ✅ `MERN_SETUP_GUIDE.md` - Created
- ✅ `CODE_SNIPPETS_REFERENCE.md` - Created
- ✅ `DEPLOYMENT_CHECKLIST.md` - Created
- ✅ `IMPLEMENTATION_SUMMARY.md` - Created

---

## Next Steps

1. ✅ **Local Testing**: Verify registration/login works
2. ✅ **Test Protected Routes**: Try accessing dashboards
3. ✅ **Database Check**: Verify users are being stored
4. ✅ **Token Management**: Check localStorage in DevTools
5. 📚 **Read Documentation**: Check `MERN_SETUP_GUIDE.md`
6. 🚀 **Deploy**: Follow `DEPLOYMENT_CHECKLIST.md`

---

## Getting Help

### Check These Files First
1. **Setup Issues**: `MERN_SETUP_GUIDE.md`
2. **Code Reference**: `CODE_SNIPPETS_REFERENCE.md`
3. **Deployment**: `DEPLOYMENT_CHECKLIST.md`
4. **Component Details**: `IMPLEMENTATION_SUMMARY.md`

### Common Resources
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Atlas Guide](https://docs.mongodb.com/atlas/)
- [JWT.io Debugger](https://jwt.io/)

---

## Tips & Tricks

### Browser DevTools
```javascript
// Check stored token
localStorage.getItem('token')

// Clear all storage
localStorage.clear()

// Check current auth state
// See Network tab → Headers → Authorization
```

### VS Code Extensions (Recommended)
- REST Client (for API testing)
- Thunder Client (alternative to Postman)
- MongoDB for VS Code
- Git Graph (visualize git history)

### Quick API Testing
Use REST Client extension to create an `api-test.http` file:

```http
### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "userType": "student"
}

### Login User
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Get Current User
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Performance Tips

- **Clear Node Cache**: Delete `node_modules` and reinstall if issues occur
- **Restart Servers**: Sometimes port conflicts need server restart
- **Browser Cache**: Do a hard refresh (Ctrl+Shift+R) if styles don't update
- **Network Tab**: Use DevTools Network tab to debug API calls

---

## Development Workflow

### Day-to-Day
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3 (optional): Git
git status
```

### Making Changes
1. Edit code in your editor
2. Backend: Auto-reloads with nodemon
3. Frontend: Hot-reloads with Vite
4. Test in browser at `http://localhost:5173`

### Committing Changes
```bash
git add .
git commit -m "Your message here"
git push origin main
```

---

## Production Build

When ready to deploy:

### Build Frontend
```bash
cd frontend
npm run build
# Creates 'dist' folder ready for deployment
```

### Deploy Steps
1. **Backend**: Push to GitHub → Render auto-deploys
2. **Frontend**: Push to GitHub → Netlify auto-deploys
3. See `DEPLOYMENT_CHECKLIST.md` for detailed steps

---

## Database Seeding (Optional)

To create test data:

```bash
cd backend
node seed-blogs.js  # Creates sample blogs
```

---

## Important Notes

⚠️ **Never commit `.env` file to Git!**
- It contains sensitive credentials
- Add to `.gitignore` (already done)
- Use `.env.example` for reference

⚠️ **Keep JWT_SECRET secret!**
- Use a strong, 32+ character string
- Change for each environment
- Don't share in code/comments

⚠️ **CORS_ORIGIN must match frontend URL**
- Local development: `http://localhost:5173`
- Production: Your Netlify domain
- Update when deploying

---

## Quick Reference

| Task | Command |
|------|---------|
| Install backend deps | `cd backend && npm install` |
| Install frontend deps | `cd frontend && npm install` |
| Start backend | `cd backend && npm run dev` |
| Start frontend | `cd frontend && npm run dev` |
| Build for production | `cd frontend && npm run build` |
| Test API | `curl -X POST http://localhost:5000/api/auth/login ...` |
| Check Node version | `node --version` |
| Check npm version | `npm --version` |
| Clear npm cache | `npm cache clean --force` |

---

**🎉 You're all set! Start developing.**

Questions? Check the documentation files in the root directory.

