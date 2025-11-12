// ProfileManagement.jsx
import React, { useState, useEffect } from 'react';
import { instituteService } from '../../services/institute';
import { uploadService } from '../../services/upload';
import { API_URL } from '../../config';
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
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image?.url) return '';
    return image.url.startsWith('http') ? image.url : `${API_URL}${image.url}`;
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

          {/* Basic Info, Contact, Address, Description */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Institute Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category || ''} onChange={handleChange} disabled={!editing}>
                  <option value="school">School</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                  <option value="coaching">Coaching Center</option>
                  <option value="preschool">Preschool</option>
                </select>
              </div>
              <div className="form-group">
                <label>Affiliation</label>
                <input type="text" name="affiliation" value={formData.affiliation || ''} onChange={handleChange} disabled={!editing} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="contact.email" value={formData.contact?.email || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="contact.phone" value={formData.contact?.phone || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input type="url" name="contact.website" value={formData.contact?.website || ''} onChange={handleChange} disabled={!editing} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Address</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Street</label>
                <input type="text" name="address.street" value={formData.address?.street || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="address.city" value={formData.address?.city || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="address.state" value={formData.address?.state || ''} onChange={handleChange} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" name="address.pincode" value={formData.address?.pincode || ''} onChange={handleChange} disabled={!editing} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Description</h3>
            <div className="form-group">
              <textarea name="description" value={formData.description || ''} onChange={handleChange} disabled={!editing} rows="4" placeholder="Describe your institute..." />
            </div>
          </div>

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
