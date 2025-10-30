import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateElection from './components/dashboard/CreateElection';
import CandidateRegistration from './components/portfolio/CandidateRegistration';
import Voting from './components/markets/Voting';
import Results from './components/layout/Results';
import ElectionDetails from './components/layout/ElectionDetails';
import ElectionsList from './components/layout/ElectionsList';
import axios from 'axios';
import './App.css';

function AuthPage() {
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    dateOfBirth: '',
    address: '',
    collegeId: '',
    role: 'student',
    department: '',
    year: ''
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (activeTab === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Full name is required';
      }

      if (!formData.collegeId) {
        newErrors.collegeId = 'College ID is required';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        if (activeTab === 'signin') {
          const res = await axios.post('/api/auth/login', {
            email: formData.email,
            password: formData.password
          });
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          window.location.href = '/dashboard';
        } else {
          await axios.post('/api/auth/register', {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            collegeId: formData.collegeId,
            role: formData.role,
            department: formData.department,
            year: formData.year
          });
          alert('Registration successful! Please sign in.');
          setActiveTab('signin');
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            dateOfBirth: '',
            address: '',
            collegeId: '',
            role: 'student',
            department: '',
            year: ''
          });
        }
      } catch (err) {
        alert(err.response?.data?.message || 'An error occurred');
      }
    }
  };

  return (
    <div className="App">
      <div className="auth-container">
        <div className="auth-header">
          <h1>College Election Portal</h1>
          <p>Secure, transparent, and accessible voting for everyone</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="collegeId">College ID *</label>
                  <input
                    type="text"
                    id="collegeId"
                    name="collegeId"
                    value={formData.collegeId}
                    onChange={handleInputChange}
                    placeholder="Enter your college ID"
                    className={errors.collegeId ? 'error' : ''}
                  />
                  {errors.collegeId && <span className="error-message">{errors.collegeId}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Enter your department"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year">Year (for students)</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="Enter your year"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {activeTab === 'signup' && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="terms-container">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                </label>
              </div>
            )}

            <button type="submit" className="auth-button">
              {activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer">
            {activeTab === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  className="switch-link"
                  onClick={() => setActiveTab('signup')}
                >
                  Sign Up Now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  className="switch-link"
                  onClick={() => setActiveTab('signin')}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/elections" element={token ? <ElectionsList /> : <Navigate to="/login" />} />
        <Route path="/create-election" element={token ? <CreateElection /> : <Navigate to="/login" />} />
        <Route path="/election/:id" element={token ? <ElectionDetails /> : <Navigate to="/login" />} />
        <Route path="/election/:id/candidate" element={token ? <CandidateRegistration /> : <Navigate to="/login" />} />
        <Route path="/election/:id/vote" element={token ? <Voting /> : <Navigate to="/login" />} />
        <Route path="/election/:id/results" element={token ? <Results /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
