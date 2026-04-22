# Complete Debugging Checklist for Eurobridge

## ✅ LOCAL BACKEND STATUS
- **Port 5000**: Running successfully
- **MongoDB Connection**: ✅ Connected to Atlas
- **JWT_SECRET**: ✅ Set and loaded (64 characters)
- **Blogs API**: ✅ http://localhost:5000/api/blogs returns 200 OK with 3 blog posts

---

## 🔍 PRODUCTION DEBUGGING CHECKLIST

### 1. Backend Deployment (Render)
**Domain**: https://eurobridge-web-app-2.onrender.com

**Check on Render Dashboard:**
- [ ] Go to https://dashboard.render.com
- [ ] Select **eurobridge-api** service
- [ ] Check **Deployments** tab - Is the latest deployment showing as **"Live"** (green)?
- [ ] If deploying, wait for completion
- [ ] Check **Logs** tab - Are there any errors?

**Environment Variables on Render:**
- [ ] **JWT_SECRET** = `7f384e974b9fffb7ceca86f46d36819e0647d8dc53c14322fc766ff546e331e8`
- [ ] **MONGODB_URI** = `mongodb+srv://eurobridge_db_user:2kvG03uD2mdun1Rv@eurobridgelanguageinsti.ufjkdkv.mongodb.net/?appName=EurobridgeLanguageInstitute`
- [ ] **MONGODB_DB_NAME** = `eurobridge`
- [ ] **NODE_ENV** = `production`

---

### 2. API Endpoints Testing

**Test these endpoints locally first (should all return 200):**

```bash
# Blogs endpoint
curl http://localhost:5000/api/blogs

# Single blog
curl http://localhost:5000/api/blogs/ausbildung-germany-complete-guide

# Health check (basic)
curl -I http://localhost:5000/
```

**Once production is up, test these:**
```bash
# Test blogs on production
https://eurobridge-web-app-2.onrender.com/api/blogs

# Test single blog
https://eurobridge-web-app-2.onrender.com/api/blogs/ausbildung-germany-complete-guide
```

---

### 3. Frontend Deployment (Netlify)

**Check:**
- [ ] Frontend deployed on Netlify? (https://eurobridge-web-app.netlify.app or your custom domain)
- [ ] Is the site loading?
- [ ] Open browser DevTools → Console tab - any errors?
- [ ] Open Network tab - is `/api/blogs` call going to the correct backend?

**Frontend API URL:**
- [x] Should auto-detect production URL: `https://eurobridge-web-app-2.onrender.com`
- [x] Or use localhost:5000 in development

---

### 4. Feature Testing Checklist

#### **Blogs Page** ✅ LOCAL
- [ ] Home page loads
- [ ] "Explore Blogs" section shows 3 blog cards
- [ ] Click "Read More" → goes to individual blog page
- [ ] Individual blog page displays full content

#### **Applications** 
- [ ] Home page "Apply Now" button works
- [ ] Application form loads at `/apply`
- [ ] Submit application form
- [ ] Success message appears: "✓ Application Submitted"
- [ ] Message says: "Application submitted successfully! We'll contact you soon."

#### **Authentication**
- [ ] Register page loads (`/register`)
- [ ] Can create a new account
- [ ] Login page loads (`/login`)
- [ ] Can login with created account
- [ ] Redirects to appropriate dashboard (student/staff)
- [ ] Logout button works

#### **Courses/Academics**
- [ ] Academics page loads (`/academics`)
- [ ] Courses display correctly
- [ ] Navigation works

---

## 🐛 Common Issues & Solutions

### Issue 1: Render Backend Not Responding
**Symptoms**: Timeout when accessing `https://eurobridge-web-app-2.onrender.com/api/blogs`

**Solutions:**
1. Check if deployment shows "Live" on Render dashboard
2. Check logs for errors (JWT_SECRET missing, etc.)
3. Wait 2-3 minutes for cold start (free tier takes time)
4. Click **Redeploy Latest Commit** in Render Settings
5. Verify environment variables are saved

### Issue 2: Blogs Not Loading on Domain
**Symptoms**: Frontend loads but blogs section is empty

**Solutions:**
1. Open DevTools → Network tab on the domain
2. Check if `/api/blogs` request is failing
3. Check response status code
4. If 500 error - check Render logs for MongoDB error
5. If connection refused - backend might not be running

### Issue 3: CORS Errors
**Symptoms**: Console shows "CORS policy blocked request"

**Solutions:**
1. Check `backend/src/app.js` CORS whitelist includes your domain
2. Already includes: `https://eurobridge-web-app.netlify.app`
3. Add production domain if needed

---

## 🚀 Deployment Workflow

### Local Testing (✅ COMPLETE)
1. Backend running on `http://localhost:5000` ✅
2. MongoDB connected ✅
3. Blogs seeded ✅
4. Frontend should connect to local backend in dev mode

### Production Deployment
1. **Frontend (Netlify)**
   - Deploy to netlify.toml config
   - Auto-detects `https://eurobridge-web-app-2.onrender.com` on production

2. **Backend (Render)**
   - All environment variables set
   - Latest commit deployed
   - Logs should show "✅ MongoDB connected" and "API running on port 10000"

---

## ✅ Testing Checklist (Priority Order)

### HIGH PRIORITY
- [ ] Render backend deployment shows "Live"
- [ ] Render logs show no errors
- [ ] `https://eurobridge-web-app-2.onrender.com/api/blogs` returns data
- [ ] Frontend home page loads
- [ ] Blog section appears with blog cards

### MEDIUM PRIORITY
- [ ] Individual blog pages work
- [ ] Application form submits successfully
- [ ] Success message appears after application
- [ ] Database connection works in production

### LOW PRIORITY
- [ ] Authentication works end-to-end
- [ ] Dashboards load correctly
- [ ] All routes accessible

---

## 📊 Current Status Summary

| Component | Status | Location |
|-----------|--------|----------|
| Local Backend | ✅ Running | http://localhost:5000 |
| MongoDB Atlas | ✅ Connected | eurobridgelanguageinsti cluster |
| Blogs (Local) | ✅ 3 posts seeded | Database has data |
| Frontend Code | ✅ Fixed for production | Committed to git |
| Render Deployment | ⏳ Needs verification | https://eurobridge-web-app-2.onrender.com |
| Netlify Frontend | ⏳ Needs verification | eurobridge-web-app.netlify.app |

---

## 🔗 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Netlify Dashboard**: https://app.netlify.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Local Backend**: http://localhost:5000
- **Production Domain**: https://eurobridge-web-app-2.onrender.com
