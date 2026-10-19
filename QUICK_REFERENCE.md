# Quick Reference - GDG GUG Website

## 🚀 Development Commands

```bash
# Start all services (PostgreSQL + Backend + Frontend)
cd /home/techteam/gdgwork
./start-all.sh

# Stop all services
./stop-all.sh

# Start only frontend
cd mainSite
npm run dev

# Start only backend
cd backend
java -jar target/gdg-backend-0.0.1-SNAPSHOT.jar

# Build for production
cd mainSite
npm run build
```

## 🌐 Access URLs

### Development:
- **Frontend:** http://localhost:3000 or http://69.62.78.50:3000
- **Backend API:** http://localhost:3001/api or http://69.62.78.50:3001/api
- **Admin Login:** http://localhost:3000/admin/login

### Production (after deployment):
- **Website:** https://gdggug.com
- **API:** https://gdggug.com/api
- **Admin:** https://gdggug.com/admin/login

## 📱 Testing on Phone

1. **Make sure backend and frontend are running:**
   ```bash
   ./start-all.sh
   ```

2. **On your phone, visit:**
   ```
   http://69.62.78.50:3000
   ```

3. **If can't access:**
   - Check firewall: `sudo ufw allow 3000/tcp`
   - Check if services running: `lsof -i :3000`

## 🔑 Admin Credentials

```
Email: admin@gdggug.com
Password: admin123
```

## 📦 Bundle Sizes (Optimized)

```
Initial Load:  ~80 KB (gzipped)
Home page:     +19 KB
Events page:   +31 KB
Team page:     +31 KB
News page:     +34 KB
TPO page:      +25 KB
```

## ⚡ Performance Features

### Enabled:
- ✅ Lazy loading (pages & images)
- ✅ Code splitting
- ✅ Mobile CSS optimizations
- ✅ Device-based adjustments

### On Desktop:
- ✅ Smooth scrolling (Lenis)
- ✅ Full animations
- ✅ Blur effects

### On Mobile:
- ✅ Native scroll
- ✅ Reduced animations
- ✅ Simplified effects
- ✅ Smaller text/spacing

## 🛠️ Troubleshooting

### Frontend not loading:
```bash
# Check if running
lsof -i :3000

# Restart
cd mainSite && npm run dev
```

### Backend not responding:
```bash
# Check if running
lsof -i :3001

# Check logs
tail -f backend/logs/application.log

# Restart
cd backend && java -jar target/gdg-backend-0.0.1-SNAPSHOT.jar
```

### Database issues:
```bash
# Check PostgreSQL
docker ps

# Restart PostgreSQL
docker compose up -d postgres
```

### Can't access from phone:
```bash
# Check firewall
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp

# Check services
./start-all.sh
```

## 📚 Documentation Files

- **`DEPLOYMENT_GUIDE.md`** - Full deployment guide with Nginx
- **`PERFORMANCE_OPTIMIZATIONS.md`** - Detailed optimization docs
- **`MOBILE_OPTIMIZATION_SUMMARY.md`** - Mobile optimization summary
- **`BACKEND_NETWORK_CONFIG.md`** - Backend network setup
- **`QUICK_REFERENCE.md`** - This file

## 🔧 Common Tasks

### Add new page:
1. Create in `mainSite/src/pages/NewPage.tsx`
2. Add lazy import in `App.tsx`
3. Add route in `<Routes>`
4. Add to `MobileDock.tsx` if needed

### Add new API endpoint:
1. Create controller in `backend/src/main/java/com/gdg/backend/controller/`
2. Create service in `backend/src/main/java/com/gdg/backend/service/`
3. Rebuild: `mvn clean package -DskipTests`

### Update styling:
- Main styles: `mainSite/src/index.css`
- Mobile optimizations: `mainSite/src/styles/mobile-optimizations.css`
- Tailwind config: `mainSite/tailwind.config.js`

## 🚀 Deployment

Follow `DEPLOYMENT_GUIDE.md` for complete steps:
1. Install Nginx
2. Configure Nginx
3. Setup Cloudflare DNS
4. Build frontend
5. Setup systemd services
6. Go live!

## 📊 Performance Monitoring

```bash
# Build analysis
cd mainSite
npm run build

# Check bundle sizes in output

# Lighthouse audit (after deployment)
lighthouse https://gdggug.com --view
```

## 🆘 Emergency Commands

```bash
# Kill everything on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Fresh restart
./stop-all.sh
sleep 2
./start-all.sh

# Check logs
tail -f /tmp/gdg-startup.log
tail -f backend/logs/application.log
tail -f /tmp/frontend.log
```

---

