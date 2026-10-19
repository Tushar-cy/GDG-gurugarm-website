package com.gdg.backend.controller;

import com.gdg.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class ImageUploadController {
    
    private final FileStorageService fileStorageService;

    @PostMapping("/image")
    public ResponseEntity<Map<String, Object>> uploadSingleImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam(value = "directory", defaultValue = "general") String directory) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "No file provided"));
        }
        
        try {
            String fileUrl = fileStorageService.uploadFile(file, directory);
            return ResponseEntity.ok(Map.of("success", true, "url", fileUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}