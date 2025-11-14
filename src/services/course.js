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
// In courseService.createCourse - add detailed logging
createCourse: async (courseData) => {
  try {
    console.log('🔍 Course Data being sent:', courseData);
    
    // Use FormData for file uploads
    const formData = new FormData();
    
    // Enhanced FormData handling with safety checks
    for (const key in courseData) {
      if (courseData[key] !== null && courseData[key] !== undefined) {
        if (key === 'facilities' || key === 'syllabus') {
          // Ensure we're always stringifying valid arrays
          const arrayData = Array.isArray(courseData[key]) ? courseData[key] : [];
          formData.append(key, JSON.stringify(arrayData));
          console.log(`📦 ${key}:`, arrayData);
        } else if (key === 'image' && courseData[key] instanceof File) {
          formData.append(key, courseData[key]);
          console.log(`🖼️ ${key}:`, courseData[key].name, courseData[key].size);
        } else {
          formData.append(key, String(courseData[key]));
          console.log(`📝 ${key}:`, courseData[key]);
        }
      }
    }
    
    // Log FormData contents
    console.log('📤 FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }
    
    const response = await api.post('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    const data = response.data;
    console.log('✅ Create Course API Response:', data);
    return data;
    
  } catch (error) {
    console.error("❌ Error in courseService.createCourse:", error);
    
    // FIX: Enhanced error logging for 500 errors
    if (error.response?.status === 500) {
      console.error('🔴 Backend 500 Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        backendError: error.response?.data
      });
    }
    
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

  // FIX: SIMPLIFIED method to get courses by institute ID
  getInstituteCourses: async (instituteId) => {
    try {
      // FIX: Try multiple endpoint patterns to find what works
      let coursesData = [];
      
      // Try endpoint 1: /courses with institute filter
      try {
        const response1 = await api.get(`/courses?institute=${instituteId}`);
        const data1 = response1.data;
        console.log('🔍 Institute Courses API Response (Endpoint 1):', data1);
        
        if (Array.isArray(data1)) {
          coursesData = data1;
        } else if (data1 && Array.isArray(data1.courses)) {
          coursesData = data1.courses;
        } else if (data1 && data1.data && Array.isArray(data1.data)) {
          coursesData = data1.data;
        }
      } catch (error) {
        console.log('❌ Endpoint 1 failed, trying alternative...');
      }
      
      // If first endpoint failed or returned no data, try endpoint 2: get all and filter
      if (!coursesData || coursesData.length === 0) {
        try {
          const response2 = await api.get('/courses');
          const data2 = response2.data;
          console.log('🔍 All Courses API Response (Endpoint 2):', data2);
          
          // Extract courses array from response
          let allCourses = [];
          if (Array.isArray(data2)) {
            allCourses = data2;
          } else if (data2 && Array.isArray(data2.courses)) {
            allCourses = data2.courses;
          } else if (data2 && data2.data && Array.isArray(data2.data)) {
            allCourses = data2.data;
          }
          
          // Filter courses by institute ID
          coursesData = allCourses.filter(course => 
            course && course.institute && course.institute._id === instituteId
          );
        } catch (error) {
          console.log('❌ Endpoint 2 also failed');
        }
      }
      
      console.log(`🔍 Final courses for institute ${instituteId}:`, coursesData);
      return Array.isArray(coursesData) ? coursesData : [];
      
    } catch (error) {
      console.error("❌ Error in courseService.getInstituteCourses:", error);
      // FIX: Return empty array on error to prevent crashes
      return [];
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