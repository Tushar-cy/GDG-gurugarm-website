package com.gdg.backend.repository;

import com.gdg.backend.model.GalleryFolder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryFolderRepository extends JpaRepository<GalleryFolder, Long> {
    List<GalleryFolder> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}


