// ProfileManagement.jsx
import React, { useState, useEffect } from 'react';
import { instituteService } from '../../services/institute';
import { uploadService } from '../../services/upload';
import './InstituteDashboard.css';

const ProfileManagement = () => {
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchInstituteProfile();
  }, []);

  const fetchInstituteProfile = async () => {
    try {
      const data = await instituteService.getInstituteProfile();
      setInstitute(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching institute profile:', error);
      setMessage('Error loading profile');
      const defaultInstitute = {
        name: '',
        category: '',
        affiliation: '',
        description: '',
        contact: { email: '', phone: '', website: '' },
        address: { street: '', city: '', state: '', pincode: '' },
        images: [],
        logo: null
      };
      setInstitute(defaultInstitute);
      setFormData(defaultInstitute);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const uploadResponse = await uploadService.uploadImage(file);
      const imageData = {
        url: uploadResponse.imageUrl,
        filename: uploadResponse.filename
      };

      if (imageType === 'logo') {
        setFormData(prev => ({ ...prev, logo: imageData }));
      } else if (imageType === 'institute') {
        setFormData(prev => {
          const currentImages = Array.isArray(prev.images) ? prev.images : [];
          const newImage = { ...imageData, isPrimary: currentImages.length === 0 };
          return {
            ...prev,
            images: [...currentImages, newImage]
          };
        });
      }

      setMessage('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const removeImage = (index, imageType) => {
    if (imageType === 'logo') {
      setFormData(prev => ({ ...prev, logo: null }));
    } else if (imageType === 'institute') {
      setFormData(prev => ({
        ...prev,
        images: Array.isArray(prev.images) ? prev.images.filter((_, i) => i !== index) : []
      }));
    }
  };

  const setPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: Array.isArray(prev.images)
        ? prev.images.map((img, i) => ({ ...img, isPrimary: i === index }))
        : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await instituteService.updateInstitute(formData);
      setInstitute(formData);
      setEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getImageUrl = (image) => {
    if (!image?.url) return '';
    return image.url;
  };

  if (loading && !institute) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-management">
      <div className="page-header">
        <h2>Institute Profile</h2>
        <button onClick={() => setEditing(!editing)} className="btn btn-primary">
          {editing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {formData && (
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Logo Section */}
          <div className="form-section">
            <h3>Institute Logo</h3>
            <div className="image-upload-section">
              <div className="image-preview">
                {formData.logo?.url ? (
                  <img src={getImageUrl(formData.logo)} alt="Logo" className="logo-preview" />
                ) : (
                  'No logo uploaded'
                )}
                {editing && formData.logo && (
                  <button type="button" onClick={() => removeImage(0, 'logo')}>
                    Remove
                  </button>
                )}
              </div>
              {editing && (
                <label className="upload-btn">
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} disabled={uploading} hidden />
                </label>
              )}
            </div>
          </div>

          {/* Images Section */}
          <div className="form-section">
            <h3>Institute Images</h3>
            <div className="image-upload-section">
              {Array.isArray(formData.images) && formData.images.length > 0 ? (
                <div className="images-grid">
                  {formData.images.map((img, index) => (
                    <div key={img._id || img.filename} className={`image-preview ${img.isPrimary ? 'primary' : ''}`}>
                      <img src={getImageUrl(img)} alt={`Image ${index}`} />
                      {editing && (
                        <div className="image-actions">
                          <button type="button" onClick={() => setPrimaryImage(index)} disabled={img.isPrimary}>Set Primary</button>
                          <button type="button" onClick={() => removeImage(index, 'institute')}>Remove</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                'No images uploaded'
              )}
              {editing && (
                <label className="upload-btn">
                  {uploading ? 'Uploading...' : 'Add Images'}
                  <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'institute')} hidden />
                </label>
              )}
            </div>
          </div>

          {/* Other fields follow (Category, Contact, Description, etc.) */}

          <div className="form-actions">
            {editing && (
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileManagement;
