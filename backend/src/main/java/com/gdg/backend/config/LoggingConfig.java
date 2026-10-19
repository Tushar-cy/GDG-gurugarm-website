// src\main\java\config\LoggingConfig.java

package com.gdg.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CommonsRequestLoggingFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

import jakarta.servlet.Filter;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Configuration class for application logging
 * Sets up structured logging, request logging, and activity tracking
 */
@Configuration
public class LoggingConfig {

    private static final Logger logger = LoggerFactory.getLogger(LoggingConfig.class);

    @Value("${logging.file.path:./logs}")
    private String logPath;

    @Value("${logging.activity.enabled:true}")
    private boolean activityLoggingEnabled;

    /**
     * Initialize logging directories and configuration
     */
    @Bean
    public String initializeLogging() {
        try {
            // Create logs directory if it doesn't exist
            Path logsDir = Paths.get(logPath);
            if (!Files.exists(logsDir)) {
                Files.createDirectories(logsDir);
                logger.info("Created logs directory: {}", logPath);
            }

            // Create activity log file
            Path activityLogFile = logsDir.resolve("activity.log");
            if (!Files.exists(activityLogFile)) {
                Files.createFile(activityLogFile);
                logActivity("SYSTEM", "INIT", "Activity logging initialized", "LoggingConfig.java");
            }

            logger.info("Logging configuration initialized successfully");
            return "Logging initialized";
        } catch (IOException e) {
            logger.error("Failed to initialize logging configuration", e);
            return "Logging initialization failed";
        }
    }

    /**
     * Request logging filter for API calls
     */
    @Bean
    public FilterRegistrationBean<CommonsRequestLoggingFilter> requestLoggingFilter() {
        FilterRegistrationBean<CommonsRequestLoggingFilter> registrationBean = new FilterRegistrationBean<>();
        
        CommonsRequestLoggingFilter filter = new CommonsRequestLoggingFilter();
        filter.setIncludeQueryString(true);
        filter.setIncludePayload(true);
        filter.setMaxPayloadLength(1000);
        filter.setIncludeHeaders(true);
        filter.setAfterMessagePrefix("REQUEST DATA: ");
        
        registrationBean.setFilter(filter);
        registrationBean.addUrlPatterns("/api/*");
        registrationBean.setOrder(1);
        
        return registrationBean;
    }

    /**
     * Log activity to activity.log file
     */
    public static void logActivity(String component, String action, String description, String sourceFile) {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            String logEntry = String.format("[%s] [%s] [%s] %s (Source: %s)%n", 
                timestamp, component, action, description, sourceFile);
            
            Path activityLogPath = Paths.get("./logs/activity.log");
            Files.write(activityLogPath, logEntry.getBytes(), 
                java.nio.file.StandardOpenOption.CREATE, 
                java.nio.file.StandardOpenOption.APPEND);
                
            logger.info("Activity logged: {} - {}", action, description);
        } catch (IOException e) {
            logger.error("Failed to write activity log", e);
        }
    }

    /**
     * Log error with context
     */
    public static void logError(String component, String error, Exception exception, String sourceFile) {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            String logEntry = String.format("[%s] [ERROR] [%s] %s - Exception: %s (Source: %s)%n", 
                timestamp, component, error, exception.getMessage(), sourceFile);
            
            Path errorLogPath = Paths.get("./logs/error.log");
            Files.write(errorLogPath, logEntry.getBytes(), 
                java.nio.file.StandardOpenOption.CREATE, 
                java.nio.file.StandardOpenOption.APPEND);
                
            logger.error("Error logged: {} - {}", error, exception.getMessage());
        } catch (IOException e) {
            logger.error("Failed to write error log", e);
        }
    }

    /**
     * Log performance metrics
     */
    public static void logPerformance(String component, String operation, long durationMs, String sourceFile) {
        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            String logEntry = String.format("[%s] [PERFORMANCE] [%s] %s took %dms (Source: %s)%n", 
                timestamp, component, operation, durationMs, sourceFile);
            
            Path performanceLogPath = Paths.get("./logs/performance.log");
            Files.write(performanceLogPath, logEntry.getBytes(), 
                java.nio.file.StandardOpenOption.CREATE, 
                java.nio.file.StandardOpenOption.APPEND);
                
            logger.debug("Performance logged: {} - {}ms", operation, durationMs);
        } catch (IOException e) {
            logger.error("Failed to write performance log", e);
        }
    }
}