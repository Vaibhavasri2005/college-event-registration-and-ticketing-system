package com.collegeevent.registrationservice.repository;

import com.collegeevent.registrationservice.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationRepository
        extends JpaRepository<Registration, Long> {

    List<Registration> findByUserId(Long userId);

    long countByEventIdAndStatus(Long eventId, String status);
}




