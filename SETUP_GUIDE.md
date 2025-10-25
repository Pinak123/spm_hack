# Frontend-Backend Integration Guide
## Student Well-being Dashboard

This guide will walk you through connecting your frontend to the FastAPI backend.

---

## 📋 Prerequisites

Make sure you have:
- ✅ Python 3.8+ installed
- ✅ pip (Python package manager)
- ✅ A modern web browser (Chrome, Firefox, Edge, etc.)
- ✅ A text editor (VS Code, Sublime, etc.)

---

## 🚀 Step-by-Step Setup

### Step 1: Start the Backend Server

1. **Open a terminal/command prompt**

2. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

3. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```

4. **Activate the virtual environment:**
   
   **On Windows:**
   ```bash
   venv\Scripts\activate
   ```
   
   **On macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```

5. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload
   ```

7. **Verify the server is running:**
   - Open your browser and go to: http://localhost:8000
   - You should see: `{"message": "Welcome to Student Well-being Dashboard API", ...}`
   - Check the API docs at: http://localhost:8000/docs

**✅ Backend is now running on http://localhost:8000**

---

### Step 2: Understand the API Configuration

The frontend uses a configuration file located at:
```
Student_Well_being_dashboard/Frontend/config.js
```

This file contains:
- **API_CONFIG.BASE_URL**: The backend server URL (default: `http://localhost:8000`)
- **API helper functions**: Pre-built functions to interact with the backend

**Key API Functions Available:**
- `API.getAllStudents()` - Fetch all students
- `API.getStudent(id)` - Fetch a single student by ID
- `API.createStudent(data)` - Create a new student
- `API.updateStudent(id, data)` - Update an existing student
- `API.deleteStudent(id)` - Delete a student
- `API.calculateWellbeingScore(metrics)` - Calculate wellbeing score

---

### Step 3: Open the Frontend

1. **Navigate to the Login Page:**
   ```
   Student_Well_being_dashboard/Frontend/Login-Page/index.html
   ```

2. **Open it in your browser:**
   - **Option A**: Double-click the file
   - **Option B**: Right-click → "Open with" → Your browser
   - **Option C**: Use a local server (recommended for development):
     ```bash
     # If you have Python installed
     cd Student_Well_being_dashboard/Frontend
     python -m http.server 3000
     ```
     Then open: http://localhost:3000/Login-Page/index.html

3. **Login with test credentials:**
   - **Student Login:**
     - Username: `student1`
     - Password: `123`
   - **Admin Login:**
     - Username: `admin1`
     - Password: `1234`

---

### Step 4: Test the Integration

#### For Students:

1. **Login as a student** (student1 / 123)

2. **You'll see the Student Dashboard**

3. **Enter your daily data:**
   - GPA: 3.5
   - Sleep: 7.5 hours
   - Stress: 45%
   - Study Time: 5 hours
   - Social Time: 2 hours
   - Exercise: 1 hour

4. **Click "Calculate Risk & Update"**

5. **What happens:**
   - ✅ Dashboard updates with your metrics
   - ✅ Risk calculation is performed
   - ✅ Data is sent to the backend API
   - ✅ A wellbeing score is calculated and saved
   - ✅ You'll see a success notification

6. **Verify in the backend:**
   - Open: http://localhost:8000/docs
   - Click on `GET /students`
   - Click "Try it out" → "Execute"
   - You should see your student data with the wellbeing_score!

#### For Admins:

1. **Login as admin** (admin1 / 1234)

2. **You'll see the Admin Dashboard**

3. **Click "Refresh Data"**

4. **What happens:**
   - ✅ Fetches all students from the backend
   - ✅ Calculates average wellbeing scores
   - ✅ Updates the dashboard metrics
   - ✅ Shows a notification with student count

---

## 🔍 How It Works

### Data Flow:

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Frontend  │  HTTP   │   Backend   │  SQL    │   Database   │
│  (Browser)  │ ◄─────► │  (FastAPI)  │ ◄─────► │  (SQLite)    │
└─────────────┘         └─────────────┘         └──────────────┘
```

### When a Student Submits Data:

1. **Frontend** collects form data (GPA, sleep, stress, etc.)
2. **Frontend** calculates wellbeing score using `API.calculateWellbeingScore()`
3. **Frontend** sends data to backend via `API.createStudent()` or `API.updateStudent()`
4. **Backend** validates data using Pydantic schemas
5. **Backend** stores data in SQLite database
6. **Backend** returns saved data with ID and timestamp
7. **Frontend** shows success notification

### When Admin Refreshes Data:

1. **Frontend** calls `API.getAllStudents()`
2. **Backend** queries SQLite database
3. **Backend** returns array of all students
4. **Frontend** calculates averages and updates charts
5. **Frontend** displays real-time metrics

---

## 🛠️ Troubleshooting

### Problem: "Could not connect to server"

**Solution:**
- Make sure the backend is running on http://localhost:8000
- Check the terminal where you started uvicorn
- Verify no firewall is blocking port 8000

### Problem: CORS errors in browser console

**Solution:**
- The backend is already configured for CORS
- Make sure you're accessing the frontend from `http://localhost:3000`
- If using a different port, update `backend/app/main.py`:
  ```python
  allow_origins=["http://localhost:YOUR_PORT"]
  ```

### Problem: "Email already registered"

**Solution:**
- Each student email must be unique
- The system creates emails like `student1@example.com`
- To reset, delete `backend/students.db` and restart the backend

### Problem: Database errors

**Solution:**
1. Stop the backend (Ctrl+C)
2. Delete the database file: `backend/students.db`
3. Restart the backend (tables will be recreated automatically)

### Problem: Frontend not updating with backend data

