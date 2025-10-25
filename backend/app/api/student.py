"""
API endpoints for Student operations
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.student import StudentCreate, StudentRead, StudentUpdate
from ..crud import student as crud

router = APIRouter()


@router.get("/students", response_model=List[StudentRead], status_code=status.HTTP_200_OK)
def get_all_students(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all students with pagination
    
    Args:
        skip: Number of records to skip (default: 0)
        limit: Maximum number of records to return (default: 100)
        db: Database session
        
    Returns:
        List of students
    """
    students = crud.get_students(db, skip=skip, limit=limit)
    return students


@router.get("/students/{student_id}", response_model=StudentRead, status_code=status.HTTP_200_OK)
def get_student_by_id(
    student_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a single student by ID
    
    Args:
        student_id: ID of the student
        db: Database session
        
    Returns:
        Student data
        
    Raises:
        HTTPException: If student not found
    """
    student = crud.get_student(db, student_id=student_id)
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found"
        )
    return student


@router.post("/students", response_model=StudentRead, status_code=status.HTTP_201_CREATED)
def create_new_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new student
    
    Args:
        student: Student data
        db: Database session
        
    Returns:
        Created student data
        
    Raises:
        HTTPException: If email already exists
    """
    # Check if email already exists
    existing_student = crud.get_student_by_email(db, email=student.email)
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    return crud.create_student(db, student=student)


@router.put("/students/{student_id}", response_model=StudentRead, status_code=status.HTTP_200_OK)
def update_existing_student(
    student_id: int,
    student: StudentUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing student
    
    Args:
        student_id: ID of the student to update
        student: Updated student data
        db: Database session
        
    Returns:
        Updated student data
        
    Raises:
        HTTPException: If student not found or email already exists
    """
    # Check if student exists
    existing_student = crud.get_student(db, student_id=student_id)
    if existing_student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found"
        )
    
    # Check if email is being changed and if it already exists
    if student.email != existing_student.email:
        email_exists = crud.get_student_by_email(db, email=student.email)
        if email_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    updated_student = crud.update_student(db, student_id=student_id, student=student)
    return updated_student


@router.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a student
    
    Args:
        student_id: ID of the student to delete
        db: Database session
        
    Raises:
        HTTPException: If student not found
    """
    success = crud.delete_student(db, student_id=student_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found"
        )
    return None

