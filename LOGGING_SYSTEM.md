# 📊 GDG Project Logging System

A comprehensive logging system for tracking activities, errors, performance, and user interactions across the GDG project.

## 🎯 Overview

This logging system provides:
- **Structured Logging**: Consistent log format across all components
- **Activity Tracking**: User actions, API calls, and system events
- **Performance Monitoring**: Response times and operation metrics
- **Error Tracking**: Detailed error logging with context
- **Log Management**: Tools for log rotation, analysis, and cleanup

## 📁 System Components

### Backend Logging (Spring Boot)
- **Location**: `backend/src/main/java/com/gdg/backend/config/`
- **Files**:
  - `LoggingConfig.java` - Main logging configuration
  - `ActivityLogService.java` - Activity logging service
- **Configuration**: `backend/src/main/resources/application.yml`

### Frontend Logging (React)
- **Location**: `mainSite/src/utils/`
- **Files**:
  - `activityLogger.ts` - Main logging utility
  - `useActivityLogger.ts` - React hook for easy integration
- **Integration**: Available in all React components

### Log Management Tools
- **Location**: `scripts/`
- **Files**:
  - `log-management.sh` - Shell script for log management
  - `log-analyzer.py` - Python script for log analysis
- **Documentation**: `ACTIVITY_LOG.md` - Main activity log

## 🚀 Quick Start

### 1. Backend Logging Setup

The backend logging is automatically configured when the application starts. Logs are written to:
- `./logs/application.log` - General application logs
- `./logs/activity.log` - Activity-specific logs
- `./logs/error.log` - Error logs only
- `./logs/performance.log` - Performance metrics

### 2. Frontend Logging Setup

Import and use the activity logger in your React components:

```typescript
import { useActivityLogger } from '../hooks/useActivityLogger';

function MyComponent() {
  const { logUserAction, logError } = useActivityLogger();
  
  const handleClick = () => {
    logUserAction('MyComponent', 'BUTTON_CLICK', 'User clicked the button');
    // Your component logic here
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

### 3. Log Management

Use the management script for common operations:

```bash
# Show log status
./scripts/log-management.sh status

# Rotate logs
./scripts/log-management.sh rotate

# Analyze logs
./scripts/log-management.sh analyze

# Search for specific terms
./scripts/log-management.sh search "ERROR"

# Tail activity logs
./scripts/log-management.sh tail activity.log
```

## 📋 Log Types

### 1. Activity Logs
Track user interactions and system events:
- User authentication
- API endpoint access
- Data operations (CRUD)
- File uploads/downloads
- Navigation events

### 2. Error Logs
Capture and track errors:
- Application exceptions
- API errors
- Database errors
- File system errors
- Network errors

### 3. Performance Logs
Monitor application performance:
- API response times
- Database query performance
- File operation times
- Page load times
- Component render times

### 4. System Logs
Track system-level events:
- Application startup/shutdown
- Configuration changes
- Service health checks
- Security events

## 🔧 Configuration

### Backend Configuration

In `application.yml`:

```yaml
logging:
  level:
    com.gdg.backend: INFO
  file:
    path: ./logs
    name: ./logs/application.log
  pattern:
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

activity:
  logging:
    enabled: true
    file-path: ./logs/activity.log
    include-request-details: true
    include-response-time: true
```

### Frontend Configuration

The frontend logger can be configured via environment variables:

```bash
# Enable/disable logging
REACT_APP_LOGGING_ENABLED=true

# Log level
REACT_APP_LOG_LEVEL=INFO

# Backend endpoint for log submission
REACT_APP_LOG_ENDPOINT=/api/logs/activity
```

## 📊 Log Analysis

### Using the Log Analyzer

```bash
# Basic analysis
python3 scripts/log-analyzer.py

# Generate JSON report
python3 scripts/log-analyzer.py --format json --output report.json

# Analyze specific log directory
python3 scripts/log-analyzer.py --log-dir /path/to/logs
```

### Analysis Features

- **Error Rate Calculation**: Percentage of error entries
- **Activity Pattern Analysis**: Most common user actions
- **Performance Metrics**: Response time statistics
- **Time Range Analysis**: Log coverage over time
- **Recommendations**: Automated suggestions for improvements

## 🛠️ Log Management Commands

### Status and Monitoring
```bash
# Show current log status
./scripts/log-management.sh status

