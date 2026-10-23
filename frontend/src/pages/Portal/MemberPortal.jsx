import React, { useState, useEffect } from 'react';
import useAuth from '../../context/useAuth';
import API from '../../services/api';
import './Portal.css';

export default function MemberPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [annRes, resRes] = await Promise.all([
          API.get('/member/announcements').catch(() => ({ data: { announcements: [] } })),
          API.get('/member/resources').catch(() => ({ data: { resources: [] } })),
        ]);

        if (isMounted) {
          if (annRes.data?.announcements) setAnnouncements(annRes.data.announcements);
          if (resRes.data?.resources) setResources(resRes.data.resources);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch member resources');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getInitials = (name = 'Member') => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <main className="portal-page">
      <div className="portal-container">
        {/* Member Banner / ID Header */}
        <section className="member-banner">
          <div className="member-identity">
            <div className="member-avatar">{getInitials(user?.name)}</div>
            <div className="member-info">
              <h1>{user?.name || 'Aviation Member'}</h1>
              <div className="member-tags">
                <span className={`role-pill ${user?.role || 'member'}`}>
                  {user?.role === 'head' || user?.role === 'admin' ? 'Club Head' : 'Verified Member'}
                </span>
                {user?.branch && <span className="info-pill">{user.branch}</span>}
                {user?.year && <span className="info-pill">{user.year}</span>}
                {user?.subteam && <span className="info-pill">{user.subteam}</span>}
              </div>
            </div>
          </div>

          <div className="member-quick-stats">
            <div className="stat-box">
              <div className="val">{announcements.length}</div>
              <div className="lbl">Announcements</div>
            </div>
            <div className="stat-box">
              <div className="val">{resources.length}</div>
              <div className="lbl">CAD & Files</div>
            </div>
            <div className="stat-box">
              <div className="val">Active</div>
              <div className="lbl">Club Standing</div>
            </div>
          </div>
        </section>

        {/* Tab Controls */}
        <nav className="portal-tabs">
          <button
            className={`portal-tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            📢 Announcements & Briefings ({announcements.length})
          </button>
          <button
            className={`portal-tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            📁 Technical Vault & CAD Models ({resources.length})
          </button>
          <button
            className={`portal-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            🗓️ Flight & Workshop Schedule
          </button>
          <button
            className={`portal-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            👥 Domain Lead Directory
          </button>
        </nav>

        {loading && (
          <div className="auth-loading-screen" style={{ minHeight: '30vh' }}>
            <div className="spinner"></div>
            <p>Loading member data...</p>
          </div>
        )}

        {error && <div className="auth-error-banner">{error}</div>}

        {/* TAB 1: Announcements */}
        {!loading && activeTab === 'announcements' && (
          <div className="announcements-grid">
            {announcements.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No announcements posted yet.</p>
            ) : (
              announcements.map((item) => (
                <article
                  key={item._id || item.title}
                  className={`announcement-card ${item.pinned ? 'pinned' : ''}`}
                >
                  <div>
                    <div className="announcement-top">
                      <span className={`category-tag ${item.category || 'general'}`}>
                        {item.category || 'General'}
                      </span>
                      {item.pinned && <span className="pinned-badge">📌 Pinned</span>}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                  </div>
                  <div className="announcement-meta">
                    <span>By: {item.postedBy}</span>
                    <span>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : 'Recent'}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Resources Vault */}
        {!loading && activeTab === 'resources' && (
          <div className="resources-grid">
            {resources.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No technical files available yet.</p>
            ) : (
              resources.map((item) => (
                <div key={item._id || item.title} className="resource-card">
                  <div>
                    <div className="resource-icon-badge">
                      {item.category === 'CAD' && '📐'}
                      {item.category === 'Aerodynamics' && '✈️'}
                      {item.category === 'Avionics' && '⚡'}
                      {item.category === 'Software' && '💻'}
                      {item.category === 'Guidelines' && '📋'}
                      {!['CAD', 'Aerodynamics', 'Avionics', 'Software', 'Guidelines'].includes(
                        item.category
                      ) && '📦'}
                    </div>
                    <span className="category-tag general" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                      {item.category}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="resource-footer">
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {item.uploadedBy || 'Club Lead'}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-open-resource"
                    >
                      Access File ↗
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: Schedule */}
        {!loading && activeTab === 'schedule' && (
          <div className="schedule-table-wrap">
            <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Active Weekly Timetable</h3>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Day & Time</th>
                  <th>Venue</th>
                  <th>Target Wing</th>
                  <th>In-Charge</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>RC Flight Testing & Trimming</strong></td>
                  <td>Saturday, 3:30 PM - 5:30 PM</td>
                  <td>NIT Raipur Main Ground</td>
                  <td>Aerodynamics & Mechanical</td>
                  <td>Shivesh / Ashwajit</td>
                </tr>
                <tr>
                  <td><strong>Creo CAD Modelling Sprint</strong></td>
                  <td>Wednesday, 5:30 PM - 7:00 PM</td>
                  <td>CAD Lab (Mechanical Dept)</td>
                  <td>All CAD Trainees</td>
                  <td>Subhash Saho</td>
                </tr>
                <tr>
                  <td><strong>Avionics & Telemetry Tuning</strong></td>
                  <td>Friday, 5:00 PM - 6:30 PM</td>
                  <td>Aviation Workshop Lab</td>
                  <td>Avionics & Software</td>
                  <td>Vijay Karan</td>
                </tr>
                <tr>
                  <td><strong>General Core Body Meeting</strong></td>
                  <td>Sunday, 11:00 AM - 12:30 PM</td>
                  <td>Student Activity Center / Virtual</td>
                  <td>Full Club Roster</td>
                  <td>Sahithi / Kritika</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: Domain Leads */}
        {!loading && activeTab === 'contacts' && (
          <div className="announcements-grid">
            <div className="announcement-card">
              <h3>Faculty In-Charge</h3>
              <p style={{ color: '#38bdf8', fontWeight: 600 }}>Dr. N.V. Swamy Naidu</p>
              <p>Faculty In-Charge, Aviation Club NIT Raipur</p>
              <div className="announcement-meta">
                <span>Department: Mechanical</span>
              </div>
            </div>
            <div className="announcement-card">
              <h3>Club Presidents & Core</h3>
              <p style={{ color: '#facc15', fontWeight: 600 }}>Sivaratri Lakshmi Sahithi & Kritika Tripathi</p>
              <p>Overseeing all club domains, competitions, administrative liaison, and recruitment.</p>
              <div className="announcement-meta">
                <span>Core Leadership</span>
              </div>
            </div>
            <div className="announcement-card">
              <h3>Technical Team Leads</h3>
              <p style={{ color: '#4ade80', fontWeight: 600 }}>Pratyush, Raghava, Pravalika, Premanvitha, Amrutha, Vaishnavi</p>
              <p>Managing club web portal, cloud services, software automation, and telemetry data.</p>
              <div className="announcement-meta">
                <span>Software & Systems</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
