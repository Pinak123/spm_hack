const DUMMY_CREDENTIALS = {
    "24CS010": "pass123", 
    "24CS022": "test456"
};

let radarChart; // Variable to hold the Chart.js instance
let currentStudentId = null; // Store the current student's ID for API calls
let currentStudentEmail = null; // Store the current student's email

// --- Login & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Get logged in user from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        currentStudentEmail = `${loggedInUser}@example.com`; // Construct email from username
        loadStudentData();
    }

    const dataInputForm = document.getElementById('dataInputForm');
    if (dataInputForm) {
        // Initial data now includes Social and Exercise
        const initialData = { gpa: 3.0, sleep: 7.0, stress: 40, study: 4.5, social: 1.5, exercise: 0.5 };
        updateDashboard(initialData);
        dataInputForm.addEventListener('submit', handleDataInput);
    }
});

function handleLogin(event) {
    // ... (Login function from previous response) ...
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('loginMessage');

    if (DUMMY_CREDENTIALS[username] === password) {
        localStorage.setItem('loggedInUser', username);
        window.location.href = 'dashboard.html';
    } else {
        message.textContent = 'Invalid Student ID or Password.';
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    currentStudentId = null;
    currentStudentEmail = null;
    window.location.href = '../../Login-Page/index.html';
}

/**
 * Load student data from backend API
 */
async function loadStudentData() {
    if (!currentStudentEmail) {
        console.warn('No student email found');
        return;
    }

    try {
        // Get all students and find the current one by email
        const students = await API.getAllStudents();
        const currentStudent = students.find(s => s.email === currentStudentEmail);
        
        if (currentStudent) {
            currentStudentId = currentStudent.id;
            console.log('Student data loaded:', currentStudent);
            
            // If student has data, you could load their previous metrics here
            // For now, we'll just show the current wellbeing score
            if (currentStudent.wellbeing_score) {
                const notification = document.createElement('div');
                notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 15px; border-radius: 8px; z-index: 1000;';
                notification.textContent = `Welcome back! Your last wellbeing score: ${currentStudent.wellbeing_score}%`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 5000);
            }
        } else {
            console.log('Student not found in database, will create on first data submission');
        }
    } catch (error) {
        console.error('Error loading student data:', error);
        showNotification('Could not connect to server. Using offline mode.', 'warning');
    }
}

/**
 * Save student data to backend API
 */
async function saveStudentData(metrics) {
    if (!currentStudentEmail) {
        console.warn('No student email found');
        return false;
    }

    try {
        // Calculate wellbeing score
        const wellbeingScore = API.calculateWellbeingScore(metrics);
        
        // Get student name from logged in user
        const loggedInUser = localStorage.getItem('loggedInUser') || 'Student';
        const studentName = `Student ${loggedInUser}`;
        
        const studentData = {
            name: studentName,
            email: currentStudentEmail,
            cohort: '2024-Fall', // You can make this dynamic
            wellbeing_score: wellbeingScore
        };

        if (currentStudentId) {
            // Update existing student
            await API.updateStudent(currentStudentId, studentData);
            console.log('Student data updated successfully');
            showNotification('Data saved successfully! Wellbeing score: ' + wellbeingScore + '%', 'success');
        } else {
            // Create new student
            const createdStudent = await API.createStudent(studentData);
            currentStudentId = createdStudent.id;
            console.log('Student created successfully:', createdStudent);
            showNotification('Profile created! Wellbeing score: ' + wellbeingScore + '%', 'success');
        }
        
        return true;
    } catch (error) {
        console.error('Error saving student data:', error);
        showNotification('Could not save to server: ' + error.message, 'error');
        return false;
    }
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}



// --- Risk Calculation Logic ---

function calculateRisk(gpa, sleep, stress, study) {
    // Placeholder risk calculation logic - you can enhance this
    const gpaRisk = (4.0 - gpa) * 5; 
    const sleepDeviation = Math.abs(sleep - 8);
    const sleepRisk = sleepDeviation * 3; 
    const stressRisk = stress * 0.4; 
    const studyDeviation = Math.abs(study - 5);
    const studyRisk = studyDeviation * 1; 

    let totalRisk = 10 + gpaRisk + sleepRisk + stressRisk + studyRisk;
    
    return Math.min(100, Math.max(0, Math.round(totalRisk)));
}

