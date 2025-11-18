// src/components/InstituteDashboard/CreateInstituteProfile.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { AuthContext } from '../../../context/AuthContext';
import './InstituteDashboard.css';

const CreateInstituteProfile = () => {
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
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

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

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            // We need to send the data as FormData for file uploads
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (typeof formData[key] === 'object') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const res = await api.post('/institutes', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAlert({ type: 'success', message: 'Institute profile created successfully!' });
            setTimeout(() => navigate('/institute/dashboard'), 2000);

        } catch (err) {
            setAlert({ type: 'danger', message: err.response?.data?.message || 'Failed to create profile' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Please log in to create an institute profile.</div>;
    }

    return (
        <div className="dashboard-layout">
            {/* You can reuse your InstituteSidebar here */}
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Create Your Institute Profile</h1>
                </div>
                {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Name</label><input type="text" name="name" value={formData.name} onChange={onChange} required /></div>
                    <div className="form-group"><label>Category</label><select name="category" value={formData.category} onChange={onChange} required>...</select></div>
                    <div className="form-group"><label>Affiliation</label><input type="text" name="affiliation" value={formData.affiliation} onChange={onChange} /></div>
                    <div className="form-group"><label>Address</label><input type="text" name="address" value={formData.address} onChange={onChange} required /></div>
                    <div className="form-row">
                        <div className="form-col">
                            <div className="form-group"><label>City</label><input type="text" name="city" value={formData.city} onChange={onChange} required /></div>
                        </div>
                        <div className="form-col">
                            <div className="form-group"><label>State</label><input type="text" name="state" value={formData.state} onChange={onChange} required /></div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-col">
                            <div className="form-group"><label>Phone</label><input type="text" name="contactInfo.phone" value={formData.contactInfo.phone} onChange={onChange} required /></div>
                        </div>
                        <div className="form-col">
                            <div className="form-group"><label>Email</label><input type="email" name="contactInfo.email" value={formData.contactInfo.email} onChange={onChange} required /></div>
                        </div>
                    </div>
                    <div className="form-group"><label>Website</label><input type="text" name="website" value={formData.website} onChange={onChange} /></div>
                    <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={onChange} rows="4"></textarea></div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Create Profile'}</button>
                </form>
            </div>
        </div>
    );
};

export default CreateInstituteProfile;