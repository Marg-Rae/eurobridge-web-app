# Dashboard Redirect Implementation - Testing Guide

## What Was Fixed

### 1. Role-Based Redirect Logic ✅
- **File**: `src/pages/Login.jsx` and `src/pages/Register.jsx`
- **Fix**: Both components now check the returned `user.role` from the API response and redirect:
  - `role === "staff"` → `/dashboard/staff`
  - `role === "student"` → `/dashboard/student`

### 2. Enhanced ProtectedRoute Component ✅
- **File**: `src/components/ProtectedRoute.jsx`
- **Improvements**:
  - Now fetches user data from `/api/auth/me` if token exists but user not in context
  - Properly waits for user to be loaded before rendering
  - Checks role permissions against allowedRoles
  - Handles timing issues with async state updates

### 3. Dashboard Routes ✅
- **File**: `src/App.jsx`
- Routes defined:
  - `/dashboard/student` (allowedRoles: ["student"])
  - `/dashboard/staff` (allowedRoles: ["staff", "admin"])

### 4. Backend Role Format ✅
- **File**: `backend/src/models/User.js`
- Role enum: `["student", "staff", "admin"]` (lowercase)
- Backend returns role in login/register response

## Expected Flow

```
[User Logs In]
      ↓
[POST /api/auth/login] → Response: {token, user: {role: "student"}}
      ↓
[Login.jsx Checks user.role]
      ↓
[Navigate to /dashboard/student]
      ↓
[ProtectedRoute: Check token in localStorage ✓]
      ↓
[ProtectedRoute: Fetch user from /api/auth/me ✓]
      ↓
[ProtectedRoute: Check role matches ["student"] ✓]
      ↓
[StudentDashboard Renders]
```

## Testing Steps

### Test 1: Fresh Login (Student)

**Setup:**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Steps:**
1. Open browser DevTools (F12)
2. Go to http://localhost:5174/login
3. Enter credentials:
   - Email: `student@example.com`
   - Password: `password123`
4. Click "Sign In"

**Console Output Should Show:**
```
Login attempt: student@example.com
Login response: {token: "...", user: {id: "...", name: "...", email: "...", role: "student"}}
Setting auth state - Token: Present User: {id: "...", name: "...", email: "...", role: "student"}
Auth state set successfully
Login successful, redirecting - user role: student
Request interceptor - Token attached to: /api/auth/me
ProtectedRoute: Token exists but user not loaded, fetching...
ProtectedRoute: User fetched: {_id: "...", name: "...", email: "...", role: "student"}
ProtectedRoute Debug: {token: "Present", user: "... (student)", ...}
ProtectedRoute: All checks passed - rendering component
```

**Expected Result:**
- URL changes to http://localhost:5174/dashboard/student
- StudentDashboard displays with user name and "Login As: student"
- NO redirect to login

### Test 2: Fresh Login (Staff)

**Setup:** Same as Test 1

**Steps:**
1. Create a new account or use a staff account
2. Register/Login with Account Type: "Staff"

**Console Output Should Show:**
```
Login successful, redirecting - user role: staff
ProtectedRoute: User fetched: {..., role: "staff"}
ProtectedRoute Debug: {token: "Present", user: "... (staff)", checksPassed: {role: "student"} = false for /dashboard/student }
ProtectedRoute: All checks passed - rendering component
```

**Expected Result:**
- URL changes to http://localhost:5174/dashboard/staff
- StaffDashboard displays with user information
- Staff-specific content shows (Teaching Overview, Courses)

### Test 3: Page Refresh While Logged In

**Setup:** Complete Test 1 (student logged in on dashboard)

**Steps:**
1. Press F5 to refresh page while on http://localhost:5174/dashboard/student

**Console Output Should Show:**
```
AuthContext init - SavedToken: Present
Fetching current user with saved token
Fetching current user...
Request interceptor - Token attached to: /api/auth/me
Current user fetched: {..., role: "student"}
ProtectedRoute Debug: {token: "Present", user: "... (student)", ...}
ProtectedRoute: All checks passed - rendering component
```

**Expected Result:**
- Page doesn't redirect
- Stays on /dashboard/student
- Dashboard content displays with user info
- No flashing or layout shift

### Test 4: Access Wrong Dashboard

**Setup:** Student logged in on /dashboard/student

**Steps:**
1. Manually edit URL to http://localhost:5174/dashboard/staff
2. Press Enter

