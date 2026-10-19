package com.gdg.backend.repository;

import com.gdg.backend.model.FormSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormSubmissionRepository extends JpaRepository<FormSubmission, Long> {
    List<FormSubmission> findByFormIdOrderBySubmittedAtDesc(Long formId);
    Long countByFormId(Long formId);
}

