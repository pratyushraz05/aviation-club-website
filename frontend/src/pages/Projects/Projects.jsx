import React, { useEffect, useState, useCallback } from 'react';
import API from '../../services/api';
import useAuth from '../../context/useAuth';
import CurrentProjects from "./CurrentProjects";
import PreviousProjects from "./PreviousProjects";
import "./Projects.css";

const emptyProjectForm = {
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
};

export default function Projects() {
  const { isHead } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyProjectForm);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await API.get('/projects');
      const result = response.data;

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error('Invalid projects response.');
      }

      setProjects(result.data);
    } catch (err) {
      setError(err.message || 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyProjectForm);
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingId(project._id || project.projectId || project.id);

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

    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMsg('');

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

      if (editingId) {
        await API.put(`/projects/${editingId}`, payload);
        setMsg('✓ Project updated successfully!');
      } else {
        await API.post('/projects', payload);
        setMsg('✓ Project created successfully!');
      }

      setShowModal(false);
      setEditingId(null);
      setFormData(emptyProjectForm);
      await fetchProjects();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (project) => {
    const id = project._id || project.projectId || project.id;
    if (!window.confirm(`Are you sure you want to delete project "${project.title}"?`)) {
      return;
    }

    try {
      await API.delete(`/projects/${id}`);
      setMsg(`✓ Project "${project.title}" deleted.`);
      await fetchProjects();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="projects-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0', color: '#fff' }}>
          <h2>Loading projects...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0', color: '#f87171' }}>
          <h2>Error loading projects: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-wrapper">
      <div className="container">
        {/* Head Editing Toolbar */}
        {isHead && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              padding: '14px 20px',
              borderRadius: '12px',
              marginTop: '20px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <span style={{ color: '#facc15', fontWeight: 700, fontSize: '0.95rem' }}>
                👑 Head Edit Mode Active
              </span>
              <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                You have admin privileges to add, update, and manage club engineering projects.
              </p>
            </div>
            <button
              onClick={openAddModal}
              style={{
                background: '#ca8a04',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              ➕ Add New Project
            </button>
          </div>
        )}

        {msg && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 18px',
              borderRadius: '8px',
              background: msg.startsWith('✓') ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)',
              border: `1px solid ${msg.startsWith('✓') ? '#4ade80' : '#f87171'}`,
              color: msg.startsWith('✓') ? '#4ade80' : '#f87171',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            {msg}
          </div>
        )}

        <CurrentProjects
          projects={projects}
          isHead={isHead}
          onEdit={openEditModal}
          onDelete={handleDeleteProject}
        />

        <PreviousProjects
          projects={projects}
          isHead={isHead}
          onEdit={openEditModal}
          onDelete={handleDeleteProject}
        />

        {/* Add / Edit Project Modal */}
        {showModal && (
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
            onClick={() => setShowModal(false)}
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
                  {editingId ? '✏️ Edit Project' : '➕ Add New Project'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                      placeholder="e.g. VTOL – Vertical Take-Off & Landing UAV"
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
                      placeholder="e.g. VTOL UAV"
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
                    Thumbnail Image URL or Path
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="e.g. /images/7.png or https://res.cloudinary.com/..."
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
                    Short Description (Card Summary) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief 1-2 sentence overview for the project card..."
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
                    Full Project Description (Detail Page)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Comprehensive description of the engineering approach, analysis, and lifecycle..."
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
                      placeholder="e.g. Dr. N.V. Swamy Naidu"
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
                      placeholder="e.g. Faculty In-Charge"
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
                    placeholder="e.g. Pratyush Raj, Raghava, Pravalika"
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
                    Technologies Used (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="e.g. OpenVSP, Creo, FEA, CFD, Aerodynamics"
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
                    placeholder="Achieve efficient low-speed flight&#10;Reduce runway requirements"
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
                    placeholder="Lightweight Styrofoam structure&#10;1800 KV brushless motor"
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
                    placeholder="Successfully designed and flight-tested STOL aircraft&#10;Validated CFD analytical models"
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
                    onClick={() => setShowModal(false)}
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
                    {submitting ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
