import api from '../api'; // Import the main axios instance

// This service handles all course-related API calls
const courseService = {
  // Get all courses for the currently logged-in institute
  // 🔥 FIXED: This now calls the correct '/my' route that exists on your backend.
  getCoursesByInstitute: () => {
    return api.get('/courses/my')
      .then(response => {
        // The backend sends { success: true, courses: [...] }
        // We need to extract the 'courses' array from the response
        return response.data.courses;
      })
      .catch(error => {
        console.error("Error in courseService.getCoursesByInstitute:", error);
        // Re-throw the error so the component's catch block can handle it
        throw error;
      });
  },

  // Create a new course
  createCourse: (courseData) => {
    // Use FormData for file uploads
    const formData = new FormData();
    for (const key in courseData) {
      if (key === 'facilities' || key === 'syllabus') {
        formData.append(key, JSON.stringify(courseData[key]));
      } else {
        formData.append(key, courseData[key]);
      }
    }
    
    return api.post('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(response => response.data)
    .catch(error => {
        console.error("Error in courseService.createCourse:", error);
        throw error;
    });
  },

  // Update an existing course
  updateCourse: (courseId, courseData) => {
    const formData = new FormData();
    for (const key in courseData) {
      if (key === 'facilities' || key === 'syllabus') {
        formData.append(key, JSON.stringify(courseData[key]));
      } else {
        formData.append(key, courseData[key]);
      }
    }

    return api.put(`/courses/${courseId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(response => response.data)
    .catch(error => {
        console.error("Error in courseService.updateCourse:", error);
        throw error;
    });
  },

  // Delete a course
  deleteCourse: (courseId) => {
    return api.delete(`/courses/${courseId}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error in courseService.deleteCourse:", error);
        throw error;
      });
  }
};

export { courseService };