function getRiskCategoryAndAction(risk) {
    // ... (Risk category logic from previous response) ...
    let category, action;
    if (risk < 30) {
        category = "Low";
        action = "Keep up the excellent work!";
    } else if (risk < 60) {
        category = "Medium";
        action = "Consider increasing sleep or reducing stressors. Bi-weekly review suggested.";
    } else {
        category = "High";
        action = "Immediate counseling referral. Focus on stress and sleep management.";
    }
    return { category, action };
}

// --- Chart Drawing Logic ---

function drawRadarChart(sleep, study, social, exercise) {
    const ctx = document.getElementById('lifestyleRadarChart').getContext('2d');
    
    // Normalize values to a 0-10 scale for the radar chart visualization.
    // Optimal/Max values used for normalization (this is subjective and can be adjusted)
    const MAX_SLEEP = 9;   // 9 hours is max for chart scale
    const MAX_STUDY = 8;   // 8 hours is max for chart scale
    const MAX_SOCIAL = 4;  // 4 hours is max for chart scale
    const MAX_EXERCISE = 3; // 3 hours is max for chart scale
    
    // Example: A higher value is 'better' for the visualization
    const normalizedSleep = Math.min(10, (sleep / MAX_SLEEP) * 10);
    const normalizedStudy = Math.min(10, (study / MAX_STUDY) * 10);
    const normalizedSocial = Math.min(10, (social / MAX_SOCIAL) * 10);
    const normalizedExercise = Math.min(10, (exercise / MAX_EXERCISE) * 10);
    
    // Placeholder for a fifth factor, e.g., Screen Time (inverted: lower is better)
    // We'll just use a fixed value for simplicity here as it's not in the input form.
    const normalizedScreenTime = 5; 

    const dataPoints = [
        normalizedSleep, 
        normalizedStudy, 
        normalizedExercise, 
        normalizedSocial, 
        normalizedScreenTime
    ];

    if (radarChart) {
        radarChart.destroy(); // Destroy previous chart instance
    }

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Sleep', 'Study', 'Exercise', 'Social', 'Screen Time'],
            datasets: [{
                label: 'Your Lifestyle Score (0-10)',
                data: dataPoints,
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            elements: { line: { borderWidth: 3 } },
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    pointLabels: {
                        font: { size: 14 }
                    },
                    ticks: {
                        stepSize: 2 // Show ticks at 2, 4, 6, 8, 10
                    }
                }
            },
            plugins: {
                legend: { display: false } // Hide the legend for a cleaner look
            }
        }
    });
}


function updateDashboard({ gpa, sleep, stress, study, social, exercise }) {
    // Update metric cards
    document.getElementById('displayGPA').textContent = gpa.toFixed(2);
    document.getElementById('displaySleep').textContent = sleep.toFixed(1);
    document.getElementById('displayStress').textContent = `${stress}%`;
    document.getElementById('displayStudy').textContent = study.toFixed(1);

    // Calculate and update risk
    const risk = calculateRisk(gpa, sleep, stress, study);
    const { category, action } = getRiskCategoryAndAction(risk);

    document.getElementById('riskProbability').textContent = `${risk}%`;
    document.getElementById('riskCategory').textContent = category;
    document.getElementById('suggestedAction').textContent = action;

    const riskCard = document.querySelector('.risk-card');
    riskCard.className = 'card risk-card'; 
    riskCard.classList.add(`risk-${category.toLowerCase()}`); 
    
    // 🎯 Draw the Radar Chart with the new data
    drawRadarChart(sleep, study, social, exercise);
}

async function handleDataInput(event) {
    event.preventDefault();
    
    const gpa = parseFloat(document.getElementById('inputGPA').value);
    const sleep = parseFloat(document.getElementById('inputSleep').value);
    const stress = parseFloat(document.getElementById('inputStress').value);
    const study = parseFloat(document.getElementById('inputStudy').value);
    const social = parseFloat(document.getElementById('inputSocial').value);
    const exercise = parseFloat(document.getElementById('inputExercise').value);

    const newData = { gpa, sleep, stress, study, social, exercise };
    
    // Update dashboard display
    updateDashboard(newData);
    
    // Save to backend API
    const saved = await saveStudentData(newData);
    
    if (saved) {
        showNotification('Dashboard updated and data saved to server!', 'success');
    } else {
        alert('Dashboard updated! (Note: Could not save to server)');
    }
}