import api from './api';

export const uploadService = {
  uploadImage: async (file) => {
    try {
      // FIX: Add file validation
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid file provided');
      }

      // FIX: Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // FIX: Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // FIX: Add longer timeout for file uploads
        timeout: 30000, // 30 seconds
      });

      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Upload Image API Response:', data);
      return data;

    } catch (error) {
      console.error('❌ Error uploading image:', error);
      
      // FIX: Enhanced error handling with user-friendly messages
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout. Please try again.');
      }
      
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      
      const errorMessage = error.response?.data?.message || 'Failed to upload image';
      throw new Error(errorMessage);
    }
  },

  uploadMultipleImages: async (files) => {
    try {
      // FIX: Ensure files is an array
      if (!files || !Array.isArray(files)) {
        throw new Error('Invalid files array provided');
      }

      // FIX: Validate each file
      files.forEach((file, index) => {
        if (!file || !(file instanceof File)) {
          throw new Error(`Invalid file at position ${index}`);
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${index + 1} exceeds 5MB size limit`);
        }
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${index + 1} is not an image`);
        }
      });

      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // FIX: Add longer timeout for multiple files
        timeout: 60000, // 60 seconds
      });

      // FIX: Normalize response format and ensure it returns an array
      const data = response.data;
      console.log('🔍 Upload Multiple Images API Response:', data);
      
      // FIX: Ensure consistent response format - always return array of image objects
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.images)) {
        return data.images;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else {
        console.warn('❌ Unexpected upload response format');
        return [];
      }

    } catch (error) {
      console.error('❌ Error uploading images:', error);
      
      // FIX: Enhanced error handling
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout. Please try again.');
      }
      
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      
      const errorMessage = error.response?.data?.message || 'Failed to upload images';
      throw new Error(errorMessage);
    }
  },

  // FIX: Added method to delete uploaded image
  deleteImage: async (imageUrl) => {
    try {
      const response = await api.delete('/upload/image', {
        data: { imageUrl }
      });
      
      const data = response.data;
      console.log('🔍 Delete Image API Response:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  },

  // FIX: Added test method to check upload functionality
  testUpload: async () => {
    try {
      console.log('🧪 Testing upload service...');
      
      // Create a simple test file
      const blob = new Blob(['test'], { type: 'image/png' });
      const testFile = new File([blob], 'test.png', { type: 'image/png' });
      
      console.log('🧪 Test file created:', testFile);
      
      // Test single upload
      try {
        const result = await uploadService.uploadImage(testFile);
        console.log('✅ Single upload test - SUCCESS:', result);
      } catch (error) {
        console.log('❌ Single upload test - FAILED:', error.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error('🧪 Upload test error:', error);
      return { success: false, error: error.message };
    }
  }
};