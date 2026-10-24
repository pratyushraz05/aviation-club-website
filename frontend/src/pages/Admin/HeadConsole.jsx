import React, { useState, useEffect } from 'react';
import useAuth from '../../context/useAuth';
import API from '../../services/api';
import './Admin.css';

export default function HeadConsole() {
  const { user, updateUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: 'general',
    pinned: false,
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    venue: 'NIT Raipur Campus',
    category: 'Workshop',
  });

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Current',
    technologies: 'Creo Parametric, ArduPilot, RC Transmitter',
    teamLead: '',
  });

  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    section: 'technicalTeam',
    branch: 'CSE',
    image: '',
  });

  const [newAlbum, setNewAlbum] = useState({
    title: '',
    subtitle: '',
    category: 'Events',
    note: '',
    highlights: '',
    imageUrls: '',
  });

  const [newResult, setNewResult] = useState({
    event: '',
    year: '2026',
    position: '🥇 1st Place',
    team: 'Aviation Club Team',
    description: '',
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth/users');
      if (res.data?.users) setUsers(res.data.users);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get('/member/announcements');
      if (res.data?.announcements) setAnnouncements(res.data.announcements);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await API.get('/feedback');
      if (res.data?.feedback) setFeedbacks(res.data.feedback);
    } catch (err) {
      console.error('Failed to load feedback:', err);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await API.get('/team');
      if (res.data?.allMembers) setTeamMembers(res.data.allMembers);
    } catch (err) {
      console.error('Failed to load team:', err);
    }
  };

  const fetchGalleries = async () => {
    try {
      const res = await API.get('/gallery');
      if (res.data?.data) setGalleries(res.data.data);
    } catch (err) {
      console.error('Failed to load galleries:', err);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await API.get('/results');
      if (res.data?.data) setResults(res.data.data);
    } catch (err) {
      console.error('Failed to load results:', err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchAnnouncements(),
        fetchFeedback(),
        fetchTeam(),
        fetchGalleries(),
        fetchResults(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const handleRoleChange = async (userId, targetRole) => {
    try {
      setError('');
      await updateUserRole(userId, targetRole);
      setSuccessMsg(`User role successfully updated to ${targetRole.toUpperCase()}`);
      await fetchUsers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update role');
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await API.post('/member/announcements', newAnnouncement);
      setSuccessMsg('Announcement posted to Member Portal!');
      setNewAnnouncement({ title: '', content: '', category: 'general', pinned: false });
      await fetchAnnouncements();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to post announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await API.delete(`/member/announcements/${id}`);
      await fetchAnnouncements();
      setSuccessMsg('Announcement removed');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await API.post('/events', newEvent);
      setSuccessMsg('New Event published!');
      setNewEvent({ title: '', description: '', date: '', venue: 'NIT Raipur Campus', category: 'Workshop' });
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to publish event');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await API.post('/projects', newProject);
      setSuccessMsg('Project added successfully!');
      setNewProject({ title: '', description: '', category: 'Current', technologies: '', teamLead: '' });
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
    }
  };

  const handleCreateTeamMember = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await API.post('/team', newMember);
      setSuccessMsg('Team member added successfully!');
      setNewMember({ name: '', role: '', section: 'technicalTeam', branch: 'CSE', image: '' });
      await fetchTeam();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add team member');
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm('Remove this member from team roster?')) return;
    try {
      await API.delete(`/team/${id}`);
      await fetchTeam();
      setSuccessMsg('Team member removed');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to remove member');
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const payload = {
        title: newAlbum.title,
        subtitle: newAlbum.subtitle,
        category: newAlbum.category,
        note: newAlbum.note,
        highlights: newAlbum.highlights.split(',').map((h) => h.trim()).filter(Boolean),
        imageUrls: newAlbum.imageUrls.split(',').map((u) => u.trim()).filter(Boolean),
      };
      await API.post('/gallery', payload);
      setSuccessMsg('Gallery album created!');
      setNewAlbum({ title: '', subtitle: '', category: 'Events', note: '', highlights: '', imageUrls: '' });
      await fetchGalleries();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create gallery album');
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm('Delete this gallery album?')) return;
    try {
      await API.delete(`/gallery/${id}`);
      await fetchGalleries();
      setSuccessMsg('Album deleted');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete album');
    }
  };

  const handleCreateResult = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await API.post('/results', newResult);
      setSuccessMsg('Result published successfully!');
      setNewResult({ event: '', year: '2026', position: '🥇 1st Place', team: 'Aviation Club Team', description: '' });
      await fetchResults();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to publish result');
    }
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    try {
      await API.delete(`/results/${id}`);
      await fetchResults();
      setSuccessMsg('Result deleted');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete result');
    }
  };

  const memberCount = users.filter((u) => u.role === 'member').length;
  const headCount = users.filter((u) => u.role === 'head' || u.role === 'admin').length;
  const pendingRequests = users.filter((u) => u.role === 'user' && u.membershipRequested).length;

  return (
    <main className="admin-page">
      <div className="admin-container">
        {/* Header Banner */}
        <section className="admin-banner">
          <div className="admin-title-wrap">
            <h1>
              <span>👑 Head Management Console</span>
              <span className="admin-badge">{user?.role === 'admin' ? 'Super Admin' : 'Club Head'}</span>
            </h1>
            <p>Welcome, {user?.name}. Manage club memberships, team roster, gallery, events, and results.</p>
          </div>

          <div className="admin-stats-row">
            <div className="admin-stat-card">
              <div className="number">{users.length}</div>
              <div className="label">Users</div>
            </div>
            <div className="admin-stat-card">
              <div className="number">{memberCount}</div>
              <div className="label">Members</div>
            </div>
            <div className="admin-stat-card">
              <div className="number">{headCount}</div>
              <div className="label">Heads</div>
            </div>
            <div className="admin-stat-card">
              <div className="number">{teamMembers.length}</div>
              <div className="label">Team Roster</div>
            </div>
            <div className="admin-stat-card">
              <div className="number">{galleries.length}</div>
              <div className="label">Albums</div>
            </div>
            <div className="admin-stat-card" style={{ borderColor: pendingRequests > 0 ? '#ef4444' : undefined }}>
              <div className="number" style={{ color: pendingRequests > 0 ? '#f87171' : undefined }}>
                {pendingRequests}
              </div>
              <div className="label">Pending Upgrades</div>
            </div>
          </div>
        </section>

        {/* Console Navigation */}
        <nav className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Member & Role Directory ({users.length})
            {pendingRequests > 0 && <span className="membership-requested-badge">{pendingRequests} Pending</span>}
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            🛡️ Team Roster ({teamMembers.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ Gallery Albums ({galleries.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            🏆 Results & Awards ({results.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            📢 Announcements
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            📅 Events
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            🚀 Projects
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            📬 Feedback ({feedbacks.length})
          </button>
        </nav>

        {successMsg && (
          <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 600 }}>
            ✓ {successMsg}
          </div>
        )}

        {error && (
          <div className="auth-error-banner">{error}</div>
        )}

        {/* TAB 1: User & Member Directory */}
        {activeTab === 'users' && (
          <div className="data-table-container">
            <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Registered Users & Role Controls</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name & Email</th>
                  <th>Current Role</th>
                  <th>Branch & Year</th>
                  <th>Domain / Wing</th>
                  <th>Role Assignment Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>
                      {loading ? 'Loading user registry...' : 'No users registered yet.'}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id || u.email}>
                      <td>
                        <strong>{u.name}</strong>
                        {u.membershipRequested && u.role === 'user' && (
                          <span className="membership-requested-badge">Requested Member Status</span>
                        )}
                        <br />
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{u.email}</span>
                      </td>
                      <td>
                        <span className={`role-badge-table ${u.role}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.branch || 'N/A'} {u.year ? `• ${u.year}` : ''}
                      </td>
                      <td>{u.subteam || 'General'}</td>
                      <td>
                        <div className="table-actions">
                          {u.role !== 'member' && (
                            <button
                              className="btn-table-action promote-member"
                              onClick={() => handleRoleChange(u.id, 'member')}
                            >
                              ✓ Set Member
                            </button>
                          )}
                          {u.role !== 'head' && u.role !== 'admin' && (
                            <button
                              className="btn-table-action promote-head"
                              onClick={() => handleRoleChange(u.id, 'head')}
                            >
                              ⭐ Make Head
                            </button>
                          )}
                          {u.role !== 'user' && (
                            <button
                              className="btn-table-action demote"
                              onClick={() => handleRoleChange(u.id, 'user')}
                            >
                              Revoke to User
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Team Roster Manager */}
        {activeTab === 'team' && (
          <div>
            <div className="admin-create-form">
              <h3>Add Team Member to Roster</h3>
              <form onSubmit={handleCreateTeamMember} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sahil Sharma"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aerodynamics Lead / Member"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Section</label>
                    <select
                      value={newMember.section}
                      onChange={(e) => setNewMember({ ...newMember, section: e.target.value })}
                    >
                      <option value="technicalTeam">Technical Team</option>
                      <option value="nonTechnicalTeam">Non-Technical Team</option>
                      <option value="coreTeam">Core Team</option>
                      <option value="faculty">Faculty</option>
                      <option value="mentor">Mentor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. MECHANICAL, CSE"
                      value={newMember.branch}
                      onChange={(e) => setNewMember({ ...newMember, branch: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Photo URL (Cloudinary or local /team/name.jpg)</label>
                  <input
                    type="text"
                    placeholder="e.g. /team/pratyush.jpg or https://..."
                    value={newMember.image}
                    onChange={(e) => setNewMember({ ...newMember, image: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-auth-submit">
                  Save Member to Roster
                </button>
              </form>
            </div>

            <div className="data-table-container">
              <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Active Team Members ({teamMembers.length})</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Role</th>
                    <th>Section</th>
                    <th>Branch</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((m) => (
                    <tr key={m._id || m.name}>
                      <td>
                        <strong>{m.name}</strong>
                      </td>
                      <td>{m.role}</td>
                      <td>{m.section}</td>
                      <td>{m.branch || '—'}</td>
                      <td>
                        <button
                          className="btn-table-action demote"
                          onClick={() => handleDeleteTeamMember(m._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Gallery Manager */}
        {activeTab === 'gallery' && (
          <div>
            <div className="admin-create-form">
              <h3>Create Gallery Album</h3>
              <form onSubmit={handleCreateAlbum} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Album Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Drone Precision Landing 2026"
                      value={newAlbum.title}
                      onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newAlbum.category}
                      onChange={(e) => setNewAlbum({ ...newAlbum, category: e.target.value })}
                    >
                      <option value="Events">Events</option>
                      <option value="Workshops">Workshops</option>
                      <option value="Competitions">Competitions</option>
                      <option value="Projects">Projects</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Subtitle (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Autonomous Challenge"
                    value={newAlbum.subtitle}
                    onChange={(e) => setNewAlbum({ ...newAlbum, subtitle: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description Note</label>
                  <textarea
                    rows="3"
                    placeholder="Overview of the event and tasks..."
                    value={newAlbum.note}
                    onChange={(e) => setNewAlbum({ ...newAlbum, note: e.target.value })}
                    style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '0.6rem', borderRadius: '8px', fontFamily: 'inherit' }}
                  />
                </div>
                <div className="form-group">
                  <label>Highlights (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Drone Piloting, CAD Modelling, Flight Testing"
                    value={newAlbum.highlights}
                    onChange={(e) => setNewAlbum({ ...newAlbum, highlights: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Image URLs (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. /gallery/01_Air_Force_Day/1.png, https://res.cloudinary.com/..."
                    value={newAlbum.imageUrls}
                    onChange={(e) => setNewAlbum({ ...newAlbum, imageUrls: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-auth-submit">
                  Publish Gallery Album
                </button>
              </form>
            </div>

            <div className="data-table-container">
              <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Active Gallery Albums ({galleries.length})</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Photos</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {galleries.map((g) => (
                    <tr key={g._id || g.title}>
                      <td>
                        <strong>{g.title}</strong>
                        {g.subtitle && <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>{g.subtitle}</span>}
                      </td>
                      <td>{g.category}</td>
                      <td>{g.images ? g.images.length : (g.folder ? 'Multiple' : 0)}</td>
                      <td>
                        <button
                          className="btn-table-action demote"
                          onClick={() => handleDeleteAlbum(g._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Results & Awards */}
        {activeTab === 'results' && (
          <div>
            <div className="admin-create-form">
              <h3>Publish Competition Result / Award</h3>
              <form onSubmit={handleCreateResult} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Competition Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Boeing National Aeromodelling"
                      value={newResult.event}
                      onChange={(e) => setNewResult({ ...newResult, event: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="text"
                      required
                      value={newResult.year}
                      onChange={(e) => setNewResult({ ...newResult, year: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Position / Standing</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 🥇 1st Place / Finalist"
                      value={newResult.position}
                      onChange={(e) => setNewResult({ ...newResult, position: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Team / Members</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Team Aero-NITRR"
                      value={newResult.team}
                      onChange={(e) => setNewResult({ ...newResult, team: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Brief description of the victory and performance..."
                    value={newResult.description}
                    onChange={(e) => setNewResult({ ...newResult, description: e.target.value })}
                    style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '0.6rem', borderRadius: '8px', fontFamily: 'inherit' }}
                  />
                </div>
                <button type="submit" className="btn-auth-submit">
                  Publish Result
                </button>
              </form>
            </div>

            <div className="data-table-container">
              <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Active Results & Awards ({results.length})</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Competition</th>
                    <th>Standing</th>
                    <th>Team</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r._id || r.event}>
                      <td>{r.year}</td>
                      <td><strong>{r.event}</strong></td>
                      <td>{r.position}</td>
                      <td>{r.team}</td>
                      <td>
                        <button
                          className="btn-table-action demote"
                          onClick={() => handleDeleteResult(r._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Announcements */}
        {activeTab === 'announcements' && (
          <div>
            <div className="admin-create-form">
              <h3>Post New Member Announcement</h3>
              <form onSubmit={handleCreateAnnouncement} className="auth-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flight Testing at Main Ground"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Content / Instructions</label>
                  <textarea
                    rows="4"
                    required
                    style={{
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      padding: '0.75rem',
                      fontFamily: 'inherit',
                    }}
                    placeholder="Provide meeting details, timings, and instructions for members..."
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newAnnouncement.category}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                    >
                      <option value="general">General</option>
                      <option value="meeting">Meeting</option>
                      <option value="workshop">Workshop</option>
                      <option value="competition">Competition</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="checkbox-group" style={{ alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="pinned"
                      checked={newAnnouncement.pinned}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, pinned: e.target.checked })}
                    />
                    <label htmlFor="pinned">Pin to Top of Portal</label>
                  </div>
                </div>
                <button type="submit" className="btn-auth-submit">
                  Publish to Member Portal
                </button>
              </form>
            </div>

            <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Active Member Announcements</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Posted By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((a) => (
                    <tr key={a._id}>
                      <td>
                        <strong>{a.title}</strong> {a.pinned && '📌'}
                      </td>
                      <td>
                        <span className={`category-tag ${a.category || 'general'}`}>{a.category}</span>
                      </td>
                      <td>{a.postedBy}</td>
                      <td>
                        <button
                          className="btn-table-action demote"
                          onClick={() => handleDeleteAnnouncement(a._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: Event Publisher */}
        {activeTab === 'events' && (
          <div className="admin-create-form">
            <h3>Publish Club Event</h3>
            <form onSubmit={handleCreateEvent} className="auth-form">
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aerodynamics & Glider Workshop"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  required
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    padding: '0.75rem',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Details about the event, objectives, eligibility..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date / Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nov 15, 2026 • 2:00 PM"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    required
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-auth-submit">
                Publish Event
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: Project Manager */}
        {activeTab === 'projects' && (
          <div className="admin-create-form">
            <h3>Add Aviation Project</h3>
            <form onSubmit={handleCreateProject} className="auth-form">
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Long-Range Survey UAV"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  required
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    padding: '0.75rem',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Overview of the design, payload capacity, aerodynamics..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Project Status</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  >
                    <option value="Current">Current Project</option>
                    <option value="Previous">Completed Project</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Technologies / Tools</label>
                  <input
                    type="text"
                    placeholder="e.g. Creo, Pixhawk, Carbon Fiber"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-auth-submit">
                Add Project
              </button>
            </form>
          </div>
        )}

        {/* TAB 8: Feedback Viewer */}
        {activeTab === 'feedback' && (
          <div>
            <h3 style={{ color: '#ffffff', marginBottom: '1.25rem' }}>
              Visitor & Student Submissions ({feedbacks.length})
            </h3>
            {feedbacks.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No feedback submissions recorded yet.</p>
            ) : (
              <div className="feedback-grid">
                {feedbacks.map((f) => (
                  <div key={f._id} className="feedback-card-item">
                    <div>
                      <div className="feedback-stars">
                        {'★'.repeat(f.rating || 5)}
                        {'☆'.repeat(Math.max(0, 5 - (f.rating || 5)))}
                      </div>
                      <p style={{ color: '#f1f5f9', fontStyle: 'italic', marginBottom: '1rem' }}>
                        "{f.message || f.feedback}"
                      </p>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
                      <strong style={{ color: '#38bdf8' }}>{f.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {f.email} {f.department ? `• ${f.department}` : ''}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                        {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
