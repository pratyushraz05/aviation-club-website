import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Importing the team's pages
import Home from './pages/Home/Home'
import Events from './pages/Events/Events'
import Projects from './pages/Projects/Projects'
import Team from './pages/Team/Team'

function App() {
  return (
    <div>
      <h1>Aviation Club</h1>
      
      {/* Temporary Navigation Menu to test the routing */}
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
        <Link to="/events" style={{ marginRight: '15px' }}>Events</Link>
        <Link to="/projects" style={{ marginRight: '15px' }}>Projects</Link>
        <Link to="/team">Team</Link>
      </nav>

      {/* The Routes: Swaps out components based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </div>
  )
}

export default App