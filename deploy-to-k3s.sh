#!/bin/bash

# GDG Application Deployment Script for K3s
set -e

echo "🚀 Starting GDG Application Deployment to K3s..."

# Check if K3s is running
if ! kubectl get nodes > /dev/null 2>&1; then
    echo "❌ K3s is not running. Please start K3s first."
    exit 1
fi

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
echo "Frontend URL: $(kubectl get service gdg-frontend-service -n gdg-app -o jsonpath='{.spec.clusterIP}'):3000"
echo "Backend URL: $(kubectl get service gdg-backend-service -n gdg-app -o jsonpath='{.spec.clusterIP}'):8080"

# Get ingress information
echo "📡 Ingress Information:"
kubectl get ingress -n gdg-app

echo "🎉 Deployment completed!"
echo "📱 Access your application through the ingress controller"
echo ""
echo "📊 To check status: kubectl get pods -n gdg-app"
echo "📋 To view logs: kubectl logs -f deployment/gdg-frontend -n gdg-app"
echo "🗑️  To delete: kubectl delete namespace gdg-app"
echo ""
echo "🔧 Useful commands:"
echo "  kubectl port-forward -n gdg-app service/gdg-frontend-service 3000:3000"
echo "  kubectl port-forward -n gdg-app service/gdg-backend-service 8080:8080"