# Deployment Checklist & Quick Reference

## Pre-Deployment Verification

### Backend Checklist
- [ ] All environment variables defined in `.env`
  - [ ] `MONGODB_URI` (MongoDB Atlas connection string)
  - [ ] `JWT_SECRET` (32+ character secure string)
  - [ ] `PORT` (5000 or your preferred port)
  - [ ] `CORS_ORIGIN` (your frontend domain)
  - [ ] `NODE_ENV` (production)
- [ ] Dependencies installed: `npm install`
- [ ] No console errors on startup: `npm start`
- [ ] Database connection successful
- [ ] Authentication endpoints tested locally:
  - [ ] POST /api/auth/register
  - [ ] POST /api/auth/login
  - [ ] GET /api/auth/me
  - [ ] POST /api/auth/logout

### Frontend Checklist
- [ ] Environment variables defined in `.env`
  - [ ] `VITE_API_BASE_URL` (backend URL)
- [ ] Dependencies installed: `npm install`
- [ ] Build completes without errors: `npm run build`
- [ ] Dev server runs without errors: `npm run dev`
- [ ] Testing locally:
  - [ ] Can access `/login` and `/register`
  - [ ] Can register new account
  - [ ] Can login with existing credentials
  - [ ] Redirects to correct dashboard
  - [ ] Can logout from dashboard
  - [ ] Protected routes return to login when not authenticated

---

## Render Backend Deployment

### Step 1: Prepare GitHub Repository
```bash
# Ensure these files are properly configured
# .env should NOT be committed
# .env.example should be in repo

git add .env.example backend/
git commit -m "Add environment configuration"
git push origin main
```

### Step 2: Create Render Service

