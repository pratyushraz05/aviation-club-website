import { Link, useParams } from "react-router-dom";
import projectData from "../data/projectData";

function ProjectDetails() {

  const { id } = useParams();

  const project = projectData.find(
    (item) => item.id === Number(id)
  );


  if (!project) {
    return (
      <div className="not-found">

        <h1>
          Project Not Found
        </h1>

        <p>
          The project you are looking for does not exist.
        </p>

        <Link to="/projects">
          ← Back to Projects
        </Link>

      </div>
    );
  }


  return (
    <div className="project-details-page">

      <section className="details-hero">

        <div className="details-hero-content">

          <Link
            to="/projects"
            className="back-link"
          >
            ← Back to Projects
          </Link>

          <span
            className={
              project.status === "Ongoing"
                ? "status-badge ongoing"
                : "status-badge completed"
            }
          >
            {project.status}
          </span>

          <h1>
            {project.title}
          </h1>

          <p>
            {project.description}
          </p>

        </div>

      </section>


      <main className="details-content">


        <section className="details-section">

          <span className="section-label">
            PROJECT OVERVIEW
          </span>

          <h2>
            About the Project
          </h2>

          <p className="large-text">
            {project.fullDescription}
          </p>

        </section>


        <section className="details-section">

          <span className="section-label">
            OBJECTIVES
          </span>

          <h2>
            Project Objectives
          </h2>

          <div className="objectives-grid">

            {project.objectives.map((objective, index) => (
              <div
                className="objective-item"
                key={index}
              >

                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p>
                  {objective}
                </p>

              </div>
            ))}

          </div>

        </section>


        <section className="details-section">

          <span className="section-label">
            TECHNOLOGY
          </span>

          <h2>
            Technologies Used
          </h2>

          <div className="technology-large-container">

            {project.technologies.map((technology) => (
              <span
                className="technology-large"
                key={technology}
              >
                {technology}
              </span>
            ))}

          </div>

        </section>


        <section className="details-section">

          <span className="section-label">
            COMPONENTS
          </span>

          <h2>
            Key Components
          </h2>

          <div className="components-grid">

            {project.components.map((component, index) => (
              <div
                className="component-item"
                key={index}
              >
                <span>
                  ✓
                </span>

                <p>
                  {component}
                </p>
              </div>
            ))}

          </div>

        </section>


        <section className="details-section">

          <span className="section-label">
            RESULTS
          </span>

          <h2>
            Project Outcomes
          </h2>

          <div className="outcomes-list">

            {project.outcomes.map((outcome, index) => (
              <div
                className="outcome-item"
                key={index}
              >

                <span>
                  {index + 1}
                </span>

                <p>
                  {outcome}
                </p>

              </div>
            ))}

          </div>

        </section>


        <div className="details-footer">

          <Link
            to="/projects"
            className="details-button"
          >
            ← Back to All Projects
          </Link>

        </div>


      </main>

    </div>
  );
}

export default ProjectDetails;
