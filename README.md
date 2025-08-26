# Hospital Bed Allocation System (Mini Project)

A compact MERN + Next.js 14 full-stack project demonstrating OS, DSA, and DBMS concepts:

- **DSA**: Priority Queue (severity-based patient admission)
- **OS**: Banker's Algorithm for safe ICU bed allocation
- **DBMS**: MongoDB with transaction rollback for unsafe allocations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TailwindCSS, Shadcn/UI
- **Backend**: Express, Node.js, TypeScript
- **Database**: MongoDB (Mongoose)

## Features

- Patient admission form (/admit)
- Bed allocation with priority queue and Banker's Algorithm
- Dashboard: patients, ICU bed usage, logs

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env # or set MONGO_URI and PORT in .env
npm run dev:server
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev:client
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

- `POST /api/patient` – Admit patient
- `GET /api/patients` – List patients
- `POST /api/allocate` – Run allocation
- `GET /api/resources` – ICU bed usage
- `GET /api/logs` – System logs

## Notes

- ICU bed resource must be initialized in DB as `{ name: "ICU_BED", totalUnits: 10, allocatedUnits: 0 }`
- PriorityQueue and Banker's Algorithm are implemented with TODOs for further study.
