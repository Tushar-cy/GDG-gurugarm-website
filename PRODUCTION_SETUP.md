# GDG GUG - Production Deployment Guide

## 🚀 Production Status: LIVE

### Services Running:
- ✅ **Backend**: Systemd service on port 3001
- ✅ **Frontend**: Nginx serving static files on port 80
- ✅ **Database**: PostgreSQL (Docker container)
- ✅ **API Proxy**: Nginx proxying `/api` to backend

---

## 📁 File Locations

### Frontend (Production Build):
- **Source**: `/home/techteam/gdgwork/mainSite`
- **Build**: `/home/techteam/gdgwork/mainSite/dist`
- **URL**: `http://gdggug.com` (or `http://YOUR_SERVER_IP`)

### Backend:
- **Source**: `/home/techteam/gdgwork/backend`
- **Service**: `/etc/systemd/system/gdg-backend.service`
- **Logs**: `/var/log/gdg-backend.log` and `/var/log/gdg-backend-error.log`

### Nginx:
- **Config**: `/etc/nginx/sites-available/gdggug`
- **Enabled**: `/etc/nginx/sites-enabled/gdggug`
- **Logs**: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`

### Database Backups:
- **Directory**: `/home/techteam/gdgwork/backups`
- **Backup Script**: `/home/techteam/gdgwork/backup-db.sh`
- **Restore Script**: `/home/techteam/gdgwork/restore-db.sh`

---

## 🛠️ Common Commands

### Backend Service:
```bash
# Start backend
sudo systemctl start gdg-backend

# Stop backend
sudo systemctl stop gdg-backend

# Restart backend
sudo systemctl restart gdg-backend

# View backend status
sudo systemctl status gdg-backend

# View backend logs (live)
sudo tail -f /var/log/gdg-backend.log

# View backend errors
sudo tail -f /var/log/gdg-backend-error.log
```

### Frontend (Nginx):
```bash
# Restart nginx
sudo systemctl restart nginx

# Reload nginx (without downtime)
sudo systemctl reload nginx

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Test nginx config
sudo nginx -t
```

### Database:
```bash
# Backup database
cd /home/techteam/gdgwork
./backup-db.sh

# List backups
ls -lh /home/techteam/gdgwork/backups/

# Restore database (interactive)
./restore-db.sh gdg_db_backup_YYYYMMDD_HHMMSS.sql
```

### PostgreSQL Container:
```bash
# Check status
docker ps | grep gdg-postgres

# Access psql
docker exec -it gdg-postgres psql -U postgres gdg_db

# View databases
docker exec gdg-postgres psql -U postgres -c "\l"
```

---

## 🔄 Deploy New Changes

### Frontend:
```bash
cd /home/techteam/gdgwork/mainSite

# Pull latest changes
git pull

# Build production
npm run build

# Fix permissions
sudo chmod -R 755 dist
sudo chown -R www-data:www-data dist

# Reload nginx
sudo systemctl reload nginx
```

### Backend:
```bash
cd /home/techteam/gdgwork/backend

# Pull latest changes
git pull

# Restart service (Maven will recompile)
sudo systemctl restart gdg-backend

# Wait for startup
sleep 15

# Check status
sudo systemctl status gdg-backend
```

---

## 💾 Database Management

### Auto Backup (Cron - Recommended):
```bash
# Add to crontab (daily at 2 AM)
sudo crontab -e

# Add this line:
0 2 * * * /home/techteam/gdgwork/backup-db.sh > /dev/null 2>&1
```

### Manual Backup:
```bash
./backup-db.sh
```

### Restore from Backup:
```bash
# List available backups
ls -lh backups/

# Restore (will prompt for confirmation)
./restore-db.sh gdg_db_backup_20251006_095000.sql

