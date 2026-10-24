import React, { useState, useEffect } from 'react';
import useAuth from '../../context/useAuth';
import API from '../../services/api';
import './Portal.css';

export default function MemberPortal() {
  const { user, updateProfile, requestMembership } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    branch: user?.branch || '',
    year: user?.year || '',
    subteam: user?.subteam || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [requestingUpgrade, setRequestingUpgrade] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        branch: user.branch || '',
        year: user.year || '',
        subteam: user.subteam || '',
      });
      // Default to announcements for members/heads, profile for common users
      if (['member', 'head', 'admin'].includes(user.role)) {
        setActiveTab('announcements');
      } else {
        setActiveTab('profile');
      }
    }
  }, [user]);

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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setError('');
      setSuccessMsg('');

      await updateProfile(profileForm);
      setSuccessMsg('✓ Your registration profile data has been updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRequestMembershipUpgrade = async () => {
    try {
      setRequestingUpgrade(true);
      setError('');
      setSuccessMsg('');

      await requestMembership({
        branch: profileForm.branch,
        year: profileForm.year,
        subteam: profileForm.subteam,
      });

      setSuccessMsg('✓ Membership upgrade requested! Club Heads have been notified to review your profile.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to request upgrade');
    } finally {
      setRequestingUpgrade(false);
    }
  };

  const isFullMember = user && ['member', 'head', 'admin'].includes(user.role);

  return (
    <main className="portal-page">
      <div className="portal-container">
        {/* Member Banner / ID Header */}
        <section className="member-banner">
          <div className="member-identity">
            <div className="member-avatar">{getInitials(user?.name)}</div>
            <div className="member-info">
              <h1>{user?.name || 'Aviation Club User'}</h1>
              <div className="member-tags">
                <span className={`role-pill ${user?.role || 'user'}`}>
                  {user?.role === 'head' || user?.role === 'admin'
                    ? '👑 Club Head'
                    : user?.role === 'member'
                    ? '🛡️ Verified Member'
                    : '👤 Registered Student'}
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
              <div className="lbl">CAD &amp; Files</div>
            </div>
            <div className="stat-box">
              <div className="val">{user?.isActive ? 'Active' : 'Pending'}</div>
              <div className="lbl">Account Standing</div>
            </div>
          </div>
        </section>

        {/* Tab Controls */}
        <nav className="portal-tabs">
          <button
            className={`portal-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            ⚙️ My Registration Profile
          </button>
          {isFullMember && (
            <>
              <button
                className={`portal-tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
                onClick={() => setActiveTab('announcements')}
              >
                📢 Announcements &amp; Briefings ({announcements.length})
              </button>
              <button
                className={`portal-tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                📁 Technical Vault &amp; CAD Models ({resources.length})
              </button>
              <button
                className={`portal-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => setActiveTab('schedule')}
              >
                🗓️ Flight &amp; Workshop Schedule
              </button>
              <button
                className={`portal-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contacts')}
              >
                👥 Domain Lead Directory
              </button>
            </>
          )}
        </nav>

        {successMsg && (
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              marginBottom: '20px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#4ade80',
              fontWeight: 600,
            }}
          >
            {successMsg}
          </div>
        )}

        {error && <div className="auth-error-banner">{error}</div>}

        {/* TAB 0: User Registration Profile (Editable by User with Head Control) */}
        {activeTab === 'profile' && (
          <div>
            {!isFullMember && (
              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '20px',
                  borderRadius: '14px',
                  marginBottom: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.2rem' }}>
                    🚀 Want to become a Verified Club Member?
                  </h3>
                  <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                    {user?.membershipRequested
                      ? '✓ You have submitted a member upgrade request. Club Heads will review and approve your access.'
                      : 'Keep your branch and year updated below, then request official club member status for full technical vault and workshop access.'}
                  </p>
                </div>
                {!user?.membershipRequested && (
                  <button
                    onClick={handleRequestMembershipUpgrade}
                    disabled={requestingUpgrade}
                    style={{
                      background: '#38bdf8',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {requestingUpgrade ? 'Submitting...' : 'Request Member Status'}
                  </button>
                )}
              </div>
            )}

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '750px',
              }}
            >
              <h2 style={{ color: '#ffffff', marginTop: 0, marginBottom: '8px', fontSize: '1.4rem' }}>
                Edit Your Registration Data
              </h2>
              <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '0.9rem' }}>
                Update your student and department information below. Club Heads can also review and modify these details from the management console.
              </p>

              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#0b1120',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#0b1120',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
                      Branch / Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mechanical, CSE, ECE, Mining"
                      value={profileForm.branch}
                      onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#0b1120',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
                      Year of Study
                    </label>
                    <select
                      value={profileForm.year}
                      onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#0b1120',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year (B.Tech)</option>
                      <option value="2nd Year">2nd Year (B.Tech)</option>
                      <option value="3rd Year">3rd Year (B.Tech)</option>
                      <option value="4th Year">4th Year (B.Tech)</option>
                      <option value="Postgraduate">Postgraduate / M.Tech / PhD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
                    Preferred Aviation Wing / Domain
                  </label>
                  <select
                    value={profileForm.subteam}
                    onChange={(e) => setProfileForm({ ...profileForm, subteam: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: '#0b1120',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="General">General / All-Round Trainee</option>
                    <option value="Aerodynamics & CFD">Aerodynamics &amp; CFD Wing</option>
                    <option value="Avionics & Drone Tech">Avionics, Drones &amp; Telemetry</option>
                    <option value="Structures & CAD">Structures &amp; 3D CAD Modelling</option>
                    <option value="Operations & Media">Operations, Events &amp; Logistics</option>
                  </select>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    style={{
                      padding: '12px 28px',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      opacity: savingProfile ? 0.7 : 1,
                    }}
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                    <span>{item.fileSize || 'PDF/CAD'}</span>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-download"
                    >
                      Download ↗
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
                  <th>Day &amp; Time</th>
                  <th>Venue</th>
                  <th>Target Wing</th>
                  <th>In-Charge</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>RC Flight Testing &amp; Trimming</strong></td>
                  <td>Saturday, 3:30 PM - 5:30 PM</td>
                  <td>NIT Raipur Main Ground</td>
                  <td>Aerodynamics &amp; Mechanical</td>
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
                  <td><strong>Avionics &amp; Telemetry Tuning</strong></td>
                  <td>Friday, 5:00 PM - 6:30 PM</td>
                  <td>Aviation Workshop Lab</td>
                  <td>Avionics &amp; Software</td>
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
              <h3>Club Presidents &amp; Core</h3>
              <p style={{ color: '#facc15', fontWeight: 600 }}>Sivaratri Lakshmi Sahithi &amp; Kritika Tripathi</p>
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
                <span>Software &amp; Systems</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
