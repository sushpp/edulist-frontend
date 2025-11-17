import React, { useState, useEffect } from 'react';
import InstituteSidebar from './InstituteSidebar';
import api from '../../services/api';
import './InstituteDashboard.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    fees: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
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
        formDataToSend.append(key, formData[key]);
      });
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      let res;
      if (editingCourse) {
        res = await api.put(`/courses/${editingCourse._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        res = await api.post('/courses', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (editingCourse) {
        setCourses(courses.map(course => 
          course._id === editingCourse._id ? res.data : course
        ));
      } else {
        setCourses([...courses, res.data]);
      }

      setAlert({ type: 'success', message: `Course ${editingCourse ? 'updated' : 'added'} successfully!` });
      resetForm();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.msg || `Failed to ${editingCourse ? 'update' : 'add'} course` });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = course => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      fees: course.fees,
    });
    if (course.image) {
      setImagePreview(`http://localhost:5000/uploads/${course.image}`);
    }
    setShowAddForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        setCourses(courses.filter(course => course._id !== id));
        setAlert({ type: 'success', message: 'Course deleted successfully!' });
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to delete course' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      fees: '',
    });
    setImageFile(null);
    setImagePreview('');
    setEditingCourse(null);
    setShowAddForm(false);
  };

  return (
    <div className="dashboard-layout">
      <InstituteSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Courses</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus"></i> Add New Course
          </button>
        </div>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        {showAddForm && (
          <div className="form-section">
            <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Course Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="duration">Duration</label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={onChange}
                      placeholder="e.g., 6 months, 2 years"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="fees">Fees ($)</label>
                    <input
                      type="number"
                      id="fees"
                      name="fees"
                      value={formData.fees}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Course Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={onImageChange}
                  accept="image/*"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Course preview" />
                  </div>
                )}
              </div>
              
              <div className="btn-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Add Course')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="table-container">
          <div className="table-header">
            <h2>All Courses</h2>
            <div className="table-actions">
              <span>{courses.length} courses</span>
            </div>
          </div>
          
          {courses.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Fees</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id}>
                    <td>
                      {course.image ? (
                        <img 
                          src={`http://localhost:5000/uploads/${course.image}`} 
                          alt={course.title}
                          className="table-image"
                        />
                      ) : (
                        <div className="table-image-placeholder">
                          <i className="fas fa-book"></i>
                        </div>
                      )}
                    </td>
                    <td>{course.title}</td>
                    <td>{course.duration}</td>
                    <td>${course.fees}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(course)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(course._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <h3>No courses yet</h3>
              <p>Add your first course to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;