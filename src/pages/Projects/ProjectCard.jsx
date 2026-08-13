import { Link } from "react-router-dom";
import "./Projects.css"; // Connecting our new styles!

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="project-status">
        {project.status === 'Ongoing' ? '🚁 ' : '✅ '} {project.status}
      </div>
      
      <h3 className="card-title">{project.title}</h3>
      <p className="card-desc">{project.description}</p>

      {/* This maps over the array and turns each technology into a styled pill/tag */}
      <div className="tech-tags">
        {project.technologies?.map((tech, index) => (
          <span key={index} className="tech-tag">{tech}</span>
        ))}
      </div>

      <div className="card-footer-link">
        <Link to={`/projects/${project.id}`} className="link-btn">
          View Project →
        </Link>
      </div>
    </div>
  );
}