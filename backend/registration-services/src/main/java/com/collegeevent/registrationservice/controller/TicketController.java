package com.collegeevent.registrationservice.controller;

import com.collegeevent.registrationservice.model.Ticket;
import com.collegeevent.registrationservice.repository.TicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;

    public TicketController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @GetMapping("/registration/{registrationId}")
    public ResponseEntity<Ticket> getByRegistrationId(
            @PathVariable Long registrationId) {

        return ticketRepository
                .findByRegistrationRegistrationId(registrationId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}