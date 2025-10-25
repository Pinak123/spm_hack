// Placeholder function for demonstration, as this file is the dashboard, not the login page.
function logout() {
  window.location.href = '../../Login-Page/index.html';
}

const gpaCtx = document.getElementById('gpaChart').getContext('2d');
const sleepGpaCtx = document.getElementById('sleepGpaChart').getContext('2d');
const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
const stressSleepCtx = document.getElementById('stressSleepChart').getContext('2d');

// Gradient helper for filled line charts
function createGradient(ctx, colorStart, colorEnd) {
  const chartHeight = ctx.canvas.height || 300;
  const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);
  return gradient;
}

// --- CGPA Conversion Utility ---
const CGPA_MULTIPLIER = 2.5;
const gpaToCgpa = (gpa) => parseFloat((gpa * CGPA_MULTIPLIER).toFixed(2));

// -----------------------------
//  1. Yearly CGPA Line Chart
// -----------------------------
const gpaData_4_point = [2.9, 3.0, 3.1, 3.05, 3.15];
const cgpaData_10_point = gpaData_4_point.map(gpaToCgpa); // Convert to 10-point scale

const cgpaChart = new Chart(gpaCtx, {
  type: 'line',
  data: {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [{
      label: 'Average CGPA',
      data: cgpaData_10_point,
      borderColor: '#007bff',
      backgroundColor: createGradient(gpaCtx, 'rgba(0,123,255,0.3)', 'rgba(0,123,255,0)'),
      tension: 0.4,
      fill: true,
      pointRadius: 6,
      pointBackgroundColor: '#007bff'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#6c757d' } } },
    scales: {
      y: {
        min: 6.0, // Adjusted Y-axis min for 10-point scale
        max: 10.0, // Adjusted Y-axis max for 10-point scale
        ticks: { color: '#6c757d', font: { size: 12 } },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        ticks: { color: '#6c757d', font: { size: 12 } },
        grid: { display: false }
      }
    }
  }
});

// -----------------------------
//  2. Sleep vs CGPA Scatter
// -----------------------------
const sleepGpaChart = new Chart(sleepGpaCtx, {
  type: 'scatter',
  data: {
    datasets: [{
      label: 'Sleep vs CGPA',
      // Data points converted to 10-point scale (x: sleep, y: CGPA)
      data: [
        { x: 4, y: gpaToCgpa(2.6) },
        { x: 5, y: gpaToCgpa(2.9) },
        { x: 6, y: gpaToCgpa(3.1) },
        { x: 7, y: gpaToCgpa(3.4) },
        { x: 8, y: gpaToCgpa(3.6) }
      ],
      backgroundColor: '#2ecc71',
      pointRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `Sleep: ${ctx.raw.x}h, CGPA: ${ctx.raw.y.toFixed(2)}` // Update tooltip
        }
      },
      legend: { labels: { color: '#6c757d' } }
    },
    scales: {
      x: {
        title: { display: true, text: 'Sleep (hrs)', color: '#6c757d' },
        min: 3, max: 9,
        ticks: { color: '#6c757d' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      y: {
        title: { display: true, text: 'CGPA', color: '#6c757d' }, // Update Y-axis title
        min: 6.0, // Adjusted Y-axis min
        max: 10.0, // Adjusted Y-axis max
        ticks: { color: '#6c757d' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    }
  }
});

// -----------------------------
//  3. Attendance Trend Bar (No CGPA changes needed here)
// -----------------------------
const attendanceChart = new Chart(attendanceCtx, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Attendance (%)',
      data: [88, 85, 87, 90, 92, 91, 93, 89, 88, 90, 92, 94],
      backgroundColor: '#f39c12',
      borderRadius: 6,
      barPercentage: 0.8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#6c757d' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        ticks: { color: '#6c757d' },
        grid: { display: false }
      }
    }
  }
});

// -----------------------------
//  4. Stress vs Sleep Bubble Chart (No CGPA changes needed here)
// -----------------------------
const stressSleepChart = new Chart(stressSleepCtx, {
  type: 'bubble',
  data: {
    datasets: [{
      label: 'Stress vs Sleep',
      data: [{ x: 6, y: 40, r: 12 }, { x: 7, y: 35, r: 10 }, { x: 8, y: 30, r: 8 }, { x: 5, y: 50, r: 15 }],
      backgroundColor: 'rgba(231, 76, 60, 0.6)',
      borderColor: 'rgb(231, 76, 60)',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `Sleep: ${ctx.raw.x}h, Stress: ${ctx.raw.y}%`
        }
      },
      legend: { labels: { color: '#6c757d' } }
    },
    scales: {
      x: {
        title: { display: true, text: 'Sleep (hrs)', color: '#6c757d' },
        min: 4, max: 9,
        ticks: { color: '#6c757d' }
      },
      y: {
        title: { display: true, text: 'Stress (%)', color: '#6c757d' },
        max: 60,
        ticks: { color: '#6c757d' }
      }
    }
  }
});

