package com.gdg.backend.dto;

import com.gdg.backend.model.Event;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EventMapper {

    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    // Map Long id to String id ("_id" is handled by @JsonProperty in DTO)
    @Mapping(source = "id", target = "id")
    EventDTO eventToEventDTO(Event event);

    @Mapping(source = "id", target = "id")
    Event eventDTOToEvent(EventDTO eventDTO);

    List<EventDTO> eventsToEventDTOs(List<Event> events);
}