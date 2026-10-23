import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);

      // Intelligently route based on role if no explicit previous location
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else if (user.role === 'head' || user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'member') {
        navigate('/portal', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">Aviation Club NITRR</span>
          <h1>Club Clearance Login</h1>
          <p className="auth-subtitle">
            Sign in to access Member resources, flight logs, or the Club Head console.
          </p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Institute / Registered Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="e.g. pratyush@nitrr.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-auth-submit">
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet? <Link to="/register">Create Account</Link>
        </div>

        <div className="auth-roles-preview">
          <h4>Multi-Tier Access Levels</h4>
          <div className="role-tags">
            <span className="role-tag user">Normal User: Public Pages & Results</span>
            <span className="role-tag member">Member: Portal & CAD Files</span>
            <span className="role-tag head">Head: Full Management Console</span>
          </div>
        </div>
      </div>
    </main>
  );
}
