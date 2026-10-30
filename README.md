# College Event Registration & Ticket Generation System

A smart, secure, and scalable **College Event Registration & Ticket Generation System** developed using React and Java Spring Boot Microservices. The application simplifies student event registration, prevents duplicate bookings and schedule conflicts, enforces event capacity limits, and automatically generates unique digital tickets after successful registration.

## Project Overview

The College Event Registration & Ticket Generation System provides a centralized platform where students can create accounts, log in securely, explore college events, view event details, and register for their preferred events.

The system uses a microservices architecture to separate authentication, event management, and registration and ticket generation. It enforces business rules at the backend to maintain data consistency, prevent scheduling conflicts, and ensure reliable ticket generation.

## Key Features

### 1. Digital Student Registration
- Secure student sign-up and sign-in.
- Email validation and duplicate account prevention.
- BCrypt password hashing.
- JWT-based authentication and authorization.
- Student details validation before registration.

### 2. Event Management
- Displays three college events with their schedules, venues, and capacity.
- Retrieves event information dynamically through REST APIs.
- Provides individual event details.
- Enforces a maximum capacity of 3 confirmed registrations per event.

### 3. Automated Schedule Conflict Detection
- Checks existing confirmed registrations before accepting a new booking.
- Compares event dates, start times, and end times.
- Prevents students from registering for overlapping events.
- Returns HTTP 409 Conflict when a scheduling conflict occurs.

### 4. Consistent Registration and Ticket Generation
- Generates a unique Ticket ID only after successful registration.
- Maintains a one-to-one relationship between registrations and tickets.
- Uses Spring `@Transactional` to maintain database consistency.
- Prevents ticket generation for failed registrations.

### 5. Event Capacity Enforcement
- Limits each event to a maximum of three confirmed students.
- Checks available seats before confirming registration.
- Uses database concurrency control to prevent overbooking.
- Rejects registrations when event capacity is reached.

### 6. Secure Backend
- JWT authentication and authorization.
- BCrypt password encryption (hashing).
- Protected REST API endpoints.
- Server-side validation.
- Centralized exception handling using `@ControllerAdvice`.

## Technology Stack

**Frontend:** HTML5, CSS3, JavaScript, React.js, React Router, Fetch API / Axios.

**Backend:** Java, Spring Boot, Spring Boot Microservices, Spring Cloud Gateway, Netflix Eureka Discovery Server, Spring Security, Spring Data JPA, Hibernate ORM, REST APIs, JWT, BCryptPasswordEncoder, Spring Validation, Spring `@Transactional`.

**Database:** MySQL 8.

**Development and Testing Tools:** IntelliJ IDEA, MySQL Workbench, Postman, Maven, Git, GitHub.

## Microservices Architecture

The application follows a Spring Boot microservices architecture consisting of the following services:

| Microservice | Responsibility | Port |
|---|---|---|
| Eureka Discovery Server | Registers and discovers backend services | 8761 |
| API Gateway | Central entry point and API request routing | 8080 |
| Auth/User Service | Student sign-up, sign-in, and JWT authentication | 8081 |
| Event Service | Event information and event management | 8082 |
| Registration & Ticket Service | Student registration, conflict detection, capacity enforcement, and ticket generation | Configure locally |

### API Gateway Routes

| API Route | Destination |
|---|---|
| `/api/auth/**` | Auth Service |
| `/api/events/**` | Event Service |
| `/api/registrations/**` | Registration & Ticket Service |
| `/api/tickets/**` | Registration & Ticket Service |

All frontend API requests are routed through the API Gateway.

## Initial College Events

The system is designed to manage the following three events:

| Event | Date | Time | Venue |
|---|---|---|---|
| Data Science & Big Data Symposium | 12 November 2026 | 9:00 AM – 11:00 AM | Room No. 101 |
| Artificial Intelligence & Machine Learning Workshop | 12 November 2026 | 10:00 AM – 12:00 PM | Room No. 102 |
| Cybersecurity & Ethical Hacking Workshop | 12 November 2026 | 1:00 PM – 3:00 PM | Room No. 103 |

