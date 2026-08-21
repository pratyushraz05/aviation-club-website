import { Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './Layout/Layout'; 
import ProjectDetails from './pages/Projects/ProjectDetails';

// Importing the team's pages
import Home from './pages/Home/Home';
import Events from './pages/Events/Events';
import Projects from './pages/Projects/Projects';
import Team from './pages/Team/Team';
import Gallery from './pages/Gallery/Gallery'; 
import Contact from "./pages/Contact/Contact";

function App() {
  return (
    // The Layout automatically adds the Navbar at the top and Footer at the bottom
    <Layout>
      {/* The Routes swap out the middle section based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/team" element={<Team />} />
        <Route path="/gallery" element={<Gallery />} /> 
        <Route path="/contact" element={<Contact />}/>
      </Routes>
    </Layout>
  );
}

export default App;
