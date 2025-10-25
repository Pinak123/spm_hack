"""
Student database model
"""
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from ..database import Base


class Student(Base):
    """Student model for the students table"""
    
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    cohort = Column(String, nullable=True)
    wellbeing_score = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

