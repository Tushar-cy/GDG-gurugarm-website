package com.gdg.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsArticleDTO {
    
    private String _id;
    private String title;
    private String content;
    private String summary;
    private String image;
    private List<String> images;
    private String author;
    private String category;
    private List<String> tags;
    private Boolean featured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}