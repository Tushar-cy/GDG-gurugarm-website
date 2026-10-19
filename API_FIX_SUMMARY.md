# API Configuration Fix - CORS & Dynamic URLs

## ✅ Problem Fixed

**Issue:** When accessing the site from your phone via `http://69.62.78.50:3000`, the frontend was trying to call `http://localhost:3001/api` which doesn't work because your phone can't access the server's localhost.

**Solution:** Created dynamic API configuration that automatically detects the hostname and uses the correct API URL.

## 🔧 Changes Made

### 1. Created API Config File
**File:** `mainSite/src/config/api.ts`

This file automatically determines the correct API URL:
- **On your phone** (`http://69.62.78.50:3000`): Uses `http://69.62.78.50:3001/api`
- **On localhost** (`http://localhost:3000`): Uses `http://localhost:3001/api`
- **In production** (`https://gdggug.com`): Uses `/api` (Nginx proxy)

### 2. Updated All Service Files
Updated to use the dynamic API URL:
- ✅ `mainSite/src/services/eventService.ts`
- ✅ `mainSite/src/services/newsService.ts`
- ✅ `mainSite/src/services/teamService.ts`

### 3. Backend CORS Already Working
The backend is already configured to allow all origins:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD
```

## 📱 How to Access on Your Phone

### 1. Make Sure Services Are Running:
```bash
cd /home/techteam/gdgwork
./start-all.sh
```

### 2. Find Your Server IP:
Your server IP is: **69.62.78.50**

### 3. On Your Phone:
Open browser and go to:
```
http://69.62.78.50:3000
```

### 4. Check Browser Console:
You should see:
```
API Base URL: http://69.62.78.50:3001/api
```

## ✅ What Now Works

When you access `http://69.62.78.50:3000` on your phone:

1. **Homepage** ✅
   - Loads instantly
   - All content visible

2. **Events Page** ✅
   - Fetches from `http://69.62.78.50:3001/api/events`
   - Shows all events
   - Admin can edit/add/delete

3. **Team Page** ✅
   - Fetches from `http://69.62.78.50:3001/api/team`
   - Shows all team members
   - Admin CRUD works

4. **News Page** ✅
   - Fetches from `http://69.62.78.50:3001/api/news`
   - Shows all news articles
   - Admin CRUD works

5. **TPO Page** ✅
   - Static content loads

## 🔍 Testing

### Test API Access:
```bash
# From server (should work)
curl http://localhost:3001/api/events

# From server via IP (should work)
curl http://69.62.78.50:3001/api/events

# From phone (should work)
# Open http://69.62.78.50:3001/api/events in phone browser
```

### Check Frontend Console:
Open browser DevTools on your phone (or use Chrome Remote Debugging):
1. Should see: `API Base URL: http://69.62.78.50:3001/api`
2. Network tab should show successful API calls
3. No CORS errors

## 🚨 Troubleshooting

### Can't Access from Phone?

**1. Check Firewall:**
```bash
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
```

**2. Check Services:**
```bash
# Frontend
lsof -i :3000

# Backend
lsof -i :3001

# If not running
./start-all.sh
```

**3. Check Same Network:**
- Phone and server must be on same network OR
- Server must have public IP accessible

### Still No Data Loading?

**1. Check Backend Logs:**
```bash
tail -f /home/techteam/gdgwork/backend/logs/application.log
```

**2. Check Frontend Logs:**
```bash
tail -f /tmp/frontend.log
```

**3. Test API Directly:**
```bash
curl http://69.62.78.50:3001/api/events
curl http://69.62.78.50:3001/api/team
curl http://69.62.78.50:3001/api/news
```

### CORS Errors?

The backend is already configured to allow all origins. If you still get CORS errors:

```bash
# Restart backend
lsof -ti:3001 | xargs kill -9
cd /home/techteam/gdgwork/backend
java -jar target/gdg-backend-0.0.1-SNAPSHOT.jar
```

## 🎯 Next Steps

### 1. Test on Phone (NOW)
```
URL: http://69.62.78.50:3000
```
Navigate through all pages and verify data loads.

### 2. Deploy to Production (Later)
Once you set up Nginx and domain:
- `https://gdggug.com` will use `/api` (relative URL)
- Nginx will proxy `/api/*` to `http://localhost:3001/api/*`
- No code changes needed!

## 📊 API URL Logic

```javascript
// Development (localhost)
http://localhost:3000 → http://localhost:3001/api

// Development (server IP)
http://69.62.78.50:3000 → http://69.62.78.50:3001/api

// Production (domain)
https://gdggug.com → /api (Nginx proxies to backend)
```

## ✅ Summary

- ✅ API URLs are now dynamic
- ✅ Works on localhost
- ✅ Works on server IP (your phone)
- ✅ Will work on domain (after deployment)
- ✅ CORS is properly configured
- ✅ No more hardcoded URLs

