package com.gdg.backend.repository;

import com.gdg.backend.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findByCategory(String category);
    
    List<News> findByIsFeaturedTrue();
    
    @Query("SELECT n FROM News n WHERE " +
           "LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.excerpt) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<News> searchByKeyword(@Param("keyword") String keyword);
    
    List<News> findAllByOrderByPublishedDateDesc();
}