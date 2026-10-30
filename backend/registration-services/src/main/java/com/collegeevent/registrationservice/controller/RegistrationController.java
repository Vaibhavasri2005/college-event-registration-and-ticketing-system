package com.collegeevent.registrationservice.controller;

import com.collegeevent.registrationservice.dto.RegistrationResponse;
import com.collegeevent.registrationservice.model.Registration;
import com.collegeevent.registrationservice.model.Ticket;
import com.collegeevent.registrationservice.repository.TicketRepository;
import com.collegeevent.registrationservice.service.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }
    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(
            @Valid @RequestBody Registration registration) {

        return ResponseEntity.ok(
                registrationService.registerUser(registration)
        );
    }

    @DeleteMapping("/{registrationId}")
    public ResponseEntity<Void> deleteRegistration(
            @PathVariable Long registrationId) {
        registrationService.deleteRegistration(registrationId);
        return ResponseEntity.noContent().build();
    }


}
