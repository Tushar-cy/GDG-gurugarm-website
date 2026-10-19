package com.gdg.backend.controller;

import com.gdg.backend.model.FormSubmission;
import com.gdg.backend.service.FormSubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class FormSubmissionController {
    
    private final FormSubmissionService submissionService;
    
    @GetMapping
    public ResponseEntity<List<FormSubmission>> getAllSubmissions() {
        log.info("GET /api/submissions - Fetching all submissions");
        try {
            List<FormSubmission> submissions = submissionService.getAllSubmissions();
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            log.error("Error fetching submissions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/form/{formId}")
    public ResponseEntity<List<FormSubmission>> getSubmissionsByFormId(@PathVariable Long formId) {
        log.info("GET /api/submissions/form/{} - Fetching submissions for form", formId);
        try {
            List<FormSubmission> submissions = submissionService.getSubmissionsByFormId(formId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            log.error("Error fetching submissions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FormSubmission> getSubmissionById(@PathVariable Long id) {
        log.info("GET /api/submissions/{} - Fetching submission", id);
        try {
            return submissionService.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching submission", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createSubmission(@RequestBody FormSubmission submission) {
        log.info("POST /api/submissions - Creating new submission for form: {}", submission.getFormId());
        try {
            FormSubmission created = submissionService.createSubmission(submission);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            log.error("Error creating submission: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error creating submission", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable Long id) {
        log.info("DELETE /api/submissions/{} - Deleting submission", id);
        try {
            submissionService.deleteSubmission(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting submission", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/form/{formId}/count")
    public ResponseEntity<Long> getSubmissionCount(@PathVariable Long formId) {
        log.info("GET /api/submissions/form/{}/count - Getting submission count", formId);
        try {
            Long count = submissionService.getSubmissionCount(formId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("Error getting submission count", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

