document.addEventListener('DOMContentLoaded', () => {
    const studentTab = document.getElementById('studentTab');
    const adminTab = document.getElementById('adminTab');
    const studentForm = document.getElementById('studentForm');
    const adminForm = document.getElementById('adminForm');

    const studentUsernameInput = document.getElementById('studentUsername');
    const studentPasswordInput = document.getElementById('studentPassword');
    const studentLoginBtn = document.getElementById('studentLogin');

    const adminUsernameInput = document.getElementById('adminUsername');
    const adminPasswordInput = document.getElementById('adminPassword');
    const adminLoginBtn = document.getElementById('adminLogin');

    function switchTab(active) {
        if (active === 'student') {
            studentTab.classList.add('active');
            adminTab.classList.remove('active');
            studentForm.classList.add('active');
            adminForm.classList.remove('active');
        } else {
            adminTab.classList.add('active');
            studentTab.classList.remove('active');
            adminForm.classList.add('active');
            studentForm.classList.remove('active');
        }
    }

    // Tab click events
    studentTab.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('student');
    });
    adminTab.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('admin');
    });

    // Dummy credentials
    const studentCreds = { username: 'student1', password: '123' };
    const adminCreds = { username: 'admin1', password: '1234' };

    // Student login
    studentLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (studentUsernameInput.value === studentCreds.username &&
            studentPasswordInput.value === studentCreds.password) {
            // Redirect to student dashboard HTML
            window.location.href = '../Dash-Board/student/index.html';
        } else {
            alert('Invalid student credentials!');
        }
    });

    // Admin login
    adminLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (adminUsernameInput.value === adminCreds.username &&
            adminPasswordInput.value === adminCreds.password) {
            // Optional: redirect admin
            window.location.href = '../Dash-Board/admin/index.html';
        } else {
            alert('Invalid admin credentials!');
        }
    });

    const modeToggle = document.getElementById('modeToggle');
    modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            modeToggle.textContent = 'Light Mode';
        } else {
            modeToggle.textContent = 'Dark Mode';
        }
    });

});
