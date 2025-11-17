import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find the Best Educational Institutions</h1>
            <p>Search, compare, and review schools, colleges, and coaching centers in your area</p>
            <div className="hero-buttons">
              <Link to="/institutes" className="btn btn-primary btn-lg">Browse Institutes</Link>
              <Link to="/register" className="btn btn-secondary btn-lg">Register Your Institute</Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose EduList?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>Easy Search</h3>
              <p>Find educational institutions by name, location, category, or affiliation</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Verified Reviews</h3>
              <p>Read authentic reviews from students and parents to make informed decisions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-filter"></i>
              </div>
              <h3>Advanced Filters</h3>
              <p>Filter institutes by facilities, fees, ratings, and more</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Direct Enquiry</h3>
              <p>Contact institutes directly through our platform with your questions</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search</h3>
              <p>Search for educational institutions based on your preferences</p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>Compare</h3>
              <p>Compare different institutes based on facilities, fees, and reviews</p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Enquire</h3>
              <p>Send enquiries directly to institutes to get more information</p>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <h3>Review</h3>
              <p>Share your experience by reviewing institutes you've visited</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find the Perfect Educational Institution?</h2>
            <p>Join thousands of students and parents who trust EduList for their educational needs</p>
            <Link to="/institutes" className="btn btn-primary btn-lg">Get Started</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;