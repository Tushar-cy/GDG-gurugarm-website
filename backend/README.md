# GDG Backend API

A comprehensive Spring Boot REST API for the GDG (Google Developer Groups) application, providing endpoints for managing news articles, events, team members, and image uploads.

## 🚀 Features

- **News Management**: CRUD operations for news articles with categories, tags, and featured content
- **Event Management**: Complete event lifecycle management with status tracking
- **Team Management**: Team member profiles with social links and skills
- **Image Upload**: Local file storage system for image uploads
- **Health Monitoring**: Health check endpoints for monitoring
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration
- **Database**: PostgreSQL with JPA/Hibernate for data persistence

## 📋 API Endpoints

### News API (`/api/news`)
- `GET /api/news` - Get all news articles
- `GET /api/news/{id}` - Get specific article
- `POST /api/news` - Create new article
- `PUT /api/news/{id}` - Update article
- `DELETE /api/news/{id}` - Delete article
- `GET /api/news/category/{category}` - Get articles by category
- `GET /api/news/featured` - Get featured articles
- `GET /api/news/search?keyword={keyword}` - Search articles

### Events API (`/api/events`)
- `GET /api/events` - Get all events
- `GET /api/events/{id}` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `GET /api/events/status/{status}` - Get events by status (upcoming/ongoing/past)
- `GET /api/events/category/{category}` - Get events by category
- `GET /api/events/search?keyword={keyword}` - Search events

### Team API (`/api/team`)
- `GET /api/team` - Get all team members
- `GET /api/team/{id}` - Get specific member
- `POST /api/team` - Add team member
- `PUT /api/team/{id}` - Update team member
- `DELETE /api/team/{id}` - Delete team member
- `GET /api/team/active` - Get active members
- `GET /api/team/department/{department}` - Get members by department
- `GET /api/team/role/{role}` - Get members by role
- `GET /api/team/search?keyword={keyword}` - Search members

### Health API (`/api/health`)
- `GET /api/health` - Health check endpoint

### Image Upload API (`/api/upload`)
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

## 🛠️ Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL**
- **Local File Storage** (Image uploads)
- **Lombok** (Reducing boilerplate)
- **Maven** (Dependency management)

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- PostgreSQL 12+
- Docker & Docker Compose (optional)

### Using Docker Compose (Recommended)

1. **Start the database:**
   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Set environment variables:**
   ```bash
   export DATABASE_URL=jdbc:postgresql://localhost:5432/gdg_db
   export DATABASE_USERNAME=postgres
   export DATABASE_PASSWORD=password
   export FILE_UPLOAD_DIR=./uploads
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

### Manual Setup

1. **Install PostgreSQL** and create database:
   ```sql
   CREATE DATABASE gdg_db;
   ```

2. **Update application.yml** with your database credentials

3. **Configure upload directory** in application.yml or environment variables

4. **Run the application:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

## 📊 Database Schema

The application automatically creates the following tables:
- `news_articles` - News articles with categories and tags
- `events` - Events with status and location information
- `team_members` - Team member profiles with social links
- `news_images`, `event_images` - Image collections
- `news_tags`, `event_tags`, `team_skills` - Tag/skill collections

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection URL
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
- `FILE_UPLOAD_DIR` - Directory for file uploads (default: ./uploads)

### Application Properties
- Server runs on port `3001` (matching frontend expectations)
- File upload limit: 10MB per file, 50MB total request
- CORS enabled for all origins
- JPA auto-update database schema

## 🧪 Testing

Run tests with:
```bash
mvn test
```

## 📝 API Documentation

The API follows RESTful conventions and returns JSON responses. All endpoints support CORS for frontend integration.

### Sample Request/Response

**Create News Article:**
```bash
POST /api/news
Content-Type: application/json

{
  "title": "GDG Event Announcement",
  "content": "Join us for our next tech talk...",
  "author": "John Doe",
  "category": "announcement",
  "tags": ["tech", "community"],
  "featured": true
}
```

**Response:**
```json
{
  "_id": "1",
  "title": "GDG Event Announcement",
  "content": "Join us for our next tech talk...",
  "author": "John Doe",
  "category": "announcement",
  "tags": ["tech", "community"],
  "featured": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build the application
mvn clean package

# Build Docker image
docker build -t gdg-backend .

# Run with environment variables
docker run -p 3001:3001 \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/gdg_db \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=password \
  gdg-backend
```

### Kubernetes Deployment
Use the provided Kubernetes manifests in the `k8s/` directory:
- `backend-deployment.yaml`
- `postgres-deployment.yaml`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.