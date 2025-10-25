# Student Well-being Dashboard - Backend API

A FastAPI backend application for managing student well-being data with SQLite database.

## Features

- RESTful API endpoints for student management
- SQLite database with SQLAlchemy ORM
- Pydantic models for data validation
- CORS support for frontend integration
- Comprehensive CRUD operations

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Server**: Uvicorn

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── database.py          # Database setup and session management
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py
│   │   └── student.py       # Student model
│   ├── schemas/             # Pydantic schemas
│   │   ├── __init__.py
│   │   └── student.py       # Student schemas
│   ├── crud/                # CRUD operations
│   │   ├── __init__.py
│   │   └── student.py       # Student CRUD operations
│   └── api/                 # API routes
│       ├── __init__.py
│       └── student.py       # Student endpoints
├── .env.example             # Environment variables template
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Modify `.env` if needed (optional, defaults work fine)

### Running the Application

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive API docs (Swagger)**: http://localhost:8000/docs
- **Alternative API docs (ReDoc)**: http://localhost:8000/redoc

## API Endpoints

### Root Endpoints

- **GET /** - API welcome message and status
- **GET /health** - Health check endpoint

### Student Endpoints

All student endpoints are prefixed with base URL: `http://localhost:8000`

#### Get All Students
```
GET /students
Query Parameters:
  - skip: int (default: 0) - Number of records to skip
  - limit: int (default: 100) - Maximum records to return
Response: 200 OK - List of students
```

**Example**:
```bash
curl http://localhost:8000/students?skip=0&limit=10
```

#### Get Student by ID
```
GET /students/{student_id}
Path Parameters:
  - student_id: int - Student ID
Response: 200 OK - Student data
Response: 404 Not Found - Student not found
```

**Example**:
```bash
curl http://localhost:8000/students/1
```

#### Create New Student
```
POST /students
Request Body:
{
  "name": "string",
  "email": "string (valid email)",
  "cohort": "string (optional)",
  "wellbeing_score": "float (optional)"
}
Response: 201 Created - Created student data
Response: 400 Bad Request - Email already exists
```

**Example**:
```bash
curl -X POST http://localhost:8000/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "cohort": "2024-Fall",
    "wellbeing_score": 7.5
  }'
```

#### Update Student
```
PUT /students/{student_id}
Path Parameters:
  - student_id: int - Student ID
Request Body:
{
  "name": "string",
  "email": "string (valid email)",
  "cohort": "string (optional)",
  "wellbeing_score": "float (optional)"
}
Response: 200 OK - Updated student data
Response: 404 Not Found - Student not found
Response: 400 Bad Request - Email already exists
```

**Example**:
```bash
curl -X PUT http://localhost:8000/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.doe@example.com",
    "cohort": "2024-Fall",
    "wellbeing_score": 8.0
  }'
```

#### Delete Student
```
DELETE /students/{student_id}
Path Parameters:
  - student_id: int - Student ID
Response: 204 No Content - Student deleted successfully
Response: 404 Not Found - Student not found
```

**Example**:
```bash
curl -X DELETE http://localhost:8000/students/1
```

## Database Schema

### Students Table

| Column           | Type     | Constraints                    |
|-----------------|----------|--------------------------------|
| id              | Integer  | Primary Key, Auto-increment    |
| name            | String   | Not Null                       |
| email           | String   | Not Null, Unique, Indexed      |
| cohort          | String   | Nullable                       |
| wellbeing_score | Float    | Nullable                       |
| timestamp       | DateTime | Default: Current timestamp     |

## Development

### Database Management

The database (`students.db`) is automatically created when you first run the application. If you need to reset the database:

1. Stop the server
2. Delete `students.db` file
3. Restart the server (tables will be recreated automatically)

### Testing the API

You can test the API using:

1. **Interactive Swagger UI**: Visit http://localhost:8000/docs
2. **ReDoc UI**: Visit http://localhost:8000/redoc
3. **curl**: See examples above
4. **Postman**: Import the endpoints and test
5. **Python requests library**:
   ```python
   import requests
   
   response = requests.get("http://localhost:8000/students")
   print(response.json())
   ```

## CORS Configuration

The application is configured to accept requests from:
- The origin specified in `.env` file (default: http://localhost:3000)
- http://localhost:3000
- http://127.0.0.1:3000

To add more origins, modify the `allow_origins` list in `app/main.py`.

## Environment Variables

| Variable        | Description                    | Default                  |
|----------------|--------------------------------|--------------------------|
| DATABASE_URL   | SQLite database file path      | sqlite:///./students.db  |
| FRONTEND_ORIGIN| Frontend URL for CORS          | http://localhost:3000    |

## Troubleshooting

### Port Already in Use
If port 8000 is already in use, run the server on a different port:
```bash
uvicorn app.main:app --reload --port 8001
```

### Database Locked Error
If you get a "database is locked" error:
1. Ensure no other processes are accessing the database
2. Close any database browser tools
3. Restart the server

### Import Errors
Make sure you're in the `backend` directory and have activated the virtual environment before running the server.

## Production Deployment

For production deployment:

1. Use a production ASGI server configuration:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

2. Consider using PostgreSQL or MySQL instead of SQLite for better concurrency

3. Set up proper environment variables for production

4. Enable HTTPS and configure CORS properly

5. Implement authentication and authorization

## License

This project is part of the Student Well-being Dashboard application.

## Support

For issues or questions, please refer to the project documentation or contact the development team.

