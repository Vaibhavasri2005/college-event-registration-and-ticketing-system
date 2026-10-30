package com.example.eventservice.config;

import com.example.eventservice.model.Event;
import com.example.eventservice.repository.EventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EventRepository eventRepository;

    public DataInitializer(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public void run(String... args) {
        // Seed only when the table is empty.
        if (eventRepository.count() == 0) {
            LocalDate eventDate = LocalDate.of(2026, 11, 12);

            eventRepository.saveAll(List.of(
                    new Event(
                            "Data Science & Big Data Symposium",
                            eventDate,
                            LocalTime.of(9, 0),
                            LocalTime.of(11, 0),
                            "Room No. 101",
                            3
                    ),
                    new Event(
                            "Artificial Intelligence & Machine Learning Workshop",
                            eventDate,
                            LocalTime.of(10, 0),
                            LocalTime.of(12, 0),
                            "Room No. 102",
                            3
                    ),
                    new Event(
                            "Cybersecurity & Ethical Hacking Workshop",
                            eventDate,
                            LocalTime.of(13, 0),
                            LocalTime.of(15, 0),
                            "Room No. 103",
                            3
                    )
            ));
        }
    }
}
