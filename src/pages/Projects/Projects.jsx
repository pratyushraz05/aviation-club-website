import CurrentProjects from "./CurrentProjects";
import PreviousProjects from "./PreviousProjects";

export default function Projects() {
  return (
    <div className="projects-wrapper">
      {/* This new container div will center everything inside it! */}
      <div className="container">
        <CurrentProjects />
        <PreviousProjects />
      </div>
    </div>
  );
}