# ValidateIQ Landing Page

A professional landing page for capturing early adopters of a startup idea validation tool. Built with FastAPI, React, PostgreSQL, and Docker.

## Features

- Modern dark mode design (Linear/Vercel/Stripe style)
- Full analytics tracking (visitors, page views, scroll depth, form interactions)
- Waitlist signup with position tracking
- Mobile-responsive design
- Docker containerization

## Quick Start

### Using Docker (Recommended)

```bash
docker-compose up --build
```

Visit `http://localhost:8000` to see the landing page.

### Development Setup

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Analytics Dashboard

Access analytics at `/api/stats/dashboard` (protect with auth in production).

## API Endpoints

- `POST /api/analytics/init` - Initialize visitor session
- `POST /api/analytics/event` - Track events
- `POST /api/analytics/beacon` - Send final metrics on page exit
- `POST /api/signups/` - Submit waitlist signup
- `GET /api/signups/count` - Get signup count
- `GET /api/stats/dashboard` - Get analytics dashboard

## Tech Stack

- **Backend**: Python 3.11 + FastAPI
- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Database**: PostgreSQL 15
- **Containerization**: Docker + Docker Compose

## License

MIT
