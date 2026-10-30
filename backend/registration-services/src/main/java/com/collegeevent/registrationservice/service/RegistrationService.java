package com.collegeevent.registrationservice.service;

import com.collegeevent.registrationservice.dto.EventDto;
import com.collegeevent.registrationservice.dto.RegistrationResponse;
import com.collegeevent.registrationservice.exception.ScheduleConflictException;
import com.collegeevent.registrationservice.model.Registration;
import com.collegeevent.registrationservice.model.Ticket;
import com.collegeevent.registrationservice.repository.RegistrationRepository;
import com.collegeevent.registrationservice.repository.TicketRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final TicketRepository ticketRepository;
    private final RestTemplate restTemplate;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            TicketRepository ticketRepository,
            RestTemplate restTemplate) {
        this.registrationRepository = registrationRepository;
        this.ticketRepository = ticketRepository;
        this.restTemplate = restTemplate;
    }
    @Transactional
    public RegistrationResponse registerUser(Registration registration) {

        // 1. Fetch and validate the requested event.
        EventDto event = getEvent(registration.getEventId());

        // 2. Check schedule conflicts.
        checkScheduleConflict(registration.getUserId(), event);

        // 3. Check event capacity.
        long currentConfirmed = registrationRepository
                .countByEventIdAndStatus(registration.getEventId(), "CONFIRMED");

        if (currentConfirmed >= 3) {
            throw new IllegalStateException("Event capacity reached");
        }

        // 4. Save registration.
        registration.setStatus("CONFIRMED");

        Registration savedRegistration =
                registrationRepository.save(registration);

        // 5. Generate unique ticket code.
        Ticket ticket = new Ticket();

        ticket.setTicketCode(
                "TKT-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        ticket.setRegistration(savedRegistration);

        // 6. Save ticket.
        Ticket savedTicket = ticketRepository.save(ticket);

        savedRegistration.setTicket(savedTicket);

        // 7. Return DTO instead of Registration entity.
        return new RegistrationResponse(
                savedRegistration.getRegistrationId(),
                savedTicket.getTicketId(),
                savedTicket.getTicketCode(),
                savedRegistration.getStudentName(),
                event.getTitle(),
                savedRegistration.getStatus()
        );
    }


    @Transactional
    public void deleteRegistration(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Registration not found: " + registrationId
                ));

        registrationRepository.delete(registration);
    }

    private EventDto getEvent(Long eventId) {
        try {
            EventDto event = restTemplate.getForObject(
                    "http://event-service/api/events/{eventId}",
                    EventDto.class,
                    eventId
            );

            if (event == null) {
                throw new IllegalArgumentException(
                        "Event not found: " + eventId
                );
            }

            return event;
        } catch (RestClientException exception) {
            throw new IllegalStateException(
                    "Could not retrieve event " + eventId
                            + " from Event Service",
                    exception
            );
        }
    }

    private void checkScheduleConflict(Long userId, EventDto requestedEvent) {
        List<Registration> existingRegistrations =
                registrationRepository.findByUserId(userId);

        for (Registration existingRegistration : existingRegistrations) {
            if ("CANCELLED".equalsIgnoreCase(existingRegistration.getStatus())) {
                continue;
            }

            EventDto existingEvent = getEvent(existingRegistration.getEventId());

            boolean sameDate = requestedEvent.getDate()
                    .equals(existingEvent.getDate());

            boolean timeOverlaps =
                    requestedEvent.getStartTime()
                            .isBefore(existingEvent.getEndTime())
                            && existingEvent.getStartTime()
                            .isBefore(requestedEvent.getEndTime());

            if (sameDate && timeOverlaps) {
                throw new ScheduleConflictException(
                        "This event overlaps with an event you are already registered for."
                );
            }
        }
    }
}
