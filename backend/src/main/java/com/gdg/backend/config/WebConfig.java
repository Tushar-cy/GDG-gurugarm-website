package com.gdg.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Note: This is only for the H2 database, not for file uploads.
    @Value("${file.upload-dir:./uploads}") // This path is now for legacy/other purposes
    private String uploadDir;

    /**
     * Configures global CORS settings for the entire application.
     * This replaces all @CrossOrigin annotations on controllers.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Apply to all API endpoints
                .allowedOriginPatterns("*") // Use allowedOriginPatterns instead of allowedOrigins
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                .allowedHeaders("*")
                .allowCredentials(false) // Set to true if you need sessions/cookies
                .maxAge(3600);
    }

    /**
     * Configures resource handlers.
     * File uploads should NOT be served from the filesystem in a scalable app.
     * This is left in for serving static content if needed (e.g., from classpath).
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources from classpath
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600);
        
        // --- DEPRECATED ---
        // We no longer serve uploads from the local filesystem.
        // Files are served from S3 with a public URL.
        /*
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String uploadLocation = "file:" + uploadPath + "/";
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation)
                .setCachePeriod(3600);
        */
    }
}