// Dynamic refresh logic for metrics
async function refreshData() {
  try {
    // Fetch real data from backend
    const students = await API.getAllStudents();
    
    if (students && students.length > 0) {
      // Calculate averages from real student data
      const avgWellbeing = students.reduce((sum, s) => sum + (s.wellbeing_score || 0), 0) / students.length;
      
      // Convert wellbeing score to CGPA-like scale (7.0 to 10.0)
      const avgCGPA = (7.0 + (avgWellbeing / 100) * 3.0).toFixed(2);
      
      document.getElementById('avgGPA').innerText = avgCGPA;
      document.getElementById('avgAttendance').innerText = `${(85 + Math.random() * 10).toFixed(1)}%`;
      document.getElementById('avgStress').innerText = `${(100 - avgWellbeing).toFixed(1)}%`;
      document.getElementById('avgSleep').innerText = (6 + Math.random() * 1.5).toFixed(1);
      
      showAdminNotification(`Data refreshed! ${students.length} students in database`, 'success');
    } else {
      // Fallback to dummy data if no students
      document.getElementById('avgGPA').innerText = (7.0 + Math.random() * 2.5).toFixed(2);
      document.getElementById('avgAttendance').innerText = `${(85 + Math.random() * 10).toFixed(1)}%`;
      document.getElementById('avgStress').innerText = `${(40 + Math.random() * 10).toFixed(1)}%`;
      document.getElementById('avgSleep').innerText = (6 + Math.random() * 1.5).toFixed(1);
      
      showAdminNotification('No students in database yet. Using demo data.', 'warning');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    showAdminNotification('Could not connect to server. Using offline mode.', 'error');
    
    // Fallback to dummy data
    document.getElementById('avgGPA').innerText = (7.0 + Math.random() * 2.5).toFixed(2);
    document.getElementById('avgAttendance').innerText = `${(85 + Math.random() * 10).toFixed(1)}%`;
    document.getElementById('avgStress').innerText = `${(40 + Math.random() * 10).toFixed(1)}%`;
    document.getElementById('avgSleep').innerText = (6 + Math.random() * 1.5).toFixed(1);
  }
  
  updateTimestamp();
}

/**
 * Show notification to admin
 */
function showAdminNotification(message, type = 'info') {
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 1000;
    max-width: 300px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 4000);
}

function updateTimestamp() {
  document.getElementById('lastUpdated').innerText = new Date().toLocaleString();
}

updateTimestamp();

// -----------------------------
//  PREDICTIVE RISK & ALERTS Logic
// -----------------------------
const riskData = {
  2025: [
    { id: "25CS001", name: "Aarav K.", year: "1st Year", risk: 72, category: "High", action: "Refer to counselor" },
    { id: "25CS012", name: "Riya G.", year: "1st Year", risk: 61, category: "High", action: "Weekly counseling" },
    { id: "25CS018", name: "Kunal M.", year: "1st Year", risk: 49, category: "Medium", action: "Academic mentor check" },
    { id: "25CS021", name: "Sneha P.", year: "1st Year", risk: 33, category: "Low", action: "Normal" },
  ],
  2024: [
    { id: "24CS010", name: "Devansh S.", year: "2nd Year", risk: 67, category: "High", action: "Refer to counselor" },
    { id: "24CS022", name: "Meera T.", year: "2nd Year", risk: 55, category: "Medium", action: "Bi-weekly review" },
    { id: "24CS028", name: "Rohan P.", year: "2nd Year", risk: 42, category: "Medium", action: "Attendance follow-up" },
    { id: "24CS030", name: "Tina B.", year: "2nd Year", risk: 29, category: "Low", action: "Normal" },
  ],
  2023: [
    { id: "23CS005", name: "Ishita D.", year: "3rd Year", risk: 71, category: "High", action: "Refer to counselor" },
    { id: "23CS016", name: "Yash P.", year: "3rd Year", risk: 58, category: "Medium", action: "Mentor follow-up" },
    { id: "23CS020", name: "Sanya L.", year: "3rd Year", risk: 36, category: "Low", action: "Normal" },
  ]
};

function renderRiskTable(year) {
  const tableBody = document.getElementById("riskTableBody");
  const data = riskData[year];

  tableBody.innerHTML = data
    .map(
      (student) => `
              <tr>
                <td>${student.id} — ${student.name}</td>
                <td>${student.year}</td>
                <td>${student.risk}%</td>
                <td class="category-${student.category.toLowerCase()}">${student.category}</td>
                <td>${student.action}</td>
              </tr>`
    )
    .join("");

  // Calculate average risk for the displayed group
  const totalRisk = data.reduce((a, b) => a + b.risk, 0);
  const avgRisk = Math.round(totalRisk / data.length);
  document.getElementById("riskScore").textContent = `${avgRisk}%`;
}

document.getElementById("yearSelector").addEventListener("change", (e) => {
  renderRiskTable(e.target.value);
});

// Initialize for the default selected year (2024)
renderRiskTable(document.getElementById("yearSelector").value);