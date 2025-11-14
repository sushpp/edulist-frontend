import api from '../api';

const courseService = {
  // Get all courses for the currently logged-in institute
  getCoursesByInstitute: async () => {
    try {
      const response = await api.get('/courses/my');
      const data = response.data;
      
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.courses)) {
        return data.courses;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },

  // Create a new course - SIMPLIFIED VERSION
  createCourse: async (courseData) => {
    try {
      console.log('📤 Creating course with data:', courseData);

      // Use FormData only if there's an image
      if (courseData.image instanceof File) {
        const formData = new FormData();
        
        // Append all fields to FormData
        Object.keys(courseData).forEach(key => {
          if (courseData[key] !== null && courseData[key] !== undefined) {
            if (key === 'facilities' || key === 'syllabus') {
              formData.append(key, JSON.stringify(courseData[key]));
            } else if (key === 'image') {
              formData.append(key, courseData[key]);
            } else {
              formData.append(key, courseData[key]);
            }
          }
        });

        const response = await api.post('/courses', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      } else {
        // No image - send as JSON
        const response = await api.post('/courses', courseData);
        return response.data;
      }
    } catch (error) {
      console.error("❌ Error creating course:", error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('🔴 Backend Error:', {
          status: error.response.status,
          data: error.response.data,
          message: error.response.data?.message
        });
      }
      
      return null;
    }
  },

  // Alternative: Create course with JSON only (no image)
  createCourseJson: async (courseData) => {
    try {
      console.log('📤 Creating course with JSON:', courseData);
      
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating course with JSON:", error);
      
      if (error.response) {
        console.error('🔴 Backend Error Details:', error.response.data);
        throw new Error(error.response.data?.message || 'Failed to create course');
      }
      
      throw error;
    }
  },

  // Update an existing course
  updateCourse: async (courseId, courseData) => {
    try {
      // Use FormData only if there's an image
      if (courseData.image instanceof File) {
        const formData = new FormData();
        
        Object.keys(courseData).forEach(key => {
          if (courseData[key] !== null && courseData[key] !== undefined) {
            if (key === 'facilities' || key === 'syllabus') {
              formData.append(key, JSON.stringify(courseData[key]));
            } else if (key === 'image') {
              formData.append(key, courseData[key]);
            } else {
              formData.append(key, courseData[key]);
            }
          }
        });

        const response = await api.put(`/courses/${courseId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      } else {
        // No image - send as JSON
        const response = await api.put(`/courses/${courseId}`, courseData);
        return response.data;
      }
    } catch (error) {
      console.error("Error updating course:", error);
      return null;
    }
  },

  // Delete a course
  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting course:", error);
      return null;
    }
  },

  // Get courses by institute ID
  getInstituteCourses: async (instituteId) => {
    try {
      // Try different endpoint patterns
      const endpoints = [
        `/courses?institute=${instituteId}`,
        `/courses/institute/${instituteId}`,
        '/courses' // Fallback - get all and filter
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint);
          const data = response.data;
          
          let courses = [];
          if (Array.isArray(data)) {
            courses = data;
          } else if (data && Array.isArray(data.courses)) {
            courses = data.courses;
          } else if (data && data.data && Array.isArray(data.data)) {
            courses = data.data;
          }

          // If this is the fallback endpoint, filter by institute
          if (endpoint === '/courses' && courses.length > 0) {
            courses = courses.filter(course => 
              course.institute && course.institute._id === instituteId
            );
          }

          if (courses.length > 0) {
            return courses;
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed, trying next...`);
        }
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching institute courses:", error);
      return [];
    }
  }
};

export { courseService };