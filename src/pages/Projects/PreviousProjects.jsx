import ProjectCard from "./ProjectCard";
import projectData from "./projectData";

function PreviousProjects() {

  const previousProjects = projectData.filter(
    (project) => project.category === "Previous Projects"
  );

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