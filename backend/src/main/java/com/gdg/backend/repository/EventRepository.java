package com.gdg.backend.repository;

import com.gdg.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByStatus(Event.EventStatus status);
    
    List<Event> findByCategory(String category);
    
    @Query("SELECT e FROM Event e WHERE " +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Event> findByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT DISTINCT e.category FROM Event e")
    List<String> findDistinctCategories();
    
    List<Event> findByOrderByDateAsc();
    
    List<Event> findByOrderByCreatedAtDesc();
}