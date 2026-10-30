package com.collegeevent.registrationservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Registration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long registrationId;

    private Long userId; // From JWT/Header
    private Long eventId;

    @NotBlank(message = "Student name is required")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Student name must contain only letters and spaces")
    private String studentName;

    @NotBlank(message = "College name is required")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "College name must contain only letters and spaces")
    private String collegeName;

    @NotBlank(message = "Register number is required")
    @Pattern(regexp = "^[0-9]+$", message = "Register number must contain only numbers")
    @Column(unique = true)
    private String registerNumber;

    @NotBlank(message = "Department is required")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Department must contain only letters and spaces")
    private String department;

    @NotNull(message = "Year is required")
    @Min(value = 1, message = "Year must be at least 1")
    @Max(value = 4, message = "Year must be at most 4")
    private Integer year;

    private String status; // e.g., "CONFIRMED"

    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "registration", cascade = CascadeType.ALL)
    private Ticket ticket;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
