package com.gdg.backend.dto;

import com.gdg.backend.model.GalleryFolder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GalleryFolderDTO {
    private Long id;
    private String name;
    private String description;
    private String coverImageUrl;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static GalleryFolderDTO fromEntity(GalleryFolder folder, String coverImageUrl) {
        GalleryFolderDTO dto = new GalleryFolderDTO();
        dto.setId(folder.getId());
        dto.setName(folder.getName());
        dto.setDescription(folder.getDescription());
        dto.setCoverImageUrl(coverImageUrl);
        dto.setDisplayOrder(folder.getDisplayOrder());
        dto.setCreatedAt(folder.getCreatedAt());
        dto.setUpdatedAt(folder.getUpdatedAt());
        return dto;
    }
}


