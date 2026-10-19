package com.gdg.backend.controller;

import com.gdg.backend.model.RegistrationForm;
import com.gdg.backend.service.RegistrationFormService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forms")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RegistrationFormController {
    
    private final RegistrationFormService formService;
    
    @GetMapping
    public ResponseEntity<List<RegistrationForm>> getAllForms() {
        log.info("GET /api/forms - Fetching all registration forms");
        try {
            List<RegistrationForm> forms = formService.getAllForms();
            return ResponseEntity.ok(forms);
        } catch (Exception e) {
            log.error("Error fetching forms", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RegistrationForm> getFormById(@PathVariable Long id) {
        log.info("GET /api/forms/{} - Fetching form", id);
        try {
            return formService.getFormById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching form", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<RegistrationForm> getFormByEventId(@PathVariable Long eventId) {
        log.info("GET /api/forms/event/{} - Fetching form for event", eventId);
        try {
            return formService.getFormByEventId(eventId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching form for event", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<RegistrationForm> createForm(@RequestBody RegistrationForm form) {
        log.info("POST /api/forms - Creating new form: {}", form.getTitle());
        try {
            RegistrationForm created = formService.createForm(form);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            log.error("Error creating form", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RegistrationForm> updateForm(
        @PathVariable Long id,
        @RequestBody RegistrationForm form
    ) {
        log.info("PUT /api/forms/{} - Updating form", id);
        try {
            RegistrationForm updated = formService.updateForm(id, form);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            log.error("Form not found", e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error updating form", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForm(@PathVariable Long id) {
        log.info("DELETE /api/forms/{} - Deleting form", id);
        try {
            formService.deleteForm(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting form", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

