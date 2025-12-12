from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import os

from backend.database import get_engine, Base
from backend.routers import analytics, signups, stats


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: nothing to do


app = FastAPI(
    title="ValidateIQ API",
    description="Landing page API with analytics tracking",
    version="1.0.0",
    lifespan=lifespan
)

# Include routers
app.include_router(analytics.router)
app.include_router(signups.router)
app.include_router(stats.router)

# Serve static files (React build)
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"

if frontend_dist.exists():
    # Serve static assets
    app.mount("/assets", StaticFiles(directory=frontend_dist / "assets"), name="assets")

    # Serve the React app for all other routes
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Don't serve React for API routes
        if full_path.startswith("api/"):
            return {"error": "Not found"}

        # Try to serve the file if it exists
        file_path = frontend_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)

        # Otherwise, serve index.html (SPA routing)
        return FileResponse(frontend_dist / "index.html")


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "ValidateIQ"}
