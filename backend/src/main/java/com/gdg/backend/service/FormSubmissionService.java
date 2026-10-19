package com.gdg.backend.service;

import com.gdg.backend.model.FormSubmission;
import com.gdg.backend.model.RegistrationForm;
import com.gdg.backend.repository.FormSubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FormSubmissionService {
    
    private final FormSubmissionRepository submissionRepository;
    private final RegistrationFormService formService;
    
    public List<FormSubmission> getAllSubmissions() {
        log.info("Fetching all form submissions");
        return submissionRepository.findAll();
    }
    
    public List<FormSubmission> getSubmissionsByFormId(Long formId) {
        log.info("Fetching submissions for form id: {}", formId);
        return submissionRepository.findByFormIdOrderBySubmittedAtDesc(formId);
    }
    
    public Optional<FormSubmission> getSubmissionById(Long id) {
        log.info("Fetching submission with id: {}", id);
        return submissionRepository.findById(id);
    }
    
    @Transactional
    public FormSubmission createSubmission(FormSubmission submission) {
        log.info("Creating new form submission for form id: {}", submission.getFormId());
        
        // Check if form exists and is active
        RegistrationForm form = formService.getFormById(submission.getFormId())
            .orElseThrow(() -> new RuntimeException("Form not found"));
        
        if (!form.getIsActive()) {
            throw new RuntimeException("This form is no longer accepting submissions");
        }
        
        // Check if max submissions reached
        if (form.getMaxSubmissions() != null && form.getSubmissionCount() >= form.getMaxSubmissions()) {
            throw new RuntimeException("Maximum number of submissions reached");
        }
        
        FormSubmission saved = submissionRepository.save(submission);
        
        // Increment submission count
        formService.incrementSubmissionCount(submission.getFormId());
        
        return saved;
    }
    
    @Transactional
    public void deleteSubmission(Long id) {
        log.info("Deleting submission with id: {}", id);
        submissionRepository.deleteById(id);
    }
    
    public Long getSubmissionCount(Long formId) {
        return submissionRepository.countByFormId(formId);
    }
}

