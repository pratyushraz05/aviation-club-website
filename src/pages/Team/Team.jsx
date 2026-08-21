import "./Team.css";
import naiduImg from "../../assets/naidu.jpg";
const faculty = [
  {
    name: "Dr. N.V. Swamy Naidu",
    role: "Faculty In-Charge",
    image: naiduImg,
  },
];
const mentor = [
  {
    name:"Honumant Nethani",
    role:"Mentor",
    image: "/team/Honumant.jpg",
  }
]
const coreTeam = [
  {
    name: "Sivaratri Lakshmi Sahithi",
    role: "Core Team",
   // image: "/team/sahithi.jpg",
  },
  {
    name: "Kritika Tripathi",
    role: "Core Team",
   // image: "/team/kritika-tripathi.jpg",
  },
];

const technicalTeam = [
  {
    name: "RAGHAVA",
    branch: "IT",
    role: "Technical Team",
    image: "/team/raghava.jpg",
  },
  {
    name: "PRATYUSH RAJ",
    branch: "CSE",
    role: "Technical Team",
    image: "/team/pratyush.jpg",
  },
  {
    name: "PRAVALIKA",
    branch: "IT",
    role: "Technical Team",
    image: "/team/pravalika.jpg",
  },
  {
    name: "PREMANVITHA",
    branch: "CSE",
    role: "Technical Team",
    image: "/team/premanvitha.jpg",
  },
  {
    name: "AMRUTHA",
    branch: "CSE",
    role: "Technical Team",
    image: "/team/amrutha.jpg",
  },
  {
    name: "VAISHNAVI",
    branch: "CSE",
    role: "Technical Team",
    image: "/team/vaishnavi.jpg",
  },
];

const nonTechnicalTeam = [
  {
    name: "Subhash Kumar Saho",
    branch: "MECHANICAL",
    role: "Non-Technical Team",
    image: "/team/subhash.jpg",
  },
  {
    name: "Ashwajit Dalal",
    branch: "MECHANICAL",
    role: "Non-Technical Team",
    image: "/team/ashwajit.jpg",
  },
  {
    name: "Kritika Misti",
    branch: "MECHANICAL",
    role: "Non-Technical Team",
    image: "/team/kritika-misti.jpg",
  },
  {
    name: "Shivesh Vikrant S",
    branch: "MECHANICAL",
    role: "Non-Technical Team",
    image: "/team/shivanshi.jpg",
  },
  {
    name: "Joshnavi",
    branch: "MECHANICAL",
    role: "Non-Technical Team",
    image: "/team/joshnavi.jpg",
  },

  {
    name: "Aman",
    branch: "MECHANICAL",
    role: "Non-Technical Team",
    image: "/team/aman.jpg",
  },
  {
    name: "Rasazna",
    branch: "MECHANICAL",
    role: "Non-Technical Team",
    image: "/team/Rasazna.jpg",
  },
  {
    name: "Pranav",
    branch: "MECHANICAL",
    role: "Non-Technical Team",
    image: "/team/pranav.jpg",
  },
  {
    name: "V Sai Akhil",
    branch: "MECHANICAL",
    role: "Non-Technical Team",
    image: "/team/abhijeet.jpg",
  },
  {
    name: "Jasmitha Abhi",
    branch: "ECE",
    role: "Non-Technical Team",
    image: "/team/jamniti-abhi.jpg",
  },
  {
    name: "Vijay Karan",
    branch: "MECHANICAL",
    role: "Non-Technical Team",
    image: "/team/vijay.jpg",
  },
];
function MemberCard({ member, featured = false, noPhoto = false }) {
  return (
    <div className={`member-card ${featured ? "featured" : ""} ${noPhoto ? "no-photo" : ""}`}>
      {!noPhoto && (
        <div className="member-image">
          <img src={member.image} alt={member.name} />
        </div>
      )}

      <div className="member-info">
        <h3>{member.name}</h3>

        {!noPhoto && <p>{member.role}</p>}

        {member.branch && (
          <span className="branch">
            BRANCH: <b>{member.branch}</b>
          </span>
        )}
      </div>
    </div>
  );
}

function TeamSection({ title, members, featured = false }) {
  const gridClass = featured
    ? "faculty-grid"
    : title === "Core Team"
    ? "mentor-grid"
    : title === "Core Team"
    ? "core-grid"
    : title === "Non-Technical Team"
    ? "non-technical-grid"
    : "";

  return (
    <section className="team-section">
      <div className="section-title">
        <h2>{title}</h2>
        <span />
      </div>

      <div className={`members-grid ${gridClass}`}>
        {members.map((member) => (
          <MemberCard
            key={member.name}
            member={member}
            featured={featured}
            Photo={title === "Non-Technical Team"}
          />
        ))}
      </div>
    </section>
  );
}

export default function Team() {
  return (
    <main className="team-page">
      <header className="team-header">
        <span>AVIATION CLUB • NIT RAIPUR</span>

        <h1>
          Our <strong>Team</strong>
        </h1>

        <div className="team-line" />

        <p>
          Meet the people behind the ideas, projects and activities
          <br />
          that drive the Aviation Club forward.
        </p>
      </header>

      <TeamSection
        title="Faculty"
        members={faculty}
        featured
      />

      <TeamSection
        title="Mentor"
        members={mentor}
      />

      <TeamSection
        title="Core Team"
        members={coreTeam}
      />

      <TeamSection
        title="Technical Team"
        members={technicalTeam}
      />

      <TeamSection
        title="Non-Technical Team"
        members={nonTechnicalTeam}
      />
    </main>
  );
}