# Patient Portal

A full-stack patient management portal built with Next.js (frontend), Express/Node.js (backend), and SQLite (database). The project supports user authentication, patient CRUD operations, admin/user roles, and image upload for patient profiles. The backend and frontend are containerized using Docker and managed with a Makefile for easy development and deployment.

---

## Features

- **User Authentication:** Sign up, login, and role-based access (admin/user).
- **Patient Management:** Add, edit, delete, and view patient records.
- **Profile Images:** Upload and display patient profile images.
- **Responsive UI:** Sidebar navigation with adaptive layout.
- **Dockerized:** Easy setup and consistent environments using Docker Compose.
- **Environment Variables:** Configurable API endpoints and secrets via `.env` files.

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/patient-portal.git
cd patient-portal
```

### 2. Environment Variables

#### Backend (`backend/.env`)
Create a file at `backend/.env` and set your secrets:
```
JWT_SECRET=your_jwt_secret
DB_FILE=/data/patients.sqlite3
```

#### Frontend (`frontend/.env.local`)
Create a file at `frontend/.env.local` and set the API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
> **Note:**  
> If you deploy the backend elsewhere, update `NEXT_PUBLIC_API_URL` accordingly.

---

## Running the Project

All commands below are run from the project root.

### Build and Start (with Docker)

```sh
make build
```
This will build and start both backend and frontend containers.

### Start (without rebuilding)

```sh
make start
```

### Stop

```sh
make stop
```

### Restart (with rebuild)

```sh
make restart
```

### View Logs

- All logs: `make logs`
- Backend only: `make logs-backend`
- Frontend only: `make logs-frontend`
- Database only: `make logs-db`

### Clean (remove containers and volumes)

```sh
make clean
```

---

## Database Persistence

- The SQLite database file is stored in a Docker volume named `backend_data`.
- Data will persist between container restarts unless you run `make clean`.

---

## Project Structure

```
patient-portal/
├── backend/      # Express API, SQLite, authentication, patient routes
├── frontend/     # Next.js app, React components, API calls
├── docker-compose.yml
├── makefile
└── README.md
```

---

## Notes

- The frontend expects the backend to be available at the URL specified in `NEXT_PUBLIC_API_URL`.
- For image optimization, external image domains (e.g., `ui-avatars.com`) must be added to `frontend/next.config.js`.
- For production, set appropriate values in your `.env` files.

---

##
