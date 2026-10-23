import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import ProjectCard from "./ProjectCard";

function PreviousProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await API.get('/projects');
        const result = response.data;

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('Invalid projects response.');
        }

        setProjects(
          result.data.map((project) => ({
            ...project,
            id: project.projectId || project._id,
          }))
        );
      } catch (err) {
        setError(err.message || 'Could not connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter out projects matching the previous projects category
  const previousProjects = projects.filter(
    (project) => project.category === "Previous Projects" || project.isCurrent === false
  );

  if (loading) {
    return <div className="projects-page"><p style={{ textAlign: 'center', padding: '40px' }}>Loading previous projects...</p></div>;
  }

  if (error) {
    return <div className="projects-page"><p style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Error loading projects: {error}</p></div>;
  }

  return (
    <div className="projects-page">

      <section className="page-header">

        <span className="section-label">
          AVIATION CLUB
        </span>

        <h1>
          Previous Projects
        </h1>

        <p>
          Explore completed engineering projects developed by
          Aviation Club members.
        </p>

      </section>


      <section className="projects-section">

        <div className="projects-grid">

          {previousProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

        </div>

      </section>

    </div>
  );
}

export default PreviousProjects;