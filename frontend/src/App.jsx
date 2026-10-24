import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './Layout/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Public pages
import Home from './pages/Home/Home';
import Events from './pages/Events/Events';
import Projects from './pages/Projects/Projects';
import ProjectDetails from './pages/Projects/ProjectDetails';
import Team from './pages/Team/Team';
import Gallery from './pages/Gallery/Gallery';
import Contact from './pages/Contact/Contact';
import Results from './pages/Results/Results';

// Auth & Access-Controlled pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MemberPortal from './pages/Portal/MemberPortal';
import HeadConsole from './pages/Admin/HeadConsole';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/team" element={<Team />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/results" element={<Results />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Member & User Portal - accessible to all authenticated users */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute allowedRoles={['user', 'member', 'head', 'admin']}>
                <MemberPortal />
              </ProtectedRoute>
            }
          />

          {/* Head Management Console - accessible to Heads and Admins only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['head', 'admin']}>
                <HeadConsole />
              </ProtectedRoute>
            }
          />
        </Routes>

        <button
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
        >
          ↑
        </button>
      </Layout>
    </AuthProvider>
  );
}

export default App;
