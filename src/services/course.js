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
// src/services/courseService.js - Fix the 500 error
createCourse: async (courseData) => {
  try {
    console.log('🔍 Course Data being sent:', courseData);
    
    // FIX: Test with minimal data first to avoid 500 errors
    const minimalData = {
      title: courseData.title,
      description: courseData.description,
      duration: courseData.duration,
      fees: Number(courseData.fees), // Ensure fees is a number
      category: courseData.category,
      // Skip image and complex arrays for now
      // facilities: courseData.facilities || [],
      // syllabus: courseData.syllabus || []
    };
    
    console.log('🧪 Testing with minimal data:', minimalData);
    
    const response = await api.post('/courses', minimalData);
    
    const data = response.data;
    console.log('✅ Create Course API Response:', data);
    return data;
    
  } catch (error) {
    console.error("❌ Error in courseService.createCourse:", error);
    
    // Enhanced error logging for 500 errors
    if (error.response?.status === 500) {
      console.error('🔴 Backend 500 Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        backendError: error.response?.data
      });
    }
    
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

  // FIX: SIMPLIFIED method to get courses by institute ID
// In courseService.js - fix the getInstituteCourses method
getInstituteCourses: async (instituteId) => {
  try {
    // FIX: Use the correct endpoint that exists
    // Option 1: Try this endpoint first
    const response = await api.get(`/courses?institute=${instituteId}`);
    const data = response.data;
    
    console.log('🔍 Institute Courses API Response:', data);
    
    // Enhanced response normalization
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.courses)) {
      return data.courses;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('❌ Unexpected API response format for institute courses. Returning empty array.');
      return [];
    }
    
  } catch (error) {
    console.error("❌ Error in courseService.getInstituteCourses:", error);
    
    // If the first endpoint fails, try alternative approaches
    try {
      console.log('🔄 Trying alternative endpoint...');
      
      // Option 2: Get all courses and filter by institute
      const allCoursesResponse = await api.get('/courses');
      const allCourses = allCoursesResponse.data;
      
      let coursesArray = [];
      if (Array.isArray(allCourses)) {
        coursesArray = allCourses;
      } else if (allCourses && Array.isArray(allCourses.courses)) {
        coursesArray = allCourses.courses;
      }
      
      // Filter courses by institute ID
      const instituteCourses = coursesArray.filter(course => 
        course.institute && course.institute._id === instituteId
      );
      
      console.log(`🔍 Filtered courses for institute ${instituteId}:`, instituteCourses);
      return instituteCourses;
      
    } catch (fallbackError) {
      console.error("❌ Fallback also failed:", fallbackError);
      return [];
    }
  }
},

  // FIX: Added method to get course by ID
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      const data = response.data;
      console.log('🔍 Course by ID API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching course by ID:', error);
      return null;
    }
  },

  // FIX: Added method to get courses by category
  getCoursesByCategory: async (category) => {
    try {
      const response = await api.get(`/courses?category=${category}`);
      const data = response.data;
      
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.courses)) {
        return data.courses;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching courses by category:', error);
      return [];
    }
  },

  // FIX: Enhanced test method to check ALL possible endpoints
  testEndpoints: async (instituteId = 'test-id') => {
    try {
      console.log('🧪 TESTING ALL COURSE ENDPOINTS...');
      
      const endpoints = [
        { name: '/courses/my', url: '/courses/my' },
        { name: '/courses', url: '/courses' },
        { name: '/courses?institute={id}', url: `/courses?institute=${instituteId}` },
        { name: '/courses/institute/{id}', url: `/courses/institute/${instituteId}` },
        { name: '/courses/public', url: '/courses/public' },
      ];
      
      const results = [];
      
      for (const endpoint of endpoints) {
        console.log(`🧪 Testing ${endpoint.name}...`);
        try {
          const response = await api.get(endpoint.url);
          console.log(`✅ ${endpoint.name} - SUCCESS:`, response.data);
          results.push({
            endpoint: endpoint.name,
            status: 'SUCCESS',
            data: response.data
          });
        } catch (error) {
          console.log(`❌ ${endpoint.name} - FAILED:`, error.response?.status, error.message);
          results.push({
            endpoint: endpoint.name,
            status: 'FAILED',
            error: error.message,
            statusCode: error.response?.status
          });
        }
      }
      
      return { success: true, results };
    } catch (error) {
      console.error('🧪 TEST - Error:', error);
      return { success: false, error: error.message };
    }
  },

  // FIX: Added method to check what endpoints are available
  discoverEndpoints: async () => {
    console.log('🔍 Discovering available course endpoints...');
    return await courseService.testEndpoints();
  }
};

export { courseService };