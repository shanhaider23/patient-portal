# Patient Portal

A **full-stack patient management portal** built with **Next.js** (frontend), **Express/Node.js** (backend), and **SQLite** (database).  
The app provides secure patient record management with **authentication**, **role-based permissions**, **CRUD operations**, and **profile image uploads**.  
Both backend and frontend are containerized with **Docker** and controlled via a **Makefile** for consistent development and deployment.  
Includes **Jest + Supertest backend tests** and a **GitHub Actions workflow** for automated CI testing.
<img width="999" height="751" alt="Screenshot 2025-08-14 091645" src="https://github.com/user-attachments/assets/472b6967-3e36-47d9-8101-c8ae19b53bca" />
<img width="1416" height="904" alt="Screenshot 2025-08-14 091450" src="https://github.com/user-attachments/assets/959697fb-d8de-4f87-a963-eeef4c13c9d7" />

---

## Features

- **User Authentication**
  - Sign up and login with JWT authentication
  - Role-based access: admin & user
- **Patient Management**
  - Create, read, update, and delete patient records
  - Upload and display patient profile images
- **Responsive UI**
  - Sidebar navigation
  - Mobile and desktop adaptive layout
- **Environment Variables**
  - Configurable API URLs and secrets via `.env` files
- **Backend Testing**
  - Jest + Supertest API tests for authentication and patient endpoints
- **Continuous Integration**
  - GitHub Actions workflow runs backend tests on push/pull requests
- **Dockerized**
  - Backend, frontend, and database in separate containers

---

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/shanhaider23/patient-portal.git
cd patient-portal


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
├── backend/                  # Express API, SQLite, auth, routes, tests
│   ├── src/                  # Backend source code
│   ├── tests/                # Jest + Supertest test files
│   └── .env                  # Backend environment variables
├── frontend/                 # Next.js app, components, pages
│   └── .env.local            # Frontend environment variables
├── docker-compose.yml
├── makefile
├── .github/
│   └── workflows/
│       └── backend-tests.yml
└── README.md

```

---

## Notes

- Frontend communicates with backend via NEXT_PUBLIC_API_URL

- Backend tests run both locally and in GitHub Actions CI

- Docker ensures consistent local and production environments

---

##
