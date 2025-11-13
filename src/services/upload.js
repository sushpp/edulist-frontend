import api from './api';

export const uploadService = {
  uploadImage: async (file) => {
    try {
      // Enhanced validation
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid file provided');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      const data = response.data;
      console.log('🔍 Upload Image API Response:', data);
      return data;

    } catch (error) {
      console.error('❌ Error uploading image:', error);
      
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
      // Enhanced array validation
      if (!files || !Array.isArray(files) || files.length === 0) {
        throw new Error('Please select at least one image file');
      }

      // Safe file validation with try-catch
      const validFiles = files.filter(file => 
        file && file instanceof File && 
        file.size <= 5 * 1024 * 1024 && 
        file.type.startsWith('image/')
      );

      if (validFiles.length === 0) {
        throw new Error('No valid image files found. Please check file types and sizes (max 5MB).');
      }

      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      const data = response.data;
      console.log('🔍 Upload Multiple Images API Response:', data);
      
      // Enhanced response normalization
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.images)) {
        return data.images;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data && data.data && Array.isArray(data.data.images)) {
        return data.data.images;
      } else {
        console.warn('❌ Unexpected upload response format, returning empty array');
        return [];
      }

    } catch (error) {
      console.error('❌ Error uploading images:', error);
      
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

  deleteImage: async (imageUrl) => {
    try {
      if (!imageUrl) {
        throw new Error('Image URL is required');
      }

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

  testUpload: async () => {
    try {
      console.log('🧪 Testing upload service...');
      
      const blob = new Blob(['test'], { type: 'image/png' });
      const testFile = new File([blob], 'test.png', { type: 'image/png' });
      
      console.log('🧪 Test file created:', testFile);
      
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