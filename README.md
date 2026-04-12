<p align="center">
  <img src="./frontend/public/taski-wordmark.svg" alt="TASKI wordmark" width="260" />
</p>

<p align="center" ><a href="https://taski-u0yyffaau-ghada-chs-projects.vercel.app/login">viste TASKI website</a></p>
<p align="center">
  <strong>A full-stack project management platform for teams that need clarity, speed, and visibility.</strong>
</p>

<p align="center">
  TASKI helps teams organize projects, assign tasks, monitor progress, track deadlines, and coordinate work through a modern dashboard, kanban board, calendar view, and secure authentication flow.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" />
  <img alt="React" src="https://img.shields.io/badge/React-19-20232A?logo=react" />
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs" />
  <img alt="GraphQL" src="https://img.shields.io/badge/GraphQL-Apollo-E10098?logo=graphql" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
</p>

---

## Overview

TASKI is built as a full-stack workspace for managing team execution from planning to delivery. It combines:

- project tracking
- task assignment and updates
- progress and status monitoring
- deadline visualization
- role-aware authentication
- a dark, modern UI focused on productivity

The application is split into:

- `frontend/`: Next.js app with React, Tailwind CSS, NextAuth, and rich UI pages
- `backend/`: NestJS GraphQL API with Prisma and PostgreSQL

---

## Product Highlights

### Dashboard
- Summarizes projects and task activity
- Surfaces progress and operational visibility

### Projects
- Lists all projects with status, progress, and dates
- Supports creating projects directly from the UI
- Persists project data to PostgreSQL through GraphQL mutations

### Tasks
- Kanban-style drag-and-drop board
- Supports creating tasks from the UI
- Updates task status directly in the database

### Calendar
- Displays project deadlines by month
- Uses status-aware styling for project items

### Authentication
- Credentials-based login
- JWT-backed authorization
- NextAuth on the frontend, NestJS auth flow on the backend

---

## Visual Architecture

### Platform Flow

```mermaid
flowchart LR
    U[User] --> F[Next.js Frontend]
    F --> A[NextAuth]
    F --> G[GraphQL API]
    G --> N[NestJS Backend]
    N --> P[Prisma ORM]
    P --> D[(PostgreSQL)]
```

### Core Domain Model

```mermaid
erDiagram
    USER ||--o{ PROJECT : creates
    USER ||--o{ TASK : assigned_to
    USER ||--o{ TASK : created_by
    PROJECT ||--o{ TASK : contains

    USER {
      string id
      string name
      string email
      string role
      string job
    }

    PROJECT {
      string id
      string name
      string description
      datetime start_date
      datetime end_date
      string progress
      string status
      string created_by
    }

    TASK {
      string id
      string title
      string description
      string status
      boolean isCompleted
      datetime dueDate
      string Priority
      string projectId
      string assignedToId
      string createdById
    }
```

---

## Tech Stack

## Frontend

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `NextAuth`
- `Apollo Client`
- `TanStack React Query`
- `dnd-kit`
- `FullCalendar`
- `React Icons`

## Backend

- `NestJS 11`
- `GraphQL` with Apollo driver
- `Prisma ORM`
- `PostgreSQL`
- `JWT authentication`
- `Passport`
- `bcrypt`

## Tooling

- `TypeScript`
- `ESLint`
- `Prettier`
- `Jest`
- `ts-node`

---

## Repository Structure

```text
TASKI/
├── frontend/
│   ├── app/
│   │   ├── api/auth/[...nextauth]/
│   │   ├── calendar/
│   │   ├── dashboard/
│   │   ├── deadlines/
│   │   ├── login/
│   │   ├── projects/
│   │   ├── settings/
│   │   └── tasks/
│   ├── components/
│   ├── public/
│   └── src/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── auth/
│   │   ├── prisma/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── users/
│   └── test/
└── README.md
```

---

## Features In Detail

### 1. Project Management
- Create projects from the frontend UI
- Store project metadata in PostgreSQL
- Track start date, end date, progress, and project health status

### 2. Task Workflow
- Create tasks and assign them to users
- Attach tasks to specific projects
- Move tasks between workflow columns
- Sync task status changes with the backend

### 3. Progress Tracking
- Backend recalculates project progress based on completed tasks
- Project state reflects delivery risk and overall status

### 4. Calendar Scheduling
- Visual monthly deadline planning
- Status-based project markers for faster scanning

### 5. Authentication and Security
- Login through credentials
- JWT token issued by backend
- Token passed from NextAuth session to protected GraphQL mutations

---

## Backend Modules

### Auth Module
- Validates users
- Issues JWT access tokens
- Supports login mutation

### Users Module
- Exposes user information to the frontend
- Supports settings and profile-related flows

### Projects Module
- Handles project queries and mutations
- Persists project creation and updates

### Tasks Module
- Handles task queries and mutations
- Updates workflow state and project-linked progress

### Prisma Module
- Centralizes database access
- Connects NestJS services with PostgreSQL

---

## Frontend Experience

The frontend is designed around productivity views:

- `Dashboard`: high-level overview
- `Projects`: structured project list with creation flow
- `Tasks`: drag-and-drop kanban board
- `Calendar`: deadline planning
- `Settings`: user profile and account management
- `Login`: branded authentication entry point

The app uses a dark visual language with blue-indigo accents to keep the interface consistent across pages.

---

## Environment Variables

### Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/graphql
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Backend

Create `backend/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/taski
JWT_SECRET=your_jwt_secret
```

---

## Getting Started

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd TASKI
```

## 2. Install dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

## 3. Configure environment files

- add `frontend/.env.local`
- add `backend/.env`

## 4. Run database migrations

```bash
cd backend
npx prisma migrate deploy
```

For local development, you can also use:

```bash
npx prisma migrate dev
```

## 5. Seed the database

```bash
cd backend
npm run seed
```

## 6. Start the backend

```bash
cd backend
npm run start:dev
```

The GraphQL API runs on:

```text
http://localhost:4000/graphql
```

## 7. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run start
```

### Backend

```bash
npm run start:dev
npm run build
npm run test
npm run test:e2e
npm run seed
```

---

## API Style

The backend exposes a GraphQL API with queries and mutations such as:

- `login`
- `projects`
- `createProject`
- `tasks`
- `createTask`
- `updateTask`
- `users`

GraphQL schema is generated to:

```text
backend/src/schema.gql
```

---

## Database Design

The PostgreSQL schema is managed through Prisma and currently includes:

- `User`
- `Project`
- `Task`

Key relationships:

- one user can create many projects
- one project can contain many tasks
- one user can create many tasks
- one user can be assigned many tasks

---

## UI and Interaction Notes

- Dark-mode-inspired interface across primary pages
- Animated, branded login experience
- Responsive layouts for core management screens
- Drag-and-drop interactions for task movement
- Visual status indicators for projects and deadlines

---

## Current Strengths

- clear separation between frontend and backend
- GraphQL-based integration
- modern TypeScript stack
- practical domain model for team productivity
- already includes authentication, planning, workflow, and scheduling

---

## Future Improvements

- role-based permissions and admin controls
- notifications and reminders
- file attachments and project comments
- analytics and reporting
- audit log for task and project updates
- deployment guides for Vercel and cloud-hosted PostgreSQL

---

## Authoring Notes

This repository contains both the product interface and the API layer, making it a strong portfolio-grade full-stack project for:

- software engineering showcases
- university capstone presentations
- team collaboration demos
- product management and workflow prototypes

---

## License

This project is currently provided as `UNLICENSED` in the backend package configuration.  
Add the license you want before publishing publicly.

