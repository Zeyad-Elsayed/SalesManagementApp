# Real-Estate Sales System Backend (Stage 1 & Stage 2 - Dockerized)

Backend service and PostgreSQL database containerized with Docker and Docker Compose.

## 1. Prerequisites
- Docker Desktop (with Docker Compose v2)
- Node.js v18+ (only if running locally outside Docker)

## 2. Environment Configuration
The project works out of the box with Docker Compose default environment variables, or you can copy .env.example to .env and customize it:

    cp .env.example .env

Required variables:
- PORT=3000
- DB_HOST=db (inside Docker Compose) or localhost (when running locally)
- DB_PORT=5432
- DB_NAME=sales_db
- DB_USER=postgres
- DB_PASSWORD=your_password

## 3. Required Docker Commands

Start and build containers (foreground):

    docker compose up --build

Start in detached mode (background):

    docker compose up -d --build

Stop containers while preserving database data:

    docker compose down

Completely reset the development database (removes volume and re-runs 01-schema.sql and 02-seed.sql):

    docker compose down -v
    docker compose up --build

Inspect running services:

    docker compose ps

Inspect logs:

    docker compose logs
    docker compose logs backend
    docker compose logs db

## 4. API Verification Endpoints

Health Check Endpoint:

    curl -i http://localhost:3000/

Database-Backed Projects Endpoint (reads seeded records):

    curl -i http://localhost:3000/api/projects
