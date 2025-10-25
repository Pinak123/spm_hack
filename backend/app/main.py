"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import engine, Base
from .api import student

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Student Well-being Dashboard API",
    description="Backend API for managing student well-being data",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(student.router, tags=["students"])


@app.get("/", tags=["root"])
def read_root():
    """
    Root endpoint - API health check
    """
    return {
        "message": "Welcome to Student Well-being Dashboard API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health", tags=["health"])
def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}

