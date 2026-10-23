import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import './ProtectedRoute.css';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, requestMembership } = useAuth();
  const location = useLocation();
  const [requested, setRequested] = React.useState(false);
  const [requestMsg, setRequestMsg] = React.useState('');

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="spinner"></div>
        <p>Verifying access clearance...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const handleRequest = async () => {
      try {
        await requestMembership({ branch: user.branch, year: user.year, subteam: user.subteam });
        setRequested(true);
        setRequestMsg('Membership upgrade request submitted to Club Heads!');
      } catch (err) {
        setRequestMsg(err.message || 'Failed to submit request');
      }
    };

    return (
      <div className="restricted-container">
        <div className="restricted-card">
          <div className="restricted-icon">🔒</div>
          <h2>Clearance Restricted</h2>
          <p className="restricted-msg">
            This section requires <strong>{allowedRoles.join(' / ').toUpperCase()}</strong> clearance.
          </p>
          <div className="restricted-user-badge">
            Current Account: <strong>{user.name}</strong> ({user.role.toUpperCase()})
          </div>

          {user.role === 'user' && allowedRoles.includes('member') && (
            <div className="restricted-upgrade-box">
              <p>Are you a recruited Aviation Club member?</p>
              {requested || user.membershipRequested ? (
                <div className="status-badge requested">
                  ✓ Upgrade requested. A Club Head will verify and activate your Member status.
                </div>
              ) : (
                <button onClick={handleRequest} className="btn-request-upgrade">
                  Request Member Verification
                </button>
              )}
              {requestMsg && <p className="request-feedback">{requestMsg}</p>}
            </div>
          )}

          <div className="restricted-actions">
            <Link to="/" className="btn-return-home">Back to Home</Link>
            <Link to="/contact" className="btn-contact-head">Contact Head</Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
