"""
Configuration management for the application
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings"""
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./students.db")
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    

settings = Settings()

