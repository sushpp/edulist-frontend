import api from '../api';

const courseService = {
  // Get all courses for the currently logged-in institute
  getCoursesByInstitute: async () => {
    try {
      const response = await api.get('/courses/my');
      const data = response.data;
      
      console.log('🔍 Course API Response:', data);
      
      // Your backend returns { success: true, courses: [...] }
      if (data && Array.isArray(data.courses)) {
        console.log('📦 API returned { courses: array }');
        return data.courses;
      } else if (Array.isArray(data)) {
        console.log('📦 API returned direct array');
        return data;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('📦 API returned { data: array }');
        return data.data;
      }
      
      console.warn('❌ Unexpected API response format for courses. Returning empty array.');
      return [];
      
    } catch (error) {
      console.error("❌ Error in courseService.getCoursesByInstitute:", error);
      return [];
    }
  },

  // Get courses by institute ID (for public viewing) - FIXED ENDPOINT
  getInstituteCourses: async (instituteId) => {
    try {
      // FIX: Use the correct endpoint with instituteId parameter
      const response = await api.get(`/courses/institute/${instituteId}`);
      const data = response.data;
      
      console.log('🔍 Institute Courses API Response:', data);
      
      // Your backend returns { success: true, courses: [...] }
      if (data && Array.isArray(data.courses)) {
        console.log('📦 API returned { courses: array }');
        return data.courses;
      } else if (Array.isArray(data)) {
        return data;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      console.warn('❌ Unexpected API response format for institute courses. Returning empty array.');
      return [];
      
    } catch (error) {
      console.error("❌ Error in courseService.getInstituteCourses:", error);
      
      // If the specific endpoint fails, try getting all courses and filtering
      if (error.response?.status === 404) {
        console.log('🔄 404 detected, trying alternative approach...');
        return await courseService.getAllCoursesByInstituteId(instituteId);
      }
      
      return [];
    }
  },

  // Alternative method: Get all courses and filter by institute
  getAllCoursesByInstituteId: async (instituteId) => {
    try {
      const response = await api.get('/courses');
      const data = response.data;
      
      console.log('🔍 All Courses API Response:', data);
      
      let coursesArray = [];
      if (Array.isArray(data)) {
        coursesArray = data;
      } else if (data && Array.isArray(data.courses)) {
        coursesArray = data.courses;
      } else if (data && data.data && Array.isArray(data.data)) {
        coursesArray = data.data;
      }
      
      // Filter courses by institute ID
      const instituteCourses = coursesArray.filter(course => 
        course.institute && 
        (course.institute._id === instituteId || course.institute === instituteId)
      );
      
      console.log(`🔍 Filtered courses for institute ${instituteId}:`, instituteCourses);
      return instituteCourses;
      
    } catch (error) {
      console.error("❌ Error in courseService.getAllCoursesByInstituteId:", error);
      return [];
    }
  },

  // Create a new course
  createCourse: async (courseData) => {
    try {
      console.log('🔍 Course Data being sent:', courseData);
      
      const formData = new FormData();
      
      // Enhanced FormData handling
      for (const key in courseData) {
        if (courseData[key] !== null && courseData[key] !== undefined) {
          if (key === 'facilities' || key === 'syllabus') {
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
      
      // Log FormData contents for debugging
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
      
      // Enhanced error logging for 500 errors
      if (error.response?.status === 500) {
        console.error('🔴 Backend 500 Error Details:', {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
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
      
      for (const key in courseData) {
        if (courseData[key] !== null && courseData[key] !== undefined) {
          if (key === 'facilities' || key === 'syllabus') {
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
      
      const data = response.data;
      console.log('🔍 Update Course API Response:', data);
      return data;
      
    } catch (error) {
      console.error("❌ Error in courseService.updateCourse:", error);
      return null;
    }
  },

  // Delete a course
  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(`/courses/${courseId}`);
      const data = response.data;
      console.log('🔍 Delete Course API Response:', data);
      return data;
    } catch (error) {
      console.error("❌ Error in courseService.deleteCourse:", error);
      return null;
    }
  },

  // Test all course endpoints
  testEndpoints: async () => {
    try {
      console.log('🧪 TESTING COURSE ENDPOINTS...');
      
      // Test 1: Check if /courses/my works
      console.log('🧪 Testing /courses/my...');
      try {
        const myCourses = await api.get('/courses/my');
        console.log('✅ /courses/my - SUCCESS:', myCourses.data);
      } catch (error) {
        console.log('❌ /courses/my - FAILED:', error.response?.status, error.message);
      }
      
      // Test 2: Check if /courses/institute/{id} works
      console.log('🧪 Testing /courses/institute/{id}...');
      try {
        const instituteCourses = await api.get('/courses/institute/test-id');
        console.log('✅ /courses/institute/{id} - SUCCESS:', instituteCourses.data);
      } catch (error) {
        console.log('❌ /courses/institute/{id} - FAILED:', error.response?.status, error.message);
      }
      
      // Test 3: Check if /courses works
      console.log('🧪 Testing /courses...');
      try {
        const allCourses = await api.get('/courses');
        console.log('✅ /courses - SUCCESS:', allCourses.data);
      } catch (error) {
        console.log('❌ /courses - FAILED:', error.response?.status, error.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error('🧪 TEST - Error:', error);
      return { success: false, error: error.message };
    }
  }
};

export { courseService };