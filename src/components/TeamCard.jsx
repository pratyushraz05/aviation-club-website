

function TeamCard({ title, members }) {
  return (
    <div className="team-section">

      <h2>{title}</h2>

      <div className="team-grid">

        {members.map((member) => (
          <div className="team-card" key={member.id}>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            <p>{member.year}</p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default TeamCard;