import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import InstituteSidebar from './InstituteSidebar';
import api from '../../services/api';
import './InstituteDashboard.css';

const ProfileManagement = () => {
  const { user } = useContext(AuthContext);
  const [institute, setInstitute] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    affiliation: '',
    address: '',
    city: '',
    state: '',
    contactInfo: { phone: '', email: '' },
    website: '',
    description: '',
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        const res = await api.get('/institutes/dashboard/me');
        const instituteData = res.data.institute;
        setInstitute(instituteData);
        setFormData({
          name: instituteData.name || '',
          category: instituteData.category || '',
          affiliation: instituteData.affiliation || '',
          address: instituteData.address || '',
          city: instituteData.city || '',
          state: instituteData.state || '',
          contactInfo: {
            phone: instituteData.contactInfo?.phone || '',
            email: instituteData.contactInfo?.email || '',
          },
          website: instituteData.website || '',
          description: instituteData.description || '',
        });
        if (instituteData.media && instituteData.media.logo) {
          setLogoPreview(`${process.env.REACT_APP_API_URL}/uploads/${instituteData.media.logo}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInstitute();
  }, []);

  const onChange = e => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const onLogoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && key !== 'logoFile') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      const res = await api.put('/institutes', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setInstitute(res.data);
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
      setEditMode(false);
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode && institute) {
      setFormData({
        name: institute.name || '',
        category: institute.category || '',
        affiliation: institute.affiliation || '',
        address: institute.address || '',
        city: institute.city || '',
        state: institute.state || '',
        contactInfo: {
          phone: institute.contactInfo?.phone || '',
          email: institute.contactInfo?.email || '',
        },
        website: institute.website || '',
        description: institute.description || '',
      });
      if (institute.media && institute.media.logo) {
        setLogoPreview(`${process.env.REACT_APP_API_URL}/uploads/${institute.media.logo}`);
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <InstituteSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Profile Management</h1>
          <button className="btn btn-primary" onClick={toggleEditMode}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <div className="form-section">
          <h2>Institute Information</h2>
          
          <div className="profile-header">
            <div className="profile-logo">
              {logoPreview ? (
                <img src={logoPreview} alt="Institute Logo" />
              ) : (
                <div className="placeholder-logo">
                  <i className="fas fa-university"></i>
                </div>
              )}
            </div>
            
            <div className="profile-info">
              <h3>{institute?.name}</h3>
              <span className={`status-badge ${institute?.verifiedStatus}`}>
                {institute?.verifiedStatus}
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="name">Institute Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    disabled={!editMode}
                    required
                  />
                </div>
              </div>
              
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={onChange}
                    disabled={!editMode}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="School">School</option>
                    <option value="College">College</option>
                    <option value="University">University</option>
                    <option value="Coaching Center">Coaching Center</option>
                    <option value="Preschool">Preschool</option>
                    <option value="Vocational Training">Vocational Training</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="affiliation">Affiliation</label>
              <input
                type="text"
                id="affiliation"
                name="affiliation"
                value={formData.affiliation}
                onChange={onChange}
                disabled={!editMode}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={onChange}
                disabled={!editMode}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={onChange}
                    disabled={!editMode}
                    required
                  />
                </div>
              </div>
              
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={onChange}
                    disabled={!editMode}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="contactInfo.phone">Phone Number</label>
                  <input
                    type="text"
                    id="contactInfo.phone"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={onChange}
                    disabled={!editMode}
                    required
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="contactInfo.email">Email Address</label>
                  <input
                    type="email"
                    id="contactInfo.email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={onChange}
                    disabled={!editMode}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={onChange}
                disabled={!editMode}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={onChange}
                rows="5"
                disabled={!editMode}
              ></textarea>
            </div>
            
            {editMode && (
              <>
                <div className="form-group">
                  <label htmlFor="logo">Logo</label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    onChange={onLogoChange}
                    accept="image/*"
                  />
                </div>
                
                <div className="btn-group">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={toggleEditMode}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;