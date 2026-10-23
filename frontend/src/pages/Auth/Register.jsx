import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    branch: 'Mechanical',
    year: '2nd Year',
    subteam: 'Aerodynamics & Airframe',
    requestMembership: true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        branch: formData.branch,
        year: formData.year,
        subteam: formData.subteam,
        requestMembership: formData.requestMembership,
      });

      // Navigate to homepage or portal
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again with another email.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">Aviation Club NITRR</span>
          <h1>Create Account</h1>
          <p className="auth-subtitle">
            Register to join the club platform. Recruited members can request verified Member clearance.
          </p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Raghava"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Institute / Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="e.g. member@nitrr.ac.in"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Re-type password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="branch">Branch</label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              >
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="CSE">Computer Science & Engg</option>
                <option value="IT">Information Technology</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EE">Electrical Engineering</option>
                <option value="Civil">Civil Engineering</option>
                <option value="Chemical">Chemical Engineering</option>
                <option value="Metallurgy">Metallurgical Engineering</option>
                <option value="Mining">Mining Engineering</option>
                <option value="Biomedical">Biomedical Engineering</option>
                <option value="Biotechnology">Biotechnology</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year">Current Year</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subteam">Aviation Domain / Wing</label>
            <select
              id="subteam"
              name="subteam"
              value={formData.subteam}
              onChange={handleChange}
            >
              <option value="Aerodynamics & Airframe">Aerodynamics & Airframe</option>
              <option value="Avionics & Telemetry">Avionics & Electronics</option>
              <option value="Software & Flight Simulation">Software & Web Development</option>
              <option value="Media & Public Relations">Media & Public Relations</option>
              <option value="Operations & Logistics">Operations & Logistics</option>
            </select>
          </div>

          <div className="checkbox-group">
            <input
              id="requestMembership"
              name="requestMembership"
              type="checkbox"
              checked={formData.requestMembership}
              onChange={handleChange}
            />
            <label htmlFor="requestMembership">
              <strong>Request Member Verification</strong>
              <br />
              <small style={{ color: '#94a3b8' }}>
                Check this if you are a recruited member so Club Heads can grant you Member Portal access.
              </small>
            </label>
          </div>

          <button type="submit" disabled={submitting} className="btn-auth-submit">
            {submitting ? 'Creating Clearance...' : 'Complete Registration'}
          </button>
        </form>

        <div className="auth-footer">
          Already have clearance? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </main>
  );
}
