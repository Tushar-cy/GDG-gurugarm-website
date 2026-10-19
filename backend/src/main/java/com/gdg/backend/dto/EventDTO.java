package com.gdg.backend.dto;

import com.gdg.backend.model.Event;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {

    @JsonProperty("_id") // This is how you map for the frontend
    private String id;
    private String title;
    private String description;
    private String content;
    private String date;
    private String image;
    private String logo;
    private List<String> images;
    private String location;
    private String link;
    private String category;
    private Event.EventStatus status;
    private List<String> tags;
    private Integer maxAttendees;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}