# Authentication Flow Testing Guide

## Quick Testing Steps

### 1. Start the Backend
```bash
cd backend
npm run dev
```
Expected: Server should start on port 5000 without errors

### 2. Start the Frontend  
```bash
cd frontend
npm run dev
```
Expected: App opens on http://localhost:5174

### 3. Test Registration Flow
1. Go to http://localhost:5174/register
2. Fill in form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Account Type: `Student`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Register"

**Expected Result:**
- Should see console logs in browser DevTools
- Should be redirected to `/dashboard/student`
- Dashboard should display user name and email
- Should see "student" role badge

**If it fails:**
- Check browser console (F12) for error messages
- Look for "ProtectedRoute Debug" logs
- Check if "Auth state set from registration" appears in console

### 4. Test Login Flow
1. Click "Logout" button on dashboard
2. Navigate to http://localhost:5174/login
3. Fill in form:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign In"

**Expected Result:**
- Should see "Login attempt" in console
- Should see "Login response" with token and user data
- Should see "Setting auth state"
- Should be redirected to `/dashboard/student`
- Dashboard should show the same user information

**If it fails:**
- Check backend logs for errors
- Verify MONGODB_URI is correct
- Check if user was actually created in database

### 5. Test Page Refresh
1. On the dashboard, press F5 to refresh
2. Page should reload and stay on dashboard

**Expected Result:**
- Loading should briefly show
- AuthContext should fetch current user from API
- Dashboard should display user data
- No redirect to login

**If it fails:**
- Check browser console for 401 errors
- Verify token is in localStorage (F12 → Application → Local Storage)
- Check backend logs

### 6. Test Protected Routes
1. Without logging out, navigate to http://localhost:5174/dashboard/staff
2. Should be redirected to home (insufficient permissions)

**Expected Result:**
- Should redirect away from /dashboard/staff
- Should see "Role check failed" in console

### 7. Test Logout
1. Click "Logout" button
2. Should redirect to home page
3. Token should be cleared from localStorage

**Expected Result:**
- localStorage should not contain "token"
- Attempting to access dashboard should redirect to login

## Console Logs to Look For

### Successful Login Flow
```
AuthContext init - SavedToken: Missing
Login attempt: test@example.com
Login response: {token: "...", user: {id: "...", name: "Test User", email: "test@example.com", role: "student"}}
Setting auth state - Token: Present User: {...}
Auth state set successfully
Login successful, redirecting - user role: student
Request interceptor - Token attached to: /api/auth/me
Current user fetched: {_id: "...", name: "Test User", ...}
ProtectedRoute Debug: {..., isAuthenticated: true, user: {..., role: "student"}}
```

### Successful Page Refresh
```
AuthContext init - SavedToken: Present
Fetching current user with saved token
Fetching current user...
Request interceptor - Token attached to: /api/auth/me
Current user fetched: {_id: "...", name: "Test User", ...}
```

## Database Verification

### Check if User Was Created
```bash
# Connect to MongoDB (paste MONGODB_URI from backend/.env)
# Run this in MongoDB Compass or mongosh:
db.users.findOne({email: "test@example.com"})
```

Expected output should show user document with:
- name: "Test User"
- email: "test@example.com"
- role: "student"
- password: (hashed value, not plain text)
- createdAt: ISO date
- updatedAt: ISO date

## Troubleshooting

### Issue: "Cannot POST /api/auth/register"
- Backend not running or wrong port
- API URL in frontend .env is incorrect
- Check backend logs for errors

### Issue: "Invalid or expired token"
- Token might be malformed
- JWT_SECRET might not be set correctly
- Check backend logs for JWT errors

### Issue: ProtectedRoute redirects to login
- Token might not be in localStorage
- User fetch from /api/auth/me might have failed
- Check broker dev console for 401 errors

### Issue: Dashboard displays but no user data
- User object might be incomplete
- Check what user object is returned from login API
- Verify database has user document

## Network Debugging

Use browser DevTools Network tab:

1. Go to Network tab (F12 → Network)
2. Clear existing requests
3. Register/Login
4. Check these requests:
   - POST /api/auth/register → Status 201
   - POST /api/auth/login → Status 200
   - GET /api/auth/me → Status 200

Expected responses:
- Register/Login: `{token: "...", user: {...}}`
- Me: `{user: {...}}`

## Production Testing

After deploying to Render + Netlify:

1. Set environment variables in both Render and Netlify dashboards
2. Test at https://eurobridge-web-app.netlify.app
3. Check that frontend uses correct API_URL (should be Render backend)
4. CORS errors indicate misconfigured origins
