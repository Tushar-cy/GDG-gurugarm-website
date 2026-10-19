package com.gdg.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.gdg.backend.config.LoggingConfig;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for managing activity logging throughout the application
 * Provides structured logging for different types of activities
 */
@Service
@Component
public class ActivityLogService {

    private static final Logger logger = LoggerFactory.getLogger(ActivityLogService.class);
    
    // In-memory activity tracking for real-time monitoring
    private final Map<String, Object> activityMetrics = new ConcurrentHashMap<>();
    
    @Autowired
    private LoggingConfig loggingConfig;

    /**
     * Log user authentication activities
     */
    public void logAuthentication(String username, String action, boolean success, String ipAddress) {
        String description = String.format("User %s %s authentication %s from IP %s", 
            username, action, success ? "succeeded" : "failed", ipAddress);
        
        LoggingConfig.logActivity("AUTH", action.toUpperCase(), description, "ActivityLogService.java");
        
        // Update metrics
        updateMetric("auth_attempts", 1);
        if (success) {
            updateMetric("auth_success", 1);
        } else {
            updateMetric("auth_failures", 1);
        }
        
        logger.info("Authentication activity logged: {} - {}", username, action);
    }

    /**
     * Log API endpoint access
     */
    public void logApiAccess(String endpoint, String method, String userAgent, String ipAddress, int responseCode) {
        String description = String.format("%s %s accessed from %s (User-Agent: %s) - Response: %d", 
            method, endpoint, ipAddress, userAgent, responseCode);
        
        LoggingConfig.logActivity("API", method.toUpperCase(), description, "ActivityLogService.java");
        
        // Update metrics
        updateMetric("api_calls", 1);
        updateMetric("api_calls_" + responseCode, 1);
        
        logger.debug("API access logged: {} {}", method, endpoint);
    }

    /**
     * Log data modification operations
     */
    public void logDataOperation(String entity, String operation, String entityId, String userId) {
        String description = String.format("User %s performed %s on %s (ID: %s)", 
            userId, operation, entity, entityId);
        
        LoggingConfig.logActivity("DATA", operation.toUpperCase(), description, "ActivityLogService.java");
        
        // Update metrics
        updateMetric("data_operations", 1);
        updateMetric("data_" + operation.toLowerCase(), 1);
        
        logger.info("Data operation logged: {} {} on {}", operation, entity, entityId);
    }

    /**
     * Log file upload/download activities
     */
    public void logFileOperation(String operation, String filename, String fileType, long fileSize, String userId) {
        String description = String.format("User %s %s file '%s' (%s, %d bytes)", 
            userId, operation, filename, fileType, fileSize);
        
        LoggingConfig.logActivity("FILE", operation.toUpperCase(), description, "ActivityLogService.java");
        
        // Update metrics
        updateMetric("file_operations", 1);
        updateMetric("file_" + operation.toLowerCase(), 1);
        updateMetric("total_file_size", fileSize);
        
        logger.info("File operation logged: {} - {}", operation, filename);
    }

    /**
     * Log system events
     */
    public void logSystemEvent(String event, String description, String severity) {
        String fullDescription = String.format("[%s] %s", severity, description);
        
        LoggingConfig.logActivity("SYSTEM", event.toUpperCase(), fullDescription, "ActivityLogService.java");
        
        // Update metrics
        updateMetric("system_events", 1);
        updateMetric("system_" + severity.toLowerCase(), 1);
        
        logger.info("System event logged: {} - {}", event, description);
    }

    /**
     * Log performance metrics
     */
    public void logPerformanceMetric(String operation, long durationMs, String additionalInfo) {
        String description = String.format("%s completed in %dms - %s", operation, durationMs, additionalInfo);
        
        LoggingConfig.logPerformance("PERFORMANCE", operation, durationMs, "ActivityLogService.java");
        
        // Update metrics
        updateMetric("performance_" + operation.toLowerCase().replace(" ", "_"), durationMs);
        
        logger.debug("Performance metric logged: {} - {}ms", operation, durationMs);
    }

    /**
     * Log security events
     */
    public void logSecurityEvent(String event, String description, String severity, String ipAddress) {
        String fullDescription = String.format("[%s] %s from IP %s", severity, description, ipAddress);
        
        LoggingConfig.logActivity("SECURITY", event.toUpperCase(), fullDescription, "ActivityLogService.java");
        
        // Update metrics
        updateMetric("security_events", 1);
        updateMetric("security_" + severity.toLowerCase(), 1);
        
        logger.warn("Security event logged: {} - {}", event, description);
    }

    /**
     * Get current activity metrics
     */
    public Map<String, Object> getActivityMetrics() {
        Map<String, Object> metrics = new HashMap<>(activityMetrics);
        metrics.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return metrics;
    }

    /**
     * Update metric counter
     */
    private void updateMetric(String key, long value) {
        activityMetrics.merge(key, value, (existing, newValue) -> {
            if (existing instanceof Long) {
                return (Long) existing + (Long) newValue;
            }
            return newValue;
        });
    }

    /**
     * Reset metrics (useful for periodic resets)
     */
    public void resetMetrics() {
        activityMetrics.clear();
        LoggingConfig.logActivity("SYSTEM", "METRICS_RESET", "Activity metrics reset", "ActivityLogService.java");
        logger.info("Activity metrics reset");
    }

    /**
     * Log application startup
     */
    public void logApplicationStartup() {
        String description = "GDG Backend Application started successfully";
        LoggingConfig.logActivity("SYSTEM", "STARTUP", description, "ActivityLogService.java");
        logger.info("Application startup logged");
    }

    /**
     * Log application shutdown
     */
    public void logApplicationShutdown() {
        String description = "GDG Backend Application shutting down gracefully";
        LoggingConfig.logActivity("SYSTEM", "SHUTDOWN", description, "ActivityLogService.java");
        logger.info("Application shutdown logged");
    }
}