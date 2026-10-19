package com.gdg.backend.service;

import com.gdg.backend.model.GalleryFolder;
import com.gdg.backend.model.GalleryImage;
import com.gdg.backend.repository.GalleryFolderRepository;
import com.gdg.backend.repository.GalleryImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class GalleryService {
    
    private final GalleryFolderRepository folderRepository;
    private final GalleryImageRepository imageRepository;
    
    private static final String UPLOAD_DIR = "./uploads/gallery";
    
    public List<GalleryFolder> getAllFolders() {
        return folderRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc();
    }
    
    public GalleryFolder getFolderById(Long id) {
        return folderRepository.findById(id).orElse(null);
    }
    
    public GalleryFolder createFolder(String name, String description) {
        GalleryFolder folder = new GalleryFolder();
        folder.setName(name);
        folder.setDescription(description != null ? description : "");
        return folderRepository.save(folder);
    }
    
    public GalleryFolder updateFolder(Long id, String name, String description) {
        GalleryFolder folder = folderRepository.findById(id).orElse(null);
        if (folder != null) {
            folder.setName(name);
            if (description != null) {
                folder.setDescription(description);
            }
            return folderRepository.save(folder);
        }
        return null;
    }
    
    public void deleteFolder(Long id) {
        folderRepository.deleteById(id);
    }
    
    public List<GalleryImage> getFolderImages(Long folderId) {
        GalleryFolder folder = folderRepository.findById(folderId).orElse(null);
        if (folder != null) {
            return imageRepository.findByFolderOrderByIdAsc(folder);
        }
        return new ArrayList<>();
    }
    
    public List<GalleryImage> uploadImages(Long folderId, List<MultipartFile> files) throws IOException {
        GalleryFolder folder = folderRepository.findById(folderId)
            .orElseThrow(() -> new RuntimeException("Folder not found"));
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR, folderId.toString());
        Files.createDirectories(uploadPath);
        
        List<GalleryImage> uploadedImages = new ArrayList<>();
        
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            GalleryImage image = new GalleryImage();
            image.setFolder(folder);
            image.setImageUrl("/uploads/gallery/" + folderId + "/" + fileName);
            image.setFileName(file.getOriginalFilename());
            image.setFileSize(file.getSize());
            image.setMimeType(file.getContentType());
            
            uploadedImages.add(imageRepository.save(image));
        }
        
        // Update cover image if folder doesn't have one
        if (folder.getCoverImageUrl() == null && !uploadedImages.isEmpty()) {
            folder.setCoverImageUrl(uploadedImages.get(0).getImageUrl());
            folderRepository.save(folder);
        }
        
        return uploadedImages;
    }
    
    public void deleteImage(Long imageId) {
        imageRepository.deleteById(imageId);
    }
}


