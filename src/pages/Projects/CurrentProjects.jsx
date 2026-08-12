import ProjectCard from "../components/ProjectCard";
import projectData from "../data/projectData";

function CurrentProjects() {

  const currentProjects = projectData.filter(
    (project) => project.category === "Current Projects"
  );

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
