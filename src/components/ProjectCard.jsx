import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  return (
    <div className="project-card">

      <div className="project-card-top">
        <div className="project-icon">
          {project.id === 1 ? "✈️" : "🚁"}
        </div>

        <span
          className={
            project.status === "Ongoing"
              ? "status-badge ongoing"
              : "status-badge completed"
          }
        >
          {project.status}
        </span>
      </div>

      <h3>{project.title}</h3>

      <p>{project.description}</p>

      <div className="technology-container">
        {project.technologies.slice(0, 4).map((technology) => (
          <span key={technology} className="technology-tag">
            {technology}
          </span>
        ))}
      </div>

      <Link
        to={/projects/${project.id}}
        className="details-button"
      >
        View Project →
      </Link>

    </div>
  );
}

export default ProjectCard;
