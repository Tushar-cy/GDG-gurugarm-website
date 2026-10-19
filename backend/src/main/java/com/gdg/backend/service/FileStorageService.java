package com.gdg.backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {
    
    /**
     * Uploads a file to the configured storage (e.g., S3).
     *
     * @param file the file to upload
     * @param directory the directory/path within the bucket (e.g., "gallery/events")
     * @return The public URL of the uploaded file.
     */
    String uploadFile(MultipartFile file, String directory) throws IOException;

    /**
     * Deletes a file from the storage.
     *
     * @param fileUrl the public URL of the file to delete
     */
    void deleteFile(String fileUrl) throws Exception;
}