package com.gdg.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false, length = 500)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String content;

    @NotBlank(message = "Date is required")
    @Column(nullable = false)
    private String date;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(columnDefinition = "TEXT")
    private String logo;

    @ElementCollection(fetch = FetchType.EAGER) // Eager for DTO mapping
    @CollectionTable(name = "event_images", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "image_url", length = 1000)
    private List<String> images;

    @Column(length = 200)
    private String location;

    @Column(length = 1000)
    private String link;

    @NotBlank(message = "Category is required")
    @Column(nullable = false, length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.UPCOMING;

    @ElementCollection(fetch = FetchType.EAGER) // Eager for DTO mapping
    @CollectionTable(name = "event_tags", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "tag", length = 100)
    private List<String> tags;

    @Column(name = "max_attendees")
    private Integer maxAttendees;

    @Column(name = "registration_form_id")
    private Long registrationFormId;

    @Column(name = "has_registration")
    private Boolean hasRegistration = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum EventStatus {
        UPCOMING, ONGOING, PAST
    }
}