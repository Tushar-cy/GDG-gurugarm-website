package com.gdg.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "form_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "form_id", nullable = false)
    private Long formId;
    
    // JSON structure of submitted data
    @Column(nullable = false, columnDefinition = "TEXT")
    private String submissionData;
    
    @Column(length = 100)
    private String submitterEmail;
    
    @Column(length = 200)
    private String submitterName;
    
    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;
    
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

