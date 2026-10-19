package com.gdg.backend.service;

import com.gdg.backend.model.RegistrationForm;
import com.gdg.backend.repository.RegistrationFormRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationFormService {
    
    private final RegistrationFormRepository formRepository;
    
    public List<RegistrationForm> getAllForms() {
        log.info("Fetching all registration forms");
        return formRepository.findAll();
    }
    
    public Optional<RegistrationForm> getFormById(Long id) {
        log.info("Fetching form with id: {}", id);
        return formRepository.findById(id);
    }
    
    public Optional<RegistrationForm> getFormByEventId(Long eventId) {
        log.info("Fetching form for event id: {}", eventId);
        return formRepository.findByEventId(eventId);
    }
    
    @Transactional
    public RegistrationForm createForm(RegistrationForm form) {
        log.info("Creating new registration form: {}", form.getTitle());
        form.setSubmissionCount(0);
        return formRepository.save(form);
    }
    
    @Transactional
    public RegistrationForm updateForm(Long id, RegistrationForm formDetails) {
        log.info("Updating registration form with id: {}", id);
        
        RegistrationForm form = formRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Form not found with id: " + id));
        
        form.setTitle(formDetails.getTitle());
        form.setDescription(formDetails.getDescription());
        form.setEventId(formDetails.getEventId());
        form.setHeaderImage(formDetails.getHeaderImage());
        form.setFormFields(formDetails.getFormFields());
        form.setIsActive(formDetails.getIsActive());
        form.setMaxSubmissions(formDetails.getMaxSubmissions());
        form.setCloseDate(formDetails.getCloseDate());
        
        return formRepository.save(form);
    }
    
    @Transactional
    public void deleteForm(Long id) {
        log.info("Deleting registration form with id: {}", id);
        formRepository.deleteById(id);
    }
    
    @Transactional
    public void incrementSubmissionCount(Long formId) {
        RegistrationForm form = formRepository.findById(formId)
            .orElseThrow(() -> new RuntimeException("Form not found with id: " + formId));
        
        form.setSubmissionCount(form.getSubmissionCount() + 1);
        formRepository.save(form);
    }
}

