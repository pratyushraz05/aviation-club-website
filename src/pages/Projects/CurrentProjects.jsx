import React, { useEffect, useState } from 'react';
import API from '../../../project/src/services/api';
import ProjectCard from "./ProjectCard";

function CurrentProjects() {
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

        // Map backend documents to match the shape expected by ProjectCard
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

  // Filter out projects for the current category matching your criteria
  const currentProjects = projects.filter(
    (project) => project.category === "Current Projects" || project.isCurrent === true
  );

  if (loading) {
    return <div className="projects-page"><p style={{ textAlign: 'center', padding: '40px' }}>Loading current projects...</p></div>;
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
          Current Projects
        </h1>

        <p>
          Projects currently under development, analysis and simulation
          by the Aviation Club.
        </p>

      </section>


      <section className="projects-section">

        <div className="projects-grid">

          {currentProjects.map((project) => (
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

export default CurrentProjects;