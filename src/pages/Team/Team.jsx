import TeamCard from "../../components/TeamCard";
import './Team.css';
import naiduImg from"../../assets/naidu.jpg";

function Team() {
  const faculty = [
    {
      id: 1,
      name: "Dr. N.V. Swamy Naidu",
      role: "Faculty In-Charge",
      image: naiduImg
    }
  ];

  const coreTeam = [
    {
      id: 1,
      name: "Sivaratri Lakshmi Sahithi",
      role: "President",
      year: "4th Year"
    },
    {
      id: 2,
      name: "Kritika Tripathi",
      role: "President",
      year: "4rd Year"
    }
  ];

  const technicalTeam = [
    {
      id: 1,
      name: "Ashwajit Dalal",
      role: "Mechanical",
      year: "3rd Year"
    },
    {
      id: 2,
      name: "Subash Kumar Saho",
      role: "Mechanical",
      year: "3rd Year"
    },
    {
      id: 3,
      name: "Kritika Misti",
      role: "Mechanical",
      year: "3rd Year"
    },
    {
      id: 4,
      name: "Shivesh",
      role: "Mechanical",
      year: "2nd Year"
    },
    {
      id: 5,
      name: "Joshanavi",
      role: "Mechanical",
      year: "2nd Year"
    },
    {
      id: 6,
      name: "Aman",
      role: "Mechanical",
      year: "2nd Year"
    },
    {
      id: 7,
      name: "Rasazna",
      role: "Mechanical",
      year: "2nd Year"
    },
    {
      id: 8,
      name: "Pranav",
      role: "Mechanical",
      year: "2nd Year"
    },
    {
      id: 9,
      name: "Abhijeet",
      role: "Mechanical",
      year: "2nd Year"
    },
    {
      id: 10,
      name: "Awishra",
      role: "ECE",
      year: "3rd Year"
    },
    {
      id: 11,
      name: "Vijay",
      role: "ECE",
      year: "3rd Year"
    },
    {
      id: 12,
      name: "Vimal",
      role: "ECE",
      year: "2nd Year"
    },
    {
      id: 13,
      name: "Jasmita Abhi",
      role: "ECE",
      year: "2nd Year"
    },
    {
      id: 14,
      name: "Pratyush Raj",
      role: "CSE",
      year: "2nd Year"
    },
    {
      id: 15,
      name: "Amruta Sri",
      role: "CSE",
      year: "2nd Year"
    },
    {
      id: 16,
      name: "Sai Premanvitha",
      role: "CSE",
      year: "2nd Year"
    },
    {
      id: 17,
      name: "Vaishnavi",
      role: "CSE",
      year: "2nd Year"
    },
    {
      id: 18,
      name: "Pravallika",
      role: "IT",
      year: "2nd Year"
    },
    {
      id: 19,
      name: "Raghava",
      role: "IT",
      year: "2nd Year"
    }
  ];

  return (
    
    <div className="team-page">
      <h1>Our Team</h1>
      
      <TeamCard title="Faculty" members={faculty} />
      <TeamCard title="Core Team" members={coreTeam} />
      <TeamCard title="Technical Team" members={technicalTeam} />
    </div>
  );
}

export default Team;