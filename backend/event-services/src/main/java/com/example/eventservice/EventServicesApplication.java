package com.example.eventservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class EventServicesApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventServicesApplication.class, args);
    }
}