1. Visit [https://render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub account and select repository
4. Configure:
   - **Name**: `eurobridge-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

### Step 3: Set Environment Variables

In Render dashboard, go to **Environment**:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eurobridge
JWT_SECRET=your-secure-secret-key-32-chars-minimum
PORT=5000
CORS_ORIGIN=your-frontend-domain.netlify.app
NODE_ENV=production
```

### Step 4: Deploy

- Click **"Create Web Service"**
- Render automatically builds and deploys
- Monitor deployment in **Logs**
- Once deployed, copy the service URL: `https://your-service-name.onrender.com`

### Verify Backend Deployment

```bash
# Test API endpoints
curl https://your-service-name.onrender.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

---

## Netlify Frontend Deployment

### Step 1: Prepare Build

```bash
cd frontend
npm run build
# This creates a 'dist' folder
```

### Step 2: Deploy to Netlify

**Option A: Using Netlify CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option B: Using Netlify Dashboard**

1. Visit [https://netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub account
4. Select repository and branch
5. Configure Build:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Base Directory**: `frontend` (if monorepo)

### Step 3: Set Environment Variables

In Netlify dashboard, go to **Site Settings** → **Build & Deploy** → **Environment**:

```
VITE_API_BASE_URL=https://your-backend-name.onrender.com
```

### Step 4: Deploy

1. Netlify automatically builds and deploys on push
2. Or manually trigger: **Site Settings** → **Trigger Deploy**
3. Monitor build status in **Deploys**

### Verify Frontend Deployment

- Visit your Netlify domain
- Test login/register functionality
- Check browser DevTools Console for errors
- Verify token is stored in localStorage

---

## Post-Deployment Verification

### Backend Tests (via Postman or cURL)

**1. Register User**
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "userType": "student"
  }'

# Expected: 201 status with token and user data
```

**2. Login User**
```bash
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Expected: 200 status with token and user data
# Copy the token for next test
```

**3. Get Current User**
```bash
curl -X GET https://your-backend.onrender.com/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected: 200 status with user data (no password)
```

### Frontend Tests

1. **Registration Flow**
   - Go to `/register`
   - Fill form with new account details
   - Choose "Student" or "Staff"
   - Submit
   - Should redirect to `/dashboard/student` or `/dashboard/staff`

2. **Login Flow**
   - Go to `/login`
   - Enter registered credentials
   - Submit
   - Should redirect to correct dashboard

3. **Route Protection**
   - Manually delete token from localStorage (DevTools → Application)
   - Try to access `/dashboard/student`
   - Should redirect to `/login`

4. **Logout Flow**
   - From dashboard, click "Logout"
   - Should redirect to home page
   - Token should be removed from localStorage

---

## Common Issues & Solutions

### Issue: CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`
**Solution**:
1. Verify `CORS_ORIGIN` in backend `.env` matches frontend domain
2. For Netlify: `CORS_ORIGIN=your-frontend-domain.netlify.app`
3. Redeploy backend after changing CORS_ORIGIN

### Issue: Token Undefined in Requests
**Error**: `401 Unauthorized - Missing or invalid authorization token`
**Solution**:
1. Check browser DevTools → Application → localStorage
2. Verify token is stored after login
3. Clear localStorage and login again
4. Check if request includes `Authorization` header

### Issue: MongoDB Connection Fails
**Error**: `MongoNetworkError` or connection timeout
**Solution**:
1. Verify MongoDB Atlas IP Whitelist allows 0.0.0.0 (all IPs) for Render
2. Check connection string in `MONGODB_URI`
3. Ensure username/password are URL-encoded if they contain special characters
4. Test connection locally first

### Issue: Build Fails on Render
**Error**: `npm ERR!` in Render logs
**Solution**:
1. Check Render logs for specific error
2. Ensure all dependencies are in `package.json`
3. Verify Node version compatibility
4. Check for missing environment variables

### Issue: Frontend Can't Connect to Backend
**Error**: Network errors or timeouts in frontend
**Solution**:
1. Verify `VITE_API_BASE_URL` in frontend `.env`
2. Check if backend service is running on Render
3. Test backend URL directly in browser
4. Check browser DevTools → Network tab for actual request URLs

### Issue: Password Hashing Errors
**Error**: `bcrypt error` or similar
**Solution**:
1. Ensure `bcryptjs` is installed: `npm install bcryptjs`
2. Verify password is provided before hashing
3. Check `NODE_ENV` is not blocking bcrypt operations

---

## Environment Variables Summary

### Backend (.env)

| Variable | Value | Example |
|----------|-------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Token signing key (32+ chars) | `your-secret-key-here` |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Frontend domain | `your-domain.netlify.app` |
| `NODE_ENV` | Environment | `production` |

### Frontend (.env)

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_BASE_URL` | Backend URL | `https://your-backend.onrender.com` |

---

## Monitoring & Maintenance

### Render Backend Monitoring
- **Logs**: Go to service → **Logs** tab
- **Metrics**: Go to service → **Metrics** tab
- **Restart**: Go to service → **Settings** → **Restart**
- **Redeploy**: Go to service → **Deploys** → **Deploy latest**

### Netlify Frontend Monitoring
- **Logs**: Go to site → **Logs** tab
- **Deploys**: Go to site → **Deploys** tab
- **Purge Cache**: Go to site → **Deploys** → **Trigger deploy**
- **Performance**: Netlify Analytics in **Site Settings**

### Health Checks
```bash
# Check backend is running
curl https://your-backend.onrender.com/api/auth/me

# Check CORS is working
curl -H "Origin: your-frontend.netlify.app" \
     -H "Authorization: Bearer test" \
     https://your-backend.onrender.com/api/auth/me
```

---

## Scaling & Performance Tips

1. **Enable Compression**: Express already handles this with `body-parser`
2. **Database Indexing**: Add indexes to frequently queried fields (email)
3. **Caching**: Consider caching user data with Redis
4. **Load Balancing**: Render handles this automatically
5. **CDN**: Netlify serves assets from global CDN
6. **Monitoring**: Use Render and Netlify built-in monitoring

---

## Security Checklist

- [ ] `JWT_SECRET` is at least 32 characters
- [ ] `JWT_SECRET` is not exposed in code or git
- [ ] `NODE_ENV` is set to `production`
- [ ] HTTPS is enabled on both frontend and backend
- [ ] CORS is restricted to your frontend domain
- [ ] Passwords are hashed with bcrypt
- [ ] No sensitive data logged in production
- [ ] API keys and secrets are environment variables
- [ ] Regular security updates for dependencies
- [ ] HTTPS enforced on all connections

---

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas/)
- [Express.js Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Production Build](https://react.dev/learn/react-rules)

