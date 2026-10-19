package com.gdg.backend.service;

import com.gdg.backend.dto.NewsArticleDTO;
import com.gdg.backend.model.NewsArticle;
import com.gdg.backend.repository.NewsArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NewsArticleService {
    
    private final NewsArticleRepository newsArticleRepository;
    
    public List<NewsArticleDTO> getAllNewsArticles() {
        return newsArticleRepository.findByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<NewsArticleDTO> getNewsArticleById(Long id) {
        return newsArticleRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public NewsArticleDTO createNewsArticle(NewsArticleDTO newsArticleDTO) {
        NewsArticle newsArticle = convertToEntity(newsArticleDTO);
        NewsArticle savedArticle = newsArticleRepository.save(newsArticle);
        return convertToDTO(savedArticle);
    }
    
    public Optional<NewsArticleDTO> updateNewsArticle(Long id, NewsArticleDTO newsArticleDTO) {
        return newsArticleRepository.findById(id)
                .map(existingArticle -> {
                    updateEntityFromDTO(existingArticle, newsArticleDTO);
                    NewsArticle updatedArticle = newsArticleRepository.save(existingArticle);
                    return convertToDTO(updatedArticle);
                });
    }
    
    public boolean deleteNewsArticle(Long id) {
        if (newsArticleRepository.existsById(id)) {
            newsArticleRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<NewsArticleDTO> getNewsArticlesByCategory(String category) {
        return newsArticleRepository.findByCategory(category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<NewsArticleDTO> getFeaturedNewsArticles() {
        return newsArticleRepository.findByFeaturedTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<NewsArticleDTO> searchNewsArticles(String keyword) {
        return newsArticleRepository.findByKeyword(keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private NewsArticleDTO convertToDTO(NewsArticle newsArticle) {
        NewsArticleDTO dto = new NewsArticleDTO();
        dto.set_id(newsArticle.get_id());
        dto.setTitle(newsArticle.getTitle());
        dto.setContent(newsArticle.getContent());
        dto.setSummary(newsArticle.getSummary());
        dto.setImage(newsArticle.getImage());
        dto.setImages(newsArticle.getImages());
        dto.setAuthor(newsArticle.getAuthor());
        dto.setCategory(newsArticle.getCategory());
        dto.setTags(newsArticle.getTags());
        dto.setFeatured(newsArticle.getFeatured());
        dto.setCreatedAt(newsArticle.getCreatedAt());
        dto.setUpdatedAt(newsArticle.getUpdatedAt());
        return dto;
    }
    
    private NewsArticle convertToEntity(NewsArticleDTO dto) {
        NewsArticle newsArticle = new NewsArticle();
        newsArticle.set_id(dto.get_id());
        newsArticle.setTitle(dto.getTitle());
        newsArticle.setContent(dto.getContent());
        newsArticle.setSummary(dto.getSummary());
        newsArticle.setImage(dto.getImage());
        newsArticle.setImages(dto.getImages());
        newsArticle.setAuthor(dto.getAuthor());
        newsArticle.setCategory(dto.getCategory());
        newsArticle.setTags(dto.getTags());
        newsArticle.setFeatured(dto.getFeatured() != null ? dto.getFeatured() : false);
        return newsArticle;
    }
    
    private void updateEntityFromDTO(NewsArticle existingArticle, NewsArticleDTO dto) {
        if (dto.getTitle() != null) existingArticle.setTitle(dto.getTitle());
        if (dto.getContent() != null) existingArticle.setContent(dto.getContent());
        if (dto.getSummary() != null) existingArticle.setSummary(dto.getSummary());
        if (dto.getImage() != null) existingArticle.setImage(dto.getImage());
        if (dto.getImages() != null) existingArticle.setImages(dto.getImages());
        if (dto.getAuthor() != null) existingArticle.setAuthor(dto.getAuthor());
        if (dto.getCategory() != null) existingArticle.setCategory(dto.getCategory());
        if (dto.getTags() != null) existingArticle.setTags(dto.getTags());
        if (dto.getFeatured() != null) existingArticle.setFeatured(dto.getFeatured());
    }
}