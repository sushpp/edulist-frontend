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
      const safeData = data ?? {
        name: '', category: '', affiliation: '', description: '',
        contact: { email: '', phone: '', website: '' },
        address: { street: '', city: '', state: '', pincode: '' },
        images: [], logo: null
      };
      setInstitute(safeData);
      setFormData(safeData);
    } catch (error) {
      console.error('Error fetching institute profile:', error);
      const defaultInstitute = {
        name: '', category: '', affiliation: '', description: '',
        contact: { email: '', phone: '', website: '' },
        address: { street: '', city: '', state: '', pincode: '' },
        images: [], logo: null
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
      setFormData(prev => ({ ...prev, [parent]: { ...(prev[parent] || {}), [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setMessage('Invalid file type');
    if (file.size > 5 * 1024 * 1024) return setMessage('File too large');

    setUploading(true);
    try {
      const uploadRes = await uploadService.uploadImage(file);
      const imageData = { url: uploadRes.imageUrl, filename: uploadRes.filename };
      if (type === 'logo') setFormData(prev => ({ ...prev, logo: imageData }));
      else if (type === 'institute') {
        const currentImages = Array.isArray(formData.images) ? formData.images : [];
        setFormData(prev => ({ ...prev, images: [...currentImages, { ...imageData, isPrimary: currentImages.length === 0 }] }));
      }
      setMessage('Uploaded successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const removeImage = (index, type) => {
    if (type === 'logo') setFormData(prev => ({ ...prev, logo: null }));
    else if (type === 'institute') {
      setFormData(prev => ({ ...prev, images: Array.isArray(prev.images) ? prev.images.filter((_, i) => i !== index) : [] }));
    }
  };

  const setPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: Array.isArray(prev.images) ? prev.images.map((img, i) => ({ ...img, isPrimary: i === index })) : []
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
      console.error(error);
      setMessage('Update failed');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading && !institute) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-management">
      <h2>Institute Profile</h2>
      <button onClick={() => setEditing(!editing)}>{editing ? 'Cancel Edit' : 'Edit Profile'}</button>
      {message && <div className={message.includes('failed') ? 'error' : 'success'}>{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* Logo */}
        <div>
          <h3>Logo</h3>
          {formData.logo?.url ? <img src={formData.logo.url} alt="Logo" /> : 'No logo'}
          {editing && <input type="file" onChange={(e) => handleImageUpload(e, 'logo')} />}
          {editing && formData.logo && <button type="button" onClick={() => removeImage(0, 'logo')}>Remove</button>}
        </div>

        {/* Images */}
        <div>
          <h3>Images</h3>
          {Array.isArray(formData.images) && formData.images.length > 0 ? formData.images.map((img, i) => (
            <div key={img.filename || i}>
              <img src={img.url} alt={`img-${i}`} />
              {editing && <button type="button" onClick={() => setPrimaryImage(i)} disabled={img.isPrimary}>Set Primary</button>}
              {editing && <button type="button" onClick={() => removeImage(i, 'institute')}>Remove</button>}
            </div>
          )) : 'No images'}
          {editing && <input type="file" multiple onChange={(e) => handleImageUpload(e, 'institute')} />}
        </div>

        {/* Other fields */}
        <div>
          <label>Name:</label>
          <input name="name" value={formData.name ?? ''} onChange={handleChange} disabled={!editing} />
        </div>

        <button type="submit" disabled={!editing || loading}>{editing ? 'Update' : 'Save'}</button>
      </form>
    </div>
  );
};

export default ProfileManagement;
