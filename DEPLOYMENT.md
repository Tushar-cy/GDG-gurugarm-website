# 🚀 GDG Project Deployment Guide

This guide covers deploying the complete GDG project with both frontend and backend components.

## 📋 Project Overview

- **Frontend**: React/TypeScript application (mainSite/)
- **Backend**: Spring Boot REST API (backend/)
- **Database**: PostgreSQL
- **Image Storage**: Local file system
- **Deployment**: Docker, Kubernetes (K3s/Minikube)

## 🛠️ Prerequisites

- Docker & Docker Compose
- Java 17+ (for local backend development)
- Node.js 18+ (for local frontend development)
- Maven 3.6+ (for backend building)
- Kubernetes cluster (K3s/Minikube for K8s deployment)

## 🚀 Quick Start (Docker Compose)

### 1. Start Database
```bash
cd backend
docker-compose up -d
```

### 2. Configure Environment Variables
```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/gdg_db
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=password
export FILE_UPLOAD_DIR=./uploads
```

### 3. Start Backend
```bash
cd backend
./start-backend.sh
```

### 4. Start Frontend
```bash
cd mainSite
npm install
npm run dev
```

## 🐳 Docker Deployment

### Backend Docker Setup

1. **Build Backend Image:**
```bash
cd backend
mvn clean package
docker build -t gdg-backend:latest .
```

2. **Run Backend Container:**
```bash
docker run -d \
  --name gdg-backend \
  -p 3001:3001 \
  -v $(pwd)/uploads:/app/uploads \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/gdg_db \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=password \
  -e FILE_UPLOAD_DIR=/app/uploads \
  gdg-backend:latest
```

### Frontend Docker Setup

1. **Build Frontend Image:**
```bash
cd mainSite
docker build -t gdg-frontend:latest .
```

2. **Run Frontend Container:**
```bash
docker run -d \
  --name gdg-frontend \
  -p 3000:3000 \
  gdg-frontend:latest
```

## ☸️ Kubernetes Deployment

### Prerequisites
- K3s or Minikube cluster running
- kubectl configured

### 1. Create Namespace
```bash
kubectl apply -f k8s/namespace.yaml
```

### 2. Deploy PostgreSQL
```bash
kubectl apply -f k8s/postgres-deployment.yaml
```

### 3. Configure File Storage
The backend will automatically create the uploads directory and serve files as static resources.

### 4. Deploy Backend
```bash
# Build and push backend image to your registry
docker build -t your-registry/gdg-backend:latest backend/
docker push your-registry/gdg-backend:latest

# Update image in k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
```

### 5. Deploy Frontend
```bash
# Build and push frontend image to your registry
docker build -t your-registry/gdg-frontend:latest mainSite/
docker push your-registry/gdg-frontend:latest

# Update image in k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### 6. Configure Ingress
```bash
kubectl apply -f k8s/ingress.yaml
```

## 🔧 Configuration

### Environment Variables

#### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `DATABASE_USERNAME`: Database username
- `DATABASE_PASSWORD`: Database password
- `FILE_UPLOAD_DIR`: Directory for file uploads (default: ./uploads)

#### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:3001)

### Database Setup

The backend automatically creates the required database schema on startup. No manual database setup is required.

### File Storage Setup

The application automatically handles file storage:
1. Creates upload directory on startup
2. Serves uploaded files as static resources at `/uploads/`
3. Validates file types and sizes
4. Generates unique filenames to prevent conflicts

## 🧪 Testing

### API Testing
```bash
cd backend
./test-api.sh
```

### Manual Testing
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/health
- Database Admin (pgAdmin): http://localhost:5050

## 📊 Monitoring

### Health Checks
- Backend Health: `GET /api/health`
- Database Connection: Check application logs
- Image Upload: Test with `/api/upload/image`

### Logs
```bash
# Backend logs
docker logs gdg-backend

# Kubernetes logs
kubectl logs -f deployment/gdg-backend -n gdg-app
```

## 🔒 Security Considerations

1. **Database**: Use strong passwords in production
2. **File Storage**: Ensure proper directory permissions
3. **CORS**: Configure specific origins in production
4. **HTTPS**: Use SSL certificates in production
5. **Secrets**: Use Kubernetes secrets for sensitive data

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check if PostgreSQL is running
   - Verify connection string and credentials
   - Check network connectivity

2. **Image Upload Failed**
   - Check upload directory permissions
   - Verify file size limits (10MB per file)
   - Ensure proper CORS configuration

3. **Frontend Can't Connect to Backend**
   - Check if backend is running on port 3001
   - Verify CORS configuration
   - Check network connectivity

4. **Kubernetes Deployment Issues**
   - Check pod status: `kubectl get pods -n gdg-app`
   - Check logs: `kubectl logs -f deployment/gdg-backend -n gdg-app`
   - Verify secrets: `kubectl get secrets -n gdg-app`

### Debug Commands

```bash
# Check backend health
curl http://localhost:3001/api/health

# Check database connection
docker exec -it gdg-postgres psql -U postgres -d gdg_db -c "\dt"

# Check Kubernetes resources
kubectl get all -n gdg-app
```

## 📈 Scaling

### Horizontal Scaling
- Backend: Increase replicas in deployment
- Database: Use PostgreSQL clustering
- Frontend: Use CDN for static assets

### Vertical Scaling
- Adjust resource limits in Kubernetes
- Optimize database queries
- Use caching for frequently accessed data

## 🔄 Updates

### Rolling Updates
```bash
# Update backend
kubectl set image deployment/gdg-backend gdg-backend=your-registry/gdg-backend:v2.0 -n gdg-app

# Update frontend
kubectl set image deployment/gdg-frontend gdg-frontend=your-registry/gdg-frontend:v2.0 -n gdg-app
```

### Database Migrations
The application uses JPA auto-update, so schema changes are applied automatically on startup.

## 📞 Support

For issues and questions:
1. Check the logs first
2. Verify configuration
3. Test individual components
4. Check network connectivity
5. Review security settings