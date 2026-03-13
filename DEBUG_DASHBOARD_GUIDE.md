# Dashboard Not Showing - Debugging Guide

## Quick Diagnosis Steps

### Step 1: Check Backend is Running
```bash
# Terminal should show:
# ✅ Environment variables loaded successfully  
# ✅ JWT_SECRET is set
# ✅ MongoDB connected
# ✅ API running on port 5000
```

If you don't see these messages, the backend is not running. Start it with:
```bash
cd backend
npm run dev
```

### Step 2: Check Frontend is Running
Browser should load http://localhost:5174 without freezing.

### Step 3: Open Browser DevTools
Press **F12** to open Developer Tools

### Step 4: Check Network Tab
1. Go to Network tab
2. Clear all requests
3. Try to login
4. Look for these requests in order:
   - `POST /api/auth/login` → Should return 200 with {token, user}
   - `GET /api/auth/me` → Should return 200 with {user: {...}}

**If you see 404 or CORS errors:**
- Backend URL might be wrong
- Check `frontend/.env` has `VITE_API_BASE_URL=http://localhost:5000`
- Restart both frontend and backend dev servers

### Step 5: Check Console Tab
Look for this sequence of logs after clicking "Sign In":

```
Login attempt: (email)
Request interceptor - Token attached to: /api/auth/login
Login response: {token: "...", user: {...}}
Setting auth state - Token: Present User: {...}
Auth state set successfully
Login successful, redirecting - user role: student
Request interceptor - Token attached to: /api/auth/me
=== ProtectedRoute useEffect ===
From context - token: yes user: yes loading: false
User in context: (name) role: student
All checks passed, rendering children
```

**If logs stop after "redirecting", the dashboard component might have an error.**

### Step 6: Check for JavaScript Errors
Look for red error messages in Console tab under the logs above. Common errors:
- `Cannot read property 'name' of undefined` → user is null
- `Unexpected token` → JSON parse error
- `CORS error` → backend origin not allowed

## Issue: Gets to "Redirecting" but Then Nothing Shows

**Cause:** Dashboard component has a rendering error

**Fix:**
1. Check the red error in console
2. Often it's `Cannot read property of undefined`
3. Verify StudentDashboard.jsx uses `user?.name` not `user.name`
4. Check all properties have optional chaining: `{user?.email}`, `{user?.role}`

## Issue: "Not authenticated - redirecting to login"

**Cause:** Token not in local storage or not being read

**Debug:**
1. In Console, type: `localStorage.getItem("token")`  
2. Should return a long string (JWT token)
3. If empty or null, token not being saved

**Fix:**
- Check Login.jsx actually calls `localStorage.setItem(token, token)`
- Check AuthContext.login() returns success = true
- Verify API returned {:token, user}

## Issue: CORS Error in Console

**Error looks like:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login'
from origin 'http://localhost:5174' has been blocked by CORS policy
```

**Fix:**
1. Backend `src/app.js` has CORS config
2. Verify `CORS_ORIGIN=http://localhost:5173` in backend/.env
3. Restart backend: `npm run dev`
4. Check CORS allows origin:
   - Should see headers in Network tab response
   - Look for `Access-Control-Allow-Origin: http://localhost:5174`

## Issue: "Invalid or expired token" Error

**Cause:** JWT_SECRET doesn't match between login and auth

**Fix:**
1. Check `backend/.env` has JWT_SECRET set
2. Length must be at least 32 characters
3. Restart backend after changing
4. Delete token from browser:
   - In Console: `localStorage.removeItem("token")`
   - Login again

## Manual Testing Sequence

### Test 1: Create a Test User

**In Browser Console:**
```javascript
// Add a test user to database (if you have backend shell/mongo)
// OR use this flow instead:
```

**In Terminal (MongoDB):**
```bash
# Connect to MongoDB and run:
db.users.insertOne({
  name: "Test Student",
  email: "test@example.com",
  password: "$2a$12$...", // Already hashed with bcrypt
  role: "student",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Actually, easier: Just register a new account via the Register page first.

### Test 2: Try Login

1. Go to http://localhost:5174/login
2. Enter credentials
3. Watch console for logs
4. Watch Network tab for API calls
5. Check what error appears

## Console Logs Checklist

After login, you should see (in order):
- [ ] "Login attempt: email@example.com"
- [ ] "Request interceptor - Token attached to: /api/auth/login"
- [ ] "Login response: {token, user: {id, name, email, role}}"
- [ ] "Auth state set successfully"
- [ ] "Login successful, redirecting - user role: student"
- [ ] "Request interceptor - Token attached to: /api/auth/me"
- [ ] "=== ProtectedRoute useEffect ==="
- [ ] "From context - token: yes user: yes loading: false"
- [ ] "User in context: (name) role: student"
- [ ] "All checks passed, rendering children"

If it stops before "All checks passed", put a comment here with what line it stops at.

## Database Check

Verify the user actually exists in MongoDB:

```bash
# In MongoDB Compass or mongosh:
db.users.findOne({email: "test@example.com"})

# Should return:
{
  _id: ObjectId(...),
  name: "Test Student",
  email: "test@example.com",
  password: "$2a$12$...", // hashed
  role: "student",
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

## Component Verification

### Verify StudentDashboard exists: ✅
- File: `frontend/src/components/StudentDashboard.jsx`
- Export: `export default StudentDashboard`
- Has: useAuth(), user?.name, logout button
- Returns: JSX with className="dashboard"

### Verify StaffDashboard exists: ✅
- File: `frontend/src/components/StaffDashboard.jsx`
- Export: `export default StaffDashboard`
- Has: useAuth(), user?.name, logout button
- Returns: JSX with className="dashboard"

### Verify ProtectedRoute exists: ✅
- File: `frontend/src/components/ProtectedRoute.jsx`
- Checks: token, user, allowedRoles
- Shows: Loading component while checking
- Passes: children if all checks pass

### Verify Routes in App.jsx: ✅
- Route `/dashboard/student` with `allowedRoles={["student"]}`
- Route `/dashboard/staff` with `allowedRoles={["staff", "admin"]}`
- Both wrapped in `<ProtectedRoute>`

## Still Not Working?

Share the console logs here at the point where it stops/fails:
```
1. First few lines of console output
2. Last successful log message
3. First error message
4. screenshot of Network tab for /api/auth/me request
```

With that info, I can pinpoint exactly what's wrong.

## Production Checklist

When deploying to production (Render + Netlify):

1. **Render Dashboard ENV Vars:**
   - MONGODB_URI = (your mongo connection)
   - JWT_SECRET = (strong random string, 32+ chars)
   - CORS_ORIGIN = https://eurobridge-web-app.netlify.app
   - NODE_ENV = production

2. **Netlify Dashboard ENV Vars:**
   - VITE_API_BASE_URL = https://eurobridge-web-app.onrender.com

3. **Test Production URLs:**
   - https://eurobridge-web-app.netlify.app/login
   - Can you sign in?
   - Dashboard shows correctly?
   - Check CORS headers in Network tab

## Need More Help?

Provide:
1. Browser console full output (copy all text)
2. Network tab → POST /api/auth/login response
3. Network tab → GET /api/auth/me response
4. Any red errors in console
5. What URL shows in address bar after attempting login

That will help debug the exact issue.
