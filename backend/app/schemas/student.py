"""
Pydantic schemas for Student API
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class StudentBase(BaseModel):
    """Base schema for Student"""
    
    name: str
    email: EmailStr
    cohort: Optional[str] = None
    wellbeing_score: Optional[float] = None


class StudentCreate(StudentBase):
    """Schema for creating a new student"""
    pass


class StudentUpdate(StudentBase):
    """Schema for updating a student"""
    pass


class StudentRead(StudentBase):
    """Schema for reading student data"""
    
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True  # Enables compatibility with SQLAlchemy models

