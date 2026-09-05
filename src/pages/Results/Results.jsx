import React from "react";
import "./Results.css";
const results = [
  {
    id: 1,
    event: "Inter-College Drone Challenge",
    year: "2026",
    position: "🥇 1st Place",
    team: "Team Aero",
    description:
      "Secured first place in the inter-college drone challenge with an outstanding performance."
  },
  {
    id: 2,
    event: "Aero Design Competition",
    year: "2025",
    position: "🥈 2nd Place",
    team: "Aviation Club Team",
    description:
      "Achieved second place for an innovative aircraft design and engineering approach."
  },
  {
    id: 3,
    event: "National Aviation Quiz",
    year: "2025",
    position: "🏆 Finalist",
    team: "Aviation Club",
    description:
      "Reached the national-level finals after competing against teams from several institutions."
  }
];

function Results() {
  return (
    <section className="results-section" id="results">
      <h2>Results & Achievements</h2>
      <p className="results-subtitle">
        Celebrating the achievements of our Aviation Club members.
      </p>

      <div className="results-container">
        {results.map((result) => (
          <div className="result-card" key={result.id}>
            <span className="result-year">{result.year}</span>

            <h3>{result.event}</h3>

            <h4>{result.position}</h4>

            <p className="result-team">{result.team}</p>

            <p className="result-description">
              {result.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Results;