**Console Output Should Show:**
```
ProtectedRoute: Token exists but user not loaded, fetching...
ProtectedRoute: User fetched: {..., role: "student"}
ProtectedRoute Debug: {checksPassed: {...roleMatch: false}}
ProtectedRoute: Insufficient permissions - redirecting to home
```

**Expected Result:**
- URL redirects to / (home page)
- Dashboard is NOT displayed
- User stays logged in (can still access /dashboard/student)

### Test 5: Logout Flow

**Setup:** Student on /dashboard/student

**Steps:**
1. Click "Logout" button in dashboard header

**Console Output Should Show:**
```
Logging out...
Logout complete
```

**Expected Result:**
- Redirected to home page
- Token cleared from localStorage
- Button bar shows "Login" link instead of dashboards
- Attempting to access /dashboard/student now redirects to /login

## Troubleshooting

### Issue: "ProtectedRoute Debug shows isAuthenticated: false"
**Cause:** Token not in localStorage or AuthContext not initialized  
**Fix:** 
1. Check browser DevTools → Application → Local Storage
2. Verify "token" is stored after login
3. Check backend logs for 401 errors

### Issue: "Login response shows no role field"
**Cause:** Backend not returning role  
**Fix:**
1. Check backend auth.controller.js returns `role: user.role`
2. Verify user document in MongoDB has role field
3. Check for errors in backend console

### Issue: "Redirect happens but dashboard shows error"
**Cause:** User fetch from /api/auth/me failed  
**Fix:**
1. Check Network tab in DevTools → GET /api/auth/me
2. Verify status is 200 and response contains user data
3. Check backend logs for errors

### Issue: "ProtectedRoute Debug shows token but no user"
**Cause:** User still being fetched  
**Fix:**
1. This is temporary - wait a second and page should load
2. Check Network tab for /api/auth/me request completion
3. If it hangs, check backend is running and accessible

### Issue: "Refresh loses dashboard (redirects to login)"
**Cause:** Token expired or invalid  
**Fix:**
1. The 401 interceptor will clear token and redirect
2. User needs to login again
3. This is expected for expired tokens

## Dark Mode Testing (Optional)

Dashboards should respect the same styling as the app:

**Test:**
1. Use the language switcher to change language
2. Dashboard header should display in selected language
3. No layout breaks or style issues

## Production Deployment Testing

After deploying to Render + Netlify:

1. **Set Environment Variables:**
   - **Render**: MONGODB_URI, JWT_SECRET, CORS_ORIGIN, NODE_ENV=production
   - **Netlify**: VITE_API_BASE_URL=https://eurobridge-web-app.onrender.com

2. **Test at Production URL:**
   - Go to https://eurobridge-web-app.netlify.app/login
   - Complete login flow
   - Verify redirect to dashboard works
   - Check /api/auth/me call returns correct user

3. **Check CORS Headers:**
   - Open DevTools Network tab
   - Look for CORS-related errors in console
   - Check response headers include `Access-Control-Allow-Origin`

## Success Checklist

- [ ] Student login redirects to /dashboard/student
- [ ] Staff login redirects to /dashboard/staff  
- [ ] Dashboard displays user name and role
- [ ] Page refresh keeps user on dashboard
- [ ] Accessing wrong dashboard redirects to home
- [ ] Logout clears token and redirects to home
- [ ] Console shows proper debug logs
- [ ] No 401 errors during normal flow
- [ ] CORS errors don't appear
- [ ] Responsive design works on mobile

## Key Console Log Patterns

**✅ Successful Login:**
```
Login attempt: user@email.com
Login response: {...}
Auth state set successfully
Login successful, redirecting - user role: student
ProtectedRoute: All checks passed - rendering component
```

**✅ Successful Refresh:**
```
AuthContext init - SavedToken: Present
Fetching current user...
Current user fetched: {...}
ProtectedRoute: All checks passed - rendering component
```

**❌ Failed Access:**
```
ProtectedRoute: Not authenticated - redirecting to login
```

**❌ Insufficient Permissions:**
```
ProtectedRoute: Insufficient permissions - redirecting to home
```

## Next Steps

Once testing confirms everything works:
1. Commit your changes to git
2. Push to GitHub
3. Render and Netlify will auto-deploy
4. Test production URLs
5. Monitor for 401 or CORS errors in production
