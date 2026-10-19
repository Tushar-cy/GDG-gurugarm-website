# Use Maven with OpenJDK 17 as base image
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# --- FIX ---
# Copy the pom.xml from the 'backend' subfolder
COPY backend/pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# --- FIX ---
# Copy the source code from the 'backend' subfolder
COPY backend/src src

# Build the application
RUN mvn clean package -DskipTests

# Create a new stage for runtime
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the built jar from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]