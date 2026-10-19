package com.gdg.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocalFileStorageService {
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    @Value("${file.max-size}")
    private String maxSize;
    
    @Value("${file.allowed-types}")
    private String allowedTypes;
    
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp");
    
    public Map<String, Object> uploadSingleFile(MultipartFile file) {
        try {
            validateFile(file);
            
            String fileName = generateUniqueFileName(file.getOriginalFilename());
            Path filePath = Paths.get(uploadDir, fileName);
            
            // Ensure upload directory exists
            Files.createDirectories(Paths.get(uploadDir));
            
            // Copy file to upload directory
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            String fileUrl = "/uploads/" + fileName;
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("file", Map.of(
                "originalName", file.getOriginalFilename(),
                "fileName", fileName,
                "url", fileUrl,
                "size", file.getSize(),
                "contentType", file.getContentType()
            ));
            
            log.info("File uploaded successfully: {}", fileName);
            return response;
            
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to upload file: " + e.getMessage());
            return response;
        }
    }
    
    public Map<String, Object> uploadMultipleFiles(List<MultipartFile> files) {
        try {
            List<Map<String, Object>> uploadResults = new ArrayList<>();
            
            for (MultipartFile file : files) {
                Map<String, Object> result = uploadSingleFile(file);
                if ((Boolean) result.get("success")) {
                    uploadResults.add((Map<String, Object>) result.get("file"));
                } else {
                    throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename());
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("files", uploadResults);
            
            return response;
            
        } catch (Exception e) {
            log.error("Error uploading multiple files: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to upload files: " + e.getMessage());
            return response;
        }
    }
    
    public boolean deleteFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, fileName);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted successfully: {}", fileName);
                return true;
            }
            return false;
        } catch (IOException e) {
            log.error("Error deleting file {}: {}", fileName, e.getMessage());
            return false;
        }
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        // Check file size (10MB default)
        long maxSizeBytes = parseSize(maxSize);
        if (file.getSize() > maxSizeBytes) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + maxSize);
        }
        
        // Check file extension
        String extension = FilenameUtils.getExtension(file.getOriginalFilename()).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: " + ALLOWED_EXTENSIONS);
        }
        
        // Check content type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }
    }
    
    private String generateUniqueFileName(String originalFileName) {
        String extension = FilenameUtils.getExtension(originalFileName);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return String.format("%s_%s.%s", timestamp, uuid, extension);
    }
    
    private long parseSize(String size) {
        if (size.endsWith("MB")) {
            return Long.parseLong(size.substring(0, size.length() - 2)) * 1024 * 1024;
        } else if (size.endsWith("KB")) {
            return Long.parseLong(size.substring(0, size.length() - 2)) * 1024;
        } else if (size.endsWith("B")) {
            return Long.parseLong(size.substring(0, size.length() - 1));
        }
        return Long.parseLong(size);
    }
}