# Show recent errors
./scripts/log-management.sh errors

# Show performance metrics
./scripts/log-management.sh performance

# Show recent activity
./scripts/log-management.sh activity
```

### Log Operations
```bash
# Rotate log files
./scripts/log-management.sh rotate

# Clean old logs
./scripts/log-management.sh clean

# Backup logs
./scripts/log-management.sh backup

# Export logs for analysis
./scripts/log-management.sh export
```

### Search and Analysis
```bash
# Search for specific terms
./scripts/log-management.sh search "authentication"

# Analyze log patterns
./scripts/log-management.sh analyze

# Tail specific log file
./scripts/log-management.sh tail activity.log
```

## 📈 Monitoring and Alerts

### Key Metrics to Monitor

1. **Error Rate**: Should be < 5%
2. **Response Time**: API calls should be < 500ms
3. **Activity Volume**: Track user engagement
4. **Log File Size**: Monitor disk usage

### Automated Alerts

The system can be configured to send alerts for:
- High error rates
- Performance degradation
- Unusual activity patterns
- Log file size limits

## 🔒 Security Considerations

### Sensitive Data Protection

- **No Password Logging**: Passwords are never logged
- **PII Filtering**: Personal information is filtered out
- **IP Address Masking**: IP addresses can be masked for privacy
- **Log Access Control**: Log files have restricted permissions

### Log Retention

- **Default Retention**: 30 days
- **Automatic Cleanup**: Old logs are automatically archived
- **Backup Strategy**: Regular backups to secure storage
- **Compliance**: GDPR and privacy law compliance

## 🚀 Deployment Considerations

### Production Setup

1. **Log Directory**: Ensure write permissions for log directory
2. **Disk Space**: Monitor disk usage for log files
3. **Log Rotation**: Configure automatic log rotation
4. **Monitoring**: Set up log monitoring and alerting
5. **Backup**: Regular backup of log files

### Environment Variables

```bash
# Log directory
LOG_DIR=/var/log/gdg

# Log level
LOG_LEVEL=INFO

# Enable activity logging
ACTIVITY_LOGGING_ENABLED=true

# Log retention days
LOG_RETENTION_DAYS=30
```

## 📚 API Reference

### Backend Logging Service

```java
@Autowired
private ActivityLogService activityLogService;

// Log user authentication
activityLogService.logAuthentication(username, "LOGIN", true, ipAddress);

// Log API access
activityLogService.logApiAccess("/api/users", "GET", userAgent, ipAddress, 200);

// Log data operation
activityLogService.logDataOperation("User", "CREATE", userId, currentUserId);

// Log file operation
activityLogService.logFileOperation("UPLOAD", filename, "image/jpeg", fileSize, userId);
```

### Frontend Logging Hook

```typescript
const {
  logUserAction,
  logError,
  logPerformance,
  logApiCall,
  getLogs,
  exportLogs
} = useActivityLogger();

// Log user action
logUserAction('ComponentName', 'ACTION', 'Description', { metadata });

// Log error
logError('ComponentName', error, { context });

// Log performance
logPerformance('operation', duration, 'ComponentName');

// Get all logs
const logs = getLogs();

// Export logs
const logData = exportLogs();
```

## 🐛 Troubleshooting

### Common Issues

1. **Log Directory Not Found**
   - Ensure the log directory exists and has write permissions
   - Check the `LOG_DIR` environment variable

2. **Log Files Not Rotating**
   - Verify the log rotation script has execute permissions
   - Check disk space availability

3. **Performance Impact**
   - Adjust log levels for production
   - Use asynchronous logging where possible
   - Monitor log file sizes

4. **Missing Log Entries**
   - Check log level configuration
   - Verify logging is enabled
   - Check for log file permissions

### Debug Mode

Enable debug logging for troubleshooting:

```yaml
logging:
  level:
    com.gdg.backend: DEBUG
    root: DEBUG
```

## 📞 Support

For issues with the logging system:
1. Check the `ACTIVITY_LOG.md` for recent changes
2. Review log files for error patterns
3. Use the log analyzer for insights
4. Check system resources and permissions

---

*Last Updated: 2024-12-19*
*Version: 1.0.0*