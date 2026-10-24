import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import ProjectCard from "./ProjectCard";

function PreviousProjects({ projects: propProjects, isHead, onEdit, onDelete }) {
  const [localProjects, setLocalProjects] = useState([]);
  const [loading, setLoading] = useState(!propProjects);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propProjects) return;

    const fetchProjects = async () => {
      try {
        const response = await API.get('/projects');
        const result = response.data;

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('Invalid projects response.');
        }

        setLocalProjects(result.data);
      } catch (err) {
        setError(err.message || 'Could not connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [propProjects]);

  const allProjects = propProjects || localProjects;
  const previousProjects = allProjects.filter(
    (project) =>
      project.category === "Previous Projects" ||
      project.status === "Completed" ||
      project.isCurrent === false
  );

  if (loading) {
    return (
      <div className="projects-page">
        <p style={{ textAlign: 'center', padding: '40px' }}>Loading previous projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page">
        <p style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Error loading projects: {error}</p>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <section className="page-header">
        <span className="section-label">AVIATION CLUB</span>
        <h1>Previous Projects</h1>
        <p>
          Explore completed engineering projects developed by Aviation Club members.
        </p>
      </section>

      <section className="projects-section">
        {previousProjects.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '24px 0' }}>
            No previous projects found.
          </p>
        ) : (
          <div className="projects-grid">
            {previousProjects.map((project) => (
              <ProjectCard
                key={project._id || project.projectId || project.id}
                project={project}
                isHead={isHead}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default PreviousProjects;
