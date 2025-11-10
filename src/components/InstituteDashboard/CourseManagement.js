import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/course';
import './InstituteDashboard.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    fees: '',
    category: '',
    facilities: [],
    eligibility: '',
    syllabus: [],
    image: null
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getCoursesByInstitute();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingCourse) {
        await courseService.updateCourse(editingCourse._id, formData);
      } else {
        await courseService.createCourse(formData);
      }
      
      setShowForm(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        duration: '',
        fees: '',
        category: '',
        facilities: [],
        eligibility: '',
        syllabus: [],
        image: null
      });
      setImagePreview(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      fees: course.fees,
      category: course.category,
      facilities: course.facilities || [],
      eligibility: course.eligibility || '',
      syllabus: course.syllabus || [],
      image: null
    });
    setImagePreview(course.imageUrl || null);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseId);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course. Please try again.');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFacility = () => {
    setFormData(prev => ({
      ...prev,
      facilities: [...prev.facilities, '']
    }));
  };

  const updateFacility = (index, value) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.map((fac, i) => i === index ? value : fac)
    }));
  };

  const removeFacility = (index) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="course-management">
      <div className="page-header">
        <h2>Course Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          + Add New Course
        </button>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingCourse(null);
                  setFormData({
                    title: '',
                    description: '',
                    duration: '',
                    fees: '',
                    category: '',
                    facilities: [],
                    eligibility: '',
                    syllabus: [],
                    image: null
                  });
                  setImagePreview(null);
                }}
                className="close-button"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Course Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="engineering">Engineering</option>
                    <option value="medical">Medical</option>
                    <option value="arts">Arts</option>
                    <option value="science">Science</option>
                    <option value="commerce">Commerce</option>
                    <option value="coaching">Coaching</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration *</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 4 years, 6 months"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fees (₹) *</label>
                  <input
                    type="number"
                    value={formData.fees}
                    onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Eligibility Criteria</label>
                <input
                  type="text"
                  value={formData.eligibility}
                  onChange={(e) => setFormData(prev => ({ ...prev, eligibility: e.target.value }))}
                  placeholder="e.g., 12th grade with 60% marks"
                />
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label>Course Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Course preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Facilities</label>
                {formData.facilities.map((facility, index) => (
                  <div key={index} className="facility-input">
                    <input
                      type="text"
                      value={facility}
                      onChange={(e) => updateFacility(index, e.target.value)}
                      placeholder="Facility name"
                    />
                    <button 
                      type="button"
                      onClick={() => removeFacility(index)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addFacility}
                  className="btn btn-outline btn-sm"
                >
                  + Add Facility
                </button>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCourse(null);
                    setImagePreview(null);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="courses-list">
        {courses.length === 0 ? (
          <div className="empty-state">
            <p>No courses added yet</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Add Your First Course
            </button>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course._id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <div className="course-actions">
                    <button 
                      onClick={() => handleEdit(course)}
                      className="btn btn-sm btn-outline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(course._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Course Image */}
                {course.imageUrl && (
                  <div className="course-image">
                    <img src={course.imageUrl} alt={course.title} />
                  </div>
                )}
                
                <p className="course-category">{course.category}</p>
                <p className="course-description">{course.description}</p>
                
                <div className="course-details">
                  <span><strong>Duration:</strong> {course.duration}</span>
                  <span><strong>Fees:</strong> ₹{course.fees}</span>
                  {course.eligibility && (
                    <span><strong>Eligibility:</strong> {course.eligibility}</span>
                  )}
                </div>

                {course.facilities && course.facilities.length > 0 && (
                  <div className="course-facilities">
                    <strong>Facilities:</strong>
                    <div className="facilities-tags">
                      {course.facilities.map((facility, index) => (
                        <span key={index} className="facility-tag">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;