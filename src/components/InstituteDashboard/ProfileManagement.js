import React, { useState, useEffect } from 'react';
import { instituteService } from '../../services/institute';
import { uploadService } from '../../services/upload';
import './InstituteDashboard.css';

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL;

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
          ...prev[parent],
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
        const newImage = { ...imageData, isPrimary: formData.images?.length === 0 };
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), newImage] }));
      }

      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index, imageType) => {
    if (imageType === 'logo') {
      setFormData(prev => ({ ...prev, logo: null }));
    } else if (imageType === 'institute') {
      setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) }));
    }
  };

  const setPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.map((img, i) => ({ ...img, isPrimary: i === index }))
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
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image?.url) return '';
    if (image.url.startsWith('http')) return image.url;
    return `${API_URL}${image.url}`;
  };

  if (loading && !institute) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-management">
      <div className="page-header">
        <h2>Institute Profile</h2>
        <button onClick={() => setEditing(!editing)} className="btn btn-primary">
          {editing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>
      )}

      {institute && (
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Logo Upload */}
          <div className="form-section">
            <h3>Institute Logo</h3>
            <div className="image-upload-section">
              <div className="current-images">
                {formData.logo?.url ? (
                  <div className="image-preview">
                    <img src={getImageUrl(formData.logo)} alt="Institute Logo" className="logo-preview" />
                    {editing && (
                      <button type="button" onClick={() => removeImage(0, 'logo')} className="remove-image-btn">
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="no-image">No logo uploaded</div>
                )}
              </div>
              {editing && (
                <div className="upload-controls">
                  <label className="upload-btn">
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} disabled={uploading} style={{ display: 'none' }} />
                  </label>
                  <small>Recommended: 200x200px, PNG or JPG</small>
                </div>
              )}
            </div>
          </div>

          {/* Institute Images */}
          <div className="form-section">
            <h3>Institute Images</h3>
            <div className="image-upload-section">
              <div className="current-images">
                {formData.images?.length > 0 ? (
                  <div className="images-grid">
                    {formData.images.map((image, index) => (
                      <div key={index} className={`image-preview ${image.isPrimary ? 'primary' : ''}`}>
                        <img src={getImageUrl(image)} alt={`Institute ${index + 1}`} />
                        {image.isPrimary && <span className="primary-badge">Primary</span>}
                        {editing && (
                          <div className="image-actions">
                            <button type="button" onClick={() => setPrimaryImage(index)} disabled={image.isPrimary}>
                              Set Primary
                            </button>
                            <button type="button" onClick={() => removeImage(index, 'institute')}>Remove</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-image">No images uploaded</div>
                )}
              </div>
              {editing && (
                <div className="upload-controls">
                  <label className="upload-btn">
                    {uploading ? 'Uploading...' : 'Add Images'}
                    <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, 'institute')} disabled={uploading} style={{ display: 'none' }} />
                  </label>
                  <small>Upload multiple images to showcase your institute</small>
                </div>
              )}
            </div>
          </div>

          {/* Rest of form fields */}
          {/* Name, category, affiliation, contact, address, description */}
          {/* ... same as before, just ensure image URLs use getImageUrl() */}
          
          {editing && (
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default ProfileManagement;
