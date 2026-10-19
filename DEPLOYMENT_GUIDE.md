# GDG GUG Deployment Guide

Complete guide to deploy gdggug.com on your server with Cloudflare.

## 🚀 Deployment Architecture

```
Internet → Cloudflare (DNS + SSL) → Your Server (Nginx) → Frontend (Port 3000) + Backend (Port 3001) + PostgreSQL
```

## 📋 Prerequisites

- Ubuntu/Debian server with sudo access
- Domain `gdggug.com` registered on Cloudflare
- Server IP address (e.g., 69.62.78.50)

## 🔧 Step 1: Install Nginx

```bash
# Update package list
sudo apt update

# Install Nginx
sudo apt install -y nginx

# Check installation
nginx -v

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 📝 Step 2: Create Nginx Configuration

Create a new Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/gdggug.com
```

Add this configuration:

```nginx
# Frontend (React)
server {
    listen 80;
    server_name gdggug.com www.gdggug.com;

    # Serve frontend static files
    root /home/techteam/gdgwork/mainSite/dist;
    index index.html;

    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/gdggug.com /etc/nginx/sites-enabled/

# Remove default site if needed
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🌐 Step 3: Configure Cloudflare DNS

1. Go to Cloudflare Dashboard → Select `gdggug.com`
2. Click on **DNS** → **Records**
3. Add/Update these records:

```
Type: A
Name: @
Content: YOUR_SERVER_IP (e.g., 69.62.78.50)
Proxy status: Proxied (orange cloud)
TTL: Auto

Type: A
Name: www
Content: YOUR_SERVER_IP (e.g., 69.62.78.50)
Proxy status: Proxied (orange cloud)
TTL: Auto
```

4. Go to **SSL/TLS** → Set to **Full** (not Full Strict yet)

## 🔒 Step 4: Setup SSL with Certbot (Optional - Cloudflare already provides SSL)

If you want end-to-end encryption:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d gdggug.com -d www.gdggug.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

**Note:** With Cloudflare proxy enabled, you get free SSL automatically. Only do this if you want Full (Strict) SSL mode.

## 🏃 Step 5: Setup Backend & Database as System Services

### Create Backend Service

```bash
sudo nano /etc/systemd/system/gdg-backend.service
```

Add:

```ini
[Unit]
Description=GDG GUG Backend Service
After=network.target postgresql.service

[Service]
Type=simple
User=techteam
WorkingDirectory=/home/techteam/gdgwork/backend
ExecStart=/usr/bin/java -jar target/backend-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/gdg-backend.log
StandardError=append:/var/log/gdg-backend-error.log

Environment="SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/gdg_db"
Environment="SPRING_DATASOURCE_USERNAME=gdg_admin"
Environment="SPRING_DATASOURCE_PASSWORD=gdg_secure_pass_2024"

[Install]
WantedBy=multi-user.target
```

### Create PostgreSQL Docker Service

```bash
sudo nano /etc/systemd/system/gdg-postgres.service
```

Add:

```ini
[Unit]
Description=GDG PostgreSQL Container
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/techteam/gdgwork
ExecStart=/usr/bin/docker compose up -d postgres
ExecStop=/usr/bin/docker compose down
User=techteam

[Install]
WantedBy=multi-user.target
```

### Enable and start services:

```bash
# Enable services
sudo systemctl enable gdg-postgres
sudo systemctl enable gdg-backend

# Start services
sudo systemctl start gdg-postgres
sleep 5
sudo systemctl start gdg-backend

# Check status
sudo systemctl status gdg-postgres
sudo systemctl status gdg-backend
```

## 🔄 Step 6: Update Backend API URL in Frontend

Before building, update the API base URL:

```bash
# Edit mainSite/src/config.ts (create if doesn't exist)
cat > /home/techteam/gdgwork/mainSite/src/config.ts << 'EOF'
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://gdggug.com/api' 
  : 'http://localhost:3001/api';
EOF
```

Update all service files to use this config:

```typescript
// Example: mainSite/src/services/eventService.ts
import { API_BASE_URL } from '../config';

