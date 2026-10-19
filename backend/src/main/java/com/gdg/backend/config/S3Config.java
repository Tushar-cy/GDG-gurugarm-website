package com.gdg.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;
import java.util.Optional;

@Configuration
public class S3Config {

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.access-key-id:}")
    private Optional<String> accessKeyId;

    @Value("${aws.s3.secret-access-key:}")
    private Optional<String> secretAccessKey;

    @Value("${aws.s3.endpoint-override:}")
    private Optional<String> endpointOverride;

    @Bean
    public S3Client s3Client() {
        S3Client.Builder clientBuilder = S3Client.builder()
                .region(Region.of(region));

        // Handle endpoint override for services like MinIO
        endpointOverride.ifPresent(endpoint -> 
            clientBuilder.endpointOverride(URI.create(endpoint))
        );

        // Handle static credentials (useful for local dev or specific non-IAM roles)
        if (accessKeyId.isPresent() && secretAccessKey.isPresent()) {
            clientBuilder.credentialsProvider(
                StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(accessKeyId.get(), secretAccessKey.get())
                )
            );
        }
        
        // If no keys are provided, the client will use the default credentials chain
        // (e.g., EC2 Instance Profile, ECS Task Role, ~/.aws/credentials)

        return clientBuilder.build();
    }
}