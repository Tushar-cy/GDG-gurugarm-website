package com.gdg.backend.controller;

import com.gdg.backend.dto.NewsDTO;
import com.gdg.backend.service.NewsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService; // Injected Service, not Repository!

    @GetMapping
    public ResponseEntity<List<NewsDTO>> getAllNews() {
        log.info("GET /api/news - Fetching all news articles");
        List<NewsDTO> news = newsService.getAllNews();
        return ResponseEntity.ok(news);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsDTO> getNewsById(@PathVariable Long id) {
        log.info("GET /api/news/{} - Fetching news", id);
        NewsDTO news = newsService.getNewsById(id);
        return ResponseEntity.ok(news);
    }

    @PostMapping
    public ResponseEntity<NewsDTO> createNews(@Valid @RequestBody NewsDTO newsDTO) {
        log.info("POST /api/news - Creating new news: {}", newsDTO.getTitle());
        NewsDTO savedNews = newsService.createNews(newsDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNews);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsDTO> updateNews(
            @PathVariable Long id, 
            @Valid @RequestBody NewsDTO newsDTO) {
        log.info("PUT /api/news/{} - Updating news", id);
        NewsDTO updatedNews = newsService.updateNews(id, newsDTO);
        return ResponseEntity.ok(updatedNews);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        log.info("DELETE /api/news/{} - Deleting news", id);
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
    
    // ... other endpoints ...
}