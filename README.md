# Real-Estate Sales Management System Backend

Comprehensive Node.js & PostgreSQL backend system built across four development stages, containerized with Docker, featuring modular architecture (Routes, Controllers, Services), atomic transactions, and financial projections.

---

## Prerequisites
- Docker Desktop (with Docker Compose v2)
- Node.js v18+ (optional, if running outside Docker)

---

## Environment Configuration
Create a `.env` file in the project root (or inside `backend/` if running locally) based on `.env.example`:

    PORT=3000
    DB_HOST=db
    DB_PORT=5432
    DB_NAME=sales_db
    DB_USER=postgres
    DB_PASSWORD=postgres

---

## Docker Quickstart & Management
Start the complete stack (PostgreSQL + Express Backend):

    docker compose up -d --build

Stop services while preserving database data:

    docker compose down

Completely reset the database volume and re-run initialization SQL scripts:

    docker compose down -v
    docker compose up -d --build

View container logs:

    docker compose logs -f

---

## Architecture & Codebase Structure
The backend follows a strict modular separation of concerns:
- **`Routes` (`backend/src/routes/`)**: Maps incoming HTTP requests to their respective controllers.
- **`Controllers` (`backend/src/controllers/`)**: Handles HTTP request validation, status codes, and response formatting.
- **`Services` (`backend/src/services/`)**: Encapsulates complex business logic, data assembly, and financial/date calculations (e.g., Sale Agreement & Handover Projections).

---

## Stages Overview & API Specifications

### Stage 1: Project Setup & Database Connectivity
- Foundation setup with Node.js, Express.js (ES Modules), and `pg` pool connectivity.
- Environment-driven configuration and graceful shutdown on DB startup failure.
- **GET /**: Health-check endpoint confirming API status (`200 OK`).

### Stage 2: Dockerization & Deterministic Initialization
- Multi-container architecture using `docker-compose.yml`.
- Automatic schema creation (`01-schema.sql`) and deterministic seed insertion (`02-seed.sql`) via `/docker-entrypoint-initdb.d/`.
- Health check via `pg_isready` ensuring backend starts only after the database is healthy.
- Internal service discovery using `DB_HOST=db`.

### Stage 3: Data Insertion APIs & Atomic Transactions
- **POST /api/projects**: Create an individual project with length validation and duplicate name rejection (`409 Conflict`).
- **POST /api/buildings**: Create a building linked to a verified project (`building_number` up to 10 chars, rejects duplicate per project).
- **POST /api/units**: Create an individual unit with schema default `AVAILABLE` status (`area > 0`, integer `floor`).
- **POST /api/sales**: Atomic sale creation package executed within a single transaction (`BEGIN` / `COMMIT` / `ROLLBACK`):
  - Pessimistic locking (`FOR UPDATE`) on the unit to prevent concurrent double-booking.
  - Inserts sale record with initial `RESERVED` status.
  - Inserts new customer(s) and phone number(s), and maps links in `customer_sale`.
  - Inserts one or more installment plans matching financial balance.
  - Transitions unit status to `RESERVED`.

### Stage 4: Read-Only GET Endpoints & Sale Agreement
- **GET /api/projects**: Returns all projects ordered alphabetically by `project_name` (`200 OK`).
- **GET /api/projects/:projectId/buildings**: Returns buildings belonging to the specified project, ordered by `building_number`. Validates positive integer IDs and existence (`400`, `404`).
- **GET /api/projects/:projectId/units**: Returns project details along with units grouped under their respective buildings (including empty buildings), sorted consistently by floor ascending then unit number.
- **GET /api/sales/:saleId/agreement**: Returns a complete, un-duplicated sale agreement object containing:
  - **Customers**: Array of customers with all associated phone numbers (using PostgreSQL JSON aggregation).
  - **Property Hierarchy**: Project, building, and unit details with precise financial formatting (e.g., area and prices formatted to 2 decimal places).
  - **Financial Terms & Installment Plans**: Full pricing, deposits, and installment schedules with calculated plan totals.
  - **Handover Summary**: As-of-date contractual projection (`scheduled_due_by_handover`, `percentage_due_by_handover`, and `calculation_status`).

#### Handover Percentage Calculation Specification
The scheduled amount by handover includes payment obligations whose associated dates fall **on or before** the handover date, including the handover payment itself:
- **Numerator**: Reservation amount (if date $\le$ handover date) + Contract amount (if date $\le$ handover date) + Handover amount + Sum of installment amounts due $\le$ handover date.
- **Denominator**: Unit sale price (`sale.price`).
- **Edge Cases Handled**: Missing handover dates (`MISSING_HANDOVER_DATE`), incomplete contract terms (`INCOMPLETE_TERMS`), and missing installment plans. Dates are formatted consistently as `DD-MM-YYYY`.
