package com.gdg.backend.service;

import com.gdg.backend.dto.EventDTO;
import com.gdg.backend.dto.EventMapper;
import com.gdg.backend.exception.ResourceNotFoundException;
import com.gdg.backend.model.Event;
import com.gdg.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    public List<EventDTO> getAllEvents() {
        log.info("Fetching all events");
        List<Event> events = eventRepository.findAllByOrderByDateAsc();
        return eventMapper.eventsToEventDTOs(events);
    }

    public EventDTO getEventById(Long id) {
        log.info("Fetching event by id: {}", id);
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return eventMapper.eventToEventDTO(event);
    }

    public EventDTO createEvent(EventDTO eventDTO) {
        log.info("Creating new event: {}", eventDTO.getTitle());
        Event event = eventMapper.eventDTOToEvent(eventDTO);
        Event savedEvent = eventRepository.save(event);
        return eventMapper.eventToEventDTO(savedEvent);
    }

    public EventDTO updateEvent(Long id, EventDTO eventDTO) {
        log.info("Updating event: {}", id);
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        
        // Use mapper to update fields, or do it manually
        existingEvent.setTitle(eventDTO.getTitle());
        existingEvent.setDescription(eventDTO.getDescription());
        existingEvent.setContent(eventDTO.getContent());
        existingEvent.setDate(eventDTO.getDate());
        existingEvent.setImage(eventDTO.getImage());
        // ... update other fields ...
        
        Event updatedEvent = eventRepository.save(existingEvent);
        return eventMapper.eventToEventDTO(updatedEvent);
    }

    public void deleteEvent(Long id) {
        log.info("Deleting event: {}", id);
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    // ... other methods like getEventsByStatus, searchEvents ...
    
    public List<EventDTO> getEventsByStatus(Event.EventStatus status) {
        log.info("Fetching events by status: {}", status);
        List<Event> events = eventRepository.findByStatus(status);
        return eventMapper.eventsToEventDTOs(events);
    }

    public List<EventDTO> searchEvents(String keyword) {
        log.info("Searching events with keyword: {}", keyword);
        List<Event> events = eventRepository.findByKeyword(keyword);
        return eventMapper.eventsToEventDTOs(events);
    }
}