#!/bin/bash

# GDG Backend Startup Script

echo "🚀 Starting GDG Backend API..."

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6 or higher."
    exit 1
fi

# Set default environment variables if not set
export DATABASE_URL=${DATABASE_URL:-"jdbc:postgresql://localhost:5432/gdg_db"}
export DATABASE_USERNAME=${DATABASE_USERNAME:-"postgres"}
export DATABASE_PASSWORD=${DATABASE_PASSWORD:-"password"}
export FILE_UPLOAD_DIR=${FILE_UPLOAD_DIR:-"./uploads"}

echo "📊 Database URL: $DATABASE_URL"
echo "🔑 Database User: $DATABASE_USERNAME"
echo "📁 Upload Directory: $FILE_UPLOAD_DIR"

# Check if PostgreSQL is running (optional)
echo "🔍 Checking database connection..."

# Start the application
# Optional: choose a Spring profile (e.g., dev for H2 fallback)
BACKEND_PROFILE=${BACKEND_PROFILE:-}

echo "🏃 Starting Spring Boot application..."
if [ -n "$BACKEND_PROFILE" ]; then
  echo "🧩 Using Spring profile: $BACKEND_PROFILE"
fi
echo "🌐 API will be available at: http://localhost:3001"
echo "❤️  Health check: http://localhost:3001/api/health"
echo ""

if [ -n "$BACKEND_PROFILE" ]; then
  mvn spring-boot:run -Dspring-boot.run.profiles="$BACKEND_PROFILE"
else
  mvn spring-boot:run
fi
