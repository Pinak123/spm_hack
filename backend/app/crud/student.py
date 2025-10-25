"""
CRUD operations for Student model
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.student import Student
from ..schemas.student import StudentCreate, StudentUpdate


def get_students(db: Session, skip: int = 0, limit: int = 100) -> List[Student]:
    """
    Get a list of students with pagination
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        
    Returns:
        List of Student objects
    """
    return db.query(Student).offset(skip).limit(limit).all()


def get_student(db: Session, student_id: int) -> Optional[Student]:
    """
    Get a single student by ID
    
    Args:
        db: Database session
        student_id: ID of the student
        
    Returns:
        Student object or None if not found
    """
    return db.query(Student).filter(Student.id == student_id).first()


def get_student_by_email(db: Session, email: str) -> Optional[Student]:
    """
    Get a single student by email
    
    Args:
        db: Database session
        email: Email of the student
        
    Returns:
        Student object or None if not found
    """
    return db.query(Student).filter(Student.email == email).first()


def create_student(db: Session, student: StudentCreate) -> Student:
    """
    Create a new student
    
    Args:
        db: Database session
        student: Student data
        
    Returns:
        Created Student object
    """
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


def update_student(db: Session, student_id: int, student: StudentUpdate) -> Optional[Student]:
    """
    Update an existing student
    
    Args:
        db: Database session
        student_id: ID of the student to update
        student: Updated student data
        
    Returns:
        Updated Student object or None if not found
    """
    db_student = get_student(db, student_id)
    if db_student:
        for key, value in student.model_dump(exclude_unset=True).items():
            setattr(db_student, key, value)
        db.commit()
        db.refresh(db_student)
    return db_student


def delete_student(db: Session, student_id: int) -> bool:
    """
    Delete a student
    
    Args:
        db: Database session
        student_id: ID of the student to delete
        
    Returns:
        True if deleted, False if not found
    """
    db_student = get_student(db, student_id)
    if db_student:
        db.delete(db_student)
        db.commit()
        return True
    return False

