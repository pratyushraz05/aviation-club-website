import { Link } from "react-router-dom";
import projectData from "../data/projectData";
import ProjectCard from "../components/ProjectCard";

function Projects() {
  return (
    <div className="projects-page">

      <section className="projects-hero">

        <div className="hero-content">

          <span className="hero-label">
            AVIATION CLUB • NIT RAIPUR
          </span>

          <h1>
            Our <span>Projects</span>
          </h1>

          <p>
            Explore the engineering projects developed by the Aviation
            Club, covering aircraft design, aerodynamics, UAV systems,
            simulation and practical aviation technologies.
          </p>

        </div>

      </section>


      <section className="projects-introduction">

        <h2>
          Engineering Beyond the Classroom
        </h2>

        <p>
          The Aviation Club encourages students to transform theoretical
          knowledge into practical engineering solutions through design,
          analysis, simulation, fabrication and testing.
        </p>

      </section>


      <section className="projects-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              FEATURED WORK
            </span>

            <h2>
              Aviation Club Projects
            </h2>
          </div>

        </div>


        <div className="projects-grid">

          {projectData.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

        </div>

      </section>


      <section className="project-categories">

        <div className="category-card">

          <div className="category-icon">
            🚀
          </div>

          <h3>
            Current Projects
          </h3>

          <p>
            Explore projects that are currently under development,
            analysis and simulation.
          </p>

          <Link to="/projects/current">
            View Current Projects →
          </Link>

        </div>


        <div className="category-card">

          <div className="category-icon">
            ✈️
          </div>

          <h3>
            Previous Projects
          </h3>

          <p>
            Discover projects that have completed their design,
            development and testing stages.
          </p>

          <Link to="/projects/previous">
            View Previous Projects →
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Projects;