const BASE_URL = `${API_BASE_URL}/events`;
```

## 📦 Step 7: Build and Deploy Frontend

```bash
cd /home/techteam/gdgwork/mainSite

# Install dependencies if needed
npm install

# Build production bundle
npm run build

# Verify build
ls -lh dist/

# Ensure Nginx has read permissions
sudo chown -R www-data:www-data dist/
sudo chmod -R 755 dist/
```

## 🧪 Step 8: Test Deployment

```bash
# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check backend
curl http://localhost:3001/api/events

# Check frontend serves
curl -I http://localhost:80
```

Visit `http://YOUR_SERVER_IP` or `http://gdggug.com` (once DNS propagates).

## 📊 Step 9: Monitor Services

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check backend logs
sudo tail -f /var/log/gdg-backend.log

# Check service status
sudo systemctl status nginx
sudo systemctl status gdg-backend
sudo systemctl status gdg-postgres

# Restart services if needed
sudo systemctl restart nginx
sudo systemctl restart gdg-backend
```

## 🔥 Step 10: Firewall Configuration

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## 🚀 Quick Deployment Script

Create a deployment script for easy updates:

```bash
cat > /home/techteam/gdgwork/deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Deploying GDG GUG..."

# Navigate to project
cd /home/techteam/gdgwork

# Stop services
echo "⏸️  Stopping services..."
sudo systemctl stop gdg-backend 2>/dev/null || true

# Pull latest code (if using git)
# git pull origin main

# Build backend
echo "🔨 Building backend..."
cd backend
./mvnw clean package -DskipTests
cd ..

# Build frontend
echo "🎨 Building frontend..."
cd mainSite
npm install
npm run build
sudo chown -R www-data:www-data dist/
sudo chmod -R 755 dist/
cd ..

# Start services
echo "▶️  Starting services..."
sudo systemctl start gdg-backend

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo "🌐 Visit https://gdggug.com"
EOF

chmod +x /home/techteam/gdgwork/deploy.sh
```

Run deployment:

```bash
cd /home/techteam/gdgwork
./deploy.sh
```

## 🎯 DNS Propagation

After configuring Cloudflare DNS, it may take 5-30 minutes for changes to propagate globally. You can check propagation status:

- https://dnschecker.org/#A/gdggug.com
- https://www.whatsmydns.net/#A/gdggug.com

## 🔐 Cloudflare Settings

### Recommended Cloudflare Settings:

1. **SSL/TLS**: Full or Full (Strict) with Certbot
2. **Speed → Optimization**:
   - Auto Minify: ✅ JavaScript, CSS, HTML
   - Brotli: ✅ Enabled
3. **Caching**:
   - Browser Cache TTL: 4 hours
   - Cache Level: Standard
4. **Security**:
   - Security Level: Medium
   - Bot Fight Mode: ✅ Enabled
5. **Network**:
   - HTTP/2: ✅ Enabled
   - HTTP/3 (with QUIC): ✅ Enabled

## 🎉 You're Live!

Your site should now be accessible at:
- https://gdggug.com
- https://www.gdggug.com

## 📝 Maintenance Commands

```bash
# View logs
sudo journalctl -u gdg-backend -f
sudo tail -f /var/log/nginx/error.log

# Restart services
sudo systemctl restart gdg-backend
sudo systemctl restart nginx

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
ps aux | grep java
ps aux | grep nginx
```

## 🆘 Troubleshooting

### Backend not starting:
```bash
# Check logs
sudo journalctl -u gdg-backend -n 50

# Check if port is in use
lsof -i :3001

# Rebuild backend
cd /home/techteam/gdgwork/backend
./mvnw clean package -DskipTests
```

### Nginx 502 Bad Gateway:
```bash
# Check if backend is running
curl http://localhost:3001/api/events

# Restart backend
sudo systemctl restart gdg-backend
```

### Database connection issues:
```bash
# Check PostgreSQL
docker ps
docker logs gdgwork-postgres-1

# Recreate database
cd /home/techteam/gdgwork
docker compose down
docker compose up -d postgres
```

---

**Need help?** Check logs first, then review this guide step by step.

