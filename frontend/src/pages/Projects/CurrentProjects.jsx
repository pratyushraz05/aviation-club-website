import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import ProjectCard from "./ProjectCard";

function CurrentProjects({ projects: propProjects, isHead, onEdit, onDelete }) {
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
  const currentProjects = allProjects.filter(
    (project) =>
      project.category === "Current Projects" ||
      project.status === "Ongoing" ||
      project.isCurrent === true
  );

  if (loading) {
    return (
      <div className="projects-page">
        <p style={{ textAlign: 'center', padding: '40px' }}>Loading current projects...</p>
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
        <h1>Current Projects</h1>
        <p>
          Projects currently under development, analysis, and simulation by the Aviation Club.
        </p>
      </section>

      <section className="projects-section">
        {currentProjects.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '24px 0' }}>
            No current projects found.
          </p>
        ) : (
          <div className="projects-grid">
            {currentProjects.map((project) => (
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

export default CurrentProjects;
