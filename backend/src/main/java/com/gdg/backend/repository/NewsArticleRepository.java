package com.gdg.backend.repository;

import com.gdg.backend.model.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    
    List<NewsArticle> findByCategory(String category);
    
    List<NewsArticle> findByFeaturedTrue();
    
    List<NewsArticle> findByAuthor(String author);
    
    @Query("SELECT n FROM NewsArticle n WHERE " +
           "LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.author) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<NewsArticle> findByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT DISTINCT n.category FROM NewsArticle n")
    List<String> findDistinctCategories();
    
    List<NewsArticle> findByOrderByCreatedAtDesc();
}