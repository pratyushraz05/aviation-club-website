import { Link, useParams } from "react-router-dom";
import projectData from "./projectData";
import "./Projects.css"; // Make sure to import the CSS!

function ProjectDetails() {
  const { id } = useParams();
  const project = projectData.find((item) => item.id === Number(id));

  if (!project) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
        <h1>Project Not Found</h1>
        <p>The project you are looking for does not exist.</p>
        <Link to="/projects" className="back-link">← Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="project-details-page">
      
      {/* 🚀 THE MAGIC CONTAINER: This centers your entire page! */}
      <div className="container">
        
        <section className="details-hero">
          <div className="details-hero-content">
            <Link to="/projects" className="back-link">← Back to Projects</Link>
            <br /><br />
            
            <span className={project.status === "Ongoing" ? "status-badge ongoing" : "status-badge completed"}>
              {project.status === "Ongoing" ? "🚁 " : "✅ "} {project.status}
            </span>
            
            <h1 className="details-title">{project.title}</h1>
            <p className="hero-desc">{project.description}</p>
          </div>
        </section>

        <main className="details-content">
          
          <section className="details-section">
            <span className="section-label">PROJECT OVERVIEW</span>
            <h2>About the Project</h2>
            <p className="large-text">{project.fullDescription}</p>
          </section>

          {project.objectives && (
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

          {project.technologies && (
            <section className="details-section">
              <span className="section-label">TECHNOLOGY</span>
              <h2>Technologies Used</h2>
              <div className="technology-cards-grid">
                {project.technologies.map((tech, index) => (
                  <div className="technology-card" key={index}>
                    <div className="tech-card-header">
                      <h3>{tech.name}</h3>
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
                    <p>{tech.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.components && (
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

          {project.outcomes && (
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

          {/* 🚀 NEW: Mentor Section */}
          {project.mentor && (
            <section className="details-section project-mentor-section">
              <span className="section-label">MENTORSHIP</span>
              <h2>Project Mentor</h2>
              <div className="project-team-card" style={{ maxWidth: "400px", marginTop: "20px" }}>
                <img src={project.mentor.image} alt={project.mentor.name} className="project-team-avatar" />
                <div>
                  <h3>{project.mentor.name}</h3>
                  <p className="project-team-role">{project.mentor.role}</p>
                </div>
              </div>
            </section>
          )}

          {/* 🚀 NEW: Contributors Section */}
          {project.contributors && (
            <section className="details-section project-contributors-section">
              <span className="section-label">TEAM</span>
              <h2>Project Contributors</h2>
              <div className="project-contributors-grid">
                {project.contributors.map((person, index) => (
                  <div className="project-team-card" key={index}>
                    <img src={person.image} alt={person.name} className="project-team-avatar" />
                    <div>
                      <h3>{person.name}</h3>
                      <p className="project-team-role">{person.role}</p>
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
      
      {/* 🚀 Close the container! */}
      </div>
    </div>
  );
}

export default ProjectDetails;