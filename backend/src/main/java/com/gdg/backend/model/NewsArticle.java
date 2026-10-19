package com.gdg.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "news")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 200)
    private String excerpt;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(length = 100)
    private String category;

    @Column(length = 100)
    private String author;

    @Column(name = "published_date")
    private LocalDateTime publishedDate;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(length = 500)
    private String tags; // Consider making this a List<String> with @ElementCollection

    @Column(name = "read_time")
    private Integer readTime;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (publishedDate == null) {
            publishedDate = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}