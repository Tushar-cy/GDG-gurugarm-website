package com.gdg.backend.controller;

import com.gdg.backend.model.GalleryFolder;
import com.gdg.backend.model.GalleryImage;
import com.gdg.backend.service.GalleryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class GalleryController {
    
    private final GalleryService galleryService;
    
    // Folders
    @GetMapping("/folders")
    public ResponseEntity<List<Map<String, Object>>> getAllFolders() {
        List<GalleryFolder> folders = galleryService.getAllFolders();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (GalleryFolder folder : folders) {
            // Get first image as cover
            List<GalleryImage> images = galleryService.getFolderImages(folder.getId());
            String coverUrl = null;
            if (!images.isEmpty()) {
                coverUrl = images.get(0).getImageUrl();
            }
            
            Map<String, Object> folderData = Map.of(
                "id", folder.getId(),
                "name", folder.getName(),
                "description", folder.getDescription() != null ? folder.getDescription() : "",
                "coverImageUrl", coverUrl != null ? coverUrl : "",
                "displayOrder", folder.getDisplayOrder() != null ? folder.getDisplayOrder() : 0,
                "createdAt", folder.getCreatedAt() != null ? folder.getCreatedAt().toString() : "",
                "updatedAt", folder.getUpdatedAt() != null ? folder.getUpdatedAt().toString() : ""
            );
            result.add(folderData);
        }
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/folders/{id}")
    public ResponseEntity<GalleryFolder> getFolder(@PathVariable Long id) {
        GalleryFolder folder = galleryService.getFolderById(id);
        return folder != null ? ResponseEntity.ok(folder) : ResponseEntity.notFound().build();
    }
    
    @PostMapping("/folders")
    public ResponseEntity<GalleryFolder> createFolder(@RequestBody Map<String, String> request) {
        GalleryFolder folder = galleryService.createFolder(
            request.get("name"),
            request.getOrDefault("description", "")
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(folder);
    }
    
    @PutMapping("/folders/{id}")
    public ResponseEntity<GalleryFolder> updateFolder(@PathVariable Long id, @RequestBody Map<String, String> request) {
        GalleryFolder folder = galleryService.updateFolder(
            id,
            request.get("name"),
            request.get("description")
        );
        return folder != null ? ResponseEntity.ok(folder) : ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/folders/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long id) {
        galleryService.deleteFolder(id);
        return ResponseEntity.noContent().build();
    }
    
    // Images
    @GetMapping("/folders/{folderId}/images")
    public ResponseEntity<List<GalleryImage>> getFolderImages(@PathVariable Long folderId) {
        List<GalleryImage> images = galleryService.getFolderImages(folderId);
        return ResponseEntity.ok(images);
    }
    
    @PostMapping(value = "/folders/{folderId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadImages(
            @PathVariable Long folderId,
            @RequestParam("files") List<MultipartFile> files) {
        try {
            List<GalleryImage> uploadedImages = galleryService.uploadImages(folderId, files);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "count", uploadedImages.size(),
                "images", uploadedImages
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        galleryService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}

