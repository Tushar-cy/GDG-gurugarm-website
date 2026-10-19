package com.gdg.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "registration_forms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationForm {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Form title is required")
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "event_id")
    private Long eventId;
    
    @Column(columnDefinition = "TEXT")
    private String headerImage;
    
    // JSON structure of form fields
    @Column(nullable = false, columnDefinition = "TEXT")
    private String formFields;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "max_submissions")
    private Integer maxSubmissions;
    
    @Column(name = "submission_count")
    private Integer submissionCount = 0;
    
    @Column(name = "close_date")
    private String closeDate;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Helper method for frontend compatibility
    public String get_id() {
        return id != null ? id.toString() : null;
    }
    
    public void set_id(String _id) {
        if (_id != null && !_id.isEmpty()) {
            this.id = Long.parseLong(_id);
        }
    }
}