# Restart backend after restore
sudo systemctl restart gdg-backend
```

---

## 🌐 Domain Setup (Cloudflare)

### DNS Records to Add:
1. **A Record**:
   - Name: `@` (root domain)
   - Value: `YOUR_SERVER_IP`
   - Proxy: ✅ Enabled

2. **A Record** (www):
   - Name: `www`
   - Value: `YOUR_SERVER_IP`
   - Proxy: ✅ Enabled

### SSL/TLS Settings:
- Mode: **Full (strict)** or **Flexible**
- Auto HTTPS Rewrites: ✅ Enabled
- Always Use HTTPS: ✅ Enabled

### Nginx SSL (After Cloudflare setup):
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d gdggug.com -d www.gdggug.com

# Auto-renewal (already enabled by certbot)
```

---

## 🚨 Troubleshooting

### Site Not Loading:
```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx config
sudo nginx -t

# Check permissions
ls -la /home/techteam/gdgwork/mainSite/dist

# Fix permissions if needed
sudo chmod +x /home/techteam /home/techteam/gdgwork /home/techteam/gdgwork/mainSite
sudo chmod -R 755 /home/techteam/gdgwork/mainSite/dist
sudo chown -R www-data:www-data /home/techteam/gdgwork/mainSite/dist
```

### Backend Not Responding:
```bash
# Check backend service
sudo systemctl status gdg-backend

# View recent errors
sudo tail -30 /var/log/gdg-backend-error.log

# Restart backend
sudo systemctl restart gdg-backend

# Test backend directly
curl http://localhost:3001/api/events
```

### Database Issues:
```bash
# Check PostgreSQL container
docker ps | grep gdg-postgres

# If container stopped, start it
docker start gdg-postgres

# Check database exists
docker exec gdg-postgres psql -U postgres -c "\l" | grep gdg_db

# If database missing, restore from backup
./restore-db.sh LATEST_BACKUP_FILE.sql
```

### API Not Working Through Nginx:
```bash
# Test backend directly
curl http://localhost:3001/api/events

# Test through nginx
curl http://localhost/api/events

# If backend works but nginx doesn't, check nginx config
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📊 Monitoring

### Check Service Status:
```bash
# All services
sudo systemctl status gdg-backend nginx

# Backend resource usage
ps aux | grep java | grep backend

# Nginx connections
sudo netstat -tuln | grep :80
```

### View Logs:
```bash
# Backend (last 50 lines)
sudo tail -50 /var/log/gdg-backend.log

# Nginx access log
sudo tail -50 /var/log/nginx/access.log

# Nginx error log
sudo tail -50 /var/log/nginx/error.log
```

---

## 🔒 Security Notes

1. **Database**: Currently accessible only to localhost
2. **Backend**: Running as root (consider changing to dedicated user)
3. **Frontend**: Served by nginx (www-data user)
4. **Firewall**: Ensure only ports 80, 443, and 22 (SSH) are open
5. **Backups**: Stored locally (consider offsite backups)

---

## 📞 Quick Reference

- **Site URL**: http://gdggug.com (http://YOUR_SERVER_IP)
- **Admin Login**: http://gdggug.com/admin/login
- **Admin Credentials**: admin@gdg.com / admin123 (⚠️ CHANGE IN PRODUCTION!)
- **Backend Port**: 3001 (localhost only)
- **Frontend Port**: 80 (public via Nginx)
- **Database Port**: 5432 (localhost only)
- **pgAdmin**: http://YOUR_SERVER_IP:5050

---

## ✅ Deployment Checklist

- [x] Frontend built for production
- [x] Backend running as systemd service
- [x] Nginx serving frontend + proxying backend
- [x] Database backup system in place
- [x] Permissions configured correctly
- [ ] Domain DNS configured in Cloudflare
- [ ] SSL certificate installed (after DNS)
- [ ] Admin password changed
- [ ] Firewall configured
- [ ] Auto-backup cron job added

---

**Last Updated**: October 6, 2025
**Deployed By**: AI Assistant
**Status**: ✅ PRODUCTION READY

