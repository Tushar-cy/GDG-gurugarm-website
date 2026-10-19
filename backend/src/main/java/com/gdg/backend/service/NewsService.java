package com.gdg.backend.service;

import com.gdg.backend.dto.NewsDTO;
import com.gdg.backend.dto.NewsMapper;
import com.gdg.backend.exception.ResourceNotFoundException;
import com.gdg.backend.model.News;
import com.gdg.backend.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private final NewsMapper newsMapper;

    public List<NewsDTO> getAllNews() {
        log.info("Fetching all news");
        List<News> news = newsRepository.findAllByOrderByPublishedDateDesc();
        return newsMapper.newsListToNewsDTOList(news);
    }

    public NewsDTO getNewsById(Long id) {
        log.info("Fetching news by id: {}", id);
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with id: " + id));
        return newsMapper.newsToNewsDTO(news);
    }

    public NewsDTO createNews(NewsDTO newsDTO) {
        log.info("Creating new news: {}", newsDTO.getTitle());
        News news = newsMapper.newsDTOToNews(newsDTO);
        News savedNews = newsRepository.save(news);
        return newsMapper.newsToNewsDTO(savedNews);
    }

    public NewsDTO updateNews(Long id, NewsDTO newsDTO) {
        log.info("Updating news: {}", id);
        News existingNews = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with id: " + id));
        
        // Update fields
        existingNews.setTitle(newsDTO.getTitle());
        existingNews.setContent(newsDTO.getContent());
        existingNews.setExcerpt(newsDTO.getExcerpt());
        existingNews.setImage(newsDTO.getImage());
        // ... update other fields ...

        News updatedNews = newsRepository.save(existingNews);
        return newsMapper.newsToNewsDTO(updatedNews);
    }

    public void deleteNews(Long id) {
        log.info("Deleting news: {}", id);
        if (!newsRepository.existsById(id)) {
            throw new ResourceNotFoundException("News not found with id: " + id);
        }
        newsRepository.deleteById(id);
    }

    // ... other find/search methods ...
}