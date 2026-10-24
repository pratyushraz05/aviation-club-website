import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
import './Navbar.css';
import aviationLogo from '../../assets/aviation-logo.png';

function Navbar() {
  const { user, isMember, isHead, logout } = useAuth();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link" onClick={scrollToTop}>
          <img src={aviationLogo} alt="Aviation Club" className="nav-logo-img" />
          <div className="logo-text">
            ✈
            <br />
            Aviation
            <br />
            Club
          </div>
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/team">Team</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/results">Results</Link></li>
        <li><Link to="/contact">Contact & Feedback</Link></li>

        {/* Portal link - visible to all registered users */}
        {user && (
          <li>
            <Link to="/portal" className="nav-portal-btn">
              {isMember ? 'Member Portal' : 'My Profile & Portal'}
            </Link>
          </li>
        )}

        {/* Head Console link - visible to Heads and Admins */}
        {isHead && (
          <li>
            <Link to="/admin" className="nav-admin-btn">
              👑 Head Console
            </Link>
          </li>
        )}

        {/* Auth Group */}
        <li className="nav-auth-group">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/portal" className="nav-user-pill" style={{ textDecoration: 'none' }} title="View Profile & Portal">
                <span>{user.name?.split(' ')[0]}</span>
                <span className={`nav-user-role-badge ${user.role}`}>
                  {user.role}
                </span>
              </Link>
              <button onClick={handleLogout} className="btn-nav-logout" title="Sign out">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-auth-btn">
              Sign In
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
