import api from '../api'; // Import the main axios instance

// This service handles all course-related API calls
const courseService = {
  // Get all courses for the currently logged-in institute
  getCoursesByInstitute: async () => {
    try {
      const response = await api.get('/courses/my');
      const data = response.data;
      
      // FIX: Enhanced response normalization with multiple fallbacks
      console.log('🔍 Course API Response:', data); // Debug log
      
      if (Array.isArray(data)) {
        console.log('📦 API returned direct array');
        return data;
      } else if (data && Array.isArray(data.courses)) {
        console.log('📦 API returned { courses: array }');
        return data.courses;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('📦 API returned { data: array }');
        return data.data;
      } else if (data && data.data && Array.isArray(data.data.courses)) {
        console.log('📦 API returned { data: { courses: array } }');
        return data.data.courses;
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          console.log(`📦 Found array in property: ${arrayKeys[0]}`);
          return data[arrayKeys[0]];
        }
      }
      
      // If no array found, return empty array to prevent .map() errors
      console.warn('❌ Unexpected API response format for courses. No array found. Returning empty array.');
      console.warn('Response structure:', typeof data, data);
      return [];
      
    } catch (error) {
      console.error("❌ Error in courseService.getCoursesByInstitute:", error);
      // FIX: Return empty array on error to prevent crashes
      return [];
    }
  },

  // Create a new course
  createCourse: async (courseData) => {
    try {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // FIX: Enhanced FormData handling with safety checks
      for (const key in courseData) {
        if (courseData[key] !== null && courseData[key] !== undefined) {
          if (key === 'facilities' || key === 'syllabus') {
            // FIX: Ensure we're always stringifying valid arrays
            const arrayData = Array.isArray(courseData[key]) ? courseData[key] : [];
            formData.append(key, JSON.stringify(arrayData));
          } else if (key === 'image' && courseData[key] instanceof File) {
            formData.append(key, courseData[key]);
          } else {
            formData.append(key, String(courseData[key]));
          }
        }
      }
      
      const response = await api.post('/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Create Course API Response:', data);
      return data;
      
    } catch (error) {
      console.error("❌ Error in courseService.createCourse:", error);
      // FIX: Return null instead of throwing error
      console.warn('⚠️ Error creating course - Returning null');
      return null;
    }
  },

  // Update an existing course
  updateCourse: async (courseId, courseData) => {
    try {
      const formData = new FormData();
      
      // FIX: Enhanced FormData handling with safety checks
      for (const key in courseData) {
        if (courseData[key] !== null && courseData[key] !== undefined) {
          if (key === 'facilities' || key === 'syllabus') {
            // FIX: Ensure we're always stringifying valid arrays
            const arrayData = Array.isArray(courseData[key]) ? courseData[key] : [];
            formData.append(key, JSON.stringify(arrayData));
          } else if (key === 'image' && courseData[key] instanceof File) {
            formData.append(key, courseData[key]);
          } else {
            formData.append(key, String(courseData[key]));
          }
        }
      }

      const response = await api.put(`/courses/${courseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Update Course API Response:', data);
      return data;
      
    } catch (error) {
      console.error("❌ Error in courseService.updateCourse:", error);
      // FIX: Return null instead of throwing error
      console.warn('⚠️ Error updating course - Returning null');
      return null;
    }
  },

  // Delete a course
  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(`/courses/${courseId}`);
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Delete Course API Response:', data);
      return data;
    } catch (error) {
      console.error("❌ Error in courseService.deleteCourse:", error);
      // FIX: Return null instead of throwing error
      console.warn('⚠️ Error deleting course - Returning null');
      return null;
    }
  },

  // FIX: Added method to get courses by institute ID (for public viewing)
  getInstituteCourses: async (instituteId) => {
    try {
      const response = await api.get(`/courses/institute/${instituteId}`);
      const data = response.data;
      
      // FIX: Enhanced response normalization with multiple fallbacks
      console.log('🔍 Institute Courses API Response:', data);
      
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.courses)) {
        return data.courses;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data && data.data && Array.isArray(data.data.courses)) {
        return data.data.courses;
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          return data[arrayKeys[0]];
        }
      }
      
      console.warn('❌ Unexpected API response format for institute courses. Returning empty array.');
      return [];
      
    } catch (error) {
      console.error("❌ Error in courseService.getInstituteCourses:", error);
      // FIX: Return empty array on error to prevent crashes
      return [];
    }
  },

  // FIX: Added test method to check API response format
  testApiResponse: async () => {
    try {
      const response = await api.get('/courses/my');
      console.log('🧪 TEST - Raw Course API Response:', response);
      console.log('🧪 TEST - Response Data:', response.data);
      console.log('🧪 TEST - Data Type:', typeof response.data);
      console.log('🧪 TEST - Is Array?:', Array.isArray(response.data));
      
      if (response.data && typeof response.data === 'object') {
        console.log('🧪 TEST - Object Keys:', Object.keys(response.data));
        Object.keys(response.data).forEach(key => {
          console.log(`🧪 TEST - Key "${key}":`, typeof response.data[key], Array.isArray(response.data[key]));
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('🧪 TEST - Error:', error);
      // FIX: Return empty object instead of throwing error
      console.warn('⚠️ TEST - API Error - Returning empty object');
      return {};
    }
  }
};

export { courseService };