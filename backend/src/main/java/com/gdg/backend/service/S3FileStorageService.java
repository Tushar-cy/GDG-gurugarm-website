package com.gdg.backend.service;

import com.gdg.backend.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URL;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3FileStorageService implements FileStorageService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file, String directory) throws IOException {
        if (file.isEmpty()) {
            throw new BadRequestException("File to upload is empty.");
        }

        // Generate a unique file name
        String extension = com.google.common.io.Files.getFileExtension(file.getOriginalFilename());
        String fileName = directory + "/" + UUID.randomUUID() + "." + extension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            // Get the public URL
            URL url = s3Client.utilities().getUrl(b -> b.bucket(bucketName).key(fileName));
            String publicUrl = url.toString();
            
            // Handle MinIO local URLs
            if (publicUrl.contains("localhost") || publicUrl.contains("127.0.0.1")) {
                 log.warn("Detected MinIO/local S3 URL. Replacing host for public access.");
                 // This is a common fix when MinIO is in Docker but accessed from host
                 // e.g., return publicUrl.replace("http://127.0.0.1:9000", "http://localhost:9000");
            }
            
            log.info("File uploaded successfully to S3: {}", publicUrl);
            return publicUrl;

        } catch (Exception e) {
            log.error("Failed to upload file to S3", e);
            throw new IOException("Failed to upload file to S3: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) throws Exception {
        if (fileUrl == null || fileUrl.isBlank()) {
            log.warn("No file URL provided for deletion.");
            return;
        }

        try {
            URL url = new URL(fileUrl);
            // The "key" is the path without the host and bucket name
            // This logic assumes the URL path starts with the key.
            // e.g., https://[bucket].s3.[region].amazonaws.com/[key]
            String key = url.getPath().substring(1); // Remove leading '/'

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            log.info("File deleted successfully from S3: {}", fileUrl);

        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", fileUrl, e);
            throw new Exception("Failed to delete file: " + e.getMessage());
        }
    }
}