**Solution:**
- Open browser DevTools (F12)
- Check the Console tab for error messages
- Check the Network tab to see if API calls are being made
- Verify the API_CONFIG.BASE_URL in `config.js` is correct

---

## 📊 Testing the API Directly

You can test the API without the frontend:

### Using the Interactive Docs (Swagger UI):

1. Open: http://localhost:8000/docs
2. Try each endpoint directly from the browser
3. See request/response formats

### Using curl (Command Line):

**Get all students:**
```bash
curl http://localhost:8000/students
```

**Create a new student:**
```bash
curl -X POST http://localhost:8000/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "cohort": "2024-Fall",
    "wellbeing_score": 75.5
  }'
```

**Get a specific student (ID 1):**
```bash
curl http://localhost:8000/students/1
```

**Update a student:**
```bash
curl -X PUT http://localhost:8000/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "test@example.com",
    "cohort": "2024-Fall",
    "wellbeing_score": 80.0
  }'
```

### Using Python:

```python
import requests

# Get all students
response = requests.get("http://localhost:8000/students")
students = response.json()
print(students)

# Create a student
new_student = {
    "name": "John Doe",
    "email": "john@example.com",
    "cohort": "2024-Fall",
    "wellbeing_score": 78.5
}
response = requests.post("http://localhost:8000/students", json=new_student)
created = response.json()
print(f"Created student with ID: {created['id']}")
```

---

## 🎯 Key Files Modified

### Frontend Files:

1. **`config.js`** (NEW)
   - API configuration and helper functions
   - Located at: `Student_Well_being_dashboard/Frontend/config.js`

2. **`Dash-Board/student/index.html`** (UPDATED)
   - Added script tag to include config.js

3. **`Dash-Board/student/script.js`** (UPDATED)
   - Added `loadStudentData()` - Loads student data on login
   - Added `saveStudentData()` - Saves data to backend
   - Added `showNotification()` - Shows user notifications
   - Modified `handleDataInput()` - Now saves to backend

4. **`Dash-Board/admin/index.html`** (UPDATED)
   - Added script tag to include config.js

5. **`Dash-Board/admin/script.js`** (UPDATED)
   - Modified `refreshData()` - Fetches real data from backend
   - Added `showAdminNotification()` - Shows admin notifications

### Backend Files (Already Created):

1. **`app/main.py`** - FastAPI app with CORS
2. **`app/database.py`** - SQLAlchemy database setup
3. **`app/models/student.py`** - Student database model
4. **`app/schemas/student.py`** - Pydantic validation schemas
5. **`app/crud/student.py`** - CRUD operations
6. **`app/api/student.py`** - API endpoints

---

## 🔐 Security Notes

**For Development:**
- ✅ CORS is enabled for localhost:3000
- ✅ No authentication required (for testing)
- ✅ SQLite database (local file)

**For Production:**
- ⚠️ Add proper authentication (JWT, OAuth)
- ⚠️ Use PostgreSQL or MySQL instead of SQLite
- ⚠️ Configure CORS for your production domain only
- ⚠️ Use HTTPS
- ⚠️ Add rate limiting
- ⚠️ Implement proper error handling
- ⚠️ Add input validation and sanitization

---

## 📈 Next Steps

### Enhancements You Can Make:

1. **Add Authentication:**
   - Implement JWT tokens
   - Add user roles and permissions
   - Secure API endpoints

2. **Expand the Database:**
   - Add more tables (courses, activities, etc.)
   - Add relationships between tables
   - Track historical data over time

3. **Improve the Frontend:**
   - Add more charts and visualizations
   - Implement real-time updates with WebSockets
   - Add data export functionality (CSV, PDF)

4. **Add More Features:**
   - Email notifications for at-risk students
   - Trend analysis and predictions
   - Comparison with peer groups
   - Goal setting and tracking

5. **Deploy to Production:**
   - Deploy backend to Heroku, Railway, or AWS
   - Deploy frontend to Netlify, Vercel, or GitHub Pages
   - Set up continuous integration/deployment (CI/CD)

---

## 📚 API Reference

### Base URL
```
http://localhost:8000
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API welcome message |
| GET | `/health` | Health check |
| GET | `/students` | Get all students |
| GET | `/students/{id}` | Get student by ID |
| POST | `/students` | Create new student |
| PUT | `/students/{id}` | Update student |
| DELETE | `/students/{id}` | Delete student |

### Student Object Schema

```json
{
  "name": "string",
  "email": "string (valid email)",
  "cohort": "string (optional)",
  "wellbeing_score": "float (optional, 0-100)",
  "id": "integer (auto-generated)",
  "timestamp": "datetime (auto-generated)"
}
```

---

## ✅ Checklist

Before you start, make sure:

- [ ] Backend server is running on port 8000
- [ ] You can access http://localhost:8000/docs
- [ ] Frontend files are accessible
- [ ] Browser console shows no CORS errors
- [ ] You can login to the frontend
- [ ] Test data submission works
- [ ] Data appears in the backend (check /docs)
- [ ] Admin dashboard can fetch student data

---

## 🆘 Need Help?

1. **Check the browser console** (F12) for error messages
2. **Check the backend terminal** for server logs
3. **Review the API docs** at http://localhost:8000/docs
4. **Test API endpoints** directly using curl or the interactive docs
5. **Check network requests** in browser DevTools (Network tab)

---

## 📝 Summary

**You now have:**
- ✅ A running FastAPI backend with SQLite database
- ✅ A frontend that communicates with the backend
- ✅ Real-time data storage and retrieval
- ✅ Student wellbeing tracking system
- ✅ Admin dashboard with live data

**The system automatically:**
- Saves student wellbeing data to the database
- Calculates wellbeing scores
- Provides real-time updates
- Handles errors gracefully with fallback to offline mode

**Happy coding! 🎉**

