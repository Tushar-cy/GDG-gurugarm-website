package com.gdg.backend.repository;

import com.gdg.backend.model.GalleryImage;
import com.gdg.backend.model.GalleryFolder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {
    List<GalleryImage> findByFolderOrderByIdAsc(GalleryFolder folder);
    void deleteByFolder(GalleryFolder folder);
}