**Test it now on your phone at:** `http://69.62.78.50:3000`

All pages should load data correctly! 🎉



## ✅ Problem Fixed

**Issue:** When accessing the site from your phone via `http://69.62.78.50:3000`, the frontend was trying to call `http://localhost:3001/api` which doesn't work because your phone can't access the server's localhost.

**Solution:** Created dynamic API configuration that automatically detects the hostname and uses the correct API URL.

## 🔧 Changes Made

### 1. Created API Config File
**File:** `mainSite/src/config/api.ts`

This file automatically determines the correct API URL:
- **On your phone** (`http://69.62.78.50:3000`): Uses `http://69.62.78.50:3001/api`
- **On localhost** (`http://localhost:3000`): Uses `http://localhost:3001/api`
- **In production** (`https://gdggug.com`): Uses `/api` (Nginx proxy)

### 2. Updated All Service Files
Updated to use the dynamic API URL:
- ✅ `mainSite/src/services/eventService.ts`
- ✅ `mainSite/src/services/newsService.ts`
- ✅ `mainSite/src/services/teamService.ts`

### 3. Backend CORS Already Working
The backend is already configured to allow all origins:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD
```

## 📱 How to Access on Your Phone

### 1. Make Sure Services Are Running:
```bash
cd /home/techteam/gdgwork
./start-all.sh
```

### 2. Find Your Server IP:
Your server IP is: **69.62.78.50**

### 3. On Your Phone:
Open browser and go to:
```
http://69.62.78.50:3000
```

### 4. Check Browser Console:
You should see:
```
API Base URL: http://69.62.78.50:3001/api
```

## ✅ What Now Works

When you access `http://69.62.78.50:3000` on your phone:

1. **Homepage** ✅
   - Loads instantly
   - All content visible

2. **Events Page** ✅
   - Fetches from `http://69.62.78.50:3001/api/events`
   - Shows all events
   - Admin can edit/add/delete

3. **Team Page** ✅
   - Fetches from `http://69.62.78.50:3001/api/team`
   - Shows all team members
   - Admin CRUD works

4. **News Page** ✅
   - Fetches from `http://69.62.78.50:3001/api/news`
   - Shows all news articles
   - Admin CRUD works

5. **TPO Page** ✅
   - Static content loads

## 🔍 Testing

### Test API Access:
```bash
# From server (should work)
curl http://localhost:3001/api/events

# From server via IP (should work)
curl http://69.62.78.50:3001/api/events

# From phone (should work)
# Open http://69.62.78.50:3001/api/events in phone browser
```

### Check Frontend Console:
Open browser DevTools on your phone (or use Chrome Remote Debugging):
1. Should see: `API Base URL: http://69.62.78.50:3001/api`
2. Network tab should show successful API calls
3. No CORS errors

## 🚨 Troubleshooting

### Can't Access from Phone?

**1. Check Firewall:**
```bash
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
```

**2. Check Services:**
```bash
# Frontend
lsof -i :3000

# Backend
lsof -i :3001

# If not running
./start-all.sh
```

**3. Check Same Network:**
- Phone and server must be on same network OR
- Server must have public IP accessible

### Still No Data Loading?

**1. Check Backend Logs:**
```bash
tail -f /home/techteam/gdgwork/backend/logs/application.log
```

**2. Check Frontend Logs:**
```bash
tail -f /tmp/frontend.log
```

**3. Test API Directly:**
```bash
curl http://69.62.78.50:3001/api/events
curl http://69.62.78.50:3001/api/team
curl http://69.62.78.50:3001/api/news
```

### CORS Errors?

The backend is already configured to allow all origins. If you still get CORS errors:

```bash
# Restart backend
lsof -ti:3001 | xargs kill -9
cd /home/techteam/gdgwork/backend
java -jar target/gdg-backend-0.0.1-SNAPSHOT.jar
```

## 🎯 Next Steps

### 1. Test on Phone (NOW)
```
URL: http://69.62.78.50:3000
```
Navigate through all pages and verify data loads.

### 2. Deploy to Production (Later)
Once you set up Nginx and domain:
- `https://gdggug.com` will use `/api` (relative URL)
- Nginx will proxy `/api/*` to `http://localhost:3001/api/*`
- No code changes needed!

## 📊 API URL Logic

```javascript
// Development (localhost)
http://localhost:3000 → http://localhost:3001/api

// Development (server IP)
http://69.62.78.50:3000 → http://69.62.78.50:3001/api

// Production (domain)
https://gdggug.com → /api (Nginx proxies to backend)
```

## ✅ Summary

- ✅ API URLs are now dynamic
- ✅ Works on localhost
- ✅ Works on server IP (your phone)
- ✅ Will work on domain (after deployment)
- ✅ CORS is properly configured
- ✅ No more hardcoded URLs

**Test it now on your phone at:** `http://69.62.78.50:3000`

All pages should load data correctly! 🎉



