import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import API from '../../services/api';
import useAuth from '../../context/useAuth';
import "./Projects.css";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isHead } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    category: 'Current Projects',
    status: 'Ongoing',
    description: '',
    fullDescription: '',
    image: '',
    mentorName: '',
    mentorRole: '',
    contributors: '',
    technologies: '',
    objectives: '',
    components: '',
    outcomes: '',
  });

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await API.get(`/projects/${id}`);
      const result = response.data;

      if (!result.success || !result.data) {
        throw new Error('Project not found.');
      }

      setProject(result.data);
    } catch (err) {
      setError(err.message || 'Could not load project details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const openEditModal = () => {
    if (!project) return;

    const techString = Array.isArray(project.technologies)
      ? project.technologies.map((t) => (typeof t === 'object' ? t.name : t)).join(', ')
      : '';

    const contribString = Array.isArray(project.contributors)
      ? project.contributors.map((c) => (typeof c === 'object' ? c.name : c)).join(', ')
      : '';

    setFormData({
      title: project.title || '',
      shortTitle: project.shortTitle || '',
      category: project.category || 'Current Projects',
      status: project.status || 'Ongoing',
      description: project.description || '',
      fullDescription: project.fullDescription || project.description || '',
      image: project.image || '',
      mentorName: project.mentor?.name || '',
      mentorRole: project.mentor?.role || '',
      contributors: contribString,
      technologies: techString,
      objectives: Array.isArray(project.objectives) ? project.objectives.join('\n') : '',
      components: Array.isArray(project.components) ? project.components.join('\n') : '',
      outcomes: Array.isArray(project.outcomes) ? project.outcomes.join('\n') : '',
    });

    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMsg('');

      const targetId = project._id || project.projectId || id;
      const payload = {
        title: formData.title.trim(),
        shortTitle: formData.shortTitle.trim(),
        category: formData.category,
        status: formData.status,
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim() || formData.description.trim(),
        image: formData.image.trim(),
        mentor: formData.mentorName
          ? { name: formData.mentorName.trim(), role: formData.mentorRole.trim() || 'Faculty In-Charge', image: '' }
          : undefined,
        contributors: formData.contributors
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
          .map((name) => ({ name, role: 'Contributor' })),
        technologies: formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .map((name) => ({ name })),
        objectives: formData.objectives.split('\n').map((s) => s.trim()).filter(Boolean),
        components: formData.components.split('\n').map((s) => s.trim()).filter(Boolean),
        outcomes: formData.outcomes.split('\n').map((s) => s.trim()).filter(Boolean),
      };

      await API.put(`/projects/${targetId}`, payload);
      setMsg('✓ Project updated successfully!');
      setShowEditModal(false);
      await fetchProjectDetails();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm(`Are you sure you want to delete project "${project?.title}"?`)) {
      return;
    }

    try {
      const targetId = project._id || project.projectId || id;
      await API.delete(`/projects/${targetId}`);
      navigate('/projects');
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px 0", color: "#fff" }}>
        <h2>Loading project details...</h2>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px 0", color: "#fff" }}>
        <h1>Project Not Found</h1>
        <p>The project you are looking for does not exist or could not be loaded.</p>
        <Link to="/projects" className="back-link">← Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="project-details-page">
      <div className="container">
        
        {isHead && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              padding: '12px 20px',
              borderRadius: '12px',
              marginTop: '16px',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span style={{ color: '#facc15', fontWeight: 700, fontSize: '0.9rem' }}>
              👑 Head Edit Controls
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={openEditModal}
                style={{
                  background: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ✏️ Edit Project
              </button>
              <button
                onClick={handleDeleteProject}
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🗑️ Delete Project
              </button>
            </div>
          </div>
        )}

        {msg && (
          <div
            style={{
              marginBottom: '16px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: msg.startsWith('✓') ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)',
              border: `1px solid ${msg.startsWith('✓') ? '#4ade80' : '#f87171'}`,
              color: msg.startsWith('✓') ? '#4ade80' : '#f87171',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {msg}
          </div>
        )}

        <section className="details-hero">
          <div className="details-hero-content">
            <Link to="/projects" className="back-link">← Back to Projects</Link>
            <br /><br />
            
            <span className={project.status === "Ongoing" ? "status-badge ongoing" : "status-badge completed"}>
              {project.status === "Ongoing" ? "🚁 " : "✅ "} {project.status || (project.isCurrent ? "Ongoing" : "Completed")}
            </span>
            
            <h1 className="details-title">{project.title}</h1>
            <p className="hero-desc">{project.description}</p>
          </div>
        </section>

        <main className="details-content">
          
          <section className="details-section">
            <span className="section-label">PROJECT OVERVIEW</span>
            <h2>About the Project</h2>
            <p className="large-text">{project.fullDescription || project.description}</p>
          </section>

          {project.objectives && project.objectives.length > 0 && (
            <section className="details-section">
              <span className="section-label">OBJECTIVES</span>
              <h2>Project Objectives</h2>
              <div className="objectives-grid">
                {project.objectives.map((objective, index) => (
                  <div className="objective-item" key={index}>
                    <span className="number-badge">{String(index + 1).padStart(2, "0")}</span>
                    <p>{objective}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <section className="details-section">
              <span className="section-label">TECHNOLOGY</span>
              <h2>Technologies Used</h2>
              <div className="technology-cards-grid">
                {project.technologies.map((tech, index) => (
                  <div className="technology-card" key={index}>
                    <div className="tech-card-header">
                      <h3>{typeof tech === 'string' ? tech : tech.name}</h3>
                      {tech.link && (
                        <a 
                          href={tech.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="tech-external-link"
                        >
                          Official Docs ↗
                        </a>
                      )}
                    </div>
                    {tech.description && <p>{tech.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.components && project.components.length > 0 && (
            <section className="details-section">
              <span className="section-label">COMPONENTS</span>
              <h2>Key Components</h2>
              <div className="components-grid">
                {project.components.map((component, index) => (
                  <div className="component-item" key={index}>
                    <span className="check-icon">✓</span>
                    <p>{component}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.outcomes && project.outcomes.length > 0 && (
            <section className="details-section">
              <span className="section-label">RESULTS</span>
              <h2>Project Outcomes</h2>
              <div className="outcomes-list">
                {project.outcomes.map((outcome, index) => (
                  <div className="outcome-item" key={index}>
                    <span className="number-badge">{index + 1}</span>
                    <p>{outcome}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Mentor Section */}
          {project.mentor && project.mentor.name && (
            <section className="details-section project-mentor-section">
              <span className="section-label">MENTORSHIP</span>
              <h2>Project Mentor</h2>
              <div className="project-team-card" style={{ maxWidth: "400px", marginTop: "20px" }}>
                {project.mentor.image && (
                  <img
                    src={project.mentor.image}
                    alt={project.mentor.name}
                    className="project-team-avatar"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h3>{project.mentor.name}</h3>
                  <p className="project-team-role">{project.mentor.role || 'Faculty In-Charge'}</p>
                </div>
              </div>
            </section>
          )}

          {/* Contributors Section */}
          {project.contributors && project.contributors.length > 0 && (
            <section className="details-section project-contributors-section">
              <span className="section-label">TEAM</span>
              <h2>Project Contributors</h2>
              <div className="project-contributors-grid">
                {project.contributors.map((person, index) => (
                  <div className="project-team-card" key={index}>
                    {person.image && (
                      <img
                        src={person.image}
                        alt={person.name}
                        className="project-team-avatar"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h3>{person.name}</h3>
                      <p className="project-team-role">{person.role || 'Contributor'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="details-footer">
            <Link to="/projects" className="btn btn-primary">← Back to All Projects</Link>
          </div>
        </main>
      </div>

      {/* In-Page Edit Project Modal */}
      {showEditModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc' }}>
                ✏️ Edit Project Details
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Short Title
                  </label>
                  <input
                    type="text"
                    value={formData.shortTitle}
                    onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Current Projects">Current Projects</option>
                    <option value="Previous Projects">Previous Projects</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Ongoing">Ongoing (🚁 Active)</option>
                    <option value="Completed">Completed (✅ Done)</option>
                    <option value="R&D Prototype">R&D Prototype</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Full Description
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Mentor Name
                  </label>
                  <input
                    type="text"
                    value={formData.mentorName}
                    onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Mentor Role
                  </label>
                  <input
                    type="text"
                    value={formData.mentorRole}
                    onChange={(e) => setFormData({ ...formData, mentorRole: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Contributors (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.contributors}
                  onChange={(e) => setFormData({ ...formData, contributors: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Objectives (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Components (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.components}
                  onChange={(e) => setFormData({ ...formData, components: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Outcomes (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.outcomes}
                  onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '10px 18px',
                    background: '#334155',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '10px 24px',
                    background: '#38bdf8',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? 'Saving...' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProjectDetails;
