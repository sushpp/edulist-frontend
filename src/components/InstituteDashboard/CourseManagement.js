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
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'duration', 'fees', 'category'];
      const missingFields = requiredFields.filter(field => !formData[field]?.toString().trim());
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Prepare course data
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: formData.duration.trim(),
        fees: Number(formData.fees) || 0,
        category: formData.category,
        eligibility: formData.eligibility?.trim() || '',
        facilities: Array.isArray(formData.facilities) ? formData.facilities.filter(f => f.trim()) : [],
        syllabus: Array.isArray(formData.syllabus) ? formData.syllabus.filter(s => s.trim()) : [],
        image: formData.image // File object for upload
      };

      console.log('📤 Sending course data:', courseData);

      let result;
      if (editingCourse) {
        result = await courseService.updateCourse(editingCourse._id, courseData);
      } else {
        result = await courseService.createCourse(courseData);
      }

      if (result) {
        // Success
        setShowForm(false);
        setEditingCourse(null);
        resetForm();
        fetchCourses();
        alert(editingCourse ? 'Course updated successfully!' : 'Course created successfully!');
      } else {
        alert('Failed to save course. Please try again.');
      }
      
    } catch (error) {
      console.error('❌ Error saving course:', error);
      alert('Error saving course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      duration: course.duration || '',
      fees: course.fees || '',
      category: course.category || '',
      facilities: Array.isArray(course.facilities) ? course.facilities : [],
      eligibility: course.eligibility || '',
      syllabus: Array.isArray(course.syllabus) ? course.syllabus : [],
      image: null
    });
    setImagePreview(course.imageUrl || null);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const result = await courseService.deleteCourse(courseId);
        if (result) {
          fetchCourses();
          alert('Course deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course. Please try again.');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
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
      facilities: [...(Array.isArray(prev.facilities) ? prev.facilities : []), '']
    }));
  };

  const updateFacility = (index, value) => {
    setFormData(prev => ({
      ...prev,
      facilities: Array.isArray(prev.facilities) 
        ? prev.facilities.map((fac, i) => i === index ? value : fac)
        : []
    }));
  };

  const removeFacility = (index) => {
    setFormData(prev => ({
      ...prev,
      facilities: Array.isArray(prev.facilities) 
        ? prev.facilities.filter((_, i) => i !== index)
        : []
    }));
  };

  // Test with JSON instead of FormData
  const testJsonCourseCreation = async () => {
    console.log('🧪 Testing course creation with JSON data...');
    
    const testData = {
      title: 'Test Course ' + Date.now(),
      description: 'This is a test course description',
      duration: '6 months',
      fees: 10000,
      category: 'coaching',
      eligibility: '12th grade',
      facilities: ['Library', 'Lab'],
      syllabus: ['Module 1', 'Module 2']
    };
    
    try {
      const result = await courseService.createCourseJson(testData);
      console.log('🧪 Test result:', result);
      if (result) {
        alert('Test course created successfully!');
        fetchCourses();
      }
    } catch (error) {
      console.error('🧪 Test failed:', error);
      alert('Test failed: ' + error.message);
    }
  };

  return (
    <div className="course-management">
      <div className="page-header">
        <h2>Course Management</h2>
        <div className="header-actions">
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            + Add New Course
          </button>
          <button 
            onClick={testJsonCourseCreation}
            className="btn btn-outline"
            style={{ marginLeft: '10px' }}
          >
            🧪 Test JSON
          </button>
        </div>
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
                  resetForm();
                }}
                className="close-button"
                type="button"
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
                    placeholder="Enter course title"
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
                    min="0"
                    step="100"
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
                  placeholder="Describe the course in detail"
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
                {Array.isArray(formData.facilities) && formData.facilities.map((facility, index) => (
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
                    resetForm();
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
        {!courses || courses.length === 0 ? (
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
            {Array.isArray(courses) && courses.map(course => (
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

                {course.facilities && Array.isArray(course.facilities) && course.facilities.length > 0 && (
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