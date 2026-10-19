package com.gdg.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsDTO {
    @JsonProperty("_id")
    private String id;
    private String title;
    private String content;
    private String excerpt;
    private String image;
    private String category;
    private String author;
    private LocalDateTime publishedDate;
    private Boolean isFeatured;
    private String tags;
    private Integer readTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}