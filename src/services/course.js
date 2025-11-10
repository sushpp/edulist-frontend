import api from './api';

export const courseService = {
  createCourse: async (courseData) => {
    const formData = new FormData();
    
    // Append all course data to formData
    Object.keys(courseData).forEach(key => {
      if (key === 'facilities' && Array.isArray(courseData[key])) {
        // Handle array fields
        courseData[key].forEach((facility, index) => {
          formData.append(`facilities[${index}]`, facility);
        });
      } else if (key === 'image' && courseData[key] instanceof File) {
        // Handle file upload
        formData.append('image', courseData[key]);
      } else {
        formData.append(key, courseData[key]);
      }
    });

    const response = await api.post('/courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getCoursesByInstitute: async () => {
    const response = await api.get('/courses/institute');
    return response.data;
  },

  getInstituteCourses: async (instituteId) => {
    const response = await api.get(`/courses/institute/${instituteId}`);
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const formData = new FormData();
    
    // Append all course data to formData
    Object.keys(courseData).forEach(key => {
      if (key === 'facilities' && Array.isArray(courseData[key])) {
        courseData[key].forEach((facility, index) => {
          formData.append(`facilities[${index}]`, facility);
        });
      } else if (key === 'image' && courseData[key] instanceof File) {
        formData.append('image', courseData[key]);
      } else {
        formData.append(key, courseData[key]);
      }
    });

    const response = await api.put(`/courses/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCourse: async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  }
};