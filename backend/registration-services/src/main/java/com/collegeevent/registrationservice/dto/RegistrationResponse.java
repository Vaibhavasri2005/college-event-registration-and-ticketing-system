package com.collegeevent.registrationservice.dto;

public record RegistrationResponse(
        Long registrationId,
        Long ticketId,
        String ticketCode,
        String studentName,
        String eventTitle,
        String status
) {
}