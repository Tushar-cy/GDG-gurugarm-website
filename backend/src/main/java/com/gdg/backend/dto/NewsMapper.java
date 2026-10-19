package com.gdg.backend.dto;

import com.gdg.backend.model.News;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NewsMapper {
    
    NewsMapper INSTANCE = Mappers.getMapper(NewsMapper.class);

    @Mapping(source = "id", target = "id")
    NewsDTO newsToNewsDTO(News news);

    @Mapping(source = "id", target = "id")
    News newsDTOToNews(NewsDTO newsDTO);

    List<NewsDTO> newsListToNewsDTOList(List<News> newsList);
}