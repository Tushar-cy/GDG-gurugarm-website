package com.gdg.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 200)
    private String role;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String avatar;

    @Column(length = 500)
    private String linkedin;

    @Column(length = 500)
    private String twitter;

    @Column(length = 500)
    private String github;

    @Column(length = 500)
    private String website;

    @Column(length = 500)
    private String tags;

    @Column(name = "is_leader")
    private Boolean isLeader = false;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String get_id() {
        return id != null ? id.toString() : null;
    }

    public void set_id(String _id) {
        if (_id != null && !_id.isEmpty()) {
            this.id = Long.parseLong(_id);
        }
    }
}
