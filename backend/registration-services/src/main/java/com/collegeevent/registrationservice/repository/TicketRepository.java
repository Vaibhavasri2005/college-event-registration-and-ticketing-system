package com.collegeevent.registrationservice.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.collegeevent.registrationservice.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByRegistrationRegistrationId(Long registrationId);
}