**For detailed information, see the full documentation files in the project root.**



## 🚀 Development Commands

```bash
# Start all services (PostgreSQL + Backend + Frontend)
cd /home/techteam/gdgwork
./start-all.sh

# Stop all services
./stop-all.sh

# Start only frontend
cd mainSite
npm run dev

# Start only backend
cd backend
java -jar target/gdg-backend-0.0.1-SNAPSHOT.jar

# Build for production
cd mainSite
npm run build
```

## 🌐 Access URLs

### Development:
- **Frontend:** http://localhost:3000 or http://69.62.78.50:3000
- **Backend API:** http://localhost:3001/api or http://69.62.78.50:3001/api
- **Admin Login:** http://localhost:3000/admin/login

### Production (after deployment):
- **Website:** https://gdggug.com
- **API:** https://gdggug.com/api
- **Admin:** https://gdggug.com/admin/login

## 📱 Testing on Phone

1. **Make sure backend and frontend are running:**
   ```bash
   ./start-all.sh
   ```

2. **On your phone, visit:**
   ```
   http://69.62.78.50:3000
   ```

3. **If can't access:**
   - Check firewall: `sudo ufw allow 3000/tcp`
   - Check if services running: `lsof -i :3000`

## 🔑 Admin Credentials

```
Email: admin@gdggug.com
Password: admin123
```

## 📦 Bundle Sizes (Optimized)

```
Initial Load:  ~80 KB (gzipped)
Home page:     +19 KB
Events page:   +31 KB
Team page:     +31 KB
News page:     +34 KB
TPO page:      +25 KB
```

## ⚡ Performance Features

### Enabled:
- ✅ Lazy loading (pages & images)
- ✅ Code splitting
- ✅ Mobile CSS optimizations
- ✅ Device-based adjustments

### On Desktop:
- ✅ Smooth scrolling (Lenis)
- ✅ Full animations
- ✅ Blur effects

### On Mobile:
- ✅ Native scroll
- ✅ Reduced animations
- ✅ Simplified effects
- ✅ Smaller text/spacing

## 🛠️ Troubleshooting

### Frontend not loading:
```bash
# Check if running
lsof -i :3000

# Restart
cd mainSite && npm run dev
```

### Backend not responding:
```bash
# Check if running
lsof -i :3001

# Check logs
tail -f backend/logs/application.log

# Restart
cd backend && java -jar target/gdg-backend-0.0.1-SNAPSHOT.jar
```

### Database issues:
```bash
# Check PostgreSQL
docker ps

# Restart PostgreSQL
docker compose up -d postgres
```

### Can't access from phone:
```bash
# Check firewall
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp

# Check services
./start-all.sh
```

## 📚 Documentation Files

- **`DEPLOYMENT_GUIDE.md`** - Full deployment guide with Nginx
- **`PERFORMANCE_OPTIMIZATIONS.md`** - Detailed optimization docs
- **`MOBILE_OPTIMIZATION_SUMMARY.md`** - Mobile optimization summary
- **`BACKEND_NETWORK_CONFIG.md`** - Backend network setup
- **`QUICK_REFERENCE.md`** - This file

## 🔧 Common Tasks

### Add new page:
1. Create in `mainSite/src/pages/NewPage.tsx`
2. Add lazy import in `App.tsx`
3. Add route in `<Routes>`
4. Add to `MobileDock.tsx` if needed

### Add new API endpoint:
1. Create controller in `backend/src/main/java/com/gdg/backend/controller/`
2. Create service in `backend/src/main/java/com/gdg/backend/service/`
3. Rebuild: `mvn clean package -DskipTests`

### Update styling:
- Main styles: `mainSite/src/index.css`
- Mobile optimizations: `mainSite/src/styles/mobile-optimizations.css`
- Tailwind config: `mainSite/tailwind.config.js`

## 🚀 Deployment

Follow `DEPLOYMENT_GUIDE.md` for complete steps:
1. Install Nginx
2. Configure Nginx
3. Setup Cloudflare DNS
4. Build frontend
5. Setup systemd services
6. Go live!

## 📊 Performance Monitoring

```bash
# Build analysis
cd mainSite
npm run build

# Check bundle sizes in output

# Lighthouse audit (after deployment)
lighthouse https://gdggug.com --view
```

## 🆘 Emergency Commands

```bash
# Kill everything on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Fresh restart
./stop-all.sh
sleep 2
./start-all.sh

# Check logs
tail -f /tmp/gdg-startup.log
tail -f backend/logs/application.log
tail -f /tmp/frontend.log
```

---

**For detailed information, see the full documentation files in the project root.**



