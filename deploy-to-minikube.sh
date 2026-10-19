#!/bin/bash

# GDG Application Deployment Script for Minikube
set -e

echo "🚀 Starting GDG Application Deployment to Minikube..."

# Check if Minikube is running
if ! minikube status > /dev/null 2>&1; then
    echo "❌ Minikube is not running. Starting Minikube..."
    minikube start --driver=docker --memory=4096 --cpus=2
fi

# Enable ingress addon
echo "📦 Enabling ingress addon..."
minikube addons enable ingress

# Set Docker environment to use Minikube's Docker daemon
echo "🐳 Setting up Docker environment..."
eval $(minikube docker-env)

# Build Docker images
echo "🔨 Building Docker images..."

# Build backend image
echo "Building backend image..."
cd backend
docker build -t gdg-backend:latest .
cd ..

# Build frontend image
echo "Building frontend image..."
cd mainSite
docker build -f Dockerfile.k8s -t gdg-frontend:latest .
cd ..

# Apply Kubernetes manifests
echo "📋 Applying Kubernetes manifests..."
kubectl apply -f k8s/

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/gdg-backend -n gdg-app
kubectl wait --for=condition=available --timeout=300s deployment/gdg-frontend -n gdg-app
kubectl wait --for=condition=available --timeout=300s deployment/postgres -n gdg-app

# Get service URLs
echo "🌐 Getting service URLs..."
echo "Frontend URL: $(minikube service gdg-frontend-service -n gdg-app --url)"
echo "Backend URL: $(minikube service gdg-backend-service -n gdg-app --url)"

# Add ingress host to /etc/hosts
echo "📝 Adding gdg.local to /etc/hosts..."
MINIKUBE_IP=$(minikube ip)
if ! grep -q "gdg.local" /etc/hosts; then
    echo "$MINIKUBE_IP gdg.local" | sudo tee -a /etc/hosts
    echo "✅ Added gdg.local to /etc/hosts"
else
    echo "ℹ️  gdg.local already exists in /etc/hosts"
fi

echo "🎉 Deployment completed!"
echo "📱 Access your application at: http://gdg.local"
echo "🔧 Backend API available at: http://gdg.local/api"
echo ""
echo "📊 To check status: kubectl get pods -n gdg-app"
echo "📋 To view logs: kubectl logs -f deployment/gdg-frontend -n gdg-app"
echo "🗑️  To delete: kubectl delete namespace gdg-app"