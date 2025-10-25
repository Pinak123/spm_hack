/**
 * API Configuration for Student Well-being Dashboard
 * Update API_BASE_URL if your backend runs on a different host/port
 */

const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',
    ENDPOINTS: {
        STUDENTS: '/students',
        STUDENT_BY_ID: (id) => `/students/${id}`,
    }
};

/**
 * API Helper Functions
 */
const API = {
    /**
     * Get all students
     * @param {number} skip - Number of records to skip (pagination)
     * @param {number} limit - Maximum number of records to return
     * @returns {Promise<Array>} Array of student objects
     */
    async getAllStudents(skip = 0, limit = 100) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENTS}?skip=${skip}&limit=${limit}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching students:', error);
            throw error;
        }
    },

    /**
     * Get a single student by ID
     * @param {number} id - Student ID
     * @returns {Promise<Object>} Student object
     */
    async getStudent(id) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENT_BY_ID(id)}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching student ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create a new student
     * @param {Object} studentData - Student data object
     * @param {string} studentData.name - Student name
     * @param {string} studentData.email - Student email
     * @param {string} [studentData.cohort] - Student cohort (optional)
     * @param {number} [studentData.wellbeing_score] - Wellbeing score (optional)
     * @returns {Promise<Object>} Created student object
     */
    async createStudent(studentData) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENTS}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentData)
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    },

    /**
     * Update an existing student
     * @param {number} id - Student ID
     * @param {Object} studentData - Updated student data
     * @returns {Promise<Object>} Updated student object
     */
    async updateStudent(id, studentData) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENT_BY_ID(id)}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentData)
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error updating student ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete a student
     * @param {number} id - Student ID
     * @returns {Promise<void>}
     */
    async deleteStudent(id) {
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENT_BY_ID(id)}`,
                {
                    method: 'DELETE'
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            return;
        } catch (error) {
            console.error(`Error deleting student ${id}:`, error);
            throw error;
        }
    },

    /**
     * Calculate wellbeing score based on student metrics
     * @param {Object} metrics - Student metrics
     * @returns {number} Calculated wellbeing score (0-100)
     */
    calculateWellbeingScore(metrics) {
        const { gpa, sleep, stress, study, social, exercise } = metrics;
        
        // Normalize each metric to 0-100 scale
        const gpaScore = (gpa / 4.0) * 100;
        const sleepScore = Math.min(100, (sleep / 8) * 100);
        const stressScore = 100 - stress; // Invert stress (lower is better)
        const studyScore = Math.min(100, (study / 6) * 100);
        const socialScore = Math.min(100, (social / 3) * 100);
        const exerciseScore = Math.min(100, (exercise / 2) * 100);
        
        // Weighted average (you can adjust weights as needed)
        const wellbeingScore = (
            gpaScore * 0.25 +
            sleepScore * 0.20 +
            stressScore * 0.20 +
            studyScore * 0.15 +
            socialScore * 0.10 +
            exerciseScore * 0.10
        );
        
        return Math.round(wellbeingScore);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, API };
}

