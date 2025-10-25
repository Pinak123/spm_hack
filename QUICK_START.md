# 🚀 Quick Start Guide - Student Well-being Dashboard

## Start the Backend (Terminal 1)

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Backend will run on:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

---

## Start the Frontend (Terminal 2)

```bash
cd Student_Well_being_dashboard/Frontend
python -m http.server 3000
```

**Frontend will run on:** http://localhost:3000  
**Login Page:** http://localhost:3000/Login-Page/index.html

---

## Test Login Credentials

### Student Login:
- **Username:** `student1`
- **Password:** `123`

### Admin Login:
- **Username:** `admin1`
- **Password:** `1234`

---

## Test the Integration

1. ✅ Start backend server
2. ✅ Open frontend in browser
3. ✅ Login as student
4. ✅ Enter wellbeing data
5. ✅ Click "Calculate Risk & Update"
6. ✅ Check http://localhost:8000/docs → GET /students to see saved data
7. ✅ Login as admin and click "Refresh Data" to see student count

---

## Quick API Test

**View all students:**
```bash
curl http://localhost:8000/students
```

**Create a student:**
```bash
curl -X POST http://localhost:8000/students ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"email\":\"test@example.com\",\"wellbeing_score\":75}"
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to server | Make sure backend is running on port 8000 |
| CORS errors | Use http://localhost:3000 for frontend |
| Database errors | Delete `backend/students.db` and restart |
| Email already exists | Each student needs unique email |

---

## File Structure

```
backend/
├── app/
│   ├── main.py         # FastAPI app
│   ├── database.py     # Database setup
│   ├── models/         # Database models
│   ├── schemas/        # Pydantic schemas
│   ├── crud/           # CRUD operations
│   └── api/            # API endpoints
└── students.db         # SQLite database (auto-created)

Student_Well_being_dashboard/Frontend/
├── config.js           # API configuration (NEW)
├── Login-Page/
│   ├── index.html
│   └── script.js
└── Dash-Board/
    ├── student/        # Student dashboard
    └── admin/          # Admin dashboard
```

---

## What's Connected?

✅ **Student Dashboard** → Saves wellbeing data to backend  
✅ **Admin Dashboard** → Fetches real student data from backend  
✅ **Backend API** → Stores data in SQLite database  
✅ **CORS** → Enabled for frontend-backend communication  

---

**For detailed instructions, see:** `SETUP_GUIDE.md`