**Maximum Capacity:** 3 confirmed students per event.

## Database Design

The application uses MySQL for persistent data storage.

The main database tables are:

- **users:** Stores student account details, email addresses, and securely hashed passwords.
- **events:** Stores event titles, dates, schedules, venues, and capacity.
- **registrations:** Stores student information, selected event details, and registration status.
- **tickets:** Stores unique ticket identifiers and corresponding registration references.

### Database Constraints

- UNIQUE constraint on user email addresses.
- UNIQUE constraint on student register numbers.
- Foreign key relationships between users, events, and registrations.
- UNIQUE constraint on ticket identifiers.
- UNIQUE constraint on ticket registration references.
- Composite UNIQUE constraint on user ID and event ID to prevent duplicate event registrations.

## Registration Workflow

1. A student creates an account using an email address and password.
2. The backend validates the credentials and securely stores the password hash.
3. The student signs in and receives a JWT.
4. The student views available college events.
5. The student selects an event and enters the required registration details.
6. The backend validates the JWT and student information.
7. The system verifies the selected event and checks existing confirmed registrations for scheduling conflicts.
8. The system checks event capacity and prevents overbooking.
9. If all validations succeed, the registration is saved.
10. A unique Ticket ID is generated and saved.
11. The frontend displays the registration confirmation and digital ticket.

## Business Rules

| Business Rule | Expected Behaviour |
|---|---|
| Duplicate account prevention | Rejects an already-registered email address. |
| Duplicate event registration | Prevents the same student from registering twice for the same event. |
| Schedule conflict detection | Rejects overlapping event registrations. |
| Event capacity | Allows a maximum of 3 confirmed registrations per event. |
| Authentication | Only authenticated students can register. |
| Ticket generation | Generates a ticket only after successful registration. |
| Data consistency | Registration and ticket records are committed or rolled back together. |

## API Testing

Postman is used to test the backend REST APIs.

Important test scenarios include:

- Successful student registration and login.
- Duplicate email registration.
- Retrieving all college events.
- Retrieving individual event details.
- Successful event registration.
- Duplicate event registration attempts.
- Registration for overlapping events.
- Registration when event capacity is full.
- Unauthorized registration attempts.
- Successful Ticket ID generation.
- Verification that failed registrations do not generate tickets.

## Installation and Setup

### Prerequisites

Install the following software:

- Java Development Kit (JDK)
- Node.js and npm
- MySQL Server 8
- MySQL Workbench
- Maven
- IntelliJ IDEA
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Navigate to the project directory:

```bash
cd YOUR_REPOSITORY
```

### 2. Configure MySQL

1. Start your MySQL server.
2. Create the required database.
3. Configure database connection properties in each backend microservice.
4. Update the database username and password in the application configuration files.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/college_event_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

Use the database names and configuration actually defined in your services.

### 3. Start Backend Microservices

Open each Spring Boot microservice in IntelliJ IDEA and start the applications in the following order:

1. Eureka Discovery Server.
2. Auth/User Service.
3. Event Service.
4. Registration & Ticket Service.
5. Spring Cloud API Gateway.

Ensure all services register successfully with Eureka and that the gateway routes are configured correctly.

### 4. Start the React Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal to access the application.

## Expected Outcome

The application provides a centralized and secure college event registration platform that minimizes manual registration errors, prevents duplicate bookings, detects schedule conflicts, enforces event capacity, and maintains consistency between registration records and generated digital tickets.

## Future Enhancements

- QR-code-based digital ticket verification.
- Email notifications for successful registrations.
- Admin dashboard for event management.
- Student registration history.
- Ticket scanning and attendance tracking.
- Event analytics and reporting.

## Author

**Developed as an academic application using React.js, Java Spring Boot Microservices, and MySQL.**
